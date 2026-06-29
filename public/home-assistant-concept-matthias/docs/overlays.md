# Overlays: sheets and dialogs

Rules for every modal surface in the Concept Car. **In scope:** bottom sheets,
dialogs, confirmations. **Out of scope:** popovers and overflow/contextual menus
(a tap target spawning a small anchored list) — those are not modal and follow
their own pattern.

Visual reference: `Overlays Spec.dc.html`.

---

## The model: one engine, two presentations

A single overlay primitive picks its shape from the viewport. Content and
behavior are identical; only the frame changes.

- **Bottom sheet** (`< 768px`) — rises from the bottom edge, full width,
  detent-sized, draggable.
- **Centered dialog** (`>= 768px`) — fixed-width card centered over the scrim,
  no detents, no drag. (Retires the old DS side-sheet idea.)

**One exception — the confirmation dialog.** A confirmation does not switch
shape by viewport. It is a small centered card on **both** mobile and desktop
(smaller than the standard dialog), with no X. See below.

---

## Rules (locked)

### Scrim
- Default on, always `--color-scrim` (`rgba(0,0,0,0.55)`). **No blur.**
- Omit the scrim only when the surface behind must stay live. The **Map** sheet
  is the standing exception (you keep seeing the map while the sheet is up).
- **Map scrim at max detent:** the Map sheet shows no scrim at its smaller
  detents, but once dragged to the **biggest** detent a scrim fades in behind
  the panel (the map is no longer the focus). Tapping it collapses the sheet
  back to the smallest detent. Implemented via `scrimAtMax` on the sheet spec.

### Background by type
- Bottom sheets and the standard dialog use **`--color-surface`** (`#222226`) —
  the app's card surface, matching the mobile tab bar. When a sheet carries
  preview tiles or cards, those tiles raise to **`--color-surface-raised`** so
  they still read as elevated, rather than darkening the whole sheet.
- **`--color-overlay`** (`#36363e`) is reserved for the compact centered
  dialogs that have no inner cards: the **confirmation dialog** and the
  **search palette**.

### Header
- The header carries **only the title** (plus the close X / back affordance).
  Any description or helper text goes in the **body**, not the header. Keeps the
  header scannable and consistent across sheet and dialog.

### Radius
- Bottom sheet top corners: `--radius-2xl` (24px).
- Dialog and confirmation: `--radius-xl` (16px).

### Motion
- Sheet: slide up (`translateY(100%) -> 0`).
- Dialog / confirmation: fade + scale from `.96` (`cc-dialog-in`).
- Scrim: fade (`cc-scrim-in`).
- One curve. **Every overlay animates in.** `prefers-reduced-motion` collapses
  all of it (handled by `reduceMotion()` / the token media query).

### Detents
- **Dismissible sheets have a single detent at the biggest height** (filters,
  display options, add / configure widget). They do not resize: drag down to
  close, otherwise they snap back to full height. Never size to content.
- The **persistent Map sheet** is the exception: it has three detents
  (`[0.4, 0.7, 0.97]`), opens at the **smallest**, and you drag to resize
  between them (a scrim fades in at the biggest — see Scrim).
- Drag works from the **whole surface, not just the handle**. Inner scroll
  takes over once content overflows at the biggest detent.
- Dialogs and confirmations never have detents.

### Close affordance
| | Dismissible sheet | Persistent sheet (Map) | Dialog | Confirmation |
|---|---|---|---|---|
| Drag handle | no | **yes** | n/a | n/a |
| X icon (top-**left**) | **yes** | no | **yes** | **no** |
| Drag to close | yes | no (resize only) | n/a | n/a |
| Scrim tap | yes | n/a | yes | **only if non-destructive** |
| Escape | yes | n/a | yes | yes (cancels) |

- Handle and X are **mutually exclusive**: the handle signals "this stays, drag
  to resize"; the X signals "this closes". Confirmations have neither — they
  close through their buttons.
- The close X is the **leading (top-left)** control. When the overlay is a
  **sub-step** (a back arrow is present — filter drill-down, add → configure
  widget), the **back arrow takes that left slot and the X is dropped**: go
  back, then close. There is no trailing right-side X.

### Primary action (optional, same concept in both forms)
- Sheet: **full-width button pinned to the bottom**.
- Dialog: **right-aligned** action row.
- Omit it when the modal applies changes immediately (e.g. a live settings list).
- Destructive actions use the `danger` Button variant.

### Confirmation dialog
- Always a compact centered card on **every** breakpoint (never a bottom sheet).
  Smaller than the standard dialog, **no X**.
- Title, one line of body, then Cancel + the confirm action (`danger` when
  destructive).
- For **destructive** choices, scrim-tap does **not** dismiss — the decision
  must be explicit (Cancel or Escape only).

### The FAB "Add" sheet (deliberate exception)
- Keeps its own **behavior**: a quick-add menu anchored to the floating action
  button, not a full-width modal.
- Adopts the same **styling**: `--color-surface` background (matching the mobile
  tab bar it sits above), `--radius-2xl` corners, shared motion. Reads as part
  of the family, not as drift.

---

## Z-index scale

Defined in `design-tokens.css`. One ladder for every stacking layer so overlays
never collide:

```css
--z-base:    0;
--z-nav:     100;   /* app shell, sticky headers, bookmark rail/bar */
--z-popover: 500;   /* overflow menus, dropdowns, the FAB quick-add */
--z-scrim:   1000;  /* the modal/sheet backdrop */
--z-modal:   1001;  /* the panel/card sitting on the scrim */
--z-toast:   1100;  /* transient notifications, above everything */
```

> Note: React inline `style` objects use the **numeric literals** (`1000` /
> `1001`), not `var(--z-scrim)` — a CSS custom property does not reliably
> resolve for the `z-index` property in an inline style object. The tokens are
> the documented scale and the source of truth for any CSS-file usage; keep the
> JS literals in sync with them.

---

## Implementation map (current build)

All paths live in `Home Assistant Concept Car.dc.html`.

- **`renderSheet(spec, bp)`** — the bottom-sheet engine. Detents, drag, handle/X,
  `bg`, `footer`, two-level filter drill-down. Scrim `--color-scrim` @ `z 1000`,
  panel @ `z 1001`. Used by: Filters, Display options, Map, Add widget (mobile),
  Configure widget (mobile).
- **`fyScrim(bp, card, close)`** — the centered desktop dialog frame: shared
  scrim token, no blur, `cc-scrim-in` + `cc-dialog-in`. Used by Add widget /
  Configure widget (desktop) and the Display-options customize modal (desktop).
- **`askConfirm({ title, body, confirmLabel, cancelLabel, danger, onConfirm })`**
  + **`renderConfirm(bp)`** — the confirmation dialog. State lives in
  `state.confirm`; the host renders it once at the app root. Destructive variant
  blocks scrim-tap dismiss. Wired today on **Sign out** and **Remove widget**.
- **FAB "Add" sheet** (`renderAddSheet`) — exception; styling unified, behavior
  kept.
- **Search overlay** (`renderSearch`) — top-aligned command palette; unified
  scrim/z/entrance.

### Still to do (upstream / future)
- The z-index scale is added to the **local** `_ds/.../design-tokens.css` copy.
  Upstream it to the real design-system source
  (`/projects/fababd17-1e21-468b-98a9-76cd37494ccc/design-tokens.css`).
- Rebuild the DS `components/navigation/Sheet.jsx` **in place** (keep the name
  and import path) as the single source of truth — detents, the responsive
  sheet<->dialog switch, header + footer slots, the handle/X rule — and add a
  thin `ConfirmDialog` wrapper over it. Then point the app's `renderSheet` /
  `fyScrim` at it.
