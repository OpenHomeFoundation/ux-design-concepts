# Home Assistant Concept Car, project notes

## Copy rules
- **Never use the "&" sign in UI copy.** Always write "and" ("Home and away",
  "Google and Alexa", "Location and presence").

## Design patterns (reuse these)

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

### Topbar title on settings / account pages
Settings and My-account pages hide the large in-page title and always show the
small title in the topbar. Driven by `forceTopbarTitle(route)`
(`/settings`, `/extensions`, `/my/profile|data|settings`).
