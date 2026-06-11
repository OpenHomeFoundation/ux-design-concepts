/* Shared UI: nav, footer, badges, device card, helpers. */

const navigate = (hash) => {
  window.location.hash = hash;
};

const useHashRoute = () => {
  const [hash, setHash] = React.useState(() => window.location.hash || "#/");
  React.useEffect(() => {
    const onChange = () => {
      setHash(window.location.hash || "#/");
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return hash;
};

const parseRoute = (hash) => {
  const raw = hash.replace(/^#\/?/, "");
  const [path, query] = raw.split("?");
  const params = new URLSearchParams(query || "");
  return { path, params };
};

/* Global search query, shared between the header search input and the
   Browse page's result filter. Source of truth is window.__q, with a custom
   event so any component can subscribe.

   The committed Browse query is surfaced as a removable chip, NOT echoed in
   the search bar, so the input always starts empty. Browse reads the query
   straight from the URL (route.params) for filtering, so links like
   #/browse?q=aqara still work, the term just shows as a chip. */
window.__q = "";

const useGlobalQuery = () => {
  const [q, setQ] = React.useState(window.__q);
  React.useEffect(() => {
    const onChange = (e) => setQ(e.detail);
    window.addEventListener("global-q-change", onChange);
    return () => window.removeEventListener("global-q-change", onChange);
  }, []);
  const update = React.useCallback((val) => {
    window.__q = val;
    window.dispatchEvent(new CustomEvent("global-q-change", { detail: val }));
  }, []);
  return [q, update];
};

/* ---------- Nav ---------- */

/* Hidden "Experiments" panel, registry of toggleable increments. The panel
   itself is reachable only by long-pressing the logo (see Brand). Mirrors the
   canvas "Experiments" sidebar so both surfaces stay consistent. Add future
   increments here and they appear automatically. */
const EXPERIMENTS = [
  {
    key: "foundation",
    number: "01",
    label: "Foundation",
    hint: "Browse, search, and read device information drawn from Home Assistant users who opt in to share which devices they run and how those devices behave. No personal data, no identifiers, no addresses. This is the baseline every later stage builds on.",
    locked: true,
    href: "Foundation%20-%20plan.html",
  },
  {
    key: "device-pages",
    number: "02",
    label: "Richer device pages",
    hint: "Editorially curated enrichment: a curated overview, references, requirements, and detailed specifications.",
    href: "Richer%20device%20pages%20-%20plan.html",
    // Increments build ON this stage and are independent of one another.
    children: [
      {
        key: "grid-view",
        label: "Browse grid view",
        hint: "A grid layout option on Browse, with a list and grid toggle. Cards lead with the device photo where one exists.",
        href: "Browse%20grid%20view%20-%20plan.html",
      },
      {
        key: "photos",
        label: "Photos and gallery",
        hint: "Curated device photos: a gallery on the device page and lead thumbnails on Browse cards.",
        href: "Photos%20and%20gallery%20-%20plan.html",
      },
      {
        key: "connects-with",
        label: "Connects with",
        hint: "Expands the Connects with section beyond Home Assistant to every ecosystem a device is marked compatible with, one tab each.",
        href: "Connects%20with%20-%20plan.html",
      },
    ],
  },
  {
    key: "community-edit",
    number: "03",
    label: "Accounts and editing",
    hint: "Builds on Richer device pages. Adds sign-in, settings, an edit mode for community members, and an edit history with attribution.",
    href: "Accounts%20and%20editing%20-%20plan.html",
    // Increments build ON this stage and are independent of one another.
    children: [
      {
        key: "contributor-profiles",
        label: "Contributor profiles and directory",
        hint: "Public profile pages and a browsable directory. Edit attributions link to a contributor's profile. With this off, they show as plain names.",
        href: "Contributor%20profiles%20and%20directory%20-%20plan.html",
      },
      {
        key: "notifications",
        label: "Notifications",
        hint: "How we tell you when a submitted edit is sent for review, goes live, or is declined. Choose email or GitHub (or off) in Settings. Powers the status updates shown on Your edits.",
        href: "Notifications%20-%20plan.html",
      },
      {
        key: "your-changes",
        label: "Your edits",
        hint: "One private dashboard, reached from a single nav icon, that merges the old inbox and changes tray: a timeline of your drafts, edits in review, what went live, and declined edits you can revise, with submit-all batching. Replaces the Changes tray.",
        href: "Your%20edits%20-%20plan.html",
      },
      {
        key: "trusted-sources",
        label: "Trusted reference sources",
        hint: "Outside data offered at the edit point, reviewed like any other edit.",
        planned: true,
        href: "Trusted%20reference%20sources%20-%20plan.html",
      },
    ],
  },
  {
    key: "device-variants",
    number: "04",
    label: "Variants and families",
    hint: "Group a product's regional and protocol variants under one family, with a variant switcher and verdict matrix on the device page. Power specs and identifiers bind to the regional variant.",
    planned: true,
    href: "Device%20variants%20and%20families%20-%20plan.html",
  },
  {
    key: "goal-based-discovery",
    number: "05",
    label: "Goal-based discovery",
    hint: "Browse by what you are trying to achieve, not only by category. Grows out of the quick-filter recipes.",
    planned: true,
    href: "Quick-filter%20recipes%20-%20plan.html",
  },
];

/* Appearance options, same three the canvas sidebar offers. */
const THEME_OPTIONS = [
  { id: "auto", label: "System" },
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
];

const LONG_PRESS_MS = 600;

/* Brand wordmark. A normal tap navigates home; pressing and holding for
   ~600ms opens the hidden Experiments dialog. The gesture is fully hidden -
   no affordance, and can't fire by accident (a home-click is instantaneous,
   and any pointer movement past a small threshold cancels the hold). */
const Brand = () => {
  const [expOpen, setExpOpen] = React.useState(false);
  const timerRef = React.useRef(null);
  const firedRef = React.useRef(false);
  const startRef = React.useRef(null);
  const [holding, setHolding] = React.useState(false);

  const clearTimer = () => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    setHolding(false);
  };

  const onPointerDown = (e) => {
    if (e.button != null && e.button > 0) return; // primary / touch only
    firedRef.current = false;
    startRef.current = { x: e.clientX, y: e.clientY };
    clearTimer();
    setHolding(true);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      firedRef.current = true;
      setHolding(false);
      setExpOpen(true);
    }, LONG_PRESS_MS);
  };
  const onPointerMove = (e) => {
    if (!startRef.current) return;
    const dx = Math.abs(e.clientX - startRef.current.x);
    const dy = Math.abs(e.clientY - startRef.current.y);
    if (dx > 10 || dy > 10) clearTimer(); // moved → scroll/drag, abort hold
  };
  const endPress = () => { clearTimer(); startRef.current = null; };
  const onClick = (e) => {
    // Swallow the navigation click that follows a completed long-press.
    if (firedRef.current) { e.preventDefault(); firedRef.current = false; }
  };
  const onContextMenu = (e) => {
    // Suppress the mobile press-and-hold context menu while our gesture owns
    // the press, so the long-press feels like a single deliberate action.
    if (timerRef.current || firedRef.current) e.preventDefault();
  };

  return (
    <React.Fragment>
      <a href="#/"
        className={"brand" + (holding ? " is-holding" : "")}
        aria-label="Open Home Device Database, home"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPress}
        onPointerLeave={endPress}
        onPointerCancel={endPress}
        onClick={onClick}
        onContextMenu={onContextMenu}>
        <span className="brand-name">Device Database</span>
      </a>
      {expOpen ? <ExperimentsDialog onClose={() => setExpOpen(false)} /> : null}
    </React.Fragment>);
};

/* The hidden Experiments panel. Desktop = centred modal; mobile/tablet =
   slide-up bottom sheet (matching FiltersBottomSheet / VersionHistoryDialog).
   Content mirrors the canvas "Experiments" sidebar: an Appearance theme
   control + the increment registry. Toggling writes through window.DemoState
   (set up in index.html), which persists + re-applies the data-* attrs live. */
const ExperimentsDialog = ({ onClose }) => {
  const getInc = () => (window.DemoState ? window.DemoState.getIncrements() : {});
  const getTheme = () => (window.DemoState && window.DemoState.getTheme ? window.DemoState.getTheme() : "auto");
  const [inc, setInc] = React.useState(getInc);
  const [theme, setThemeState] = React.useState(getTheme);

  // Track the OS color-scheme so the meta line can show what "System" resolves
  // to (and what an explicit choice overrides). Matches the canvas sidebar.
  const [osIsDark, setOsIsDark] = React.useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e) => setOsIsDark(e.matches);
    mq.addEventListener ? mq.addEventListener("change", onChange) : mq.addListener(onChange);
    return () => {
      mq.removeEventListener ? mq.removeEventListener("change", onChange) : mq.removeListener(onChange);
    };
  }, []);

  // Desktop (≥1024px) renders a modal; below that, a bottom sheet.
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

  // Bottom-sheet close animation (slide-down + fade).
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
    const onState = () => { setInc(getInc()); setThemeState(getTheme()); };
    document.addEventListener("keydown", onKey);
    window.addEventListener("devicedb:demostate", onState);
    return () => {
      document.body.classList.remove("modal-open");
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("devicedb:demostate", onState);
    };
  }, [closeAnimated]);

  const toggle = (key) => {
    const next = !inc[key];
    setInc((p) => ({ ...p, [key]: next }));
    if (window.DemoState) window.DemoState.setIncrement(key, next);
  };
  // Every toggleable stage + increment key (locked Foundation excluded — it is
  // always on). Powers the "Enable all" shortcut beside the Stages heading.
  const allIncKeys = React.useMemo(() => {
    const keys = [];
    EXPERIMENTS.forEach((it) => {
      if (!it.locked && !it.planned) keys.push(it.key);
      (it.children || []).forEach((c) => { if (!c.planned) keys.push(c.key); });
    });
    return keys;
  }, []);
  const allOn = allIncKeys.every((k) => !!inc[k]);
  const enableAll = () => {
    setInc((p) => {
      const next = { ...p };
      allIncKeys.forEach((k) => { next[k] = true; });
      return next;
    });
    if (window.DemoState) allIncKeys.forEach((k) => window.DemoState.setIncrement(k, true));
  };
  const disableAll = () => {
    setInc((p) => {
      const next = { ...p };
      allIncKeys.forEach((k) => { next[k] = false; });
      return next;
    });
    if (window.DemoState) allIncKeys.forEach((k) => window.DemoState.setIncrement(k, false));
  };
  const pickTheme = (id) => {
    setThemeState(id);
    if (window.DemoState && window.DemoState.setTheme) window.DemoState.setTheme(id);
  };
  const reset = () => {
    if (window.DemoState && window.DemoState.reset) window.DemoState.reset();
    setInc(getInc());
    setThemeState(getTheme());
  };

  const foot = (
    <footer className="exp-foot">
      <span>State persists across reloads.</span>
      <button type="button" className="exp-reset" onClick={reset}>
        Reset
      </button>
    </footer>);

  const body = (
    <React.Fragment>
      <p className="exp-intro">
        In-progress features. Settings are saved to this browser only.
      </p>

      <section className="exp-section">
        <h3 className="exp-section-title">Appearance</h3>
        <div className="exp-seg" role="radiogroup" aria-label="Theme">
          {THEME_OPTIONS.map((opt) =>
            <button key={opt.id} type="button" role="radio"
              aria-checked={theme === opt.id}
              className={"exp-seg-btn" + (theme === opt.id ? " is-active" : "")}
              onClick={() => pickTheme(opt.id)}>
              {opt.label}
            </button>)}
        </div>
        <p className="exp-seg-meta">
          {theme === "auto" ?
            <React.Fragment>System preference: <b>{osIsDark ? "Dark" : "Light"}</b></React.Fragment> :
            <React.Fragment>Overrides system preference (currently <b>{osIsDark ? "Dark" : "Light"}</b>).</React.Fragment>}
        </p>
      </section>

      <section className="exp-section">
        <div className="exp-section-head">
          <h3 className="exp-section-title">Stages</h3>
          <button type="button" className="exp-enable-all" onClick={allOn ? disableAll : enableAll}>
            {allOn ? "Disable all" : "Enable all"}
          </button>
        </div>
        <ul className="exp-list">
          {EXPERIMENTS.map((it) => {
            const locked = !!it.locked;
            const planned = !!it.planned;
            const on = locked ? true : (planned ? false : !!inc[it.key]);
            const rowText = (
              <div className="exp-row-text">
                <span className="exp-row-num">{it.number}</span>
                <span className="exp-row-name">{it.label}{planned ? <span className="exp-plan-pill">Planned</span> : null}</span>
                <span className="exp-row-hint">{it.hint}{it.href ? <React.Fragment> <a className="exp-plan-link" href={it.href} target="_blank" rel="noopener">Read the plan</a></React.Fragment> : null}</span>
              </div>);
            return (
              <li key={it.key} className="exp-item">
                {locked ?
                <div className="exp-row is-locked">{rowText}</div> :
                planned ?
                <div className="exp-row is-planned">
                    {rowText}
                    <span className="exp-row-switch">
                      <span className="switch is-disabled">
                        <input type="checkbox" checked={false} disabled readOnly
                          aria-label={it.label + " — planned, not built yet"} />
                        <span className="switch-track"></span>
                        <span className="switch-thumb"></span>
                      </span>
                    </span>
                  </div> :
                <label className="exp-row">
                    {rowText}
                    <span className="exp-row-switch">
                      <span className={"switch" + (on ? " is-on" : "")}>
                        <input type="checkbox" checked={on}
                          onChange={() => toggle(it.key)}
                          aria-label={it.label} />
                        <span className="switch-track"></span>
                        <span className="switch-thumb"></span>
                      </span>
                    </span>
                  </label>}
                {on && it.children && it.children.length > 0 &&
                <div className="exp-children">
                    <div className="exp-children-label">Increments</div>
                    {it.children.map((child) => {
                    if (child.planned) {
                      return (
                        <div key={child.key} className="exp-row exp-row-child is-planned">
                          <div className="exp-row-text">
                            <span className="exp-row-name">{child.label} <span className="exp-plan-pill">Planned</span></span>
                            <span className="exp-row-hint">{child.hint}{child.href ? <React.Fragment> <a className="exp-plan-link" href={child.href} target="_blank" rel="noopener">Read the plan</a></React.Fragment> : null}</span>
                          </div>
                          <span className="exp-row-switch">
                            <span className="switch is-disabled">
                              <input type="checkbox" checked={false} disabled readOnly
                                aria-label={child.label + " — planned, not built yet"} />
                              <span className="switch-track"></span>
                              <span className="switch-thumb"></span>
                            </span>
                          </span>
                        </div>);
                    }
                    const childOn = !!inc[child.key];
                    return (
                      <label key={child.key} className="exp-row exp-row-child">
                          <div className="exp-row-text">
                            <span className="exp-row-name">{child.label}</span>
                            <span className="exp-row-hint">{child.hint}{child.href ? <React.Fragment> <a className="exp-plan-link" href={child.href} target="_blank" rel="noopener">Read the plan</a></React.Fragment> : null}</span>
                          </div>
                          <span className="exp-row-switch">
                            <span className={"switch" + (childOn ? " is-on" : "")}>
                              <input type="checkbox" checked={childOn}
                            onChange={() => toggle(child.key)}
                            aria-label={child.label} />
                              <span className="switch-track"></span>
                              <span className="switch-thumb"></span>
                            </span>
                          </span>
                        </label>);

                  })}
                  </div>}
              </li>);
          })}
        </ul>
      </section>

      <section className="exp-section">
        <h3 className="exp-section-title">Reference</h3>
        <ul className="exp-doclist">
          <li>
            <a className="exp-doclink" href="wiki/Device%20Database%20Contributor%20Wiki.html" target="_blank" rel="noopener">
              <span className="exp-doclink-main">
                <span className="exp-doclink-title">Contributor wiki</span>
                <span className="exp-doclink-sub">The project explained, end to end</span>
              </span>
              <Icon name="open" size={14} />
            </a>
          </li>
        </ul>
      </section>
    </React.Fragment>);

  if (isSheet) {
    return ReactDOM.createPortal(
      <div className={"sheet-backdrop" + (closing ? " is-closing" : "")}
        onClick={closeAnimated} role="presentation">
        <div className="sheet-panel exp-sheet"
          ref={panelRef}
          role="dialog" aria-modal="true" aria-label="Experiments"
          onClick={(e) => e.stopPropagation()}
          style={{
            transform: dragY ? `translateY(${dragY}px)` : undefined,
            transition: "transform 200ms cubic-bezier(.2,.0,.2,1)"
          }}>
          <header className="sheet-head">
            <div className="sheet-head-row">
              <button type="button" className="sheet-back" onClick={closeAnimated}
                aria-label="Close experiments">
                <Icon name="x" size={18} />
              </button>
              <h2 className="sheet-title">Experiments</h2>
            </div>
          </header>
          <div className="sheet-body">
            <div className="exp-pad">{body}{foot}</div>
          </div>
        </div>
      </div>,
      document.body);
  }

  return ReactDOM.createPortal(
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div className="exp-dialog"
        role="dialog" aria-modal="true" aria-label="Experiments"
        onClick={(e) => e.stopPropagation()}>
        <header className="modal-head">
          <div className="modal-head-row">
            <button className="modal-close" onClick={onClose} aria-label="Close">
              <Icon name="x" size={18} />
            </button>
            <h2>Experiments</h2>
          </div>
        </header>
        <div className="exp-body">{body}{foot}</div>
      </div>
    </div>,
    document.body);
};


const Nav = ({ route }) => {
  // SearchBox is defined in searchbox.jsx, grab from window at call time so
  // we don't depend on script-file evaluation order.
  const SearchBox = window.SearchBox;
  // The landing page IS the entry-point search, hide the header search there.
  // The hero search is visible at every breakpoint on landing, and on
  // mobile/tablet it opens the same fullscreen overlay the header search uses
  // elsewhere. The sign-in page is a focused task, no search or account chrome.
  const isSignin = route.path === "signin" || route.path === "signup";
  // On the Settings page the avatar (which only deep-links to Settings) is
  // redundant, so we swap it for a visible "Sign out" chip in the nav — that
  // way sign-out has a clear, always-visible home instead of hiding at the
  // foot of the settings sidebar.
  const isAccount = route.path === "settings" || route.path.startsWith("settings/");
  const showSearch = route.path !== "" && !isSignin;
  const [scrolled, setScrolled] = React.useState(() => window.scrollY > 0);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={"appnav" + (scrolled ? " is-scrolled" : "")} data-screen-label="nav">
      <div className="container appnav-inner">
        <div className="appnav-left">
          <Brand />
        </div>
        {showSearch && SearchBox ? <SearchBox size="header" /> : <div />}
        {/* Community-edit increment, user menu / sign-in. Hidden by CSS
             unless <html data-inc-community-edit="on">. */}
        <div data-inc-target="community-edit" className="appnav-account">
          {!isSignin && window.UserMenu ?
              <React.Fragment>
                {window.NavPrimaryAction ? <window.NavPrimaryAction /> : null}
                {window.YourChangesNavButton ? <window.YourChangesNavButton /> : null}
                {isAccount && window.NavSignOut ? <window.NavSignOut /> : <window.UserMenu />}
              </React.Fragment> : null}
        </div>
      </div>
    </header>);

};

/* ---------- Footer ---------- */
const Footer = ({ flush = false }) =>
<footer className={"appfoot appfoot-flat" + (flush ? " appfoot-flush" : "")}>
    <div className="container appfoot-row">
      <ul className="appfoot-links">
        <li><a href="#/browse">Browse</a></li>
        <li><a href="#/how-it-works">How it works</a></li>
        <li><a href="#/editorial-stance">Editorial stance</a></li>
        <li data-inc-target="contributor-profiles"><a href="#/contributors">Contributors</a></li>
      </ul>
      <span className="appfoot-legal-inline">© 2026 <a className="appfoot-legal-link" href="#/">Open Home Foundation</a> · Preview edition

    </span>
    </div>
  </footer>;


/* ---------- Internet dependency ---------- */
/* A device "requires internet" unless it can be controlled fully locally
   AND doesn't require a manufacturer cloud account. */
const requiresInternet = (d) =>
!(d.local === "always" && d.cloud !== "required");

const InternetBadge = ({ device }) => {
  const needs = requiresInternet(device);
  return (
    <span className={"badge " + (needs ? "internet-yes" : "internet-no")}>
      {needs ? "Requires internet" : "Local connection"}
    </span>);

};

const InternetIndicator = ({ device }) => {
  const needs = requiresInternet(device);
  return (
    <span className={"local-indicator " + (needs ? "net-yes" : "net-no")}>
      <span className="dot"></span>
      {needs ? "Requires internet" : "Local connection"}
    </span>);

};

/* ---------- Device card ----------
   When the device-pages increment is on AND the device has photos,
   the thumbnail shows the first photo (real URL or styled placeholder).
   Otherwise, the existing category glyph stands in. Hook reactive so
   thumbs swap live when the canvas sidebar toggles the increment. */
const DeviceCard = ({ device }) => {
  const photosOn = window.useIncrement ? window.useIncrement('photos') : false;
  const showPhoto = photosOn && device.photos && device.photos.length > 0;
  const firstPhoto = showPhoto ? device.photos[0] : null;
  const isUrl = typeof firstPhoto === 'string' && !firstPhoto.startsWith('placeholder:');
  return (
    <a className="device-card" href={`#/device/${device.id}`}>
      <div className="device-card-inner">
        <div className={"device-thumb" + (showPhoto && isUrl ? " has-photo" : "")}>
          {showPhoto && isUrl ?
          <img src={firstPhoto} alt="" loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} /> :
          showPhoto && window.PhotoPlaceholder ?
          <window.PhotoPlaceholder
            id={firstPhoto + ':' + device.id + ':0'}
            category={device.category}
            alt="" /> :

          <CategoryGlyph category={device.category} size={40} />
          }
        </div>
        <div className="device-card-body">
          <div className="device-category">{window.CATEGORY_LABEL[device.category]}</div>
          <div className="device-name">{device.name}</div>
          <div className="device-manu">{device.manufacturer}</div>
          <div className="device-badges">
            <InternetIndicator device={device} />
          </div>
        </div>
      </div>
    </a>);

};

// ─────────────────────────────────────────────────────────────────────
// Edit-history change lines, shared across every history surface (detail
// page, "View all" dialog, contributor profile, edit preview). Each change
// reads as one plain sentence per bullet. Field keys are turned into UI
// nouns here, the ONLY surviving chip is the before/after value pair.
// ─────────────────────────────────────────────────────────────────────
const CHANGE_NOUN = {
  name: 'the device name',
  summary: 'the summary',
  description: 'the description',
  instructions: 'the setup instructions',
  photos: 'photos',
  ecosystems: 'ecosystems and apps',
  connectivity: 'connectivity',
  protocols: 'connectivity',
  bridge: 'the bridge requirement',
  connectsWith: 'what it connects with',
  dimensions: 'the dimensions',
  identifiers: 'the product identifiers',
  references: 'references',
  softwareVersion: 'the software version',
  lastVerified: 'the last verified date',
  entityTypes: 'the entity types',
  haIntegration: 'the Home Assistant integration',
  local: 'local control',
  cloud: 'cloud reliance',
  device: 'the device'
};
function _prettyKey(k) {
  return String(k).replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toLowerCase()).trim();
}
// Field key → lowercase noun phrase suitable for the middle of a sentence.
function changeNoun(key) {
  if (!key) return 'a field';
  if (String(key).indexOf('spec:') === 0) {
    const k = key.slice(5);
    const specs = (typeof window !== 'undefined' && window.CATEGORY_SPECS) || {};
    for (const cat in specs) {
      const hit = (specs[cat] || []).find((f) => f.key === k);
      if (hit && hit.label) return String(hit.label).toLowerCase();
    }
    return _prettyKey(k);
  }
  if (CHANGE_NOUN[key]) return CHANGE_NOUN[key];
  // Already-human label or unknown key: lowercase the first character so it
  // sits cleanly after the verb.
  const s = String(key);
  return s.charAt(0).toLowerCase() + s.slice(1);
}
// Returns the parts a change line renders: a sentence string, plus the
// before/after values (the one place a chip is still warranted).
function changeLineParts(change) {
  const verb = change.verb || 'updated';
  const Verb = verb.charAt(0).toUpperCase() + verb.slice(1);
  const noun = changeNoun(change.field);
  const hasVals = change.from !== undefined && change.to !== undefined;
  const norm = (v) => { const s = v == null ? '' : String(v); return s === '' ? '-' : s; };
  let text;
  if (change.field === 'photos') {
    text = /reorder/i.test(change.detail || '')
      ? 'Reordered photos'
      : `${Verb} ${change.detail || 'photos'}`;
  } else if (hasVals) {
    text = `${Verb} ${noun}`;
  } else if (change.detail) {
    text = `${Verb} ${noun}, ${change.detail}`;
  } else {
    text = `${Verb} ${noun}`;
  }
  return { text, hasVals, from: norm(change.from), to: norm(change.to) };
}

// ─────────────────────────────────────────────────────────────────────
// Banner — the single inline-notice component used across the app
// (private-profile, account nudges, missing-email, resume-draft, …).
//
// Design-system rules, applied everywhere:
//   · Icon sits top-left with NO background, optically aligned to the
//     title's first line. Pass an icon name (icons.jsx) or omit it.
//   · Title sits ABOVE the description, never inline with it.
//   · Optional actions sit on the RIGHT when they fit on the title row,
//     and wrap to their own line BELOW the description when space is tight
//     (pure CSS flex-wrap, driven by the banner's own width).
//   · One neutral treatment: warm-paper fill + hairline border. No accent
//     fills or coloured left rails.
//
// Props:
//   icon        icon name string (icons.jsx) — rendered without a chip
//   iconSize    px, default 18 · strokeWidth  default 2
//   title       bold title node (shown above the description)
//   children    description / body content
//   actions     node placed in the actions slot (buttons, links)
//   role        ARIA role, default "note"
//   className   extra classes for context spacing/placement
// ─────────────────────────────────────────────────────────────────────
const Banner = ({ icon, iconSize = 18, strokeWidth = 2, title, children, actions, role = "note", className = "" }) =>
  <div className={"ce-banner" + (className ? " " + className : "")} role={role}>
    {icon ?
      <span className="ce-banner-ico" aria-hidden="true">
        <Icon name={icon} size={iconSize} strokeWidth={strokeWidth} />
      </span> : null}
    <div className="ce-banner-main">
      <div className="ce-banner-body">
        {title ? <b className="ce-banner-title">{title}</b> : null}
        {children != null ? <span className="ce-banner-desc">{children}</span> : null}
      </div>
      {actions ? <div className="ce-banner-actions">{actions}</div> : null}
    </div>
  </div>;

Object.assign(window, {
  navigate, useHashRoute, parseRoute, useGlobalQuery,
  Nav, Footer, Brand, Banner,
  requiresInternet, InternetBadge, InternetIndicator,
  DeviceCard,
  changeNoun, changeLineParts
});