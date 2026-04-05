# Transitions & Effects

> `docs/learning/css/06-transitions-and-effects.md`

---

## Transitions — Smooth State Changes

Without transitions, CSS property changes happen **instantly**. A hover that changes
color snaps from gray to white in a single frame. Transitions animate that change
over time.

### The Basics

```css
.link {
  color: #adaaaa;                    /* starting state */
  transition: color 0.2s ease;       /* animate color over 0.2 seconds */
}
.link:hover {
  color: #ffffff;                    /* ending state on hover */
}
```

The `transition` property has three parts:
1. **Property**: which CSS property to animate (`color`, `background-color`, `all`)
2. **Duration**: how long the animation takes (`0.2s`, `300ms`)
3. **Timing function**: the acceleration curve (`ease`, `linear`, `ease-in-out`)

### Timing Functions

```
ease        ████████░░  — starts fast, slows down (default, feels natural)
linear      █████████░  — constant speed (feels mechanical)
ease-in     ░░░███████  — starts slow, speeds up
ease-out    ███████░░░  — starts fast, slows down
ease-in-out ░░█████░░░  — slow start, fast middle, slow end
```

### Tailwind Transition Classes

| Tailwind | What it animates |
|----------|-----------------|
| `transition-all` | All animatable properties |
| `transition-colors` | `color`, `background-color`, `border-color` |
| `transition-transform` | `transform` (scale, rotate, translate) |
| `transition-opacity` | `opacity` |
| `duration-200` | 200ms duration |
| `duration-300` | 300ms duration |
| `duration-500` | 500ms duration |
| `ease-in-out` | `ease-in-out` timing |

Tailwind defaults to `duration: 150ms` and `ease` timing when you use any
`transition-*` class.

---

## Pseudo-Classes — Triggering State Changes

CSS pseudo-classes define styles for specific element states:

```css
.button {
  background-color: #a3a6ff;
}
.button:hover {
  background-color: #8387ff;    /* mouse is over the element */
}
.button:active {
  transform: scale(0.95);       /* element is being clicked/pressed */
}
.button:focus {
  outline: 2px solid #a3a6ff;   /* element has keyboard focus */
}
```

In Tailwind, these become prefixes:

| Tailwind prefix | CSS pseudo-class | Triggers when |
|----------------|-----------------|---------------|
| `hover:` | `:hover` | Mouse is over element |
| `active:` | `:active` | Element is being pressed |
| `focus:` | `:focus` | Element has keyboard focus |
| `first:` | `:first-child` | Element is first child of parent |
| `last:` | `:last-child` | Element is last child of parent |
| `group-hover:` | `.group:hover &` | A parent with `group` class is hovered |

Example: `hover:text-on-surface` means "apply white text color when hovered."

---

## Transform — Scale, Rotate, Move

Transforms change an element's visual appearance without affecting layout (other
elements don't move to accommodate the change).

```css
transform: scale(0.95);            /* shrink to 95% */
transform: scale(1.05);            /* grow to 105% */
transform: translateX(4px);        /* move 4px right */
transform: translateY(-2px);       /* move 2px up */
transform: rotate(45deg);          /* rotate 45 degrees */
```

| Tailwind | CSS |
|----------|-----|
| `scale-95` | `transform: scale(0.95)` |
| `scale-105` | `transform: scale(1.05)` |
| `hover:scale-105` | Scale up on hover |
| `active:scale-95` | Shrink on click |
| `translate-x-1` | Move right 4px |
| `-translate-x-1` | Move left 4px |

### The Button Press Effect

Your design system uses scale transforms for interactive feedback:

```css
.button {
  transition: transform 0.2s ease;
}
.button:hover {
  transform: scale(1.05);      /* slightly larger on hover */
}
.button:active {
  transform: scale(0.95);      /* pressed-in effect on click */
}
```

Tailwind: `transition-transform hover:scale-105 active:scale-95`

---

## backdrop-filter — The Glass Effect

Regular `filter` applies effects to an element itself. `backdrop-filter` applies
effects to **what's behind** the element.

```css
.glass-panel {
  background-color: rgba(19, 19, 19, 0.7);   /* semi-transparent */
  backdrop-filter: blur(16px);                 /* blur the content behind */
}
```

How it works visually:
1. The background is 70% opaque — you can partially see through it
2. Whatever is behind (scrolling page content) gets blurred
3. Combined effect: frosted glass

Without the semi-transparent background, there would be nothing to see through.
Without the blur, you'd just see the content behind clearly (distracting).
Together they create the polished glass look.

| Tailwind | CSS |
|----------|-----|
| `backdrop-blur-sm` | `backdrop-filter: blur(4px)` |
| `backdrop-blur-md` | `backdrop-filter: blur(12px)` |
| `backdrop-blur-lg` | `backdrop-filter: blur(16px)` |
| `backdrop-blur-xl` | `backdrop-filter: blur(24px)` |
| `backdrop-blur-[16px]` | `backdrop-filter: blur(16px)` (arbitrary value) |

---

## box-shadow — Glows and Shadows

```css
box-shadow: offsetX offsetY blur spread color;

/* Examples */
box-shadow: 0 0 15px rgba(163, 166, 255, 0.3);   /* soft indigo glow */
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);         /* subtle drop shadow */
box-shadow: 0 1px 0 0 rgba(163, 166, 255, 0.4) inset;  /* inner top glow */
```

Parameters:
- **offsetX/Y**: how far the shadow shifts (0,0 = centered glow)
- **blur**: how diffused the shadow is (higher = softer)
- **spread**: how much larger/smaller than the element
- **color**: usually semi-transparent
- **inset**: shadow goes inside the element instead of outside

Your design system avoids traditional drop shadows. Instead it uses:
- **Accent glows**: `box-shadow: 0 0 15px rgba(163,166,255,0.3)` on primary buttons
- **Inset highlights**: on card hover, a 1px top glow to simulate a light edge

In Tailwind, complex shadows use arbitrary value syntax:
```
shadow-[0_0_15px_rgba(163,166,255,0.3)]
```
(Underscores replace spaces inside square brackets.)

---

## brightness — Lightening on Hover

```css
filter: brightness(1.1);   /* 10% brighter */
```

Tailwind: `hover:brightness-110`

This is a simpler alternative to defining a separate hover color. Instead of
picking a lighter shade of indigo, you just brighten whatever color is already there.

---

## In Your Project

From `Navbar.tsx`, the Resume button:
```
className="... bg-gradient-to-br from-primary to-primary-dim ...
  shadow-[0_0_15px_rgba(163,166,255,0.3)]
  transition-transform hover:brightness-110 active:scale-95"
```

Reading this left to right:
1. Indigo gradient background
2. Soft indigo glow around the button
3. Animate transform changes smoothly
4. On hover: brighten the gradient slightly
5. On click: shrink to 95% for a "press" feel

From `Navbar.tsx`, nav links:
```
className="... text-on-surface-variant transition-colors hover:text-on-surface"
```
1. Start as gray text (#adaaaa)
2. Animate color changes smoothly
3. On hover: fade to white (#ffffff)
