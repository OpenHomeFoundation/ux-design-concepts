# Inputs: radius and treatment plan

Scope narrowed to **input fields**: the DS `Input` (text / search / number),
and the select-style triggers that share its visual treatment
(`ccOverlaySelect`, `ccMultiSelect`). The broader form questions (a Textarea
component, consolidating label helpers, Radio's fate) are parked; this is about
making every input look like it belongs to the same family.

Companion to `overlays.md`.

---

## The thing we noticed: mixed corner radii

Most inputs are square-ish; a few are pills. The audit:

| Surface | Radius today | Where |
| --- | --- | --- |
| Text `Input` | `--radius-md` (8px) | name, nickname, pronouns, mail, phone, password, area name, home name |
| Number `Input` | `--radius-md` (8px) | elevation |
| Search `Input`, desktop / tablet | `--radius-md` (8px) | every collection toolbar |
| **Search `Input`, mobile** | **`--radius-full` (9999px, pill)** | same toolbars, mobile only |
| `ccOverlaySelect` trigger | `--radius-md` (8px) | time zone, currency, language, source, building, floor |
| `ccMultiSelect` trigger | `--radius-md` (8px) | filter multi-pickers |

So there is exactly **one inconsistency**: search becomes a full pill on mobile
and a square-cornered field everywhere else. The override that does it:

```css
.cc-bp-mobile .ha-input--search { border-radius: var(--radius-full) !important; }
```

Everything else is already a consistent 8px. The decision is just: **what is
the radius rule for inputs, and does search get to be different?**

---

## The decision

Two clean options. Pick one and apply it everywhere; do not keep the
breakpoint-conditional pill.

**Option A — one radius, no exceptions (recommended).**
Every input, every variant, every breakpoint is `--radius-md` (8px). Delete the
mobile search override. Search stops being a special shape; its magnifier icon
and placeholder already mark it as search, so the pill is decoration we don't
need. This is the most defensible reading of the DS ("8px default on most UI")
and the simplest rule to hold.

**Option B — search is a pill, on purpose, everywhere.**
If we like the pill, commit to it: search inputs are `--radius-full` on *all*
breakpoints, not just mobile. That makes "search = pill, everything else =
8px" a real, teachable rule rather than an accident of one media query. Costs:
search no longer visually matches the toolbar's other 8px controls
(filter button, view toggle) sitting right next to it on desktop.

Recommendation is **A**. The pill reads as a stray mobile-ism, and search
already announces itself through the icon. If the team prefers the softer pill
feel, B is fine but must be applied at all sizes.

---

## The rule (to lock, assuming Option A)

- **All inputs use `--radius-md` (8px).** Text, search, number, and the
  `ccOverlaySelect` / `ccMultiSelect` triggers. One value, no breakpoint
  branches, no per-site overrides.
- Radius is **not** a state signal. Focus is the accent border, error is the
  red border, disabled is the muted fill. Corners never change to mean
  something.
- Pills (`--radius-full`) stay reserved for what they already mark in this
  system: chips, badges, count bubbles, and the round topbar buttons. An input
  is not a chip.
- The number field's unit suffix (`cc-input-suffix`) and the search field's
  clear glyph are treatments *inside* the 8px box; they do not change its
  shape.

---

## Change

One line. Delete:

```css
.cc-bp-mobile .ha-input--search { border-radius: var(--radius-full) !important; }
```

That alone makes every input 8px at every size. Nothing else references a
non-md radius on an input, so there is no follow-on cleanup. (If we go with
Option B instead, replace that override with an unconditional
`.ha-input--search { border-radius: var(--radius-full) !important; }`.)

---

## Open decision

- **A or B?** One radius for everything, or search-as-pill committed across all
  breakpoints. Everything downstream is the same one-line edit either way.
