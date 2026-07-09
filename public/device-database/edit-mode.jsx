/* Edit mode, community-edit increment.

   When a signed-in contributor clicks Edit on a device page, detail.jsx
   swaps in <EditMode>. We work on a draft clone of the device.

   The core dataset collected from Home Assistant (manufacturer, model,
   connectivity, integration, entity types, software version) is READ-ONLY
   and rendered with the same UI as the read view. Only the additional
   contributor fields are editable; those editors live in edit-fields.jsx.

   On submit, changes do NOT go live. Each changed field is written to the
   pending store (pending-edits.jsx) and waits to be reviewed on GitHub. A
   field already pending review is shown locked. After submitting we show a
   confirmation and return to the read view, which still shows the last
   approved data.

   Components:
   - EditMode(device, onCancel)
   - PhotosEditor(photos, setPhotos)
   - SubmitDialog / SubmittedDialog / ConfirmDiscardDialog
*/

// ─────────────────────────────────────────────────────────────────────
// Change description (for the review list)
// ─────────────────────────────────────────────────────────────────────
const FIELD_LABELS = {
  name: 'Device name', summary: 'Summary', photos: 'Photos',
  description: 'Description', instructions: 'Instructions',
  ecosystems: 'Ecosystems and apps', protocols: 'Connectivity', bridge: 'Bridge',
  connectsWith: 'Connects with',
  dimensions: 'Dimensions', identifiers: 'Product identifiers',
  customFields: 'Additional details',
  references: 'External references',
  msrp: 'Reference price'
};
function fieldLabel(device, key) {
  if (key.indexOf('spec:') === 0) {
    const k = key.slice(5);
    const f = ((window.CATEGORY_SPECS && window.CATEGORY_SPECS[device.category]) || []).find((x) => x.key === k);
    return f ? f.label : k;
  }
  return FIELD_LABELS[key] || key;
}
function describeChanges(device, draft, keys) {
  return keys.map((key) => {
    const line = { field: key, verb: 'updated' };
    const a = window.getField(device, key);
    const b = window.getField(draft, key);
    if (key === 'photos') {
      const added = (b || []).length - (a || []).length;
      if (added > 0) { line.verb = 'added'; line.detail = added + ' photo' + (added === 1 ? '' : 's'); }
      else if (added < 0) { line.verb = 'removed'; line.detail = (-added) + ' photo' + (added === -1 ? '' : 's'); }
      else { line.verb = 'updated'; line.detail = 'reordered'; }
    } else if (a !== null && typeof a !== 'object' && b !== null && typeof b !== 'object') {
      const sa = a == null ? '' : String(a), sb = b == null ? '' : String(b);
      if (sa.length < 40 && sb.length < 40) { line.from = sa || '-'; line.to = sb || '-'; }
    }
    return line;
  });
}

// ─────────────────────────────────────────────────────────────────────
// PhotosEditor, gallery editor with add / reorder / remove.
// ─────────────────────────────────────────────────────────────────────
function PhotosEditor({ device, photos, setPhotos }) {
  const [dragIdx, setDragIdx] = React.useState(null);
  const [overIdx, setOverIdx] = React.useState(null);

  const Photo = ({ src, idx }) => {
    // Real image when the entry is a path/URL; only "placeholder:" keys
    // render as the generated studio SVG. (Matches PhotoGallery's check so
    // edit mode shows the same photos as the read view.)
    const isUrl = typeof src === 'string' && !src.startsWith('placeholder:');
    return isUrl ?
      <img src={src} alt="" draggable={false} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /> :
      <window.PhotoPlaceholder id={src + ':' + device.id + ':' + idx} category={device.category} alt="" />;
  };
  const move = (i, dir) => {
    const next = photos.slice();
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    setPhotos(next);
  };
  const reorder = (from, to) => {
    if (from == null || to == null || from === to) return;
    const next = photos.slice();
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setPhotos(next);
  };
  const remove = (i) => {
    setPhotos(photos.filter((_, idx) => idx !== i));
  };
  const add = () => setPhotos([...photos, 'placeholder:edit:' + Date.now().toString(36)]);

  const endDrag = () => { setDragIdx(null); setOverIdx(null); };

  return (
    <div className="ce-photos-editor">
      <div className="ce-photos-editor-head">
        <label className="ce-field-label">Photos</label>
        <span className="ce-field-meta">{photos.length} of 8</span>
      </div>
      <div className="ce-photos-grid">
        {photos.map((src, i) =>
          <div
            className={'ce-photos-item' +
              (dragIdx === i ? ' is-dragging' : '') +
              (overIdx === i && dragIdx !== i ? ' is-over' : '')}
            key={src + ':' + i}
            draggable
            onDragStart={(e) => { setDragIdx(i); e.dataTransfer.effectAllowed = 'move'; try { e.dataTransfer.setData('text/plain', String(i)); } catch (err) {} }}
            onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; if (overIdx !== i) setOverIdx(i); }}
            onDragEnter={(e) => { e.preventDefault(); if (overIdx !== i) setOverIdx(i); }}
            onDrop={(e) => { e.preventDefault(); reorder(dragIdx, i); endDrag(); }}
            onDragEnd={endDrag}>
            <div className="ce-photos-thumb"><Photo src={src} idx={i} /></div>
            <span className="ce-photos-grip" aria-hidden="true" title="Drag to reorder">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><circle cx="4" cy="3" r="1.1"/><circle cx="10" cy="3" r="1.1"/><circle cx="4" cy="7" r="1.1"/><circle cx="10" cy="7" r="1.1"/><circle cx="4" cy="11" r="1.1"/><circle cx="10" cy="11" r="1.1"/></svg>
            </span>
            <div className="ce-photos-actions">
              <button type="button" className="ce-iconbtn" aria-label="Move photo earlier" disabled={i === 0} onClick={() => move(i, -1)}>
                <Icon name="arrowL" size={14} />
              </button>
              <button type="button" className="ce-iconbtn" aria-label="Move photo later" disabled={i === photos.length - 1} onClick={() => move(i, 1)}>
                <Icon name="arrow" size={14} />
              </button>
              <button type="button" className="ce-iconbtn ce-iconbtn-danger" aria-label="Remove photo" onClick={() => remove(i)}>
                <Icon name="trash" size={14} />
              </button>
            </div>
          </div>)}
        {photos.length < 8 ?
          <button type="button" className="ce-photos-add" onClick={add} aria-label="Add photo">
            <span className="ce-photos-add-plus">+</span>
            <span className="ce-photos-add-label">Add photo</span>
          </button> : null}
      </div>
    </div>);
}

// Photos editor in the pending state. Unlike other fields it stays usable:
// the contributor can still add photos and delete the unchanged ones. The
// pending edit's proposed additions and removals show as their own labelled,
// locked groups (awaiting review); the unchanged group carries no label and
// behaves like the normal editor (minus drag-reorder).
function PhotosPendingEditor({ device, draft, setPhotos, entry }) {
  const approved = (device && device.photos) || [];
  const proposed = (entry && entry.value) || [];
  const added = proposed.filter((p) => approved.indexOf(p) === -1);
  const removed = approved.filter((p) => proposed.indexOf(p) === -1);
  const working = (draft || []).filter((p) => removed.indexOf(p) === -1);
  const isUrl = (src) => typeof src === 'string' && !src.startsWith('placeholder:');
  const Thumb = ({ src, idx }) => isUrl(src) ?
    <img src={src} alt="" draggable={false} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /> :
    <window.PhotoPlaceholder id={src + ':' + device.id + ':' + idx} category={device.category} alt="" />;
  const removeAt = (src) => {
    setPhotos((draft || []).filter((p) => p !== src));
  };
  const add = () => setPhotos([...(draft || []), 'placeholder:edit:' + Date.now().toString(36)]);
  const total = working.length + added.length;
  return (
    <div className="ce-photos-editor ce-photos-editor-pending">
      <div className="ce-photos-editor-head">
        <label className="ce-field-label">Photos</label>
        <span className="ce-field-meta">{total} of 8</span>
      </div>
      <div className="ce-photos-grid">
        {working.map((src, i) =>
        <div className="ce-photos-item" key={src + ':' + i}>
            <div className="ce-photos-thumb"><Thumb src={src} idx={i} /></div>
            <div className="ce-photos-actions">
              <button type="button" className="ce-iconbtn ce-iconbtn-danger" aria-label="Remove photo" onClick={() => removeAt(src)}>
                <Icon name="trash" size={14} />
              </button>
            </div>
          </div>)}
        {total < 8 ?
        <button type="button" className="ce-photos-add" onClick={add} aria-label="Add photo">
            <span className="ce-photos-add-plus">+</span>
            <span className="ce-photos-add-label">Add photo</span>
          </button> : null}
      </div>

      {added.length > 0 &&
      <div className="ce-photos-diffgroup">
        <span className="ce-photos-difflabel ce-photos-difflabel-add">Added</span>
        <div className="ce-photos-grid">
          {added.map((src, i) =>
          <div className="ce-photos-item ce-photos-item-lock ce-photos-item-add" key={'a' + i}>
              <div className="ce-photos-thumb"><Thumb src={src} idx={i} /></div>
            </div>)}
        </div>
      </div>}

      {removed.length > 0 &&
      <div className="ce-photos-diffgroup">
        <span className="ce-photos-difflabel ce-photos-difflabel-remove">Removed</span>
        <div className="ce-photos-grid">
          {removed.map((src, i) =>
          <div className="ce-photos-item ce-photos-item-lock ce-photos-item-removed" key={'r' + i}>
              <div className="ce-photos-thumb"><Thumb src={src} idx={i} /></div>
            </div>)}
        </div>
      </div>}

      {window.PendingMeta && (added.length > 0 || removed.length > 0) ?
      <window.PendingMeta entry={entry} /> : null}
    </div>);
}

// ─────────────────────────────────────────────────────────────────────
// LockedCore, the Home Assistant dataset, same UI as read mode, locked.
// ─────────────────────────────────────────────────────────────────────
// Read-only blocks, shown compactly in edit mode so the page order matches
// the read view. Connectivity reuses the read page's verdict (window.verdictFor).
// ─────────────────────────────────────────────────────────────────────
function ConnectivitySummary({ device, ctx }) {
  const v = window.verdictFor ? window.verdictFor(device) : null;
  if (!v) return null;
  const internet = window.internetExplanation ? window.internetExplanation(device) : null;
  // Mirror the read page's framed verdict + explanation, but swap the
  // read-only requirements matrix for the editable connectivity dropdowns.
  const inner = (
    <React.Fragment>
      <div className={'verdict verdict-' + v.kind} style={{ margin: 0, border: 0, padding: 0 }}>
        <span className="verdict-dot" style={{ background: v.color }}></span>
        <span className="verdict-text">{v.text}</span>
      </div>
      {internet && <p style={{ margin: 'var(--space-4) 0 0' }}>{internet.body}</p>}
      {window.ConnectivityEditor &&
        <div style={{ marginTop: 'var(--space-5)' }}>
          <window.ConnectivityEditor ctx={ctx} />
        </div>}
    </React.Fragment>);
  return window.DetailFigure ? <window.DetailFigure>{inner}</window.DetailFigure> : inner;
}

function IntegrationSummary({ device }) {
  return (
    <div className="ce-ha-panel">
      <div className="ce-ha-panel-head">
        <span className="ce-ha-panel-name">{device.haIntegration || 'No Home Assistant integration'}</span>
        <window.InfoHint text="Collected from Home Assistant. Contributors can't edit this." />
      </div>
      {device.entityTypes && device.entityTypes.length > 0 ?
        <div className="ce-ha-panel-entities">
          {device.entityTypes.map((et) => <span key={et} className="mono">{et}</span>)}
        </div> : null}
    </div>);
}

// The locked HA core fields, rendered as the first (read-only) group inside
// the Specifications section — mirroring the read page's "From Home Assistant".
function LockedCoreGroup({ device }) {
  const hint = "Collected from Home Assistant. Contributors can't edit this.";
  const [versionsOpen, setVersionsOpen] = React.useState(false);
  return (
    <React.Fragment>
      <window.SpecGroup title="Software version">
        <dl style={{ margin: 0 }}>
          <div className="trait-row"><dt>Current</dt><dd><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>{device.softwareVersion || '-'}<window.InfoHint text={hint} /></span>{device.versionHistory && device.versionHistory.length > 0 && <button type="button" className="trait-version-link" style={{ marginLeft: 14 }} onClick={() => setVersionsOpen(true)}>Show version history</button>}</dd></div>
        </dl>
      </window.SpecGroup>
      {versionsOpen && device.versionHistory && window.VersionHistoryDialog &&
        <window.VersionHistoryDialog device={device} onClose={() => setVersionsOpen(false)} />}
    </React.Fragment>);
}

// ─────────────────────────────────────────────────────────────────────
// EditMode
// ─────────────────────────────────────────────────────────────────────
function EditMode({ device, onCancel, makeSuggest, onSubmitted }) {
  const [draft, setDraft] = React.useState(() => {
    let base = {
      ...device,
      entityTypes: device.entityTypes ? [...device.entityTypes] : [],
      photos: device.photos ? [...device.photos] : [],
      specs: device.specs ? JSON.parse(JSON.stringify(device.specs)) : {}
    };
    // Restore an unsubmitted draft for this device (Stage 3 "A"). Saved field
    // values overlay the approved record; saved sources (if any) re-attach so
    // References provenance survives a reload. Pending fields are locked, so a
    // draft never carries them.
    const saved = window.getDraft ? window.getDraft(device.id) : null;
    if (saved && saved.fields) {
      Object.keys(saved.fields).forEach((k) => { base = window.setField(base, k, saved.fields[k]); });
      if (saved.sources) base.__appliedSources = { ...saved.sources };
    }
    return base;
  });
  const pending = window.usePending ? window.usePending(device.id) : {};
  const [confirmingDiscard, setConfirmingDiscard] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [viewingChanges, setViewingChanges] = React.useState(false);
  const [aiBusy, setAiBusy] = React.useState(false);

  const user = (window.useCurrentUser && window.useCurrentUser()) || null;

  // Editor context shared by all field editors. suggestionsFor is wired by
  // increment 03 via makeSuggest(draft); null otherwise.
  const suggest = makeSuggest ? makeSuggest(draft) : null;
  const ctx = {
    device,
    getVal: (key) => window.getField(draft, key),
    setVal: (key, value) => setDraft((d) => window.setField(d, key, value)),
    pending,
    suggestionsFor: suggest,
    applySuggestion: (key, value) => setDraft((d) => window.setField(d, key, value))
  };

  const changedKeys = window.diffContributorFields(device, draft);
  const changeCount = changedKeys.length;
  const hasChanges = changeCount > 0;

  // Autosave the in-progress edit to the local draft store on every change, so
  // leaving the page and coming back keeps the work (Stage 3 "A"). Submit and
  // Discard clear it explicitly. An empty diff clears the draft.
  React.useEffect(() => {
    if (!window.setDraft) return;
    if (changedKeys.length === 0) { if (window.clearDraft) window.clearDraft(device.id); return; }
    const fields = {};
    changedKeys.forEach((k) => {
      let v = window.getField(draft, k);
      if (k === 'customFields' && window.cleanCustomFields) v = window.cleanCustomFields(v);
      if (k === 'bridge' && window.cleanBridge) v = window.cleanBridge(v);
      fields[k] = v;
    });
    const sources = draft.__appliedSources && Object.keys(draft.__appliedSources).length ? draft.__appliedSources : null;
    window.setDraft(device.id, fields, sources ? { sources } : undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  // The persistent sticky save bar is the single action location at every
  // breakpoint, so the desktop nav mirror stays dormant here.
  const [saveBarRef, saveBarSentinelRef, saveBarStuck] = window.useStuckBar
    ? window.useStuckBar()
    : [null, null, false];

  const photosPending = !!pending.photos;
  const namePending = !!pending.name;
  const summaryPending = !!pending.summary;

  const handleDiscard = () => {
    if (!hasChanges) { discardAndExit(); return; }
    setConfirmingDiscard(true);
  };

  // Throw away the device's local draft and leave edit mode. Used by Discard
  // (after confirmation) and by Cancel when there is nothing to lose.
  const discardAndExit = () => {
    if (window.clearDraft) window.clearDraft(device.id);
    onCancel();
  };

  const doSubmit = (comment) => {
    const entries = {};
    changedKeys.forEach((key) => {
      let v = window.getField(draft, key);
      if (key === 'customFields' && window.cleanCustomFields) v = window.cleanCustomFields(v);
      if (key === 'bridge' && window.cleanBridge) v = window.cleanBridge(v);
      const e = { value: v };
      // Record any trusted reference source backing this value (increment 03).
      if (suggest && draft.__appliedSources && draft.__appliedSources[key]) {
        e.source = draft.__appliedSources[key];
      }
      entries[key] = e;
    });
    if (window.addPendingEdit) window.addPendingEdit(device.id, entries);
    // Each submission opens one pull request for this one device.
    if (window.openPullRequest) window.openPullRequest(device);
    // The work is now in review; drop the local draft so it can't linger.
    if (window.clearDraft) window.clearDraft(device.id);
    setSubmitting(false);
    setSubmitted(true);
    if (onSubmitted) onSubmitted();
  };

  const genSummary = async () => {
    if (aiBusy) return;
    if (!window.claude || !window.claude.complete) {
      alert('AI drafting is only available in the live preview.');
      return;
    }
    setAiBusy(true);
    try {
      const cat = (window.CATEGORY_LABEL && window.CATEGORY_LABEL[device.category]) || device.category;
      const specs = draft.specs || {};
      const facts = [
        'Name: ' + draft.name,
        'Manufacturer: ' + device.manufacturer,
        'Model: ' + device.model,
        'Category: ' + cat,
        'Local control: ' + device.local + '; Cloud dependency: ' + device.cloud,
        device.haIntegration ? 'Home Assistant integration: ' + device.haIntegration : '',
        device.entityTypes && device.entityTypes.length ? 'Entity types: ' + device.entityTypes.join(', ') : '',
        (function () { const ks = specs.protocols ? Object.keys(specs.protocols).filter((k) => specs.protocols[k]) : []; return ks.length ? 'Protocols: ' + ks.join(', ') : ''; })(),
        draft.description ? 'Description: ' + draft.description : ''
      ].filter(Boolean).join('\n');
      const prompt = 'You are writing the one-line summary for a smart-home device in the Open Home Foundation Device Database. Write a concise, factual summary of 1 to 2 sentences focusing on what the device is and how it connects (local vs cloud, Home Assistant integration). Neutral tone, no marketing language, and do not use em dashes. Return only the summary text, with no quotes or preamble.\n\nDevice details:\n' + facts;
      const out = await window.claude.complete(prompt);
      if (out) ctx.setVal('summary', out.trim());
    } catch (e) {
      alert('Could not generate a summary right now. Please try again.');
    } finally {
      setAiBusy(false);
    }
  };

  return (
    <div className="ce-edit-mode" data-screen-label="03b Device detail (edit mode)">
      <div className="container detail-wrap">
        <div className="breadcrumb" aria-label="Breadcrumb">
          <a href="#/browse">Devices</a>
          <span className="sep">›</span>
          <a href={`#/browse?category=${device.category}`}>
            {(window.DEVICE_CATEGORIES.find((c) => c.id === device.category) || {}).label || device.category}
          </a>
        </div>

        {/* Persistent review-context strip — shown to everyone, so the
            "this is a suggestion, not a direct edit" contract is visible the
            whole time, not revealed only at submit. Guests get the extra
            sign-in line appended. */}
        <div className="ce-review-note" role="note">
          <span className="ce-review-note-ico" aria-hidden="true"><Icon name="info" size={16} /></span>
          <div className="ce-review-note-main">
            <b className="ce-review-note-title">You’re suggesting an edit</b>
            <span className="ce-review-note-body">
              Your changes don’t go live right away. Every edit is reviewed on GitHub before it’s published.{!user ? ' Make your changes, then sign in to submit them. Your work won’t be lost.' : ''}
            </span>
          </div>
        </div>

        {/* Head, photo editor + editable title */}
        <header className="detail-head ce-edit-head">
          {photosPending ?
            <PhotosPendingEditor device={device} draft={draft.photos} setPhotos={(p) => ctx.setVal('photos', p)} entry={pending.photos} /> :
            <PhotosEditor device={device} photos={draft.photos} setPhotos={(p) => ctx.setVal('photos', p)} />}
          <div className="detail-title">
            {namePending ?
              <window.PendingLock label="Device name" fieldKey="name" entry={pending.name} device={device} /> :
              <React.Fragment>
                <label className="ce-field-label" htmlFor="ce-field-name">Device name</label>
                <input id="ce-field-name" className="ce-input ce-input-h1" value={draft.name}
                  onChange={(e) => ctx.setVal('name', e.target.value)} />
              </React.Fragment>}
            <div className="detail-manu" style={{ marginTop: 8 }}>
              by <span style={{ color: 'var(--fg)' }}>{device.manufacturer}</span>
            </div>
            {summaryPending ?
              <div style={{ marginTop: 'var(--space-3)' }}>
                <window.PendingLock label="Summary" fieldKey="summary" entry={pending.summary} device={device} />
              </div> :
              <div className="ce-field" style={{ marginTop: 'var(--space-3)' }}>
                <div className="ce-field-label-row">
                  <span className="ce-field-label">Summary</span>
                </div>
                <textarea id="ce-field-summary" className="ce-textarea" rows={2}
                  placeholder="One or two sentences shown under the title."
                  value={draft.summary || ''} onChange={(e) => ctx.setVal('summary', e.target.value)} />
                <div style={{ marginTop: 'var(--space-2)' }}>
                  <button type="button" className="ce-acct-quiet" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }} onClick={genSummary} disabled={aiBusy}>
                    <Icon name="cpu" size={13} />
                    {aiBusy ? 'Writing…' : 'Write with AI'}
                  </button>
                </div>
              </div>}
          </div>
        </header>

        <div className="detail-body">
          <main>
            <section className="detail-section">
              <h2>Overview</h2>
              <window.DescriptionEditor ctx={ctx} />
            </section>

            <section className="detail-section">
              <ConnectivitySummary device={device} ctx={ctx} />
            </section>

            <section className="detail-section">
              <h2>Connects with</h2>
              <window.ConnectsWithEditor ctx={ctx} />
            </section>

            <section className="detail-section">
              <h2>Specifications</h2>
              <window.CategorySpecsEditor ctx={ctx} />
              <window.PricingEditor ctx={ctx} />
              <window.ProtocolsEditor ctx={ctx} />
              <window.EcosystemsEditor ctx={ctx} />
              <window.AppSubscriptionEditor ctx={ctx} />
              <window.DimensionsEditor ctx={ctx} />
              <LockedCoreGroup device={device} />
              <window.IdentifiersEditor ctx={ctx} />
            </section>

            <section className="detail-section">
              <h2>References</h2>
              <window.ReferencesEditor ctx={ctx} />
            </section>
          </main>

          <aside className="detail-aside">
            <div className="aside-card aside-stats">
              <h4>Real-world data</h4>
              <dl className="aside-stat-list">
                <div className="aside-stat"><dt>Reports</dt><dd>{device.reports.toLocaleString()}</dd></div>
                <div className="aside-stat"><dt>Installations</dt><dd>{device.installs.toLocaleString()}</dd></div>
                <div className="aside-stat"><dt>Last verified</dt><dd>{device.lastVerified ? (window.formatDate ? window.formatDate(device.lastVerified) : new Date(device.lastVerified).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })) : '-'}</dd></div>
                {device.firstSeen ? <div className="aside-stat"><dt>First seen</dt><dd>{window.formatDate ? window.formatDate(device.firstSeen) : new Date(device.firstSeen).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</dd></div> : null}
              </dl>
              <p className="aside-stats-note">Anonymized telemetry from opt-in Home Assistant users. No accounts, no personal data, no tracking.</p>
              <p className="aside-source-linkrow">
                <a href="#/how-it-works" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  Learn about the methodology <Icon name="open" size={12} />
                </a>
              </p>
            </div>
            <div className="aside-card aside-edits-card">
              {window.SidebarEditHistory ? <window.SidebarEditHistory device={device} /> : null}
            </div>
          </aside>
        </div>
      </div>

      {/* Sticky save bar — the single action location at every breakpoint. */}
      <div className={'ce-save-bar' + (saveBarStuck ? ' is-stuck' : '')} ref={saveBarRef} role="region" aria-label="Submit edits">
        <div className="ce-save-bar-inner">
          <div className="ce-save-bar-actions">
            <button type="button" className="btn btn-primary" disabled={!hasChanges} onClick={() => setSubmitting(true)}>
              Submit for review
            </button>
            <button type="button" className="btn btn-ghost" onClick={onCancel}>
              Cancel
            </button>
          </div>
          <div className="ce-save-bar-status">
            {hasChanges &&
              <button type="button" className="ce-save-bar-changes" onClick={() => setViewingChanges(true)}>
                {changeCount + ' change' + (changeCount === 1 ? '' : 's')}
              </button>}
          </div>
          {hasChanges &&
            <button type="button" className="btn btn-ghost ce-save-bar-discard" onClick={handleDiscard} aria-label="Discard">
              <span className="ce-save-bar-discard-ico" aria-hidden="true"><Icon name="trash" size={16} /></span>
              <span className="ce-save-bar-discard-label">Discard</span>
            </button>}
        </div>
      </div>
      <div ref={saveBarSentinelRef} aria-hidden="true" style={{ height: 1 }} />

      <window.ConfirmDialog
        open={confirmingDiscard}
        title="Discard your edits?"
        message="Anything you’ve edited will be lost. This can’t be undone."
        confirmLabel="Discard"
        cancelLabel="Keep editing"
        danger
        onConfirm={discardAndExit}
        onCancel={() => setConfirmingDiscard(false)} />

      {submitting ?
        <SubmitDialog device={device} draft={draft} changes={describeChanges(device, draft, changedKeys)}
          user={user} onCancel={() => setSubmitting(false)} onSubmit={doSubmit} /> : null}

      {viewingChanges ?
        <ChangesDialog device={device} changes={describeChanges(device, draft, changedKeys)}
          onClose={() => setViewingChanges(false)} /> : null}

      {submitted ?
        <SubmittedDialog count={changeCount} onClose={onCancel} /> : null}
    </div>);
}

// ─────────────────────────────────────────────────────────────────────
// Dialogs
// ─────────────────────────────────────────────────────────────────────
function SubmitDialog({ device, draft, changes, user, onCancel, onSubmit }) {
  const [comment, setComment] = React.useState('');

  // The submit step is a small wizard. A guest authenticates first, then (if
  // their account is brand-new) runs onboarding, then lands on the review
  // step. A signed-in, onboarded contributor starts straight at review. The
  // draft lives in EditMode's state, so threading auth through here (rather
  // than navigating away to #/signin) keeps every change on screen.
  const liveUser = (window.useCurrentUser && window.useCurrentUser()) || user || null;
  const needsAuth = !liveUser;
  const needsOnb = !!(liveUser && window.needsOnboarding && window.needsOnboarding(liveUser));
  const [step, setStep] = React.useState(needsAuth ? 'auth' : needsOnb ? 'onboard' : 'review');

  const noNotify = window.hasNotificationMethod ? !window.hasNotificationMethod(liveUser) : false;

  const onAuthed = (method, fields) => {
    // Returning contributor? If the provider identity matches an existing
    // account, sign into it and skip account creation + onboarding. Otherwise
    // create a fresh account, which always needs onboarding.
    const existing = window.findAccountByIdentity && window.findAccountByIdentity(method, fields);
    if (existing) {
      if (window.setCurrentUser) window.setCurrentUser(existing);
      const u = (window.USERS && window.USERS[existing]) || null;
      setStep(window.needsOnboarding && window.needsOnboarding(u) ? 'onboard' : 'review');
      return;
    }
    if (window.createAccount) window.createAccount(method, fields);
    // A freshly created account always needs onboarding.
    setStep('onboard');
  };
  const onOnboarded = (patch) => {
    if (window.completeOnboarding) window.completeOnboarding(patch);
    setStep('review');
  };

  // Desktop = centred modal, mobile/tablet = slide-up bottom sheet, mirrors
  // EditHistoryDialog / VersionHistoryDialog so review surfaces feel alike.
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
    if (!isSheet) { onCancel(); return; }
    const h = panelRef.current?.offsetHeight ?? 600;
    setClosing(true);
    setDragY(h);
    setTimeout(onCancel, 200);
  }, [isSheet, onCancel]);

  React.useEffect(() => {
    document.body.classList.add('modal-open');
    const onKey = (e) => { if (e.key === 'Escape') closeAnimated(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('modal-open');
      document.removeEventListener('keydown', onKey);
    };
  }, [closeAnimated]);

  const titleByStep = {
    auth: 'Sign in or create an account',
    onboard: 'Finish setting up',
    review: 'Submit your edit for review'
  };
  const title = titleByStep[step];

  let body;
  if (step === 'auth') {
    body = (
      <div className="ce-submit-auth">
        <p className="muted">
          Sign in or create an account to submit {changes.length === 1 ? 'your edit' : 'your edits'} for review. Your edits won’t be lost.
        </p>
        {window.AuthProviders
          ? <window.AuthProviders verb="Continue" onAuthed={onAuthed} />
          : null}
        <p className="ce-auth-foot ce-submit-auth-foot">Every edit is reviewed on GitHub before it goes live.</p>
      </div>);
  } else if (step === 'onboard') {
    body = window.Onboarding
      ? <window.Onboarding user={liveUser} variant="inline" submitLabel="Continue" onComplete={onOnboarded} />
      : null;
  } else {
    body = (
      <>
        <p className="ce-submit-section-label">Your edits</p>
        <ul className="ce-change-list ce-change-list-preview">
          {changes.map((c, i) => <window.EditChangeLine key={i} change={c} />)}
        </ul>

        {noNotify ?
          <div className="ce-notify-warning" role="note">
            <Icon name="info" size={16} />
            <div className="ce-notify-warning-main">
              <b className="ce-notify-warning-title">No notification method set up</b>
              <span className="ce-notify-warning-text">You can finish submitting now and add one later in Settings. Until then, track this edit on the Your edits page.</span>
            </div>
          </div> : null}

        <label className="ce-field" htmlFor="ce-publish-comment" style={{ marginTop: 'var(--space-4)' }}>
          <span className="ce-field-label">Comment</span>
          <textarea id="ce-publish-comment" className="ce-textarea" rows={3}
            placeholder="What did you change and why? Helps reviewers."
            value={comment} onChange={(e) => setComment(e.target.value)} />
        </label>

        <p className="ce-auth-foot ce-submit-auth-foot">Every edit is reviewed on GitHub before it goes live.</p>
      </>);
  }

  // Only the review step carries a footer CTA; auth and onboard steps drive
  // their own advance (provider buttons / the onboarding Continue button).
  const showFooter = step === 'review';
  const actions = (
    <div className="ce-confirm-actions">
      <button type="button" className="btn btn-ghost" onClick={closeAnimated}>Cancel</button>
      <button type="button" className="btn btn-primary" onClick={() => onSubmit(comment)}>Submit for review</button>
    </div>);

  if (isSheet) {
    return ReactDOM.createPortal(
      <div className={'sheet-backdrop' + (closing ? ' is-closing' : '')}
        onClick={closeAnimated} role="presentation">
        <div className="sheet-panel"
          ref={panelRef}
          role="dialog" aria-modal="true" aria-labelledby="ce-publish-title"
          onClick={(e) => e.stopPropagation()}
          style={{
            transform: dragY ? `translateY(${dragY}px)` : undefined,
            transition: 'transform 200ms cubic-bezier(.2,.0,.2,1)'
          }}>
          <header className="sheet-head">
            <div className="sheet-head-row">
              <button type="button"
                className="sheet-back"
                onClick={closeAnimated}
                aria-label="Cancel">
                <Icon name="x" size={18} />
              </button>
              <h2 id="ce-publish-title" className="sheet-title">{title}</h2>
            </div>
          </header>
          <div className="sheet-body">
            <div className="ce-publish-sheet-pad">{body}</div>
          </div>
          {showFooter &&
            <footer className="sheet-foot">
              <div className="ce-confirm-actions ce-confirm-actions-sheet">
                <button type="button" className="btn btn-primary" onClick={() => onSubmit(comment)}>Submit for review</button>
                <button type="button" className="btn btn-ghost" onClick={closeAnimated}>Cancel</button>
              </div>
            </footer>}
        </div>
      </div>,
      document.body);
  }

  return ReactDOM.createPortal(
    <div className="modal-backdrop" onClick={onCancel} role="presentation">
      <div className="modal-dialog ce-publish-dialog" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="ce-publish-title">
        <header className="modal-head">
          <div className="modal-head-row">
            <button type="button" className="modal-close" onClick={onCancel} aria-label="Close">
              <Icon name="x" size={18} />
            </button>
            <h2 id="ce-publish-title">{title}</h2>
          </div>
        </header>
        <div className="modal-body">{body}</div>
        {showFooter && <footer className="modal-foot">{actions}</footer>}
      </div>
    </div>,
    document.body);
}

// Read-only viewer for the current unsubmitted changes, opened from the save
// bar's change count. Responsive: centred modal on desktop, slide-up sheet on
// mobile/tablet — mirrors SubmitDialog / VersionHistoryDialog.
function ChangesDialog({ device, changes, onClose }) {
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

  const count = changes.length;
  const title = count + ' change' + (count === 1 ? '' : 's');
  const body = (
    <React.Fragment>
      <ul className="ce-change-list">
        {changes.map((c, i) => <window.EditChangeLine key={i} change={c} />)}
      </ul>
    </React.Fragment>);

  if (isSheet) {
    return ReactDOM.createPortal(
      <div className={'sheet-backdrop' + (closing ? ' is-closing' : '')}
        onClick={closeAnimated} role="presentation">
        <div className="sheet-panel"
          ref={panelRef}
          role="dialog" aria-modal="true" aria-labelledby="ce-changes-title"
          onClick={(e) => e.stopPropagation()}
          style={{
            transform: dragY ? `translateY(${dragY}px)` : undefined,
            transition: 'transform 200ms cubic-bezier(.2,.0,.2,1)'
          }}>
          <header className="sheet-head">
            <div className="sheet-head-row">
              <button type="button" className="sheet-back" onClick={closeAnimated} aria-label="Close">
                <Icon name="x" size={18} />
              </button>
              <h2 id="ce-changes-title" className="sheet-title">{title}</h2>
            </div>
          </header>
          <div className="sheet-body">
            <div className="ce-publish-sheet-pad">{body}</div>
          </div>
        </div>
      </div>,
      document.body);
  }

  return ReactDOM.createPortal(
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div className="modal-dialog ce-publish-dialog" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="ce-changes-title">
        <header className="modal-head">
          <div className="modal-head-row">
            <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
              <Icon name="x" size={18} />
            </button>
            <h2 id="ce-changes-title">{title}</h2>
          </div>
        </header>
        <div className="modal-body">{body}</div>
      </div>
    </div>,
    document.body);
}

function SubmittedDialog({ count, onClose }) {
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' || e.key === 'Enter') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);
  return ReactDOM.createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog ce-submitted-dialog" onClick={(e) => e.stopPropagation()} role="dialog" aria-labelledby="ce-submitted-title">
        <div className="ce-submitted-check" aria-hidden="true"><Icon name="check" size={22} /></div>
        <h2 id="ce-submitted-title" style={{ margin: '0 0 var(--space-2)' }}>Thank you for contributing!</h2>
        <p className="muted" style={{ margin: '0 0 var(--space-5)' }}>
          Your {count === 1 ? 'edit is' : 'edits are'} on the way to review on GitHub. Edits like yours keep the database accurate for everyone setting up their smart home.
        </p>
        <div className="ce-confirm-actions">
          <button type="button" className="btn btn-primary" onClick={onClose}>Back to device</button>
        </div>
      </div>
    </div>,
    document.body);
}

// EditChangeLine shim (community-edit.jsx defines the real one).
if (!window.EditChangeLine) {
  window.EditChangeLine = function EditChangeLineShim({ change }) {
    const p = window.changeLineParts ? window.changeLineParts(change) :
      { text: (change.verb || 'updated') + ' ' + change.field, hasVals: false };
    return (
      <li className="ce-change">
        <span className="ce-change-text">{p.text}</span>
        {p.hasVals ?
          <span className="ce-change-detail">
            <span className="ce-change-from">{p.from}</span>
            <span className="ce-change-arrow">→</span>
            <span className="ce-change-to">{p.to}</span>
          </span> : null}
      </li>);
  };
}

Object.assign(window, { EditMode, describeChanges, fieldLabel });
