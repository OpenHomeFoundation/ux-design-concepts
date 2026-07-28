# Vector map, project notes

A map-only build, split off from the whole-household Home Assistant concept.
It contains one design (`Vector map.dc.html`): the world map with people and
zones, its contextual panel / bottom sheet, and zone editing. Everything else
from the parent prototype (home, devices, automations, dashboards, settings)
was deleted on purpose. Do not reintroduce it.

## Files

- `Vector map.dc.html` — the design. The map IS the app: no rail, no tab bar,
  no topbar.
- `ha-map.js` / `ha-map-styles.js` — the `<ha-world-map>` / `<ha-zone-editor>`
  custom elements (MapLibre) and the light / dark vector basemap styles.
- `map-data.js` — demo data only: personas, people, and `mapData`
  (center, zones, person locations). Exposed on `window.__HH_MOD`.
- `ds/` — local copy of the design system tokens, fonts, bundle and avatars;
  `_ds/…-fababd…/` is the bound design system.

## Copy rules

- **Never use the "&" sign in UI copy.** Always write "and"
  ("Location and presence").

## Design patterns (reuse these)

### Overlay dropdown instead of native select
Prefer `ccOverlaySelect(menuKey, value, options, onChange, { fullWidth, align, label })`
(the app's own popover, styled to match) over the design system's native
`Select`. It uses `state.toolbarMenu` for open / close. The visibility pickers in
the person and zone detail panels use it.

### Overlays: sheets, dialogs, confirmations
One engine, two presentations: **bottom sheet `< 768px`, centered dialog
`>= 768px`**. Full rules in `docs/overlays.md`.

- The map panel is the one **persistent** sheet: multiple detents, opens at the
  **smallest**, handle instead of an X, no scrim until its biggest detent
  (`scrimAtMax`; tap it to collapse). Drag works from the whole surface.
- Sheets and dialogs use `--color-surface`; inner cards raise to
  `--color-surface-raised`. `--color-overlay` is reserved for the confirm dialog.
- **Confirmation = no X**, closes through its buttons; destructive variants
  cannot be dismissed by tapping the scrim.
- Z-index in JS inline styles uses the numeric literals (`1000` scrim /
  `1001` panel), not `var()`.

Reference implementations: `ccPanel` (panel / sheet router), `renderSheet`
(sheet engine), `askConfirm` + `renderConfirm` (wired on Delete zone).
