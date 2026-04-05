# Typography

> `docs/learning/css/04-typography.md`

---

## Core Typography Properties

### font-family — Which Typeface

```css
font-family: 'Space Grotesk', sans-serif;
```

This is a **fallback chain**: the browser tries Space Grotesk first. If it's not
loaded yet (or fails), it falls back to the system's default sans-serif font.

In your project, fonts are registered in `@theme`:
```css
--font-headline: "Space Grotesk", sans-serif;
--font-body: "Inter", sans-serif;
```

And loaded via Google Fonts in `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700
  &family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

| Tailwind | CSS | Usage in your design |
|----------|-----|---------------------|
| `font-headline` | `font-family: 'Space Grotesk', sans-serif` | Headlines, nav links, buttons |
| `font-body` | `font-family: 'Inter', sans-serif` | Body text, descriptions |

### font-size — How Big

CSS uses several units for font size:

- `px` — absolute pixels (16px is a common body size)
- `rem` — relative to root font size (1rem = usually 16px)
- `em` — relative to parent's font size

| Tailwind | Size | Pixels (at default root) |
|----------|------|--------------------------|
| `text-xs` | 0.75rem | 12px |
| `text-sm` | 0.875rem | 14px |
| `text-base` | 1rem | 16px |
| `text-lg` | 1.125rem | 18px |
| `text-xl` | 1.25rem | 20px |
| `text-2xl` | 1.5rem | 24px |
| `text-3xl` | 1.875rem | 30px |
| `text-4xl` | 2.25rem | 36px |
| `text-5xl` | 3rem | 48px |
| `text-6xl` | 3.75rem | 60px |
| `text-7xl` | 4.5rem | 72px |

### font-weight — How Thick

```css
font-weight: 400;   /* normal */
font-weight: 500;   /* medium */
font-weight: 600;   /* semibold */
font-weight: 700;   /* bold */
```

| Tailwind | CSS | Weight |
|----------|-----|--------|
| `font-light` | `font-weight: 300` | Light |
| `font-normal` | `font-weight: 400` | Normal/Regular |
| `font-medium` | `font-weight: 500` | Medium |
| `font-semibold` | `font-weight: 600` | Semibold |
| `font-bold` | `font-weight: 700` | Bold |

### letter-spacing (tracking) — Space Between Letters

```css
letter-spacing: -0.02em;   /* tighten — letters closer together */
letter-spacing: 0;          /* normal */
letter-spacing: 0.05em;    /* loosen — letters farther apart */
```

Your design uses tight tracking on headlines (compact, modern feel) and wide
tracking on label text (the uppercase "tech pill" look).

| Tailwind | CSS |
|----------|-----|
| `tracking-tighter` | `letter-spacing: -0.05em` |
| `tracking-tight` | `letter-spacing: -0.025em` |
| `tracking-normal` | `letter-spacing: 0` |
| `tracking-wide` | `letter-spacing: 0.025em` |
| `tracking-wider` | `letter-spacing: 0.05em` |
| `tracking-widest` | `letter-spacing: 0.1em` |

### line-height (leading) — Space Between Lines

```css
line-height: 1;      /* no extra space — tight, good for large headlines */
line-height: 1.5;    /* comfortable reading for body text */
line-height: 1.75;   /* very spacious */
```

| Tailwind | CSS |
|----------|-----|
| `leading-none` | `line-height: 1` |
| `leading-tight` | `line-height: 1.25` |
| `leading-normal` | `line-height: 1.5` |
| `leading-relaxed` | `line-height: 1.625` |
| `leading-loose` | `line-height: 2` |

### text-transform — Uppercase, Lowercase

```css
text-transform: uppercase;    /* ALL CAPS */
text-transform: lowercase;    /* all lowercase */
text-transform: capitalize;   /* First Letter Of Each Word */
```

| Tailwind | CSS |
|----------|-----|
| `uppercase` | `text-transform: uppercase` |
| `lowercase` | `text-transform: lowercase` |
| `capitalize` | `text-transform: capitalize` |
| `normal-case` | `text-transform: none` |

### color — Text Color

```css
color: #ffffff;     /* white */
color: #adaaaa;     /* muted gray */
```

In Tailwind, text color uses the `text-` prefix:
- `text-on-surface` → `color: #ffffff` (from your @theme)
- `text-on-surface-variant` → `color: #adaaaa`
- `text-primary` → `color: #a3a6ff`

---

## Putting It Together — A Real Example

Your design system uses two distinct typography styles:

### Headlines (Space Grotesk)
```css
/* The hero title "Casey Quinn" */
font-family: 'Space Grotesk', sans-serif;
font-size: 4.5rem;         /* 72px — massive */
font-weight: 700;          /* bold */
letter-spacing: -0.05em;   /* tight tracking — compact, modern */
line-height: 0.9;          /* very tight — lines almost touching */
color: #ffffff;
```

Tailwind: `font-headline text-7xl font-bold tracking-tighter leading-none text-on-surface`

### Body Text (Inter)
```css
/* Project descriptions, paragraphs */
font-family: 'Inter', sans-serif;
font-size: 0.875rem;       /* 14px — slightly small, elegant */
line-height: 1.625;        /* spacious — easy to read */
color: #adaaaa;            /* muted — secondary information */
```

Tailwind: `font-body text-sm leading-relaxed text-on-surface-variant`

### Tech Pill Labels
```css
/* "JAVA", "SPRING BOOT" badges */
font-size: 10px;
font-weight: 700;
text-transform: uppercase;
letter-spacing: 0.05em;     /* wide tracking for readability at small size */
```

Tailwind: `text-[10px] font-bold uppercase tracking-wider`

(The `text-[10px]` uses Tailwind's arbitrary value syntax since there's no built-in
class for exactly 10px.)

---

## In Your Project

From `Navbar.tsx`:
```
className="font-headline text-xl font-bold tracking-tight text-on-surface"
```
- `font-headline` → Space Grotesk
- `text-xl` → 20px
- `font-bold` → weight 700
- `tracking-tight` → slightly compressed letter spacing
- `text-on-surface` → white (#ffffff)

From `Footer.tsx`:
```
className="text-sm text-on-surface-variant/60"
```
- `text-sm` → 14px
- `text-on-surface-variant/60` → #adaaaa at 60% opacity (very subtle)
