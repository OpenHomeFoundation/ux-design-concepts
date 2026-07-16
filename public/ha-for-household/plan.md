# Home Assistant for the whole household, build plan

The shared reference for every session. Keep it updated as the build progresses.

## Coercive-control-resistant design — PLAN (opened 2026-07-13)

Source: the "Coercive Control Resistant Design" checklist (Nuttall & Nash, IBM),
referenced in Annika's review doc "Review HA for the whole household". Five
principles; we treat **1 (gaslighting)** and **2 (privacy & choice)** as concrete
build work and **3 security / 4 technical ability / 5 diversity** as standing
guardrails (recorded at the bottom of this section). Reviewers: Annika, Matthias,
Niels. Copy rule reminder: "history", not "audit trail", in UI; "and" never "&".

### Principle 1: Combatting gaslighting

Status: items 2-4 BUILT 2026-07-13 (automation read-view edit history; zone +
device edit history; new-user-access notice + toggle on Explore; Notifications
card extended to scenes/scripts, integrations, voice assistants). Item 1 held,
item 5 already-covered.

Checklist items -> where each lands in the concept:

1. **Do not let one user rewrite truth/history.** Already honoured: the activity
   log is immutable and edit history is versioned (never edited in place). No
   build; hold the line (never add an "edit log entry" affordance anywhere).

2. **Clearly show when records/settings changed (who/what/when).**
   - **Automations read view** [TASK]: the edit history already exists
     (`flowVersionRows` / `flowVersionHistory`) but only shows in the *edit*
     panel. Surface it in the **read** panel (`flowGenericPanel`) as a read-only
     "Edit history" card, mirroring the dashboard read panel
     (`dashHistory` -> `histCard` via `detailCardShell("history", …, "Edit
     history", …)`). Scenes/scripts share the flow pages, so they inherit it.
   - **Zones** [TASK]: zones are editable (`zoneEditView`, name/shape/location/
     icon/color) but keep no history. Add a `history` array to zone records and
     an "Edit history" card in `zoneDetailView`.
   - **Devices** [TASK]: device settings (rename, area reassignment, options)
     keep no history. Add a `history` array to device records and an "Edit
     history" card in the device detail. This is the "extend to devices and
     zones … and basically everything that can be modified" from Annika [c].
   - Model: reuse the dashboard/flow shape `{ by, change, time }`, newest first,
     rendered through `detailCardShell` for visual consistency across object
     types.

3. **Notify existing users when a new user gains access** [TASK]. Home is the
   **Explore** page (resident-facing). When a person is added to the home or
   granted access to a space, write a notice shown on Explore, and add a
   per-user **notification toggle** on that page to control it. (Ties to
   principle 2's "know who can view their data / who is informed".)

4. **Notify users of actions/changes to shared services** [TASK]. Mechanism is
   the existing **Notifications card** (automations + dashboards; zones already
   have `zoneNotifyForm`). Extend the same card pattern to the remaining shared
   objects whose changes affect others: **scenes/scripts**, **shared
   integrations/services**, **voice assistants**. Rule: any shared object gets a
   Notifications card.

5. **Remote control provides notification + local override** [ALREADY COVERED].
   Home Assistant already exposes this through the entity's **activity and
   history** data, shown on the entity: you can see who controlled what (person
   vs automation vs remote actor), and a person present can always operate the
   entity directly. Provenance + override + log therefore exist today; no new
   build. Keep surfacing the who-controlled-what attribution on entities.

### Principle 2: Privacy & choice

Current surfaces: **My data** page (`myDataBody`) lists each data type (Presence,
Health, Calendar, Voice) with a Shared / Private / Ask-each-time access chip;
each detail (`myDataDetailBody`) offers those three choices + a "How it's used"
line. Presence has its own page (per-person visibility everyone / home-away /
private / off, plus location source). Voice has a keep-history toggle + delete.
Shield notice already: "You decide what the home keeps about you, and who can
see it." Defaults live in `personalData[].access`.

Checklist items -> where each lands:

1. **Informed and intentional choices** [TASK]. The 3-way access choice + "How
   it's used" mostly covers this; strengthen with a plain "what this means for
   others" line per choice so the impact of each option is explicit.

2. **Know who can view your data and who is informed of your actions** [TASK].
   Access is coarse today (Shared/Private/Ask). Add a concrete **"who can see
   this"** surface per data type, listing the **actual people by name and
   avatar** (reuse `ProfileAvatar`), plus **"who is notified of your actions."**
   Single who-can-see surface. Ties to Principle 1 item 3 (new-user-access
   notice).

3. **Regular privacy notifications** [TASK]. Add a **privacy check-in** as a
   **notification option on the My account -> Notifications** page (a toggle the
   user controls), prompting a periodic review of their data settings. Lives
   with the other notification options, not a forced interruption. **Cadence:
   monthly, on by default** (frequent enough to stay meaningful, infrequent
   enough to avoid notification fatigue; a check-in people reflexively dismiss
   defeats the purpose). Toggle offers on (monthly) / off.

4. **Amend settings clearly and easily** [BUILT]. My data is reachable and
   editable. Nothing to do.

5. **Assess the most appropriate defaults** [DECISION + onboarding TASK].
   Default is **privacy-protective**: location limited/off, health private,
   voice-keep off, calendar shared. AND we **onboard the user and ask them
   explicitly** what they want rather than silently applying defaults, so the
   choice is intentional (checklist item 1). Defaults are the safe starting
   point the onboarding presents. **Onboarding flow to be built later**; recorded
   here so the defaults + explicit-ask decision isn't lost.

### Principles 3 to 5 (guardrails)

- **3 Security & data** — guardrail: threat-model the malevolent *authenticated*
  user (the maintainer/resident power imbalance is the whole frame). Design
  principle to hold, not a screen.
- **4 Technical ability** — guardrail: usable without "tinkering", accessible
  language, approachable to non-maintainers. Validates the comment/suggestion
  direction. Standing principle.
- **5 Diversity** — guardrail: diverse users, unhappy paths, edge cases. A
  research/QA principle, not a screen.

Overarching warning from the deck: do not design the product into a "saviour"
role.

## Review doc follow-ups (beyond the CC checklist) — PLAN (opened 2026-07-13)

Other feedback from Annika's review doc that sits outside the five CC principles.
Grounded in the foundational vision (OpenHomeFoundation/ux-design discussion #40,
"Home Assistant for the whole household") and its cited research.

1. **Upcoming automations for residents** [OPEN TASK]. Review [v]-[z]: residents
   want to anticipate what the home is about to do, not only see it in
   retrospect. A time-wise list of automations about to run ("Sunset lights, in
   5 min", "Goodnight, at 22:30"). Known hard part (agreed in the thread):
   triggers are not only time-based (events too), so the list can't claim to be
   the full picture, frame honestly as "scheduled next", not "everything that
   will happen". Where it lives (Explore? a home widget? the automations
   overview?) is still to decide. Ties to #40's "awareness of presence" +
   haunted-house-syndrome framing.

2. **Who can pause an automation** [DECISION TAKEN]. Everyone in the household
   can **pause** an automation, even without edit rights, and the pause is
   **tracked** (who paused it, when, shown in history/activity). Matches #40's
   "residents should always be able to step in and override... even if they
   can't edit". The self-resuming pause is already built; implementation work is
   to (a) ungate the pause control for all household members (not just editors)
   and (b) write a history/activity entry attributing the pause. Distinct from
   Delete/disable-permanently, which stays maintainer-only.

3. **Maintainer notified of pending suggestions** [COVERED]. Handled by the
   Explore page + notification plan (CC Principle 1 item 3 / Principle 2 item 2).
   No separate work; the "suggestions are hidden" concern [g]/[h] is answered by
   surfacing them on Explore with a notification option.

4. **Comment / note feature (resident to maintainer)** [TASK, surfaces TBD]. The
   lightweight "something felt wrong" / "please change this" note that replaces
   the WhatsApp back-and-forth (review [i]-[s], #40 "Reporting and feedback";
   research: Schulz 2022, "communication features that allow cohabitants to
   comment... notes or hints for specific devices or features"). The seed already
   exists as the **zone-suggestion review note** (`reviewNote`). Extend the same
   note affordance to more surfaces, candidates to choose from:
   - **Automations** (comment on / flag an existing automation, the biggest
     review thread).
   - **Devices / entities** (a "something felt wrong" note in more-info, #40's
     "a button that says something felt wrong").
   - **Areas / rooms**.
   - **Dashboards**.
   Notes collect for the maintainer on the **Explore page** (that IS the
   maintainer inbox, no separate inbox surface). **No chat box**: a note is a
   one-shot flag/suggestion (like the zone review note), optionally paired with
   the existing "suggest an automation" flow, not a back-and-forth conversation.
   Decision needed: which surfaces first.

5. **Rename "scoped access" to "custom access"** [TASK]. Review [aa]: "scoped" is
   unclear and "limited/restricted" reads negative. Decision: use **"Custom
   access"** in UI copy. Touches `scopedBanner` and any resident/non-resident
   access wording (the persona-level `scoped` data key can stay; this is copy
   only). Sentence case, and "and" not "&" per the copy rules.

6. **Maintainer is also a resident (double role)** [EXPLORE]. Review "About the
   maintainer": the person is both using the home and maintaining it, and seeing
   maintenance concerns while off-duty is stressful. #40 defines the maintainer
   role as covering **both** the household member who administers it **and a
   hired professional who is not a household member**. So the architecture should
   not assume maintainer == resident. Explore: a way to separate/relax the
   maintenance view from the resident view (a mode, a surfaced-only-when-needed
   maintenance area, or similar), and handle the paid-non-resident maintainer.
   Direction to explore, not yet a spec.

7. **Edit-mode visual distinction** [OPEN TASK]. Review final note: make it
   visually obvious when a screen is in editing. Options: colorful "+" buttons, a
   distinct edit-mode color scheme / chrome, stronger contrast on editable
   regions. Applies across the app's shared view/edit pattern (Services, Tags,
   Voice, Dashboards, Entities, flow edit). Needs a consistent treatment rather
   than per-page one-offs.

## Automation flow pages (detail + edit) — BUILT (last touched 2026-07-09)

Replaces `routineDetail` for automations and scripts (scenes keep the old page)
and the `editBody` placeholder for both.

**Decisions (agreed with user):**
- Auto-laid-out flowchart with branches (option C). Vertical spine: When
  (triggers) -> And if (conditions) -> Then (steps). Choose splits into equal
  branch columns and rejoins (hairline connectors, `--color-border`). Multiple
  triggers sit side by side and converge. Mobile: branches and triggers stack
  vertically as indented groups.
- One page: read-only flow, Edit button switches the same page to edit mode
  (URL stays `/automations/edit/:id` for the mode, back = detail).
- Node click -> inspector, styled like the Map overlay: desktop = floating
  380px surface panel top-right, shadow, no scrim, X top-left; mobile =
  dismissible bottom sheet (scrim, X, single max detent) via `renderSheet`.
- Plain-language labels (matches HA 2026.7 purpose-specific direction), mono
  entity IDs as secondary detail in the inspector.
- Read view traces: selectable run history ("Recent runs"), path highlight of
  the selected run (taken path accent, skipped dimmed), per-step results and
  timing badges on nodes, outcome + trigger attribution per run, one failed
  run in demo data (away-lock: annex lock did not respond).
- Edit view: live condition met indicators (green/red), target counts on
  action nodes, Test run button that plays a simulated trace through the flow,
  notes on steps. Realistic forms in the inspector; edits live in a session
  draft only (never persisted to household.js).
- Household angle kept: creator, who can edit, People and access section stay
  on the detail page.

**Rework 2026-07-08 (canvas):** flow pages are now a full-bleed canvas (like the
Map page), modelled on Homey Advanced Flow / the C.A.F.E. HA integration:
left-to-right auto-layout, cards joined by bezier connectors with arrowheads,
pan (drag / wheel), zoom (ctrl+wheel, pinch, corner controls, fit), dot grid.
Topbar keeps the small title (`isFlowCanvasRoute` in `forceTopbarTitle`,
full-height body in `renderMain`). The overlay is the map-style panel (desktop
top-right 380px; mobile a persistent detent sheet id "flow"): with no card
selected it shows the automation (read: status toggle, description, recent
runs, details, access; edit: name/description/category/area draft fields plus
add-to-flow actions); selecting a card swaps it to the node inspector with a
close X. Branch labels are pills on the edges; edit mode adds insertion pluses
on edges and dashed ghost "Add" cards.

**Implementation map:**
- `household.js`: `flow` (triggers/conditions/steps, choose branches, wait) and
  `runs` (when, trigger, outcome, stopAt, branches, details, duration) on
  automations and scripts.
- DC: `flowDetail` (page), `flowGraph` (renderer), `fgBranchRow` (equal-column
  split/join, horizontal line inset `calc(100%/(2n))`), `flowInspector`
  (read/edit panel), `flowRunPath(flow, run)` (nodeId -> status/detail),
  test-run animation via timer state. Sheet id `flownode` in `dismissSheet`.

**Rework 2026-07-08 (add UX: toolbar + block library, replaces the add dialog):**
Typed blocks first: every flow node carries a `block` type name (HA 2025.11
dialog taxonomy) in `household.js`; node cards and inspector titles show the
TYPE ("Time", "Light turn on", "Wait"), the plain-language summary is the card
subline and the "Summary" field in edit. Catalog in `flowBlockCatalog(zone)`
(trigger / condition / action / blocks), insertion via `flowInsert(key, pos,
blk)`, in-place type change via `flowChangeType` (id and note kept).

Desktop/tablet edit mode gets a FigJam-style chrome instead of a dialog:
- **Flyout menu** (`flowMenuEl`, state `flowMenu`, `openFlowMenu(key, {zone,
  pos, retype}, ev)`): anchored popover on `--color-overlay`, category headers
  + block rows, transparent backdrop, Escape closes. Also opened by the
  in-canvas plus buttons and ghost cards (anchored at the click, exact
  position) and by "Change type" in the inspector (replace in place).
- **Top-left "Blocks" library card** (`flowLibPanel`, mirrors the top-right
  inspector): the primary add surface. Sections: **Suggested** (curated per
  kind), **In this home** (place path: per-area purpose blocks derived from
  `household.entities` with honest counts and prefilled targets,
  `flowLibHomeItems`), then Triggers / Conditions / Actions / Building blocks
  (collapsed by default). One search across all of it (matches area names
  too). Open by default in edit mode (`flowLib === undefined`); when closed a
  small floating "Blocks" pill top-left reopens it.
- **Bottom-center floating toolbar** (`flowToolbar`): Select, divider, zone
  colored add buttons (Trigger amber, Condition blue, Action green, Building
  block purple) each opening an upward flyout, divider, library toggle, Test
  run. Scripts hide Trigger/Condition.
- Insert position (`flowDefaultPos`): triggers/conditions append to their
  lane; steps insert after the selected card, else at the flow's end.
- Mobile keeps the drill-in sheet picker (`flowAddBody` in the flow sheet);
  `flowAddDialog` is now the mobile-era fallback only.

**Rework 2026-07-09 (path affordances + inspector + chrome polish):**
- **Add path** is no longer a floating round `+` mimicking the step-adders. It
  now renders as the next branch column: a ghost `+` at the far right of a
  choose node's branch row, tethered by a **dashed connector that leaves the
  node's right side, runs across the top, and drops down to the `+`** (the
  `side: true` edge in the edge renderer routes horizontal-then-down so it never
  crosses the solid branch lines). Same treatment for the end-of-path
  **Add step** ghost (dashed connector from the last card down to its mini `+`).
- Clicking Add path opens the normal conditions-and-actions picker
  (`openFlowMenu(..., { mixed: true, newBranchOf: node })`, mobile
  `openFlowAdd(..., { addPath })`). The path is **created only once a block is
  picked** via `flowCreatePath(chooseNode)` (called lazily inside the picker), so
  abandoning the picker leaves no empty path.
- **Choose node inspector** gained a **Paths** section: each path listed with a
  trash affordance (delete gated to keep at least one path), plus an **Add path**
  ghost button. No rename (paths take their label from their first condition via
  `flowBranchLabel`).
- **Branch label chips** on the canvas edges were removed (they duplicated the
  path label already shown on the card / inspector).
- **Deleting the last node of a path deletes the path** (`flowDelete`: when a
  removed node leaves a choose branch with no conditions and no steps, the branch
  is spliced out, keeping at least one).
- **Detail panel segments swapped**: **Activity** is now first and the default
  tab (`flowPanelTab || "activity"`); Overview second.
- **Edit page shows the automation title top-left** (large title in the flow
  header), live-updating from the draft Name field, matching the read view.

**Undo / redo (2026-07-10):** the bottom-center `flowToolbar` gained **Undo** and
**Redo** icon buttons (`undo-variant` / `redo-variant`) in the leftmost group,
immediately left of the Test-run (play) button, separated from it by a divider.
Session-only per flow key, no persistence, no keyboard shortcut yet. The
toolbar also shows on **mobile** now (bottom-center, when no sheet overlay is
covering it) but **without the add-block group** (Add trigger / condition /
action / building block / "add from home") — mobile keeps only undo/redo,
Test run, and the flow/YAML view toggle. Gated by `mobile` in `flowToolbar`
and `(!mobile || !overlay)` at the render sites.
- History lives in `_flowHist[key] = { undo: [], redo: [] }` (stacks of deep
  JSON clones of the draft), capped at 60 undo entries. `flowHistOf`,
  `flowSnapshot(key, sig)`, `flowUndo(key)`, `flowRedo(key)`, `flowCanUndo`,
  `flowCanRedo`.
- Every draft mutation snapshots the draft **before** mutating: `flowInsert`
  (new `noSnap` arg so the createPath sites don't double-snapshot),
  `flowChangeType`, `flowRemove`, both `pick` handlers' `flowCreatePath` paths
  (snapshot before creating the branch, pass `noSnap` to the following insert),
  and the inspector's inline edits (field values, `targets`, path splices).
- Field typing coalesces via a signature (`node.id + ":f" + i`) so a run of
  keystrokes on one field is a single undo step; structural ops and undo/redo
  reset the coalesce marker (`_flowCoalesce`).
- Undo/redo swap the stored `_flowDrafts[key]` object and `setState` to
  re-render; `flowDraftOf` returns the (replaced) stored draft. Buttons dim
  (`opts.disabled` added to the toolbar `btn` helper: tertiary color, 0.45
  opacity, no hover, no pointer) when their stack is empty.

**Delete / Duplicate buttons (2026-07-10):** in the edit panel Details footer,
the two record actions now sit **side by side in one row** (`flexDirection: row`,
`flex: 1` each) with shortened labels **"Delete"** / **"Duplicate"** (dropped the
"automation"/"script" singular). Delete is now a **solid `danger`** button (the
`cc-danger-soft` class was removed).

## Automation editor: Duplicate, Edit in YAML, Change mode, Delete — BUILT (2026-07-10)

All four record-level actions shipped: `duplicateRoutine` (content-copy) and
`deleteRoutine` (trash-can-outline, danger + `askConfirm`) in the overflow menu,
`flowToYaml`/`flowYamlBody` behind a Flow view / YAML view segmented control,
and `runMode`/`runModeRows` (Change mode: single / restart / queued / parallel,
plain-language labels). The plan below is the original agreed design.

The flow editor is missing four record-level actions that HA has: **Duplicate**,
**Edit in YAML**, **Change mode**, and (missing entirely from the editor)
**Delete**. This section is the agreed plan; nothing built yet.

### Where they live: one overflow menu (`⋮`)

Real HA groups exactly these in the editor's top-right kebab menu, so do the
same. Add a `⋮` round button to the flow page's `actionCtrls` cluster
(`flowDetail`, ~line 8823), shown in **both read and edit modes** for
automations and scripts, gated to edit rights (`canEditRoutine(a)` for
automations, `admin` for scripts). Residents never see it.

- **Desktop / tablet:** a portal popover on `--color-overlay`, reusing the
  existing overlay-menu pattern (`ccOverlaySelect` / `flowMenuEl`). New helper
  `routineMenuItem(icon, label, onClick, opt)` mirroring `dashMenuItem`
  (line 5200): icon + label, `danger` variant, scrim-tap + Escape to close.
- **Mobile:** the same items as a **dismissible bottom sheet** via `renderSheet`
  (per `docs/overlays.md`: X top-left, single max detent, scrim, no blur).
- New state key `state.routineMenu`; add it to the Escape handler (`_onKey`,
  ~line 688) and clear it in `_onHash`.

Menu order (automations): Duplicate · Edit in YAML · Change mode · (divider) ·
Delete (danger). Scripts: Duplicate · Edit in YAML · Delete. Scenes keep their
existing page, unaffected. (Rename is skipped: edit mode already renames via the
Details Name field.)

### 1. Duplicate — `duplicateRoutine(kind, a)`

Model on `duplicateDash` (5428) + `createRoutine` (4563).

- Deep-clone the record and its flow. New id `single + "-" + Date.now().toString(36)`;
  name `a.name + " (copy)"`; `creator`/`createdBy` = current persona; `added`/
  `modified` = now.
- Land the copy as an **unpublished draft** (`published:false`) so a duplicate
  never silently starts running before the user has looked at it (matches HA
  dropping you into the editor).
- Clone `this.H.flows[a.id]` → `this.H.flows[newId]`; `unshift` the record into
  `this.H[kind]`; navigate to `/<kind>/edit/<newId>`.
- Session-only, not persisted to `household.js` (same rule as existing drafts).

### 2. Edit in YAML — `flowToYaml(flow, meta)` + a YAML surface

- Small serializer renders the draft (alias, description, mode, triggers,
  conditions, steps) as HA-style YAML text. State `state.flowYaml = { key, text }`.
- Reuse the Files-page YAML editor styling (`filesViewer`, ~3422: mono textarea,
  view-first). Desktop = the flow `flowPanel` overlay swapped to a full-height
  YAML body (or a `fyScrim` dialog); mobile = full-height dismissible sheet.
- **Prototype scope / caveat:** a full YAML → node-graph parser is out of scope.
  Two honest options, **recommend (a)**:
  - (a) **View + copy**, read-only, with a note that YAML editing is where the
    real source of truth lives. Simple and doesn't imply a round-trip we don't
    do.
  - (b) Editable text; Save parses only the trivially-regexable bits (alias,
    description, mode) and stores the raw body, leaving the graph as-is with an
    "Edited in YAML" marker. More faithful to HA but the graph/YAML can drift.
- Confirm choice with user before building.

### 3. Change mode — add `mode` to the model

- Add optional `mode` to automation records in `household.js` (default
  `"single"`). Helpers: `autoMode(a)` → `a.mode || "single"`;
  `setAutoMode(a, m, max)` writes to a **session override** `state.autoMode[id]`
  (like `enabled` / `published`), so it works without editing `household.js`.
- Four modes, plain-language copy (sentence case, no dashes, "and" not "&"):
  - **Single** — "Run once. If it's already running, ignore new triggers." (default)
  - **Restart** — "Start again from the top each time it's triggered."
  - **Queued** — "Let runs line up and happen one after another."
  - **Parallel** — "Run several at the same time."
  - Queued / Parallel reveal a **Maximum** number field (default 10).
- Surface in two places, both writing the same state:
  - A titled control in the edit panel `flowGenericPanel` meta form (via
    `ccOverlaySelect`, per CLAUDE.md's overlay-select preference).
  - A "Change mode" item in the `⋮` menu opening a focused dialog / sheet: the
    four options as a radio list with descriptions + the Maximum field.
- Show current mode read-only in the read-view Details (`routineInfoRows`) for
  automations.

### 4. Delete — `deleteRoutine(kind, a)`

Model on `deleteDash` (5437).

- `askConfirm({ title: "Delete " + a.name + "?", body: "This removes the
  automation for everyone in the home. It can't be undone.", confirmLabel:
  "Delete", danger: true, onConfirm })`.
- onConfirm: splice from `this.H[kind]`; `delete this.H.flows[a.id]`; clear that
  id's session overrides (`enabled`, `published`, `autoPause`, `autoMode`,
  notifs); then `this.go("/" + kind)`.
- Available from the `⋮` menu in both read and edit modes; gated to edit rights.

### Housekeeping

- New state keys: `routineMenu`, `flowYaml`, `autoMode`. Wire into the Escape
  handler and the `_onHash` reset; add `autoMode` to the sign-out reset clear
  list (~line 874) next to `enabled` / `published`.

## Automation pause (self-resuming off) — BUILT (2026-07-10)

Research finding: residents want to **pause** automations, not disable them. A
plain on/off toggle models the wrong intent. People turn one off temporarily
(guests over, sleeping in, movie night, a party) and then forget, so the lights
never come on and they blame the automation. Reference pattern: Signal's "Mute
notifications" (duration presets that auto-expire), adapted to a shared home.

### The verb split (the core decision)

- **Pause** = the resident's temporary, self-resuming action. Picks a duration,
  the automation stops running, then **resumes on its own** when the timer ends.
  This is the default action for any non-admin persona and the primary path.
- **Off** = the maintainer's deliberate, indefinite disable (the true HA
  `enabled: false`). Stays off until someone turns it back on. Admin only as a
  distinct choice; residents reach the same end via "Pause until I turn it back
  on" (an indefinite pause, still framed as pause, not a config change).

So an automation now has **three states, not two**: `on` / `paused` (with an
`until` timestamp + who) / `off`. Note: with the merged Pause control (see the
detail-panel section below), **off is just "paused for an unlimited time"**
("voor onbepaalde tijd"), so the states collapse to `on` / `paused (until X | 
forever)` in the UI even though the data still distinguishes a real HA disable.

### Interaction (a toggle toggles; Pause is a separate button)

The toggle stays a **pure binary on/off**: one tap, immediate, no dialog, ever.
It maps to the true HA `enabled` state (on ↔ off). The duration behaviour is a
**separate Pause button/action**, never wired into the toggle.

- **Toggle** → flips on/off instantly. Off is the deliberate, indefinite
  disable. Resuming from paused/off is just toggling on. No chooser.
- **Pause button** (secondary, icon `pause`, label "Pause") → opens the duration
  chooser. Home-tuned presets rather than Signal's literal set:
  - Pause for 1 hour
  - Pause until this evening (8 hours)  ← "eight hours" reframed to the outcome
  - Pause until tomorrow
  - Pause for a week
  - Pause for an unlimited time ("voor onbepaalde tijd") ← this IS the old "off"
- While **paused**, the Pause button becomes **"Resume"** (icon `play`) and the
  automation carries a `Paused until 18:00` / `Paused until Fri` /
  `Paused, no end` chip. Tone and a mono time carry the state, per the copy
  rules; the chip uses the warning/attention treatment, never a new color.
- The toggle and the Pause button are **independent controls that sit side by
  side** on dense rows. But on the **automation detail panel** they are merged
  into one **Pause card** (below): the last radio option, "unlimited", replaces
  a separate off toggle, so there is one control, not a toggle plus a button.

### Honesty for a shared home (the wrinkle Signal doesn't have)

A shared automation paused by one person stops running **for everyone**. The
chooser states this plainly ("Paused automations don't run for anyone in the
home"), and every surface that shows a paused automation shows **who paused it
and until when** ("Paused by Daan until 18:00 today"), with a **Resume now**
action. This is the same "candid, acknowledge state honestly" voice used
elsewhere.

### Where you control it

- **Everywhere the toggle appears today, add a Pause/Resume button beside it**
  where there is room: routine list rows + cards (`routinesBody`
  renderRow/renderCard, line ~4568), routine detail header (`routineDetail`,
  line ~7048), flow detail header (line ~8454), the For-you `AutomationItem`
  widget (line ~10156), and the desktop panel automations list (line ~10196).
  On dense rows where a second control does not fit, the toggle stays and Pause
  lives in the row overflow menu / on the detail page only.
- **Automation detail page is home base.** The toggle + a Pause button sit
  together. When paused it shows a banner: "Paused by Daan until 18:00 today"
  with **Resume** and **Change duration** (reopens the chooser). This is the one
  place the full state + provenance always lives.
- The chooser is the **overlay engine** (bottom sheet `<768`, centered dialog
  `>=768`): a radio list of the presets + a confirm ("Pause") and cancel,
  matching the reference screenshot. Reuse `renderSheet` / `fyScrim`; it is a
  radio picker, not a bare `askConfirm` (which has no options).

### Data + wiring

- Replace the binary `state.enabled[id]` boolean with a status object:
  `state.autoStatus[id] = { mode: "on"|"paused"|"off", until: <ms|null>,
  by: <personId|null> }`. Migrate `isEnabled` / `setEnabled` (line 998) to read
  from it; add `pauseAuto(a, durationKey)`, `resumeAuto(a)`, `disableAuto(a)`
  and a `pauseStatus(a)` helper returning `{ mode, label, by, until }`.
- **Auto-resume in a prototype:** no real scheduler. Store the absolute `until`
  timestamp; a helper compares it against `Date.now()` on each render so an
  expired pause reports as `on` again. Optionally a single `setInterval` on the
  root to re-render as timers lapse. Preset durations resolve to real clock
  times so "until this evening" and "until tomorrow" snap to sensible hours
  (e.g. 18:00, next 07:00), shown as mono times.
- Persist per instance (demo state), keyed like the other `cc-*` state; never
  clear keys we don't own.
- Collection page: the existing "Group by status" (`groupOf` status, line 4550)
  gains a **Paused** group alongside On / Off; the status column/chip shows the
  resume time for paused rows.

### Scope / non-goals

- No real scheduling engine, no per-person pause (a shared automation pauses for
  the whole home; a personal-space automation pauses for its owner). Per-person
  scoping of shared automations is explicitly out of scope for this pass.
- Bulk enable/disable in the list toolbar (line 4186) keeps its plain
  enable/disable for now; a "Pause selected" bulk action is a follow-up.

### Verification

- The toggle flips on/off instantly with no dialog. A separate **Pause** button
  opens the chooser with the five presets; picking one closes it and the
  automation shows "Paused until X by <me>" (chip + banner) in the list, detail,
  and For-you widget, while the toggle itself is unaffected. The button reads
  **Resume** while paused and clears the pause in one tap. Correct on mobile
  (sheet), tablet + desktop (dialog).

## Automation detail panel: single map-style card stack — BUILT (2026-07-10)

Replace the automation read panel's **two-segment control** (Activity / Details,
`flowOverviewBody`, line ~8297) with **one scrolling panel** that mirrors the
**map person/zone detail** (the reference screenshot): a compact identity header
at the top, then a vertical stack of self-contained cards, then pinned actions
at the bottom. No segmented tabs. Everything visible at once, scroll to reach
more, exactly like the map.

### Reuse the map panel's card vocabulary (already built)

The map detail (`mapPersonPanel` / zone panel, lines ~9446 to ~9500) already
defines the exact look, so **reuse it, don't reinvent**:

- **Card** = `background: var(--color-surface-raised)`, `borderRadius:
  var(--radius-xl)`, `padding: var(--space-4) var(--space-4) var(--space-3)`,
  column flex. On desktop the panel wraps each card in `0 var(--space-3)`
  side padding; on mobile the cards go edge to edge.
- **Card header** = a **30x30 colored icon squircle** (`radius-md`, solid color
  bg, white MDI glyph) with the title directly under it (`--font-display`,
  `--text-base`, weight 700, `-0.01em`, `marginTop: var(--space-3)`).
- **`cardDivider()`** (1px `--color-border`, `space-3` margin) separates the
  body from a footer action.
- **`cardLink(label, onClick)`** = the accent footer link ("Show more", etc.).
- Panel root = `display:flex; flex-direction:column; gap: var(--space-3)`, a
  header block first, action `Button`s last. Extract a shared `detailCardShell(
  icoName, icoColor, title, body, footerLink)` from the map code so both use it.

### The identity header (top, above the cards)

Icon squircle (robot) + name + a one-line status subtitle, matching the map
header's "name / secondary" rhythm. Subtitle states the live state honestly:
"On, last ran 22 minutes ago" or "Paused until 18:00, by Daan" or "Paused, no
end". Back chevron stays where the flow header puts it.

### The cards (stacked, top to bottom)

1. **Activity** (icon `history`, accent blue, like the map). The recent-runs
   timeline (`flowRunRows`), each run **tappable to expand** its detail (same
   click-to-show interaction the map activity and the version list already use),
   then `cardDivider()` + **"Show more"** → the full run log (`/activity`
   filtered to this automation). This is the old "Activity" segment, now a card.

2. **Pause** (icon `pause`/`motion-pause`, warning/amber). **The merged
   toggle+pause control** (see the pause section above): a radio list of
   durations, the last being **"For an unlimited time" ("voor onbepaalde
   tijd")** which is the old off. Running = no option selected + a "Pause"
   affordance; paused = the chosen row selected with its resume time + a
   **"Resume now"** link in the footer. One control replaces the toggle-plus-
   button pair. Honest shared-home line under the title: "Paused automations
   don't run for anyone in the home."

3. **What it does** (icon `text-box-outline`, neutral). The plain-language
   summary from `flowSuggestDesc` ("When the sun sets, turn on the porch light,
   but only if someone is home"), plus the author's description if present. Gives
   a resident who can't read a flow a reason the automation exists.

### Other card ideas (proposed, pick what earns its place)

- **What it controls** (icon `tune` / `devices`): the devices, areas or scenes
  this automation touches (`a.affects`), each a row linking to that entity. "Do
  I dare pause this?" becomes answerable. Strong candidate.
- **Details** (icon `information-outline`): category, area, creator,
  added/modified, space, run count. The old "Details" segment as a card
  (`routineInfoRows`). Keep, but demote below the action-oriented cards.
- **Edit history** (icon `history` variant): who changed what, restore a
  version. Already built for edit mode (`flowVersionHistory`); could surface
  read-only here for maintainers, or stay in edit. Lower priority.
- **Notifications** (icon `bell`, red, straight from the screenshot): "Tell me
  when this runs / when it fails." Mirrors the map's Notifications card. Nice-to-
  have; only if we want per-automation alerts in scope.

Recommended default order: **Activity → Pause → What it does → What it controls
→ Details.** Notifications and Edit-history deferred unless you want them in.

### Read vs edit: same panel, two bodies (mirror the map zones)

Model automation read↔edit on the **map zone** read↔edit difference
(`zoneDetailView` vs `zoneEditView`), keeping **the existing pencil → Done
transition** (do NOT adopt the zone's back-chevron exit):

- **Enter with the pencil, leave with Done.** The current CTA slot and the
  `/automations/edit/:id` route already give exactly this; keep them. The pencil
  swaps the panel into edit; **Done** swaps it back to read. No new mode switch,
  no back-chevron-to-read.
- **The panel body swaps whole**, like the zones: read = the card stack above;
  edit = a **flat, section-labelled form** ("Edit automation") like
  `zoneEditView` (stacked labelled sections, no segmented tabs).
- **The flow canvas behind becomes the editable surface in edit** (drag nodes,
  add steps), static in read, exactly as a zone's shape turns draggable
  (`edit-zone`) only in its edit view.
- **Runtime cards drop out of edit.** Pause and Activity are runtime concerns,
  not configuration; edit shows only authored fields (name, description,
  category, area), the same way a zone's edit form shows only name / shape /
  icon / color.
- **Drop the edit segmented control** (`flowGenericPanel`'s Edit history /
  Details segments, line ~8477). Edit becomes one scrolling form. **Edit
  history** moves to a section at the bottom of that form (or a "View edit
  history" link), never a top-level tab competing with Details.
- Keep it feeling in place: the swap is body-only inside the same floating panel
  / sheet, so pencil → Done reads as the same panel changing state, not a jump.

### Wiring

- Rewrite `flowOverviewBody` to drop the `seg(...)` segmented control and return
  the header + the card stack (reusing the extracted `detailCardShell`). Delete
  the `flowPanelTab` state branch (activity vs overview) once merged.
- Desktop/tablet: renders inside the existing `flowPanel` overlay (map-style
  floating panel, already positioned). Mobile: inside the existing `renderSheet`
  flow sheet. Both already exist for this page (line ~8621), so only the panel
  **body** changes.
- **Edit body:** rework `flowGenericPanel`'s edit branch into the flat
  section-labelled form (no `eseg` segmented control); move the version list
  under a bottom "Edit history" section/link. Read and edit share the same
  panel container; only the body swaps on the pencil → Done boundary.

### Verification

- Open any automation: one scrolling panel, no tabs, identity header on top,
  cards stacked (Activity, Pause, What it does, ...), actions pinned at the
  bottom, visually matching the map person panel. Tapping a run expands it;
  "Show more" opens the run log. The Pause card's last option "for an unlimited
  time" turns it off; picking a duration shows the resume time and a "Resume
  now" link. Correct on mobile (sheet) and desktop/tablet (floating panel).

### As built (2026-07-10) — what shipped, and where it diverged from the plan

The read panel and pause work landed together; a few decisions changed during
review (all in `Home Assistant for the whole household.dc.html`):

- **Read panel = `flowOverviewBody`** rewritten as the map-style card stack.
  Shared card shell extracted as `detailCardShell(icoName, icoColor, title,
  body, footer, opts)` + `ccCardDivider()` (opts: `key`, `subtitle`,
  `trailing`). Sticky identity header (icon squircle + name + status subtitle);
  header title and all sub-step titles use `--text-lg` to match the map overlay.
  Card order: **What it does → Activity → Pause → Notifications → Details.**
  "What it controls" was built then removed on request. The Details card is a
  plain surface-raised card (no icon/title, rows non-linked).
- **Everything is an in-panel sub-step, not a segmented tab.** Activity "Show
  more" (`state.flowActivityFull`), Pause options (`state.flowPauseFull`), and
  Notifications "Add notification" (`state.flowNotifFull`) each swap the panel
  body to a back-arrow sub-step (`subStepBack(onBack, title)` helper). All three
  reset on navigation (added to `_onHash` + a dedicated reset) so returning to an
  automation always opens the main step.
- **Pause model** (`state.autoPause`, `pauseInfo/pauseAuto/resumeAuto/`
  `pauseUntilFor/pauseUntilLabel`, `isEnabled` now derived from pause). Off =
  unlimited pause. The Pause card shows a status only when paused (dot + "Paused
  until X" on the title row, trailing) and a link into the options sub-step; the
  sub-step is a radio list of durations (**no "On" option** — Signal-style) with
  a big "Resume now" button shown when paused.
- **Published (lifecycle) state** (`state.published`, `isPublished/`
  `setPublished`), separate from pause. The collection list's status toggle now
  means **Published vs Draft** (group labels, `statusLabel: "Published"` column
  header); drafts are hidden from non-admins (`routinesBody` filter) and shown as
  "Draft" in the detail header. A **Published** toggle was added to the edit
  Details form.
- **Notifications card** (`state.autoNotifs`, `autoNotifTypes/autoNotifs/`
  `toggleAutoNotif`): runs / fails / stays-paused, toggled in a sub-step.
- **Edit view keeps pencil -> Done and the two-segment control** (Details +
  Edit history, Details default and first). The version detail uses the date as
  its header (avatar removed) and a full-width borderless "Restore this version"
  button. "Suggest" icon is `star-four-points-outline` (matches the toolbar).
- **Run trace:** hovering an activity row previews its trace on the flow canvas
  (`state.flowRunHover`); clicking pins it (`flowRunSel`).

## Map detail panels: in-panel sub-steps — BUILT (2026-07-10)

The map person and zone detail panels (`mapPersonPanel` / `zoneDetailView`)
adopted the same in-panel sub-step pattern as the automation panel:

- **Activity "Show more"** opens an in-panel sub-step (`state.mapActivityFull`,
  keyed by person/zone id) with a back arrow, instead of navigating to
  `/activity`. Reset in `closeMapDetail` / `mapRowTap` / `_onHash`.
- **Add notification** on the person panel opens an in-panel sub-step (the old
  `addMenu` fixed overlay was dead code and is bypassed); the zone panel already
  drilled into `zoneNotifyForm`. Only the **"Notify me"** option remains (the
  "notify the other person" option was removed).
- **Notify form** (`mapNotifyForm` + zone equivalent): the Location group now
  lists **zones only** (no "my/their current location", no "New location"), and
  all choice rows use a **radio on the left** instead of a trailing check.
- **Notifications card dropped for the "Me" person**; sub-step content is wrapped
  in surface-raised cards for consistent spacing.

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
> 2. **Favoriting an entity in-app** — no star toggle; favorites are seeded per
>    persona in `household.js` only.
> 3. Smaller follow-ups:
>    - (DONE 2026-07-05) Settings -> Integrations listing device + service
>      integrations together. Built: see "Settings -> Integrations (the combined
>      connector layer)" near the end of this file.
>    - Wire the more-info body-tap into `featureTile` once (1) exists.
>    - (DONE 2026-07-05) Favorites For-you widget and single-entity light render
>      now use `featureTile`; the old `tile()` method is dead code, safe to remove.
>
> **Built since this index was last audited (2026-07-05):**
> - **Rebuilt tile card** — DONE, shipped as `featureTile(e, persona)` (NOT the
>   old `tile()`, which the earlier index grepped for and wrongly flagged as the
>   live tile). Per-domain controls are live and wired across the whole home
>   perspective (Lights, Climate, Security, Media, Energy, area detail): light
>   brightness slider, fan speed slider, switch toggle, media transport row,
>   climate radial gauge + target stepper + heat/cool badge, lock/unlock command
>   group, device-class icon tint + honest state. Remaining: the body-tap
>   more-info split (blocked on 1) and the two leftover `tile()` call sites above.
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
  `settingsNav`). Admin-gated like the rest of `/settings`.
- **Rebuilt (2026-07) as the plan editor, directly on the page** (no iframe,
  no separate Fit My Home page; `Fit My Home.dc.html` was deleted). The page
  is **full width** (settings `wrap` gained an `opt.fullWidth` that beats the
  narrow settings cap), two columns that wrap on mobile:
  - **Left, the floor list** (`fmhFloorList`): floors top-down with icon,
    name, Ground chip, area count, drag handle to restack, plus a draggable
    dashed **street level line**: floors under it are `belowGround`
    (apartment = drag it below every floor). Outside sits under the floors;
    Add floor at the bottom of the list (new floors land on top, default
    names Ground floor / First floor / ...).
  - **Right, the editable layout canvas**: SVG floor plan, drag rooms to
    move, dots to reshape (midpoint dot adds a corner, redundant corner
    removes itself), sizes in meters on every room + wall dims when selected,
    floor total (n areas, m^2) below. The floor beneath renders as a
    **dashed ghost** to align upper floors correctly. Above the canvas an
    inline floor header (Home-information style: Name FormField, Icon
    picker, Delete floor) — no floor subpage.
  - **Area subpage** (Cloud-settings pattern): tapping a selected room again
    sets `state.planArea`; the settings detail swaps to `planAreaBody`
    (Name, icon grid from `plan.js` AREA_ICONS, color swatches, size
    readout, Delete) with back arrow + Escape.
  - All `fmh*` methods live in the app's logic class; state in `state.fmh`.
    Saves go through `fmhSave` -> `plan.js` `savePlan` + `rebuildHome3d()`
    directly (same-document saves fire no storage event); the storage
    listener still refreshes editor + 3D on cross-tab edits.
  - Dropped from the old experiment: create-methods screen, 3D preview
    button, home size slider, reset/start-over, add building.
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
- `/d/:id/edit` - the editing mode is its own route (pencil -> edit page,
  Done -> back to `/d/:id`), gated by `canEditDashboard`, mirroring
  `/automations/edit/:id`. (Superseded: the first version was an in-place
  `state.dashEdit` toggle.)
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

### Editing (the editor) — REBUILT on the flow-editor model

The editor adopts the automation flow editor's machinery (see the flow detail
section) instead of the first in-place toggle:

- **Draft + commit:** edits mutate a session draft copy of the cards
  (`_dashDrafts`, per dashboard id); **Done commits** the draft back to the
  dashboard, back leaves it pending. No half-finished edit is ever visible to
  other viewers of a shared dashboard.
- **Undo / redo** with snapshot coalescing (`dashSnapshot` / `dashUndo` /
  `dashRedo`, same pattern as `flowSnapshot`): topbar controls next to Done.
- **Card inspector:** tapping a card selects it (`state.dashSel`) and opens a
  configuration panel — floating map-style panel on desktop, bottom sheet on
  mobile (same presentation split as the flow node inspector). Per type: title
  (entities / actions), device multi-pick with search (entities), camera or
  speaker radio pick, scenes-vs-scripts switch + item pick (actions). Remove
  card lives at the bottom of the inspector, like deleting a flow node.
- **Drag to reorder** (mirrors `flowStepDown/Move/Up/Over`), replacing the old
  chevron up/down buttons. In edit mode the whole card is one target: click
  selects, drag reorders; card content is inert.
- **Configure-then-add:** picking a type from the add-card palette inserts an
  unconfigured card, selects it and opens the inspector (no canned demo
  content). Unconfigured cards render a dashed "tap to set it up" placeholder
  in edit mode.
- **Bottom toolbar** (mirrors `flowToolbar`): the **cards vs YAML segmented
  switcher on the left**, then undo / redo and a prominent "+" add-card
  button. Fixed bottom-center; sits above the tab bar on mobile. (Both
  toolbars lead with the view switcher.) The "+" opens a **small popover
  anchored to the button** on desktop (sheet on mobile), same vocabulary as
  the flow editor's "+" menu.
- **YAML view:** a session-only editable text mirror of the draft as Lovelace
  YAML (`dashToYaml`), regenerated on every card edit / undo / redo; it does
  not re-parse back into cards (same prototype scope as the flow YAML view).
  Copy button in the corner.
- **Save / cancel / discard on exit (both editors):** leaving the editor via
  back with a dirty draft asks "Save your changes?" (Save / Keep editing /
  Discard, via the extended `askConfirm` with a `discardLabel` third button).
  Done always commits (`dashCommit` / `flowCommit`, which now really copies
  the flow draft back to `H.flows` + applies `_meta` name/description). Clean
  drafts drop silently.
- **Draft restored notice:** if someone leaves without resolving the dialog
  (nav elsewhere, bookmarks), the dirty draft is kept; re-opening that editor
  shows a one-button "Draft restored" dialog (`noteDraftRestored`, keyed by
  `_lastEditKey`, reset on every hashchange).
- Escape closes the inspector; pencil shown only to editors. View-only viewers
  never see it.

### Managing

- Each dashboard's `...` overflow: Rename, **Edit access** (the view/edit grant
  sheet), Duplicate, **Set as my home**, Delete. Delete / rename / access gated
  to editors; *Set as my home* is per-person and always available to a viewer.
- The dashboard **view page** carries the same overflow menu (Settings, Set as
  my home, Duplicate, Delete) next to the audience line. Management moved out
  of edit mode entirely: the edit page is purely about cards (the old in-edit
  "manage bar" is gone).

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

### The compose + suggest flow (automations) — REVISED 2026-07-14

Unified compose for maintainer and resident, gated on whether a
data-generation **AI task** is configured (`aiDraftReady()`, keyed
`draft-routine`). Inspiration for the AI-build entry is the iOS 27 Shortcuts
"What do you want your shortcut to do?" prompt: one plain-language description
box with an example hint that generates the flow into the editor. In this
household the AI task **is** set up.

**AI task set up:**

- **Resident** (compose sheet). Types a description, then picks one of three:
  1. **Send to maintainer** (description only, no build).
  2. **Build with AI** — turn the description into a flowchart; opens the flow
     editor seeded with the AI-drafted flow.
  3. **Build it manually** — opens a blank flow editor.
  After building (2 or 3), the editor's primary action is a **Suggest** step
  that offers two choices: **Suggest with flowchart** or **Suggest description
  only** (the resident may not be happy with what they built and can hand the
  build off to the maintainer, keeping just the description). Either way it
  lands as a pending suggestion; the resident never publishes directly.
- **Maintainer** (compose sheet). Two options, both go **live** immediately:
  **Build with AI** (write a description, AI builds it) or **Build it
  manually**.
- **Maintainer review of a suggestion:**
  - **Has a flowchart:** preview the built flow (When / Only if / Then), then
    Approve as-is / Edit and approve / Decline with a note.
  - **Description only:** the maintainer must build it. Actions are **Build
    with AI** (from the resident's description) or **Build manually** (plus
    Decline). Saving in the editor **resolves the suggestion as approved**,
    credited to the resident and co-authored by the maintainer.

**AI task not set up:**

- **Resident:** Suggest with a description, or Build it manually.
- **Maintainer:** Build it manually only.

Throughout: anything a resident produces is a pending suggestion a maintainer
reviews and adds; maintainers go live directly. The maintainer is reached by
push + the Explore open-loop tray, deep-linking to the review view. Inline the
pending item shows as a "Suggested" pill until resolved.

**Zones** keep the simpler describe (+ optional AI draft) + name + Suggest
path; building a zone is drawing it on the map, reviewed in place (unchanged).

**Implementation notes (for the build):**
- `createRoutine(kind, opts)` gains `opts.suggest` (resident build: owns the
  record via `editors:["maintainers", personaId]`, flags `suggestDraft:true`,
  `published:false`) plus `name`/`description` seeds. Suggest-draft records are
  filtered out of all automation lists (`routinesBody`, search, `autoCardBody`).
- Editor "Done" forks on `a.suggestDraft`: a suggest-draft shows **Suggest**
  (opening the with/without-flowchart choice) instead of committing live; back/
  cancel discards and removes the temp record.
- `sugSubmit` carries `draft.flow` (deep copy) when sent with a flowchart;
  `sugResolve` lands `draft.flow` into `H.flows[newId]` on approve.
- Review screen previews `draft.flow`; a no-flow suggestion swaps Approve for
  Build with AI / Build manually, and the editor save resolves it approved.

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

> Status (verified 2026-07-05): BUILT. The rebuild shipped as
> `featureTile(e, persona)` (NOT the old `tile()`; the 2026-07-03 index grepped
> for `tile()` and wrongly reported the rebuild as unbuilt). Per-domain controls
> are live and wired across the whole home perspective (Lights, Climate,
> Security, Media, Energy, area detail): light brightness slider, fan speed
> slider, switch toggle, media transport, climate radial gauge + target stepper +
> heat/cool badge, lock/unlock command group, device-class icon tint + honest
> state, plus the Lars locked "Ask Daan" variant. Remaining: the body-tap
> more-info split (blocked on the more-info dialog below), and two leftover
> `tile()` call sites (Favorites For-you widget, single-entity light render) that
> should point at `featureTile`. Original plan kept below for rationale.

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

**Done (shipped as `featureTile(e, persona)`):** the rebuild is live and wired
across the whole home perspective (Lights, Climate, Security, Media, Energy, area
detail). The old `tile()` (compact icon-only, identity + toggle) is retained but
now used only in two spots (Favorites For-you widget, single-entity light render).
`featureTile` carries:
- Card on `--color-surface`; device-class icon circle (amber light `#e0a32e`,
  blue switch/media `#2f80ed`, cyan fan `#2aa6b3`, orange climate `#e0662e`,
  green/red lock): tinted fill + colored glyph when active, grey when off.
- **Per-domain controls in-app:** light brightness slider, fan speed slider,
  switch icon toggle, media transport row (prev / play-pause / next), climate
  radial gauge + target stepper + heat/cool badge, lock/unlock command group.
- Identity row (icon + name + honest state) with an optional feature row beneath;
  on/off domains toggle by tapping the icon, the rest drive from their control.
- The Lars locked "Ask Daan" variant is preserved.

**Still to do (follow-up):**
- **More-info + split interaction.** The spec's model (tap icon = toggle, tap
  body = more-info) still needs the **more-info sheet/dialog** first (sheet
  &lt;768, dialog ≥768 per `overlays.md`). Until that exists, `featureTile` drives
  its controls but has no body-tap target.
- **Two leftover `tile()` call sites.** Point the Favorites For-you widget and
  the single-entity light render at `featureTile` for consistency.

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

## 3D home on the homepage — BUILT (direct mount, no iframe)

The 3D home (`home3d/engine.js`, three.js) mounts **directly in the app**
as a live, navigable layer. The old standalone wrapper page (`Home 3D.dc.html`)
and its iframe embed were removed (decision: homepage only, iframe boot caused
a white flash + unstyled loading state and doubled scene boots across
breakpoints). The Fit My Home editor page was later removed too: the plan
editor is now built directly into Settings -> Floors and areas (see that
section).

### Presentation per breakpoint

- **Desktop and tablet:** the 3D renders as a **full-page background layer**
  behind the whole shell (`renderShell` mounts the engine host at z 0; rail,
  topbar and title go transparent above it, like the Map page). Widgets/cards
  sit in the left column (440px), the home fills the space to the right.
  Desktop framing is `zoom=0.62`, `shift=0.15` (zoom bumped from 0.52 on
  request) so the home centers, larger, in the free area.
- **Mobile:** inline slot (240px tall) in the page flow, full-bleed width, with
  the canvas overhanging 140px up (behind the big title) and 200px down (behind
  the cards scrolling over it). No card, no mask on any breakpoint.
- The horizon uses a small radial wash that fades into `--color-bg` (engine
  `ambient` option); no sun-path arc, no tweaks column, no in-3D status pill or
  floor chrome. (The standalone page's demo tweaks panel, time of day, city,
  etc. was dropped with the page; time of day follows the real clock, ticked
  every 30s.)

### Direct mount (replaces the old postMessage embed protocol)

One engine instance for the whole app, in a persistent host div
(`home3dHost()`), adopted by whichever homepage container is on screen
(`_h3dRefDesktop` / `_h3dRefMobile` -> `home3dAttach`), so switching
breakpoints re-frames (`engine.setFraming(zoom, shift)`, which also retargets
a running intro tween) instead of rebooting the scene.

- Engine is `import()`ed lazily with `home-geometry.js` + `plan.js` on first
  attach (`ensureHome3d`). The saved plan wins over hand-authored geometry.
  The Floors and areas editor calls `rebuildHome3d()` directly on save; a
  `storage` listener on `cc-home3d-plan-v1` covers edits from another tab
  (and refreshes the editor's own copy of the plan).
- 3D -> app: `onViewChange` / `onAreaPick` callbacks drive the router
  (floor -> `/home/floor/:id`, area -> `/home/area/:id`, tap outside -> back);
  `_h3dApplying` guard stops route echo loops.
- App -> 3D: `syncHome3d()` calls `focusFloor` / `focusArea` / `backHome`
  directly on route change; `pushHome3dState()` calls `engine.updateState`
  (live entity mirror, keyed diff). Theme changes call `engine.setTheme`
  from `applyAppearance`.
- **Pointer forwarding:** on desktop/tablet the shell overlay replays
  down/move/up events that land on bare background (`home3dPointer` ->
  `home3dFwd`) as synthetic PointerEvents on the engine canvas, so hover lift,
  taps and drag-to-orbit work through the page. **Wheel-to-zoom** is forwarded
  the same way via a non-passive native `wheel` listener (`_h3dOverlayRef`).
- **Text selection:** same-document canvas means drag-to-orbit is also a text
  drag; orbit-drag start prevents the selection anchor, clears any selection,
  and sets `user-select: none` on body until pointer-up.

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

- Options: `ambient` (horizon wash), `zoom` (radius multiplier), `shiftX`
  (screen-space horizontal offset via `setViewOffset`); `setFraming(zoom,
  shift)` changes both live for breakpoint switches.
- Sun and moon discs are mutually exclusive (dawn/dusk overlap bug fixed).
- `focusArea(areaId)`, `tapAt(x, y)`, area-aware `focusFloor`/`backHome`
  (reframe when leaving an area zoom).
- `fitRadius` now scales with viewport aspect: wide screens pull the camera in
  so the home grows with the window instead of shrinking; refit on resize.

### Layout notes

- `floorplanPlaceholder(bp)`: desktop/tablet renders an empty spacer (the real
  canvas is the shell layer); mobile renders the inline overhanging host div.
- `cardGrid` on all breakpoints is now `auto-fill, minmax(0.75 * deskMin)` so
  two cards share the narrow 440px column next to the 3D.
- Area headings on floor subviews use the big (`text-2xl`) `sectionLink`.
- Floor/area subviews drop the Recent activity + Automations widget cards
  (`areaBody(..., { noWidgets: true })`); they remain on nothing else — if an
  area detail needs them back, pass no opts.

Reference implementations: `renderShell` (background layer + pointer overlay),
`floorplanPlaceholder`, `homeContentTransition`, `home3dAttach` /
`ensureHome3d` / `rebuildHome3d`, `syncHome3d` / `pushHome3dState`,
`home3dPointer` / `home3dFwd` / `_h3dOverlayRef` (app side);
`home3d/engine.js` (camera, `setFraming`).

## Settings -> Integrations (the combined connector layer) — PLAN

> Status: BUILT (2026-07-05). All three phases shipped. `settingsSel:
> "integrations"` now renders `integrationsBody` (grouped card grid) and, via
> `state.integrationSel`, `integrationDetailBody`. Data is a computed
> `integrations` export in `household.js` (added to `window.__HH_MOD`). Device
> detail links its Integration value and lists its entities; the entity
> inspector Integration row and the service edit "Connected" cog both open the
> integration detail; the detail's "entities" cross-link deep-links `/entities`
> with the integration filter pre-applied. Admin-gated via the existing
> `/settings` gate. Original plan kept below.
>
> Decisions (confirmed 2026-07-05): build all three phases; keep the name
> **Integrations**; **card grid grouped by category** (not the collection
> shell); **full data realism** (multiple config entries, an error state);
> **no Add-integration flow on this page** (integrations arrive through the
> existing "Add device" and "Add a service" flows); **Discovered and
> Attention-needed do NOT live here** (they land elsewhere, see note below);
> also wire the device-detail and service cross-links.

### What HA does (reference, so we adapt not copy)

Real Home Assistant puts this under **Settings -> Devices and services**, with
tabs Integrations / Devices / Entities / Helpers. The **Integrations tab** is:
a **Discovered** section at the top (auto-found devices with an Add button), then
a **grid of integration cards**, one per configured brand. Each card shows the
brand logo, the integration name, and a count line ("3 devices and 12
entities"); a warning badge appears when an entry needs attention (reauth,
reconfigure). A card can hold several **config entries** (e.g. two Hue bridges).
A floating "Add integration" button sits bottom-right. Clicking a card opens the
**integration detail**: brand header (logo, "by {author}", version, IoT class,
Documentation link), the config-entry list (each with status + device/entity
counts + per-entry overflow: Reload, Rename, Delete, System options, Enable
newly added entities), and the devices + entities that entry provides. Per-entry
issues surface a Reconfigure / Reauthenticate action.

### How it maps into our concept

We keep our name **Integrations** (the honest technical connector layer, admin
space, under `/settings`) and list **device integrations and service
integrations together**, plus the internal/system ones. It stays a settings
destination, not a new top-level route. Reuse our existing patterns: the
Cloud-settings drill-in (`cloudSub`) for list -> detail, the titled-section
card pattern (CLAUDE.md), the overlay engine (`renderSheet` / `fyScrim` /
`askConfirm`) for Add and Delete, and the brand-logo helpers we already have
(`brandLogo` / `brandDomain`). Copy rules apply ("and" never "&", sentence case,
plain status words).

### Data (new, in `household.js`)

Add a computed builder `buildIntegrations(household)` (sibling of
`buildEntityRegistry`), exposed as `household.integrations`. Each entry:

- `id` (domain slug: `hue`, `nest`, `zwave_js`, `reolink`, `zha`, `cast`,
  `assist`, plus service slugs `metno`, `spotify`, `google_maps`, `afvalwijzer`,
  and system `cloud`, `mqtt`, `template`, `google_assistant`, `amazon_alexa`).
- `name`, `domain` (for `brandLogo`), `author` (Philips, Google, Home Assistant
  project, ...), `version` (mono), `iotClass` ("Local push" / "Local polling" /
  "Cloud polling" / "Cloud push"), `docsUrl` (inert link).
- `category`: `"device"` (local devices and hubs), `"service"` (external feeds
  that power a Service page), `"system"` (internal: Cloud, MQTT, Template,
  Google, Alexa).
- `entries`: config entries `[{ id, title, status, deviceCount, entityCount }]`.
  `status` in `loaded | error | setup_in_progress | disabled`. Most have one
  entry; give **Hue two bridges** and one `error` entry (e.g. Reolink
  "reauthentication required") for honest variety.
- Counts derived, not hand-kept: reuse `integrationOf(device)` over
  `household.entities` and the `integration` field on the entity registry to
  compute device + entity counts per integration. Service integrations pull
  their installed flag from the existing `serviceIntegrations` +
  `household.services[*].installed`, and carry `powers: [serviceId]`.
- `issues`: optional `[{ kind: "reauth" | "reconfigure", text }]`; reuse the
  `repairs` demo data where it fits. Discovered devices reuse the existing
  `discovered` demo list.

### List page (`integrationsBody(persona, bp)`)

Rendered from `customSettings()["integrations"]`; **admin-gated** (residents get
the existing no-access state, same as the rest of `/settings`). `fullWidth` like
`floors-areas` so the card grid breathes past the 760 settings cap.

- **Search** (name) + **category chips** (All / Devices and hubs / Services /
  System) + **Sort** (Name / Most entities). Small, inline; not the full
  Filters rail (this is a settings page, not a collection).
- **Discovered** and **Attention-needed** are NOT part of this page. Discovered
  devices belong to the add-device flow; integration health / repairs land in
  the repairs surface. This page is purely the listing + detail of configured
  integrations. (An `error` config-entry status still shows as a status pill on
  the card and an attention card inside the detail; there is just no separate
  top-of-list Attention section here.)
- **Integration cards**, grouped under `SectionHeader`s by category ("Devices
  and hubs", "Services", "System"). Card = 48px brand-logo squircle (fallback
  `power-plug` glyph on a neutral squircle), name, a mono meta line
  ("3 devices and 12 entities" for devices; "Powers Weather" for services), an
  optional status dot when not all entries are loaded, and an overflow (`...`).
  Card on `--color-surface`, page `--color-bg`. Tap -> detail.
- **No Add-integration action on this page.** Integrations are created through
  the existing flows: hardware through **Add device**, external feeds through
  **Add a service** (the `serviceIntegrations` gallery in `serviceEditBody`).
  So this page has no topbar `+` for adding; it is a listing + management view.
  (Per-integration/entry manage actions still live here, see Phase C.)

### Detail page (`integrationDetailBody(id, bp)`)

Drill-in via a new `state.integrationSel` (mirrors `cloudSub` / `planArea`):
set on card tap, cleared by the back arrow and Escape; on desktop the settings
submenu stays. `settingsDetail` swaps to this body when `integrationSel` is set,
same as the Cloud account subpages.

- **Identity card** (stands alone, no heading, per the titled-section rule):
  large brand-logo squircle, name, "by {author}", `version` mono, an `iotClass`
  chip, a "Documentation" link (inert), and an overflow (Reload, Rename, System
  options, Delete). Delete uses `askConfirm` (danger).
- **Attention card** (if issues): `warning` surface, the problem stated plainly,
  a "Reauthenticate" / "Reconfigure" button.
- **Entries** titled section ("Hubs and accounts"): one row per config entry
  with title, a status pill (Working / Needs attention / Disabled), "n devices
  and m entities", and a per-entry overflow. Folds into the identity card when
  there is a single entry. "Add hub" / "Add entry" link at the bottom.
- **Devices** titled section: grid of the devices this integration provides
  (reuse the device card), each linking to `/devices/:id`. Heading carries the
  count. Omitted for pure service integrations.
- **Entities** titled section: first ~6 entities as compact rows into the entity
  inspector, then "View all n entities in Entities" which routes to `/entities`
  **with the integration filter pre-applied** (that filter already exists on the
  entities collection). This is the key cross-link that makes the layer honest.
- **Service integrations** replace Devices with a "Powers" row linking to the
  Service page (`serviceEditBody`) plus that service's settings.

### Cross-links to wire (make the layer honest both ways) + device/service gaps

Confirmed to build alongside (device_gaps = yes, and check services):

- Device detail's "Integration: Philips Hue" value -> integration detail
  (currently plain text at `deviceDetail` details rows).
- **Device detail lists the device's entities** (currently only a single
  "Entity ID" row): a titled "Entities" section of the registry rows whose
  `deviceId` matches, each into the entity inspector. This makes the
  device<->entities cross-link two-way (the inspector already links back).
- Entity inspector's "Integration" row -> integration detail (currently plain
  text).
- **Services check:** the Service edit "Connected" integrations -> integration
  detail, and each service integration's detail "Powers" row -> the Service
  page, so the service<->integration link is honest both ways. Confirm the
  `serviceIntegrations` installed flags and `household.services[*].installed`
  line up with what `buildIntegrations` reports.
- Home extensions / repairs stay where they are; Integrations links out to them,
  it does not absorb them.

### Access, copy, design-system

- Admin only; residents blocked (existing `/settings` gate).
- Copy: "and" not "&", sentence-case status words, no marketing. Counts as raw
  mono strings.
- Elevation not borders (page `--color-bg` -> card `--color-surface` -> nested
  rows `--color-surface-raised`); hairline dividers only between entry rows.
  One accent (blue) for links + the single active/live thing; semantic colors
  only on issue/status. Brand logos via `brandLogo`. MDI icons. No new tokens.
- Config actions (Add, Reload, Rename, Delete, Reauth) are demonstrated, not
  functional (flip/close locally, links inert), consistent with the rest of the
  admin settings in this prototype.

### Build phases

- **A, data + list:** `buildIntegrations`, `integrationsBody`, admin gate,
  `fullWidth`, search/category/sort, grouped cards (no Discovered/Attention
  section, no Add). Wire the device-detail and entity-inspector "Integration"
  values to open the (still stubbed) detail.
- **B, detail:** `state.integrationSel` drill-in, `integrationDetailBody`
  (identity, entries, devices, entities cross-link to filtered `/entities`,
  service "Powers" link, issues card). Plus the device-detail entities section
  and the service cross-links above.
- **C, manage:** per-integration and per-entry overflow actions (Reload /
  Rename / Delete via `askConfirm`), reauth/reconfigure action on issue cards.
  No add flow (adding happens via Add device / Add a service).

### Verification

Admin (Daan) sees the full list and can drill into a device integration (Hue
shows two bridges, one flagged), a service integration (Met.no -> "Powers
Weather"), and a system one (Cloud). "View all entities" lands on `/entities`
pre-filtered. Residents (Sofie) get the no-access state. No "&" in any copy.
Mobile drill-in and Add sheet behave per `overlays.md`.

Reference implementations to model on: `cloudAccountBody` / `cloudSub` (list ->
subpage drill-in), `homeInfoBody` `titled()` (section cards), `serviceEditBody`
(connected + gallery), `entityFilterGroups` (integration filter to deep-link),
`brandLogo` / `brandDomain` (logos), `askConfirm` (delete).

## Shared contextual panel (Map / Automation / Dashboard) — BUILT (2026-07-13)

The three detail panels (Map, Automation flow, Dashboard "Details") were
hand-rolled and drifting (different headers, shadows, z-index 1000/1300,
segments only on Map and buried in the body, three ways of doing the sub-step
back). Unified behind one primitive.

- **`ccPanel(spec, bp)`** is the single shell: desktop floating 380px card
  (`--radius-lg`, shadow `0 8px 28px rgba(0,0,0,0.28)`, `z 1001`, top-right via
  `desktopPos`); mobile bottom sheet via `renderSheet`. `panelHeader` +
  `panelSegments` + `panelIconBtn` are the shared chrome. `ccSubHead` is the
  matching sticky sub-step header used inside panel bodies for deep sub-steps.
  Full spec + rules in `docs/overlays.md`.
- **Sub-step contract:** `onBack` shows the back chevron AND drops the X AND
  hides the segments. Segments are a chrome slot (two-segment sliding pill).
- **Migrated:** Map (`mapPanelSpec` + `mapDetailHead`->`ccSubHead`, People/Zones
  segments now in chrome), Automation (`flowPanel` delegates to `ccPanel`;
  mobile flow sheet + `subStepBack` unified), Dashboard (`dashInfoOverlay`;
  title is now the dashboard name, was "Details").
- **Not migrated (out of scope, dialog family):** `dashDraft`, `dashInspector`,
  `dashCardPick`, `addWidget`, `widgetConfig` — centered `fyScrim` dialogs, not
  contextual panels. A parallel shared dialog primitive is the follow-up.
