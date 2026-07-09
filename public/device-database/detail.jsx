/* Device detail page */

/* One-line verdict for the connectivity pull-out. Dot colour follows the
   app's existing, non-alarmist convention (green local / quiet grey cloud). */
const verdictFor = (d) => {
  if (d.local === "always" && d.cloud !== "required")
    return { kind: "local", text: "Works without the cloud", color: "var(--success)" };
  if (d.local === "never" || d.cloud === "required")
    return { kind: "cloud", text: "Requires the manufacturer\u2019s cloud", color: "var(--neutral-400)" };
  return { kind: "mixed", text: "Works locally, with limits", color: "var(--warning)" };
};

const internetExplanation = (device) => {
  const needs = requiresInternet(device);
  if (!needs) {
    return {
      head: "Local connection",
      color: "var(--success)",
      body: "Reported to work on your local network, without an internet connection or a manufacturer account."
    };
  }
  return {
    head: "Yes, internet required",
    color: "var(--neutral-400)",
    body: "Reported to need an active internet connection to a manufacturer service to function."
  };
};

const Detail = ({ deviceId }) => {
  const device = window.DEVICES.find((d) => d.id === deviceId);
  const [versionsOpen, setVersionsOpen] = React.useState(false);
  // Edit-mode state (community-edit increment). Submitting an edit writes to
  // the pending store; it does not mutate the live record, so the read view
  // keeps showing the last approved data.
  // Opens straight in edit mode when arrived at via a "Continue editing" /
  // "Revise" action (those set window.__ceEditIntent before navigating here).
  const [editing, setEditing] = React.useState(() => {
    if (typeof window !== 'undefined' && window.__ceEditIntent === deviceId) {
      window.__ceEditIntent = null;
      return true;
    }
    return false;
  });
  // Resume-draft banner state (Stage 3 "A"). Subscribe to the draft store so
  // the banner appears/disappears live as drafts are saved or cleared.
  const [discardingDraft, setDiscardingDraft] = React.useState(false);
  if (window.useDrafts) window.useDrafts();
  // Stage 2 (read-only enrichment core): rich at-a-glance, contributor
  // prose, references, requirements, detailed specs.
  const dpOn = window.useIncrement ? window.useIncrement('device-pages') : false;
  // Photos and gallery: an independent Stage 2 increment.
  const photosOn = window.useIncrement ? window.useIncrement('photos') : false;
  // Stage 3 (accounts + editing): the Edit affordance and edit history.
  const ceOn = window.useIncrement ? window.useIncrement('community-edit') : false;
  // If the user toggles the increment off while editing, drop out of edit mode.
  React.useEffect(() => { if (!ceOn && editing) setEditing(false); }, [ceOn, editing]);

  // The Edit affordance is always shown when community-edit is on, signed in
  // or not. Guests get full edit mode; the submit step prompts them to sign
  // in and onboard (their draft is preserved). When the in-page Edit button
  // scrolls out of view, mirror it into the top nav.
  const user = window.useCurrentUser ? window.useCurrentUser() : null;
  const showEdit = ceOn;
  // The "Suggest an edit" action now lives in the persistent bottom action bar
  // (always visible, like the edit-mode save bar), so it's no longer mirrored
  // into the nav.
  if (window.useNavActionAnchor) window.useNavActionAnchor(null);
  // Drives the read action bar's "stuck" hairline, exactly like the edit save
  // bar: the hairline only shows while the bar floats over scrollable content,
  // and disappears once it settles at the end of the page.
  const [actionBarRef, actionBarSentinelRef, actionBarStuck] = window.useStuckBar
    ? window.useStuckBar()
    : [null, null, false];

  if (!device) {
    return (
      <div className="container" style={{ padding: "80px 0", textAlign: "center" }}>
        <div className="eyebrow" style={{ color: "var(--fg-muted)", marginBottom: 12 }}>404</div>
        <h1 style={{ marginBottom: 16 }}>Device not found.</h1>
        <p className="lede" style={{ margin: "0 auto 24px" }}>
          We don't have an entry for <code style={{ fontFamily: "var(--font-mono)" }}>{deviceId}</code>.
        </p>
        <a className="btn btn-primary" href="#/browse">Back to browse</a>
      </div>);

  }

  // Edit-mode short-circuit. When the user clicks Edit on the read-only
  // view, we swap the entire page for the EditMode component (edit-mode.jsx).
  // Submitting writes to the pending store, it does NOT mutate the live
  // record, so on returning here the read view still shows approved data.
  if (editing && window.EditMode) {
    return (
      <window.EditMode
        device={device}
        onCancel={() => setEditing(false)} />);
  }

  const cat = window.CATEGORY_LABEL[device.category];
  const internet = internetExplanation(device);
  const verdict = verdictFor(device);
  const lastVerifiedDate = (() => {
    if (!device.lastVerified) return null;
    return window.formatDate ? window.formatDate(device.lastVerified)
      : new Date(device.lastVerified).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  })();
  const firstSeenDate = (() => {
    if (!device.firstSeen) return null;
    return window.formatDate ? window.formatDate(device.firstSeen)
      : new Date(device.firstSeen).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  })();

  // Additional contributor sections render only when they have content and
  // the device-pages increment is on. Section numbers are assigned in
  // render order so hidden sections don't leave gaps in the 01 / 02 / … run.
  const showDesc = dpOn && window.hasDescription && window.hasDescription(device);
  const showRefs = dpOn && window.hasReferences && window.hasReferences(device);
  // Stage-2 additive UI that only makes sense on devices a contributor
  // has filled in: the header summary line and the requirements figure.
  const isPop = dpOn && window.isPopulated && window.isPopulated(device);

  // At-a-glance headline specs: the populated category-specific fields for
  // this device (a light's flux/colour temp, a camera's resolution, etc.).
  // These are the most differentiating facts, so they lead the summary card.
  const glanceCat = (device.specs && device.specs.cat) || {};
  const glanceFields = ((window.CATEGORY_SPECS && window.CATEGORY_SPECS[device.category]) || [])
    .filter((f) => window.hasSpecValue && window.hasSpecValue(f, glanceCat[f.key]))
    .slice(0, 4);

  return (
    <div data-screen-label="03 Device detail">      <div className="container detail-wrap">
        {/* Breadcrumb, with the community-edit Edit action pinned right.
            The action wrapper is hidden by CSS unless the increment is on. */}
        <div className="breadcrumb" aria-label="Breadcrumb">
          <a href="#/browse">Devices</a>
          <span className="sep">›</span>
          <a href={`#/browse?category=${device.category}`}>{cat}</a>
        </div>

        {/* Resume-draft banner: an unsubmitted local edit exists for this
            device. Lets the contributor pick it back up or throw it away. */}
        {showEdit && window.hasDraft && window.hasDraft(device.id) &&
        <window.Banner
          className="ce-banner-at-draft"
          icon="pencil"
          title="You have a draft not submitted"
          actions={<React.Fragment>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditing(true)}>Continue editing</button>
            <button type="button" className="ce-acct-quiet ce-acct-quiet-danger" onClick={() => setDiscardingDraft(true)}>Discard</button>
          </React.Fragment>}>
          {(window.draftFieldCount ? window.draftFieldCount(device.id) : 0)} edit{(window.draftFieldCount && window.draftFieldCount(device.id) === 1) ? '' : 's'} to this device.
        </window.Banner>}

        {/* Head: image + title + key badges. The name/manufacturer live in
            their own .detail-headline block so we can reorder it above the
            photo on mobile (CSS grid areas in .detail-head-read). */}
        <header className="detail-head detail-head-read">
          <div className="detail-headline">
            <h1>{device.name}</h1>
            <div className="detail-manu">
              by <a href={`#/browse?manufacturer=${encodeURIComponent(device.manufacturer)}`}>{device.manufacturer}</a>
            </div>
          </div>
          {(photosOn && device.photos && device.photos.length > 0) ?
            <window.PhotoGallery device={device} /> :
            <div className="detail-image" aria-label="Device image placeholder">
              <CategoryGlyph category={device.category} size={72} />
            </div>}
          <div className="detail-title">
            {device.summary && isPop &&
            <p className="article-standfirst article-standfirst-head" data-inc-target="device-pages">{device.summary}</p>
            }

            <div className="aside-card at-a-glance">
              <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "10px 32px", fontSize: "var(--fs-13)", alignItems: "baseline" }}>
                <span style={{ color: "var(--fg-muted)" }}>Connectivity</span>
                <span><InternetIndicator device={device} /></span>
                {dpOn && window.bridgeRequirements && window.bridgeRequirements((device.specs && device.specs.protocols) || {}, device.category).length > 0 &&
                <React.Fragment>
                  <span style={{ color: "var(--fg-muted)" }}>Bridge</span>
                  <span>Required</span>
                </React.Fragment>}
                {dpOn ? glanceFields.map((f) => {
                  const val = glanceCat[f.key];
                  let rendered;
                  if (f.control === "multi") {
                    rendered = <span style={{ display: "inline-flex", gap: 6, flexWrap: "wrap" }}>{(val || []).map((v) => <span key={v} className="mono">{v}</span>)}</span>;
                  } else {
                    rendered = window.fmtSpecValue ? window.fmtSpecValue(f, val) : String(val);
                  }
                  return (
                    <React.Fragment key={f.key}>
                      <span style={{ color: "var(--fg-muted)" }}>{f.label}</span>
                      <span style={{ wordBreak: "break-word" }}>{rendered}</span>
                    </React.Fragment>);
                }) :
                <>
                  <span style={{ color: "var(--fg-muted)" }}>Integration</span>
                  <span style={{ wordBreak: "break-word" }}>{device.haIntegration || "-"}</span>
                </>}
              </div>
            </div>
          </div>
        </header>

        {/* Body */}
        <div className="detail-body">
          <main className="article">
            {/* Description, contributor prose. Hidden when empty. */}
            {showDesc &&
            <section className="article-section">
              <h2>Overview</h2>
              <window.DescriptionRead device={device} />
            </section>
            }

            {/* Connectivity */}
            <section className="article-section">
              {window.DetailFigure &&
              <window.DetailFigure>
                <div className={"verdict verdict-" + verdict.kind} style={{ margin: 0, border: 0, padding: 0 }}>
                  <span className="verdict-dot" style={{ background: verdict.color }}></span>
                  <span className="verdict-text">{verdict.text}</span>
                </div>
                <p style={{ margin: "var(--space-4) 0 0" }}>{internet.body}</p>
                {window.RequirementsMatrix && isPop && device.specs && device.specs.connectivity &&
                Object.values(device.specs.connectivity).some(Boolean) &&
                <div data-inc-target="device-pages" style={{ marginTop: "var(--space-5)" }}>
                  <window.RequirementsMatrix device={device} />
                </div>}
              </window.DetailFigure>}
            </section>

            {/* Connects with — one tab per ecosystem marked compatible (stage 2).
                Replaces the former Home Assistant + Setup and installation
                sections. Flattens to a single block when only one ecosystem
                (Home Assistant) is compatible. Not gated behind any toggle. */}
            <section className="article-section">
              {window.ConnectsWith && <window.ConnectsWith device={device} />}
            </section>

            {/* Specifications table */}
            <section className="article-section">
              <h2>Specifications</h2>
              {dpOn ?
              <window.SpecsReadGroups device={device} onShowVersions={() => setVersionsOpen(true)} /> :
              <>
                <window.SpecGroup title="Ecosystems">
                  <dl style={{ margin: 0 }}>
                    <div className="trait-row"><dt>Home Assistant</dt><dd>{window.EcoMark ? <window.EcoMark on={true} /> : "Yes"}</dd></div>
                  </dl>
                </window.SpecGroup>
                <window.SpecGroup title="Product identifiers">
                  <dl style={{ margin: 0 }}>
                    <div className="trait-row"><dt>Model number</dt><dd><span className="mono">{device.model}</span></dd></div>
                  </dl>
                </window.SpecGroup>
                <window.SpecGroup title="Software version">
                  <dl style={{ margin: 0 }}>
                    <div className="trait-row"><dt>Current</dt><dd>{device.softwareVersion || "-"}{device.versionHistory && device.versionHistory.length > 0 && <button type="button" className="trait-version-link" style={{ marginLeft: 14 }} onClick={() => setVersionsOpen(true)}>Show version history</button>}</dd></div>
                  </dl>
                </window.SpecGroup>
              </>}
            </section>

            {/* References, external source links. Hidden when empty. */}
            {showRefs &&
            <section className="article-section">
              <h2>References</h2>
              <window.ReferencesRead device={device} />
            </section>
            }
          </main>

          {/* Sidebar */}
          <aside>
            <div className="aside-card aside-stats">
              <h4>Real-world data</h4>
              <dl className="aside-stat-list">
                <div className="aside-stat">
                  <dt>Reports</dt>
                  <dd>{device.reports.toLocaleString()}</dd>
                </div>
                <div className="aside-stat">
                  <dt>Installations</dt>
                  <dd>{device.installs.toLocaleString()}</dd>
                </div>
                <div className="aside-stat">
                  <dt>Last verified</dt>
                  <dd>{lastVerifiedDate || "-"}</dd>
                </div>
                {firstSeenDate &&
                <div className="aside-stat">
                    <dt>First seen</dt>
                    <dd>{firstSeenDate}</dd>
                  </div>
                }
              </dl>
              <p className="aside-stats-note">
                Anonymized telemetry from opt-in Home Assistant users. No accounts,
                no personal data, no tracking.
              </p>
              <p className="aside-source-linkrow">
                <a href="#/how-it-works" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  Learn about the methodology <Icon name="open" size={12} />
                </a>
              </p>
            </div>

            {/* Contributor edits, community-edit increment. Hidden by CSS
                when the increment is off; no-ops without editHistory data. */}
            <div data-inc-target="community-edit" className="aside-card aside-edits-card">
              {window.SidebarEditHistory && (device.editHistory || (window.pendingCount && window.pendingCount(device.id) > 0)) ?
                <window.SidebarEditHistory device={device} /> :
                null}
            </div>
          </aside>
        </div>

      </div>
      {showEdit &&
      <React.Fragment>
      <div className={'ce-action-bar ce-action-bar--read' + (actionBarStuck ? ' is-stuck' : '')} ref={actionBarRef} role="region" aria-label="Suggest an edit">
        <div className="ce-action-bar-inner">
          <button type="button" className="btn btn-secondary ce-action-bar-btn" onClick={() => setEditing(true)}>
            <Icon name="pencil" size={14} /> Suggest an edit
          </button>
        </div>
      </div>
      <div ref={actionBarSentinelRef} aria-hidden="true" style={{ height: 1 }} />
      </React.Fragment>}
      {versionsOpen && device.versionHistory &&
      <VersionHistoryDialog device={device} onClose={() => setVersionsOpen(false)} />
      }
      {window.ConfirmDialog &&
      <window.ConfirmDialog
        open={discardingDraft}
        title="Discard your draft?"
        message="Your unsubmitted edits to this device will be lost. This can’t be undone."
        confirmLabel="Discard draft"
        cancelLabel="Keep draft"
        danger
        onConfirm={() => { if (window.clearDraft) window.clearDraft(device.id); setDiscardingDraft(false); }}
        onCancel={() => setDiscardingDraft(false)} />
      }
    </div>);

};

const VersionHistoryDialog = ({ device, onClose }) => {
  // Desktop (≥1024px) renders a centred modal dialog; mobile/tablet renders
  // the same content as a slide-up bottom sheet, matching the filters UX.
  const [isSheet, setIsSheet] = React.useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches
  );
  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const onChange = (e) => setIsSheet(e.matches);
    mq.addEventListener ? mq.addEventListener("change", onChange) : mq.addListener(onChange);
    return () => {
      mq.removeEventListener ? mq.removeEventListener("change", onChange) : mq.removeListener(onChange);
    };
  }, []);

  // Bottom-sheet close animation (slide-down + fade), matches FiltersBottomSheet.
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
    document.body.classList.add("modal-open");
    const onKey = (e) => { if (e.key === "Escape") closeAnimated(); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("modal-open");
      document.removeEventListener("keydown", onKey);
    };
  }, [closeAnimated]);

  const fmt = (iso) => {
    if (!iso) return "-";
    return window.formatDate ? window.formatDate(iso)
      : new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const entries = [
    { version: device.softwareVersion || "-", date: device.lastVerified, current: true },
    ...device.versionHistory.map((v) => ({ version: v.version, date: v.lastSeen, current: false }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  const content = (
    <ol className="version-vtimeline">
      {entries.map((e, i) =>
        <li className={"vtl-item" + (e.current ? " is-current" : "")} key={e.version + i}>
          <span className="vtl-dot"></span>
          <div className="vtl-body">
            <div className="vtl-head">
              <span className="vtl-ver">{e.version}</span>
              {e.current && <span className="version-current">Current</span>}
            </div>
            <div className="vtl-date">{e.current ? "Last verified " : "Last seen "}{fmt(e.date)}</div>
          </div>
        </li>
      )}
    </ol>
  );

  if (isSheet) {
    return ReactDOM.createPortal(
      <div className={"sheet-backdrop" + (closing ? " is-closing" : "")}
        onClick={closeAnimated} role="presentation">
        <div className="sheet-panel"
          ref={panelRef}
          role="dialog" aria-modal="true" aria-label="Version history"
          onClick={(e) => e.stopPropagation()}
          style={{
            transform: dragY ? `translateY(${dragY}px)` : undefined,
            transition: "transform 200ms cubic-bezier(.2,.0,.2,1)"
          }}>
          <header className="sheet-head">
            <div className="sheet-head-row">
              <button type="button"
                className="sheet-back"
                onClick={closeAnimated}
                aria-label="Close version history">
                <Icon name="x" size={18} />
              </button>
              <h2 style={{ margin: 0, fontSize: "var(--fs-18)" }}>Version history</h2>
            </div>
          </header>
          <div className="sheet-body">{content}</div>
        </div>
      </div>,
      document.body);
  }

  return ReactDOM.createPortal(
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div className="modal-dialog"
      role="dialog" aria-modal="true"
      onClick={(e) => e.stopPropagation()}>
        <header className="modal-head">
          <div className="modal-head-row">
            <button className="modal-close" onClick={onClose} aria-label="Close">
              <Icon name="x" size={18} />
            </button>
            <h2>Version history</h2>
          </div>
        </header>
        <div className="modal-body">{content}</div>
      </div>
    </div>,
    document.body);
};

window.Detail = Detail;
window.verdictFor = verdictFor;
window.internetExplanation = internetExplanation;
window.VersionHistoryDialog = VersionHistoryDialog;