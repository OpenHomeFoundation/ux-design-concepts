/* "Your changes" — the private dashboard, as a sortable table.

   A single private surface that merges what used to be three separate
   surfaces: the notifications inbox, the changes tray, and the private
   (self) view of the contributor profile. It answers one question:
   "what have I got in flight, and what happened to it?"

   Layout is an inbox: a left folder rail with Drafts at the top (it is where
   you act), then a hairline, then the submitted lifecycle states
   All / Awaiting approval / Live / Declined, each with a count (the All folder
   is labelled "Submitted"). Drafts are unsubmitted and account-only, a
   different class from the GitHub-tracked states, so Submitted does not include
   them. The page opens on Drafts when you have any, otherwise on Submitted. On
   tablet the rail collapses to a horizontal tab strip, and on mobile the table
   becomes cards.

   Lifecycle states:
     · Draft        unsubmitted, saved to your account. Continue or discard.
     · Pending      submitted, a pull request is open. Links to the PR.
     · Live         merged and public. Links to the device page.
     · Declined     not accepted. Can be revised (reopened on the device).

   "Submit all" batches every draft: one pull request per device.

   Gated by the your-changes increment. Returns a sign-in prompt when signed
   out. */

const YC_PR_BASE = 'https://github.com/OpenHomeFoundation/device-database/pull/';

// Lifecycle presentation. `order` drives the Status sort.
const YC_STATES = {
  draft:    { label: 'Draft',            badgeClass: 'yc-badge-draft',    order: 0 },
  pending:  { label: 'Awaiting approval', badgeClass: 'yc-badge-pending',  order: 1 },
  declined: { label: 'Declined',         badgeClass: 'yc-badge-declined', order: 2 },
  live:     { label: 'Live',             badgeClass: 'yc-badge-live',     order: 3 },
};

// PR comment lookup (the GitHub-API seam, seeded in data.js).
function ycPrMeta(pr) {
  return (pr && window.PR_COMMENTS && window.PR_COMMENTS[pr]) || null;
}

// Whole-row click. A draft opens straight into edit mode (no PR exists yet);
// a submitted change (pending / live / declined) opens its review process —
// the pull request — since that's where the change and its status live, and
// the device read page wouldn't show an in-flight or declined edit anyway.
// Ignores clicks on inner links/buttons and leaves a text selection alone.
function ycRowClick(item) {
  return (e) => {
    if (e.target.closest('a, button')) return;
    if (window.getSelection && String(window.getSelection())) return;
    if (item.kind === 'draft') {
      window.__ceEditIntent = item.deviceId;
      window.location.hash = '#/device/' + item.deviceId;
      return;
    }
    if (item.pr) { window.open(YC_PR_BASE + item.pr, '_blank', 'noopener'); return; }
    window.location.hash = '#/device/' + item.deviceId;
  };
}

// Build rich change lines (field + verb + before→after where the value is a
// short scalar) from a map of { fieldKey: newValue }. Reuses describeChanges,
// the exact diff logic the live submit flow uses, so a draft or pending edit
// shows the same detail it will once it's live. Complex values (objects,
// arrays, long text) render as a plain "Updated <field>" line, same as
// everywhere else in the app.
function ycRichChanges(device, valueMap) {
  if (!device || !valueMap) return [];
  const keys = Object.keys(valueMap);
  if (!keys.length) return [];
  if (!window.describeChanges || !window.setField) {
    return keys.map((k) => ({ field: k, verb: 'edited' }));
  }
  let after = { ...device };
  keys.forEach((k) => { after = window.setField(after, k, valueMap[k]); });
  return window.describeChanges(device, after, keys);
}

// ── Device thumbnail used in the table + cards. Mirrors the Browse card /
//    contribution-row tile exactly: flush category glyph by default, and a
//    white-filled rounded box (no hairline) once there's a real photo. ──
function YctThumb({ device, size = 40 }) {
  const Glyph = window.CategoryGlyph;
  const photos = (device && device.photos) || [];
  const first = photos.length ? photos[0] : null;
  const isUrl = typeof first === 'string' && !first.startsWith('placeholder:');
  return (
    <span className={'yct-thumb' + (first && isUrl ? ' has-photo' : '')} aria-hidden="true">
      {first && isUrl ?
        <img src={first} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} /> :
      first && window.PhotoPlaceholder ?
        <window.PhotoPlaceholder id={first + ':' + device.id + ':0'} category={device.category} alt="" /> :
      Glyph ? <Glyph category={device.category} size={size === 40 ? 24 : size - 12} /> : null}
    </span>);
}

// Compact thumbnail used inside the submit-all modal list (kept from the
// previous tray design).
function YcTile({ device }) {
  const Glyph = window.CategoryGlyph;
  const photos = (device && device.photos) || [];
  const first = photos.length ? photos[0] : null;
  const isUrl = typeof first === 'string' && !first.startsWith('placeholder:');
  return (
    <span className={'ce-contrib-tile' + (first && isUrl ? ' has-photo' : '')} aria-hidden="true">
      {first && isUrl ?
        <img src={first} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} /> :
      Glyph ? <Glyph category={device.category} size={22} /> : null}
    </span>);
}

function YcStatusBadge({ kind }) {
  const st = YC_STATES[kind];
  return (
    <span className={'yc-badge ' + st.badgeClass}>
      <span className="yc-badge-dot" aria-hidden="true" />{st.label}
    </span>);
}

// The "Change" cell: the same detailed change list the contributor profile
// shows — a line per field (verb + noun, with a before→after chip where the
// value is a short scalar), plus the human summary on a live edit. Capped so
// a big edit doesn't blow out the row.
function YcChangeSummary({ item }) {
  const list = item.changes || [];
  const Line = window.EditChangeLine;
  if (!list.length) {
    return item.summary
      ? <span className="yct-change-summary">{item.summary}</span>
      : <span className="yct-muted">-</span>;
  }
  const MAX = 3;
  const shown = list.slice(0, MAX);
  const extra = list.length - shown.length;
  return (
    <div className="yct-change">
      {item.summary ? <span className="yct-change-summary">{item.summary}</span> : null}
      {Line ?
        <ul className="ce-change-list yct-change-list">
          {shown.map((c, i) => <Line key={i} change={c} />)}
          {extra > 0 ? <li className="yct-change-more">+{extra} more field{extra === 1 ? '' : 's'}</li> : null}
        </ul> : null}
    </div>);
}

// The review meta line (sits under the last-activity time): the PR number and
// the comment count, as plain text in one matching muted style. No links here —
// the time above is the click target. The PR icon is dropped; the comment
// keeps its bubble glyph.
function YcReviewCell({ item }) {
  if (!item.comments || item.comments <= 0) return null;
  return (
    <span className="yct-review">
      <span className="yct-comments"
        title={item.comments + ' comment' + (item.comments === 1 ? '' : 's') + ' on the review'}>
        <Icon name="comment" size={12} />{item.comments}
      </span>
    </span>);
}

// Last-activity cell: the relative time only. The comment count now lives in
// the actions cell, just left of the ↗ open-on-GitHub icon, so the review meta
// sits next to the link it relates to. The whole row still opens the PR.
function YcUpdated({ item }) {
  const rel = window.relTime ? window.relTime(item.at) : item.at;
  const full = window.formatDateTime ? window.formatDateTime(item.at) : item.at;
  return <time dateTime={item.at} title={full}>{rel}</time>;
}

// Action per state. Drafts get a single borderless discard (trash) icon — the
// row itself opens the editor, so there's no separate Continue button.
// Submitted changes (pending / live / declined) live on GitHub as a pull
// request: they show the comment count (when `showComments`) followed by an
// external-link glyph, so it's clear — before the click — that opening the row
// leaves the site for GitHub rather than opening the in-app editor the way a
// draft does. `showComments` is set on the desktop table only; the mobile card
// shows the comment count on its own meta line, so it stays off there.
function YcActionCell({ item, onDiscard, showComments }) {
  if (item.kind === 'draft') {
    return (
      <div className="yct-actions">
        <button type="button" className="yct-discard" aria-label="Discard draft"
          onClick={(e) => { e.stopPropagation(); onDiscard(item.deviceId); }}>
          <Icon name="trash" size={15} />
        </button>
      </div>);
  }
  const comments = showComments ? <YcReviewCell item={item} /> : null;
  if (item.pr) {
    return (
      <div className="yct-actions">
        {comments}
        <a className="yct-open-pr" href={YC_PR_BASE + item.pr} target="_blank" rel="noopener"
          title="Opens the review on GitHub" aria-label="Open the review on GitHub"
          onClick={(e) => e.stopPropagation()}>
          <Icon name="open" size={15} />
        </a>
      </div>);
  }
  return comments ? <div className="yct-actions">{comments}</div> : null;
}

// Sortable column header.
function YcTh({ id, label, sort, setSort }) {
  const active = sort.key === id;
  const onClick = () => setSort(active
    ? { key: id, dir: sort.dir === 'asc' ? 'desc' : 'asc' }
    : { key: id, dir: id === 'updated' ? 'desc' : 'asc' });
  return (
    <th className={'yct-th' + (active ? ' is-sorted' : '')}
      aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
      <button type="button" className="yct-th-btn" onClick={onClick}>
        {label}
        <span className={'yct-caret' + (active ? ' is-on' : '') + (active && sort.dir === 'asc' ? ' is-asc' : '')} aria-hidden="true"></span>
      </button>
    </th>);
}

// ── Submit-all dialog. Centred modal on desktop, slide-up bottom sheet on
// mobile/tablet — mirrors SubmitDialog / ChangesDialog so review surfaces feel
// alike. ──
function YcSubmitModal({ drafts, totalChanges, onClose, onSubmit }) {
  const [comment, setComment] = React.useState('');
  const user = (window.useCurrentUser && window.useCurrentUser()) || null;
  const needsContact = window.hasNotificationMethod ? !window.hasNotificationMethod(user) : !(user && (user.email || user.gh));

  const [isSheet, setIsSheet] = React.useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches
  );
  React.useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const onChange = (e) => setIsSheet(e.matches);
    mq.addEventListener ? mq.addEventListener('change', onChange) : mq.addListener(onChange);
    return () => {
      mq.removeEventListener ? mq.removeEventListener('change', onChange) : mq.removeListener(onChange);
    };
  }, []);

  const panelRef = React.useRef(null);
  const [closing, setClosing] = React.useState(false);
  const [dragY, setDragY] = React.useState(0);
  const closeAnimated = React.useCallback(() => {
    if (!isSheet) { onClose(); return; }
    const h = panelRef.current?.offsetHeight ?? 600;
    setClosing(true);
    setDragY(h);
    setTimeout(onClose, 200);
  }, [isSheet, onClose]);

  React.useEffect(() => {
    document.body.classList.add('modal-open');
    const onKey = (e) => { if (e.key === 'Escape') closeAnimated(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('modal-open');
      document.removeEventListener('keydown', onKey);
    };
  }, [closeAnimated]);

  const n = drafts.length;
  const title = 'Submit your edits';

  const body = (
    <React.Fragment>
      <ul className="ce-tray-confirm-list">
        {drafts.map((it) =>
          <li key={it.deviceId} className="ce-tray-confirm-item">
            <YcTile device={it.device} />
            <span className="ce-tray-confirm-body">
              <span className="ce-contrib-name">{it.device.name}</span>
              <span className="ce-contrib-mfr">{it.changes.length} edit{it.changes.length === 1 ? '' : 's'}</span>
            </span>
          </li>)}
      </ul>

      {needsContact &&
        <div className="ce-notify-warning" role="note">
          <Icon name="info" size={16} />
          <div>
            <b>No notification method set up.</b> Add a GitHub account or an email so we can tell you when these are reviewed.{' '}
            <a href="#/settings/notifications" onClick={onClose}>Set one up</a>.
          </div>
        </div>}

      <label className="ce-field ce-tray-comment" htmlFor="yc-submit-comment">
        <span className="ce-field-label">Comment</span>
        <textarea id="yc-submit-comment" className="ce-textarea" rows={3}
          placeholder="What did you change and why? Added to every review."
          value={comment} onChange={(e) => setComment(e.target.value)} />
      </label>
      <p className="ce-auth-foot ce-submit-auth-foot">Each device is sent for review on GitHub before going live.</p>
    </React.Fragment>);

  if (isSheet) {
    return ReactDOM.createPortal(
      <div className={'sheet-backdrop' + (closing ? ' is-closing' : '')}
        onClick={closeAnimated} role="presentation">
        <div className="sheet-panel yc-submit-sheet"
          ref={panelRef}
          role="dialog" aria-modal="true" aria-labelledby="yc-submit-title"
          onClick={(e) => e.stopPropagation()}
          style={{
            transform: dragY ? `translateY(${dragY}px)` : undefined,
            transition: 'transform 200ms cubic-bezier(.2,.0,.2,1)'
          }}>
          <header className="sheet-head">
            <div className="sheet-head-row">
              <button type="button" className="sheet-back" onClick={closeAnimated} aria-label="Cancel">
                <Icon name="x" size={18} />
              </button>
              <h2 id="yc-submit-title" className="sheet-title">{title}</h2>
            </div>
          </header>
          <div className="sheet-body">
            <div className="ce-publish-sheet-pad">{body}</div>
          </div>
          <footer className="sheet-foot">
            <div className="ce-confirm-actions ce-confirm-actions-sheet">
              <button type="button" className="btn btn-primary" onClick={onSubmit}>Submit for review</button>
              <button type="button" className="btn btn-ghost" onClick={closeAnimated}>Cancel</button>
            </div>
          </footer>
        </div>
      </div>,
      document.body);
  }

  return ReactDOM.createPortal(
    <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-dialog ce-publish-dialog yc-submit-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog" aria-modal="true" aria-labelledby="yc-submit-title">
        <header className="modal-head">
          <div className="modal-head-row">
            <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
              <Icon name="x" size={18} />
            </button>
            <h2 id="yc-submit-title">{title}</h2>
          </div>
        </header>
        <div className="modal-body">{body}</div>
        <footer className="modal-foot">
          <div className="ce-confirm-actions ce-confirm-actions-left">
            <button type="button" className="btn btn-primary" onClick={onSubmit}>Submit for review</button>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          </div>
        </footer>
      </div>
    </div>,
    document.body);
}

// ── The page. ──
function YourChanges() {
  const user = (window.useCurrentUser && window.useCurrentUser()) || null;
  window.useDrafts && window.useDrafts();              // re-render on draft change
  window.usePending && window.usePending('__you__');   // re-render on pending change
  window.useNotifs && window.useNotifs();              // re-render on notif change

  // Open on Drafts when there are any (that's where you act), otherwise on All.
  const [tab, setTab] = React.useState(() =>
    (window.draftDeviceCount && window.draftDeviceCount() > 0) ? 'draft' : 'all'); // draft|all|pending|live|declined
  const [sort, setSort] = React.useState({ key: 'updated', dir: 'desc' });
  const [query, setQuery] = React.useState('');
  const [discardId, setDiscardId] = React.useState(null);
  const [submitOpen, setSubmitOpen] = React.useState(false);
  const [flash, setFlash] = React.useState(null);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const searchRef = React.useRef(null);

  // Sliding accent rail for the folder list (desktop), mirroring the Settings
  // rail: a 2px line resting on the active folder, animating to the hovered one.
  const railListRef = React.useRef(null);
  const folderRefs = React.useRef([]);
  const rootRef = React.useRef(null);
  // Pin the folder rail just below the sticky top nav. The nav's height differs
  // by breakpoint (one row on desktop, two on tablet), so measure it into a CSS
  // var the rail's sticky `top` reads from.
  React.useEffect(() => {
    const setNavH = () => {
      const nav = document.querySelector('.appnav');
      const h = nav ? Math.round(nav.getBoundingClientRect().height) : 72;
      if (rootRef.current) rootRef.current.style.setProperty('--yct-nav-h', h + 'px');
    };
    setNavH();
    window.addEventListener('resize', setNavH);
    return () => window.removeEventListener('resize', setNavH);
  }, []);
  const [navHover, setNavHover] = React.useState(null);
  const [rail, setRail] = React.useState({ y: 0, h: 0, ready: false });
  const [railAnimate, setRailAnimate] = React.useState(false);
  const RAIL_ORDER = ['draft', 'all', 'pending', 'live', 'declined'];
  const activeIdx = Math.max(0, RAIL_ORDER.indexOf(tab));
  const measureRail = React.useCallback(() => {
    const idx = navHover != null ? navHover : activeIdx;
    const el = folderRefs.current[idx];
    if (el) setRail({ y: el.offsetTop, h: el.offsetHeight, ready: true });
  }, [navHover, activeIdx]);
  React.useLayoutEffect(() => { measureRail(); }, [measureRail]);
  React.useEffect(() => { const id = requestAnimationFrame(() => setRailAnimate(true)); return () => cancelAnimationFrame(id); }, []);
  React.useEffect(() => { window.addEventListener('resize', measureRail); return () => window.removeEventListener('resize', measureRail); }, [measureRail]);
  React.useEffect(() => { if (searchOpen && searchRef.current) searchRef.current.focus(); }, [searchOpen]);

  if (!user) {
    return (
      <div className="container" style={{ padding: '80px 16px', textAlign: 'center' }} data-screen-label="Your edits (signed out)">
        <h1 style={{ marginBottom: 12 }}>You're signed out.</h1>
        <p className="muted">Sign in to see the edits you have in flight.</p>
        <a className="btn btn-primary" href="#/signin">Sign in</a>
      </div>);
  }

  const handle = window.CURRENT_USER;

  // Attach PR comment metadata to any item that carries a PR.
  const withMeta = (it) => {
    const m = ycPrMeta(it.pr);
    return { ...it, comments: m ? m.count : 0, unanswered: !!(m && m.unanswered) };
  };

  // ── Gather the four states into one normalized feed. ──
  const drafts = (window.gatherDrafts && window.gatherDrafts()) || [];
  const draftsMap = (window.allDrafts && window.allDrafts()) || {};
  const draftItems = drafts.map((it) => {
    const rich = ycRichChanges(it.device, (draftsMap[it.deviceId] || {}).fields);
    return {
      key: 'draft-' + it.deviceId, kind: 'draft', deviceId: it.deviceId,
      device: it.device, at: it.at,
      changes: rich.length ? rich : it.changes, comments: 0, unanswered: false,
    };
  });

  const contrib = (window.gatherContributions && window.gatherContributions(handle)) || { live: [], pending: [] };
  const pendingItems = (contrib.pending || []).map((it) => {
    // Pull the submitted value for each field so the row can show before→after,
    // the same way a draft or a live edit does.
    const p = (window.getPending && window.getPending(it.deviceId)) || {};
    const vmap = {};
    (it.changes || []).forEach((c) => { if (p[c.field]) vmap[c.field] = p[c.field].value; });
    const rich = ycRichChanges(it.device, vmap);
    return withMeta({
      key: 'pending-' + it.deviceId, kind: 'pending', deviceId: it.deviceId,
      device: it.device, at: it.at, pr: it.pr,
      changes: rich.length ? rich : it.changes,
    });
  });
  const liveItems = (contrib.live || []).map((it, i) => withMeta({
    key: 'live-' + it.deviceId + '-' + i, kind: 'live', deviceId: it.deviceId,
    device: it.device, at: it.at, pr: it.pr, summary: it.summary, changes: it.changes,
  }));

  // Declined edits live only in the notification store (no live record).
  const devices = (typeof window !== 'undefined' && window.DEVICES) || [];
  const notifs = (window.loadNotifs && window.loadNotifs()) || [];
  const declinedItems = notifs.filter((n) => n.type === 'declined').map((n) => withMeta({
    key: 'declined-' + n.id, kind: 'declined', deviceId: n.deviceId,
    device: devices.find((x) => x.id === n.deviceId) || { id: n.deviceId, name: n.device, manufacturer: '', category: '' },
    at: n.ts, pr: n.pr, changes: n.changes || [],
  }));

  const all = [...draftItems, ...pendingItems, ...liveItems, ...declinedItems];

  const counts = {
    // All is every submitted edit; drafts are their own folder and never roll up
    // into All (they are unsubmitted and account-only).
    all: pendingItems.length + liveItems.length + declinedItems.length,
    draft: draftItems.length,
    pending: pendingItems.length,
    live: liveItems.length,
    declined: declinedItems.length,
  };
  const totalDraftChanges = draftItems.reduce((n, it) => n + it.changes.length, 0);

  // Filter by folder, then by the device/maker text query. All shows every
  // submitted edit but excludes drafts; the Drafts folder shows only drafts.
  let rows = all.slice();
  if (tab === 'all') rows = rows.filter((it) => it.kind !== 'draft');
  else rows = rows.filter((it) => it.kind === tab);
  const q = query.trim().toLowerCase();
  if (q) rows = rows.filter((it) => ((it.device.name || '') + ' ' + (it.device.manufacturer || '')).toLowerCase().includes(q));

  rows.sort((a, b) => {
    let cmp = 0;
    if (sort.key === 'updated') cmp = new Date(a.at) - new Date(b.at);
    else if (sort.key === 'device') cmp = (a.device.name || '').localeCompare(b.device.name || '');
    else if (sort.key === 'status') cmp = YC_STATES[a.kind].order - YC_STATES[b.kind].order;
    return sort.dir === 'asc' ? cmp : -cmp;
  });

  // Drafts first (where you act), then Submitted with its lifecycle states
  // nested underneath as indented sub-filters. Per-row status badges still
  // distinguish the states inside any view.
  const RAIL = [
    { id: 'draft', label: 'Drafts' },
    { id: 'all', label: 'Submitted', groupStart: true },
    { id: 'pending', label: 'Awaiting approval', sub: true },
    { id: 'live', label: 'Live', sub: true },
    { id: 'declined', label: 'Declined', sub: true },
  ];
  // Whether a state nested under Submitted is the active view, so the parent
  // "Submitted" can read as the current group even without the accent rail.
  const submittedSub = tab === 'pending' || tab === 'live' || tab === 'declined';
  const showFilter = all.length > 1;

  const doSubmitAll = () => {
    const draftsMap = (window.allDrafts && window.allDrafts()) || {};
    const devicesCount = draftItems.length;
    const changesCount = totalDraftChanges;
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
    setSubmitOpen(false);
    setTab('all');
    setFlash({ devices: devicesCount, changes: changesCount });
  };

  const rel = (iso) => (window.relTime ? window.relTime(iso) : iso);
  const full = (iso) => (window.formatDateTime ? window.formatDateTime(iso) : iso);

  const emptyCopy = {
    all: "You haven't submitted any edits yet. Anything you start is saved under Drafts.",
    draft: 'No drafts. Edits you start but have not submitted collect here.',
    pending: 'Nothing awaiting approval right now.',
    live: 'None of your edits are live yet.',
    declined: 'Nothing was sent back.',
  };

  return (
    <div className="container yct" data-screen-label="Your edits" ref={rootRef}>
      <header className="yct-head">
        <div className="yct-head-text">
          <h1 className="yct-title">Your edits</h1>
        </div>
        <div className="yct-head-actions">
          {showFilter &&
            <div className={'yct-search' + (searchOpen || query ? ' is-open' : '')}>
              <Icon name="search" size={14} />
              <input ref={searchRef} className="yct-search-input" type="text" value={query}
                placeholder="Filter"
                aria-label="Filter your edits by device or manufacturer"
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                onKeyDown={(e) => { if (e.key === 'Escape') { setQuery(''); e.target.blur(); } }}
                onBlur={() => { if (!query.trim()) setSearchOpen(false); }} />
              {query &&
                <button type="button" className="yct-search-clear" aria-label="Clear filter"
                  onClick={() => { setQuery(''); if (searchRef.current) searchRef.current.focus(); }}>
                  <Icon name="x" size={13} />
                </button>}
            </div>}
          {counts.draft > 0 &&
            <button type="button" className="btn btn-primary yct-submit-all" onClick={() => { setFlash(null); setSubmitOpen(true); }}>
              {`Submit ${counts.draft} draft${counts.draft === 1 ? '' : 's'}`}
            </button>}
        </div>
      </header>

      <div className="yct-shell">
        <aside className="yct-rail">
          <nav className="yct-rail-list" ref={railListRef} role="tablist" aria-label="Filter your edits" onMouseLeave={() => setNavHover(null)}>
            <span className="yct-rail-railline" aria-hidden="true"
              style={{ transform: `translateY(${rail.y}px)`, height: rail.h + 'px', opacity: rail.ready ? 1 : 0, transition: railAnimate ? undefined : 'none' }} />
            {RAIL.map((t, i) => {
              // Hide a nested lifecycle filter (Awaiting approval / Live /
              // Declined) when it has nothing in it, so the rail only lists
              // states you actually have. Returning null keeps the map index
              // stable, so the accent-rail measurement stays aligned.
              if (t.sub && counts[t.id] === 0) return null;
              return (
                <React.Fragment key={t.id}>
                  {t.groupStart ? <span className="yct-rail-sep" aria-hidden="true" /> : null}
                  <button type="button" role="tab" aria-selected={tab === t.id}
                    ref={(el) => { folderRefs.current[i] = el; }} onMouseEnter={() => setNavHover(i)}
                    className={'yct-folder'
                      + (t.sub ? ' yct-folder-sub' : '')
                      + (t.groupStart ? ' yct-folder-group' : '')
                      + (tab === t.id ? ' is-active' : '')
                      + (t.id === 'all' && submittedSub ? ' is-group-active' : '')}
                    onClick={() => setTab(t.id)}>
                    <span className="yct-folder-label">{t.label}</span>
                    <span className="yct-folder-count">{counts[t.id]}</span>
                  </button>
                </React.Fragment>);
            })}
          </nav>
        </aside>

        <div className="yct-main">
          {flash &&
            <div className="yc-flash" role="status">
              <span className="yc-flash-ico" aria-hidden="true"><Icon name="checkcircle" size={18} /></span>
              <div className="yc-flash-text">
                <b>Sent for review</b>
                <span>{flash.changes} edit{flash.changes === 1 ? '' : 's'} across {flash.devices} device{flash.devices === 1 ? '' : 's'} {flash.changes === 1 ? 'is' : 'are'} on the way to our maintainers. We'll let you know as each one is reviewed.</span>
              </div>
              <button type="button" className="yc-flash-x" aria-label="Dismiss" onClick={() => setFlash(null)}>
                <Icon name="x" size={15} />
              </button>
            </div>}
          {rows.length === 0 ?
            <div className="yct-empty">
              <Icon name={q ? 'search' : 'checkcircle'} size={26} />
              <p>{q ? 'No edits match “' + query.trim() + '”.' : emptyCopy[tab]}</p>
              {q ? <button type="button" className="btn btn-secondary" onClick={() => setQuery('')}>Clear filter</button> :
                tab === 'all' ? <a className="btn btn-secondary" href="#/browse">Browse devices</a> : null}
            </div> :
            <React.Fragment>
              {/* Tablet and up: table */}
              <div className="yct-tablewrap">
                <table className="yct-table">
                  <colgroup>
                    <col className="yct-col-device" />
                    <col className="yct-col-change" />
                    <col className="yct-col-status" />
                    <col className="yct-col-updated" />
                    <col className="yct-col-actions" />
                  </colgroup>
                  <thead>
                    <tr>
                      <YcTh id="device" label="Device" sort={sort} setSort={setSort} />
                      <th className="yct-th yct-th-plain">Edit</th>
                      <YcTh id="status" label="Status" sort={sort} setSort={setSort} />
                      <YcTh id="updated" label="Last activity" sort={sort} setSort={setSort} />
                      <th className="yct-th yct-th-plain yct-th-actions" aria-label="Actions"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((it) =>
                      <tr key={it.key} className={'yct-row' + (it.kind === 'draft' ? ' is-draft' : '')} onClick={ycRowClick(it)}>
                        <td className="yct-td yct-cell-device">
                          <YctThumb device={it.device} />
                          <span className="yct-device-id">
                            <a className="yct-device-name" href={'#/device/' + it.deviceId}>{it.device.name}</a>
                            <span className="yct-device-mfr">{it.device.manufacturer}</span>
                          </span>
                        </td>
                        <td className="yct-td yct-cell-change"><YcChangeSummary item={it} /></td>
                        <td className="yct-td yct-cell-status">
                          <YcStatusBadge kind={it.kind} />
                        </td>
                        <td className="yct-td yct-cell-updated"><YcUpdated item={it} /></td>
                        <td className="yct-td yct-cell-actions"><YcActionCell item={it} onDiscard={setDiscardId} showComments /></td>
                      </tr>)}
                  </tbody>
                </table>
              </div>

              {/* Mobile: cards — reuse the contributor profile row markup so the
                  type scale, spacing, and thumbnail match that page exactly. */}
              <ul className="ce-contrib-list yct-cards">
                {rows.map((it) =>
                  <li key={it.key} className={'ce-contrib-row' + (it.kind === 'draft' ? ' is-draft' : '')} onClick={ycRowClick(it)}>
                    <YcTile device={it.device} />
                    <div className="ce-contrib-body">
                      <div className="ce-contrib-meta">
                        <time className="ce-contrib-when" dateTime={it.at}
                          title={window.formatDateTime ? window.formatDateTime(it.at) : it.at}>
                          {window.relTime ? window.relTime(it.at) : it.at}
                        </time>
                        <YcReviewCell item={it} />
                        <YcStatusBadge kind={it.kind} />
                        <YcActionCell item={it} onDiscard={setDiscardId} />
                      </div>
                      <div className="ce-contrib-top">
                        <a className="ce-contrib-device" href={'#/device/' + it.deviceId}>
                          <span className="ce-contrib-name">{it.device.name}</span>
                          <span className="ce-contrib-mfr">{it.device.manufacturer}</span>
                        </a>
                      </div>
                      <YcChangeSummary item={it} />
                    </div>
                  </li>)}
              </ul>
            </React.Fragment>}
        </div>
      </div>

      {submitOpen &&
        <YcSubmitModal
          drafts={draftItems}
          totalChanges={totalDraftChanges}
          onClose={() => setSubmitOpen(false)}
          onSubmit={doSubmitAll} />}

      {window.ConfirmDialog &&
        <window.ConfirmDialog
          open={!!discardId}
          title="Discard this draft?"
          message="Your unsubmitted edits to this device will be lost. This can't be undone."
          confirmLabel="Discard draft"
          cancelLabel="Keep draft"
          danger
          onConfirm={() => { if (window.clearDraft) window.clearDraft(discardId); setDiscardId(null); }}
          onCancel={() => setDiscardId(null)} />}
    </div>);
}

// ── Nav widget: a single icon that links to the page, with a drafts badge. ──
function YourChangesNavButton() {
  const user = (window.useCurrentUser && window.useCurrentUser()) || null;
  window.useDrafts && window.useDrafts();
  if (!user) return null;
  const drafts = (window.draftDeviceCount && window.draftDeviceCount()) || 0;
  return (
    <span className="ce-inbox" data-inc-target="your-changes">
      <a className="ce-inbox-btn yc-navlink-btn"
         href="#/you"
         aria-label={drafts ? `Your edits, ${drafts} draft${drafts === 1 ? '' : 's'} in progress` : 'Your edits'}>
        <Icon name="inbox" size={19} />
        {drafts > 0 && <span className="ce-inbox-badge" aria-hidden="true">{drafts > 9 ? '9+' : drafts}</span>}
      </a>
    </span>);
}

Object.assign(window, { YourChanges, YourChangesNavButton });
