/* @ds-bundle: {"format":3,"namespace":"HAConceptCarDesignSystem_fababd","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Chip","sourcePath":"components/core/Chip.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"ProfileAvatar","sourcePath":"components/core/ProfileAvatar.jsx"},{"name":"SpaceIndicator","sourcePath":"components/core/SpaceIndicator.jsx"},{"name":"Toggle","sourcePath":"components/core/Toggle.jsx"},{"name":"ActivityItem","sourcePath":"components/entities/ActivityItem.jsx"},{"name":"AreaCard","sourcePath":"components/entities/AreaCard.jsx"},{"name":"AutomationItem","sourcePath":"components/entities/AutomationItem.jsx"},{"name":"CameraCard","sourcePath":"components/entities/CameraCard.jsx"},{"name":"EntityCard","sourcePath":"components/entities/EntityCard.jsx"},{"name":"EntityTile","sourcePath":"components/entities/EntityTile.jsx"},{"name":"ForYouWidget","sourcePath":"components/entities/ForYouWidget.jsx"},{"name":"SectionHeader","sourcePath":"components/entities/SectionHeader.jsx"},{"name":"SpeakerCard","sourcePath":"components/entities/SpeakerCard.jsx"},{"name":"ThermostatCard","sourcePath":"components/entities/ThermostatCard.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"FormField","sourcePath":"components/forms/FormField.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"RadioGroup","sourcePath":"components/forms/RadioGroup.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"ListHeader","sourcePath":"components/lists/ListHeader.jsx"},{"name":"ListRow","sourcePath":"components/lists/ListRow.jsx"},{"name":"ListToolbar","sourcePath":"components/lists/ListToolbar.jsx"},{"name":"AppShell","sourcePath":"components/navigation/AppShell.jsx"},{"name":"BookmarkNav","sourcePath":"components/navigation/BookmarkNav.jsx"},{"name":"MorePage","sourcePath":"components/navigation/MorePage.jsx"},{"name":"PageHeader","sourcePath":"components/navigation/PageHeader.jsx"},{"name":"PersonaSwitcher","sourcePath":"components/navigation/PersonaSwitcher.jsx"},{"name":"Sheet","sourcePath":"components/navigation/Sheet.jsx"},{"name":"Submenu","sourcePath":"components/navigation/Submenu.jsx"},{"name":"TabBar","sourcePath":"components/navigation/TabBar.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"ee47191941d4","components/core/Button.jsx":"17546a905828","components/core/Chip.jsx":"08d2ef448031","components/core/Icon.jsx":"cb1c4d01785a","components/core/ProfileAvatar.jsx":"7f923b423502","components/core/SpaceIndicator.jsx":"0fe372a4e359","components/core/Toggle.jsx":"0ca2357141ea","components/entities/ActivityItem.jsx":"03defabe4d9a","components/entities/AreaCard.jsx":"e1acc63e66b3","components/entities/AutomationItem.jsx":"27b406eb5b77","components/entities/CameraCard.jsx":"6d3f92cf8e9a","components/entities/EntityCard.jsx":"e53bc4c5dd93","components/entities/EntityTile.jsx":"ca4cb80c4dd6","components/entities/ForYouWidget.jsx":"345b8d3b7656","components/entities/SectionHeader.jsx":"fee65dffa131","components/entities/SpeakerCard.jsx":"8e4b37507c63","components/entities/ThermostatCard.jsx":"f1e945845a89","components/forms/Checkbox.jsx":"61e1793a3137","components/forms/FormField.jsx":"9928b55a3d13","components/forms/Input.jsx":"f70d0fec9ae2","components/forms/Radio.jsx":"572a0da1f0e7","components/forms/RadioGroup.jsx":"b9d6a4c91b1e","components/forms/Select.jsx":"9a3a6e0f69be","components/lists/ListHeader.jsx":"5ae0264b4ba1","components/lists/ListRow.jsx":"7b021596c594","components/lists/ListToolbar.jsx":"015a00dd25d8","components/navigation/AppShell.jsx":"410b66259ba8","components/navigation/BookmarkNav.jsx":"4c2933709d38","components/navigation/MorePage.jsx":"d5af2e2225ab","components/navigation/PageHeader.jsx":"e667d03a0e10","components/navigation/PersonaSwitcher.jsx":"23c07678726e","components/navigation/Sheet.jsx":"4672354e9468","components/navigation/Submenu.jsx":"45e40f35dbc2","components/navigation/TabBar.jsx":"5816d1c8ad3a","design-tokens.js":"67183e683568"},"inlinedExternals":[],"unexposedExports":[{"name":"colorsFor","sourcePath":"design-tokens.js"},{"name":"darkColors","sourcePath":"design-tokens.js"},{"name":"lightColors","sourcePath":"design-tokens.js"},{"name":"tokens","sourcePath":"design-tokens.js"},{"name":"tokensFor","sourcePath":"design-tokens.js"}]} */

(() => {

const __ds_ns = (window.HAConceptCarDesignSystem_fababd = window.HAConceptCarDesignSystem_fababd || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Badge — small notification count, meant to overlay an icon. Renders nothing
 * when `count` is 0 (unless `dot`). Caps display at `max` (default 99).
 * Wrap an icon with position:relative and drop this inside it.
 */
function Badge({
  count = 0,
  max = 99,
  dot = false,
  style,
  ...rest
}) {
  if (!dot && (!count || count <= 0)) return null;
  const label = dot ? "" : count > max ? `${max}+` : String(count);
  return /*#__PURE__*/React.createElement("span", _extends({
    "aria-label": dot ? "new" : `${count} unread`,
    style: {
      position: "absolute",
      top: -4,
      right: -4,
      minWidth: dot ? 8 : 16,
      height: dot ? 8 : 16,
      padding: dot ? 0 : "0 4px",
      boxSizing: "border-box",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--color-error)",
      color: "#fff",
      fontFamily: "var(--font-body)",
      fontSize: 10,
      fontWeight: "var(--weight-bold)",
      lineHeight: 1,
      borderRadius: "var(--radius-full)",
      boxShadow: "0 0 0 2px var(--color-bg)",
      ...style
    }
  }, rest), label);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Chip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.ha-chip {
  display: inline-flex; align-items: center; gap: var(--space-1,4px);
  font-family: var(--font-body); font-size: var(--text-xs,11px);
  font-weight: var(--weight-medium,500); line-height: 1;
  padding: 4px 10px; border-radius: var(--radius-full);
  white-space: nowrap; border: 1px solid transparent;
}
.ha-chip--default     { background: var(--color-surface-raised); color: var(--color-text-secondary); }
.ha-chip--active      { background: var(--color-accent-subtle); color: var(--color-accent); }
.ha-chip--warning     { background: var(--color-warning-subtle); color: var(--color-warning); }
.ha-chip--error       { background: var(--color-error-subtle); color: var(--color-error); }
.ha-chip--space-shared   { background: var(--color-space-shared-subtle); color: var(--color-space-shared); }
.ha-chip--space-personal { background: var(--color-space-personal-subtle); color: var(--color-space-personal); }
.ha-chip--space-admin    { background: var(--color-space-admin-subtle); color: var(--color-space-admin); }
.ha-chip__dot { width: 6px; height: 6px; border-radius: var(--radius-full); background: currentColor; }
`;
function ensureStyles() {
  if (typeof document === "undefined" || document.getElementById("ha-chip-css")) return;
  const s = document.createElement("style");
  s.id = "ha-chip-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}

/**
 * Chip — small pill label for traits, statuses, and tags.
 * Variants: default, active, warning, error, space-shared|personal|admin.
 */
function Chip({
  variant = "default",
  dot,
  children,
  className = "",
  style,
  ...rest
}) {
  ensureStyles();
  return /*#__PURE__*/React.createElement("span", _extends({
    className: `ha-chip ha-chip--${variant} ${className}`,
    style: style
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    className: "ha-chip__dot"
  }), children);
}
Object.assign(__ds_scope, { Chip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Chip.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Ensures the Material Design Icons webfont (the set Home Assistant uses) is
   present exactly once. The bundle can't carry the font binary, so we link it
   from jsDelivr on first mount. Components stay self-sufficient this way. */
const MDI_HREF = "https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css";
function ensureMdi() {
  if (typeof document === "undefined") return;
  if (document.getElementById("ha-mdi-font")) return;
  const link = document.createElement("link");
  link.id = "ha-mdi-font";
  link.rel = "stylesheet";
  link.href = MDI_HREF;
  document.head.appendChild(link);
}
const SIZES = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32
};

/**
 * Icon — renders a Material Design Icon by name (without the `mdi-` prefix).
 * Inherits `currentColor`, so set color on the parent. Decorative by default
 * (aria-hidden); pass `label` to expose it to assistive tech.
 */
function Icon({
  name,
  size = "md",
  label,
  style,
  className = "",
  ...rest
}) {
  ensureMdi();
  const px = typeof size === "number" ? size : SIZES[size] || SIZES.md;
  return /*#__PURE__*/React.createElement("span", _extends({
    className: `mdi mdi-${name} ${className}`,
    role: label ? "img" : undefined,
    "aria-label": label || undefined,
    "aria-hidden": label ? undefined : true,
    style: {
      fontSize: px,
      lineHeight: 1,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: px,
      height: px,
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* One-time CSS injection for states inline styles can't express
   (hover/active/focus-visible, disabled, reduced-motion). */
const CSS = `
.ha-btn {
  --_h: var(--touch-target-desktop, 32px);
  display: inline-flex; align-items: center; justify-content: center;
  gap: var(--space-2, 8px);
  font-family: var(--font-body); font-weight: var(--weight-medium, 500);
  border: 1px solid transparent; border-radius: var(--radius-md, 8px);
  cursor: pointer; white-space: nowrap; text-decoration: none;
  transition: background-color var(--duration-normal,200ms) var(--easing-out,ease-out),
              border-color var(--duration-normal,200ms) var(--easing-out,ease-out),
              color var(--duration-normal,200ms) var(--easing-out,ease-out);
}
.ha-btn:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
.ha-btn[disabled] { cursor: not-allowed; opacity: .45; }
.ha-btn--sm { --_h: 28px; font-size: var(--text-sm,13px); padding: 0 var(--space-3,12px); min-height: 28px; }
.ha-btn--md { font-size: var(--text-base,15px); padding: 0 var(--space-4,16px); min-height: var(--_h); }
.ha-btn--lg { font-size: var(--text-md,17px); padding: 0 var(--space-6,24px); min-height: calc(var(--_h) + 16px); }
.ha-btn--icon { padding: 0; aspect-ratio: 1; min-height: var(--_h); width: var(--_h); }
.ha-btn--icon.ha-btn--lg { width: calc(var(--_h) + 16px); }

.ha-btn--primary { background: var(--color-accent); color: var(--color-on-accent); }
.ha-btn--primary:hover:not([disabled]) { background: var(--color-accent-hover); }
.ha-btn--secondary { background: var(--color-surface-raised); color: var(--color-text-primary); border-color: var(--color-border); }
.ha-btn--secondary:hover:not([disabled]) { background: var(--color-overlay); }
.ha-btn--ghost { background: transparent; color: var(--color-text-secondary); }
.ha-btn--ghost:hover:not([disabled]) { background: var(--color-surface-raised); color: var(--color-text-primary); }
.ha-btn--danger { background: var(--color-error); color: #fff; }
.ha-btn--danger:hover:not([disabled]) { filter: brightness(1.1); }
.ha-btn--icon.ha-btn--ghost { color: var(--color-text-secondary); }

@media (min-width: 768px) and (max-width: 1279px) { .ha-btn { --_h: var(--touch-target-tablet, 44px); } }
@media (max-width: 767px) { .ha-btn { --_h: var(--touch-target-mobile, 56px); } }
`;
function ensureStyles() {
  if (typeof document === "undefined" || document.getElementById("ha-btn-css")) return;
  const s = document.createElement("style");
  s.id = "ha-btn-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}

/**
 * Button — the system's standard action. Never underlines; darkens on hover.
 * Variants: primary (the one main CTA), secondary, ghost (toolbars/inline),
 * danger (destructive), icon (square, icon-only). Sizes sm | md | lg.
 * Touch target meets the per-breakpoint minimum automatically.
 */
function Button({
  variant = "secondary",
  size = "md",
  icon,
  iconRight,
  href,
  children,
  className = "",
  style,
  ...rest
}) {
  ensureStyles();
  const Tag = href ? "a" : "button";
  const isIcon = variant === "icon";
  const cls = `ha-btn ha-btn--${variant} ha-btn--${size}${isIcon ? " ha-btn--icon" : ""} ${className}`;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: cls,
    href: href,
    type: href ? undefined : rest.type || "button",
    "aria-label": isIcon ? rest["aria-label"] : undefined,
    style: style
  }, rest), icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: size === "lg" ? "lg" : "md"
  }), !isIcon && children, isIcon && !icon && children, iconRight && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconRight,
    size: "md"
  }));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/ProfileAvatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZES = {
  sm: 24,
  md: 32,
  lg: 40
};

/**
 * ProfileAvatar — rounded SQUARE (squircle), never a circle. Reinforces the
 * "data, not social" character. Shows an image when `src` is set, otherwise
 * initials derived from `name` on a raised surface.
 */
function ProfileAvatar({
  name = "",
  src,
  size = "md",
  style,
  ...rest
}) {
  const px = SIZES[size] || SIZES.md;
  const parts = name.split(" ").filter(Boolean);
  const initials = (parts.length > 1 ? parts.slice(0, 2).map(w => w[0]).join("") : (parts[0] || "").slice(0, 2)).toUpperCase();
  return /*#__PURE__*/React.createElement("span", _extends({
    role: "img",
    "aria-label": name || "avatar",
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "none",
      width: px,
      height: px,
      borderRadius: "var(--radius-squircle)",
      overflow: "hidden",
      background: "var(--color-surface-raised)",
      color: "var(--color-text-secondary)",
      fontFamily: "var(--font-body)",
      fontWeight: "var(--weight-medium)",
      fontSize: px * 0.4,
      lineHeight: 1,
      userSelect: "none",
      ...style
    }
  }, rest), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: "",
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }) : initials || "?");
}
Object.assign(__ds_scope, { ProfileAvatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/ProfileAvatar.jsx", error: String((e && e.message) || e) }); }

// components/core/SpaceIndicator.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const COLORS = {
  shared: "var(--color-space-shared)",
  personal: "var(--color-space-personal)",
  admin: "var(--color-space-admin)"
};

/**
 * SpaceIndicator — a 3px colored left-border stripe marking which space a
 * piece of content belongs to. Usually applied via the `space` prop on cards
 * and list rows; this standalone version wraps arbitrary content.
 */
function SpaceIndicator({
  space = "shared",
  tint = false,
  children,
  style,
  ...rest
}) {
  const color = COLORS[space] || COLORS.shared;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      borderLeft: `3px solid ${color}`,
      paddingLeft: "var(--space-3)",
      background: tint ? `var(--color-space-${space}-subtle)` : "transparent",
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { SpaceIndicator });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SpaceIndicator.jsx", error: String((e && e.message) || e) }); }

// components/core/Toggle.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.ha-toggle {
  --_w: 44px; --_h: 26px; --_p: 3px;
  position: relative; display: inline-flex; flex: none;
  width: var(--_w); height: var(--_h); padding: 0; border: none;
  border-radius: var(--radius-full); cursor: pointer;
  background: var(--color-toggle-track);
  box-shadow: inset 0 0 0 1px var(--color-border);
  transition: background-color var(--duration-normal,200ms) var(--easing-out,ease-out),
              box-shadow var(--duration-normal,200ms) var(--easing-out,ease-out);
}
.ha-toggle[aria-checked="true"] { background: var(--color-accent); box-shadow: none; }
.ha-toggle[disabled] { opacity: .45; cursor: not-allowed; }
.ha-toggle:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
.ha-toggle__thumb {
  position: absolute; top: var(--_p); left: var(--_p);
  width: calc(var(--_h) - var(--_p) * 2); height: calc(var(--_h) - var(--_p) * 2);
  border-radius: var(--radius-full); background: var(--color-toggle-thumb);
  transition: transform var(--duration-fast,150ms) var(--easing-out,ease-out);
}
.ha-toggle[aria-checked="true"] .ha-toggle__thumb {
  transform: translateX(calc(var(--_w) - var(--_h)));
}
`;
function ensureStyles() {
  if (typeof document === "undefined" || document.getElementById("ha-toggle-css")) return;
  const s = document.createElement("style");
  s.id = "ha-toggle-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}

/**
 * Toggle — iOS-style switch. role=switch, keyboard-operable (Space/Enter).
 * Controlled via `checked` + `onChange(next)`. 200ms track, 150ms thumb.
 */
function Toggle({
  checked = false,
  onChange,
  disabled,
  label,
  style,
  ...rest
}) {
  ensureStyles();
  const toggle = () => {
    if (!disabled && onChange) onChange(!checked);
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    role: "switch",
    "aria-checked": checked,
    "aria-label": label,
    disabled: disabled,
    className: "ha-toggle",
    onClick: toggle,
    style: style
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "ha-toggle__thumb"
  }));
}
Object.assign(__ds_scope, { Toggle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Toggle.jsx", error: String((e && e.message) || e) }); }

// components/entities/ActivityItem.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.ha-activity { display: flex; align-items: center; gap: var(--space-3,12px); padding: var(--space-2,8px) 0; font-family: var(--font-body); }
.ha-activity__body { flex: 1; min-width: 0; }
.ha-activity__text { font-size: var(--text-sm,13px); color: var(--color-text-primary); }
.ha-activity__actor { color: var(--color-text-secondary); }
.ha-activity__time { font-family: var(--font-mono); font-size: var(--text-xs,11px); color: var(--color-text-tertiary); }
.ha-activity__ico { color: var(--color-text-secondary); flex: none; }
`;
function ensureStyles() {
  if (typeof document === "undefined" || document.getElementById("ha-activity-css")) return;
  const s = document.createElement("style");
  s.id = "ha-activity-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}

/**
 * ActivityItem — a compact log row: what happened, who did it, and the entity
 * icon on the right. No dividers — stack these directly. Verbs over adjectives.
 *   action (text), actor (name), time, icon
 */
function ActivityItem({
  action,
  actor,
  time,
  icon = "history",
  style,
  ...rest
}) {
  ensureStyles();
  return /*#__PURE__*/React.createElement("div", _extends({
    className: "ha-activity",
    style: style
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "ha-activity__body"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ha-activity__text"
  }, action, actor && /*#__PURE__*/React.createElement("span", {
    className: "ha-activity__actor"
  }, " \xB7 ", actor)), time && /*#__PURE__*/React.createElement("div", {
    className: "ha-activity__time"
  }, time)), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: "md",
    className: "ha-activity__ico"
  }));
}
Object.assign(__ds_scope, { ActivityItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/entities/ActivityItem.jsx", error: String((e && e.message) || e) }); }

// components/entities/AreaCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.ha-area {
  display: flex; flex-direction: column; gap: var(--space-3,12px); text-align: left; width: 100%;
  padding: var(--space-5,20px); border: none; cursor: pointer; border-radius: var(--radius-lg);
  background: var(--color-surface); color: var(--color-text-primary); font-family: var(--font-body);
  transition: background-color var(--duration-normal,200ms) var(--easing-out,ease-out);
}
.ha-area:hover, .ha-area:focus-visible { background: var(--color-surface-raised); outline: none; }
.ha-area:focus-visible { box-shadow: 0 0 0 2px var(--color-accent); }
.ha-area__ico { color: var(--color-text-secondary); }
.ha-area__name { font-size: var(--text-md,17px); font-weight: var(--weight-medium,500); }
.ha-area__summary { font-size: var(--text-sm,13px); color: var(--color-text-secondary); }
`;
function ensureStyles() {
  if (typeof document === "undefined" || document.getElementById("ha-area-css")) return;
  const s = document.createElement("style");
  s.id = "ha-area-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}

/**
 * AreaCard — a floor/area tile on the home overview. Icon, name, summary state.
 * No border; sits on --color-surface and lifts to --color-surface-raised on
 * hover. Use --radius-lg. Taps through to the area detail. Lay out in a grid
 * (4 desktop / 3 tablet / 2 mobile).
 */
function AreaCard({
  icon = "sofa",
  name,
  summary,
  onClick,
  style,
  ...rest
}) {
  ensureStyles();
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    className: "ha-area",
    onClick: onClick,
    style: style
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: "xl",
    className: "ha-area__ico"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "ha-area__name"
  }, name), summary && /*#__PURE__*/React.createElement("div", {
    className: "ha-area__summary"
  }, summary)));
}
Object.assign(__ds_scope, { AreaCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/entities/AreaCard.jsx", error: String((e && e.message) || e) }); }

// components/entities/AutomationItem.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.ha-auto { display: flex; align-items: center; gap: var(--space-3,12px); padding: var(--space-3,12px) var(--space-4,16px); border-left: 3px solid var(--color-space-shared); background: var(--color-surface); border-radius: var(--radius-md); font-family: var(--font-body); }
.ha-auto__body { flex: 1; min-width: 0; }
.ha-auto__name { font-size: var(--text-base,15px); font-weight: var(--weight-medium,500); color: var(--color-text-primary); }
.ha-auto__meta { font-size: var(--text-sm,13px); color: var(--color-text-secondary); }
.ha-auto__edit { border: none; background: transparent; cursor: pointer; padding: 0; color: var(--color-text-secondary); font-family: var(--font-body); font-size: var(--text-sm,13px); font-weight: var(--weight-medium,500); text-decoration: none; transition: color var(--duration-normal,200ms) var(--easing-out,ease-out); }
.ha-auto__edit:hover { color: var(--color-accent); text-decoration: underline; text-underline-offset: 2px; }
.ha-auto__right { display: flex; align-items: center; gap: var(--space-4,16px); flex: none; }
`;
function ensureStyles() {
  if (typeof document === "undefined" || document.getElementById("ha-auto-css")) return;
  const s = document.createElement("style");
  s.id = "ha-auto-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}

/**
 * AutomationItem — an automation row with its name, creator, and a Toggle on
 * the right. Carries a --color-space-shared left-border (automations live in
 * the Shared space). When `canEdit` (persona has Admin), an "Edit" structural
 * link appears. Controlled via `enabled` + onToggle(next).
 */
function AutomationItem({
  name,
  creator,
  enabled = false,
  canEdit = false,
  onToggle,
  onEdit,
  style,
  ...rest
}) {
  ensureStyles();
  return /*#__PURE__*/React.createElement("div", _extends({
    className: "ha-auto",
    style: style
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "ha-auto__body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ha-auto__name"
  }, name), creator && /*#__PURE__*/React.createElement("div", {
    className: "ha-auto__meta"
  }, "Created by ", creator)), /*#__PURE__*/React.createElement("div", {
    className: "ha-auto__right"
  }, canEdit && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ha-auto__edit",
    onClick: onEdit
  }, "Edit"), /*#__PURE__*/React.createElement(__ds_scope.Toggle, {
    checked: enabled,
    onChange: onToggle,
    label: `Toggle ${name}`
  })));
}
Object.assign(__ds_scope, { AutomationItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/entities/AutomationItem.jsx", error: String((e && e.message) || e) }); }

// components/entities/CameraCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.ha-cam { position: relative; width: 100%; aspect-ratio: 16 / 9; border-radius: var(--radius-lg); overflow: hidden; background: var(--color-surface-raised); border: none; cursor: pointer; display: block; padding: 0; font-family: var(--font-body); }
.ha-cam__img { width: 100%; height: 100%; object-fit: cover; display: block; }
.ha-cam__placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: var(--color-text-tertiary); }
.ha-cam__label { position: absolute; left: var(--space-3,12px); bottom: var(--space-3,12px); display: flex; align-items: center; gap: var(--space-2,8px); padding: 4px 10px; border-radius: var(--radius-full); background: rgba(0,0,0,.55); backdrop-filter: blur(6px); color: #fff; font-size: var(--text-sm,13px); font-weight: var(--weight-medium,500); }
.ha-cam__live { width: 7px; height: 7px; border-radius: var(--radius-full); background: var(--color-error); }
`;
function ensureStyles() {
  if (typeof document === "undefined" || document.getElementById("ha-cam-css")) return;
  const s = document.createElement("style");
  s.id = "ha-cam-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}

/**
 * CameraCard — 16:9 camera preview. Shows `src` when given, else a placeholder.
 * Name overlays bottom-left with a live dot when `live`. Grid: 3 / 2 / 1.
 */
function CameraCard({
  name,
  src,
  live = false,
  onClick,
  style,
  ...rest
}) {
  ensureStyles();
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    className: "ha-cam",
    "aria-label": name,
    onClick: onClick,
    style: style
  }, rest), src ? /*#__PURE__*/React.createElement("img", {
    className: "ha-cam__img",
    src: src,
    alt: name
  }) : /*#__PURE__*/React.createElement("span", {
    className: "ha-cam__placeholder"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "cctv",
    size: "xl"
  })), name && /*#__PURE__*/React.createElement("span", {
    className: "ha-cam__label"
  }, live && /*#__PURE__*/React.createElement("span", {
    className: "ha-cam__live"
  }), name));
}
Object.assign(__ds_scope, { CameraCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/entities/CameraCard.jsx", error: String((e && e.message) || e) }); }

// components/entities/EntityCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.ha-ecard {
  display: flex; align-items: center; gap: var(--space-4,16px); text-align: left; width: 100%;
  padding: var(--space-4,16px); border: none; cursor: pointer; border-radius: var(--radius-lg);
  background: var(--color-surface); font-family: var(--font-body); color: var(--color-text-primary);
  transition: background-color var(--duration-normal,200ms) var(--easing-out,ease-out);
}
.ha-ecard:hover, .ha-ecard:focus-visible { background: var(--color-surface-raised); outline: none; }
.ha-ecard__ico { color: var(--color-text-secondary); flex: none; }
.ha-ecard__body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.ha-ecard__head { display: flex; align-items: center; gap: var(--space-2,8px); }
.ha-ecard__name { font-size: var(--text-base,15px); font-weight: var(--weight-medium,500); }
.ha-ecard__state { font-size: var(--text-sm,13px); color: var(--color-text-secondary); }
.ha-ecard__state--mono { font-family: var(--font-mono); }
`;
function ensureStyles() {
  if (typeof document === "undefined" || document.getElementById("ha-ecard-css")) return;
  const s = document.createElement("style");
  s.id = "ha-ecard-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}

/**
 * EntityCard — for "other devices" that don't tile (sensors, satellites,
 * smoke alarms). Full-width, left-aligned: a type chip, the entity name, and
 * its state. Lay out in a grid (3 desktop / 2 tablet / 1 mobile).
 *   icon, type (chip label), name, state, mono (render state in mono)
 */
function EntityCard({
  icon = "chip",
  type,
  name,
  state,
  mono = false,
  onClick,
  style,
  ...rest
}) {
  ensureStyles();
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    className: "ha-ecard",
    onClick: onClick,
    style: style
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: "lg",
    className: "ha-ecard__ico"
  }), /*#__PURE__*/React.createElement("div", {
    className: "ha-ecard__body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ha-ecard__head"
  }, type && /*#__PURE__*/React.createElement(__ds_scope.Chip, {
    variant: "default"
  }, type), /*#__PURE__*/React.createElement("span", {
    className: "ha-ecard__name"
  }, name)), state != null && /*#__PURE__*/React.createElement("div", {
    className: `ha-ecard__state${mono ? " ha-ecard__state--mono" : ""}`
  }, state)));
}
Object.assign(__ds_scope, { EntityCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/entities/EntityCard.jsx", error: String((e && e.message) || e) }); }

// components/entities/EntityTile.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.ha-tile {
  display: flex; flex-direction: column; gap: var(--space-3,12px); text-align: left; width: 100%;
  padding: var(--space-4,16px); border: none; cursor: pointer; border-radius: var(--radius-lg);
  background: var(--color-surface); font-family: var(--font-body); color: var(--color-text-tertiary);
  transition: background-color var(--duration-normal,200ms) var(--easing-out,ease-out), color var(--duration-normal,200ms) var(--easing-out,ease-out);
  min-height: 92px;
}
.ha-tile:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--color-accent); }
.ha-tile--on { background: var(--color-surface-raised); color: var(--color-text-primary); }
.ha-tile__top { display: flex; align-items: flex-start; justify-content: space-between; }
.ha-tile__ico { color: var(--color-inactive); transition: color var(--duration-normal,200ms) var(--easing-out,ease-out); }
.ha-tile--on .ha-tile__ico { color: var(--color-accent); }
.ha-tile__name { font-size: var(--text-base,15px); font-weight: var(--weight-medium,500); color: var(--color-text-primary); }
.ha-tile__state { font-size: var(--text-sm,13px); }
`;
function ensureStyles() {
  if (typeof document === "undefined" || document.getElementById("ha-tile-css")) return;
  const s = document.createElement("style");
  s.id = "ha-tile-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}

/**
 * EntityTile — toggleable entity (lights, switches). Active sits on
 * --color-surface-raised with primary text; inactive on --color-surface with
 * tertiary text — distinction by background color, no border. Tap toggles.
 *   on (bool), name, icon, stateLabel (defaults On/Off), onToggle(next)
 */
function EntityTile({
  on = false,
  name,
  icon = "lightbulb",
  stateLabel,
  onToggle,
  style,
  ...rest
}) {
  ensureStyles();
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    role: "switch",
    "aria-checked": on,
    "aria-label": name,
    className: `ha-tile${on ? " ha-tile--on" : ""}`,
    onClick: () => onToggle && onToggle(!on),
    style: style
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "ha-tile__top"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: "lg",
    className: "ha-tile__ico"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "ha-tile__name"
  }, name), /*#__PURE__*/React.createElement("div", {
    className: "ha-tile__state"
  }, stateLabel || (on ? "On" : "Off"))));
}
Object.assign(__ds_scope, { EntityTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/entities/EntityTile.jsx", error: String((e && e.message) || e) }); }

// components/entities/ForYouWidget.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.ha-fy { position: relative; padding: var(--space-4,16px); border-radius: var(--radius-lg); background: var(--color-surface-raised); font-family: var(--font-body); }
.ha-fy--alert { border-left: 3px solid var(--color-warning); }
.ha-fy--alert.ha-fy--error { border-left-color: var(--color-error); }
.ha-fy__dismiss { position: absolute; top: 8px; right: 8px; display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border: none; background: transparent; color: var(--color-text-tertiary); border-radius: var(--radius-full); cursor: pointer; transition: background-color var(--duration-normal,200ms) var(--easing-out,ease-out); }
.ha-fy__dismiss:hover { background: var(--color-overlay); color: var(--color-text-primary); }
.ha-fy__label { font-size: var(--text-sm,13px); color: var(--color-text-secondary); margin-bottom: var(--space-2,8px); }
.ha-fy__value { font-family: var(--font-display); font-weight: var(--weight-bold,600); font-size: var(--text-2xl,30px); line-height: 1; }
.ha-fy__data { font-family: var(--font-mono); font-variant-numeric: tabular-nums; font-weight: var(--weight-bold,600); font-size: var(--text-3xl,38px); line-height: 1; }
.ha-fy__title { font-size: var(--text-base,15px); font-weight: var(--weight-medium,500); margin-bottom: 4px; }
.ha-fy__text { font-size: var(--text-sm,13px); color: var(--color-text-secondary); }
.ha-fy__row { display: flex; align-items: center; gap: var(--space-3,12px); }
.ha-fy__avatars { display: flex; }
.ha-fy__avatars > * { margin-left: -8px; box-shadow: 0 0 0 2px var(--color-surface-raised); border-radius: var(--radius-squircle); }
.ha-fy__avatars > *:first-child { margin-left: 0; }
.ha-fy__action { margin-top: var(--space-3,12px); }
`;
function ensureStyles() {
  if (typeof document === "undefined" || document.getElementById("ha-fy-css")) return;
  const s = document.createElement("style");
  s.id = "ha-fy-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}

/**
 * ForYouWidget — a right-panel widget. `type` selects the layout:
 *   alert     — dismissible; warning/error left-border (severity prop)
 *   summary   — label + value + optional action button
 *   data-point— big mono number + label
 *   media     — now playing with a play/pause control
 *   people    — title + stacked squircle avatars
 * Sits on --color-surface-raised (nested inside the panel's --color-surface).
 */
function ForYouWidget({
  type = "summary",
  label,
  value,
  title,
  text,
  severity = "warning",
  data,
  action,
  onAction,
  onDismiss,
  people = [],
  playing = false,
  onPlayPause,
  style,
  ...rest
}) {
  ensureStyles();
  const cls = `ha-fy${type === "alert" ? " ha-fy--alert" : ""}${type === "alert" && severity === "error" ? " ha-fy--error" : ""}`;
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cls,
    style: style
  }, rest), type === "alert" && onDismiss && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ha-fy__dismiss",
    "aria-label": "Dismiss",
    onClick: onDismiss
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "close",
    size: "md"
  })), type === "summary" && /*#__PURE__*/React.createElement(React.Fragment, null, label && /*#__PURE__*/React.createElement("div", {
    className: "ha-fy__label"
  }, label), value != null && /*#__PURE__*/React.createElement("div", {
    className: "ha-fy__value"
  }, value), action && /*#__PURE__*/React.createElement("div", {
    className: "ha-fy__action"
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "secondary",
    size: "sm",
    onClick: onAction
  }, action))), type === "data-point" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ha-fy__data"
  }, data), label && /*#__PURE__*/React.createElement("div", {
    className: "ha-fy__label",
    style: {
      marginTop: 8,
      marginBottom: 0
    }
  }, label)), type === "alert" && /*#__PURE__*/React.createElement(React.Fragment, null, title && /*#__PURE__*/React.createElement("div", {
    className: "ha-fy__title"
  }, title), text && /*#__PURE__*/React.createElement("div", {
    className: "ha-fy__text"
  }, text), action && /*#__PURE__*/React.createElement("div", {
    className: "ha-fy__action"
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "secondary",
    size: "sm",
    onClick: onAction
  }, action))), type === "media" && /*#__PURE__*/React.createElement("div", {
    className: "ha-fy__row"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, title && /*#__PURE__*/React.createElement("div", {
    className: "ha-fy__title"
  }, title), text && /*#__PURE__*/React.createElement("div", {
    className: "ha-fy__text"
  }, text)), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "icon",
    size: "md",
    icon: playing ? "pause" : "play",
    "aria-label": playing ? "Pause" : "Play",
    onClick: onPlayPause
  })), type === "people" && /*#__PURE__*/React.createElement(React.Fragment, null, title && /*#__PURE__*/React.createElement("div", {
    className: "ha-fy__title"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "ha-fy__avatars"
  }, people.map((p, i) => /*#__PURE__*/React.createElement(__ds_scope.ProfileAvatar, {
    key: i,
    name: p.name || p,
    src: p.src,
    size: "md"
  })))));
}
Object.assign(__ds_scope, { ForYouWidget });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/entities/ForYouWidget.jsx", error: String((e && e.message) || e) }); }

// components/entities/SectionHeader.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.ha-sechead { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3,12px); padding: var(--space-2,8px) 0; }
.ha-sechead__label { font-size: var(--text-sm,13px); font-weight: var(--weight-medium,500); color: var(--color-text-secondary); }
.ha-sechead__link { display: inline-flex; align-items: center; gap: 2px; border: none; background: transparent; cursor: pointer; padding: 0; color: var(--color-text-secondary); font-family: var(--font-body); font-size: var(--text-sm,13px); font-weight: var(--weight-medium,500); text-decoration: none; transition: color var(--duration-normal,200ms) var(--easing-out,ease-out); }
.ha-sechead__link:hover { color: var(--color-accent); text-decoration: underline; text-underline-offset: 2px; }
`;
function ensureStyles() {
  if (typeof document === "undefined" || document.getElementById("ha-sechead-css")) return;
  const s = document.createElement("style");
  s.id = "ha-sechead-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}

/**
 * SectionHeader — a quiet label above a group of content, with an optional
 * structural link on the right ("See all >"). No underline at rest; accent +
 * underline on hover. --text-sm / weight-medium / secondary color.
 */
function SectionHeader({
  label,
  action,
  onAction,
  actionHref,
  style,
  ...rest
}) {
  ensureStyles();
  const Link = actionHref ? "a" : "button";
  return /*#__PURE__*/React.createElement("div", _extends({
    className: "ha-sechead",
    style: style
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "ha-sechead__label"
  }, label), action && /*#__PURE__*/React.createElement(Link, {
    className: "ha-sechead__link",
    href: actionHref,
    type: actionHref ? undefined : "button",
    onClick: onAction
  }, action, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-right",
    size: "sm"
  })));
}
Object.assign(__ds_scope, { SectionHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/entities/SectionHeader.jsx", error: String((e && e.message) || e) }); }

// components/entities/SpeakerCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.ha-speaker { display: flex; align-items: center; gap: var(--space-4,16px); width: 100%; box-sizing: border-box; padding: var(--space-4,16px); border-radius: var(--radius-lg); background: var(--color-surface); font-family: var(--font-body); }
.ha-speaker__art { width: 56px; height: 56px; border-radius: var(--radius-md); background: var(--color-surface-raised); display: flex; align-items: center; justify-content: center; color: var(--color-text-secondary); flex: none; overflow: hidden; }
.ha-speaker__art img { width: 100%; height: 100%; object-fit: cover; }
.ha-speaker__body { flex: 1; min-width: 0; }
.ha-speaker__name { font-size: var(--text-base,15px); font-weight: var(--weight-medium,500); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ha-speaker__state { font-size: var(--text-sm,13px); color: var(--color-text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ha-speaker__ctrls { display: flex; align-items: center; gap: var(--space-1,4px); flex: none; }
.ha-speaker__btn { display: inline-flex; align-items: center; justify-content: center; flex: none; width: var(--touch-target-desktop,32px); height: var(--touch-target-desktop,32px); border: none; background: transparent; color: var(--color-text-primary); border-radius: var(--radius-full); cursor: pointer; transition: background-color var(--duration-normal,200ms) var(--easing-out,ease-out); }
.ha-speaker__btn:hover { background: var(--color-surface-raised); }
.ha-speaker__btn--play { background: var(--color-text-primary); color: var(--color-bg); }
.ha-speaker__btn--play:hover { background: var(--color-inverse-hover); }
@media (max-width: 1279px) { .ha-speaker__btn { width: var(--touch-target-tablet,44px); height: var(--touch-target-tablet,44px); } }
@media (max-width: 767px) { .ha-speaker__btn { width: var(--touch-target-mobile,56px); height: var(--touch-target-mobile,56px); } }
`;
function ensureStyles() {
  if (typeof document === "undefined" || document.getElementById("ha-speaker-css")) return;
  const s = document.createElement("style");
  s.id = "ha-speaker-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}

/**
 * SpeakerCard — full-width media player. Album art (or speaker icon), name,
 * playback state, and prev / play-pause / next controls.
 *   name, state, art (src), playing (bool), onPlayPause, onPrev, onNext, icon
 */
function SpeakerCard({
  name,
  state,
  art,
  playing = false,
  icon = "speaker",
  onPlayPause,
  onPrev,
  onNext,
  style,
  ...rest
}) {
  ensureStyles();
  return /*#__PURE__*/React.createElement("div", _extends({
    className: "ha-speaker",
    style: style
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "ha-speaker__art"
  }, art ? /*#__PURE__*/React.createElement("img", {
    src: art,
    alt: ""
  }) : /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: "lg"
  })), /*#__PURE__*/React.createElement("div", {
    className: "ha-speaker__body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ha-speaker__name"
  }, name), state && /*#__PURE__*/React.createElement("div", {
    className: "ha-speaker__state"
  }, state)), /*#__PURE__*/React.createElement("div", {
    className: "ha-speaker__ctrls"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ha-speaker__btn",
    "aria-label": "Previous",
    onClick: onPrev
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "skip-previous",
    size: "md"
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ha-speaker__btn ha-speaker__btn--play",
    "aria-label": playing ? "Pause" : "Play",
    onClick: onPlayPause
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: playing ? "pause" : "play",
    size: "md"
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ha-speaker__btn",
    "aria-label": "Next",
    onClick: onNext
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "skip-next",
    size: "md"
  }))));
}
Object.assign(__ds_scope, { SpeakerCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/entities/SpeakerCard.jsx", error: String((e && e.message) || e) }); }

// components/entities/ThermostatCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.ha-thermo { display: flex; align-items: center; gap: var(--space-6,24px); width: 100%; box-sizing: border-box; padding: var(--space-6,24px); border-radius: var(--radius-lg); background: var(--color-surface); font-family: var(--font-body); }
.ha-thermo__info { flex: 1; min-width: 0; }
.ha-thermo__mode { font-size: var(--text-sm,13px); color: var(--color-text-secondary); margin-bottom: var(--space-1,4px); }
.ha-thermo__temp { font-family: var(--font-display); font-weight: var(--weight-bold,600); font-size: var(--text-3xl,38px); line-height: 1; font-variant-numeric: tabular-nums; }
.ha-thermo__unit { font-size: var(--text-lg,20px); color: var(--color-text-secondary); margin-left: 2px; }
.ha-thermo__target { font-family: var(--font-mono); font-size: var(--text-sm,13px); color: var(--color-text-secondary); margin-top: var(--space-2,8px); }
.ha-thermo__ctrls { display: flex; align-items: center; gap: var(--space-3,12px); }
.ha-thermo__btn {
  display: inline-flex; align-items: center; justify-content: center; flex: none;
  width: var(--touch-target-desktop,32px); height: var(--touch-target-desktop,32px);
  border: 1px solid var(--color-border); background: var(--color-surface-raised);
  color: var(--color-text-primary); border-radius: var(--radius-full); cursor: pointer;
  transition: background-color var(--duration-normal,200ms) var(--easing-out,ease-out);
}
.ha-thermo__btn:hover { background: var(--color-overlay); }
@media (max-width: 1279px) { .ha-thermo__btn { width: var(--touch-target-tablet,44px); height: var(--touch-target-tablet,44px); } }
@media (max-width: 767px) { .ha-thermo__btn { width: var(--touch-target-mobile,56px); height: var(--touch-target-mobile,56px); } }
`;
function ensureStyles() {
  if (typeof document === "undefined" || document.getElementById("ha-thermo-css")) return;
  const s = document.createElement("style");
  s.id = "ha-thermo-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}

/**
 * ThermostatCard — full-width climate card. Mode label, big mono current
 * temperature (Inter Tight / --text-3xl), and large − / + controls whose touch
 * targets scale up on mobile. Controlled via `target` + onStep(delta).
 */
function ThermostatCard({
  mode = "Automatic",
  current,
  unit = "°C",
  target,
  onStep,
  style,
  ...rest
}) {
  ensureStyles();
  return /*#__PURE__*/React.createElement("div", _extends({
    className: "ha-thermo",
    style: style
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "ha-thermo__info"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ha-thermo__mode"
  }, mode), /*#__PURE__*/React.createElement("div", {
    className: "ha-thermo__temp"
  }, current, /*#__PURE__*/React.createElement("span", {
    className: "ha-thermo__unit"
  }, unit)), target != null && /*#__PURE__*/React.createElement("div", {
    className: "ha-thermo__target"
  }, "Set to ", target, unit)), /*#__PURE__*/React.createElement("div", {
    className: "ha-thermo__ctrls"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ha-thermo__btn",
    "aria-label": "Lower temperature",
    onClick: () => onStep && onStep(-0.5)
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "minus",
    size: "lg"
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ha-thermo__btn",
    "aria-label": "Raise temperature",
    onClick: () => onStep && onStep(0.5)
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "plus",
    size: "lg"
  }))));
}
Object.assign(__ds_scope, { ThermostatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/entities/ThermostatCard.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.ha-check { display: inline-flex; align-items: center; gap: var(--space-2,8px); cursor: pointer; font-family: var(--font-body); font-size: var(--text-base,15px); color: var(--color-text-primary); }
.ha-check[aria-disabled="true"] { cursor: not-allowed; color: var(--color-text-disabled); }
.ha-check__box {
  display: inline-flex; align-items: center; justify-content: center; flex: none;
  width: 20px; height: 20px; border-radius: var(--radius-sm);
  border: 1px solid var(--color-border); background: var(--color-surface);
  color: #fff; transition: background-color var(--duration-fast,150ms) var(--easing-out,ease-out),
              border-color var(--duration-fast,150ms) var(--easing-out,ease-out);
}
.ha-check[aria-checked="true"] .ha-check__box,
.ha-check[aria-checked="mixed"] .ha-check__box { background: var(--color-accent); border-color: var(--color-accent); }
.ha-check:focus-visible { outline: none; }
.ha-check:focus-visible .ha-check__box { outline: 2px solid var(--color-accent); outline-offset: 2px; }
`;
function ensureStyles() {
  if (typeof document === "undefined" || document.getElementById("ha-check-css")) return;
  const s = document.createElement("style");
  s.id = "ha-check-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}

/**
 * Checkbox — custom-styled, never the browser default. Supports an
 * indeterminate state. Controlled via `checked` + `onChange(next)`.
 * Label is clickable. role=checkbox, Space/Enter toggle.
 */
function Checkbox({
  checked = false,
  indeterminate = false,
  onChange,
  disabled,
  label,
  style,
  ...rest
}) {
  ensureStyles();
  const state = indeterminate ? "mixed" : checked;
  const toggle = () => {
    if (!disabled && onChange) onChange(!checked);
  };
  const onKey = e => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      toggle();
    }
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    role: "checkbox",
    "aria-checked": state,
    "aria-disabled": disabled || undefined,
    tabIndex: disabled ? -1 : 0,
    className: "ha-check",
    onClick: toggle,
    onKeyDown: onKey,
    style: style
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "ha-check__box"
  }, indeterminate ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "minus",
    size: "sm"
  }) : checked ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: "sm"
  }) : null), label != null && /*#__PURE__*/React.createElement("span", null, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/FormField.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * FormField — pairs any control with a label (above), optional helper text,
 * and an error message (below), in the system's consistent layout. Wrap a
 * single control as the child. When `error` is set it replaces helper text
 * and turns red.
 */
function FormField({
  label,
  helper,
  error,
  required,
  htmlFor,
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-2)",
      ...style
    }
  }, rest), label && /*#__PURE__*/React.createElement("label", {
    htmlFor: htmlFor,
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "var(--text-sm)",
      fontWeight: "var(--weight-medium)",
      color: "var(--color-text-secondary)"
    }
  }, label, required && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--color-error)",
      marginLeft: 4
    }
  }, "*")), children, (error || helper) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "var(--text-sm)",
      color: error ? "var(--color-error)" : "var(--color-text-tertiary)"
    }
  }, error || helper));
}
Object.assign(__ds_scope, { FormField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/FormField.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.ha-input-wrap { position: relative; display: flex; align-items: center; }
.ha-input {
  width: 100%; box-sizing: border-box; font-family: var(--font-body);
  font-size: var(--text-base,15px); color: var(--color-text-primary);
  background: var(--color-surface); border: 1px solid var(--color-border);
  border-radius: var(--radius-md); padding: 0 var(--space-3,12px);
  min-height: var(--touch-target-desktop,32px); height: 36px;
  transition: border-color var(--duration-normal,200ms) var(--easing-out,ease-out);
}
.ha-input::placeholder { color: var(--color-text-tertiary); }
.ha-input:focus { outline: none; border-color: var(--color-accent); }
.ha-input--search { padding-left: 34px; }
.ha-input--error { border-color: var(--color-error); }
.ha-input[disabled] { color: var(--color-text-disabled); background: var(--color-surface-raised); cursor: not-allowed; }
.ha-input__icon { position: absolute; left: 10px; color: var(--color-text-tertiary); pointer-events: none; }
@media (max-width: 1279px) { .ha-input { height: 44px; font-size: var(--text-md,17px); } }
@media (max-width: 767px) { .ha-input { height: 52px; } }
`;
function ensureStyles() {
  if (typeof document === "undefined" || document.getElementById("ha-input-css")) return;
  const s = document.createElement("style");
  s.id = "ha-input-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}

/**
 * Input — text field. Variants text | search | number. The `search` variant
 * carries a leading magnifier (used by ListToolbar). Error state turns the
 * border red. Pair with FormField for label + helper + error layout.
 */
function Input({
  variant = "text",
  error,
  className = "",
  style,
  ...rest
}) {
  ensureStyles();
  const type = variant === "number" ? "number" : variant === "search" ? "search" : "text";
  return /*#__PURE__*/React.createElement("span", {
    className: "ha-input-wrap",
    style: style
  }, variant === "search" && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "magnify",
    size: "md",
    className: "ha-input__icon"
  }), /*#__PURE__*/React.createElement("input", _extends({
    type: type,
    className: `ha-input${variant === "search" ? " ha-input--search" : ""}${error ? " ha-input--error" : ""} ${className}`,
    "aria-invalid": error ? true : undefined
  }, rest)));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.ha-radio { display: inline-flex; align-items: center; gap: var(--space-2,8px); cursor: pointer; font-family: var(--font-body); font-size: var(--text-base,15px); color: var(--color-text-primary); }
.ha-radio[aria-disabled="true"] { cursor: not-allowed; color: var(--color-text-disabled); }
.ha-radio__ring {
  display: inline-flex; align-items: center; justify-content: center; flex: none;
  width: 20px; height: 20px; border-radius: var(--radius-full);
  border: 1px solid var(--color-border); background: var(--color-surface);
  transition: border-color var(--duration-fast,150ms) var(--easing-out,ease-out);
}
.ha-radio[aria-checked="true"] .ha-radio__ring { border-color: var(--color-accent); border-width: 2px; }
.ha-radio__dot { width: 10px; height: 10px; border-radius: var(--radius-full); background: var(--color-accent); transform: scale(0); transition: transform var(--duration-fast,150ms) var(--easing-spring,ease-out); }
.ha-radio[aria-checked="true"] .ha-radio__dot { transform: scale(1); }
.ha-radio:focus-visible { outline: none; }
.ha-radio:focus-visible .ha-radio__ring { outline: 2px solid var(--color-accent); outline-offset: 2px; }
`;
function ensureStyles() {
  if (typeof document === "undefined" || document.getElementById("ha-radio-css")) return;
  const s = document.createElement("style");
  s.id = "ha-radio-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}

/**
 * Radio — circular custom control. Always used inside a RadioGroup, which
 * owns the selection state and arrow-key navigation. Label is clickable.
 */
function Radio({
  value,
  label,
  checked,
  disabled,
  onSelect,
  style,
  ...rest
}) {
  ensureStyles();
  const select = () => {
    if (!disabled && onSelect) onSelect(value);
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    role: "radio",
    "aria-checked": !!checked,
    "aria-disabled": disabled || undefined,
    tabIndex: disabled ? -1 : checked ? 0 : -1,
    className: "ha-radio",
    onClick: select,
    onKeyDown: e => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        select();
      }
    },
    style: style
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "ha-radio__ring"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ha-radio__dot"
  })), label != null && /*#__PURE__*/React.createElement("span", null, label));
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/RadioGroup.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * RadioGroup — wraps a set of Radio items, owns the selected `value`, and
 * handles arrow-key navigation between options. Pass either `options`
 * ([{value,label,disabled}] or strings) or <Radio> children; controlled via
 * `value` + `onChange(value)`. role=radiogroup.
 */
function RadioGroup({
  value,
  onChange,
  options,
  name,
  label,
  direction = "column",
  children,
  style,
  ...rest
}) {
  const items = options ? options.map(o => typeof o === "string" ? {
    value: o,
    label: o
  } : o) : null;
  const onKeyDown = e => {
    if (!items) return;
    const idx = items.findIndex(o => o.value === value);
    if (["ArrowDown", "ArrowRight"].includes(e.key)) {
      e.preventDefault();
      const next = items[(idx + 1) % items.length];
      onChange && onChange(next.value);
    } else if (["ArrowUp", "ArrowLeft"].includes(e.key)) {
      e.preventDefault();
      const prev = items[(idx - 1 + items.length) % items.length];
      onChange && onChange(prev.value);
    }
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "radiogroup",
    "aria-label": label,
    onKeyDown: onKeyDown,
    style: {
      display: "flex",
      flexDirection: direction,
      gap: "var(--space-3)",
      ...style
    }
  }, rest), items ? items.map(o => /*#__PURE__*/React.createElement(__ds_scope.Radio, {
    key: o.value,
    value: o.value,
    label: o.label,
    disabled: o.disabled,
    checked: o.value === value,
    onSelect: onChange
  })) : children);
}
Object.assign(__ds_scope, { RadioGroup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/RadioGroup.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.ha-select-wrap { position: relative; display: inline-flex; align-items: center; width: 100%; }
.ha-select {
  width: 100%; box-sizing: border-box; appearance: none; -webkit-appearance: none;
  font-family: var(--font-body); font-size: var(--text-base,15px);
  color: var(--color-text-primary); background: var(--color-surface);
  border: 1px solid var(--color-border); border-radius: var(--radius-md);
  padding: 0 34px 0 var(--space-3,12px); height: 36px; cursor: pointer;
  transition: border-color var(--duration-normal,200ms) var(--easing-out,ease-out);
}
.ha-select:focus { outline: none; border-color: var(--color-accent); }
.ha-select[disabled] { color: var(--color-text-disabled); cursor: not-allowed; }
.ha-select__chev { position: absolute; right: 10px; color: var(--color-text-secondary); pointer-events: none; }
@media (max-width: 1279px) { .ha-select { height: 44px; font-size: var(--text-md,17px); } }
@media (max-width: 767px) { .ha-select { height: 52px; } }
`;
function ensureStyles() {
  if (typeof document === "undefined" || document.getElementById("ha-select-css")) return;
  const s = document.createElement("style");
  s.id = "ha-select-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}

/**
 * Select — dropdown matching Input's treatment with a trailing chevron.
 * Pass `options` as [{value, label}] or strings, or supply <option> children.
 * Keyboard-navigable (native select under the hood).
 */
function Select({
  options,
  children,
  className = "",
  style,
  ...rest
}) {
  ensureStyles();
  return /*#__PURE__*/React.createElement("span", {
    className: "ha-select-wrap",
    style: style
  }, /*#__PURE__*/React.createElement("select", _extends({
    className: `ha-select ${className}`
  }, rest), options ? options.map(o => {
    const v = typeof o === "string" ? o : o.value;
    const l = typeof o === "string" ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  }) : children), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: "md",
    className: "ha-select__chev"
  }));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/lists/ListHeader.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.ha-lhead { display: flex; align-items: center; gap: var(--space-3,12px); padding: var(--space-2,8px) var(--space-4,16px); border-bottom: 1px solid var(--color-border); font-family: var(--font-body); }
.ha-lhead__btn { display: inline-flex; align-items: center; gap: 4px; border: none; background: transparent; cursor: pointer; padding: 0; color: var(--color-text-secondary); font-family: var(--font-body); font-size: var(--text-sm,13px); font-weight: var(--weight-medium,500); transition: color var(--duration-normal,200ms) var(--easing-out,ease-out); }
.ha-lhead__btn:hover { color: var(--color-text-primary); }
.ha-lhead__name { flex: 1; }
.ha-lhead__meta { color: var(--color-text-secondary); }
.ha-lhead__arrow { transition: transform var(--duration-fast,150ms) var(--easing-out,ease-out); }
.ha-lhead__arrow--desc { transform: rotate(180deg); }
`;
function ensureStyles() {
  if (typeof document === "undefined" || document.getElementById("ha-lhead-css")) return;
  const s = document.createElement("style");
  s.id = "ha-lhead-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}

/**
 * ListHeader — the column-label row shown once above ListRows. Left "Name"
 * with a sort-direction arrow; right an active secondary column label
 * (e.g. "Last triggered"), right-aligned and secondary-colored. 1px bottom
 * hairline. Tapping a label toggles direction.
 *   nameLabel, metaLabel, sortKey (which column is active), direction asc|desc,
 *   onSort(key)
 */
function ListHeader({
  nameLabel = "Name",
  metaLabel,
  sortKey = "name",
  direction = "asc",
  onSort,
  style,
  ...rest
}) {
  ensureStyles();
  const arrow = active => active ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "arrow-up",
    size: "sm",
    className: `ha-lhead__arrow${direction === "desc" ? " ha-lhead__arrow--desc" : ""}`
  }) : null;
  return /*#__PURE__*/React.createElement("div", _extends({
    className: "ha-lhead",
    style: style
  }, rest), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ha-lhead__btn ha-lhead__name",
    onClick: () => onSort && onSort("name"),
    "aria-label": `Sort by ${nameLabel}`
  }, nameLabel, arrow(sortKey === "name")), metaLabel && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ha-lhead__btn ha-lhead__meta",
    onClick: () => onSort && onSort("meta"),
    "aria-label": `Sort by ${metaLabel}`
  }, metaLabel, arrow(sortKey === "meta")));
}
Object.assign(__ds_scope, { ListHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/lists/ListHeader.jsx", error: String((e && e.message) || e) }); }

// components/lists/ListRow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SPACE_COLOR = {
  shared: "var(--color-space-shared)",
  personal: "var(--color-space-personal)",
  admin: "var(--color-space-admin)"
};
const CSS = `
.ha-lrow { display: flex; align-items: center; gap: var(--space-3,12px); width: 100%; box-sizing: border-box; text-align: left; padding: var(--space-3,12px) var(--space-4,16px); border: none; border-bottom: 1px solid var(--color-border); border-left: 3px solid transparent; background: transparent; cursor: pointer; font-family: var(--font-body); color: var(--color-text-primary); transition: background-color var(--duration-normal,200ms) var(--easing-out,ease-out); min-height: var(--touch-target-desktop,32px); }
.ha-lrow:hover, .ha-lrow:focus-within { background: var(--color-surface); }
.ha-lrow__ico { color: var(--color-text-secondary); flex: none; }
.ha-lrow__name { font-size: var(--text-base,15px); flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ha-lrow__tags { display: flex; flex-wrap: wrap; gap: var(--space-1,4px); flex: none; max-width: 40%; }
.ha-lrow__meta { font-family: var(--font-mono); font-size: var(--text-sm,13px); color: var(--color-text-secondary); flex: none; white-space: nowrap; }
.ha-lrow__action { flex: none; display: flex; align-items: center; }
.ha-lrow__chev { color: var(--color-text-tertiary); }
@media (max-width: 767px) { .ha-lrow { min-height: var(--touch-target-mobile,56px); } .ha-lrow__tags { display: none; } }
`;
function ensureStyles() {
  if (typeof document === "undefined" || document.getElementById("ha-lrow-css")) return;
  const s = document.createElement("style");
  s.id = "ha-lrow-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}

/**
 * ListRow — one item in a list. Left entity icon, the name (full width),
 * optional Chip tags between name and metadata, right-aligned mono metadata
 * (timestamps), and an optional trailing control (a Toggle, or a chevron for
 * navigation). Rows divide with a 1px hairline, no background alternation;
 * hover/focus fills --color-surface. A `space` adds the colored left-border.
 * Pass `action` (e.g. a <Toggle/>) to render at the far right instead of a
 * chevron; the row click is suppressed when the action is interacted with.
 */
function ListRow({
  icon,
  name,
  tags,
  meta,
  action,
  space,
  onClick,
  style,
  ...rest
}) {
  ensureStyles();
  return /*#__PURE__*/React.createElement("div", _extends({
    className: "ha-lrow",
    role: "button",
    tabIndex: 0,
    onClick: onClick,
    onKeyDown: e => {
      if (e.key === "Enter") onClick && onClick(e);
    },
    style: {
      borderLeftColor: space ? SPACE_COLOR[space] : "transparent",
      ...style
    }
  }, rest), icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: "md",
    className: "ha-lrow__ico"
  }), /*#__PURE__*/React.createElement("span", {
    className: "ha-lrow__name"
  }, name), tags && /*#__PURE__*/React.createElement("span", {
    className: "ha-lrow__tags"
  }, tags), meta && /*#__PURE__*/React.createElement("span", {
    className: "ha-lrow__meta"
  }, meta), /*#__PURE__*/React.createElement("span", {
    className: "ha-lrow__action",
    onClick: e => e.stopPropagation()
  }, action != null ? action : /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-right",
    size: "md",
    className: "ha-lrow__chev"
  })));
}
Object.assign(__ds_scope, { ListRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/lists/ListRow.jsx", error: String((e && e.message) || e) }); }

// components/lists/ListToolbar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.ha-ltoolbar { display: flex; align-items: center; gap: var(--space-2,8px); padding: var(--space-3,12px) var(--space-4,16px); flex-wrap: wrap; font-family: var(--font-body); }
.ha-ltoolbar__search { flex: 1; min-width: 180px; }
.ha-ltoolbar__group { display: flex; align-items: center; gap: var(--space-2,8px); }
.ha-ltoolbar__view { display: inline-flex; gap: 2px; background: var(--color-surface); border-radius: var(--radius-md); padding: 2px; }
.ha-ltoolbar__vbtn { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border: none; background: transparent; color: var(--color-text-secondary); border-radius: var(--radius-sm); cursor: pointer; transition: background-color var(--duration-normal,200ms) var(--easing-out,ease-out), color var(--duration-normal,200ms) var(--easing-out,ease-out); }
.ha-ltoolbar__vbtn[aria-pressed="true"] { background: var(--color-surface-raised); color: var(--color-text-primary); }
@media (max-width: 767px) { .ha-ltoolbar__group--secondary { display: none; } }
`;
function ensureStyles() {
  if (typeof document === "undefined" || document.getElementById("ha-ltoolbar-css")) return;
  const s = document.createElement("style");
  s.id = "ha-ltoolbar-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}

/**
 * ListToolbar — the rail above a list. Left to right: a Filters button, an
 * icon button for more options, a search input whose placeholder shows the
 * count ("Search 258 automations"), Group by and Sort by selects, and a
 * list/card view toggle. On mobile, secondary controls collapse behind the
 * overflow button. Composes Input, Select, and Button primitives.
 */
function ListToolbar({
  count,
  noun = "items",
  search,
  onSearch,
  groupOptions,
  groupBy,
  onGroupBy,
  sortOptions,
  sortBy,
  onSortBy,
  view = "list",
  onView,
  onFilters,
  onOverflow,
  style,
  ...rest
}) {
  ensureStyles();
  return /*#__PURE__*/React.createElement("div", _extends({
    className: "ha-ltoolbar",
    style: style
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "ha-ltoolbar__group"
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "secondary",
    size: "sm",
    iconRight: "chevron-down",
    onClick: onFilters
  }, "Filters"), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "ghost",
    size: "sm",
    icon: "tune-variant",
    "aria-label": "More filter options",
    onClick: onOverflow
  })), /*#__PURE__*/React.createElement("div", {
    className: "ha-ltoolbar__search"
  }, /*#__PURE__*/React.createElement(__ds_scope.Input, {
    variant: "search",
    value: search,
    onChange: onSearch,
    placeholder: count != null ? `Search ${count} ${noun}` : `Search ${noun}`
  })), /*#__PURE__*/React.createElement("div", {
    className: "ha-ltoolbar__group ha-ltoolbar__group--secondary"
  }, groupOptions && /*#__PURE__*/React.createElement(__ds_scope.Select, {
    value: groupBy,
    onChange: onGroupBy,
    options: groupOptions,
    "aria-label": "Group by",
    style: {
      width: 150
    }
  }), sortOptions && /*#__PURE__*/React.createElement(__ds_scope.Select, {
    value: sortBy,
    onChange: onSortBy,
    options: sortOptions,
    "aria-label": "Sort by",
    style: {
      width: 170
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "ha-ltoolbar__view",
    role: "group",
    "aria-label": "View"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ha-ltoolbar__vbtn",
    "aria-pressed": view === "list",
    "aria-label": "List view",
    onClick: () => onView && onView("list")
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "format-list-bulleted",
    size: "md"
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ha-ltoolbar__vbtn",
    "aria-pressed": view === "card",
    "aria-label": "Card view",
    onClick: () => onView && onView("card")
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "view-grid-outline",
    size: "md"
  }))));
}
Object.assign(__ds_scope, { ListToolbar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/lists/ListToolbar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/AppShell.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState,
  useRef,
  useEffect
} = React;
const CSS = `
.ha-shell { display: grid; height: 100%; min-height: 100%; background: var(--color-bg); color: var(--color-text-primary); font-family: var(--font-body); }
.ha-shell__rail { background: var(--color-surface); border-right: 1px solid var(--color-border-subtle); overflow-y: auto; }
.ha-shell__main { overflow-y: auto; min-width: 0; }
.ha-shell__panel { background: var(--color-surface); border-left: 1px solid var(--color-border-subtle); overflow-y: auto; }
.ha-shell__bar { background: var(--color-surface); border-top: 1px solid var(--color-border-subtle); }

/* desktop ≥1280: rail + main + panel */
.ha-shell--desktop { grid-template-columns: var(--rail-width,56px) 1fr var(--panel-width,320px); grid-template-rows: 100%; }
.ha-shell--desktop .ha-shell__bar { display: none; }
/* tablet 768–1279: rail + main */
.ha-shell--tablet { grid-template-columns: var(--rail-width,56px) 1fr; grid-template-rows: 100%; }
.ha-shell--tablet .ha-shell__panel, .ha-shell--tablet .ha-shell__bar { display: none; }
/* mobile <768: main + bottom bar */
.ha-shell--mobile { grid-template-columns: 100%; grid-template-rows: 1fr var(--bar-height,56px); }
.ha-shell--mobile .ha-shell__rail, .ha-shell--mobile .ha-shell__panel { display: none; }
`;
function ensureStyles() {
  if (typeof document === "undefined" || document.getElementById("ha-shell-css")) return;
  const s = document.createElement("style");
  s.id = "ha-shell-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}
function bpFor(w) {
  if (w >= 1280) return "desktop";
  if (w >= 768) return "tablet";
  return "mobile";
}

/**
 * AppShell — the responsive frame. Auto-detects breakpoint via ResizeObserver
 * (override with `breakpoint`). Lays out the bookmark rail/bar, main content,
 * and the desktop-only contextual panel. Pass the regions as props:
 *   <AppShell rail={<BookmarkNav/>} panel={<Panel/>}>{mainContent}</AppShell>
 * On mobile, `rail` is rendered as the bottom bar (BookmarkNav reads
 * orientation from its own context, or pass a separate `bar`).
 */
function AppShell({
  breakpoint,
  rail,
  panel,
  bar,
  children,
  style,
  ...rest
}) {
  ensureStyles();
  const ref = useRef(null);
  const [bp, setBp] = useState(breakpoint || "desktop");
  useEffect(() => {
    if (breakpoint || !ref.current || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(entries => {
      const w = entries[0].contentRect.width;
      setBp(bpFor(w));
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [breakpoint]);
  const active = breakpoint || bp;
  return /*#__PURE__*/React.createElement("div", _extends({
    ref: ref,
    className: `ha-shell ha-shell--${active}`,
    "data-breakpoint": active,
    style: style
  }, rest), (active === "desktop" || active === "tablet") && /*#__PURE__*/React.createElement("aside", {
    className: "ha-shell__rail",
    "aria-label": "Bookmarks"
  }, rail), /*#__PURE__*/React.createElement("main", {
    className: "ha-shell__main"
  }, children), active === "desktop" && /*#__PURE__*/React.createElement("aside", {
    className: "ha-shell__panel",
    "aria-label": "For you"
  }, panel), active === "mobile" && /*#__PURE__*/React.createElement("nav", {
    className: "ha-shell__bar",
    "aria-label": "Bookmarks"
  }, bar || rail));
}
Object.assign(__ds_scope, { AppShell });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/AppShell.jsx", error: String((e && e.message) || e) }); }

// components/navigation/BookmarkNav.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.ha-bnav { display: flex; gap: var(--space-1,4px); }
.ha-bnav--vertical { flex-direction: column; align-items: center; padding: var(--space-3,12px) var(--space-2,8px); height: 100%; }
.ha-bnav--vertical .ha-bnav__spacer { margin-top: auto; }
.ha-bnav--horizontal { flex-direction: row; justify-content: space-around; align-items: stretch; padding: 0 var(--space-2,8px); height: 100%; }

.ha-bnav__item {
  position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 2px; border: none; background: transparent; cursor: pointer;
  color: var(--color-text-secondary); font-family: var(--font-body);
  border-radius: var(--radius-md); text-decoration: none;
  transition: background-color var(--duration-normal,200ms) var(--easing-out,ease-out), color var(--duration-normal,200ms) var(--easing-out,ease-out);
}
.ha-bnav__item:hover { color: var(--color-text-primary); background: var(--color-surface-raised); }
.ha-bnav__item[aria-current="page"] { color: var(--color-text-primary); background: var(--color-accent-subtle); }
.ha-bnav__item[aria-current="page"] .ha-bnav__ico { color: var(--color-accent); }
.ha-bnav__label { font-size: 10px; font-weight: var(--weight-medium,500); }

.ha-bnav--vertical .ha-bnav__item { width: 40px; height: 40px; }
.ha-bnav--vertical .ha-bnav__label { display: none; }
.ha-bnav--vertical .ha-bnav__item::after {
  content: attr(data-label); position: absolute; left: calc(100% + 8px); top: 50%; transform: translateY(-50%);
  background: var(--color-overlay); color: var(--color-text-primary); font-size: var(--text-sm,13px);
  padding: 4px 8px; border-radius: var(--radius-sm); white-space: nowrap; opacity: 0; pointer-events: none;
  transition: opacity var(--duration-fast,150ms) var(--easing-out,ease-out); z-index: 10;
}
.ha-bnav--vertical .ha-bnav__item:hover::after { opacity: 1; }
.ha-bnav--horizontal .ha-bnav__item { flex: 1; min-height: var(--touch-target-mobile,56px); max-width: 88px; }
`;
function ensureStyles() {
  if (typeof document === "undefined" || document.getElementById("ha-bnav-css")) return;
  const s = document.createElement("style");
  s.id = "ha-bnav-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}

/**
 * BookmarkNav — the persona's personal shortcut bar. Same purpose on every
 * breakpoint; only orientation differs. Shows up to 6 bookmarked destinations
 * plus a fixed trailing "More". `orientation` vertical = rail (desktop/tablet),
 * horizontal = bottom bar (mobile). Items: [{id, label, icon, onClick|href}].
 */
function BookmarkNav({
  items = [],
  activeId,
  orientation = "vertical",
  onNavigate,
  moreId = "more",
  style,
  ...rest
}) {
  ensureStyles();
  const shown = items.slice(0, 6);
  const all = [...shown, {
    id: moreId,
    label: "More",
    icon: "dots-horizontal"
  }];
  return /*#__PURE__*/React.createElement("div", _extends({
    className: `ha-bnav ha-bnav--${orientation}`,
    style: style
  }, rest), all.map((it, i) => {
    const Tag = it.href ? "a" : "button";
    const isMore = it.id === moreId;
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: it.id
    }, orientation === "vertical" && isMore && /*#__PURE__*/React.createElement("span", {
      className: "ha-bnav__spacer"
    }), /*#__PURE__*/React.createElement(Tag, {
      className: "ha-bnav__item",
      href: it.href,
      type: it.href ? undefined : "button",
      "data-label": it.label,
      "aria-current": it.id === activeId ? "page" : undefined,
      "aria-label": it.label,
      onClick: e => {
        it.onClick && it.onClick(e);
        onNavigate && onNavigate(it.id);
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: it.icon,
      size: "md",
      className: "ha-bnav__ico"
    }), /*#__PURE__*/React.createElement("span", {
      className: "ha-bnav__label"
    }, it.label)));
  }));
}
Object.assign(__ds_scope, { BookmarkNav });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/BookmarkNav.jsx", error: String((e && e.message) || e) }); }

// components/navigation/MorePage.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SPACE_COLOR = {
  shared: "var(--color-space-shared)",
  personal: "var(--color-space-personal)",
  admin: "var(--color-space-admin)"
};
const CSS = `
.ha-more { background: var(--color-bg); min-height: 100%; padding: var(--space-6,24px); }
.ha-more__group { margin-bottom: var(--space-8,32px); }
.ha-more__ghead { display: flex; align-items: center; gap: var(--space-2,8px); font-size: var(--text-sm,13px); font-weight: var(--weight-bold,600); color: var(--color-text-secondary); margin-bottom: var(--space-3,12px); }
.ha-more__dot { width: 8px; height: 8px; border-radius: var(--radius-full); }
.ha-more__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: var(--space-2,8px); }
.ha-more__item {
  position: relative; display: flex; align-items: center; gap: var(--space-3,12px);
  padding: var(--space-3,12px) var(--space-4,16px); border: none; cursor: pointer; text-align: left; width: 100%;
  background: var(--color-surface); border-left: 3px solid transparent; border-radius: var(--radius-md);
  color: var(--color-text-primary); font-family: var(--font-body); font-size: var(--text-base,15px);
  text-decoration: none; transition: background-color var(--duration-normal,200ms) var(--easing-out,ease-out);
}
.ha-more__item:hover { background: var(--color-surface-raised); }
.ha-more__ico { color: var(--color-text-secondary); }
.ha-more__label { flex: 1; }
`;
function ensureStyles() {
  if (typeof document === "undefined" || document.getElementById("ha-more-css")) return;
  const s = document.createElement("style");
  s.id = "ha-more-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}
const SECTIONS = [{
  space: "shared",
  title: "Shared"
}, {
  space: "personal",
  title: "Personal"
}, {
  space: "admin",
  title: "Admin"
}];

/**
 * MorePage — a FULL PAGE (not a sheet) listing every destination the current
 * persona can reach, grouped by space. Same treatment on mobile and desktop;
 * it replaces the main content area. Admin section appears only when present
 * in `groups`. Use with PageHeader for the back affordance.
 *   groups = { shared: [{id,label,icon,badge}], personal: [...], admin: [...] }
 */
function MorePage({
  groups = {},
  onNavigate,
  style,
  ...rest
}) {
  ensureStyles();
  return /*#__PURE__*/React.createElement("div", _extends({
    className: "ha-more",
    style: style
  }, rest), SECTIONS.map(({
    space,
    title
  }) => {
    const items = groups[space];
    if (!items || !items.length) return null;
    return /*#__PURE__*/React.createElement("section", {
      className: "ha-more__group",
      key: space
    }, /*#__PURE__*/React.createElement("div", {
      className: "ha-more__ghead"
    }, /*#__PURE__*/React.createElement("span", {
      className: "ha-more__dot",
      style: {
        background: SPACE_COLOR[space]
      }
    }), title), /*#__PURE__*/React.createElement("div", {
      className: "ha-more__grid"
    }, items.map(it => {
      const Tag = it.href ? "a" : "button";
      return /*#__PURE__*/React.createElement(Tag, {
        key: it.id,
        className: "ha-more__item",
        href: it.href,
        type: it.href ? undefined : "button",
        style: {
          borderLeftColor: SPACE_COLOR[space]
        },
        onClick: () => onNavigate && onNavigate(it.id)
      }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
        name: it.icon,
        size: "lg",
        className: "ha-more__ico"
      }), /*#__PURE__*/React.createElement("span", {
        className: "ha-more__label"
      }, it.label), it.badge ? /*#__PURE__*/React.createElement("span", {
        style: {
          position: "relative",
          width: 18,
          height: 18
        }
      }, /*#__PURE__*/React.createElement(__ds_scope.Badge, {
        count: it.badge
      })) : null);
    })));
  }));
}
Object.assign(__ds_scope, { MorePage });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/MorePage.jsx", error: String((e && e.message) || e) }); }

// components/navigation/PageHeader.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.ha-pagehead { display: flex; align-items: center; gap: var(--space-3,12px); padding: var(--space-6,24px); }
.ha-pagehead__back {
  display: inline-flex; align-items: center; justify-content: center; flex: none;
  width: 40px; height: 40px; margin-left: -8px; border: none; background: transparent; cursor: pointer;
  border-radius: var(--radius-md); color: var(--color-text-secondary);
  transition: background-color var(--duration-normal,200ms) var(--easing-out,ease-out), color var(--duration-normal,200ms) var(--easing-out,ease-out);
}
.ha-pagehead__back:hover { background: var(--color-surface-raised); color: var(--color-text-primary); }
.ha-pagehead__title { flex: 1; min-width: 0; font-family: var(--font-display); font-weight: var(--weight-bold,600); font-size: var(--text-2xl,30px); line-height: var(--leading-tight,1.2); letter-spacing: -0.01em; margin: 0; }
.ha-pagehead__sub { font-family: var(--font-body); font-size: var(--text-sm,13px); color: var(--color-text-secondary); margin-top: 2px; }
.ha-pagehead__cta { display: flex; align-items: center; gap: var(--space-2,8px); flex: none; }
`;
function ensureStyles() {
  if (typeof document === "undefined" || document.getElementById("ha-pagehead-css")) return;
  const s = document.createElement("style");
  s.id = "ha-pagehead-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}

/* inline back chevron so the header needs no icon font for its core affordance */
function BackChevron() {
  return /*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M15 18l-6-6 6-6"
  }));
}

/**
 * PageHeader — large left-aligned title (Inter Tight, --text-2xl, weight 600).
 * Shows a back affordance when `onBack` is given (always show it when drilled
 * into an area). Right-side `cta` slot for actions.
 */
function PageHeader({
  title,
  subtitle,
  onBack,
  cta,
  style,
  ...rest
}) {
  ensureStyles();
  return /*#__PURE__*/React.createElement("header", _extends({
    className: "ha-pagehead",
    style: style
  }, rest), onBack && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ha-pagehead__back",
    "aria-label": "Back",
    onClick: onBack
  }, /*#__PURE__*/React.createElement(BackChevron, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("h1", {
    className: "ha-pagehead__title"
  }, title), subtitle && /*#__PURE__*/React.createElement("div", {
    className: "ha-pagehead__sub"
  }, subtitle)), cta && /*#__PURE__*/React.createElement("div", {
    className: "ha-pagehead__cta"
  }, cta));
}
Object.assign(__ds_scope, { PageHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/PageHeader.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Sheet.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useEffect
} = React;
const CSS = `
.ha-sheet__scrim {
  position: fixed; inset: 0; background: var(--color-scrim); z-index: 1000;
  opacity: 0; animation: ha-sheet-fade var(--duration-normal,200ms) var(--easing-out,ease-out) forwards;
}
@keyframes ha-sheet-fade { to { opacity: 1; } }
.ha-sheet {
  position: fixed; z-index: 1001; background: var(--color-overlay); color: var(--color-text-primary);
  font-family: var(--font-body); display: flex; flex-direction: column; box-sizing: border-box;
}
/* mobile: bottom sheet */
.ha-sheet--bottom {
  left: 0; right: 0; bottom: 0; max-height: 88vh;
  border-radius: var(--radius-2xl) var(--radius-2xl) 0 0; padding: var(--space-3,12px) var(--space-5,20px) var(--space-6,24px);
  animation: ha-sheet-up var(--duration-slow,300ms) var(--easing-out,ease-out);
}
@keyframes ha-sheet-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
/* tablet/desktop: side sheet */
.ha-sheet--side {
  top: 0; bottom: 0; right: 0; width: min(420px, 90vw);
  border-radius: var(--radius-xl) 0 0 var(--radius-xl); padding: var(--space-6,24px);
  animation: ha-sheet-in var(--duration-slow,300ms) var(--easing-out,ease-out);
}
@keyframes ha-sheet-in { from { transform: translateX(100%); } to { transform: translateX(0); } }
.ha-sheet__handle { width: 36px; height: 4px; border-radius: var(--radius-full); background: var(--color-text-tertiary); margin: 0 auto var(--space-4,16px); flex: none; }
.ha-sheet__title { font-family: var(--font-display); font-weight: var(--weight-bold,600); font-size: var(--text-xl,24px); margin: 0 0 var(--space-4,16px); }
@media (prefers-reduced-motion: reduce) { .ha-sheet, .ha-sheet__scrim { animation: none; } }
`;
function ensureStyles() {
  if (typeof document === "undefined" || document.getElementById("ha-sheet-css")) return;
  const s = document.createElement("style");
  s.id = "ha-sheet-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}

/**
 * Sheet — bottom sheet on mobile, side sheet on tablet/desktop. Backdrop
 * scrim dismisses on click; Escape closes. Mobile shows a drag handle and
 * supports drag-to-dismiss. Set `side` to force the side variant.
 * Render conditionally: {open && <Sheet onClose=…>…</Sheet>}.
 */
function Sheet({
  title,
  side = false,
  onClose,
  children,
  style,
  ...rest
}) {
  ensureStyles();
  const startY = React.useRef(null);
  const sheetRef = React.useRef(null);
  useEffect(() => {
    const onKey = e => {
      if (e.key === "Escape") onClose && onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  const onPointerDown = e => {
    if (!side) startY.current = e.clientY;
  };
  const onPointerMove = e => {
    if (startY.current == null || !sheetRef.current) return;
    const dy = Math.max(0, e.clientY - startY.current);
    sheetRef.current.style.transform = `translateY(${dy}px)`;
  };
  const onPointerUp = e => {
    if (startY.current == null || !sheetRef.current) return;
    const dy = e.clientY - startY.current;
    if (dy > 120) {
      onClose && onClose();
    } else {
      sheetRef.current.style.transform = "";
    }
    startY.current = null;
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "ha-sheet__scrim",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", _extends({
    ref: sheetRef,
    role: "dialog",
    "aria-modal": "true",
    "aria-label": title,
    className: `ha-sheet ${side ? "ha-sheet--side" : "ha-sheet--bottom"}`,
    style: style,
    onClick: e => e.stopPropagation()
  }, rest), !side && /*#__PURE__*/React.createElement("div", {
    className: "ha-sheet__handle",
    style: {
      cursor: "grab",
      touchAction: "none"
    },
    onPointerDown: onPointerDown,
    onPointerMove: onPointerMove,
    onPointerUp: onPointerUp
  }), title && /*#__PURE__*/React.createElement("h2", {
    className: "ha-sheet__title"
  }, title), children));
}
Object.assign(__ds_scope, { Sheet });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Sheet.jsx", error: String((e && e.message) || e) }); }

// components/navigation/PersonaSwitcher.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
const CSS = `
.ha-persona__trigger { display: inline-flex; align-items: center; gap: var(--space-2,8px); border: none; background: transparent; cursor: pointer; padding: 4px; border-radius: var(--radius-md); transition: background-color var(--duration-normal,200ms) var(--easing-out,ease-out); }
.ha-persona__trigger:hover { background: var(--color-surface-raised); }
.ha-persona__list { display: flex; flex-direction: column; gap: var(--space-1,4px); }
.ha-persona__opt { display: flex; align-items: center; gap: var(--space-3,12px); width: 100%; text-align: left; border: none; cursor: pointer; padding: var(--space-3,12px); border-radius: var(--radius-md); background: transparent; color: var(--color-text-primary); font-family: var(--font-body); font-size: var(--text-base,15px); transition: background-color var(--duration-normal,200ms) var(--easing-out,ease-out); }
.ha-persona__opt:hover { background: var(--color-surface-raised); }
.ha-persona__opt[aria-current="true"] { background: var(--color-accent-subtle); }
.ha-persona__name { flex: 1; }
.ha-persona__check { color: var(--color-accent); }
`;
function ensureStyles() {
  if (typeof document === "undefined" || document.getElementById("ha-persona-css")) return;
  const s = document.createElement("style");
  s.id = "ha-persona-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}

/**
 * PersonaSwitcher — DEMO SCAFFOLDING, not part of the concept. Shows the
 * active persona avatar; tapping opens a sheet to switch between demo personas.
 * Switching persona is what re-derives bookmarks, visible spaces, and
 * access-gated content in a demo. Has no production equivalent.
 *   personas = [{ id, name, role }]
 */
function PersonaSwitcher({
  personas = [],
  activeId,
  onSwitch,
  style,
  ...rest
}) {
  ensureStyles();
  const [open, setOpen] = useState(false);
  const active = personas.find(p => p.id === activeId) || personas[0];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    className: "ha-persona__trigger",
    "aria-label": `Switch persona, currently ${active ? active.name : "none"}`,
    onClick: () => setOpen(true),
    style: style
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.ProfileAvatar, {
    name: active ? active.name : "",
    size: "md"
  })), open && /*#__PURE__*/React.createElement(__ds_scope.Sheet, {
    title: "Switch persona",
    onClose: () => setOpen(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "ha-persona__list"
  }, personas.map(p => /*#__PURE__*/React.createElement("button", {
    key: p.id,
    type: "button",
    className: "ha-persona__opt",
    "aria-current": p.id === activeId,
    onClick: () => {
      onSwitch && onSwitch(p.id);
      setOpen(false);
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.ProfileAvatar, {
    name: p.name,
    size: "md"
  }), /*#__PURE__*/React.createElement("span", {
    className: "ha-persona__name"
  }, p.name, p.role && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--color-text-tertiary)",
      marginLeft: 8,
      fontSize: "var(--text-sm)"
    }
  }, p.role)), p.id === activeId && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: "md",
    className: "ha-persona__check"
  }))))));
}
Object.assign(__ds_scope, { PersonaSwitcher });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/PersonaSwitcher.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Submenu.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.ha-submenu { background: var(--color-surface); display: flex; flex-direction: column; height: 100%; }
.ha-submenu__head { display: flex; align-items: center; gap: var(--space-2,8px); padding: var(--space-5,20px) var(--space-4,16px) var(--space-3,12px); }
.ha-submenu__title { flex: 1; font-family: var(--font-display); font-weight: var(--weight-bold,600); font-size: var(--text-xl,24px); margin: 0; }
.ha-submenu__add { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border: none; background: transparent; border-radius: var(--radius-md); color: var(--color-text-secondary); cursor: pointer; transition: background-color var(--duration-normal,200ms) var(--easing-out,ease-out); }
.ha-submenu__add:hover { background: var(--color-surface-raised); color: var(--color-text-primary); }
.ha-submenu__body { overflow-y: auto; padding: var(--space-2,8px); }
.ha-submenu__shead { padding: var(--space-4,16px) var(--space-3,12px) var(--space-2,8px); font-size: var(--text-sm,13px); font-weight: var(--weight-bold,600); color: var(--color-text-tertiary); }
.ha-submenu__item {
  display: flex; align-items: center; gap: var(--space-3,12px); width: 100%; text-align: left;
  padding: var(--space-3,12px); border: none; cursor: pointer; border-radius: var(--radius-md);
  background: transparent; color: var(--color-text-primary); font-family: var(--font-body);
  font-size: var(--text-base,15px); text-decoration: none; min-height: var(--touch-target-desktop,32px);
  transition: background-color var(--duration-normal,200ms) var(--easing-out,ease-out);
}
.ha-submenu__item:hover { background: var(--color-surface-raised); }
.ha-submenu__item[aria-current="page"] { background: var(--color-accent-subtle); color: var(--color-text-primary); }
.ha-submenu__item[aria-current="page"] .ha-submenu__ico { color: var(--color-accent); }
.ha-submenu__ico { color: var(--color-text-secondary); flex: none; }
.ha-submenu__label { flex: 1; }
.ha-submenu__chev { color: var(--color-text-tertiary); flex: none; }
@media (max-width: 767px) { .ha-submenu__item { min-height: var(--touch-target-mobile,56px); } }
`;
function ensureStyles() {
  if (typeof document === "undefined" || document.getElementById("ha-submenu-css")) return;
  const s = document.createElement("style");
  s.id = "ha-submenu-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}

/**
 * Submenu — two-level navigation for sections with their own sub-structure
 * (e.g. Settings). One component, two behaviors set by `variant`:
 *   panel (desktop/tablet) — persistent left panel, always visible, no overlay.
 *   page  (mobile)         — a plain full-page grouped list in the page stack.
 * Both render the same grouped list. Header shows a title + optional `+` CTA.
 *   groups = [{ title, items: [{id, label, icon}] }]
 * On mobile (page), items show a trailing chevron (they navigate forward).
 */
function Submenu({
  title,
  groups = [],
  activeId,
  variant = "panel",
  onAdd,
  onNavigate,
  style,
  ...rest
}) {
  ensureStyles();
  const isPage = variant === "page";
  return /*#__PURE__*/React.createElement("nav", _extends({
    className: "ha-submenu",
    style: {
      width: isPage ? "100%" : "var(--submenu-width, 260px)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "ha-submenu__head"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "ha-submenu__title"
  }, title), onAdd && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ha-submenu__add",
    "aria-label": `Add to ${title}`,
    onClick: onAdd
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "plus",
    size: "lg"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "ha-submenu__body"
  }, groups.map((g, gi) => /*#__PURE__*/React.createElement("div", {
    key: g.title || gi
  }, g.title && /*#__PURE__*/React.createElement("div", {
    className: "ha-submenu__shead"
  }, g.title), g.items.map(it => {
    const Tag = it.href ? "a" : "button";
    return /*#__PURE__*/React.createElement(Tag, {
      key: it.id,
      className: "ha-submenu__item",
      href: it.href,
      type: it.href ? undefined : "button",
      "aria-current": !isPage && it.id === activeId ? "page" : undefined,
      onClick: () => onNavigate && onNavigate(it.id)
    }, it.icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: it.icon,
      size: "md",
      className: "ha-submenu__ico"
    }), /*#__PURE__*/React.createElement("span", {
      className: "ha-submenu__label"
    }, it.label), isPage && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: "chevron-right",
      size: "md",
      className: "ha-submenu__chev"
    }));
  })))));
}
Object.assign(__ds_scope, { Submenu });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Submenu.jsx", error: String((e && e.message) || e) }); }

// components/navigation/TabBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.ha-tabbar { display: flex; gap: var(--space-1,4px); padding: var(--space-1,4px); background: var(--color-surface); border-radius: var(--radius-full); overflow-x: auto; scrollbar-width: none; }
.ha-tabbar::-webkit-scrollbar { display: none; }
.ha-tab {
  position: relative; display: inline-flex; align-items: center; gap: var(--space-2,8px);
  flex: none; border: none; cursor: pointer; white-space: nowrap;
  padding: var(--space-2,8px) var(--space-4,16px); border-radius: var(--radius-full);
  background: transparent; color: var(--color-text-secondary);
  font-family: var(--font-body); font-size: var(--text-sm,13px); font-weight: var(--weight-medium,500);
  min-height: var(--touch-target-desktop,32px);
  transition: background-color var(--duration-normal,200ms) var(--easing-out,ease-out), color var(--duration-normal,200ms) var(--easing-out,ease-out);
}
.ha-tab:hover { color: var(--color-text-primary); }
.ha-tab[aria-selected="true"] { background: var(--color-surface-raised); color: var(--color-text-primary); }
.ha-tab__badge { display: inline-flex; align-items: center; justify-content: center; min-width: 18px; height: 18px; padding: 0 5px; border-radius: var(--radius-full); background: var(--color-accent); color: #fff; font-size: 10px; font-weight: var(--weight-bold,600); }
.ha-tab[aria-selected="true"] .ha-tab__badge { background: var(--color-accent); }
@media (max-width: 767px) { .ha-tab { min-height: var(--touch-target-mobile,56px); } }
`;
function ensureStyles() {
  if (typeof document === "undefined" || document.getElementById("ha-tabbar-css")) return;
  const s = document.createElement("style");
  s.id = "ha-tabbar-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}

/**
 * TabBar — horizontal segmented sub-navigation within a section
 * (Overview / Lights / Climate / …). Scrollable on mobile; active item gets a
 * filled pill. Items: [{id, label, badge}]. Controlled via `activeId`.
 */
function TabBar({
  items = [],
  activeId,
  onChange,
  style,
  ...rest
}) {
  ensureStyles();
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "tablist",
    className: "ha-tabbar",
    style: style
  }, rest), items.map(it => /*#__PURE__*/React.createElement("button", {
    key: it.id,
    role: "tab",
    type: "button",
    "aria-selected": it.id === activeId,
    className: "ha-tab",
    onClick: () => onChange && onChange(it.id)
  }, it.label, it.badge ? /*#__PURE__*/React.createElement("span", {
    className: "ha-tab__badge"
  }, it.badge) : null)));
}
Object.assign(__ds_scope, { TabBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/TabBar.jsx", error: String((e && e.message) || e) }); }

// design-tokens.js
try { (() => {
/* =========================================================================
   HA Concept Car — Design tokens as a plain JS object.
   Mirror of design-tokens.css. Use inside shadow DOM / JS contexts where
   linking the stylesheet is inconvenient, or to read a token value in code.

   COLOR is theme-dependent: `darkColors` and `lightColors` hold the two
   palettes. Everything else (font, type, space, radius, motion, layout) is
   theme-agnostic. `colorsFor(theme)` resolves a palette; `tokens` defaults to
   the DARK palette for backwards compatibility.
   ========================================================================= */

const darkColors = {
  bg: "#18181a",
  surface: "#222226",
  surfaceRaised: "#2c2c32",
  overlay: "#36363e",
  border: "#3a3a42",
  borderSubtle: "#2a2a30",
  textPrimary: "#f0eff8",
  textSecondary: "#9e9daa",
  textTertiary: "#6a6974",
  textDisabled: "#4a4952",
  accent: "#1C6FD6",
  accentHover: "#1a5fb8",
  accentSubtle: "rgba(28, 111, 214, 0.12)",
  onAccent: "#ffffff",
  success: "#4a8c47",
  warning: "#c47a1a",
  error: "#b8342a",
  active: "#f0eff8",
  inactive: "#6a6974",
  successSubtle: "rgba(74, 140, 71, 0.15)",
  warningSubtle: "rgba(196, 122, 26, 0.15)",
  errorSubtle: "rgba(184, 52, 42, 0.15)",
  spaceShared: "#2e7d52",
  spacePersonal: "#1C6FD6",
  spaceAdmin: "#7c5ab8",
  spaceSharedSubtle: "rgba(46, 125, 82, 0.14)",
  spacePersonalSubtle: "rgba(28, 111, 214, 0.14)",
  spaceAdminSubtle: "rgba(124, 90, 184, 0.14)",
  scrim: "rgba(0, 0, 0, 0.55)",
  toggleTrack: "#2c2c32",
  toggleThumb: "#ffffff",
  inverseHover: "#ffffff"
};
const lightColors = {
  bg: "#faf9f6",
  surface: "#eeebe5",
  surfaceRaised: "#e4dfd7",
  overlay: "#d8d2c8",
  border: "#ccc6bb",
  borderSubtle: "#ddd8ce",
  textPrimary: "#1d1c1a",
  textSecondary: "#5a564f",
  textTertiary: "#8a857b",
  textDisabled: "#b3ada1",
  accent: "#1559b8",
  accentHover: "#114a99",
  accentSubtle: "rgba(21, 89, 184, 0.10)",
  onAccent: "#ffffff",
  success: "#2f7a36",
  warning: "#9a5a12",
  error: "#b22d22",
  active: "#1d1c1a",
  inactive: "#8a857b",
  successSubtle: "rgba(47, 122, 54, 0.12)",
  warningSubtle: "rgba(154, 90, 18, 0.12)",
  errorSubtle: "rgba(178, 45, 34, 0.10)",
  spaceShared: "#2c7349",
  spacePersonal: "#1559b8",
  spaceAdmin: "#6a479e",
  spaceSharedSubtle: "rgba(44, 115, 73, 0.12)",
  spacePersonalSubtle: "rgba(21, 89, 184, 0.12)",
  spaceAdminSubtle: "rgba(106, 71, 158, 0.12)",
  scrim: "rgba(28, 26, 22, 0.45)",
  toggleTrack: "#cbc4b6",
  toggleThumb: "#ffffff",
  inverseHover: "#000000"
};

/** Resolve a color palette by theme name ("dark" | "light"). Defaults to dark. */
function colorsFor(theme) {
  return theme === "light" ? lightColors : darkColors;
}

/* Theme-agnostic tokens — identical in both themes. */
const shared = {
  font: {
    display: "'Inter Tight', system-ui, -apple-system, sans-serif",
    body: "'Inter', system-ui, -apple-system, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', ui-monospace, monospace"
  },
  text: {
    xs: "11px",
    sm: "13px",
    base: "15px",
    md: "17px",
    lg: "20px",
    xl: "24px",
    "2xl": "30px",
    "3xl": "38px"
  },
  weight: {
    regular: 400,
    medium: 500,
    bold: 600
  },
  leading: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.65
  },
  proseMeasure: "62ch",
  space: {
    1: "4px",
    2: "8px",
    3: "12px",
    4: "16px",
    5: "20px",
    6: "24px",
    8: "32px",
    10: "40px",
    12: "48px",
    16: "64px"
  },
  radius: {
    none: "0",
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    "2xl": "24px",
    full: "9999px",
    squircle: "20%"
  },
  duration: {
    instant: "0ms",
    fast: "150ms",
    normal: "200ms",
    slow: "300ms"
  },
  easing: {
    default: "ease",
    out: "ease-out",
    spring: "cubic-bezier(0.34, 1.56, 0.64, 1)"
  },
  touchTarget: {
    mobile: "56px",
    tablet: "44px",
    desktop: "32px"
  },
  breakpoint: {
    mobile: 0,
    tablet: 768,
    desktop: 1280,
    big: 1920
  },
  layout: {
    railWidth: "56px",
    panelWidth: "320px",
    barHeight: "56px"
  }
};

/** Build a full token object for a theme. */
function tokensFor(theme) {
  return {
    color: colorsFor(theme),
    ...shared
  };
}

/* Default export keeps the original shape (DARK), so existing imports of
   `tokens.color.*` continue to resolve unchanged. */
const tokens = tokensFor("dark");
Object.assign(__ds_scope, { darkColors, lightColors, colorsFor, tokensFor, tokens });
})(); } catch (e) { __ds_ns.__errors.push({ path: "design-tokens.js", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.ProfileAvatar = __ds_scope.ProfileAvatar;

__ds_ns.SpaceIndicator = __ds_scope.SpaceIndicator;

__ds_ns.Toggle = __ds_scope.Toggle;

__ds_ns.ActivityItem = __ds_scope.ActivityItem;

__ds_ns.AreaCard = __ds_scope.AreaCard;

__ds_ns.AutomationItem = __ds_scope.AutomationItem;

__ds_ns.CameraCard = __ds_scope.CameraCard;

__ds_ns.EntityCard = __ds_scope.EntityCard;

__ds_ns.EntityTile = __ds_scope.EntityTile;

__ds_ns.ForYouWidget = __ds_scope.ForYouWidget;

__ds_ns.SectionHeader = __ds_scope.SectionHeader;

__ds_ns.SpeakerCard = __ds_scope.SpeakerCard;

__ds_ns.ThermostatCard = __ds_scope.ThermostatCard;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.FormField = __ds_scope.FormField;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.RadioGroup = __ds_scope.RadioGroup;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.ListHeader = __ds_scope.ListHeader;

__ds_ns.ListRow = __ds_scope.ListRow;

__ds_ns.ListToolbar = __ds_scope.ListToolbar;

__ds_ns.AppShell = __ds_scope.AppShell;

__ds_ns.BookmarkNav = __ds_scope.BookmarkNav;

__ds_ns.MorePage = __ds_scope.MorePage;

__ds_ns.PageHeader = __ds_scope.PageHeader;

__ds_ns.PersonaSwitcher = __ds_scope.PersonaSwitcher;

__ds_ns.Sheet = __ds_scope.Sheet;

__ds_ns.Submenu = __ds_scope.Submenu;

__ds_ns.TabBar = __ds_scope.TabBar;

})();
