# Home field, generative background

A real-time, painting-like background for the Home page. It is not a chart and
not a history view: it is a single composition that reflects the home's current
state the way weather does, something you sense before you read. The aesthetic
follows Zeh Fernandes' GenCup posters (organic spray-brush strokes, grain,
gravity points, a composition fully determined by the underlying data).

## The idea: two forces, one image

The painting is the contested space between **inside** and **outside**, the same
home / away confrontation Zeh draws between two teams.

- **Inside forces** (heating and cooling output, artificial light, occupancy,
  activity) bloom from the **center** outward.
- **Outside forces** (temperature delta, wind, weather, natural light) press
  **inward from the edges**.
- When the delta between inside and outside is large, the field is **dense and
  tense**; near equilibrium it **softens and thins**; **nobody home leaves a
  dead zone** that thins to almost nothing.

## The timeline

Time is the **last 24 hours**, laid along the **diagonal from the top-left
(-24h) to the bottom-right (now)**, through the center of the canvas. Each
point's time is its projection onto that diagonal; the two forces lean across
it. The sun's real clock arc only sets tone (see below); activity is what the
strokes carry.

## Canvas tone follows the app theme

The canvas is always **dark in dark mode and light in light mode**, never the
opposite. `auto` reads the design system's own `--color-bg` luminance; `dark`
and `light` force it. The sun's clock arc modulates tone only *within* the
theme (a touch warmer at dawn/dusk, slightly lifted at midday), so it never
crosses to the other theme's brightness.

## Brushwork and motion

- **Spray brush.** Each stroke is a tapered run of soft, tinted blobs stamped
  along a flow line; layered thickly they read as continuous, grainy color
  fields, not individual lines. A fixed grain layer sits on top (soft-light
  blend) so change reads as light moving across a surface.
- **Colors.** Warm (inside) runs amber to cream by intensity; cool (outside)
  runs deep blue to bright cyan by daylight. Hand-tuned, vibrant, blending only
  where the two meet.
- **Paint-in.** On load the field paints in **one brush stroke at a time,
  alternating left / right** while each side fills **top to bottom**, always
  over a fixed **~2 seconds** (scaled by `paintIn`), then **freezes** (no
  continuous drift). Respects `prefers-reduced-motion`; a timeout fallback
  guarantees the finished painting even when rAF is throttled (background tab).

## What drives it: the demo scenarios

The background is fed by the same **`demoScenario`** this prototype already
uses for the For-you stack, so one control changes the whole feel. Each scenario
maps to a field profile (`scenarioField` in `Home Field BG.dc.html`): an
activity curve over the day, an outside-delta curve, a "now" time, intensity,
tension (swirl), and gravity-point events.

| Scenario | Reads as |
| --- | --- |
| Quiet afternoon | calm, sparse, mild delta |
| Weekday morning | a morning activity bloom, cool outside |
| Evening | dense, tense, swirling, warm-dominant |
| Media playing | a warm evening pocket |
| Power spike | hottest, most turbulent |
| Calendar soon | a morning pull |
| Weekend | relaxed late-morning, low tension |

## Files and props

- **`Home Field BG.dc.html`** , the single full-bleed background component.
  Props: `scenario` (the demo scenario name), `theme` (auto / dark / light),
  `paintIn` (animation speed, 0 = appear instantly), `density`, `softness`,
  `grain`.
- **`Home Field.dc.html`** , the four-state showcase / design study that the
  background engine grew out of (empty home, one person evening, full house,
  quiet Sunday), shown side by side on a canvas.

## Wiring it into the Home page (recipe, not currently active)

The Home page integration was trialled and then reverted; the background lives
on as a standalone component. To wire it back into
`Home Assistant for the whole household.dc.html`:

- A fixed layer sits behind the app: `#cc-field-bg` (`position:fixed; inset:0;
  z-index:0; pointer-events:none`) hosting
  `<dc-import name="Home Field BG" scenario="{{ bgScenario }}">`. The app mounts
  above it in `#cc-app` (`position:relative; z-index:1`).
- `renderVals` exposes `bgScenario = this.props.demoScenario`.
- The field only shows on **`/home`**: `renderFrame` computes
  `onHome = state.route === "/home"` and makes the frame shell (and the desktop
  rail) **transparent** on home so the field shows through the content gaps;
  every other route keeps the opaque `--color-bg`, which hides it. Cards keep
  their surfaces and sit on top of the field.

To add the field behind another surface, give that surface a transparent (or
translucent) background and ensure the fixed `#cc-field-bg` layer is behind it
in the stacking order.
