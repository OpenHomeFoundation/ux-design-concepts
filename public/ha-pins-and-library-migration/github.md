# GitHub source

Reference only — this project is not built from a repo, but Stage 0 (today's
Home Assistant look) draws exact color values from the HA frontend.

repo: home-assistant/frontend
branch: dev
path: src/resources/theme/color

## Last sync
date: 2026-08-31T14:44:31Z

### Read in this project
- Default light and dark theme color tokens (`color.globals.ts`) used for the
  Stage 0 "today's sidebar" palette: sidebar background = card
  (`#1c1c1c` dark), text `#e1e1e1`, divider `rgba(225,225,225,0.12)`, idle icon
  `rgba(225,225,225,0.6)`, selected = primary `#009ac7`, page `#111111`.

## Screen map
| Screen | Built from |
| --- | --- |
| Stage 0 today sidebar / topbar / settings (`todayColors`, `renderTodaySidebar`, `renderTodayTopbar`, `todaySettingsBody`) | home-assistant/frontend `src/resources/theme/color/color.globals.ts` |
