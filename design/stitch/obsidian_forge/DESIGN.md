# Design System Specification: The Kinetic Luminal

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Digital Curator."** 

This system rejects the "template-heavy" look of standard developer portfolios. Instead of a rigid, boxed-in grid, we utilize **intentional asymmetry** and **tonal depth** to create an editorial experience that feels like a high-end digital gallery. The aesthetic is rooted in the "Precision of Code"—sharp, legible, and high-performance—but softened by atmospheric "Glow" and "Glass" elements that suggest a sophisticated, human touch. We move away from the "flat" web by treating the screen as a three-dimensional space where content floats at varying levels of atmospheric density.

## 2. Colors: Tonal Depth & The "No-Line" Rule
The palette is built on deep charcoals to minimize eye strain while allowing our vibrant accents to "pierce" through the darkness.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to define sections. Traditional borders create visual noise and make a site feel "cheap." Boundaries must be defined solely through background shifts. For example, a project section using `surface_container_low` (#131313) should sit directly against a `background` (#0e0e0e) footer. The contrast is the boundary.

### Surface Hierarchy & Nesting
Treat the UI as stacked sheets of obsidian and smoked glass.
- **Base Layer:** `surface` (#0e0e0e) for the primary background.
- **Secondary Depth:** `surface_container_low` (#131313) for large content blocks.
- **Component Elevation:** `surface_container_highest` (#262626) for individual cards or interactive modules.
- **The "Glass & Gradient" Rule:** Floating elements (like the navigation bar) must use `surface_container_low` at 60% opacity with a `20px` backdrop-blur. 

### Signature Textures
Use a subtle linear gradient for primary CTAs: `primary` (#a3a6ff) to `primary_dim` (#6063ee) at a 135-degree angle. This adds "visual soul" and a sense of light-source directionality that flat fills lack.

## 3. Typography: Editorial Authority
We use a high-contrast pairing between **Space Grotesk** (Display/Headlines) and **Inter** (Body/Labels).

*   **Display & Headlines (Space Grotesk):** These are your "statements." The wide apertures and technical feel of Space Grotesk communicate engineering precision. Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) for hero sections to create a "Signature" look.
*   **Body & Titles (Inter):** Inter provides neutral, high-readability support. Use `body-lg` (1rem) for project descriptions to ensure the user’s focus remains on the content, not the font.
*   **Labels (Inter):** Small caps or tracking (+0.05em) should be applied to `label-md` when used for "Tech Stack" pills to differentiate them from body copy.

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are forbidden. We use **Tonal Layering** and **Ambient Glows.**

*   **The Layering Principle:** To lift a card, move it from `surface_container` (#1a1919) to `surface_container_highest` (#262626). The "lift" is perceived through the shift in lightness, not a shadow.
*   **Ambient Shadows:** If a floating element (like a modal) requires a shadow, use a diffused 48px blur at 8% opacity using the `on_background` color. This mimics natural light dispersion in a dark room.
*   **The "Ghost Border" Fallback:** For accessibility in cards, use a "Ghost Border": `outline_variant` (#494847) at **15% opacity**. It should be felt, not seen.
*   **The Accent Glow:** Use a `2px` outer glow (box-shadow) on primary buttons using the `primary` token at 30% opacity to simulate an "active" electronic component.

## 5. Components

### Navigation (The Glass Bar)
- **Style:** Sticky, `surface_container_low` at 70% opacity.
- **Effect:** `backdrop-filter: blur(12px)`.
- **Border:** Bottom-only "Ghost Border" (15% opacity `outline_variant`).

### Buttons
- **Primary:** Gradient fill (`primary` to `primary_dim`), `on_primary` text. `rounded-md` (0.375rem).
- **Secondary:** Transparent background, Ghost Border, `primary` text color.
- **Tertiary:** No background or border. `primary` text with a subtle underline on hover.

### Project Cards
- **Structure:** No dividers. Use `2.5rem` (10) padding to create internal breathing room. 
- **Transition:** On hover, shift background from `surface_container` to `surface_container_highest` and apply a subtle `primary` glow to the top edge (1px height).

### Tech Pills (Badges)
- **Style:** `surface_variant` (#262626) background with `on_surface_variant` (#adaaaa) text. 
- **Shape:** `rounded-full`. 
- **Context:** Place these in clusters with `0.5rem` (2) spacing.

### Input Fields
- **Background:** `surface_container_lowest` (#000000).
- **Focus State:** 1px "Ghost Border" becomes 100% opaque `primary` (#a3a6ff). No "glow" on inputs to keep the focus on the text.

## 6. Do’s and Don’ts

### Do:
- **Do** use asymmetrical margins (e.g., 15% left margin, 5% right margin) for hero headers to create a custom, high-end feel.
- **Do** use the `tertiary` (#ffa5d9) color sparingly for "micro-moments"—like a heart icon or a "New" badge—to break the indigo monotony.
- **Do** prioritize vertical whitespace. If in doubt, add more. Use the `16` (4rem) or `24` (6rem) spacing tokens between sections.

### Don’t:
- **Don’t** use pure black (#000000) for anything other than the deepest "wells" (like input fields). It flattens the design. Use `surface` (#0e0e0e).
- **Don’t** use dividers or lines. If you need to separate content, use a background color shift or an increase in whitespace.
- **Don’t** use standard "Blue" links. Every interactive element must utilize the `primary` (#a3a6ff) or `secondary` (#a28efc) tokens to maintain the brand's electric indigo identity.