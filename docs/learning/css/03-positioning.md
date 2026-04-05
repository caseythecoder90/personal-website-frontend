# Positioning

> `docs/learning/css/03-positioning.md`

---

## The Problem Positioning Solves

By default, HTML elements follow **normal flow** — block elements stack top to bottom,
inline elements flow left to right. Positioning lets elements break out of this flow.

## Position Values

### `static` (default)
Every element starts as `position: static`. It sits in normal flow — you can't use
`top`, `left`, `right`, or `bottom` on it.

### `relative`
The element stays in its normal position in the flow, but you can **nudge** it:

```css
.nudged {
  position: relative;
  top: 10px;     /* push down 10px from where it naturally sits */
  left: 20px;    /* push right 20px from where it naturally sits */
}
```

The key thing: the element still **occupies its original space** in the flow.
Other elements don't move to fill the gap. It just visually shifts.

More commonly, `relative` is used as a **positioning anchor** for `absolute` children
(see below).

### `absolute`
The element is **removed from normal flow** — other elements act as if it doesn't
exist. It positions itself relative to its **nearest positioned ancestor** (any parent
that has `position: relative`, `absolute`, or `fixed`).

```css
.parent {
  position: relative;    /* creates a positioning context */
}
.badge {
  position: absolute;
  top: 0;                /* 0px from parent's top edge */
  right: 0;              /* 0px from parent's right edge */
}
```

This is how you place a notification badge in the corner of a card, or a close
button in the corner of a modal.

**If no ancestor is positioned**, the element positions relative to the `<html>`
element (the entire page).

### `fixed`
Like `absolute`, but positions relative to the **browser viewport** (the visible
screen area). It stays in place even when you scroll.

```css
.navbar {
  position: fixed;
  top: 0;           /* stick to top of screen */
  left: 0;
  right: 0;         /* stretch full width */
  z-index: 50;      /* sit above other content */
}
```

This is how your Navbar stays visible at all times. The tradeoff: since `fixed`
removes the element from flow, content will slide behind it. That's why you add
`padding-top` to the next element to compensate.

### `sticky`
A hybrid: the element behaves as `relative` (stays in flow) until you scroll past
a certain point, then it "sticks" and behaves like `fixed`.

```css
.section-header {
  position: sticky;
  top: 0;            /* stick when it reaches the top of the viewport */
}
```

Useful for table headers, section labels, or sidebars that should scroll with
content but then lock in place.

## z-index — Stacking Order

When elements overlap (due to positioning, transforms, etc.), `z-index` controls
which one appears on top. Higher number = closer to viewer.

```css
.background { z-index: 0; }   /* bottom layer */
.content { z-index: 10; }     /* middle layer */
.navbar { z-index: 50; }      /* top layer — above everything */
.modal { z-index: 100; }      /* highest — above even the navbar */
```

**z-index only works on positioned elements** (anything except `static`).

## Tailwind Mapping

| Tailwind | CSS |
|----------|-----|
| `relative` | `position: relative` |
| `absolute` | `position: absolute` |
| `fixed` | `position: fixed` |
| `sticky` | `position: sticky` |
| `top-0` | `top: 0` |
| `right-0` | `right: 0` |
| `bottom-0` | `bottom: 0` |
| `left-0` | `left: 0` |
| `inset-0` | `top: 0; right: 0; bottom: 0; left: 0` (all sides) |
| `z-50` | `z-index: 50` |
| `z-10` | `z-index: 10` |

## The `inset` Shorthand

`inset` is shorthand for setting all four sides at once:

```css
inset: 0;   /* equivalent to: top: 0; right: 0; bottom: 0; left: 0; */
```

Tailwind: `inset-0`. This is commonly used with `absolute` to make a child fill its
positioned parent completely (like an overlay).

---

## Common Patterns

### Fixed Navbar (Your Project)
```css
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
}
.main-content {
  padding-top: 64px;   /* compensate for navbar height */
}
```
Tailwind: `fixed top-0 left-0 right-0 z-50` on navbar, `pt-16` on main.

### Absolute Badge in Corner
```css
.card {
  position: relative;          /* anchor for the badge */
}
.badge {
  position: absolute;
  top: 8px;
  right: 8px;
}
```
Tailwind: `relative` on parent, `absolute top-2 right-2` on badge.

### Full-Screen Overlay
```css
.overlay {
  position: fixed;
  inset: 0;                    /* cover entire viewport */
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.5);  /* semi-transparent black */
}
```
Tailwind: `fixed inset-0 z-100 bg-black/50`

---

## In Your Project

From `Navbar.tsx`:
```
className="fixed top-0 left-0 right-0 z-50 ..."
```
- `fixed` → removed from flow, positioned against viewport
- `top-0 left-0 right-0` → pinned to top, stretches full width
- `z-50` → stacks above all normal content

From `Layout.tsx`, the `<main>`:
```
className="flex-1 pt-16"
```
- `pt-16` → 64px of top padding so content isn't hidden behind the 64px-tall navbar
