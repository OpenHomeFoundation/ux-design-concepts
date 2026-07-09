/* Changes tray — community-edit increment "changes-tray" (Stage 3, "B").

   A tray in the top bar, beside the notifications inbox, that gathers a
   contributor's unsubmitted DRAFTS across every device into one place. From
   here they can jump back into any device, discard a device's draft, or
   submit everything at once.

   Submitting from the tray fans out one device at a time: each drafted device
   becomes its own pending edit and opens its own pull request (openPullRequest
   in notifications.jsx). One device = one PR holds, exactly as in the
   per-device submit flow. The tray just batches the gesture.

   It also shows, read-only, what the contributor already has in review, so
   "your changes" is the single answer to "what have I got in flight?".

   Surfaces mirror the inbox: an anchored popover on desktop, a full-screen
   sheet on mobile/tablet (≤1023px). It reuses the inbox's panel/button
   classes for visual parity, with ce-tray-* classes for the row + footer.

   Gated by [data-inc-target="changes-tray"] on the nav wrapper, and returns
   null when signed out (drafts still work per-device for guests; the tray is
   the signed-in aggregate view, like the inbox). */

// Device thumbnail for a tray row: first product photo, else placeholder, else
// the category glyph. Mirrors the inbox thumb treatment.
function TrayThumb({ device }) {
  const photos = (device && device.photos) || [];
  const first = photos.length ? photos[0] : null;
  const isUrl = typeof first === 'string' && !first.startsWith('placeholder:');
  return (
    <span className={'ce-inbox-thumb' + (first && isUrl ? ' has-photo' : '')} aria-hidden="true">
      {first && isUrl ?
        <img src={first} alt="" loading="lazy" /> :
      first && window.PhotoPlaceholder ?
        <window.PhotoPlaceholder id={first + ':' + device.id + ':0'} category={device.category} alt="" /> :
      window.CategoryGlyph ?
        <window.CategoryGlyph category={device.category} size={22} /> : null}
    </span>);
}

function ChangesTray() {
  const user = (window.useCurrentUser && window.useCurrentUser()) || null;
  window.useDrafts && window.useDrafts();           // re-render when drafts change
  window.usePending && window.usePending('__tray__'); // re-render when pending changes

  const [open, setOpen] = React.useState(false);
  const [fs, setFs] = React.useState(false);
  const [view, setView] = React.useState('list');   // 'list' | 'confirm'
  const [comment, setComment] = React.useState('');
  const [flash, setFlash] = React.useState(null);    // { devices, changes } after a submit
  const [discardId, setDiscardId] = React.useState(null);
  const wrapRef = React.useRef(null);

  const matchesFs = () =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches;
  const openTray = () => { setFs(matchesFs()); setView('list'); setOpen(true); };
  const close = () => { setOpen(false); setView('list'); };

  // Close on outside click (desktop popover only).
  React.useEffect(() => {
    if (!open || fs) return;
    const onDoc = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) close(); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open, fs]);

  // Close on Escape and on navigation.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    const onHash = () => close();
    window.addEventListener('keydown', onKey);
    window.addEventListener('hashchange', onHash);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('hashchange', onHash); };
  }, [open]);

  // Track the breakpoint while open so popover ↔ sheet swaps live.
  React.useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia('(max-width: 1023px)');
    const onChange = (e) => setFs(e.matches);
    mq.addEventListener ? mq.addEventListener('change', onChange) : mq.addListener(onChange);
    return () => { mq.removeEventListener ? mq.removeEventListener('change', onChange) : mq.removeListener(onChange); };
  }, [open]);

  // Lock body scroll while the mobile sheet is open.
  React.useEffect(() => {
    if (open && fs) {
      document.body.classList.add('ce-inbox-sheet-open');
      return () => document.body.classList.remove('ce-inbox-sheet-open');
    }
  }, [open, fs]);

  if (!user) return null;

  // ── Gather drafts + in-review, across every device ──
  const devices = (typeof window !== 'undefined' && window.DEVICES) || [];
  const draftsMap = window.allDrafts ? window.allDrafts() : {};
  const draftItems = Object.keys(draftsMap).map((id) => {
    const d = devices.find((x) => x.id === id);
    const fields = (draftsMap[id] && draftsMap[id].fields) || {};
    const keys = Object.keys(fields);
    if (!d || keys.length === 0) return null;
    return { device: d, deviceId: id, count: keys.length, at: draftsMap[id].at };
  }).filter(Boolean).sort((a, b) => new Date(b.at) - new Date(a.at));

  const reviewItems = devices.map((d) => {
    const p = window.getPending ? window.getPending(d.id) : {};
    const keys = Object.keys(p).filter((k) => { const by = p[k] && p[k].by; return !by || by === window.CURRENT_USER; });
    if (keys.length === 0) return null;
    const at = keys.map((k) => p[k].at).filter(Boolean).sort().reverse()[0];
    return { device: d, deviceId: d.id, count: keys.length, at };
  }).filter(Boolean).sort((a, b) => new Date(b.at) - new Date(a.at));

  const draftDevices = draftItems.length;
  const totalChanges = draftItems.reduce((n, it) => n + it.count, 0);
  const needsContact = window.hasNotificationMethod ? !window.hasNotificationMethod(user) : !(user.email || user.gh);

  const goDevice = (id) => { close(); window.location.hash = '#/device/' + id; };

  const submitAll = () => {
    const devicesCount = draftItems.length;
    const changesCount = totalChanges;
    draftItems.forEach((it) => {
      const entry = draftsMap[it.deviceId] || {};
      const fields = entry.fields || {};
      const sources = entry.sources || null;
      const entries = {};
      Object.keys(fields).forEach((k) => {
        entries[k] = { value: fields[k] };
        if (sources && sources[k]) entries[k].source = sources[k];
      });
      if (window.addPendingEdit) window.addPendingEdit(it.deviceId, entries);
      if (window.openPullRequest) window.openPullRequest(it.device);
      if (window.clearDraft) window.clearDraft(it.deviceId);
    });
    setComment('');
    setFlash({ devices: devicesCount, changes: changesCount });
    setView('list');
  };

  // ── Panel body ──
  const listBody = (
    <React.Fragment>
      {flash &&
        <div className="ce-tray-flash" role="status">
          <span className="ce-tray-flash-ico" aria-hidden="true"><Icon name="checkcircle" size={18} /></span>
          <div className="ce-tray-flash-text">
            <b>{flash.changes} edit{flash.changes === 1 ? '' : 's'} submitted across {flash.devices} device{flash.devices === 1 ? '' : 's'}.</b>
            <span>{flash.devices} pull request{flash.devices === 1 ? '' : 's'} opened. Follow each one from your inbox.</span>
          </div>
          <button type="button" className="ce-tray-flash-x" aria-label="Dismiss" onClick={() => setFlash(null)}>
            <Icon name="x" size={15} />
          </button>
        </div>}

      {draftDevices === 0 && reviewItems.length === 0 ?
        <div className="ce-inbox-empty">
          <Icon name="checkcircle" size={22} />
          <p>No edits in progress.</p>
        </div> :
        <div className="ce-tray-scroll">
          {draftDevices > 0 &&
            <div className="ce-tray-group">
              <div className="ce-tray-group-head">
                <span className="ce-tray-group-title">Drafts</span>
              </div>
              <ul className="ce-tray-list">
                {draftItems.map((it) =>
                  <li key={it.deviceId} className="ce-tray-row">
                    <button type="button" className="ce-tray-row-main" onClick={() => goDevice(it.deviceId)}>
                      <TrayThumb device={it.device} />
                      <span className="ce-tray-row-body">
                        <span className="ce-tray-row-name">{it.device.name}</span>
                        <span className="ce-tray-row-meta">{it.count} edit{it.count === 1 ? '' : 's'} · {it.device.manufacturer}</span>
                      </span>
                    </button>
                    <span className="ce-tray-row-actions">
                      <button type="button" className="ce-tray-rowbtn ce-tray-rowbtn-danger" aria-label={'Discard draft for ' + it.device.name} onClick={() => setDiscardId(it.deviceId)}>
                        <Icon name="trash" size={14} />
                      </button>
                    </span>
                  </li>)}
              </ul>
            </div>}

          {reviewItems.length > 0 &&
            <div className="ce-tray-group">
              <div className="ce-tray-group-head">
                <span className="ce-tray-group-title">Awaiting review</span>
              </div>
              <ul className="ce-tray-list">
                {reviewItems.map((it) =>
                  <li key={it.deviceId} className="ce-tray-row ce-tray-row-review">
                    <button type="button" className="ce-tray-row-main" onClick={() => goDevice(it.deviceId)}>
                      <TrayThumb device={it.device} />
                      <span className="ce-tray-row-body">
                        <span className="ce-tray-row-name">{it.device.name}</span>
                        <span className="ce-tray-row-meta">{it.count} edit{it.count === 1 ? '' : 's'} awaiting review</span>
                      </span>
                    </button>
                  </li>)}
              </ul>
            </div>}
        </div>}

      {draftDevices > 0 &&
        <div className="ce-tray-foot">
          <button type="button" className="btn btn-primary ce-tray-submit" onClick={() => { setFlash(null); setView('confirm'); }}>
            Submit all
          </button>
        </div>}
    </React.Fragment>);

  const confirmBody = (
    <React.Fragment>
      <div className="ce-tray-confirm">
        <p className="ce-tray-confirm-lede">
          Submitting <b>{totalChanges} edit{totalChanges === 1 ? '' : 's'}</b> across <b>{draftDevices} device{draftDevices === 1 ? '' : 's'}</b>. This opens <b>{draftDevices} pull request{draftDevices === 1 ? '' : 's'}</b>, one per device, reviewed on GitHub before going live.
        </p>

        <ul className="ce-tray-confirm-list">
          {draftItems.map((it) =>
            <li key={it.deviceId} className="ce-tray-confirm-item">
              <TrayThumb device={it.device} />
              <span className="ce-tray-confirm-body">
                <span className="ce-tray-row-name">{it.device.name}</span>
                <span className="ce-tray-row-meta">{it.count} edit{it.count === 1 ? '' : 's'}</span>
              </span>
              <span className="ce-tray-confirm-pr">1 PR</span>
            </li>)}
        </ul>

        {needsContact &&
          <div className="ce-notify-warning" role="note">
            <Icon name="info" size={16} />
            <div>
              <b>No notification method set up.</b> Add a GitHub account or an email so we can tell you when these are reviewed.{' '}
              <a href="#/settings/notifications" onClick={close}>Set one up</a>.
            </div>
          </div>}

        <label className="ce-field ce-tray-comment" htmlFor="ce-tray-comment">
          <span className="ce-field-label">Comment</span>
          <textarea id="ce-tray-comment" className="ce-textarea" rows={3}
            placeholder="What did you change and why? Added to every pull request."
            value={comment} onChange={(e) => setComment(e.target.value)} />
        </label>
      </div>
      <div className="ce-tray-foot ce-tray-foot-confirm">
        <button type="button" className="btn btn-ghost" onClick={() => setView('list')}>Back</button>
        <button type="button" className="btn btn-primary" onClick={submitAll}>
          Submit for review
        </button>
      </div>
    </React.Fragment>);

  const title = view === 'confirm' ? 'Submit your edits' : 'Your edits';
  const body = view === 'confirm' ? confirmBody : listBody;

  const button = (
    <button
      type="button"
      className={'ce-inbox-btn' + (open ? ' is-open' : '')}
      aria-label={draftDevices ? `Your edits, ${draftDevices} device${draftDevices === 1 ? '' : 's'} with drafts` : 'Your edits'}
      aria-haspopup="true"
      aria-expanded={open}
      onClick={() => (open ? close() : openTray())}>
      <Icon name="edit" size={19} />
      {draftDevices > 0 && <span className="ce-inbox-badge" aria-hidden="true">{draftDevices > 9 ? '9+' : draftDevices}</span>}
    </button>);

  return (
    <span className="ce-inbox ce-tray" data-inc-target="changes-tray" ref={wrapRef}>
      {button}

      {/* Desktop: anchored popover */}
      {open && !fs &&
        <div className="ce-inbox-pop ce-tray-pop" role="dialog" aria-label={title}>
          <div className="ce-inbox-head">
            <span className="ce-inbox-title">{title}</span>
          </div>
          {body}
        </div>}

      {/* Mobile / tablet: full-screen sheet */}
      {open && fs && ReactDOM.createPortal(
        <div className="ce-inbox-fs ce-tray-fs" role="dialog" aria-label={title}>
          <div className="ce-inbox-fs-bar">
            <button type="button" className="ce-inbox-fs-back" aria-label={view === 'confirm' ? 'Back' : 'Close'} onClick={() => (view === 'confirm' ? setView('list') : close())}>
              <Icon name="arrowL" size={20} />
            </button>
            <span className="ce-inbox-fs-title">{title}</span>
            <span className="ce-inbox-fs-spacer" />
          </div>
          <div className="ce-inbox-fs-body ce-tray-fs-body">{body}</div>
        </div>,
        document.body)}

      {window.ConfirmDialog &&
        <window.ConfirmDialog
          open={!!discardId}
          title="Discard this draft?"
          message="Your unsubmitted edits to this device will be lost. This can’t be undone."
          confirmLabel="Discard draft"
          cancelLabel="Keep draft"
          danger
          onConfirm={() => { if (window.clearDraft) window.clearDraft(discardId); setDiscardId(null); }}
          onCancel={() => setDiscardId(null)} />}
    </span>);
}

Object.assign(window, { ChangesTray });
