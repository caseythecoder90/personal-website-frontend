# Responsive Design

> `docs/learning/css/07-responsive-design.md`

---

## The Problem

A layout that works on a 1440px desktop monitor won't work on a 375px phone screen.
Responsive design means your UI adapts to different screen sizes.

## Media Queries — The CSS Mechanism

In plain CSS, you use `@media` rules to apply styles conditionally:

```css
/* Default: applies to ALL screen sizes */
.nav-links {
  display: none;          /* hidden on small screens */
}

/* At 768px and wider: override the default */
@media (min-width: 768px) {
  .nav-links {
    display: flex;        /* show links on tablets and up */
  }
}
```

The `min-width` approach means styles apply from that breakpoint **upward**.
This is called **mobile-first** design: you write the small-screen layout as
the default, then add complexity for larger screens.

## Tailwind's Breakpoint System

Tailwind makes media queries simple with responsive prefixes. Unprefixed classes
apply to **all screen sizes**. Prefixed classes apply at that breakpoint **and above**.

| Prefix | Min width | Roughly |
|--------|-----------|---------|
| (none) | 0px | All screens (the default/mobile) |
| `sm:` | 640px | Large phones in landscape |
| `md:` | 768px | Tablets |
| `lg:` | 1024px | Laptops |
| `xl:` | 1280px | Desktops |
| `2xl:` | 1536px | Large desktops |

### How to Read It

`hidden md:flex` means:
- At 0px-767px: `display: none` (hidden)
- At 768px+: `display: flex` (visible)

`text-5xl md:text-7xl` means:
- At 0px-767px: 3rem (48px) font
- At 768px+: 4.5rem (72px) font

`grid-cols-1 md:grid-cols-2 lg:grid-cols-3` means:
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns

### Mental Model

Think of it as **layering overrides from small to large**:

```
0px ──────── 640px ──────── 768px ──────── 1024px ──────── 1280px
  (base)       sm:            md:            lg:              xl:
  ←──── each prefix overrides everything to its left ────→
```

A class without a prefix is the **foundation**. Each responsive prefix adds an
override for larger screens. You don't need to repeat values — they cascade upward.

## CSS Grid — Responsive Layouts

Grid is another layout system (alongside Flexbox). While Flexbox is one-dimensional
(row OR column), Grid is two-dimensional (rows AND columns simultaneously).

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);   /* 3 equal columns */
  gap: 32px;
}
```

`1fr` means "1 fraction of available space." Three columns of `1fr` each means
each column gets 1/3 of the width.

| Tailwind | CSS |
|----------|-----|
| `grid` | `display: grid` |
| `grid-cols-1` | `grid-template-columns: repeat(1, 1fr)` |
| `grid-cols-2` | `grid-template-columns: repeat(2, 1fr)` |
| `grid-cols-3` | `grid-template-columns: repeat(3, 1fr)` |
| `grid-cols-12` | 12 columns (for precise layouts) |
| `col-span-2` | Element spans 2 columns |
| `col-span-7` | Element spans 7 columns |

### The 12-Column Grid

A 12-column grid is common because 12 is divisible by 2, 3, 4, and 6:
- `col-span-6` = half width
- `col-span-4` = one-third
- `col-span-3` = one-quarter
- `col-span-7` + `col-span-5` = asymmetric split

Your homepage hero uses this:
```
grid md:grid-cols-12
```
With `md:col-span-7` for the text and `md:col-span-5` for the photo — an
intentionally asymmetric split that gives more space to the text.

## The `max-w-*` Container Pattern

On large screens, you don't want content stretching edge-to-edge. The standard
pattern is:

```css
.container {
  max-width: 1280px;     /* content stops growing at 1280px */
  margin-left: auto;
  margin-right: auto;    /* auto margins = centered horizontally */
  padding-left: 24px;
  padding-right: 24px;   /* breathing room on edges */
}
```

Tailwind: `max-w-7xl mx-auto px-6`

This appears on almost every section in your project. It means:
- On small screens: content fills width with 24px padding on each side
- On large screens: content maxes out at 1280px and centers itself

---

## Common Responsive Patterns

### Show/Hide Elements
```
hidden md:flex          → hidden on mobile, flex on tablet+
md:hidden               → visible on mobile, hidden on tablet+
hidden sm:inline-block  → hidden on mobile, inline-block on 640px+
```

### Responsive Text Sizing
```
text-5xl md:text-7xl    → 48px on mobile, 72px on desktop
text-lg md:text-xl      → 18px → 20px
```

### Responsive Grid
```
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
→ 1 column → 2 columns → 3 columns
```

### Responsive Spacing
```
px-6 md:px-12           → 24px padding → 48px padding
py-24 md:py-32          → 96px → 128px vertical padding
gap-8 md:gap-12         → 32px → 48px gap between grid items
```

### Responsive Flex Direction
```
flex flex-col md:flex-row
→ stacked vertically on mobile, side by side on desktop
```

---

## In Your Project

From `Navbar.tsx`:
```
<div className="hidden items-center gap-8 md:flex">
```
Desktop nav links: hidden by default, shown as flex row at 768px+.

```
<button className="... md:hidden">
```
Hamburger menu button: visible by default, hidden at 768px+.

These two work together: on mobile you see the hamburger, on desktop you see the
link row. They swap visibility at the `md:` breakpoint.

From the Stitch home page design:
```
grid md:grid-cols-12 gap-12 items-center
```
The hero section: single column on mobile, 12-column grid on desktop, with the text
spanning 7 columns and the photo spanning 5.
