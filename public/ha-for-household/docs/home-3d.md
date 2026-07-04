# 3D home view (home3d/, mounted directly in the app)

Note: the standalone `Home 3D.dc.html` wrapper page was removed. The engine
now mounts directly in `Home Assistant for the whole household.dc.html`
(no iframe): see `ensureHome3d` / `home3dAttach` in its logic class. The
notes below predate that change where they mention the wrapper page.

An interactive 3D visualization of the household, built with three.js. Soft
abstract "concept car" rendering: the home as a friendly abstraction, not a
floor plan trying to be correct. Phase 1 (viewing) and Phase 2 (the
"Fit my home" editor) are built.

## Files

- `Home 3D.dc.html`, the page: HUD (status line, floor chips, tweaks panel,
  area card), theme handling, state derivation from `household.js`.
- `Fit My Home.dc.html`, the Phase 2 editor (see the Phase 2 section below).
- `home3d/plan.js`, the editable plan: default plan, localStorage load/save,
  and `planToGeometry` (derives outlines, walls, roofs from room rects).
- `home3d/engine.js`, the three.js engine: scene, sun and lighting presets,
  orbit camera, the two views, explode transition, DOM label overlay.
- `home3d/home-geometry.js`, THE house plan. Everything rendered derives from
  this one structure. Tweak the home here.

## The house plan

Units are meters. x runs west to east, z runs street (front, negative z is
the street side) to garden (back). The front door faces the street at z = 0.
Keyed to `household.js` floor and area ids.

### Ground floor (L-shaped footprint)
Main block x 0..8, z 0..9, plus garage wing (west, x -3.5..0, z 0..6) and
annex wing (east back, x 8..11, z 4..9, Elizabeth's rooms).

| Room | Rect (x1, z1, x2, z2) |
| --- | --- |
| Kitchen | 0, 0, 3.2, 4 |
| Hallway | 3.2, 0, 5.2, 4 (front door) |
| Living room | 0, 4, 8, 9 plus 5.2, 0, 8, 4 (L-shaped) |
| Garage | -3.5, 0, 0, 6 |
| Elizabeth's room | 8, 4, 11, 7.2 |
| Elizabeth's ensuite | 8, 7.2, 11, 9 |

### First floor (main block only, 0..8 x 0..9)
| Room | Rect |
| --- | --- |
| Main bedroom | 0, 4, 4.2, 9 |
| Tess's room | 4.2, 4, 8, 9 |
| Lars's room | 0, 0, 3.4, 4 |
| Bathroom | 5.0, 0, 8, 4 |
| Landing (no area id) | 3.4, 0, 5.0, 4 |

### Basement (0..5 x 0..6, below ground)
Single room: Utility.

Roofs: flat plates over the main block (top), garage wing and annex wing
(both at ground-floor height).

Storey heights: basement 2.4, ground 2.75, first 2.55. Wall thickness 0.14,
room wall height in floor view 1.15.

## Decisions log (agreed in review)

- **No outdoor context.** Trees, hedges, neighbors, garden/driveway/patio
  patches and the front path were built, then removed. Product-shot style.
- **No visible ground edge, ever.** There is no ground plate mesh at all: the
  ground IS the CSS background wash. Only a ShadowMaterial catcher (sun
  shadow), a soft contact shadow and the light spills paint onto it.
- **Basement is translucent below grade** (opacity 0.55) and tappable from a
  low angle; selecting it lifts it just above grade.
- **Selected floors keep their natural height** (first floor stays at storey
  height); other floors and the roof fade out entirely during the explode
  (earlier "dimmed outline slabs" idea was dropped as in-the-way).
- **Glow comes out of the walls, not the floor.** Per lit room: a warm
  additive wash on its exterior facade sections (brightest at the wall base,
  fading upward, soft horizontal ends), plus a ground spill in front of that
  wall on ground-level floors only. Interior rooms with no facade (hallway)
  correctly leak nothing. Intensity scales with light count and boosts at
  night (glowBoost).
- **Crossfade is staggered** (volume fades fully out in the first ~45% of the
  850ms explode, detail fades in during the last 50%) because volume facade,
  floor plate and outer walls are coplanar: simultaneous transparency
  z-fights. Outer walls sit flush with the plate edge (shifted inward by half
  their thickness); geometry insets were tried and rejected (visible gaps).
- **No idle camera drift.** An intro swing (~2s) on load signals that the
  scene is interactive; after 9s idle in the home view the camera eases back
  to the default angle. Phone-first: tap selects directly, no hover needed.
- **Sun is ambiance only** (arc, disc, moon, lighting presets from real solar
  position); no energy/solar data by design.
- **Theme follows the app** (auto/dark/light, tokens from the design system);
  scene palettes are defined per theme in `engine.js` (PALETTES).

## Tweaks panel (top right)

Time of day (scrub, defaults to live with back-to-live), location presets
(Amsterdam default), force climate, lights as-is/all-on/all-off, theme.

## Phase 2 (built): "Fit my home" editor

`Fit My Home.dc.html` + `home3d/plan.js`. Standalone page, and embedded in the
main concept: Settings > Edit floors and areas hosts the editor
(`?embed=1` hides its back button), and the home overview shows the live 3D
home (`Home 3D.dc.html?embed=1`, edit button hidden there: edit lives in
Settings). Decisions from review (m0089, m0104 to m0139):

- **Plan is the floors-and-areas source of truth** (`home3d/plan.js`, v2):
  buildings, floors (stack order per building), rooms, and outdoor patches,
  saved to localStorage `cc-home3d-plan-v1`. **Room = area**: drawing creates
  it, the area settings sheet (cog on the selected shape) edits name, icon,
  and color; deleting warns that its devices become unassigned. No saved plan
  = the hand-authored `home-geometry.js` renders untouched.
- **Shapes are rectilinear polygons**, edited like the map's zone polygon
  editor: drag the body to move (collision-sliding, cross-building and
  outdoor obstacles respected), drag a corner dot to reshape, drag a small
  midpoint dot to push out that part of the wall (connector points inserted
  automatically, so an L-shape is ONE area), tap a midpoint to add a corner,
  tap a redundant corner to remove it. Dot styling mirrors `.cc-zedit__*`
  (white dots, dashed white midpoints); hairline strokes. Selected shapes
  show edge sizes outside the border, deduped for equal parallel edges.
- **Outside** is a context chip next to the floor chips: outdoor areas are
  drawn as patches around the muted building footprints. The 3D renders them
  as rounded nature-green plates (custom color blends in), tappable in the
  home view, glowing when their lights are on, fading while a floor is
  focused.
- **Multiple buildings**: menu > Add building starts a new stack; floor chips
  prefix the building name when there is more than one. The engine stacks,
  roofs, contact-shadows, hover-lifts and explodes per building (other
  buildings fade in place during a floor focus); camera framing and sun
  shadow bounds derive from the whole scene.
- **Create flows**: first run (no plan) is a full-screen 3-method chooser;
  Add floor / Add building open the same method cards in a sheet/dialog.
  Photo and Draw are demo-only stubs; Arrange rooms and walls is the real
  method.
- Floor settings sheet: rename + delete (confirm lists areas and devices;
  deleting a building's last floor removes the building). Menu: Add
  building, Home size (scales everything), Reset to the demo home, Start
  over. Overlays follow docs/overlays.md (sheet under 768px, dialog above).
- `planToGeometry` derives outlines, interior walls, per-building roof
  plates, and outdoor patch geometry from the shapes; `rectsFromPoly`
  decomposes each polygon into the row-strip rects the engine consumes.
- Engine additions: `building` on floors, outdoor patches, per-room custom
  color tint in the floor detail view, scene-derived HOME_VIEW framing.
- Also kept from the first iteration: Home size slider (scales everything
  around the centroid), 3D preview button (fresh engine instance from the
  plan, disposed on exit), non-blocking "rooms need to touch" pill per floor,
  contact shadow keyed to each building's lowest at-grade floor, and
  `Home 3D.dc.html`'s "No home shape yet" empty state after Start over.
