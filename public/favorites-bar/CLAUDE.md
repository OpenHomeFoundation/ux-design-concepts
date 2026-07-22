# Home Assistant for the whole household, project notes

## Copy rules
- **Never use the "&" sign in UI copy.** Always write "and" ("Home and away",
  "Google and Alexa", "Location and presence").

## Design patterns (reuse these)

### Automations always use the flow (flowchart) detail view
Every automation in `household.js` `automations` MUST have a matching entry in
`flows` (keyed by the automation id). Without one, the detail page falls back
to the legacy `routineDetail` layout, which is deprecated: never rely on it,
and always author a flow when adding an automation.

### Titled section card
A section on a settings / account page is a **bold heading above a surface card**
(not a heading inside the card). Use it for grouping fields (Contact information,
About me, Region, etc.).

- Heading: `fontFamily: var(--font-display)`, `fontSize: var(--text-base)`,
  `fontWeight: 700`, `letterSpacing: -0.01em`, `color: var(--color-text-primary)`,
  and `paddingLeft: var(--space-6)` so the title aligns with the card's inner
  content (cards use `cloudPad` = `var(--space-6)` padding).
- Heading sits directly above the card with a small gap (`this.col("var(--space-2)")`).
- Card: `background: var(--color-surface)`, `borderRadius: var(--radius-xl)` (or
  `--radius-lg`). Drop `overflow: hidden` when the card contains an overlay
  dropdown (`ccOverlaySelect`), otherwise the popover is clipped.
- The first/identity card on a page can stand alone with no heading.

Reference implementations: `myProfileBody` (`section()` helper) and
`homeInfoBody` (`titled()` helper).

### Overlay dropdown instead of native select
Prefer `ccOverlaySelect(menuKey, value, options, onChange, { fullWidth, align, label })`
(the app's own popover, styled to match) over the design system's native `Select`
on settings/forms. It uses `state.toolbarMenu` for open/close. The Location source
picker on the Presence page and every Region select on the Home information page use it.

### Mobile topbar account avatar
The account avatar (top-right of the mobile topbar, `avatarBtn` in
`renderTopbar`) appears **only on a top-level destination**: a root you reach
directly, from the tabbar or the More directory (`isTopLevelDest` = a
single-segment route like `/home`, `/devices`, `/people`, `/logs`, `/weather`).
This is independent of the back arrow: a root opened from More keeps its
back-to-More arrow *and* shows the avatar, because it is top-level, just not in
the visible tabbar. Back button and avatar are orthogonal concerns, back =
"not reachable from the visible tabbar", avatar = "this is a top-level
destination". The avatar hides on any drill-in (a deeper path,
`/devices/x`, `/home/floor/y`), in a transient mode (`selecting`, home
`fyEdit`), and inside your own account area (`accountLanding`, `/my/*`) where it
would be redundant.

### Topbar title on settings / account pages
Settings and My-account pages hide the large in-page title and always show the
small title in the topbar. Driven by `forceTopbarTitle(route)`
(`/settings`, `/extensions`, `/my/profile|data|settings`).

### Overlays: sheets, dialogs, confirmations
One engine, two presentations: **bottom sheet `< 768px`, centered dialog
`>= 768px`**. Full rules and rationale in `docs/overlays.md`; the visual spec is
`Overlays Spec.dc.html`. Out of scope: popovers / overflow menus.

- Scrim is always `--color-scrim`, **no blur**; omit it only when the surface
  behind must stay live (Map). The Map sheet adds a scrim only at its **biggest
  detent** (`scrimAtMax`; tap it to collapse). Sheets and dialogs use
  `--color-surface` (matches the tab bar); inner preview tiles raise to
  `--color-surface-raised`. `--color-overlay` is reserved for the compact
  confirm and search dialogs.
- Bottom sheets always use detents and **open at max** height. Dismissible
  sheets have a **single biggest detent** (no resize; drag down to close); only
  the persistent Map sheet has multiple detents and opens at the **smallest**.
  Drag works from the whole surface, not just the handle.
- Close affordance: dismissible sheet = X, no handle; persistent sheet (Map) =
  handle, no X; dialog = X + Escape + scrim tap; **confirmation = no X**, closes
  through its buttons. The close X is the **leading (top-left)** control; in a
  sub-step the **back arrow takes the left slot and the X is dropped** (no
  trailing right-side X).
- Optional primary action: full-width pinned bottom on the sheet, right-aligned
  on the dialog. Omit when changes apply live. Destructive = `danger` variant.
- Z-index uses the `--z-*` scale (`docs/overlays.md`); JS inline styles use the
  numeric literals (`1000` scrim / `1001` panel), not `var()`.

Reference implementations: `renderSheet` (sheet engine), `fyScrim` (desktop
dialog frame), `askConfirm` + `renderConfirm` (confirmation, wired on Sign out
and Remove widget). The FAB "Add" sheet keeps its anchored behavior but adopts
the shared styling tokens.
