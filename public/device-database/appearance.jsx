/* Appearance settings tab — Stage 03 (Accounts and editing).

   Theme (System / Light / Dark preview cards), then Display (high contrast
   per mode + dim device photos) and Behavior (reduce motion + show
   hovercards). Reads and writes through window.DemoState, which persists to
   localStorage and writes the data-* flags the boot script and stylesheets
   key off. Changes apply immediately — no Save button. */

function ApMiniWin({ tone }) {
  return (
    <span className={'appx-win appx-' + tone}>
      <span className="appx-win-top"><i></i><i></i><i></i></span>
      <span className="appx-win-body">
        <span className="appx-win-dots"><b className="g"></b><b className="r"></b></span>
        <span className="appx-win-h"></span>
        <span className="appx-win-row"><i></i></span>
      </span>
    </span>);
}

function ApSwitch({ on, onChange, label }) {
  return (
    <span className={'switch' + (on ? ' is-on' : '')}>
      <input type="checkbox" checked={!!on} onChange={(e) => onChange(e.target.checked)} aria-label={label} />
      <span className="switch-track"></span>
      <span className="switch-thumb"></span>
    </span>);
}

function ApRow({ title, hint, on, onChange, nested }) {
  return (
    <label className={'ce-toggle-row' + (nested ? ' appx-nested' : '')}>
      <div className="ce-toggle-text">
        <div className="ce-toggle-title">{title}</div>
        {hint ? <p className="ce-acct-hint">{hint}</p> : null}
      </div>
      <ApSwitch on={on} onChange={onChange} label={title} />
    </label>);
}

function ApThemeCard({ id, label, kind, active, onPick }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      className={'appx-card' + (active ? ' is-active' : '')}
      onClick={() => onPick(id)}>
      <span className={'appx-prev' + (kind === 'sys' ? ' appx-sys' : '')}>
        {kind === 'sys' ?
          <React.Fragment><ApMiniWin tone="dark" /><ApMiniWin tone="light" /></React.Fragment> :
          <ApMiniWin tone={kind} />}
      </span>
      <span className="appx-card-label">{label}</span>
    </button>);
}

function AppearanceSettings() {
  const DS = window.DemoState;
  const readState = () => ({
    theme: DS ? DS.getTheme() : 'auto',
    ap: DS ? DS.getAppearance() : { contrast: false, reduceMotion: false, dimPhotos: true, hovercards: true }
  });
  const [state, setState] = React.useState(readState);
  const theme = state.theme;
  const ap = state.ap;

  // Re-sync when the demo state changes elsewhere (canvas sidebar, or the
  // long-press Experiments dialog flipping the theme).
  React.useEffect(() => {
    const h = () => setState(readState());
    window.addEventListener('devicedb:demostate', h);
    return () => window.removeEventListener('devicedb:demostate', h);
  }, []);

  // Track the OS scheme so the System card can report which way it resolves.
  const [osDark, setOsDark] = React.useState(
    () => !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches));
  React.useEffect(() => {
    if (!window.matchMedia) return undefined;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const h = (e) => setOsDark(e.matches);
    if (mql.addEventListener) mql.addEventListener('change', h);else if (mql.addListener) mql.addListener(h);
    return () => {if (mql.removeEventListener) mql.removeEventListener('change', h);else if (mql.removeListener) mql.removeListener(h);};
  }, []);

  const pickTheme = (t) => {if (DS) DS.setTheme(t);};
  const setAp = (patch) => {if (DS) DS.setAppearance(patch);};
  const resolved = theme === 'light' || theme === 'dark' ? theme : osDark ? 'dark' : 'light';

  return (
    <React.Fragment>
      <div className="eyebrow section-eyebrow" style={{ marginBottom: 8, color: 'var(--primary)' }}>Settings</div>
      <h1 className="ce-account-h1">Appearance</h1>
      <p className="ce-account-sub">How the database looks for you.</p>

      <div className="ce-account-form appx-form">
        <section className="ce-account-section">
          <h2 className="appx-group-h">Theme</h2>
          <div className="appx-themes" role="radiogroup" aria-label="Theme">
            <ApThemeCard id="auto" label="System" kind="sys" active={theme === 'auto'} onPick={pickTheme} />
            <ApThemeCard id="light" label="Light" kind="light" active={theme === 'light'} onPick={pickTheme} />
            <ApThemeCard id="dark" label="Dark" kind="dark" active={theme === 'dark'} onPick={pickTheme} />
          </div>
          <p className="appx-meta">
            {theme === 'auto' ?
            <React.Fragment>Following your system settings, currently <b>{resolved === 'dark' ? 'Dark' : 'Light'}</b>.</React.Fragment> :
            <React.Fragment>Set to <b>{theme === 'dark' ? 'Dark' : 'Light'}</b>, ignoring your system.</React.Fragment>}
          </p>
        </section>

        <section className="ce-account-section">
          <h2 className="appx-group-h">Display</h2>
          <ApRow
            title="Increase contrast"
            hint="Use a higher-contrast palette in both light and dark mode."
            on={ap.contrast}
            onChange={(v) => setAp({ contrast: v })} />
          <ApRow
            title="Dim device photos in dark mode"
            hint="Dims product shots by 20% so the white backgrounds they are shot on do not glare."
            on={ap.dimPhotos}
            onChange={(v) => setAp({ dimPhotos: v })} />
        </section>

        <section className="ce-account-section">
          <h2 className="appx-group-h">Behavior</h2>
          <ApRow
            title="Reduce motion"
            hint="Minimize non-essential animation across the site."
            on={ap.reduceMotion}
            onChange={(v) => setAp({ reduceMotion: v })} />
          <ApRow
            title="Show hovercards"
            hint="Preview a contributor or linked page by hovering or focusing the link, before you open it."
            on={ap.hovercards}
            onChange={(v) => setAp({ hovercards: v })} />
        </section>
      </div>
    </React.Fragment>);
}

// Expose to the Settings page (community-edit-pages renders window.AppearanceSettings).
Object.assign(window, { AppearanceSettings });
