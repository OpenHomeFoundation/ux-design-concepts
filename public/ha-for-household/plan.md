# Home Assistant for the whole household, build plan

The shared reference for every session. Keep it updated as the build progresses.

## What this is

> ## STATUS INDEX (verified against code 2026-07-03) — READ FIRST
>
> The per-section `## ... — PLAN/BUILT` labels below drifted out of sync with the
> code and caused a full re-audit. Trust THIS index; when in doubt, grep the DC.
>
> **Built and shipping in `Home Assistant for the whole household.dc.html`:**
> shell + topbar + collapsing title, mobile nav, For-you smart widget stack,
> per-person self-owned Home (via the `fy*` system, `cc-fy-<id>`), Services
> (6 use-case pages), Tags, Voice assistants, Dashboards, Appearance + light mode
> + Accessibility + default-landing-page picker (logo -> personal landing via
> `goHome`/`effLandingRoute`), Cameras, Files, Entities (list + inspector),
> Discovery/Explore + resident suggest-and-approve flow with co-authoring/credit,
> 3D home embedded on the homepage (full-page layer on desktop/tablet, inline on
> mobile; floor/area drill-in synced with routes, live entity mirror, pointer
> forwarding — see its section near the end).
>
> **Genuinely NOT built yet (real remaining work):**
> 1. **Entity more-info dialog** — exists only as `Entity Dialog Spec.dc.html`;
>    not wired into the app (no `moreInfo(entityId)`, tapping a tile just toggles).
> 2. **Rebuilt tile card** — full per-domain controls exist only in
>    `Tile Card Spec.dc.html`; live `tile()` is identity + toggle only. Blocked
>    on (1).
> 3. **Favoriting an entity in-app** — no star toggle; favorites are seeded per
>    persona in `household.js` only.
> 4. Smaller follow-ups: Settings -> Integrations listing device + service
>    integrations together.
>
> When you finish a piece of work, update BOTH this index and the section label.

## What this is

A navigable, interactive prototype of Home Assistant for the whole household: one
shared home seen by many people, organised around who lives in it rather than
how the tech works. It pressure-tests the information architecture, the access
model (Maintainer vs Resident, four content spaces), and the dock + More
navigation across six demo personas.

Visual design is intentionally light and provisional. Focus is flows, access
patterns, navigation. Built entirely from the bound design system, never
redefining tokens or components.

## Key decisions (agreed)

- **Delivery adapted to this environment.** The prompt described a vanilla
  multi-file build (`pages/*.js`, `router.js`, `<ha-*>` web components). This
  environment builds **Design Components**, and the design system ships as
  **React components** on `window.HAConceptCarDesignSystem_fababd` (light DOM,
  same tokens). So we build **one Design Component**,
  `Home Assistant for the whole household.dc.html`, that composes those React components,
  with hash routing and persona state inside it. The IA, routes, personas,
  data model, and access rules from the prompt are preserved exactly; only the
  file layout differs.
- **Data** lives in a plain ES module `household.js` (the prompt's
  `data/household.js`), imported by the component. No data hardcoded in markup.
- **Primary preview breakpoint: mobile** (bottom dock, full-page More). Fully
  responsive: mobile < 768, tablet 768 to 1279, desktop >= 1280. AppShell
  auto-detects.
- **Data fidelity:** realistic full Janssen household, all floors / areas /
  devices / automations / activity, named entities.
- **Imagery:** neutral placeholders for camera / media for now; user uploads
  real images later (CameraCard/SpeakerCard fall back to placeholders).
- **Persona names:** the prompt's Janssens (Daan, Sofie, Tess, Lars, Greet,
  Nour). PDF renders say "Patrick"; the prompt is authoritative.
- **Scope this session: Phase 1 + Phase 2.** Shell + every IA route reachable
  and recognisable (thin where it can be). Phase 3 hero interactions come after
  review.

## Copy rules (design system, enforced everywhere)

No em or en dashes. No all-caps, sentence case throughout. Plain honest tone,
no marketing, no exclamation, no emoji. "You" not "I". Mono font for data
(temperatures, times, IDs). Numbers as raw strings.

## The framework: two roles, four spaces

- **Maintainer** sets up the home, full access to all four spaces.
- **Resident** lives in the home, sees Shared + Personal, never Admin.
- Spaces are a **property of content**, not a mode. One navigation system. A
  maintainer sees an Edit button a resident does not; nobody switches modes.
- Shared (green) = everyone. Personal (blue) = private to you. Admin (purple) =
  maintainer only. Unresolved = failure state.

## Personas (demo scaffolding only)

| id | name | role | spaces | calibration |
|----|------|------|--------|-------------|
| daan | Daan | maintainer + resident | shared, personal, admin | default on load |
| sofie | Sofie | resident | shared, personal | full resident |
| tess | Tess | resident | shared, personal | teen |
| lars | Lars | resident | shared, personal (limited) | child |
| greet | Greet | resident | shared, personal | accessibility, annex |
| nour | Nour | non-resident (nanny) | shared (scoped) | ground floor + front door, expires 18:00 |

Persona switch is a fixed corner control, clearly separate from prototype UI.
It changes the bookmark set, hides Admin items for residents, scopes Nour,
simplifies Lars. Stored in sessionStorage, restored on reload.

## The home (Janssen household, Abbey Road)

- Ground floor: Living room, Kitchen, Hallway, Garage
- First floor: Main bedroom, Tess's room, Lars's room, Bathroom
- Annex: Greet's room, Greet's ensuite
- Outside: Garden, Driveway

## Navigation model

Dock (up to 6 bookmarks + trailing More), bottom bar on mobile / left rail on
tablet+desktop, same thing rotated. More is a full page grouping all
destinations by space with `--color-space-*` accents. Desktop adds a right
contextual "For you" / Activity+Automations panel.

**Bookmarks are per-user favourite shortcuts, not pages.** Key rules:
- Bookmarks are **not destinations** and **never appear on the More page**. The
  More page lists the real directory of destinations (filtered by space); the
  bookmark dock is a separate, personal shortcut bar.
- A bookmark is a **favourite page, which may be a subpage** (e.g. "Front door"
  points at the hallway area `/home/area/hallway`, not a top-level section).
- Each persona gets a sensible **default** bookmark set on first load, but every
  user can customise their own (add, remove, reorder).
- Implementation: subpage shortcuts that are not More destinations live in
  `bookmarkExtras` in `household.js`; `bookmarksFor()` resolves a persona's
  bookmark ids against the `directory` first, then `bookmarkExtras`. The
  directory (More page) no longer contains "Front door".
- **TODO (next):** design the flow for **saving and editing bookmarks** (how a
  user adds the current/any page as a bookmark, removes, and reorders them).

## Routes (hash based, deep-linkable)

Shared: `/home`, `/home/lights`, `/home/climate`, `/home/security`,
`/home/media`, `/home/area/:id`, `/devices`, `/people`, `/automations`,
`/scenes`, `/scripts`, `/history`, `/activity`.
Personal: `/my/dashboard`, `/my/data`, `/my/settings`.
Admin (Daan only; residents get a "no access" state): `/settings`,
`/devices/edit/:id`, `/automations/edit/:id`.
`/more` shows the directory.

## Build phases

- **Phase 1, the shell** [in progress] — AppShell, BookmarkNav, MorePage,
  PersonaSwitcher, routing, six personas, breakpoints. Placeholder content.
- **Phase 2, the wide build** [this session] — every route reachable and
  recognisable. Home overview with tab bar, favorites, floors/areas grid, For
  you panel; area detail (cameras/lights/climate/media/other devices +
  activity/automations panel); lights/climate/security/media sub-dashboards;
  devices; people; automations/scenes/scripts; history/activity; personal
  dashboard/data/settings; admin settings submenu + edit stubs. Access rules
  enforced per persona.
- **Phase 3, hero interactions** [after review] — A crossing spaces from an
  automation (sheet, edit vs feedback); B granting/revoking personal data
  access; C "why did this happen?" on activity; D pinning a personal dashboard;
  E override / pause an automation; F calibrated access for Lars, Greet, Nour.

## Topbar + collapsing title (iOS large-title pattern)

Goal: a persistent **full-width topbar** across the very top of the app, plus
the iOS "large title" behaviour, where the page title is large in the content
at rest and shrinks into the topbar once it scrolls under it.

### Structure (from the reference)

A new top row sits above the shell columns. The shell becomes a vertical stack:
`[ topbar ] / [ rail | main | panel ]`.

- **Topbar** (full width, ~56px, sticky/fixed at top, page-bg background, a
  hairline bottom border that appears only when scrolled):
  - **Left cluster** (occupies the rail-width gutter): the back chevron when
    the route is drilled in (`onBack` present). The HA mark STAYS in the rail
    (left menu bar), it does NOT move into the topbar.
  - **Collapsed title**: the page title, aligned over the main column. Hidden
    (opacity 0) at rest; crossfades in once the large title scrolls under the
    bar. Mono/data titles stay in their font.
  - **Right cluster** (far right): the page actions as **icon buttons**,
    `+` (add) and `⋮` (overflow), replacing the current text CTA.
- **Below the topbar**, inside `main`'s scroll area:
  - The **large-title block**: a leading **search** magnifier + the large
    title (Inter Tight, `--text-3xl`). This scrolls with content.
  - Then the page body (unchanged).
- The HA mark STAYS in the rail top (confirmed); the rail is otherwise
  unchanged.
- Topbar is GLOBAL full-width across rail + main + panel, on all breakpoints
  including mobile (confirmed).

### Collapse mechanism

- A 1px **sentinel** element is placed at the bottom of the large-title block.
- An `IntersectionObserver` (root = the `.ha-shell__main` scroller,
  `rootMargin` offset by the topbar height) watches the sentinel. When it
  scrolls out under the bar, set `state.titleCollapsed = true`.
- Collapsed → large title fades/translates up, small title in the topbar fades
  in. 200ms ease-out; collapses to 0 under `prefers-reduced-motion`.
- Reset `titleCollapsed` to false on every route change (each page starts
  expanded).

### Actions mapping (replaces the per-page text CTA)

- `+` = the existing context add action (Add device, New automation, New
  scene/script). Shown only on pages that have one; respects persona (admin).
- `⋮` = overflow menu for page-level secondary actions (placeholder menu for
  now: e.g. Edit, View options).
- **Search** magnifier = global search entry (opens a search overlay,
  placeholder for this build). Persistent (does not collapse).

### Breakpoints

- Same topbar at all breakpoints. Desktop/tablet: left cluster over the rail
  gutter. Mobile: no rail, so mark + back sit at the left edge, actions at the
  right; large-title block and collapse behave identically. This replaces the
  current inline `PageHeader` on mobile.

### Code touch points (one file: Home Assistant for the whole household.dc.html)

- New `renderTopbar(page, persona, bp)` (mark, back, collapsed title, action
  icons).
- New `renderTitleBlock(page)` (search + large title + sentinel), prepended in
  `renderMain` in place of `PageHeader`.
- Wrap `AppShell` in a column flex with the topbar on top; keep the mark in
  the `rail` builder.
- Add `titleCollapsed` to state; wire the IntersectionObserver in
  `componentDidMount` (re-bind after `.ha-shell__main` exists) and clear on
  `hashchange`.
- Convert page `cta` into `{ add, overflow }` action descriptors consumed by
  the topbar.

### Status: BUILT

- Topbar implemented as a global bar spanning the area right of the full-height
  rail (desktop/tablet) and full-width on mobile. Holds back chevron (drilled
  in), collapsing title, and `+` / `⋮` action menus.
- Large-title collapse driven by a scroll listener on `.cc-main` against a 1px
  sentinel (IntersectionObserver does not deliver callbacks in this runtime).
- Search magnifier lives at the top of the rail (desktop/tablet) and in the
  topbar actions on mobile; opens a placeholder search overlay.
- Persona switcher moved to the bottom of the rail (desktop/tablet), floats
  bottom-right on mobile.
- Rail hover-label flyout suppressed (was clipped by the rail).

### Confirmed

1. HA mark stays in the rail (left menu bar).
2. Topbar is global full-width, on all breakpoints including mobile.

## Home Assistant Cloud area (added)

Settings → "Home Assistant Cloud" now opens a real **Cloud account page**
(subscription "Thank you" card with a deliberate handwritten Caveat accent, no
emoji; + "Extras by Nabu Casa" list). Rows drill into subpages via `cloudSub`
state (back chevron returns to the account page; submenu stays on desktop):
Remote access, Cloud backup, Voice control, Google & Alexa, WebRTC, Webhooks.
Admin-only (under /settings); toggles/selects flip locally, links inert. Cloud
demo data lives in `household.cloud`.

Also added: **General** (Home information) settings page (Home name, Location
with an `<image-slot>` map placeholder, Region: timezone/elevation/unit
system/currency/country/language), and **Logs** moved out of Settings → System
into the More menu (admin) at `/logs`, reading `household.systemLogs`.

Note: this runtime calls `componentDidUpdate` with an undefined prevState, so
scroll-reset compares against an instance-cached `_navKey` instead.

## Floors and areas: home perspective vs settings (added)

The IA map separates the **home perspective** of floors/areas (viewing, shared
space, lives on the home page + subpages) from **editing the structure** (Edit
floor, Edit area, Add floor, Add area, Order floors and areas), which is Admin
space and belongs in Settings. That settings destination was missing. Added:

- New admin settings page **Settings -> Floors and areas** (`settingsSel:
  "floors-areas"`, first item of the "Home information" group in
  `settingsNav`). `floorsAreasBody()` lists every floor as a surface card
  (floor header + Edit floor + Add area) with its areas as ListRows carrying an
  edit affordance, plus top-level Add floor / Order floors and areas actions.
  Admin-gated like the rest of `/settings`; edit/add actions are placeholders.
- **Home topbar action change** (per review): removed the old overflow menu
  (Activity / History / Settings) from the home topbar. The home perspective
  now shows `+` (add) and, for maintainers, an **overflow (`...`) menu** whose
  item links to Settings -> Floors and areas. These actions now appear across the whole home
  perspective (overview + Lights / Climate / Security / Media), not just the
  overview. Activity / History / settings remain reachable via the More page.
- `go(route, settingsSel)` now takes an optional pending settings selection
  (`_pendingSettingsSel`, applied in the `hashchange` handler) so the cog can
  land directly on the floors-areas page.
- **Security and Media subviews** are now grouped per floor and area (floor
  heading + per-area section link), matching the Lights and Climate layout,
  instead of flat "Cameras" / "Media players" lists.

## Content max-width (page container)

`renderMain` centers every page (`margin: 0 auto`) and caps its width by route:

- **Settings family → 760px:** `/settings`, `/my/settings`, `/extensions`.
  Home Assistant Cloud lives under `/settings`, so it inherits 760px too.
  (`cloudWrap` no longer sets its own cap; it fills the 760 container.)
- **Everything else → 1320px:** home and its sub-views, automations, people,
  devices, scenes, scripts, history, activity, logs, etc.

Set via `narrow = route === "/settings" || route === "/my/settings" ||
route === "/extensions"` → `maxWidth: narrow ? 760 : 1320`. Independent of
breakpoint (mobile/tablet screens are narrower than either cap anyway).

## Verification per phase

- P1: switch all six personas, confirm Admin items only for Daan, Nour scoped,
  Lars simpler; dock adapts at all breakpoints.
- P2: navigate every route as Daan and Sofie, no Admin leak to Sofie, Nour
  blocked from `tess-room`, Lars home view correct.
- P3: walk each hero flow as its persona.

## Collections: left Filters rail + Customize columns + account/sign-in (added)

The list/data pages moved from a top toolbar to a full-page layout with a
vertical **Filters rail** on the left (top to bottom), the page title in the
topbar (large in-page title suppressed), and the body on the right.

- **Routes treated as collections** (`isCollectionRoute`): `/devices`,
  `/people`, `/automations`, `/scenes`, `/scripts`, `/history`, `/activity`,
  `/logs`, `/my/data`, `/my/dashboard`. These force the title into the topbar
  and skip `renderTitleBlock`.
- **Filters rail** (`filtersRail(spec, opts)`): header "Filters", then search,
  filter chip groups, Group by + Sort by selects, a "View" (list/card) toggle,
  and bottom links "Customize columns" and "Clear filters". `collection()` and
  `timeline()` both build a `spec` and call `collectionShell(spec, bp, body)`.
- **Layout**: the topbar spans the full width **above** the filter bar. Below
  it, desktop/tablet render `[ filterSidebar (full-height, surface bg,
  border-right, flush to the nav rail) | content (full width) ]`. The filter
  sidebar is passed as `page.filterSidebar` and placed inside the main column's
  content row (NOT as `page.submenu`, which would sit beside the topbar).
  `page.fullWidth` drops the 1320 cap so the table/cards fill the width. Mobile
  = inline `[search | Filters button(count)]` + body, with a bottom Sheet
  overlay (`state.filtersSheet`) holding the rail; customize swaps in inside the
  sheet. Desktop customize is a popover anchored below the topbar, beside the
  sidebar.
- **Customize columns** (`customizePanel`): per-collection column visibility in
  `cs(id).colVis` (key→false hides). `colVisible/toggleCol/restoreCols`. Driven
  for the routine tables (Creator/Category, Last triggered, Status; Name
  locked), devices (Type chip, Area meta) and people (Presence chip, Role meta)
  via `cfg.customCols` + `cfg.columns[].key/cell` and `cfg.metaKey`.
- **Home extensions** now uses the settings pattern: a left `Submenu`
  (`extensionsPage`, categories from `extensionCategories`) + 760 cap. Joins
  `/settings` and `/my/settings` in the narrow content family. `/my/profile`
  also caps at 760.
- **Account menu + sign-in**: the bottom-left avatar (`avatarButton`) opens an
  account popover (`renderAccountMenu`): My profile, My data, My settings
  (last two only with the personal space), and **Sign out**. Replaces the demo
  PersonaSwitcher. `/my/profile` (`myProfileBody`) holds the photo
  (`<image-slot>`), name, and a Sign out button; it is exempt from the personal
  gate. **Sign out** sets `state.signin`, rendering `renderSignin(bp)`: a HA
  "Welcome home! / Who is logging in?" persona picker → password step → Log in,
  which calls `setPersona`. This is now the only persona-switch path (demo).

## Technical notes

- Design system loaded from `ds/`: `styles.css` (tokens + fonts), `_ds_bundle.js`
  (components on `window.HAConceptCarDesignSystem_fababd`). The bundle reads a
  global `React`; the component sets `window.React` from the runtime React
  before the bundle renders, so hooks share one React instance.
- App composed in the logic class as a React tree (the design system is React
  and the app is dynamic/persona-conditional/routed); exposed to the template
  as a single mount. Data and persona filtering all read from `household.js`.

## Mobile navigation (revised, BUILT)

Reworked so the mobile topbar stops doing three unrelated jobs at once (global
search, account, per-page actions) and the avatar stops floating.

### 1. Tabbar + global search

- The mobile tabbar is a **hybrid**: the **last two items are fixed, Search and
  More**; the first **3 slots are user-picked bookmarks** (3 of 5). Built in
  `renderFrame` mobile branch: `[...ctx.items.slice(0,3), {id:"search"}]` then
  `BookmarkNav` appends the fixed `More`.
- **Search** in the dock is the **global search** (search the whole home). On
  mobile it opens a **dedicated full page** (`/search`, `searchPageBody`), not
  the modal dialog used on desktop/tablet (the rail magnifier still opens the
  `searchOpen` dialog there). `navById("search")` routes to `/search`;
  `activeBookmark` highlights it.
- The **in-page filter search** is unchanged: it stays inside the page / filters
  rail (the search field above a list), never in the chrome. Global vs filter
  search never share a control.
- Default bookmark sets: **People moved out of the dock into the More menu**
  (removed from Daan's `bookmarks`; still in the `directory`, so it shows on the
  More page). Daan dock picks are now `home, automations, devices`.

### 2. Avatar / account

- The floating bottom-right avatar (`renderMobileSwitcher`) is **removed**.
- On the **home page** (home perspective, no back button) the avatar sits in the
  **top-left corner of the topbar** as an extra entry point; tapping opens the
  account menu (`acctMenu`, anchored top-left under the bar on mobile).
- On the **More page** the account menu "comes back" as a **big avatar centered
  at the top** (name + role + Sign out), above the directory groups
  (`moreBody(persona, bp)` mobile header).

### 3. Per-page topbar action grammar

- **Left:** back chevron when drilled in, else page identity (large in-page
  title; collapsed title on scroll); on home, the account avatar.
- **Right:** at most two icon actions then a single `⋮` overflow; Select mode
  swaps the whole right cluster for Select-all / Done. The persistent search
  magnifier was **removed from the mobile topbar** (search now lives in the
  dock).

### 4. Future: Home can move to More / custom landing page

- Home should be **demotable to the More menu** like any other destination: a
  user may build their **own landing page with the dashboard editor** and use
  that as their entry point (on every breakpoint, not just mobile). When Home is
  not a dock bookmark it still lives on the More page.
- **Clicking the logo** (rail/topbar HA mark) goes to that **personal landing
  page** (the user's chosen entry), not hard-wired to `/home`. BUILT: `goHome()`
  routes to `effLandingRoute()`; the target is chosen on Appearance (instance +
  account scope, `landingSection`), dashboards carry a "Set as home"
  (`setDashAsHome`), and it persists in `cc-landing-instance` / `cc-landing-<id>`.

## Smart widget stack ("For you") — BUILT

Upgrade the existing `/home` "For you" column (`forYouColumn` / `fyWidgetCard`)
from a static-order + manual-drag list into a **fixed + suggested** stack modelled
on the Apple Watch Smart Stack. Builds on what's already there (edit mode,
drag-reorder FLIP glide, add/remove, config overlay). One file:
`Home Assistant for the whole household.dc.html`.

### Fixed vs suggested model (current)

Two distinct classes of widget, both ordered purely by the relevance engine
(no pinning, no manual drag):

- **Fixed widgets** = the user's configured set (`fyConfigured` = per-persona
  `widgets` defaults + added extras, minus removed). Relevance-sorted by
  `fyScore` (`fyActive`). This is the only set shown in the **edit view**, where
  each card carries a single delete button.
- **Suggested widgets** (`fySuggested`) = catalog widgets the persona may see,
  **not** in the fixed set, not removed, currently `fyVisible`, and scoring at or
  above the "relevant now" bar (`fySuggestThreshold` = 65). Ephemeral and
  context-driven. Shown when the global **Suggested widgets** toggle is on
  (`fySuggestOn`, **on by default**, persisted per persona in `cc-fy-*`
  alongside removed/extra).

- **Read view:** fixed + suggested are **fully interleaved by relevance score**
  into one stack. A high-scoring suggestion (media playing, power spike, an admin
  update) can rank to the very top. One clean stack, no headers, no pins.
- **Edit view:** fixed widgets only (relevance-sorted, delete button per card),
  then the **Suggested** section: the toggle, then the currently-suggested
  widget cards (each with a "+" to promote into the fixed set).
- **Promote a suggestion:** every suggested card (read view and the edit-mode
  Suggested section) has a "+" in the same top-right corner the delete button
  uses; it calls `fyAdd` to move the widget into the fixed set.
- **No pinning, no manual ordering.** Removed `fyPinned` / `fyTogglePin` /
  `fyDragOver` and the pin button + drag handlers. Ordering is entirely
  `fyScore`-driven, so switching the demo scenario re-sorts the whole stack
  (fixed and suggested alike).
- **Per-persona defaults are minimal** (`household.js` `widgets`): most personas
  carry 1-2 fixed widgets (e.g. Sofie weather+calendar, Lars weather only);
  **Daan, the experienced maintainer, keeps a fuller fixed set** (weather,
  calendar, energy, activity, todo). The state-driven widgets (media,
  alert-power, system-update, discovered) were **removed from defaults** and now
  surface purely as suggestions when their condition fires.
- **Favorites widget (`favorites`)** — a default fixed widget for **every**
  persona (inserted right after `weather` in each `household.js` `widgets`
  list). Reads the persona's own `favorites` entity ids and renders each as the
  same entity tile the area/domain subviews use (`this.tile(e, persona)`, a
  2-column `gridStyle(2)` grid, toggle-able, state-synced through
  `isOn`/`toggle`). `fyScore` 68 (just under weather); always `fyVisible`, no
  `requires` gate. **Empty state:** star-outline icon + "No favorites yet" +
  "Star an entity from its page to pin it here for quick access." **Not yet
  built: no in-app way to favorite an entity** (favorites are seeded per persona
  in `household.js`; only surfaced elsewhere as the "Favorite" filter label on
  Devices). A star toggle on the entity/device detail is the natural next step.
  Tile rendering reuses the subview verbatim for now (locks/climate would show
  On/Off, but all seeded favorites happen to be lights) — to be refined later.
- **Gallery is per persona.** The Add-widget gallery (`addWidgetOverlay`) is
  role-gated via `fyAllowed`, so admin-only widgets (software update, discovered)
  appear only for admin personas. Suggestion-driven widgets are also addable from
  the gallery, so a suggestion can be promoted to fixed there as well.

### Decisions (agreed)

- **Context source:** a **demo scenario switcher** exposed as a root-DC prop
  (Tweaks panel). One enum drives the whole `ctx` so reviewers can watch the
  stack re-sort.
- **Ordering:** **pure relevance.** All widgets (fixed and suggested) are sorted
  by `fyScore`; there is no pinning and no manual drag ordering.
- **Persistence:** removed / extra / suggested-toggle persist **per persona** in
  sessionStorage (same pattern as personas/bookmarks).
- **Scope:** Travel and Getting started are **removed and not shown.** State-
  driven widgets (media, alert-power, system-update, discovered) are not in the
  default fixed set; they surface as **suggestions** when relevant. (Scoring
  functions stay general so a promoted widget still ranks correctly.)
- **Affordance:** in edit mode, each fixed card has a single **delete** button
  in the top-right corner; suggested cards have a **"+"** in that same corner.
- **Breakpoints:** mobile and desktop equally.

### Layer 0 — per-persona widget sets and role gating

The home page is per persona, so its widgets are too. Two mechanisms:

- **Per-persona default stack.** Add a `widgets` field per persona in
  `household.js` (analogous to the existing `bookmarks` / `favorites`), giving
  each persona its own default ordered widget set. `fyDefault()` becomes
  `fyDefaultFor(persona)` and reads it, falling back to a sensible base set when
  a persona declares none.
- **Role-gated catalog.** Each catalog entry may declare a `requires` gate
  (e.g. `requires: "admin"` for the space, or a role/calibration check). A
  widget the current persona isn't allowed to see is never added, never scored,
  and never offered in the Add-widget catalog. `fyAllowed(id, persona)` is the
  single gate consulted by `fyDefaultFor`, `fyActive`, and the add catalog.
- **Role-specific extras (examples to wire):**
  - **Admin / maintainer (Daan):** a system/update widget — "Update available"
    (HA 2025.11.0), gated `requires: "admin"`, visible only when an update
    exists (ties Idea 1's "only when there is something to show" to a role).
    Optionally a backups / system-health widget.
  - **Residents (Sofie, Tess, Greet, etc.):** presence/people + media feeds; no
    system widgets.
  - **Scoped / calibrated personas (Nour nanny, Lars child):** only widgets
    relevant to their access (e.g. no admin or whole-home energy widgets).
- **State is already per-persona** (persistence decision): `fyPinned`,
  `fyRemoved`, and order are stored keyed by persona id, so switching persona
  loads that person's arrangement and switching back restores it.

### Layer 1 — pinning (REMOVED)

Pinning was built and later removed in favour of pure relevance ordering. There
is no `fyPinned` / `fyTogglePin` / `fyDragOver` and no pin button or drag
handlers. Edit-mode cards carry only a delete button; suggested cards carry a
"+". See "Fixed vs suggested model (current)" above.

### Layer 2 — relevance engine (orders the whole stack)

**Principle (from the old For-you "ideas", now the core of this work): widgets
are rankable and time-aware, and only show when there is something to show.**
Energy rises in the evening, the activity card rises just after something
happens, and state-driven widgets (media, high power, the admin update alert)
appear only when their condition is true and sit at the top when they do.

- `fyContext()` builds `ctx` from the demo-scenario prop: `{ hour, minute,
  isWeekday, mediaPlaying, powerAnomaly, minutesToNextEvent,
  minutesSinceActivity }`.
- `fyVisible(id, ctx)` — hide rules: `media` hidden unless `mediaPlaying`;
  `alert-power` hidden unless `powerAnomaly`; `getting-started` hidden once
  dismissed (inert, not in default set). All others always visible.
- `fyScore(id, ctx)` → higher = nearer top. Targets:
  - media: 100 when playing (else hidden)
  - alert-power: 95 when anomalous (else hidden)
  - calendar: 90 if next event <= 120 min, else 40
  - activity: 85 if last activity <= 30 min, else 25
  - weather: ~70 (always near top)
  - energy: ~45 default, ~75 in the evening (>= 17:00)
  - todo: ~50 steady mid-stack
  - travel (if re-added): ~80 weekday 07:00 to 09:30, ~15 evenings/weekends
  - getting-started (if re-added): always last
- `fyActive()`: configured fixed set minus removed, filtered by `fyVisible`,
  sorted by `fyScore` desc (stable tiebreak on default order). No pinned split.
  The read view then interleaves `fySuggested` into this by score.

### Layer 3 — demo switcher (Tweaks)

- Root-DC enum prop `demoScenario` (default "Quiet afternoon"):
  Quiet afternoon, Weekday morning, Evening, Media playing, Power spike,
  Calendar soon, Weekend. Each preset sets the `ctx` flags. Read via
  `this.props.demoScenario ?? "Quiet afternoon"`.

### Verification

- Switch scenarios in Tweaks → the whole stack re-sorts; media/power/update
  suggestions appear and disappear and can rank to the top. Toggle Suggested
  widgets off → only fixed widgets remain. Add a suggestion via its "+" → it
  joins the fixed set; delete a fixed widget → it leaves. Reload → removed /
  extra / suggested-toggle restored for that persona; switch persona → that
  persona's arrangement loads. Mobile + desktop both correct.

## Appearance and light mode — BUILT

> Status (verified 2026-07-03): BUILT. `appearanceBody(bp, scope)` (instance +
> account), `accessibilityBody(bp)`, the light token layer, the theme controller
> (`instanceTheme`/`userTheme`, `applyAppearance`), and the default-landing-page
> picker (`landingSection`) all ship in the DC. The text below is the original
> plan, kept for rationale.

Add light mode and a Theme picker, surfaced in **two** places that already have
the nav row but render the generic placeholder today. The two are NOT the same
control: one sets the home's default, the other overrides it per person.

- **Settings → Appearance** (`settingsNav` id `appearance`, admin space) =
  **the instance default.** Sets the home's default theme, the one a person
  gets until they choose their own.
- **My account → Appearance** (`personalSettingsNav` id `p-appearance`,
  personal space) = **a per-user override** of that instance default. Each
  person can keep the home default or pick their own.

Scope now is **Theme only** on both pages; more appearance options come later,
so build the page so sections can be added without rework.

**Contrast and Reduce motion are accessibility controls, not appearance.** They
move to **My account → Accessibility** (`personalSettingsNav` id
`p-accessibility`, already in the nav), per-user, not on either Appearance page
and not in admin Settings.

The work is (1) build a light token layer the design system does not ship,
(2) build the Appearance body (instance default + account override) and the
Accessibility body, (3) wire them into their routes through `customSettings()`,
(4) persist and apply the preferences.

### Pattern: borrow the account location page

The account **location page** (`presenceBody`, My data → Presence) is the
layout model: a surface card with a leading icon, a title, a one-line
description, and the control on the right, then a **live preview region below**
(its map). Appearance reuses exactly that: a "Theme" card whose control is the
theme picker, with a **live mini-window preview** of the resolved palette under
it, the same way the location card previews the map.

### The hard part: this design system is dark-only

The reference we are borrowing from (project `86c99aa4`) already had a token
engine that flipped light/dark, so its Appearance tab was just the dial. **Here
there is no light palette.** `design-tokens.css` declares `:root { color-scheme:
dark }` and one warm-tinted dark set of `--color-*`. So light mode is not just a
switch, it is **authoring the missing palette** and making the app honor it.

**Approach: a light override layer, applied by attribute on `documentElement`.**

- New `<style>` in the DC `<helmet>`: `:root[data-theme="light"] { … }`
  redefining every `--color-*` token (backgrounds elevation scale, borders,
  text, accent stays the same blue `#1C6FD6`, semantic + space accents,
  scrim). Dark stays the default `:root` (no attribute = dark), so nothing
  regresses if the layer never loads.
- A light elevation scale that keeps the system's rule "groups separate by
  tone, not borders": warm off-white page → white surface → faintly tinted
  raised → overlay; hairline borders darken; text inverts
  (primary near-black, secondary/tertiary mid-greys). Derived in oklch from the
  existing dark ramp so it stays in the same warm family, not invented hues.
- **Hardcoded hex audit (required).** Several places bypass tokens and assume
  dark; each must read a token (or gain a light value) or the page breaks in
  light mode:
  - helmet base CSS `html, body { background: #18181a }` and `.cc-loading`
    color → tokens.
  - the bookmark-rail `!important` overrides (neutral white highlights),
  - the filter range slider track `background:#fff` (lines ~317–319),
  - the `.ha-submenu__ico` badge `color:#fff`,
  - any JS inline style with a literal hex (scrim is already a token; sweep
    `#fff` / `#18181a` / `#11100f` style literals).
- Material icons, brand mark, camera/media placeholders: confirm they read
  `currentColor` / sit on a surface that still works light (they do).

### The theme controller (two levels: instance default + user override)

- **Instance default** `instanceTheme` in `{ "system" | "light" | "dark" }`,
  default `"system"`. Set on Settings → Appearance. Persisted to
  `localStorage` (`cc-appearance-instance`).
- **Per-user override** `userTheme` in
  `{ "default" | "system" | "light" | "dark" }`, default `"default"` (inherit
  the instance). Set on My account → Appearance. Persisted per persona
  (`cc-appearance-<personaId>`), restored on persona switch like bookmarks/fy.
- **Resolve:** `effTheme = userTheme === "default" ? instanceTheme : userTheme`,
  then `system` reads `matchMedia('(prefers-color-scheme: dark)')` and **tracks
  it live** via a change listener, so a System user gets dark at night with the
  tab open. The account page's "Use home default" option reports what it
  currently resolves to ("Home default, currently Dark").
- **Apply:** set `documentElement.dataset.theme` to the resolved `"light"` or
  `"dark"`. Dark = remove the attribute (default `:root`). Do this in
  `componentDidMount` and on every change.
- **Pre-paint, no flash:** a tiny inline script high in `<helmet>` reads both
  localStorage keys + the OS query and stamps `data-theme` before first paint,
  and the hardcoded `#18181a` body background becomes one that respects the
  attribute. Return visits never flash the wrong palette.
- Changes apply instantly. No Save button (matches the rest of this app).

### Controls

**Appearance page — Theme only (both places):**

- **Settings → Appearance:** a Theme card (System / Light / Dark) that sets the
  instance default, with the live mini-window preview below (location-page
  pattern). Copy frames it as the home default.
- **My account → Appearance:** the same card plus a leading **"Use home
  default"** option, so the choices are Use home default / System / Light /
  Dark. Live preview reflects the override.
- Theme options render as preview cards (the macOS / GitHub / real-HA idiom),
  each a mini-window painted in that palette so you pick by sight. The System
  card splits light/dark and reports which way it resolves. Cards rebuilt from
  tokens, no SVG.

**My account → Accessibility page (per user):**

- **Increase contrast** — a single switch (no per-mode nesting). A
  `data-contrast="high"` layer steps hairlines toward `--color-border` strong
  and lifts muted text toward primary.
- **Reduce motion** — `reduceMotion()` already exists but only reads the media
  query; extend it to read this stored pref OR the query, on by default when
  the system asks.
- Both follow the same titled-section-card + switch-row pattern as the rest of
  the account pages.

**Not built (out of scope / declined):**
- **Primary / secondary accent picker** — declined. This system spends exactly
  one accent (blue) as *signal, not decoration*; a user-set hue would collide
  with that and with the fixed space accents (green/blue/purple). Real HA
  offers it; this concept deliberately does not.
- **Show hovercards** — that project's pattern, not this one.
- **Dim device photos** — no product-shots-on-white here to dim.
- **Text size** — wants a real type/rem audit; revisit later.

### Wiring

- Build `appearanceBody(persona, bp, { scope })` where scope is `"instance"`
  (admin) or `"account"` (personal), and `accessibilityBody(persona, bp)`.
- Extend `customSettings()` (today `{ general, floors-areas }`): add
  `appearance` → instance appearance, `p-appearance` → account appearance,
  `p-accessibility` → accessibility. That replaces the placeholder in each nav
  on mobile and desktop, since `settingsDetail` already routes custom ids.
- Follow the project's **titled section card** pattern (CLAUDE.md).

### Verification

- Set instance default to Light in Settings → whole app repaints (shell, cards,
  rail, topbar, sheets, map controls), no dark-only hex leaks, no contrast
  failures. Account override Dark → that persona goes dark over the Light
  default; "Use home default" follows the instance again. System tracks the OS
  live. Reload → both levels restored, no flash. Switch persona → that
  persona's override loads. Accessibility: contrast on sharpens hairlines/text;
  reduce motion on collapses sheet/title animations to 0. Correct on mobile and
  desktop.

## Services (use-case pages) — BUILT

The IA "Services" group becomes **use-case pages, not a "Services" umbrella
page.** A resident thinks "what's the weather", "play music", "what's my
commute", never "go to Services, then weather". So each service is a top-level
destination phrased as the job.

### Decisions (agreed with the user)

- **Six categories:** Weather, Music, Commute, Calendar, To-do, Waste.
  - **Traffic + public transport merged into Commute** ("how do I get there":
    drive time and transit departures together).
  - **Music** is the *sources/accounts* layer (Spotify connected), distinct from
    the speakers, which stay Devices. It also stands in for the Media library.
  - **Weather absorbs Sun, Air quality, and Pollen** as sections of one weather
    dashboard, not separate categories. Page name stays "Weather".
  - Parked, not built: Deliveries/parcels, News/feeds (easy later adds).
- **No "Services" umbrella page.** Each is its own route. Grouping on the More
  page is deferred ("we will fix the More page later"); for now they land in the
  shared group of the directory so they are reachable.
- **Devices vs Services vs Integrations:** Devices = physical things (unchanged).
  Services = external feeds the home fetches for you. Integrations (admin,
  Settings) = the technical connectors powering both, listed together there
  because that is the honest technical layer. (Settings → Integrations rework to
  list device + service integrations together is a follow-up, not this pass.)

### View mode vs edit mode (per service)

Every service page has two modes, toggled from the page action (pencil → Edit,
then Done), reset on navigation (`state.serviceEdit`, cleared in `_onHash`/`go`
like `titleCollapsed`).

**Edit is maintainer-only.** The pencil/Done toggle (`serviceEditToggle`, wired
as the page `cta`) is rendered only when `persona.spaces` includes `admin`, and
`editing` is additionally gated `admin && state.serviceEdit`, so a resident can
never land in edit mode even if the flag leaked. Adding and configuring service
integrations is Admin-space work (the connector layer), consistent with the
rest of the app; residents get the view only.

- **View mode** shows the relevant information for that service (the dashboard):
  Weather = current conditions + hourly + daily forecast + sun/daylight arc +
  air quality and pollen; Music = now playing + sources + per-room playback;
  Commute = each saved destination with live drive time and next transit
  departures; Calendar = events grouped by day, drilling into an Event; To-do =
  lists with tasks, drilling into a Task; Waste = upcoming bin-collection
  schedule.
- **Edit mode** shows, in one body (`serviceEditBody(id)`, shared shell):
  1. **Connected** — the integrations already powering this service, each with a
     settings affordance.
  2. **Add a service** — a **category-filtered integration gallery** (only the
     integrations relevant to this service: Weather → Met.no / OpenWeatherMap /
     AccuWeather / Buienradar; Music → Spotify / Sonos / Apple Music / Music
     Assistant; Commute → Google Maps / Waze / NS / 9292; Calendar → Google
     Calendar / Local / CalDAV / Microsoft 365; To-do → Local / Todoist / Google
     Tasks; Waste → Afvalwijzer / local council). Mirrors real HA "add
     integration" but pre-filtered to the category.
  3. **Settings** — this service's own options (a few sensible per service).

### Data

`household.services` (object, keyed by id) holds each service's view data +
installed integration ids + settings defaults. `serviceIntegrations` (keyed by
id) is the per-category gallery (installed flag per entry). Both new; the old
flat `services` array (used only by the For-you weather/calendar/todo widgets)
is preserved under a compatible shape or the widgets are repointed.

### Routes

`/weather`, `/music`, `/commute`, `/calendar` (+ `/calendar/:eventId`), `/todo`
(+ `/todo/:taskId`), `/waste`. Shared space, admin/scope rules apply. Directory
entries added (space "shared"); More-page grouping deferred.

### Verification

- Each of the six opens in view mode with real-looking data. Pencil → edit mode
  shows Connected + a gallery filtered to that category + settings; Done returns
  to view. Navigation resets the mode. Calendar event and To-do task drill in.
  Correct on mobile, tablet, desktop; scoped/child personas don't leak.

## Tags (Tags -> Tag -> Tag data) — BUILT

The IA lists **Tags** in the **Shared space** (Tags -> Tag -> Tag data) and
**Add tag / Edit tag** in the **Admin space**. So Tags is a shared-space
collection everyone can browse (a tag is a shared thing in the home), while
creating and editing tags is maintainer-only, exactly the split Automations /
Scenes / Scripts already use. This reuses the existing collection + detail +
admin-edit machinery rather than inventing anything new.

### What a tag is (honest HA model)

A **tag** is a physical thing you scan, an **NFC sticker** or a **QR code**,
that fires a `tag_scanned` event carrying which tag and (on the companion app)
who scanned it. You point automations at "when this tag is scanned". So the
page is not decoration: a tag's value is the scans it produces and the
automations it drives. Plain, honest framing everywhere: "Last scanned 8
minutes ago by Sofie", not "Active".

### Data (`household.js`, new `tags` array)

Each tag: `{ id, name, description, type: "nfc" | "qr", space: "shared",
icon, area, lastScanned, lastScannedBy (person id or null), scanCount,
automationIds: [], createdBy, created, modified }`. Realistic Janssen set:

- **Front door** (NFC by the door) → runs "Arrive home" / "Leaving home".
- **Lars's bedtime** (NFC on his nightstand) → runs Goodnight, scoped so Lars
  can trigger it himself.
- **Coffee machine** (NFC in the kitchen) → "Good morning".
- **Laundry** (NFC on the machine) → starts a wash-done reminder.
- **Movie night** (QR on the media console) → the Movie night scene.
- **Guest** (QR, printed) → Nour's scoped arrival, ties to her expiring access.
- **Bins** (NFC by the back door) → marks the waste task done.
- **Plants** (NFC) → logs a watering.

`lastScannedBy` references people ids so the detail can link to the person.
`automationIds` reference `automations` / `scenes` / `scripts` ids so the
detail links back to what the tag runs.

### Routes

`/tags` (collection) and `/tags/:id` (Tag detail = "Tag data"). Maintainer
editing is an **in-place mode** (`state.tagsEdit`), not a separate route, so no
`/tags/edit/:id` is needed. Register `tags` alongside
`automations|scenes|scripts` where those routes are parsed (the `parts[0]`
block around line 1464/1506), and add `tags` to `isCollectionRoute`
(line 1139) and the `singular()` map (`tag`).

### Collection page (shared, reuses `collection()` / filters rail)

Model it on `routinesBody`: a `cfg` with

- `id: "tags"`, `noun: "tags"`, icon `nfc-variant` (QR entries show
  `qrcode`), `supportsCard: true`, `defaultView: "card"` (tags read well as a
  grid of scan tiles), `defaultSort: "recent"` (last scanned first).
- **Search** over name + area + linked automation names.
- **Filter groups:** Type (NFC / QR), Area, "Runs" (linked to an automation or
  not). **Group by:** none / area / type. **Sort:** recent, name, most scanned.
- **Card** = tag name, type glyph, "Last scanned Nx" line (mono time), and the
  automation(s) it runs as small chips. Inactive (never scanned) reads muted.
- **List columns** (+ customize): Type, Area, Last scanned (mono), Scans,
  Runs. Name locked.
- **Add tag** = the topbar `+`, maintainer-only (same `cta`/persona gate as
  the routines). Residents get the view only, no add.
- Persona scope: honor the existing calibration filters, Nour sees only her
  scoped tags (Guest, Front door), Lars sees his bedtime tag; no admin leak.

### Tag detail ("Tag data", reuses `detailInfoCard` / `detailSection`)

Model on `routineDetail`:

- **Summary card** (shared 3px left border): the tag glyph, name, type
  ("NFC tag" / "QR code"), description, and the primary honest fact,
  "Last scanned 8 minutes ago by Sofie" (person links to `/people` detail).
- **Runs** section: the automations / scenes / scripts this tag triggers, each
  a row linking to that routine's detail.
- **Recent scans** section: a short timeline (who, when) built like the
  activity rows, mono timestamps.
- **Details** info card: Type, Area, Created by, Space (Shared), Scans, Added,
  Modified. Maintainer sees the **pencil -> Edit** page action (see Admin edit
  mode below); the "Write to an NFC tag" / "Show QR" actions live inside edit
  mode as placeholders (no real NFC in a prototype).

### Admin edit mode (maintainer only, reuses the Services `serviceEdit` pattern)

Instead of the old separate `/tags/edit/:id` route stub, Tags adopts the
app's **view mode vs edit mode** pattern (the one Services pages use via
`serviceEdit`). This is the modern, in-place pattern and keeps the maintainer
in context.

- **State + gate:** add `state.tagsEdit` (boolean), toggled by the page action
  (pencil -> "Edit", then "Done"), reset on navigation (cleared in `_onHash` /
  `go` alongside `titleCollapsed` and `serviceEdit`). The pencil/Done toggle
  (`tagsEditToggle`, wired as the page `cta`) renders **only when
  `persona.spaces` includes `admin`**, and `editing` is additionally gated
  `admin && state.tagsEdit`, so a resident can never enter edit mode even if
  the flag leaked. Editing tags is Admin-space work; residents get the view
  only.
- **Collection in edit mode:** the `+` becomes **Add tag** (opens the tag
  form), and each tag card/row gains an inline **edit** affordance (pencil) and
  a **delete** affordance, matching how the routine collections expose batch
  enable/disable. Reorder is out of scope (tags have no meaningful order).
- **Tag detail in edit mode:** the read detail flips to an editable form
  (`tagEditBody(id)`): Name, Description, Type (NFC / QR select via
  `ccOverlaySelect`), Area (overlay select), and a **Runs** editor to
  add/remove which automations/scenes/scripts the tag triggers
  (`automationIds`). Below the form, maintainer-only device actions:
  **Write to an NFC tag** and **Show QR code** (honest placeholders, no real
  NFC/scan in a prototype), plus **Delete tag**. Wrapped in the admin-space
  `SpaceIndicator` tint + the existing "editing here is a placeholder in this
  build" notice, with Save / Cancel (Done).
- **Add tag:** the same `tagEditBody` shell with empty defaults, reached from
  the collection `+` in edit mode. Save is a placeholder (local only), Cancel
  returns to `/tags`.
- Navigation resets the mode (each page opens in view mode), exactly like
  Services.

### Directory + More page

Add one entry to `directory` in `household.js`:
`{ id: "tags", label: "Tags", icon: "nfc-variant", space: "shared",
route: "/tags" }`, placed in the shared "home routines" group next to
Automations / Scenes / Scripts so it lands on the More page for personas with
the shared space. Not a default dock bookmark.

### Scope / non-goals

- No real NFC/QR scanning (prototype); scans are demo data, the write/print
  actions are placeholders with honest copy.
- More-page regrouping stays deferred (lands in the shared group for now).
- Follow copy rules: sentence case, no dashes, "you", mono for times/counts.

### Verification

- `/tags` opens as Daan with the realistic set, card + list views, filters,
  group/sort all work. Pencil -> edit mode: `+` adds, cards gain edit/delete;
  detail flips to the editable form (name, type, area, Runs editor, Write to
  NFC / Show QR / Delete placeholders); Done returns to view; navigation resets
  the mode. Residents (Sofie) see list + detail but **no pencil, no add,
  no edit**; Nour sees only her scoped tags; Lars sees his bedtime tag. No
  admin leak. Correct on mobile, tablet, desktop.

## The "browse media / files" space, resolved (PLAN)

A planning pass on the IA's **Media** node (Shared -> Home contents ->
Media -> Media data) plus the **Add/Edit media** admin node, cross-checked
against Home Assistant's real media browser, the Music service we already
built, and the File editor add-on. The conclusion reshaped three things and
**dropped one**. This section records the decisions and the reasoning so we
don't relitigate them.

### The question we were answering

"Should Media be an Apple Finder / iOS Files style browser?" The Files/Finder
**navigation pattern** (source list -> breadcrumb drill-in -> leaf view, with a
grid/list toggle) is the right chassis, and it is exactly what our existing
**collection shell** already is (left rail on desktop, drill-in root on mobile).
So the pattern is reusable infrastructure, not a page. The real work was
deciding *what content* deserves a destination, and for *whom*.

### What the media browser would have held, and where each piece actually goes

- **Audio** -> the existing **Music** service (Spotify, radio, local library,
  playlists, per-room). Curated, job-first ("play"). Already built. Music stops
  "standing in for the media library" (that old stopgap note is retired).
- **Cameras (live + recorded clips + events)** -> a **new first-class shared
  destination, Cameras** (see next section). Not a homepage subview, not part
  of a media browser.
- **Local video / photos** -> **niche, not a page.** HA is not Apple Photos: no
  albums, faces, memories, editing. "Local media" is just a file tree over a
  folder whose only verb is *cast this file to a screen*. The honest household
  use cases are casting a local video to the TV (the TV-as-device already does
  this) and a wall/ambient display photo slideshow (a display/dashboard
  capability, not a browse-a-library page). Neither carries a destination.
- **TTS** -> splits, and neither half is a media browser:
  - **Sending a spoken message to speakers** = an **intercom / announce**
    feature (compose message -> pick rooms -> speak, plus a history). A
    compose-and-send action surface, not a browse surface. **Parked** (see
    "Intercom, parked" below).
  - **Testing the TTS voice** = **maintainer setup**, part of configuring the
    Assist / Voice Assistant pipeline. Lives in Admin -> Voice assistant
    (STT/TTS), where the IA already puts it. Not shared, not a media page.

### Decision: DROP the shared Media browser

With audio, cameras, video/photo, and TTS all relocated to better homes, there
is no cohesive, frequently-used job left for a standalone shared Media browser
in this home. **We drop it.** Residual gap on record: *cast a local
video/photo to a screen* has no dedicated home (the TV-as-device covers video;
an ambient-display slideshow is a future display/dashboard capability). If a
real need surfaces later, revisit as a small casting utility, not a library.

### The final map (no overlap)

- **Music** — shared, curated **audio** service. Verb: play. (built)
- **Cameras** — shared, first-class **surveillance** app: Live / History /
  Events. Verb: watch / review. (to build, see next section)
- **Files** — admin-only **filesystem + YAML editor** (iOS Files model),
  replaces the File editor add-on. Verb: browse / view / edit config. (to
  build, see "Files" section)
- **Media browser** — dropped.
- **Intercom / Announce** — the good half of TTS, parked for later.

## Cameras (first-class shared destination) — BUILT

> Status (verified 2026-07-03): BUILT. `/cameras` route + `camerasBody(persona,
> bp)` with Live / History / Events modes; persona scoping honored. Original
> plan kept below for rationale.

Cameras is its own top-level **shared** destination, not a homepage subview and
not folded under Security. Named **Cameras** (matches how the app names domains
by the thing itself: Lights, Climate, Energy; plainest honest label; avoids the
cold "Surveillance/Monitoring", the taken-and-broader "Security", the video/
Media collision, and UniFi's "Protect" brand). Inspiration (do NOT copy the UI):
UniFi Protect desktop + the iOS camera apps the user attached, a genuine
three-mode surveillance app.

### Cameras vs Security (the split that made "Security" the wrong name)

- **Security** stays the glanceable **access + alarm** overview: who's locked,
  is it armed, sensor status, with quick camera peeks. The summary.
- **Cameras** is the deep **visual** app you drill into: live wall, history,
  events. Overview vs. app, the same relationship Music (curated) has to a full
  browser. Security links across to Cameras for the visual side.

### Three modes

1. **Live** — a wall/grid of all camera feeds (placeholders in this build),
   per-camera fullscreen, plus an at-a-glance status panel (armed state,
   storage used / oldest recording, camera count). Grid-density toggle.
2. **History / playback** — a per-camera scrubbable **timeline** of recorded
   footage with clip management (save / download / export a range). Honest
   placeholder media; the scrubber and range-select are the real interaction.
3. **Events / detections** — a searchable **grid of motion / person / vehicle**
   events with filters (type chips: person / vehicle / animal, plus area, time,
   confidence). Mirrors the attached detections view; demo data.

### Placement, access, scope

- **Shared space**, first-class destination (own route, e.g. `/cameras`, and a
  directory entry so it lands on the More page). Used often enough (doorbell,
  "who's at the door", check the kids' room) to earn top-level status rather
  than being buried under Security.
- Persona scope honors existing calibration: Nour sees only her scoped cameras
  (e.g. front door / ground floor), Lars limited, no admin-only leak. Camera
  *device configuration* (add/edit camera) stays Admin, consistent with the
  rest of the app; residents get view + review only.
- Follows copy rules (sentence case, no dashes, "you", mono for times/counts)
  and the design system (elevation over borders, one accent, MDI icons). All
  camera imagery uses neutral placeholders until the user supplies real feeds.

## Files (admin-only filesystem + YAML editor) — BUILT

> Status (verified 2026-07-03): BUILT. `/files` route + `filesBody(persona, bp)`,
> admin-gated, breadcrumb tree + editor. Original plan kept below for rationale.

Repurposes the "browse a tree" chassis for the one audience that genuinely needs
it: the **maintainer**. An **iOS Files style** browser over every file the
instance can see, local and cloud, that **replaces the File editor add-on** (you
no longer install an add-on to touch config). Admin space (purple), maintainer
only; residents never see it.

### Model (iOS Files)

- **Browse root = locations.** *On this instance* (the local filesystem:
  `config/`, `media/`, `www/`, `share/`, `backup/`, add-on shares) and *Cloud*
  (HA Cloud, backup targets, network / cloud storage integrations). Drill in
  with breadcrumbs, grid/list toggle, sort, search, the Files pattern on our
  collection shell.
- **View anything** — text, YAML, logs, images previewed inline; binaries show
  info + download.
- **Edit YAML** (and any text: `configuration.yaml`, `automations.yaml`,
  `themes/`, `www/`). This is what absorbs the File editor add-on.

### Refinements (agreed)

1. **View-first, edit-deliberate.** Editing raw YAML can break the instance, so
   the surface is view-by-default with a clear **edit** toggle, a **check
   configuration** affordance before save, and honest copy. Not a casual
   surface.
2. **`.storage` and secrets are protected.** `.storage/` (JSON backing
   UI-managed config) and `secrets.yaml` are sensitive: the browser shows the
   meaningful dirs and treats those as **read-only / hidden by default** rather
   than inviting edits that corrupt UI state.
3. **IA placement.** This is the Admin **YAML / developer-tools / Storage**
   neighborhood made concrete: an **admin destination near Logs, Backups,
   Storage**, never in the shared space. Name: **Files**.

### Scope / non-goals

- Prototype: file contents and cloud locations are demo data; save / check-
  config / download are honest placeholders (local only, no real filesystem
  write). Editing is YAML/text only; media stays view + download.

## Intercom / Announce — PARKED (future)

The good half of TTS: family members speaking to each other through the home
("dinner's ready" to all speakers, "come downstairs" to the kids' room). A
compose-and-send action surface (message -> rooms -> speak) with a history of
recent announcements, not a browse surface. On-theme for "the whole household".
**Parked** to design and build later; recorded here so the idea isn't lost.

## Voice assistants (shared directory + maintainer edit) — BUILT

The IA's shared **Voice assistants** node, resolved around the privacy tension
of "let residents see the pipelines and what's been said" without turning the
home into a surveillance transcript. The resolution: **separate capability from
content.** Capability (what assistants exist, what they do, which satellites,
where processing happens) is genuinely shared and privacy-safe; content (what
was said) is not shared at all, and a person's own attributed requests live in
their Personal space.

### The three-way split (agreed)

- **Shared** (`/voice-assistants`) = the **pipeline directory**, no transcripts.
  What voice assistants the home has, what each can do, its language + wake
  word, its speech pipeline (agent / STT / TTS, each tagged local or cloud), and
  which satellites run it and where (with live status). Hero is a candid
  **transparency card** ("What the home keeps"): the home keeps no record of
  what is said to shared speakers; unmatched requests are handled then let go.
- **Personal** (My data -> **Voice**, label kept as just "Voice") = **your own
  voice history**, attributed to you via the companion app / voice match. Only
  you can see it. A "Keep my voice history" toggle (on by default; off shows an
  honest empty state), per-entry delete + Clear all, each row showing the
  utterance, the home's response, mono time, room, assistant, and a local/cloud
  pill. A closing section states plainly that requests the home cannot match to
  a person are never stored.
- **Admin** = **maintainer edit** of pipelines, in-place (not a separate route),
  mirroring the Services / Tags `serviceEdit` / `tagsEdit` pattern.

### Maintainer edit (admin only)

`state.voiceEdit`, toggled by the page action (pencil -> "Done"), reset on
navigation (cleared in `_onHash` / `go` alongside `serviceEdit` / `tagsEdit`).
The pencil/Done toggle (`voiceEditToggle`, wired as the page `cta`) renders
**only when `persona.spaces` includes `admin`**, and `editing` is additionally
gated `admin && state.voiceEdit`, so a resident can never enter edit mode.

- **Directory in edit mode:** an admin notice, each assistant card gains a
  **delete** affordance, and an **Add a voice assistant** dashed card
  (placeholder). The transparency hero is hidden in edit mode.
- **Detail in edit mode** (`voiceAssistantEditBody`): admin-space `SpaceIndicator`
  tint + the standard "editing here is a placeholder" notice; a form for Name,
  Language (`ccOverlaySelect` from `cloud.voice.languages`), Wake word,
  conversation agent, speech to text, text to speech, per-satellite toggles, a
  "Set as default" toggle, Save / Cancel, and a danger **Delete voice
  assistant** (confirm dialog). Placeholder saves (local only).

### Data (`household.js`)

- `voiceAssistants` (array): each `{ id, name, isDefault, space: "shared",
  language, wakeWord, processing: "local" | "cloud", handledOn, agent/stt/tts
  ({ name, kind }), can [{ icon, text }], satellites [{ id, name, area, status
  }] }`. Two realistic pipelines: **Home voice** (fully local, Whisper + Piper,
  default) and **Assist with AI** (cloud, Home LLM via Home Assistant Cloud),
  so the local/cloud privacy contrast is visible. Satellites carry an `area`, so
  persona scope (Nour, Lars) filters them via `canAccessArea` (detail shows an
  honest "N more satellites are outside the areas you can see" note).
- `voiceHistory` (object keyed by persona id): each person's own attributed
  requests `{ id, text, time, room, assistant, response, handled }`. Unmatched
  utterances are never stored, so this is only ever your own.
- `personalData` gains a `voice` entry (icon `microphone`, access `private`);
  `myDataDetailBody` special-cases it to `voiceDataBody` (like `presence`).
- `directory` gains `{ id: "voice-assistants", label: "Voice assistants", icon:
  "assistant", space: "shared", route: "/voice-assistants" }`, in the shared
  home-routines group next to Automations / Scenes / Scripts / Tags. Not a
  default dock bookmark.

### Routes

`/voice-assistants` (shared directory) and `/voice-assistants/:id` (detail =
capability, pipeline, satellites, privacy, details). Editing is the in-place
`voiceEdit` mode, so no `/voice-assistants/edit/:id` route.

### Verification

- `/voice-assistants` opens for any shared-space persona with the transparency
  hero + assistant cards. Detail shows what it can do, how it hears and speaks
  (local/cloud pills), satellites with live status, a privacy section, and a
  details card. Maintainer (Daan) sees the pencil -> edit (delete cards, Add,
  editable form, Set default, Delete); residents (Sofie) see the directory and
  detail but **no pencil, no add, no edit**; Nour / Lars see only satellites in
  their scoped areas. My data -> Voice shows only your own history, the keep
  toggle, delete + clear; empty for personas with no history (Nour). Correct on
  mobile, tablet, desktop.

## Home (per-person, self-owned) — BUILT

> Status (verified 2026-07-03): BUILT, under different naming than this plan
> proposed. The home overview IS each person's own widget stack:
> `homeBody` -> `homeShell` -> `forYouColumn`, with `fyDefaultFor(persona)`
> reading each persona's `widgets` from `household.js`, an edit mode (`fyEdit`)
> to add/remove/configure, and per-persona persistence in `cc-fy-<personaId>`
> restored on persona switch. Deltas vs the wording below: stored in
> **sessionStorage** (`cc-fy-*`), not localStorage (`cc-home-*`); framed as the
> widget stack rather than "whole Home sections" (little practical difference).
> Do not rebuild this as a separate `homeEdit` mode. Original plan kept below.

Home is NOT a dashboard. It is the built-in home, the app's own landing. Its
ownership rule is the deliberate opposite of a dashboard's, and stating that
contrast is the point:

**Home is per-person and self-owned.** Everyone has a Home; everyone edits their
own. It is N private arrangements of the built-in home, not one shared artifact.
No permission is involved: your Home is always yours to arrange, only ever for
yourself. (A dashboard, by contrast, is one fixed shared object with an access
list, see the Dashboards section.)

### What changes

- **Home becomes per-person editable.** `state.homeEdit` -> an **Edit home**
  mode that formalises today's per-person For-you edit into arranging your whole
  Home overview (which sections/cards appear and their order). Everyone can edit
  their own Home; there is **no rights gate** (it is inherently yours).
- **Persisted per persona** in `localStorage` (`cc-home-<personaId>`), the same
  pattern bookmarks / For-you state already use, restored on persona switch.
  Each persona's arrangement is isolated (editing Daan's Home never touches
  Sofie's).
- Copy frames it plainly: "Your home. Only you see this arrangement."

### Scope

Card-level arrange (add / remove / reorder sections), reusing the For-you
add/remove/config vocabulary. Not a drag-resize grid engine.

### Verification

- Each persona edits their own Home; the arrangement persists across reload and
  stays isolated per persona; no rights prompt ever appears (it is always
  yours). Correct on mobile, tablet, desktop.

## Dashboards (user-created, access-controlled) — BUILT

### The model (agreed)

Nothing Home Assistant ships is a dashboard. The **built-in home** (Home, floors
and areas, Lights / Climate / Security / Energy, Devices, People, the service and
routine pages) is the app itself. **A dashboard is only ever a page a person
built.** Dashboards are purely additive.

The contrast with Home (its own section above) is deliberate:

- **Home** is per-person and self-owned: N private arrangements, no permission.
- **A dashboard** is **one fixed shared object with an access list.** A single
  canonical layout, carrying independent **view rights** and **edit rights**.
  You see it in your nav only if you're a viewer; you get the pencil only if
  you're an editor. Every viewer sees the same layout (that's "fixed").

**Grants are by role AND individual, combinable.** `viewers` and `editors` are
each independent lists of grant tokens: a **role** (`everyone`, `maintainers`,
`residents`) and/or an **individual person** id. The quick default is a role;
add named people to scope or extend. `canViewDashboard` / `canEditDashboard`
resolve a persona by role match OR explicit person match.

"Shared vs personal" is therefore **not a toggle**, it is emergent from the
grant:

- view = just me, edit = just me -> a private dashboard
- view = `everyone`, edit = `maintainers` -> a public dashboard
- view = `lars`, edit = `maintainers` -> a dashboard built *for* someone
  (curated child / nanny views)

This is the app's founding thesis made literal: a space is a property of
content. A dashboard's space *is* its view/edit grant, and scoping viewers to
Nour or Lars reuses the same access machinery as `canAccessArea`. Grants are
explicit: a maintainer is **not** an automatic editor or viewer of anyone's
private dashboard.

### Data (`household.js`)

- New `dashboards` array. Each: `{ id, name, icon, viewers: [grant], editors:
  [grant], startedFrom: "blank" | templateId, cards: [...], createdBy, created,
  modified }`. `viewers` / `editors` hold role ids and/or person ids.
- Realistic Janssen seed spanning the rights spectrum:
  - **Family wall** (kitchen kiosk) - view `["everyone"]`, edit `["daan"]`. (public)
  - **Movie night** - view `["daan","sofie"]`, edit `["daan"]`. (couple)
  - **Sofie's dashboard** - view + edit `["sofie"]`. (private)
  - **Lars's stuff** - view `["lars"]`, edit `["maintainers"]`. (curated for a child)
  - **Guest** - view `["nour"]`, edit `["daan"]`. (scoped nanny view, ties to her
    expiring access)
- Helpers: `dashboardsFor(persona)` (viewable), `canEditDashboard(persona, id)`,
  `canViewDashboard(persona, id)`. Card templates ("pre-build" starting points)
  as a small `dashboardTemplates` list (Blank, Room control, Media, Family board).

### Routes

- `/d/:id` - view any dashboard (one route; space is emergent, not in the URL).
  Non-viewers get a no-access state; unknown id -> not found.
- Editing is in-place `state.dashEdit` (pencil -> Done, reset on navigation,
  gated by `canEditDashboard`), mirroring `serviceEdit` / `tagsEdit` /
  `voiceEdit`.
- Retire the `/my/dashboard` stub: "My dashboard" becomes simply a dashboard
  whose viewer is just you. Keep a redirect for safety.

### More page

- `directoryFor(persona)` folds in that persona's **viewable** dashboards. They
  render as their **own "Dashboards" group**, distinct from the built-in
  destinations (reinforces "the ones we made" vs "the home"), each row carrying
  a small audience hint (a lock for private, people glyph for shared/curated).
- The group header holds **+ New dashboard**. Dashboards are not bookmarks; as
  with everything else, you bookmark the ones you use most into the dock.

### Creating a dashboard

A create sheet (reusing `renderSheet` / the multi-step overlay):

1. Name + icon.
2. **Start from:** Blank, or a template (the "pre-build" starting points).
3. **Access:** *Who can view* and *Who can edit*, each offering the role presets
   first (Everyone / Maintainers / Residents) then a per-person list to add or
   override. Both grants independent, defaulting to just you.

The IA's **Add vs Create** split: *Create* = this flow. *Add* = adopt a
community dashboard from the Admin **Community store -> Custom dashboards**
category (a placeholder "install" that drops a prefab into your dashboards).
Secondary, admin-only.

### Editing (the editor)

- In-place `dashEdit` mode, **card-level** (not a full drag-resize grid engine,
  out of scope for a flows prototype): **add card** from a palette of card types
  (entities, area, camera, weather, scene), **remove**, **reorder**, reusing the
  vocabulary already built for the For-you add/remove/config overlays.
- Pencil shown only to editors. View-only viewers never see it.

### Managing

- Each dashboard's `...` overflow: Rename, **Edit access** (the view/edit grant
  sheet), Duplicate, **Set as my home**, Delete. Delete / rename / access gated
  to editors; *Set as my home* is per-person and always available to a viewer.

### Default landing page (Appearance, two levels)

Mirrors the instance-default vs per-user-override theme pattern.

- **Settings -> Appearance (instance default):** the home's default landing
  page. Default is **Home**.
- **My account -> Appearance (per-user override):** each person picks their own
  landing, Home or **any dashboard they can view**. Options list "Use home
  default (currently Home)" first, then Home, then viewable dashboards.
- **Resolve:** `effLanding = userLanding ?? instanceLanding ?? "/home"`.
  Persisted like theme, instance in `localStorage` (`cc-landing-instance`),
  per-user per persona (`cc-landing-<personaId>`), restored on persona switch.
- **The HA mark (rail + topbar logo) routes to the resolved landing**, not
  hard-wired `/home`. Delivers the parked "clicking the logo goes to your chosen
  entry" note.
- The dashboard `...` -> **Set as my home** writes the same per-user landing
  override. One preference, two entry points, kept in sync.
- **Fallback:** if a chosen landing is a dashboard the user later loses view
  access to (Nour's Guest expires, a grant is removed), the logo falls back to
  Home rather than dead-ending.

### Verification

- **Daan:** sees all dashboards he can view; creates one; edit mode only on
  those he can edit; the access sheet sets independent view/edit by role and
  person; set-as-home reroutes the logo. **Sofie:** sees Family wall (view only,
  no pencil) plus her own (edit); cannot see Daan's private one. **Lars:** sees
  only "Lars's stuff", view only. **Nour:** sees only "Guest". Landing-page
  override resolves and falls back to Home when access is lost. Correct on
  mobile, tablet, desktop; no rights leak.

## Entities (entities list + developer tools states) — BUILT

> Status (verified 2026-07-03): BUILT. `/entities` route + `entitiesBody(persona,
> bp)` (management list, filters, bulk actions) and `entityInspector` detail,
> admin-gated. Original plan kept below for rationale.

The IA's Admin-space node **"Entities list + developer tools states"** (under
Home analytics, next to History viewer / Delete data / Activity viewer). It
merges the two per-entity surfaces Home Assistant ships separately today into a
single admin destination.

### What the two sources are today (so we know what we're merging)

- **Settings -> Devices and services -> Entities** = the **management list.** A
  table of every entity: select checkbox, icon, friendly **Name** (with
  `entity_id` under it), **Integration**, **Area**, **Status**. Search + a
  filter panel (integration, area, label, category, and status flags: disabled,
  hidden, read-only, unavailable, not provided). Selecting rows reveals **batch
  actions** (add label, enable, disable, hide, unhide, recreate entity IDs,
  delete). A row opens the **entity settings dialog** (name, icon,
  area, `entity_id`, and advanced: show as, precision, enabled/visible). The
  organise-and-name surface.
- **Developer tools -> States** = the **raw inspector.** Its table shows
  **Name**, **Entity ID** (`entity_id`), **State** (raw value), **Device**,
  **Area**, and **Attributes** (the attributes as an inline list), with a filter
  field. (Real HA also has a **Set state** form above the table for forcing a
  value; **we do not adopt it, see below.**) Clicking a row reads out that
  entity's state. The inspect surface. Note it already **shares Name / Device /
  Area** with the entities list, so the merged column set is a clean union.

### Name: Entities (decided), not States

Because we drop set-state (next), the page can only **show** state, never write
it. State becomes one column and one detail section, not the reason the page
exists. The object you browse, filter, name, and organise is **entities**; the
state is an attribute of each. "States" would name a facet and over-promise a
debugger whose interactive half we removed, and it breaks the app's
naming-by-thing convention (Lights, Devices, Cameras, Tags). So the destination
is **Entities**; the dev-tools content (raw value + attributes) lives inside it
but is not the headline.

### The merge (agreed model)

One admin destination, **Entities**, plainest honest label (the thing itself,
consistent with Lights / Devices / Tags naming); the states side is a **facet of
each entity**, not a second name. It shows the *management metadata* and the
*live truth* together: the list carries name / integration / area / status
**and** the current state value; the detail is a single entity inspector that
combines the settings dialog **and** the raw state + attributes + set-state.

- **Entities vs Devices (the split that justifies a separate destination).**
  Devices = physical things, shared, resident-facing (unchanged). Entities = the
  granular per-entity technical layer, admin, maintainer only. A device *has*
  entities. So Entities is the honest developer/config layer under Devices, and
  the two cross-link (a device detail lists its entities; an entity inspector
  links back to its device).
- **No Set state (dropped for this concept).** Real HA's developer-tools states
  page lets you force a state value; we deliberately **do not** bring that over.
  It fakes a value until the next real update (misleading), and the honest job
  of this merged page is to *see* the truth and *manage* the entity, not poke
  it. State + attributes are **read-only** here. If a debug-poke need surfaces
  later, revisit it as its own developer affordance, not baked into this page.

### Placement, access, scope

- **Admin space (purple), maintainer only.** Residents never see it, no route
  leak, no directory entry for them. It sits in the admin developer-tools /
  analytics neighborhood alongside **Logs**, **Files**, History viewer, Activity
  viewer. Not a default dock bookmark.

### Collection page (reuses `collection()` / filters rail / customize columns)

Model on `devicesBody` / the routine collections, but **list-first** (a states
table wants a dense table, not a card grid).

- `id: "entities"`, `noun: "entities"`, icon `format-list-bulleted` (or
  `shape-outline`), `defaultView: "list"`, `supportsCard: false` (raw states
  don't read as tiles), `defaultSort: "name"`.
- **Search** over friendly name, `entity_id`, and current state.
- **Filter groups:** Domain (light / sensor / switch / climate / camera / lock /
  binary_sensor / ...), Integration, Area, Label, Category, and **Status**
  (enabled / disabled, hidden, read-only, unavailable, restored). **Group by:**
  none / domain / integration / area. **Sort:** name, entity id, state, last
  changed.
- **List columns (+ customize), matched to the app's existing column machinery**
  (`columns` + `customCols` with Name `locked` + `colDefaultHidden`, as devices /
  routines do). The set is real HA's entities-list columns plus the one column
  the merge contributes, **State**:
  - **Visible by default:** **Name** (locked, icon + friendly name), **State**
    (the merge's addition, the trailing `hasStatus` "State" slot the app already
    labels that way, raw value mono), **Device** (links to the device detail),
    **Area**, **Integration**, **Status** (enabled / disabled / hidden /
    read-only / unavailable pills).
  - **Hidden by default** (`colDefaultHidden("entities", key)` returns these):
    **Entity ID** (mono, the dev-tools primary key, one toggle away), **Attributes**
    (from dev-tools; renders a compact `key: value` inline list when shown, full
    dump always in the detail), **Created** (mono), **Modified** (mono),
    **Assistants** (which voice assistants the entity is exposed to).
  - So **Status** stays the pill column (real HA's "Status"); **State** is the
    distinct raw-value column the states merge adds.
- **Bulk selection** reuses the existing **Select mode**. The batch actions
  mirror real HA's current set exactly (placeholders, local only): **Add label**,
  **Enable selected**, **Disable selected**, **Hide selected**, **Unhide
  selected**, **Recreate entity IDs of selected** (regenerates each `entity_id`
  from its current name slug, the cleanup you run after renaming), and **Delete
  selected** (gated to removable, i.e. restored/orphaned, entities). Area and
  category are **not** batch actions, they stay per-entity in the settings form.
- **Add** is not the primary verb here (entities come from integrations, you
  don't hand-create them); the topbar `+` is omitted or points at "Add
  integration". Editing is per-entity + bulk, not a create flow.

### Entity inspector / detail (reuses `detailInfoCard` / `detailSection`)

`/entities/:id` = the merged **entity data** view. Model on the routine / tag
detail. In one page:

1. **Header / summary card** (admin 3px left border): icon, friendly name,
   `entity_id` (mono), domain, and the **current state** stated plainly
   ("Currently `on`", "Reported `unavailable`", mono value + unit).
2. **State** section (the dev-tools states half): the raw **state value** and
   the full **attributes** as a key/value table (mono), plus **last changed** /
   **last updated** timestamps (mono).
3. **Settings** (the entities-list half): Name, icon, Area (`ccOverlaySelect`),
   `entity_id`, Labels, Category, and advanced (enabled / visible / read-only,
   "show as", precision). Edit-gated. **No set-state field.**
4. **Details** info card: Integration, Device (links back to the device
   detail), Area, Space (Admin), Unique id, Enabled / Hidden / Read-only.

### Edit mode (in-place, admin only)

Adopt the app's **view mode vs edit mode** pattern (Services / Tags / Voice /
Dashboards): `state.entitiesEdit`, toggled by the page action (pencil ->
"Done"), reset on navigation (cleared in `_onHash` / `go` alongside
`serviceEdit` / `tagsEdit` / `voiceEdit` / `dashEdit`). The pencil/Done toggle
(`entitiesEditToggle`, wired as the page `cta`) renders **only when
`persona.spaces` includes `admin`**, and `editing` is gated `admin &&
state.entitiesEdit`, so a resident can never enter it. Edit mode exposes the
Settings form on the detail and the bulk actions on the collection (no set-state
panel). Placeholder saves.

### Data (`household.js`, new `entityRegistry`)

A flat `entities`-style array **under a new key (not `H.entities`, which this
codebase already uses for the *devices* array, id `devices`)** — e.g.
`H.entityRegistry`. Each
`{ id (entity_id), name, domain, deviceId, integration, area, state, unit,
attributes: { ... }, lastChanged, lastUpdated, enabled, hidden, readOnly,
unavailable, restored, labels: [], category }`. Seed a realistic Janssen slice
across domains (lights, sensors, climate, locks, cameras, media, binary_sensors,
switches) so the domain / integration / area filters and the states table have
honest variety. `entity_id`s follow HA convention
(`light.living_room_ceiling`, `sensor.kitchen_temperature`). Cross-links resolve
`deviceId` against `devices`.

### Routes + directory

- `/entities` (collection) and `/entities/:id` (inspector). Register alongside
  the other collection routes; add `entities` to `isCollectionRoute` and the
  `singular()` map ("entity"). Editing is the in-place `entitiesEdit` mode, so no
  `/entities/edit/:id`.
- `directory` gains `{ id: "entities", label: "Entities", icon:
  "format-list-bulleted", space: "admin", route: "/entities" }`, in the admin
  group near Logs / Files, so it lands on the More page for admin personas only.

### Scope / non-goals

- Prototype: state and attributes are demo data and **read-only** (no set-state
  in this concept); bulk actions / settings saves are honest placeholders (local
  only, no real registry write). No live websocket. Follows copy rules (sentence
  case, no
  dashes, "you", mono for states/ids/times) and the design system (elevation
  over borders, one accent, MDI icons, admin-space tint).

### Verification

- `/entities` opens **admin-only** as Daan: dense list-first table with State
  (mono), filters (domain / integration / area / label / category / status),
  group/sort, customize columns, and Select-mode batch actions (add label,
  enable, disable, hide, unhide, recreate entity IDs, delete). Row -> inspector
  merges read-only state + attributes + last changed with the settings form;
  edit mode reveals the settings fields (no set-state); Done returns to view;
  navigation resets the mode. Device cross-link works both
  ways. Residents (Sofie, Tess, Lars, Greet, Nour) get **no route, no directory
  entry, no leak**. Correct on mobile, tablet, desktop.


## Discovery, Explore, and resident suggestions — BUILT

> Status (verified 2026-07-03): BUILT. `exploreBody` + the full
> SUGGESTIONS + DISCOVERY / EXPLORE section (~line 6194): `sugAll()`,
> `openCompose`/`renderCompose` (residents propose), `openReview`/`renderReview`
> (maintainer approve/edit/decline), pending-suggestion banners on the
> automations page, co-authoring + credit (`routineCredit`, "Built by"), and
> notification prefs for suggestions/approvals/co-authoring. Original plan kept
> below for rationale.

Resolves the IA "Discovery" node (Assist / Search / Explore) and, on top of it, lets residents (not just maintainers) contribute zones and automations through a suggest-and-approve flow, with collaborative authorship and joint credit.

### Framing decisions (agreed with the user)

- Zones and automations are ALWAYS shared. No personal tier, for privacy reasons (a personal zone/automation would leak location or behavior patterns). This deliberately overrides the IA's old "Personal point of interest (zone)" node. Everything a resident creates in these domains is shared, so it goes through review.
- The gate is suggest-then-approve, not a person-based lockout. Residents get the real editor; their Save becomes Suggest. A maintainer approves, edits, or declines. No granted-trust tier: a resident trusted to add directly should just be made a maintainer.
- Credit: approved unchanged, credit stays the resident ("Built by Sofie"). Approved with edits, joint credit ("Built by Sofie and Daan").

### Discovery = one omnibox + Explore canvas

Assist and Search merge into ONE typed/spoken omnibox: type or talk, it finds what exists AND answers/acts on requests. Hands-free voice stays globally invocable (rail mic / wake word) so it is never buried inside a page.

Explore is the canvas behind the omnibox: a shared-space destination for possibility and guidance, the opposite of For-you.
- For-you = live present (reactive, ephemeral: media playing, power spike, a suggestion waiting this minute). Unchanged.
- Explore = evergreen possibility (proactive, persistent: what the home could do, what you have not set up, how things work).

Explore holds: (1) a getting-started checklist (returnable tip center, progress persists, links to docs); (2) capabilities by outcome ("Save energy", "Feel safe when away", "Wake up gently"), each opening a recipe you can set up, where the AI data-generation task appears in context ("Draft this for you") handing off to the editor then Suggest; (3) the open-loop tray + archive.

### Notifications, without an inbox

- Transient + urgent ("approve Sofie's suggestion now") -> phone push (companion app, represented) + the ephemeral For-you widget + inline pending state (ghost pin on the map, a "Suggested" status pill in the automations list). These expire.
- Durable + come-back-to ("a suggestion is waiting", "3 updates available", "finish setup") -> the open-loop tray in Explore. Every item is finishable and self-clears when resolved; when nothing is open the section is absent. That is what makes it not an inbox.
- Archive: resolved items drop into a "come back to" history you can open, each carrying outcome + credit ("Sofie's zone, approved with changes by you, 2 days ago"). The honest suggestion lifecycle record.
- My account -> Notifications (p-notifications, currently a placeholder) = delivery preferences only (per-category push vs in-app, quiet hours, per-device). The suggestion flow obeys these. Not an inbox.

### Generative UI, bounded

Generation is config generation, not free-form interface: draft automations, scenes, zone shapes, and dashboards assembled from the existing component vocabulary, always reviewable and editable. Powered by an HA AI Task (data generation) configured in Settings -> AI tasks; the drafting task is a sibling of the stock "Suggest automation names".

### The resident suggest flow (zones + automations, same shape)

Compose three ways, converging on one Suggest button: (1) type the idea in plain language (upgrades today's "Request automation" stub); (2) draft with AI (optional; a data-generation AI task turns the sentence into a draft; shown only when such a task is configured, otherwise a maintainer sees a link to Settings -> AI tasks and a resident sees "Ask a maintainer to set up an AI task"); (3) build it (the real editor: draw the zone, build the automation). Then Suggest. The maintainer is reached by push + the Explore open-loop tray, deep-linking to the review view: approve as-is, edit then approve, or decline with a note. Inline the pending item shows as a ghost pin / "Suggested" pill until resolved.

### Co-authoring and joint credit

Extend the dashboards model to automations (then scenes/scripts): createdBy (person id) + an editors grant (role and/or person tokens, reusing the dashboards "Edit access" share sheet) + a contributors list (who actually edited, drives the joint-credit line). Detail reads "Built by Sofie and Daan". Editing adds the editor to contributors.

### Data (household.js)

- automations / scenes / scripts: replace the single creator string with createdBy + contributors:[personId] + editors:[grant]; add status ('live' | 'suggested' | 'declined'), suggestedBy, suggestedAt, reviewNote. Seed a couple of pending suggestions and one co-authored item.
- mapData.zones: add createdBy, status, suggestedBy, suggestedAt; seed one pending resident-suggested zone.
- aiTasks: the AI tasks registry (data-generation + image-generation) so the AI-draft button can gate on a configured data-generation task.
- explore: checklist (steps + done), capabilities (outcome groups -> recipes), docs. Open loops derived (pending suggestions + updates + unfinished checklist); archive is resolved history.
- notifPrefs: per-persona notification delivery preferences.

### Routes

- /explore (shared) — the Explore canvas; directory entry in the shared Home-perspective group. Omnibox is chrome (rail mic + global field), not a route; typed results open inline, voice is global.
- Zone suggest/review is in-place on the map (no new route). Automation suggest/review reuses the automations collection + /automations/:id detail with an editing/review mode, mirroring serviceEdit/tagsEdit.
- ai-tasks and p-notifications become real custom settings pages.

### Build order

1. Data model. 2. Zone suggest-on-map flow. 3. Maintainer review + inline pending state + credit. 4. Automations suggest flow (mirror). 5. Co-authoring editors/contributors + joint credit + access sheet. 6. Explore page (checklist + capabilities + open-loop tray + archive). 7. Discovery omnibox. 8. Notifications (push representation + My account -> Notifications prefs). 9. AI tasks settings page.

## Tile card, rebuilt to match Home Assistant (compact + icon shape + features) — SPEC ONLY, NOT WIRED

> Status (verified 2026-07-03): the full rebuild lives ONLY in the standalone
> spec `Tile Card Spec.dc.html`. The live app's `tile()` is still identity +
> toggle, special-casing only light/switch/fan. Per-domain controls (brightness
> slider, climate gauge, lock, sensors, covers, media, badges) are NOT wired into
> the app, and it depends on the more-info dialog below (tapping a tile body).
> This is genuinely remaining work. Original plan kept below.

The `EntityTile` we ship today is a **deliberately narrowed** take on Home
Assistant's tile card: a tall (min-height 92px) vertical button, icon top-left,
name + state at the bottom, state carried by **whole-card elevation** (surface
vs surface-raised) and an accent icon, tap anywhere toggles. It has no features,
no icon shape, no split tap targets, no per-entity color, and it is bigger than
HA's real tile. This plan rebuilds it to match the real tile card's model and
capabilities, expressed in the Concept Car's visual and interaction language,
and **more compact**. Reference: HA docs (tile card + card features) and the
demo (`demo.home-assistant.io/#/lovelace/home`), screenshots attached.

Deliverable this pass: the plan below + a **mock spec page**
(`Tile Card Spec.dc.html`) that shows the redesign end to end (anatomy, the
icon-shape rule, states, layouts, every feature, interactions, and an
in-context grid). Rolling it into the live `tile()` / `EntityTile` is a
follow-up after the spec is agreed.

### Inputs to reconcile (four directions)

1. **What we ship today** (DS `EntityTile`): tall vertical button, state by
   whole-card elevation (surface off / surface-raised on) + accent icon, tap
   anywhere toggles. No features, no toggle control, no unavailable state.
2. **Real HA tile** (docs + demo): compact horizontal, state carried by a
   **circle behind the icon** (tinted-on / grey-off / no-circle for
   sensors+covers), **tap the icon = toggle**, tap the body = more-info,
   features row, per-domain color, badges.
3. **The user's earlier direction** (`uploads/tile-sketch.pdf`, "Iteration 3,
   Color system, flat and outline"): a full room dashboard plus a **complete
   state matrix** of every domain in **On / Off / Unavailable** (Light,
   Thermostat, Switch, Garage, Lock, Blind, TV, Speaker, Fan, Vacuum, Person,
   Temperature, Humidity). Sensors carry **qualitative semantic labels**
   ("29.9° Risky", "58.5% Comfortable"), thermostats show current + editable
   setpoint, and the study explores **flat fills vs outline icons** as the color
   language.
4. **Two firm calls the user made in review:**
   - **Keep whole-card background = on/off state.** The thing we do today (the
     card background differs on vs off) stays. Do **not** move state into the
     icon circle only.
   - **No tappable-icon toggle.** Research shows people have to learn that
     hidden affordance. Use a **dedicated on/off toggle control** on the tile
     instead.

### The revised core move: tap the icon to toggle, background shows on/off

Settled in review (reversing the earlier "dedicated toggle" idea):

- **Tap the icon to toggle, in both states.** The icon keeps a **visible circle
  in on AND off** (colored tint + filled glyph on; neutral `surface-raised`
  circle + outline glyph off) so it always reads as the tap target, this was the
  fix to the "hidden affordance" worry, not removing the tap. The card **body**
  tap opens more-info; feature-row controls never open more-info.
- **Background shows state only where there is an on/off.** On/off domains
  (light, switch, fan, TV, speaker) tint the card when active (strength is D2).
  **Domains with no on/off carry no background tint** (per the user): sensors,
  thermostat, and the open/locked/playing domains stay on `--color-surface` and
  express state through the icon + their own control.
- **Icon is always device-class colored** (Option B). Filled-on / outline-off is
  the "flat and outline" study (D3).

### The hard part: entities with no off state

The user's key observation. Not every entity is on/off, so "background = on/off"
needs a rule for the rest. Proposed taxonomy (decision D1, refine together):

- **On/off (toggle) domains** (light, switch, input_boolean, fan, humidifier):
  the model above, background on/off + a **Toggle** switch.
- **Open/closed and locked domains** (cover/blind, garage, lock): they *have* a
  binary-ish state but it is not "on/off". Background reflects the **active /
  needs-attention** reading (e.g. unlocked or open = the raised/attention
  background, closed/locked = base), and the trailing control is
  **domain-specific** (a lock button, open/stop/close), never a generic switch.
- **Playing/idle domains** (media_player, TV, speaker, vacuum): background =
  active when playing/running; trailing control = transport / start-stop, not a
  switch.
- **Read-only sensors** (temperature, humidity, power, person presence): **no
  toggle, no on/off.** Two options for their background (decision D4): (a)
  always neutral `--color-surface`, value carries everything; or (b) **semantic
  tint from a qualitative band** (the sketch's "Comfortable" green / "Risky"
  warning), so the card color still means something. Person presence =
  home/away as the active/neutral read.
- **Unavailable** (every domain): a universal **muted** treatment, dimmed text,
  no controls, honest "Unavailable" label. The matrix in the sketch makes this a
  first-class state we do not handle today; the rebuilt tile must.

So background always means *something*, but the something is per-family: on/off,
open/locked, playing, or (maybe) a sensor comfort band, plus a shared
unavailable state.

### What the sketch actually shows (authoritative, decode of Iteration 3)

The PNG resolves most of the open questions, adopt it as the baseline:

- **Icon = the flat/outline system.** Active/colored state renders a **filled
  glyph on a soft domain-tinted circle** (light amber, switch blue, garage
  purple, lock **green when locked / red when unlocked**, blind purple, fan
  blue, vacuum green); a couple of media domains (TV, speaker) color the **glyph
  only, no circle**. Inactive renders an **outline grey glyph, no circle**. This
  is the primary at-a-glance state signal.
- **Card background is subtle**, near-`--color-surface` in both states, with at
  most a faint warm tint on active lights. So in the sketch the *icon* carries
  most of the state, not the card. This is the one place the sketch and the
  user's stated preference (\"I like the background changing on/off\") diverge,
  so **D2 is the real decision**: dial the on-state card tint up (honor the
  stated preference) or keep it subtle and let the icon circle carry it (honor
  the sketch). Recommendation: a **middle setting**, colored icon circle **plus**
  a gentle domain-tinted card on active, tunable.
- **Controls live in a feature row, never a hidden icon tap** (matches the
  user's second call). The sketch's control vocabulary:
  - **Segmented `On | Off`** pill = the dedicated on/off toggle (this replaces
    tap-the-icon). Two stacked variants shown.
  - **Brightness / position slider** = a thick rounded pill, filled portion in
    the domain color (amber gradient in the panel), white thumb.
  - **Stepper** `−  21.0  +` for climate target.
  - **Up / Down** icon buttons for garage; **lock / unlock** icon buttons for
    locks; **play / stop / dock** for vacuum; **pause / stop / dock** transport.
  - **Mode icon row** (~5 icons) for fan (auto / speed / oscillate / etc).
  - **Dropdown** (`Home ▾`) for person/select domains.
- **Sensors** (temperature, humidity) are value-forward: small outline icon +
  timestamp, **large value**, a **qualitative band** label with a colored dot
  (**Comfortable** blue / **Risky** red/amber), and a **sparkline** tinted to
  match the band. No controls. This answers D4 in favor of banded sensors.
- **Unavailable** = a muted grey card, faded outline glyph, \"Unavailable\"
  label, and a trailing **(!)** info affordance. Universal across every domain.
- **Thermostat** shows the current temp as a colored number to the left of the
  name, the action as subtitle (\"Heat to 21.5°\" / \"Idle on 20°\"), and a
  **flame** glyph when actively heating; feature version adds the stepper.

### Adapting the sketch to the Concept Car (dark-first)

The sketch is light-mode; the app is dark-first and token-driven. The mock
renders the same system in dark tokens: domain tints become low-opacity fills
over `--color-surface-raised`, outline glyphs use `--color-inactive`, the
unavailable card dims via opacity + muted text, band colors map to
`--color-success` (Comfortable) and `--color-warning` / `--color-error`
(Risky). Per-domain tints reuse the app's existing `homeNavItems` palette so no
new hues are invented. The one-accent-vs-device-class debate (Option A/B below)
becomes: keep the sketch's per-domain icon colors (device-class, Option B) or
collapse them to accent blue (Option A). The sketch clearly favors B.

### Decisions to make (discuss before building the live tile)

- **D1, the state taxonomy.** Agree the per-family background meaning above
  (on/off, open/locked, playing/idle, sensor, unavailable). Which domains toggle
  vs get a domain control vs are read-only.
- **D2, on-state background: elevation or tint.** "On" = `--color-surface-raised`
  (elevation only, most on-system), or a **flat domain tint** (amber light, cyan
  climate, from the sketch's color study, more glanceable, spends more color).
  Ties to Option A vs B below.
- **D3, icon treatment.** Flat/filled vs outline by state (outline off, filled
  on), and whether the icon keeps any (non-tappable) background shape now that
  it is not the toggle.
- **D4, sensor backgrounds.** Neutral always, or a **semantic comfort band**
  tint (Comfortable/Risky) as the sketch shows. If banded, who defines the
  bands per device class.
- **D5, compactness vs the toggle.** A trailing switch + a features row is more
  furniture than HA's icon-tap; confirm we still land meaningfully shorter than
  today's 92px, and how the vertical layout places the toggle.

The mock spec page shows these choices side by side (elevation vs tint, filled
vs outline, neutral vs banded sensors, the full On/Off/Unavailable matrix from
the sketch) so each decision can be made by sight.

### Coverage added (spec page "Every domain and feature")

Full domain + feature gallery built from the shared controls, so we can confirm
parity with HA's tile card:

- **Controls, standardized + neutral.** Segmented On/Off and every icon-group
  (fan/hvac/alarm/cover/vacuum/lawn-mower/lock commands) use one neutral
  selected treatment (translucent white fill, primary glyph), matching the
  slider, rather than per-domain color tints. Sliders (brightness, position,
  tilt, volume, fan speed), a warm-to-cool color-temp gradient slider, target
  steppers (temperature, humidity, numeric), dropdown (select / preset modes),
  bar gauge (% sensors), and action pill buttons (scene/script/button/automation
  Run/Press/Activate, update Install/Skip, date) cover the rest.
- **Badges** (top-right of the icon), per HA: shown for **climate** (hvac action,
  flame red heating / snowflake blue cooling), **person / device_tracker** (home
  when in a zone), and **humidifier**. Contextual, only when the state is
  meaningful. Read-only entities never badge.
- **Domains shown:** light (+ color temp), switch, fan (speed + modes +
  oscillate/direction), thermostat/climate (gauge + target + hvac + preset),
  humidifier, water_heater, cover/blind (open-stop-close + position + tilt),
  garage, valve, lock (commands + open door), media_player (tv/speaker: transport
  + volume), vacuum, lawn_mower, alarm, binary_sensor (motion/door/smoke), sensor
  (comfort band + sparkline = trend graph), battery (bar gauge), sun, number,
  select, scene, script, button, automation, update, date, person.
- **Parked (noted on the page):** camera thumbnail, weather forecast feature,
  swing modes, and the live dropdown/select menu (shown as static control).

### Reconciling HA's per-domain color with "one accent, blue"

Tension: HA colors the tile by state / domain / device_class (amber lamp, cyan
speaker, orange power, purple cover), and lets you set a per-entity `color`. The
design system says **one accent (blue), color is signal not decoration**. The
plan keeps the choice explicit rather than picking silently, and the spec shows
**both** so we can decide:

- **Option A, one accent (recommended default, on-system):** every active
  controllable entity tints its circle with **accent blue**; read-only icons
  stay text-colored; semantic/space colors unchanged. Disciplined, but loses
  HA's at-a-glance domain read.
- **Option B, device-class color (HA-faithful):** each domain carries a
  restrained tint drawn from the app's *existing* `homeNavItems` palette (lights
  `#e0a32e`, climate warm `#c47a1a` / cool `#2aa6b3`, media `#a855f7`, security
  green, energy blue), plus a per-tile `color` override exactly like HA's
  `color` option. More lived-in, matches the reference, but spends more color.

The user leans toward the colored reference; the spec presents A and B next to
each other, defaulting the live build to whichever we pick after review.

### Compact anatomy (horizontal, the new default)

Single row, ~56px content height (vs 92px today):

- **Icon** (left): identity only, not a control. A colored glyph, filled when
  on / outline when off (the sketch's "flat and outline" study, decision D3),
  optionally on a non-interactive shape for visual anchor. Optional **badge**
  (climate preset/demand, person zone) top-right, inline SVG/CSS.
- **Name** (top, `--text-base`, medium) + **state** (below, `--text-sm`,
  secondary), stacked. State content is configurable (state / last-changed /
  last-updated / any attribute), sentence case, mono for data values.
- **Controls, not a hidden icon tap:** a dedicated **Toggle** (or domain
  control) sits trailing-right; the **card body opens more-info**. Hold /
  double-tap on the body are configurable. Concept Car terms: subtle
  `background-color` feedback, no scale transforms; more-info opens as the
  shared overlay (sheet < 768, dialog >= 768) from `overlays.md`.

Also carry over the two layout options HA has:
- **Vertical** variant: icon shape centered on top, name + state centered below
  (a compact version of today's layout).
- **Hide state**, **icon-only** (name + state both off) for dense grids.

### Features (HA parity, Concept Car styling)

Features render in a row **below** the identity line (`features_position:
bottom`) or **inline** beside the state (first feature only). Built in the
system's vocabulary (elevation, one accent or the tile color, pill radii, mono
data, 200ms ease-out, no shadows):

- **Brightness / percentage slider** (light, fan, cover position, number): a
  rounded track on `--color-surface-raised`, filled portion in the tile color,
  draggable thumb; the reference's big pill slider. Value shown in mono.
- **Target temperature stepper** (climate): `−  21.0 °C  +`, the reference's
  climate feature; mono value, buttons on `--color-surface-raised`.
- **HVAC modes / fan modes / preset modes** (climate, fan): a segmented row of
  mode buttons (icons or labels), selected one accented, dropdown fallback past
  ~4 options (the `climate-hvac-modes` / `fan-modes` features).
- **Cover open / stop / close** (cover): three segmented icon buttons.
- **Media controls**: previous / play-pause / next transport for media_player.
- **Bar gauge**: a numeric sensor (%) as a horizontal bar (HA 2025.9 feature),
  for battery / humidity overviews.
- **Buttons**: run a script / scene / press a button, labeled pill (the
  `button` feature).
- (Parked, list-only for the spec: alarm-modes, update actions, trend-graph,
  weather forecast, valve, date/time.)

Multiple features stack; each is full-width in the bottom row.

### Configuration surface (parity with HA's card editor)

The tile exposes the same knobs HA's tile editor does, so the live build can be
configured per placement: **entity**, **name** (override), **icon** (override),
**color** (active color: a token or the device-class default), **show entity
picture**, **vertical** layout, **hide state**, **state content** (state /
last-changed / last-updated / attribute, single or list), **tap / hold /
double-tap actions** (card and icon independently), and **features** (+
`features_position: bottom | inline`). In this prototype the actions and saves
are honest placeholders; the visual + interaction model is the real deliverable.

### Migration (follow-up, after the spec is agreed)

### Migration — STATUS

**Done (first pass, in the live app `tile()`):** the app's `tile(e, persona)`
now renders the new **compact horizontal** tile in **Icon-only mode** instead of
the DS `EntityTile`:
- Card stays on `--color-surface` in both states (no elevation/tint swap).
- State reads from a **device-class icon circle** (amber light `#e0a32e`, blue
  switch `#2f80ed`, cyan fan `#2aa6b3`, accent fallback): tinted fill + colored
  glyph when on, `--color-surface-raised` grey circle + `--color-inactive` glyph
  when off.
- Layout: 40px circle left, name + On/Off stacked beside, `minHeight: 64`,
  `cc-chip3d` hover. Whole tile taps to toggle (kept — see note).
- The Lars locked "Ask Daan" variant is untouched.

**Still to do (follow-up):**
- **More-info + split interaction.** The spec's model (tap icon = toggle, tap
  body = more-info) needs a **more-info sheet/dialog** first (sheet &lt;768,
  dialog ≥768 per `overlays.md`). Until that exists, the whole tile toggles.
- **Features in-app.** Brightness slider (dimmable lights), target stepper
  (climate), cover open/stop/close, media transport, etc. Currently only the
  spec page carries these; the live tile is identity + toggle only.
- **Per-domain coverage.** Live `tile()` only special-cases light/switch/fan
  colors. Extend to the full domain map from the spec (climate gauge, lock
  green/red, sensors comfort band, covers, media, helpers) with the right
  control per domain.
- **Decisions still open:** D2 background (currently Icon-only / no tint — revisit
  if we want the subtle active tint), D4 sensor comfort bands.
- **Density.** Revisit the `cols(4,3,2)` counts and gaps now that tiles are
  ~64px rows.

Reference for all of the above: `Tile Card Spec.dc.html` (anatomy, matrix,
controls, sensors, badges, and the full "Every domain and feature" gallery).

## Entity dialogs (more-info), every archetype — SPEC ONLY, NOT WIRED

> Status (verified 2026-07-03): the 28-archetype gallery lives ONLY in the
> standalone spec `Entity Dialog Spec.dc.html`. There is no `moreInfo(entityId)`
> builder in the app and no `renderSheet`/`fyScrim` wiring for it; tapping an
> entity body still toggles the whole tile. This is genuinely remaining work
> (and unblocks the tile-card rebuild above). Original plan kept below.

The companion to the tile card. Tapping an entity body opens **more-info**: the
control panel for that entity. This closes the tile card's open item ("More-info
+ split interaction"). Deliverable this pass: the plan below + a mock spec page
(`Entity Dialog Spec.dc.html`) showing every archetype end to end, live.

**Shell (one, two frames).** Follows `docs/overlays.md`: **bottom sheet < 768px,
centered dialog ≥ 768px**, identical content. `--color-surface`, dialog radius
`--radius-xl` / sheet top radius `--radius-2xl`, scrim `--color-scrim` no blur,
`cc-dialog-in` / `cc-sheet-in` / `cc-scrim-in` motion. Anatomy, top to bottom:

1. **Header** — close **X top-left**, **settings cog top-right** (links to the
   existing full-page `entityDetail`, so the dialog stays control-first and the
   State/Attributes/Settings/Details page is one tap away).
2. **Identity** — device-class icon badge (tinted circle for on/off domains,
   avatar for people), name, one honest state line.
3. **Control block** — the archetype (below).
4. **Meta**, under a hairline — **History** (a trend graph for sensors, a
   **logbook** list for everything else), a collapsible **Attributes** list, and
   a "Device info and settings" link out.

**Archetypes (28), grouped by how they are controlled** — the differentiator is
the control block; the shell is shared:

- **Rich controls (bespoke widget):** light (vertical brightness slider + color-
  temp strip + mode row + effect select), climate (circular target dial +
  drag, HVAC mode row, preset), media player speaker (art + progress +
  transport + volume + source/group) and TV (transport + volume + d-pad +
  source), cover blind (open·stop·close column + position + tilt) and garage
  (big open·stop·close), fan (speed + modes + oscillate/reverse), lock (big
  lock/unlock + open door), vacuum and lawn mower (command icon row + fan speed
  + battery gauge), alarm (arm-mode row + keypad), humidifier (target-humidity
  dial + mode) and water heater (target-temp stepper + mode), valve (open·stop·
  close + position).
- **Value + history:** sensor (big value + comfort band + trend graph, 24h/7d/
  30d), binary sensor (state icon + logbook), person/device_tracker (mini map +
  zone + phone battery tiles).
- **Helpers + actions:** switch (big On/Off), number (value + slider), select
  (option list with check), scene (Activate) / script (fields + Run/Cancel) /
  button (Press), automation (enable toggle + Run now), update (installed vs
  available + backup toggle + Install/Skip), date (calendar picker), weather
  (current + 5-day forecast), and a **generic fallback** (state + attributes
  only, e.g. sun).

**Shared widgets** (dialog-scale, lifted from the tile card's vocabulary):
`vSlider` (vertical brightness/position), `hSlider` (volume), `tempStrip`,
`iconRow` / `iconColumn` / `segBig` (modes and commands), `dial` (draggable
circular target), `stepper`, `transport`, `bigToggle`, `barGauge`, `optionList`,
`keypad`, `datePicker`, `weatherPanel`, `trendGraph`, `logbook`.

**Decisions taken (defaults, questions timed out):** single spec doc covering
all archetypes; shell stacks control → History → Attributes (no tabs); History =
graph for sensors + logbook for the rest; settings cog links to the existing
entity page rather than folding it in; both sheet and dialog shown.

**Still to do (follow-up):**
- **Wire into the app.** Route the tile-body tap (and list rows / area cards) to
  open the shared overlay via `renderSheet` / `fyScrim`, resolving the archetype
  from the entity's domain. The spec's `dialogInner(spec)` maps onto a
  `moreInfo(entityId)` builder.
- **Real data + live state.** Drive control values, history and attributes from
  `household.js` instead of the spec's sample values; reflect changes back to
  the tile.
- **Camera more-info.** Parked here (the app already has a rich camera detail
  page/`camClipManager`); fold that into the dialog or link to it.
- **Open items to confirm with the user:** tabs vs stacked shell; whether the
  cog should link out or the dialog should absorb settings; per-archetype
  history depth (graph for more than just sensors?).

Reference: `Entity Dialog Spec.dc.html` (shell anatomy, the 28-dialog gallery,
and a live tap-to-open room that switches sheet/dialog across 768px).

## 3D home embedded on the homepage — BUILT

The standalone 3D home (`Home 3D.dc.html` + `home3d/engine.js`, three.js) is
now embedded in the app homepage as a live, navigable layer, not a preview.

### Presentation per breakpoint

- **Desktop and tablet:** the 3D renders as a **full-page background layer**
  behind the whole shell (`renderShell` mounts the iframe at z 0; rail, topbar
  and title go transparent above it, like the Map page). Widgets/cards sit in
  the left column (440px), the home fills the space to the right. Camera uses
  `shift=0.15` + `zoom=0.52` query params so the home centers in the free area.
- **Mobile:** inline slot (240px tall) in the page flow, full-bleed width, with
  the canvas overhanging 140px up (behind the big title) and 200px down (behind
  the cards scrolling over it). No card, no mask on any breakpoint.
- The horizon in embed mode (`?embed=1`) is a small radial wash that fades into
  `--color-bg` (engine `ambient` option); no sun-path arc, no tweaks column, no
  in-3D status pill or floor chrome.

### Embed protocol (postMessage, both directions)

- 3D -> app: `home3d:floor` (floor tapped -> `/home/floor/:id`), `home3d:area`
  (area tapped -> `/home/area/:id`), `home3d:home` (tap outside -> back), and
  `home3d:ready` (handshake on load).
- App -> 3D: `home3d:focus {floor, area}` on route change (drill in / zoom out;
  `_applyingFocus` guard stops echo loops), `home3d:state` (live entity mirror:
  per-light on/off, per-area lights/temp/humidity/climate action, so the 3D
  never shows stale state), and `home3d:pointer` (forwarded pointer stream).
- **Pointer forwarding:** on desktop/tablet the shell overlay forwards
  down/move/up events that land on bare background (`home3dPointer`; anything
  with its own background, buttons, links, etc. is ignored) and replays them as
  synthetic PointerEvents on the engine canvas, so hover lift, taps and
  drag-to-orbit work through the page.

### Navigation model

- Tap floor -> floor subview (all areas + entities), camera drills in; the 3D
  stays mounted across overview/floor/area, so its animation is continuous.
- Tap area (room or outdoor) -> area subview, camera zooms tighter on that room
  (`focusArea` in the engine: room bbox -> camera target).
- Back (topbar) and tap-outside both step **area -> floor -> home**, one level
  at a time. Back button + title live in the app topbar (`forceTopbarTitle`
  untouched; the 3D shows no title/back of its own when embedded).
- Widgets <-> cards crossfade (`homeContentTransition`: old column fades
  up-and-out, new slides in 100ms delayed, area blocks stagger 60ms) timed to
  the 850ms camera move.

### Engine additions (`home3d/engine.js`)

- Options: `ambient` (embed horizon wash), `zoom` (radius multiplier), `shiftX`
  (screen-space horizontal offset via `setViewOffset`).
- `focusArea(areaId)`, `tapAt(x, y)`, area-aware `focusFloor`/`backHome`
  (reframe when leaving an area zoom).
- `fitRadius` now scales with viewport aspect: wide screens pull the camera in
  so the home grows with the window instead of shrinking; refit on resize.

### Layout notes

- `floorplanPlaceholder(bp)`: desktop/tablet renders an empty spacer (the real
  canvas is the shell layer); mobile renders the inline overhanging iframe.
- `cardGrid` on all breakpoints is now `auto-fill, minmax(0.75 * deskMin)` so
  two cards share the narrow 440px column next to the 3D.
- Area headings on floor subviews use the big (`text-2xl`) `sectionLink`.
- Floor/area subviews drop the Recent activity + Automations widget cards
  (`areaBody(..., { noWidgets: true })`); they remain on nothing else — if an
  area detail needs them back, pass no opts.

Reference implementations: `renderShell` (background layer + pointer overlay),
`floorplanPlaceholder`, `homeContentTransition`, `syncHome3d` /
`pushHome3dState` (app side); `Home 3D.dc.html` logic class `_onMsg` /
`onViewChange` / `onAreaPick` (embed side); `home3d/engine.js` (camera).
