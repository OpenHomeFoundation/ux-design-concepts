# 3D Home — improvement plan

The `home3dCard` scene (in `Home Assistant Concept Car.dc.html`) currently reads
as a house hanging under a floating plane. This documents what's wrong and the
plan to make it feel like a premium, orbitable model of the home in its world
(references: Tesla in-car 3D car model + HA frontend PR #52769 "solar scene").

## Diagnosis

- **Looking from below.** `home3dTransform(bearing)` = `rotateX(18deg) rotateY(bearing)`
  with `perspectiveOrigin: 50% 38%` puts the eye under the ground slab. This is
  the cause of the "viewed from the bottom" and "underside" look.
- **Yaw-only, unconstrained rotation.** Drag changes only `bearing`; no pitch,
  no framing, no inertia. Feels like you can't rotate it properly.
- **Floating diamonds** = neighbour blocks (`neigh(...)`) + the annex wing,
  positioned off the ground plane; from below they detach.
- **Dotted line** = sun trajectory arc in `cc3dSky` (`strokeDasharray: "2 9"`).
- **Weird extension** = the annex `annexBox` volume, still drawn though
  Elizabeth's rooms were merged into the ground floor.
- **Weak focus.** Floor click only lifts 22px and dims others; no exploded view.
- **No sense of place** — the home isn't shown in a neighborhood.

## Plan

1. **Orbit camera rig.** Fixed downward pitch (~55–60° top-down 3/4), raise the
   perspective origin, drag = smooth 360° yaw with inertia. Tesla-style soft
   studio vignette backdrop.
2. **Single grounded plot.** House, wing and neighbours all sit on one plate;
   nothing floats.
3. **Neighborhood context.** Surrounding homes as ghosted low-opacity /
   wireframe massing around the plot (solar-scene look).
4. **Exploded focus.** Click a floor → stack separates vertically with a real
   gap, chosen floor lifts + brightens, others fade + recede; click empty to
   recombine. Spring motion.
5. **Remove the annex wing.** Elizabeth's rooms read inside the ground floor.
6. **Sun stays, dashed arc goes.** Keep sun, glow, day/night sky, time scrub;
   drop the dotted trajectory.
7. **Polish.** Contact shadow under the house, premium dark studio gradient,
   `prefers-reduced-motion` fallback.

## Open decisions (see questions in chat)

- Rotation: free 360° drag-orbit vs. snap-to-cardinal views.
- Neighborhood: ghost wireframe massing vs. simple solid blocks vs. none.
- Explode trigger: click a floor vs. a dedicated "exploded view" toggle.
- Scope: rebuild in place vs. a side-by-side v2 to compare.
