# Home Assistant for the whole household, build plan

The shared reference for every session. Keep it updated as the build progresses.

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
- **Clicking the logo** (rail/topbar HA mark) should go to that **personal
  landing page** (the user's chosen entry), not hard-wired to `/home`. Not yet
  built; documented here as the intended behavior.

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
