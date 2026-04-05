# Display & Flexbox

> `docs/learning/css/02-display-and-flexbox.md`

---

## Display Property — The Fundamentals

Every element has a default display mode that controls how it participates in layout:

```css
display: block;        /* takes full width, stacks vertically */
display: inline;       /* sits within the flow of text, only as wide as content */
display: inline-block; /* inline but respects width/height/padding */
display: flex;         /* enables Flexbox layout on children */
display: none;         /* completely hidden, takes up no space */
```

### Block vs Inline

**Block elements** (`<div>`, `<p>`, `<h1>`, `<section>`) are like paragraphs —
each one starts on a new line and stretches to fill the full width:

```
[=============BLOCK ELEMENT==============]
[=============BLOCK ELEMENT==============]
```

**Inline elements** (`<span>`, `<a>`, `<strong>`) are like words in a sentence —
they sit next to each other and only take up as much width as their content:

```
[inline] [inline] [inline]
```

| Tailwind | CSS | Use when |
|----------|-----|----------|
| `block` | `display: block` | Element should take full width |
| `inline` | `display: inline` | Element should sit in text flow |
| `inline-block` | `display: inline-block` | Inline but needs width/padding |
| `hidden` | `display: none` | Element should disappear completely |

---

## Flexbox — The Layout System You'll Use Constantly

Flexbox solves the problem of arranging elements in a row or column with precise
control over alignment and spacing.

When you set `display: flex` on a container, two things happen:
1. The container becomes a **flex container**
2. Its direct children become **flex items**

### The Two Axes

Flexbox works along two axes:

```
Main Axis (default: horizontal →)
┌─────────────────────────────────────┐
│ [Item A]   [Item B]   [Item C]      │  ↕ Cross Axis
└─────────────────────────────────────┘    (default: vertical)
```

- **Main axis**: the direction items flow (default: left to right)
- **Cross axis**: perpendicular to main axis (default: top to bottom)

### flex-direction — Which Way Items Flow

```css
flex-direction: row;            /* left → right (default) */
flex-direction: row-reverse;    /* right → left */
flex-direction: column;         /* top → bottom */
flex-direction: column-reverse; /* bottom → top */
```

| Tailwind | CSS |
|----------|-----|
| `flex` | `display: flex` (defaults to row) |
| `flex-row` | `flex-direction: row` |
| `flex-col` | `flex-direction: column` |

### justify-content — Distribute Along Main Axis

This controls how items are spaced along the **main axis** (horizontal by default):

```
justify-content: flex-start (default)
[A] [B] [C]                    ← items packed to the start

justify-content: center
         [A] [B] [C]           ← items centered

justify-content: flex-end
                    [A] [B] [C] ← items packed to the end

justify-content: space-between
[A]          [B]          [C]   ← first and last at edges, equal space between

justify-content: space-around
  [A]      [B]      [C]        ← equal space around each item
```

| Tailwind | CSS |
|----------|-----|
| `justify-start` | `justify-content: flex-start` |
| `justify-center` | `justify-content: center` |
| `justify-end` | `justify-content: flex-end` |
| `justify-between` | `justify-content: space-between` |

### align-items — Align Along Cross Axis

This controls alignment on the **cross axis** (vertical by default):

```
align-items: stretch (default)     align-items: center
┌──────────────────────┐          ┌──────────────────────┐
│ [A====] [B====] [C==]│          │                      │
│ [     ] [     ] [   ]│          │ [A] [B===] [C]       │
│ [     ] [     ]      │          │                      │
└──────────────────────┘          └──────────────────────┘
All items stretch to fill          Items centered vertically
```

| Tailwind | CSS |
|----------|-----|
| `items-stretch` | `align-items: stretch` (default) |
| `items-center` | `align-items: center` |
| `items-start` | `align-items: flex-start` |
| `items-end` | `align-items: flex-end` |

### gap — Space Between Items

```css
gap: 32px;          /* space between all items */
column-gap: 16px;   /* horizontal space only */
row-gap: 8px;       /* vertical space only */
```

| Tailwind | CSS |
|----------|-----|
| `gap-8` | `gap: 32px` |
| `gap-x-4` | `column-gap: 16px` |
| `gap-y-2` | `row-gap: 8px` |

### Flex Item Properties

These go on the **children**, not the container:

```css
flex: 1;          /* grow to fill available space */
flex: none;       /* don't grow or shrink */
flex-shrink: 0;   /* refuse to shrink below natural size */
```

| Tailwind | CSS | When to use |
|----------|-----|-------------|
| `flex-1` | `flex: 1 1 0%` | Fill remaining space |
| `flex-none` | `flex: none` | Stay at natural size |
| `shrink-0` | `flex-shrink: 0` | Don't compress when space is tight |

### flex-wrap — What Happens When Items Overflow

By default, flex items all squeeze onto one line. `flex-wrap` lets them wrap:

```css
flex-wrap: nowrap;  /* all on one line, items shrink (default) */
flex-wrap: wrap;    /* items wrap to next line when they don't fit */
```

| Tailwind | CSS |
|----------|-----|
| `flex-wrap` | `flex-wrap: wrap` |
| `flex-nowrap` | `flex-wrap: nowrap` |

---

## Common Flexbox Patterns

### Navbar: Logo Left, Links Right
```css
.navbar {
  display: flex;
  justify-content: space-between;  /* push to opposite ends */
  align-items: center;             /* vertically center */
}
```
Tailwind: `flex justify-between items-center`

### Centering Something Perfectly
```css
.container {
  display: flex;
  justify-content: center;   /* horizontal center */
  align-items: center;       /* vertical center */
}
```
Tailwind: `flex justify-center items-center`

### Vertical Stack with Spacing
```css
.stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
```
Tailwind: `flex flex-col gap-4`

### Full-Height Page Layout
```css
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;     /* at least full screen height */
}
.main-content {
  flex: 1;               /* grow to fill space between header and footer */
}
```
Tailwind: parent = `flex flex-col min-h-screen`, main = `flex-1`

---

## In Your Project

From `Layout.tsx`:
```
className="flex min-h-screen flex-col bg-surface"
```
This makes the page a vertical flex column that's at least screen height.
The `<main>` has `flex-1` so it expands to fill space between Navbar and Footer.

From `Navbar.tsx`:
```
className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6"
```
- `flex` → `display: flex` (children in a row)
- `items-center` → vertically center the logo, links, and button
- `justify-between` → logo on left, links in middle, button on right
