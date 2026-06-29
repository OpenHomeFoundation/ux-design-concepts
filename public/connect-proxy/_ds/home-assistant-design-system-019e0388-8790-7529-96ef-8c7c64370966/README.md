# Home Assistant Design System

A living design system reference for [Home Assistant](https://www.home-assistant.io/) — the open-source smart home platform whose frontend ships as a mobile-first progressive web app used by millions.

This package captures the brand, color tokens, typography, spacing, and component patterns used across the Home Assistant frontend.

## Sources

- **Frontend repo:** https://github.com/home-assistant/frontend
- **Brands repo (integration icons CDN):** https://github.com/home-assistant/brands
- **Developer docs:** https://developers.home-assistant.io/docs/frontend
- **Design portal:** https://design.home-assistant.io
- **Token source:** [`color.globals.ts`](https://github.com/home-assistant/frontend/blob/dev/src/resources/theme/color/color.globals.ts)
- **Integration icon CDN:** `https://brands.home-assistant.io/<domain>/icon.png` (and `dark_icon.png`, `logo.png`)
- **Material Design Icons (icon set):** https://pictogrammers.com/library/mdi/

## Index

- `README.md` — this file (context, content, visual foundations, iconography)
- `SKILL.md` — agent skill manifest
- `colors_and_type.css` — full token sheet (light + dark, MDC bridges, state colors, energy domain)
- `assets/` — official Home Assistant logomark + wordmark (color/monochrome, light/dark variants) from the home-assistant/assets repo
- `preview/` — design-system review cards (auto-rendered in the Design System tab)

## Company / product context

Home Assistant is a free, open-source platform for home automation. The frontend is a single PWA that runs on phones, tablets, desktops, and Home Assistant's own wall-panel hardware. Users range from absolute beginners (one Hue bulb, one phone) to hardcore power users wiring up thousands of entities, custom YAML, and bespoke Lovelace dashboards. The app must scale across that spectrum.

The frontend is **mid-migration from Material Design Components (MDC / Material 2) toward Web Awesome / Material 3 components** — so you'll see `--mdc-*`, `--md-sys-*`, and the newer `--ha-*` tokens coexisting in the same surface. New work should prefer `--ha-*` tokens.

### Key surfaces

1. **Lovelace dashboard** — the home screen. Grid of cards, each card a tight cluster of entity rows / charts / tiles.
2. **Sidebar navigation** — collapses to 64px, expands to 256px. Lovelace, Energy, Map, Logbook, History, Developer Tools, Settings.
3. **Settings & device pages** — long forms, integration tiles, entity tables.
4. **Energy dashboard** — domain-specific colors, big charts.
5. **Configuration / automation editor** — visual flow editor + YAML.

## Content fundamentals

Home Assistant's voice is **practical, technical, and direct.** Friendly but never cute. The audience is a maker / homelab user who wants accurate information.

- **Person:** Second-person ("you can configure this") for explanatory copy. First-person plural ("we recommend") in release notes.
- **Casing:** Sentence case for everything — buttons, headings, menu items. "Add integration", not "Add Integration".
- **Tone:** Plain language. "Living room light is on" — not "Your wonderful living room is glowing!" State labels are literal: *On*, *Off*, *Unavailable*, *Unknown*, *Idle*.
- **Domain vocabulary:** Specific words matter. *Entity*, *device*, *integration*, *automation*, *blueprint*, *helper*, *area*, *zone*, *scene*, *script*. Use these consistently — never "gadget" or "thingy".
- **Numbers & units:** Always show units. `21.5 °C`, `42 %`, `1.2 kWh`. Localized.
- **Errors:** State the problem, then the fix. "Could not connect to MQTT broker — check the host and port in integration settings."
- **Empty states:** Honest. "No automations yet. Create one to get started." No fake enthusiasm.
- **Emoji:** Not used in product UI. Occasionally in the blog / release-notes header for personality.
- **Vibe:** Open-source, technical, transparent. Numbers and names are favored over icons-only.

## Visual foundations

- **Colors:** Brand cyan `#18bcf2` (logo) → `--primary-color: #009ac7` for default theme. Accent `#ff9800` (orange) used sparingly — slider thumbs, energy-solar, brand-accent moments. Surfaces are flat neutrals — the dashboard is a sea of cards on a soft grey/black background.
- **Type:** Roboto stack (Google Fonts), with system fallbacks. **No display fonts, no serifs, no playful weights.** Body 16px / 1.4. Card header 24px / normal. Secondary 14px. Density is moderate — readable on phone first.
- **Backgrounds:** Flat. No images, no gradients (except occasionally subtle on energy charts). The card itself is the surface — `--card-background-color` (white in light, near-black in dark) on top of `--primary-background-color` (light grey / pure black).
- **Cards:** **12px radius**, very subtle shadow, no border, sit on a contrasting surface. This is the dominant visual unit.
- **Animation:** Restrained. State changes fade and slide in 150–250ms with `cubic-bezier(0.4, 0, 0.2, 1)` (Material standard easing). No bounces. Toggle thumbs slide. Charts animate on update. Page transitions are instant.
- **Hover:** 8% overlay tint on interactive elements (`rgba(0,0,0,.08)` light / `rgba(255,255,255,.08)` dark) — Material ripple convention.
- **Press:** Slightly darker overlay + Material ink ripple. No shrink/scale.
- **Borders:** Mostly absent — `--divider-color` is a low-opacity hairline (12% black/white) used for row separators in lists, never around cards.
- **Shadows:** `--ha-box-shadow-s` (cards at rest), `-m` (popovers), `-l` (dialogs). Small and grounded — not airy / floating.
- **Layout:** 8-px grid. Card padding 16px. Card grid gap 8px (compact) or 16px. Entity row 56px tall. Sidebar 64/256.
- **Transparency / blur:** Almost none. Modals get a 50% black scrim. No glassmorphism.
- **Imagery:** Functional only — entity thumbnails (e.g. media art, person photos, brand integration icons). No marketing photography in product.
- **Color vibe:** Cool, neutral, slightly cyan-leaning. Domain colors break through the neutrality with intent — yellow for active light, blue for cool climate, red for triggered alarm.

## Iconography

- **Icon system:** [Material Design Icons (MDI)](https://pictogrammers.com/library/mdi/) via the `<ha-icon icon="mdi:lightbulb">` component. Single-color, line-style, 24×24. Color is inherited from the entity state.
- **No emoji** in product UI.
- **Brand integration logos:** Live from the brands CDN — `https://brands.home-assistant.io/<domain>/icon.png` (256×256 PNG, transparent), `/dark_icon.png` for dark mode, `/logo.png` for landscape lockups. Always fetched live, never bundled.
- **Substitution flag:** This package does **not** ship MDI as a font/sprite — it would bloat the design system. Reference MDI by name and pull glyphs at runtime from the `@mdi/svg` package or Pictogrammers CDN. The single representational logo SVG in `assets/home-assistant-logo.svg` is a **placeholder reconstruction** of the official mark — please replace with the real file from `https://www.home-assistant.io/images/home-assistant-logo.svg` when convenient.

## Component conventions

- **Entity row:** 56px tall. Left: 40px MDI icon (state-colored). Middle: name + secondary state text. Right: control (toggle, value, chevron).
- **Card:** `<ha-card>` — header (24px) + body. 16px padding. 12px radius.
- **Toggle:** Material switch. Track + thumb. Off thumb is `--switch-unchecked-color`.
- **Chip / Assist chip:** Pill (999px radius), 32px tall, label + optional leading icon.
- **Buttons:** MDC variants — `text` (no fill), `outlined` (border), `unelevated` (filled with primary).
- **Tab bar:** Bottom sheet pattern on mobile, top tabs on desktop. Active gets primary underline.
- **State badges:** Per domain × state via `--state-<domain>-<state>-color`.

## Engineering conventions

- **Framework:** Lit (LitElement) web components. Every product element is a custom element with shadow-DOM encapsulation.
- **Naming:** `ha-*` prefix for first-party elements (`ha-card`, `ha-icon`, `ha-icon-button`, `ha-switch`, `ha-textfield`, `ha-list-item`, `ha-dialog`).
- **Theming:** CSS custom properties only — they pierce shadow boundaries. Inline styles are reserved for runtime-driven values (e.g. state color).
- **Styles:** Authored with Lit's `css\`\`` tagged-template literal, scoped to the element. No global utility classes.
- **Direct DOM access** is avoided; data flows through reactive properties and `@property()` decorators.

## CSS variable naming conventions

- `--ha-*` — newer tokens introduced as part of the surface revamp (`--ha-color-surface-1`, `--ha-box-shadow-s`, `--ha-card-border-radius`).
- `--primary-*`, `--secondary-*`, `--card-*` — original theme variables, broadly themable by users.
- `--mdc-*` — Material Design Components bridge (legacy, still load-bearing).
- `--md-sys-*` — Material 3 (Web Awesome) bridge (newest, sparingly used).
- `--state-<domain>-<state>-color` — entity state colors.
- `--energy-<source>-color` — energy dashboard.
