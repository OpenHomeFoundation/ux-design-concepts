# "For you" — Home overview panel

The **For you** panel was the right-hand `<aside>` (width 320, on `--color-surface`) shown on the `/home` route, above the bookmark/area content. It surfaced a personalized, scannable column of "what's happening in your home right now" widgets. Removed from the live concept for now — this doc preserves the design so it can be rebuilt as its own feature later.

## Where it lived

- Route: `/home` only (the home overview). On mobile it stacked below the main content; on desktop it sat in the right aside.
- Rendered by `renderPanel(route, persona)` → `panelWrap([panelHeading("For you"), ...items])`.
- Items were filtered by `adminOnly` (admin personas only) and by a `dismissed` list in component state (`dismiss(id)` pushes an id; alert widgets get a close button).

> Note: the *contextual* right panels on area / lights / climate / security / media routes (Activity, Automations, and per-domain summary widgets) were **also removed** in the same pass (`renderPanel` now returns `null` for every route). The branches that built them are documented below so they can be restored alongside "For you".

## Data — `household.js` → `forYou`

```js
forYou: [
  { id: "update",    type: "alert",      title: "Home Assistant 2025.11.0", label: "Update available", dismissable: true, adminOnly: true },
  { id: "lights-on", type: "summary",    label: "Light",          title: "3 areas have lights on", action: "Turn off" },
  { id: "climate",   type: "data-point", label: "Climate",        title: "Heating to 22.5", value: "extra" },
  { id: "security",  type: "summary",    label: "Security",       title: "1 door unlocked", action: "Lock" },
  { id: "media",     type: "media",      label: "Media playing",  title: "Abbey Road, The Beatles" },
  { id: "energy",    type: "data-point", label: "Energy",         title: "High consumption today", data: "4.3 kWh" },
  { id: "weather",   type: "data-point", label: "Weather of today", title: "Rain", data: "15°" },
  { id: "people",    type: "people",     label: "People",         title: "Daan just arrived home", people: ["Daan", "Sofie"] },
],
```

## Widget component — `ForYouWidget` (design system)

`type` selects the layout. Sits on `--color-surface-raised` (nested inside the panel's `--color-surface`).

| `type` | Layout | Key props |
|---|---|---|
| `alert` | Dismissible card with warning/error left-border | `title`, `text`, `severity` (`warning`\|`error`), `action`, `onAction`, `onDismiss` |
| `summary` | Label + value + optional action button | `label`, `value`, `title`, `action`, `onAction` |
| `data-point` | Big mono number + label | `data`, `label` |
| `media` | Now-playing row with play/pause control | `title`, `text`, `playing`, `onPlayPause` |
| `people` | Title + stacked squircle avatars | `title`, `people: [{name, src}]` |

Declared props: `type, label, value, title, text, severity, data, action, onAction, onDismiss, people, playing, onPlayPause`.

## Wiring helper — `fyWidget(w)` (was in the .dc.html logic class)

```js
fyWidget(w) {
  const { ForYouWidget } = this.C;
  const base = { key: w.id, type: w.type, label: w.label, title: w.title };
  if (w.type === "alert")      base.onDismiss = () => this.dismiss(w.id);
  if (w.type === "summary")  { base.action = w.action; base.onAction = () => {}; }
  if (w.type === "data-point") base.data = w.data;
  if (w.type === "media")    { base.playing = true; base.onPlayPause = () => {}; }
  if (w.type === "people")     base.people = (w.people || []).map((p) => {
    const name = (p && p.name) || p;
    const rec = (this.H.people || []).find((x) => x.name === name)
              || this.mod.getPersona(String(name || "").toLowerCase());
    return { name, src: (p && typeof p === "object" && p.src) || (rec && rec.avatar) || undefined };
  });
  return h(ForYouWidget, base);
}
```

`dismiss(id)` / `this.state.dismissed` and the `ForYouWidget` component are all still present in the project, so rebuilding is just: re-add the `/home` branch in `renderPanel` (or build a dedicated For-you surface) and map `this.H.forYou` through `fyWidget`.

## Contextual panels (also removed) — `renderPanel` branches

These built the right-hand panels on the area and domain routes; restore them in `renderPanel(route, persona)`:

```js
if (parts[0] === "home" && parts[1] === "area") {
  const id = parts[2];
  if (!this.mod.canAccessArea(persona, id)) return null;
  return this.panelWrap([
    this.panelCard("Activity", this.activityCardBody(id)),
    this.panelCard("Automations", this.autoCardBody(id), admin ? () => this.go("/automations") : null),
  ]);
}
if (parts[0] === "home" && ["lights", "climate", "security", "media"].includes(parts[1])) {
  const kind = parts[1];
  const top = [];
  if (kind === "lights")   top.push(this.fyWidget({ id: "lp", type: "summary",    label: "Light",         title: "6 areas have lights on", action: "Turn off" }));
  if (kind === "climate")  top.push(this.fyWidget({ id: "cp", type: "data-point", label: "Climate",       title: "Average temperature", data: "21.2°" }));
  if (kind === "security") top.push(this.fyWidget({ id: "sp", type: "summary",    label: "Security",      title: "1 door unlocked", action: "Lock" }));
  if (kind === "media")    top.push(this.fyWidget({ id: "mp", type: "media",      label: "Media playing", title: "Abbey Road, The Beatles" }));
  return this.panelWrap([
    ...top,
    this.panelCard("Activity", this.activityCardBody(null)),
    this.panelCard("Automations", this.autoCardBody(null), admin ? () => this.go("/automations") : null),
  ]);
}
```

## Ideas to build on later

- Make widgets **rankable / time-aware** — surface energy spikes in the evening, "people arriving" around commute time, the update alert only when one exists.
- **Per-persona** feeds (admin sees system/update alerts; family members see presence + media).
- Inline **quick actions** beyond the single button (e.g. snooze, "show me", jump to the area).
- Dismiss should optionally **persist** and feed a "recently dismissed" affordance.
