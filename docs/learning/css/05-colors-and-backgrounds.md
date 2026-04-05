# Colors & Backgrounds

> `docs/learning/css/05-colors-and-backgrounds.md`

---

## How Colors Work in CSS

### Color Formats

CSS supports several ways to express colors:

```css
/* Named colors */
color: white;
color: red;

/* Hex — 6 digits, pairs of red/green/blue (00-FF each) */
color: #ffffff;     /* white: full red + full green + full blue */
color: #0e0e0e;     /* near-black: very low R, G, B */
color: #a3a6ff;     /* indigo: high red, high green, full blue */

/* RGB — same as hex but in decimal (0-255) */
color: rgb(163, 166, 255);

/* RGBA — RGB + alpha (opacity from 0 to 1) */
color: rgba(163, 166, 255, 0.3);   /* 30% opacity */

/* HSL — hue (0-360°), saturation (%), lightness (%) */
color: hsl(238, 100%, 82%);
```

For your project, hex codes are used throughout the design system. The `@theme`
block maps them to semantic names so you never hard-code hex values in components.

### Which CSS Property Gets Which Color

This is where beginners often get confused — CSS has different properties for
different "parts" of an element:

```css
.button {
  color: #0f00a4;              /* TEXT color */
  background-color: #a3a6ff;   /* FILL/BACKGROUND color */
  border-color: #494847;       /* BORDER color */
}
```

## Tailwind Prefix System

Tailwind uses **prefixes** to indicate which CSS property a color applies to:

| Prefix | CSS Property | What it colors |
|--------|-------------|----------------|
| `text-` | `color` | Text and icons |
| `bg-` | `background-color` | Background fill |
| `border-` | `border-color` | Border line |
| `ring-` | `box-shadow` (ring) | Focus ring outline |
| `shadow-` | `box-shadow` | Drop shadow |

So for your primary color (#a3a6ff):
- `text-primary` → text is indigo
- `bg-primary` → background is indigo
- `border-primary` → border is indigo

These are **different CSS properties** even though they reference the same color token.

## Opacity

### Element Opacity

```css
opacity: 0.6;   /* entire element at 60% — affects everything including children */
```

Tailwind: `opacity-60`

### Color-Specific Opacity

You often want just the background to be transparent, not the text on top of it.
CSS uses `rgba()` for this:

```css
background-color: rgba(19, 19, 19, 0.7);   /* 70% opaque background */
color: #ffffff;                              /* text stays fully opaque */
```

Tailwind's slash syntax: `bg-surface-container-low/70`

The `/70` means 70% opacity applied **only to that color**, not to the whole element.
This is different from `opacity-70` which would make everything transparent.

This distinction matters for your Navbar glass effect:
- `bg-surface-container-low/70` → background is semi-transparent (you see through it)
- Text inside remains fully opaque and readable

## Gradients

```css
background: linear-gradient(135deg, #a3a6ff, #6063ee);
```

This creates a gradient that flows at 135 degrees (top-left to bottom-right)
from `#a3a6ff` (primary) to `#6063ee` (primary-dim).

| Tailwind | CSS |
|----------|-----|
| `bg-gradient-to-r` | `linear-gradient(to right, ...)` |
| `bg-gradient-to-br` | `linear-gradient(to bottom right, ...)` — ~135deg |
| `from-primary` | Start color = primary |
| `to-primary-dim` | End color = primary-dim |

Combined: `bg-gradient-to-br from-primary to-primary-dim`

This is used on your CTA buttons (the "Resume" and "Hire Me" buttons).

---

## Your Design System's Color Architecture

Your design uses a **surface hierarchy** — different shades of near-black that create
depth through subtle contrast rather than borders or shadows:

```
Darkest ← ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ → Lightest

#000000    #0e0e0e    #131313    #1a1919    #201f1f    #262626    #2c2c2c
 lowest     surface    low        base       high       highest    bright
(inputs)   (page bg)  (sections) (cards)    (hover)    (elevated) (bright)
```

When a card (#1a1919) sits on a section background (#131313), the slight color
difference creates a visual boundary **without needing a border line**. This is the
"No-Line Rule" from your DESIGN.md.

### Text Color Pairing

| Background | Text color | Why |
|-----------|-----------|-----|
| Any surface | `on-surface` (#ffffff) | White — primary content, high contrast |
| Any surface | `on-surface-variant` (#adaaaa) | Gray — secondary content, softer |
| `primary` bg | `on-primary` (#0f00a4) | Dark blue — readable on light indigo |

The `on-*` naming convention means "the text color to use when placed **on** that
background." They're paired to ensure sufficient contrast for readability.

---

## In Your Project

From `Navbar.tsx`:
```
className="... bg-surface-container-low/70 backdrop-blur-[16px] border-b border-outline-variant/15"
```
- `bg-surface-container-low/70` → #131313 at 70% opacity (semi-transparent dark)
- `border-b` → border on bottom edge only
- `border-outline-variant/15` → #494847 at 15% opacity (ghost border — barely visible)

From `Navbar.tsx`, the Resume button:
```
className="... bg-gradient-to-br from-primary to-primary-dim ... text-on-primary
  shadow-[0_0_15px_rgba(163,166,255,0.3)]"
```
- `bg-gradient-to-br from-primary to-primary-dim` → indigo gradient
- `text-on-primary` → dark blue text readable on the indigo background
- `shadow-[0_0_15px_rgba(163,166,255,0.3)]` → a soft indigo glow around the button
  (this is the "accent glow" from your design system)
