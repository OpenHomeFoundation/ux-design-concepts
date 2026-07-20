# Bookmark bar plan

The shared reference for every session. Keep it updated as the build progresses.

## Merged account + more into one "menu button" — PLAN (opened 2026-07-20)

Collapse the two separate navigation affordances, the **More** entry and the
**account avatar**, into ONE control (the avatar blended with a hamburger glyph)
that opens a single settings-style menu. Reviewer: Matthias. Copy rule reminder:
"and", never "&".

### The control (the merged icon)

One button, an **avatar + hamburger** blend (ProfileAvatar squircle as the base
so it still reads as "you", with hamburger lines integrated, e.g. a small
hamburger badge on the squircle, or three lines beside/under it). Icon treatment
is an open decision (see below); the base stays the persona avatar.

Placement:
- **Desktop:** bottom-left of the rail. Replaces `avatarButton` at the foot of
  `renderRail`. The trailing bordered **More** button inside `bmRailBody` is
  removed (its job moves to this control).
- **Mobile:** the **last item in the tabbar**. Replaces the fixed `more` slot in
  `renderFrame`'s `navItems` (and the `BookmarkNav` `moreId="more"` wiring).

### The menu it opens

Rendered in the **settings visual style**, the iOS-style colored icon-tile rows
(`colorTile` + `settingsMobileBody` pattern), NOT the current flat `moreBody`
grid. Contents, top to bottom:

1. **User row** (topmost): avatar + name + a secondary text line (role, or a
   line like "Manage your account"). Tapping opens the account page.
2. **Explore** row (directly above the rest of the list): opens `/explore`
   (`exploreBody`, the existing resident-facing discovery canvas).
3. **The rest:** every current More destination, from `moreDirectory()`, as
   colored tile rows.

So `moreDirectory()` stays the source of the list; the menu prepends the user
row and Explore, and restyles the rows as settings tiles.

### Behavior

- **Desktop:** the button **toggles** the menu open/closed (a `state` flag in
  the `state.menu` family, e.g. `navMenu`), shown as a panel by the rail. It does
  not itself navigate, it shows/hides. **Explore is the default page** shown for
  this area (when you first enter it / when nothing else is selected the content
  behind is `/explore`).
- **Mobile:** tapping **lands on the menu** (a full page, like today's `/more`),
  no default page, the user picks from the list. Explore is simply the top list
  item there.
- **Bookmarks are independent.** Clicking a bookmark navigates directly and does
  NOT open or close the menu. On desktop the menu's shown/hidden state **persists
  across bookmark navigation** (open stays open, hidden stays hidden).

### Menu destinations show their sub-items ON the page

Pages reached from the menu render their submenu items **in the page body**, not
in a left sidebar rail. Concretely, **My account** shows **My profile,
Security, Appearance, Language and region, App settings** (today's
`personalSettingsNav` + My profile) on the page instead of the
`personalSubmenu` / `railCards` left rail used by `settingsPage`'s `isPersonal`
path. This generalizes to other menu destinations that currently use a left
submenu rail.

### Topbar back button

The topbar shows a **back button whenever there is a back target**. A page
reached from the menu gets a back arrow (extends the existing `_prevRoute` /
`page.onBack` logic; today's `/more` back-arrow rule generalizes to the menu).

### Resolved decisions (2026-07-20)

- **Icon treatment:** three **hamburger lines to the LEFT of the avatar
  squircle** (per Matthias's reference: stacked lines, then the squircle mark).
  Not a badge, not lines-below. Base stays the user's avatar.
- **Desktop menu presentation:** **docked panel that pushes** the page content
  over (not a floating overlay). This is why the open/hidden state persists, the
  layout simply keeps the panel column present or absent.
- **Picking a menu item keeps the panel open.** Selecting a destination navigates
  the content area behind the still-open panel. (The panel only closes when the
  user toggles the button.)
- **Persona variance is moot, see scope below.** Family, roles, and the three
  spaces have been removed from this concept copy, there is one user, so the
  account/user row is uniform. No divergent maintainer/resident nav.

### Scope of this copy: single user, no spaces/roles/family

This is a **copy of the big concept, trimmed to work on navigation only**.
Family, roles (maintainer/resident/non-resident), and the three spaces
(shared/personal/admin) are **removed**. What that means for the nav plan:

**Keep**
- The merged **menu button** (hamburger + avatar), desktop bottom-left, mobile
  last tabbar item.
- `moreDirectory()` as the menu's list source.
- **Explore** as the top list item and the desktop default page.
- **User row** at the top of the menu, but its secondary line is no longer a
  role, use a neutral line (home name, account email, or "Manage your account").
- Bookmarks navigating independently; sub-items rendered on the page; topbar
  back button.
- The **avatar** itself (single user) as the icon base.

**Remove / simplify**
- **PersonaSwitcher / family switching** entirely, there is no one to switch to.
- **Space-based gating** in the nav: the `persona.spaces.includes("personal")`
  and `...("admin")` conditionals (account-menu rows, settings visibility,
  search-hit filtering). Everything is simply visible to the one user.
- **Space accent coloring** (green/blue/purple left-borders and tints) on
  bookmarks, rail, and menu rows.
- **Role secondary text** anywhere in the account/user surfaces (replaced per
  above).
- Any **maintainer-vs-resident divergent** navigation branches.
- Explore's "shared-space / resident-facing" **framing** collapses, it is just
  the home/discovery page now (the page can stay; drop the space language).

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

## Navigation model

Dock (up to 6 bookmarks + trailing More), bottom bar on mobile / left rail on
tablet+desktop, same thing rotated. More is a full page grouping all
destinations by space with `--color-space-*` accents. Desktop adds a right
contextual "For you" / Activity+Automations panel.

**Bookmarks are per-user favourite shortcuts, not pages.** Key rules:
- Bookmarks are **not destinations** and **never appear on the More page**. The
  More page lists the real directory of destinations (filtered by space); the
  bookmark dock is a separate, personal shortcut bar.
- **The "Manage bookmarks" Other list only offers pages reachable from More.**
  `bmManageCandidates()` intersects `directoryFor(persona)` with the routes in
  `moreDirectory()` (the actual More page), so a page that is not on More can
  never be offered as a bookmark. If you add a page to `directory`/`directoryFor`
  but not to `moreDirectory()`, it will NOT appear as a bookmark candidate (by
  design). Keep the two in sync when a page should be both reachable and
  bookmarkable. (User dashboards are exempt: they resolve via `d:` ids.)
- A bookmark is a **favourite page, which may be a subpage** (e.g. "Front door"
  points at the hallway area `/home/area/hallway`, not a top-level section).
- Each persona gets a sensible **default** bookmark set on first load, but every
  user can customise their own (add, remove, reorder).
- Implementation: subpage shortcuts that are not More destinations live in
  `bookmarkExtras` in `household.js`; `bookmarksFor(persona, ids)` resolves an id
  list (defaults to `persona.bookmarks`) via `bookmarkResolve(persona, id)`,
  which understands three id shapes: a `directory` id, an `area:<areaId>` (label
  + icon inherited from the area, route `/home/area/<id>`), and a `bookmarkExtras`
  id. No longer capped (the rail scrolls).

### Saving and editing bookmarks (built 2026-07-15)
- **Scope:** top-level sections and areas only (not individual devices). Labels
  and icons are always **inherited** from the destination.
- **Add / remove entry points:**
  - **More page star:** every directory row carries a bookmark **star**
    (`star` / `star-outline`); tap toggles `toggleBookmark(id)`. Works on every
    breakpoint. Dashboards (`d:` rows) get no star.
  - **Desktop/tablet rail (Apple-Dock model):** favourites are pointer-draggable
    with the **same mechanism as the home widgets** (`bmRailDown/Move/Over/Up`
    mirroring `fyPointer*`/`fyDragOver` 1:1): pointer capture on press, a keyed
    element map (`_bmCardEls`, id -> el), the picked icon lifts (scale 1.1 +
    shadow, transform set imperatively so React never clobbers it) and follows
    the cursor, the other favourites **glide** into place via FLIP
    (`_bmFlipRects` in `componentDidUpdate`), and the dragged icon is rebased in
    the `setState` callback so it stays under the cursor after each reorder.
    Drag an item **off** the rail (past its left/right edge) to remove it on
    release (turns red while off-rail); the rail `overflow` is opened during the
    drag (`bmRailSetClip`) so the lifted icon isn't clipped.
  - **Item states are CSS-driven** (`.cc-rail-btn` in the helmet `<style>`, not
    imperative, so hover can never get stuck): rest = tertiary icon, transparent;
    **hover = gentle `--color-surface-raised` fill**; **active = white
    (`--color-text-primary`) icon, no background box**. Buttons carry
    `outline: none` (no focus ring). The logo is a plain inline-styled button
    (the DS `.ha-bnav` styles only inject when a `BookmarkNav` mounts, which no
    longer happens on desktop, so relying on that class boxed the logo).
  - **Recent items:** rendered identically to favourites, under a short hairline
    separator; up to 3 recently opened destinations not already bookmarked; drag
    one up into the set to keep it (inserted at the drop index on release). The
    one currently open shows at the top and is marked active.
- **Reorder / remove elsewhere:** a **Manage bookmarks** overlay (bottom sheet on
  mobile via `overlayFrame`, centered dialog on desktop) reached from **My
  account -> Appearance** (`bookmarksSection`, account scope only). Drag handle
  reorders (`bmSheetDown/Move/Up`, pointer-based so touch works), X removes. The
  section also carries a **Reset to defaults** button (`resetBookmarks`, clears
  the `cc-bm-<persona>` override), disabled when already on defaults.
- **Rail layout:** logo + search pinned on top, favourites + recents scroll in
  the middle, **More + account avatar pinned at the bottom** so the four fixed
  affordances never scroll away even when favourites overflow. The DS
  `BookmarkNav` is now used **only** for the mobile tabbar (first 3 favourites +
  Search + More); the desktop/tablet rail is the custom `renderRail` nav.
- **Removal is instant** (no confirmation); re-add from the More page.
- **Persistence:** `bmOrder` (id list, `null` = persona default) in
  `localStorage` `cc-bm-<persona>` (survives reload); recents in **`sessionStorage`**
  `cc-recent-<persona>` (so they **start empty each session**). Both restored on
  persona switch and wiped by Reset demo data (cc-* sweep).
- **Recents behaviour (`recordRecent` / `recentBookmarkItems`):** recorded on
  every navigation (`go` + hashchange). `routeToBookmarkId` maps a route to a
  bookmark id (top-level directory route or `/home/area/:id`). Account pages
  (`/my/*`) are **never** recorded (the account avatar already lives in the
  rail). A page already in the visible set keeps its slot (no reshuffle while you
  bounce between visible recents); opening anything else moves it to the top and
  pushes the oldest out (list capped at 6, 3 shown).
- **Note:** the forced "always show Map in the rail" hack was removed, so the
  rail is now fully user-controlled; Map stays reachable from the More page.
- **Drag gaps both directions (built 2026-07-16):** the recents tail now opens a
  44px drop gap whichever way you drag. Dragging a **favourite down** past the
  last one into the recents zone slides the whole tail (hairline + recents +
  More) down and lands the fav at the end (`bmFavGap` state, `bmRailOverEnd`
  forces the dragged id to the end, `bmApplyOrder` factored out of `bmRailOver`
  for the shared FLIP/rebase); dragging a **recent up** into the favourites
  pushes the favs down as before, and the tail (hairline included) shifts too.
  Single `tailShift` drives all of it; the dragged recent is excluded so it
  follows the cursor.
- **Recent stays recent unless dropped in the favourites (built 2026-07-16):** a
  recent only becomes a bookmark when the cursor is inside the favourites region
  (above the last fav's bottom edge, where a gap actually opened); dropped back
  among the recents it stays a recent. `bmRailMove` gates both the gap preview
  and `bmRailUp`'s `addBookmark` on `inFavs`.
- **Recents count:** trimmed from 3 to **2** shown (`recentBookmarkItems(2)` in
  both `bmRailBody` and `recordRecent`).
- **Rail label tooltip (built 2026-07-16):** hovering a rail icon shows its label
  to the **right** of the icon (`railTipEnter/Leave`, `state.railTip`), portaled
  to `document.body` via `renderRailTip` so it escapes the rail's `overflow`
  clip. No delay. Styled to match the flow-toolbar tip (`flowTip`): `4px 8px`
  padding, `--weight-medium`, `--color-text-primary` on `--color-bg`, small drop
  shadow. When a favourite is dragged **off to remove**, the same tip shows the
  word **"Remove"** in the error color (`danger` flag) beside the icon.
- **Dragged icon keeps its color (built 2026-07-16):** on lift, the icon's
  resting color is captured and pinned with `setProperty("color", …,
  "important")` so React's per-drag re-render (`style.color: fg`) can't flip it
  to the active white; only the remove zone recolors it to `--color-error`.
  Cleared with `removeProperty("color")` in `bmRailResetEl`.
- **Rail is now mirrored into `index.html`** (the standalone build copy, synced
  2026-07-16 by copying the current `.dc.html` verbatim); the source of truth
  remains the `.dc.html`.

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
