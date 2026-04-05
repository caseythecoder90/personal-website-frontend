# The Box Model

> `docs/learning/css/01-box-model.md`

---

## The Core Concept

Every HTML element — a `<div>`, a `<button>`, a `<p>` — is a **rectangular box**.
CSS controls four layers of that box, from inside out:

```
┌──────────────────────────────────┐
│            MARGIN                │  ← space between this box and neighbors
│  ┌────────────────────────────┐  │
│  │          BORDER            │  │  ← the visible edge
│  │  ┌──────────────────────┐  │  │
│  │  │       PADDING        │  │  │  ← space inside, between border and content
│  │  │  ┌────────────────┐  │  │  │
│  │  │  │    CONTENT      │  │  │  │  ← the actual text, image, etc.
│  │  │  └────────────────┘  │  │  │
│  │  └──────────────────────┘  │  │
│  └────────────────────────────┘  │
└──────────────────────────────────┘
```

Think of it like a framed picture on a wall:
- **Content** = the actual picture
- **Padding** = the matting inside the frame (space between picture and frame edge)
- **Border** = the frame itself
- **Margin** = the gap between this frame and the next one on the wall

## CSS Properties

```css
.card {
  /* Content size */
  width: 300px;
  height: auto;              /* auto = grow to fit content (the default) */

  /* Padding — space INSIDE the box */
  padding: 32px;             /* all 4 sides */
  padding-top: 16px;         /* individual sides */
  padding-left: 24px;
  padding-right: 24px;

  /* Border — the visible edge */
  border: 1px solid #ccc;    /* width | style | color */

  /* Margin — space OUTSIDE the box */
  margin: 16px;              /* all 4 sides */
  margin-bottom: 32px;       /* individual side */
}
```

### Shorthand Patterns

CSS has shorthand for setting multiple sides at once:

```css
/* One value: all 4 sides */
padding: 16px;

/* Two values: vertical | horizontal */
padding: 16px 24px;       /* top/bottom = 16px, left/right = 24px */

/* Four values: top | right | bottom | left (clockwise from top) */
padding: 8px 16px 8px 16px;
```

## Tailwind Mapping

Tailwind's spacing scale: the number × 4 = pixels.

| Tailwind | Pixels | CSS |
|----------|--------|-----|
| `p-1` | 4px | `padding: 4px` |
| `p-2` | 8px | `padding: 8px` |
| `p-4` | 16px | `padding: 16px` |
| `p-6` | 24px | `padding: 24px` |
| `p-8` | 32px | `padding: 32px` |

### Direction Prefixes

| Prefix | Meaning | Sides affected |
|--------|---------|---------------|
| `p-` | all | top, right, bottom, left |
| `px-` | horizontal (x-axis) | left and right |
| `py-` | vertical (y-axis) | top and bottom |
| `pt-` | top | top only |
| `pr-` | right | right only |
| `pb-` | bottom | bottom only |
| `pl-` | left | left only |

The same prefixes work for margin — just replace `p` with `m`:
`m-4`, `mx-6`, `mt-2`, etc.

### Width and Height

| Tailwind | CSS | Notes |
|----------|-----|-------|
| `w-full` | `width: 100%` | Full width of parent |
| `w-72` | `width: 288px` | 72 × 4px |
| `h-16` | `height: 64px` | 16 × 4px |
| `h-screen` | `height: 100vh` | Full viewport height |
| `min-h-screen` | `min-height: 100vh` | At least full viewport |
| `max-w-7xl` | `max-width: 80rem` (1280px) | Constrain width |

## box-sizing: border-box

One gotcha: by default in CSS, `width` only sets the **content** width. Padding and
border are added on top. So a `width: 300px` box with `padding: 32px` is actually
364px wide (300 + 32 + 32).

Modern CSS (and Tailwind) uses `box-sizing: border-box`, which makes `width` include
padding and border. So `width: 300px` with `padding: 32px` stays at 300px total —
the content area shrinks to 236px to accommodate the padding.

Tailwind sets `border-box` globally, so you don't need to think about this. But it's
worth knowing in case you ever read raw CSS that behaves unexpectedly.

## In Your Project

From `Navbar.tsx`:
```
className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6"
```

Breaking down just the box model parts:
- `h-16` → `height: 64px` (the navbar is 64px tall)
- `max-w-7xl` → `max-width: 1280px` (content doesn't stretch beyond 1280px)
- `mx-auto` → `margin-left: auto; margin-right: auto` (centers the box horizontally)
- `px-6` → `padding-left: 24px; padding-right: 24px` (horizontal breathing room)
