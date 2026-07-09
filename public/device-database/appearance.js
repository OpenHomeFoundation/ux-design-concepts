/* Appearance settings tab — Stage 03 (Accounts and editing).
   Precompiled from appearance.jsx. Edit the .jsx and regenerate this file. */

function ApMiniWin({ tone }) {
  return /*#__PURE__*/React.createElement("span", { className: 'appx-win appx-' + tone },
  /*#__PURE__*/React.createElement("span", { className: "appx-win-top" },
  /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null)),
  /*#__PURE__*/React.createElement("span", { className: "appx-win-body" },
  /*#__PURE__*/React.createElement("span", { className: "appx-win-dots" },
  /*#__PURE__*/React.createElement("b", { className: "g" }), /*#__PURE__*/React.createElement("b", { className: "r" })),
  /*#__PURE__*/React.createElement("span", { className: "appx-win-h" }),
  /*#__PURE__*/React.createElement("span", { className: "appx-win-row" }, /*#__PURE__*/React.createElement("i", null))));
}

function ApSwitch({ on, onChange, label }) {
  return /*#__PURE__*/React.createElement("span", { className: 'switch' + (on ? ' is-on' : '') },
  /*#__PURE__*/React.createElement("input", { type: "checkbox", checked: !!on, onChange: (e) => onChange(e.target.checked), "aria-label": label }),
  /*#__PURE__*/React.createElement("span", { className: "switch-track" }),
  /*#__PURE__*/React.createElement("span", { className: "switch-thumb" }));
}

function ApRow({ title, hint, on, onChange, nested }) {
  return /*#__PURE__*/React.createElement("label", { className: 'ce-toggle-row' + (nested ? ' appx-nested' : '') },
  /*#__PURE__*/React.createElement("div", { className: "ce-toggle-text" },
  /*#__PURE__*/React.createElement("div", { className: "ce-toggle-title" }, title),
  hint ? /*#__PURE__*/React.createElement("p", { className: "ce-acct-hint" }, hint) : null),
  /*#__PURE__*/React.createElement(ApSwitch, { on: on, onChange: onChange, label: title }));
}

function ApThemeCard({ id, label, kind, active, onPick }) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button", role: "radio", "aria-checked": active,
    className: 'appx-card' + (active ? ' is-active' : ''),
    onClick: () => onPick(id)
  },
  /*#__PURE__*/React.createElement("span", { className: 'appx-prev' + (kind === 'sys' ? ' appx-sys' : '') },
  kind === 'sys' ?
  /*#__PURE__*/React.createElement(React.Fragment, null,
  /*#__PURE__*/React.createElement(ApMiniWin, { tone: "dark" }),
  /*#__PURE__*/React.createElement(ApMiniWin, { tone: "light" })) :
  /*#__PURE__*/React.createElement(ApMiniWin, { tone: kind })),
  /*#__PURE__*/React.createElement("span", { className: "appx-card-label" }, label));
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

  React.useEffect(() => {
    const h = () => setState(readState());
    window.addEventListener('devicedb:demostate', h);
    return () => window.removeEventListener('devicedb:demostate', h);
  }, []);

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

  return /*#__PURE__*/React.createElement(React.Fragment, null,
  /*#__PURE__*/React.createElement("div", { className: "eyebrow section-eyebrow", style: { marginBottom: 8, color: 'var(--primary)' } }, "Settings"),
  /*#__PURE__*/React.createElement("h1", { className: "ce-account-h1" }, "Appearance"),
  /*#__PURE__*/React.createElement("p", { className: "ce-account-sub" }, "How the database looks for you."),
  /*#__PURE__*/React.createElement("div", { className: "ce-account-form appx-form" },
  /*#__PURE__*/React.createElement("section", { className: "ce-account-section" },
  /*#__PURE__*/React.createElement("h2", { className: "appx-group-h" }, "Theme"),
  /*#__PURE__*/React.createElement("div", { className: "appx-themes", role: "radiogroup", "aria-label": "Theme" },
  /*#__PURE__*/React.createElement(ApThemeCard, { id: "auto", label: "System", kind: "sys", active: theme === 'auto', onPick: pickTheme }),
  /*#__PURE__*/React.createElement(ApThemeCard, { id: "light", label: "Light", kind: "light", active: theme === 'light', onPick: pickTheme }),
  /*#__PURE__*/React.createElement(ApThemeCard, { id: "dark", label: "Dark", kind: "dark", active: theme === 'dark', onPick: pickTheme })),
  /*#__PURE__*/React.createElement("p", { className: "appx-meta" },
  theme === 'auto' ?
  /*#__PURE__*/React.createElement(React.Fragment, null, "Following your system settings, currently ", /*#__PURE__*/React.createElement("b", null, resolved === 'dark' ? 'Dark' : 'Light'), ".") :
  /*#__PURE__*/React.createElement(React.Fragment, null, "Set to ", /*#__PURE__*/React.createElement("b", null, theme === 'dark' ? 'Dark' : 'Light'), ", ignoring your system."))),
  /*#__PURE__*/React.createElement("section", { className: "ce-account-section" },
  /*#__PURE__*/React.createElement("h2", { className: "appx-group-h" }, "Display"),
  /*#__PURE__*/React.createElement(ApRow, { title: "Increase contrast", hint: "Use a higher-contrast palette in both light and dark mode.", on: ap.contrast, onChange: (v) => setAp({ contrast: v }) }),
  /*#__PURE__*/React.createElement(ApRow, { title: "Dim device photos in dark mode", hint: "Dims product shots by 20% so the white backgrounds they are shot on do not glare.", on: ap.dimPhotos, onChange: (v) => setAp({ dimPhotos: v }) })),
  /*#__PURE__*/React.createElement("section", { className: "ce-account-section" },
  /*#__PURE__*/React.createElement("h2", { className: "appx-group-h" }, "Behavior"),
  /*#__PURE__*/React.createElement(ApRow, { title: "Reduce motion", hint: "Minimize non-essential animation across the site.", on: ap.reduceMotion, onChange: (v) => setAp({ reduceMotion: v }) }),
  /*#__PURE__*/React.createElement(ApRow, { title: "Show hovercards", hint: "Preview a contributor or linked page by hovering or focusing the link, before you open it.", on: ap.hovercards, onChange: (v) => setAp({ hovercards: v }) }))));
}

Object.assign(window, { AppearanceSettings });
