# HA Concept Car, Design System

A dark-first design system for a **Home Assistant "Concept Car"** prototype: an
exploratory, opinionated take on what a single, shared smart home could feel
like. This repository defines the visual, interaction, and content language. It
covers tokens and a component library only. No pages, screens, or demo data
live here; those belong to the concept build that consumes this system.

## What this is for

The Concept Car imagines one home seen by many people, each with their own
bookmarks, their own private space, and a shared common ground. The system is
built to express that: a small set of generous, honest components that compose
into dashboards, lists, settings, and detail views, and that adapt from a roomy
phone screen to a dense desktop rail to an ambient wall display.

## The two voices, reconciled

The look comes from reconciling two sources:

1. **Open Home Device Database** provides the **structure and discipline**:
   a strict 4px grid, hairlines that carry structure, "color is signal, not
   decoration", and a one-family type hierarchy. ("Less, but better.")
2. **The HA Concept direction** adds **warmth and openness**: rounded forms
   (larger corner radii than the Device Database's 2px default), generous
   spacing on mobile and tablet, and warm-tinted dark surfaces. It is
   Welcoming, Generous, Supportive, and Candid.

The rule of thumb: **desktop stays dense, mobile is roomy.** The Device
Database lends the bones; the Concept direction softens and warms them.

## Sources

- **Open Home Device Database design system** (Claude Design project
  `019df461-7b21-7ed6-9053-5f024d8099c4`, also documented at
  <https://device-database-design.openhomefoundation.org/Contributor%20Wiki#design>).
  Tokens here are adapted from it: the single blue accent `#1C6FD6` is carried
  over verbatim, the type stack (Inter Tight / Inter / JetBrains Mono) is the
  same, and the 4px grid and hairline philosophy are inherited. The Device
  Database is light-first graphite on warm paper; this system inverts that into
  a warm-tinted **dark-first** palette.
- **Open Home Foundation** (home of Home Assistant) for product context and the
  privacy-first, local-control ethos behind the Concept Car.

> No production codebase or Figma file was attached. Tokens follow the
> Concept Car brief's specified values (dark theme primary), informed by the
> Device Database project above. See Caveats.

---

## Index

| File / folder | What it is |
| --- | --- |
| `styles.css` | Global entry point. Consumers link this one file. `@import`s only. |
| `design-tokens.css` | All design tokens as CSS custom properties + base resets. |
| `design-tokens.js` | The same token values as a plain JS object (for shadow DOM / JS). |
| `fonts.css` | Self-hosted `@font-face` rules (Inter, Inter Tight, JetBrains Mono). |
| `fonts/` | Self-hosted woff2 files (latin + latin-ext subsets). |
| `components/core/` | Button, Toggle, Chip, ProfileAvatar, Badge, Icon, SpaceIndicator. |
| `components/forms/` | Input, Select, Checkbox, Radio, RadioGroup, FormField. |
| `components/navigation/` | AppShell, BookmarkNav, MorePage, PersonaSwitcher, TabBar, Submenu, Sheet, PageHeader. |
| `components/entities/` | AreaCard, EntityTile, EntityCard, CameraCard, ThermostatCard, SpeakerCard, ForYouWidget, ActivityItem, AutomationItem, SectionHeader. |
| `components/lists/` | ListToolbar, ListHeader, ListRow. |
| `guidelines/` | Foundation specimen cards (Colors, Type, Spacing, Motion). |
| `assets/brand/` | The Home Assistant mark. |
| `SKILL.md` | Agent-Skill manifest so this folder loads as a skill. |

Each component directory holds `<Name>.jsx` (implementation), `<Name>.d.ts`
(props contract), `<Name>.prompt.md` (one-line usage + example), and one
`*.card.html` that renders the group in the Design System tab.

### Consuming the system

- **Styles:** link `styles.css`. Everything reads from CSS custom properties,
  so theming is token-only.
- **Components:** they are bundled to `_ds_bundle.js` (generated). Read them off
  the global namespace, e.g. `const { Button, EntityTile } = window.HAConceptCarDesignSystem_fababd`.
- **Icons:** components self-inject the Material Design Icons webfont on first
  mount (see Iconography), so no extra setup is needed.

---

## Content fundamentals

The voice is **plain, honest, and direct, never blunt or cold** (the "Candid"
of the four words). It is a home you live in, not a product being sold to you.

**Copy rules (apply to every label, heading, placeholder, helper, tooltip):**

- **No em dashes or en dashes.** Use commas, colons, parentheses, or "to" for
  ranges ("16:00 to 18:00", not "16:00–18:00").
- **No all-caps. Sentence case everywhere.** Never `text-transform: uppercase`.
  Hierarchy comes from weight, size, letter-spacing, and color, not casing.
- **Plain and honest tone.** No marketing language, no filler, no exclamation
  marks in default UI, no emoji unless explicitly asked.
- **"You", not "I".** The home addresses the person: "You unlocked the front
  door." System actions are stated factually: "Front door unlocked 22 minutes
  ago."
- **Verbs over adjectives.** "Drawing 2.4 kW now" beats "High energy use."
- **Acknowledge state honestly.** "Reported unlocked", "Last seen 4 minutes
  ago", "Unknown" are all fine. Do not imply certainty you don't have.
- **Numbers and data** read as raw strings: temperatures `21.5°C`, times `16:42`,
  IDs `light.living_room_ceiling`, firmware `2.3.7-rc1`. Mono font for these.

**Examples**

- Toggle label: *"Sunset lights"* (the automation's plain name).
- Alert: *"Front door unlocked. Unlocked for 22 minutes."* with a "Lock now"
  action, not *"⚠️ Security alert!! Your door is OPEN!"*.
- Empty state: *"No automations match these filters. Add one or loosen a
  filter."*
- Search placeholder: *"Search 258 automations"* (count shown, sentence case).

---

## Visual foundations

Dark-first and warm. Information is grouped by **background elevation**, not by
boxes and borders. Color appears only when it means something.

**Color**
- **Backgrounds are an elevation scale, and the primary grouping tool:**
  `--color-bg` (#18181a, page) → `--color-surface` (#222226, cards) →
  `--color-surface-raised` (#2c2c32, content nested inside a card) →
  `--color-overlay` (#36363e, tooltips and sheets). A dashboard card and the
  entity tiles inside it differ purely by tone. **Never add a border to
  separate groups that color can separate.**
- **Borders are hairlines only** (`--color-border` #3a3a42), reserved for true
  dividers (list-row separators, the header rule), not for grouping.
- **One accent, blue** (`--color-accent` #1C6FD6). It marks links and the one
  live or active thing on a screen. Never a background wash, never decoration.
- **Semantic colors** (success / warning / error) appear on state only.
- **Space accents** (green shared / blue personal / purple admin) appear as 3px
  left-borders and subtle tints to show which space content belongs to.
- **Active vs inactive entities:** active = bright text on surface-raised;
  inactive = muted text on surface. Color and tone carry the state.

**Typography**
- **Inter Tight** for display and headings; hierarchy by weight + size within
  one family. **Inter** for body and UI. **JetBrains Mono** for temperatures,
  IDs, timestamps, and data points.
- Desktop base is a deliberately tight **15px**; mobile and tablet bump to
  **17px** for reach. Never more than three type sizes visible on one screen.
- Type tops out around 38px (`--text-3xl`). There is no marketing hero type.

**Spacing & grid**
- Strict **4px base**, 8px increments preferred. The scale runs 4, 8, 12, 16,
  20, 24, 32, 40, 48, 64px. Desktop layouts are tighter; mobile gets more
  padding and breathing room.

**Corner radii (the warmth)**
- 8px default on most UI (`--radius-md`), 12px on cards (`--radius-lg`), 16px on
  large cards and sheets (`--radius-xl`), 24px on bottom sheets, full pills for
  chips, and a 20% squircle for avatars (rounded square, never a circle).

**Backgrounds & imagery**
- Flat warm-tinted dark surfaces. **No gradients, no background images, no
  textures, no patterns.** If something needs weight, change its elevation, not
  add a glow.

**Borders, shadows, elevation**
- **No drop shadows beyond the implicit 1px hairline.** Depth is communicated by
  the background elevation scale, not by shadow. Cards have no border at rest;
  they sit on a lighter surface than the page.

**Animation**
- Functional, not expressive. Default 200ms `ease-out`; fast 150ms; slow 300ms.
  A gentle spring (`cubic-bezier(0.34, 1.56, 0.64, 1)`) is reserved for sheets
  opening and toggle thumbs. `prefers-reduced-motion: reduce` collapses every
  duration to 0. No parallax, no floating cards, no infinite decorative loops.

**Hover / press states**
- Tap feedback is a subtle `background-color` transition, **no scale
  transforms** (tap targets stay still). Buttons darken; ghost and nav items
  fill to a raised surface; list rows fill `--color-surface`. Structural links
  (cards, nav, section headers) gain accent + underline only on hover; inline
  links underline at rest.

**Transparency / blur**
- Used sparingly: the camera-card label overlay and the persona/sheet scrim. Not
  a general decorative tool.

**Layout & responsiveness**
- Breakpoints: mobile `<768`, tablet `768 to 1279`, desktop `≥1280`, big
  `≥1920`. The AppShell is a 56px bookmark rail + main + 320px contextual panel
  on desktop; rail + main on tablet; main + 56px bottom bookmark bar on mobile.

**Touch targets**
- Generous on mobile (56px), 44px on tablet, a dense 32px on desktop (acceptable
  per Apple HIG). Controls read these automatically from tokens.

---

## Iconography

**Material Design Icons (MDI)**, the same set Home Assistant uses (`mdi:*`),
2px line weight on a 24px grid. The `Icon` component takes an MDI name without
the `mdi-` prefix (`<Icon name="lightbulb" />`) and renders it as a webfont
glyph that inherits `currentColor`.

- **Self-injecting.** The first `Icon` to mount injects the MDI webfont CSS from
  jsDelivr (`@mdi/font@7.4.47`) into the document head, once. Components stay
  self-sufficient with no setup from the consumer.
- **Substitution flag:** for a fully offline build, replace the CDN link in
  `components/core/Icon.jsx` with a locally hosted MDI font or per-icon SVGs.
- **Color:** icons default to the surrounding text color; active states use the
  accent; status icons use the matching semantic color.
- **No emoji** in product UI. A few Unicode glyphs are fine for typographic
  correctness (`·` separator, `…` ellipsis), never as decoration.
- Two structural affordances (the PageHeader back chevron, status dots) are
  inline SVG / CSS so the core navigation never depends on the icon font.

---

## Caveats and known substitutions

- **No codebase or Figma was attached.** Tokens follow the Concept Car brief's
  specified dark-theme values, cross-referenced against the Open Home Device
  Database design project. If a real Concept Car codebase or Figma lands, the
  token values should be re-derived from it.
- **Web components vs React.** The brief described the components as
  `<ha-*>` custom elements with shadow DOM. This system implements them as
  **React components** consuming the same CSS custom properties (light DOM),
  because that is what the design-system platform bundles and exposes to
  consumers. The behavior, props, and visual rules match the brief; the
  delivery mechanism differs. If you specifically need shadow-DOM custom
  elements, this is the gap to flag.
- **Fonts** are **self-hosted** woff2 files in `fonts/` (Inter, Inter Tight,
  JetBrains Mono; latin + latin-ext subsets), wired up in `fonts.css`. They
  carry the SIL Open Font License. To swap in licensed or CDN copies, replace
  the files and the `src` URLs in `fonts.css`; nothing else references them.
- **Icons** load from the MDI CDN at runtime (see Iconography).
- **Brand mark.** `assets/brand/ha-mark.svg` is the official Home Assistant
  mark (the home/circuit glyph in HA cyan `#18BCF2` on off-white `#F2F4F9`). A
  Concept-Car-specific lockup does not exist yet; use the HA mark for now.
