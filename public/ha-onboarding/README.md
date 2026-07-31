# Home Assistant onboarding — interactive concept

A faithful, clickable duplicate of the Home Assistant onboarding flow, from the
"Preparing Home Assistant" screen through to the default dashboard.

**Open `index.html` in any browser.** No build step, no dependencies, works offline.

## Flow

1. **Preparing Home Assistant** — download progress, auto-advances
2. **Welcome** — "Create my smart home", plus restore paths:
   - **Upload backup** (drop zone)
   - **Home Assistant Cloud** (Nabu Casa sign-in)
3. **Create user** — username auto-derives from name; "Create account" stays disabled until the passwords match
4. **Home location** — dark CARTO-style map, address search with suggestions, GPS button, zoom, draggable pin
5. **Country** — floating-label select
6. **Help us help you** — the four analytics toggles, all off by default
7. **All set!** — finish
8. **Dashboard** — the default light dashboard: "Welcome {name}", Areas cards, Summaries, collapsible icon rail

Values typed during onboarding carry through: the name drives the dashboard
greeting and the avatar initial. The ↺ button in the dashboard header restarts
the whole flow.

Responsive — the icon rail becomes an overlay drawer below 880px.

## Source

- `HA Onboarding.dc.html` — the editable source
- `index.html` — self-contained build (this is what you open/host)
- `_ds/` — Home Assistant design system tokens, fonts, and assets

Built against the [Home Assistant frontend](https://github.com/home-assistant/frontend)
design language.
