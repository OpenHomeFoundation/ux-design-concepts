/* =========================================================================
   HA Concept Car — Design tokens as a plain JS object.
   Mirror of design-tokens.css. Use inside shadow DOM / JS contexts where
   linking the stylesheet is inconvenient, or to read a token value in code.

   COLOR is theme-dependent: `darkColors` and `lightColors` hold the two
   palettes. Everything else (font, type, space, radius, motion, layout) is
   theme-agnostic. `colorsFor(theme)` resolves a palette; `tokens` defaults to
   the DARK palette for backwards compatibility.
   ========================================================================= */

export const darkColors = {
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
  inverseHover: "#ffffff",
};

export const lightColors = {
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
  inverseHover: "#000000",
};

/** Resolve a color palette by theme name ("dark" | "light"). Defaults to dark. */
export function colorsFor(theme) {
  return theme === "light" ? lightColors : darkColors;
}

/* Theme-agnostic tokens — identical in both themes. */
const shared = {
  font: {
    display: "'Inter Tight', system-ui, -apple-system, sans-serif",
    body: "'Inter', system-ui, -apple-system, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', ui-monospace, monospace",
  },

  text: {
    xs: "11px", sm: "13px", base: "15px", md: "17px",
    lg: "20px", xl: "24px", "2xl": "30px", "3xl": "38px",
  },

  weight: { regular: 400, medium: 500, bold: 600 },

  leading: { tight: 1.2, normal: 1.5, relaxed: 1.65 },

  proseMeasure: "62ch",

  space: {
    1: "4px", 2: "8px", 3: "12px", 4: "16px", 5: "20px",
    6: "24px", 8: "32px", 10: "40px", 12: "48px", 16: "64px",
  },

  radius: {
    none: "0", sm: "4px", md: "8px", lg: "12px", xl: "16px",
    "2xl": "24px", full: "9999px", squircle: "20%",
  },

  duration: { instant: "0ms", fast: "150ms", normal: "200ms", slow: "300ms" },
  easing: {
    default: "ease",
    out: "ease-out",
    spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  },

  touchTarget: { mobile: "56px", tablet: "44px", desktop: "32px" },

  breakpoint: { mobile: 0, tablet: 768, desktop: 1280, big: 1920 },

  layout: { railWidth: "56px", panelWidth: "320px", barHeight: "56px" },
};

/** Build a full token object for a theme. */
export function tokensFor(theme) {
  return { color: colorsFor(theme), ...shared };
}

/* Default export keeps the original shape (DARK), so existing imports of
   `tokens.color.*` continue to resolve unchanged. */
export const tokens = tokensFor("dark");

export default tokens;
