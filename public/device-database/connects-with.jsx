/* Connects with — device detail page (stage 2).

   Replaces the old "Home Assistant" + "Setup and installation" sections with
   a single "Connects with" section. One tab per ecosystem marked compatible in
   the Ecosystems group (specs.ecosystems[key] === true). Home Assistant is
   compatible on every device, so there is always at least one tab; with a
   single tab the read view flattens (no tab bar).

   Each tab shows the integration name + link (where applicable), a
   documentation link (where applicable), and setup instructions. Instructions
   are pre-filled from a protocol × ecosystem template (see data.js); a
   multi-protocol device gets one setup section per protocol, each under its
   own subheader. Contributors edit/extend/leave at the device level.

   Template look-ups + the override/merge live in data.js:
     window.connectsWithTabs / connectsWithResolve / connectsWithDefaultSections
   Components here render the result.

   Depends on globals from icons.jsx + edit-fields.jsx (loaded earlier):
     Icon, Paragraphs, EcoMark, InfoHint, CtrlText, FieldShell
*/

// ─────────────────────────────────────────────────────────────────────
// CwTabScroller, wraps the ecosystem tab bar. On narrow viewports the bar
// scrolls horizontally; this renders the tablist plus edge fades that
// appear only on the side(s) where more tabs are hidden, so the overflow
// is discoverable. Edge state is derived from scroll position and kept in
// sync on scroll/resize.
// ─────────────────────────────────────────────────────────────────────
function CwTabScroller({ children }) {
  const ref = React.useRef(null);
  const [edge, setEdge] = React.useState({ start: false, end: false });
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const start = el.scrollLeft > 1;
      const end = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
      setEdge((p) => (p.start === start && p.end === end ? p : { start, end }));
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    // Re-measure after layout settles (glyph images, font metrics).
    const t = setTimeout(update, 80);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      clearTimeout(t);
    };
  }, [children]);
  return (
    <div className={'cw-tabs-wrap' + (edge.start ? ' is-start' : '') + (edge.end ? ' is-end' : '')}>
      <div className="cw-tabs" role="tablist" aria-label="Connects with" ref={ref}>
        {children}
      </div>
    </div>);
}

// ─────────────────────────────────────────────────────────────────────
// Read view
// ─────────────────────────────────────────────────────────────────────
// Auto-populated, read-only Home Assistant block: integration (with link),
// supported entities, and documentation, all sourced from the core dataset.
// Shared by the read view and the edit view (where `hint` shows the locked
// note). Empty fields are simply omitted.
function ConnectsWithAuto({ auto, hint }) {
  const a = auto;
  if (!a) return null;
  const hasMeta = a.integrationName || (a.entities && a.entities.length);
  if (!hasMeta && !a.docsLink) return null;
  return (
    <React.Fragment>
      {hasMeta &&
      <dl className="cw-meta">
        {a.integrationName &&
        <div className="cw-meta-row">
          <dt>Integration</dt>
          <dd>{a.integrationName}{hint || null}</dd>
        </div>}
        {a.entities && a.entities.length > 0 &&
        <div className="cw-meta-row">
          <dt>Supported entities</dt>
          <dd><span className="cw-entities">{a.entities.map((et) => <span key={et} className="mono">{et}</span>)}</span>{hint || null}</dd>
        </div>}
      </dl>}
      {a.docsLink &&
      <div className="cw-doclink-ctas">
        <p className="cw-doclink-cta">
          <a href={a.docsLink.href} target="_blank" rel="noopener noreferrer">{'Read the ' + a.docsLink.label} <Icon name="open" size={12} /></a>
        </p>
      </div>}
    </React.Fragment>);
}

// One ecosystem tab's read view. Fixed field order:
//   [Home Assistant only] Integration · Supported entities · Documentation
//   Setup instructions · Known limitations · Documentation (contributor)
// Empty fields are hidden here; all of them are shown in the editor.
// `showContributor === false` is the stage-1 (foundation) view: Home Assistant
// only, auto-populated fields just, no contributor content.
function ConnectsWithPanel({ device, ecoKey, showContributor }) {
  const r = window.connectsWithResolve(device, ecoKey);
  const hasSetup = r.setup && r.setup.trim();
  const hasLimits = r.limitations && r.limitations.trim();
  // With only one prose section populated, the heading is redundant; show
  // titles only when both appear, so they can be told apart.
  const showTitles = !!hasSetup && !!hasLimits;
  return (
    <div className="cw-content">
      {showContributor !== false &&
      <React.Fragment>
        {hasSetup &&
        <div className="cw-section">
          {showTitles && <h3 className="cw-section-title">Setup instructions</h3>}
          <div className="article-prose"><Paragraphs text={r.setup} /></div>
        </div>}
        {hasLimits &&
        <div className="cw-section">
          {showTitles && <h3 className="cw-section-title">Known limitations</h3>}
          <div className="article-prose"><Paragraphs text={r.limitations} /></div>
        </div>}
      </React.Fragment>}
      <ConnectsWithAuto auto={r.auto} />
      {showContributor !== false && r.ecoKey !== 'homeAssistant' && r.docsLink &&
      <div className="cw-doclink-ctas">
        <p className="cw-doclink-cta">
          <a href={r.docsLink.href} target="_blank" rel="noopener noreferrer">{'Read the ' + r.docsLink.label} <Icon name="open" size={12} /></a>
        </p>
      </div>}
    </div>);
}

function ConnectsWith({ device }) {
  // The multi-ecosystem Connects with section is a Stage 2 increment
  // (independent of the others). With the increment off (baseline / Stage 1
  // Foundation) the page shows only Home Assistant and its reported content:
  // integration, entity types, and documentation, with no other ecosystems
  // and no contributor setup instructions.
  const multiEco = window.useIncrement ? window.useIncrement('connects-with') : false;
  const allTabs = window.connectsWithTabs(device);
  const tabs = multiEco ? allTabs : ['homeAssistant'];
  const [active, setActive] = React.useState(tabs[0]);
  // Keep the active tab valid if the device (or its compatibility) changes.
  React.useEffect(() => {
    if (tabs.indexOf(active) === -1) setActive(tabs[0]);
  }, [device.id, tabs.join('|')]);

  if (tabs.length === 0) return null; // Home Assistant is always true, so unreachable.

  // Single ecosystem (always Home Assistant): no tab bar. The heading carries
  // the ecosystem name ("Connects with Home Assistant") instead of a checkmark.
  // This is also the whole of the stage 1 view (Home Assistant only).
  if (tabs.length === 1) {
    return (
      <React.Fragment>
        <div className="cw-flat-head">
          <window.EcoGlyph name={tabs[0]} label={window.connectsWithEcoLabel(tabs[0])} />
          <h2>Connects with {window.connectsWithEcoLabel(tabs[0])}</h2>
        </div>
        <div className="connects-with connects-with-flat">
          <ConnectsWithPanel device={device} ecoKey={tabs[0]} showContributor={multiEco} />
        </div>
      </React.Fragment>);
  }

  const current = tabs.indexOf(active) === -1 ? tabs[0] : active;
  return (
    <React.Fragment>
      <h2>Connects with</h2>
      <div className="connects-with">
        <CwTabScroller>
          {tabs.map((k) =>
          <button key={k} type="button" role="tab" aria-selected={k === current}
            className={'cw-tab' + (k === current ? ' is-active' : '')}
            onClick={() => setActive(k)}>
            <window.EcoGlyph name={k} label={window.connectsWithEcoLabel(k)} />
            <span className="cw-tab-label">{window.connectsWithEcoLabel(k)}</span>
          </button>)}
        </CwTabScroller>
        <div className="cw-panel" role="tabpanel">
          <ConnectsWithPanel device={device} ecoKey={current} showContributor={multiEco} />
        </div>
      </div>
    </React.Fragment>);
}

// ─────────────────────────────────────────────────────────────────────
// Edit view
// ─────────────────────────────────────────────────────────────────────
// One editable block per compatible ecosystem. Every tab has the same fixed
// fields: Setup instructions, Known limitations, and Documentation (all
// contributor-editable). The Home Assistant tab additionally shows an
// auto-populated, read-only block (integration, supported entities,
// documentation) collected from the core dataset. Contributors cannot add,
// remove, or reorder fields. Compatibility itself is toggled in the Ecosystems
// editor (Specifications section); adding or removing a tab here happens by
// flipping that toggle.
// A locked (awaiting-review) Connects with field: label, the submitted value in a
// dashed box, and the submitted-by meta below. Multiline values (setup,
// limitations) render as paragraphs; a documentation URL renders as text.
function CWLockedField({ label, value, entry, multiline }) {
  const empty = value == null || value === '';
  return (
    <div className="ce-field ce-field-pending" aria-disabled="true">
      <div className="ce-field-label-row"><span className="ce-field-label">{label}</span></div>
      <div className="ce-pending-box">
        {multiline ?
          <div className="ce-pending-text"><Paragraphs text={value} /></div> :
          <span className={empty ? 'ce-pending-empty' : ''}>{empty ? '-' : value}</span>}
      </div>
      {window.PendingMeta ? <window.PendingMeta entry={entry} /> : null}
    </div>);
}

function ConnectsWithEditor({ ctx }) {
  const stored = ctx.getVal('connectsWith') || {};
  // A draft-shaped device so template resolution reflects in-progress edits
  // to protocols / ecosystems / instructions, not just the approved record.
  const draftDevice = {
    ...ctx.device,
    instructions: ctx.getVal('instructions'),
    specs: {
      ...(ctx.device.specs || {}),
      protocols: ctx.getVal('protocols'),
      ecosystems: ctx.getVal('ecosystems'),
      connectsWith: stored
    }
  };
  // Pending submissions on this device. A contributor can submit Connects with
  // content (setup, limitations, documentation) for an ecosystem and/or
  // propose new compatibility in the Ecosystems group. Either makes the
  // ecosystem appear as an awaiting-review tab; submitted fields render locked.
  const ecoPendingEntry = ctx.pending && ctx.pending.ecosystems;
  const pendEcoVal = ecoPendingEntry ? (ecoPendingEntry.value || {}) : {};
  const cwPendEntry = ctx.pending && ctx.pending.connectsWith;
  const cwPendVal = cwPendEntry ? (cwPendEntry.value || {}) : {};
  const draftEco = ctx.getVal('ecosystems') || {};
  // Ecosystems not yet live (compatibility false/absent) but with a pending
  // submission — proposed compatibility and/or pending Connects with content.
  const pendingTabs = (window.CONNECTS_WITH_ECOSYSTEMS || []).filter(
    (k) => draftEco[k] !== true && (pendEcoVal[k] === true || !!cwPendVal[k]));
  const tabDevice = pendingTabs.length
    ? { ...draftDevice, specs: { ...draftDevice.specs, ecosystems: { ...draftEco, ...Object.fromEntries(pendingTabs.map((k) => [k, true])) } } }
    : draftDevice;
  const tabs = window.connectsWithTabs(tabDevice);
  const isPendingTab = (k) => pendingTabs.indexOf(k) !== -1;
  const [active, setActive] = React.useState(tabs[0]);
  // Keep the active tab valid if a contributor toggles an ecosystem on/off.
  React.useEffect(() => {
    if (tabs.indexOf(active) === -1) setActive(tabs[0]);
  }, [tabs.join('|')]);

  const setEcoField = (ecoKey, patch) => {
    const cur = stored[ecoKey] || {};
    ctx.setVal('connectsWith', { ...stored, [ecoKey]: { ...cur, ...patch } });
  };
  // A Connects with field is locked when a contributor's pending submission for
  // that ecosystem includes it (awaiting review).
  const cwLocked = (ecoKey, field) => {
    const ev = cwPendVal[ecoKey];
    return !!ev && Object.prototype.hasOwnProperty.call(ev, field);
  };

  // One ecosystem's editor block. The field set is fixed (no add / remove /
  // reorder). Fields with a pending submission render locked (boxed value +
  // submitted-by); the rest stay editable. Home Assistant also shows its
  // read-only auto block.
  const renderEco = (ecoKey, showHead) => {
    const r = window.connectsWithResolve(tabDevice, ecoKey);
    const isHA = ecoKey === 'homeAssistant';
    const ev = cwPendVal[ecoKey] || {};
    return (
      <div className="cw-edit-eco" key={ecoKey}>
        {showHead ? <div className="ce-subhead cw-edit-eco-head">{r.label}</div> : null}

        {cwLocked(ecoKey, 'setup') ?
        <CWLockedField label="Setup instructions" value={ev.setup} entry={cwPendEntry} multiline /> :
        <label className="ce-field" htmlFor={'ce-cw-setup-' + ecoKey}>
          <span className="ce-field-label">Setup instructions</span>
          <textarea id={'ce-cw-setup-' + ecoKey} className="ce-textarea" rows={6}
            placeholder="Setup steps for this ecosystem. Leave a blank line between paragraphs."
            value={r.setup || ''}
            onChange={(e) => setEcoField(ecoKey, { setup: e.target.value })} />
        </label>}

        {cwLocked(ecoKey, 'limitations') ?
        <CWLockedField label="Known limitations" value={ev.limitations} entry={cwPendEntry} multiline /> :
        <label className="ce-field" htmlFor={'ce-cw-limits-' + ecoKey}>
          <span className="ce-field-label">Known limitations</span>
          <textarea id={'ce-cw-limits-' + ecoKey} className="ce-textarea" rows={4}
            placeholder="Known limitations or caveats with this ecosystem. Leave blank if there are none."
            value={r.limitations || ''}
            onChange={(e) => setEcoField(ecoKey, { limitations: e.target.value })} />
        </label>}

        {isHA ?
        <div className="cw-edit-ha">
          <ConnectsWithAuto auto={r.auto} hint={<InfoHint text="Collected from Home Assistant. Contributors can't edit this." />} />
        </div> : null}

        {isHA ? null :
        cwLocked(ecoKey, 'docsUrl') ?
        <CWLockedField label="Documentation" value={ev.docsUrl} entry={cwPendEntry} /> :
        <label className="ce-field" htmlFor={'ce-cw-docs-' + ecoKey}>
          <span className="ce-field-label">Documentation</span>
          <CtrlText id={'ce-cw-docs-' + ecoKey} value={r.docsUrl} placeholder="https://…"
            onChange={(v) => setEcoField(ecoKey, { docsUrl: v })} />
        </label>}
      </div>);
  };

  const current = tabs.indexOf(active) === -1 ? tabs[0] : active;
  const single = tabs.length <= 1;

  return (
    <FieldShell ctx={ctx} fieldKey="connectsWith" label="Connects with" selfLock>
      <p className="ce-field-help" style={{ marginTop: 0 }}>
        {single ?
          'Setup steps are pre-filled from a protocol template. Edit them or leave the defaults as they are. The set of fields is fixed.' :
          'One tab per ecosystem marked compatible in the Ecosystems group below. Setup steps are pre-filled from a protocol template. Edit them or leave the defaults as they are.'}
      </p>
      {single ?
      <div className="cw-editor">{renderEco(tabs[0], true)}</div> :
      <div className="cw-editor">
        <CwTabScroller>
          {tabs.map((k) =>
          <button key={k} type="button" role="tab" aria-selected={k === current}
            className={'cw-tab' + (k === current ? ' is-active' : '') + (isPendingTab(k) ? ' cw-tab-pending' : '')}
            onClick={() => setActive(k)}>
            <window.EcoGlyph name={k} label={window.connectsWithEcoLabel(k)} />
            <span className="cw-tab-label">
              {window.connectsWithEcoLabel(k)}
              {isPendingTab(k) ? <span className="cw-tab-dot" aria-hidden="true" /> : null}
            </span>
          </button>)}
        </CwTabScroller>
        <div className="cw-panel">{renderEco(current, false)}</div>
      </div>}
    </FieldShell>);
}

Object.assign(window, { ConnectsWith, ConnectsWithPanel, ConnectsWithEditor });
