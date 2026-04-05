import { useState } from 'react';

const navLinks = [
  { label: 'Home', href: '#' },
  { label: 'Projects', href: '#' },
  { label: 'Blog', href: '#' },
  { label: 'Certifications', href: '#' },
  { label: 'Contact', href: '#' },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-low/70 backdrop-blur-[16px] border-b border-outline-variant/15">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <a href="#" className="font-headline text-xl font-bold tracking-tight text-on-surface">
          Casey Quinn.
        </a>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-headline text-sm tracking-wide text-on-surface-variant transition-colors hover:text-on-surface"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <a
            href="#"
            className="hidden rounded-md bg-gradient-to-br from-primary to-primary-dim px-5 py-2 font-headline text-sm font-bold tracking-wide text-on-primary shadow-[0_0_15px_rgba(163,166,255,0.3)] transition-transform hover:brightness-110 active:scale-95 sm:inline-block"
          >
            Resume
          </a>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-md text-on-surface-variant transition-colors hover:text-on-surface md:hidden"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {mobileMenuOpen ? (
                <>
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="6" y1="18" x2="18" y2="6" />
                </>
              ) : (
                <>
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu panel */}
      {mobileMenuOpen && (
        <div className="border-t border-outline-variant/15 bg-surface-container-low/95 backdrop-blur-[16px] md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md px-4 py-3 font-headline text-sm tracking-wide text-on-surface-variant transition-colors hover:bg-surface-container-highest hover:text-on-surface"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#"
              className="mt-2 rounded-md bg-gradient-to-br from-primary to-primary-dim px-4 py-3 text-center font-headline text-sm font-bold tracking-wide text-on-primary sm:hidden"
            >
              Resume
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

/*
 * ============================================================================
 * COMPONENT: Navbar
 * ============================================================================
 *
 * PURPOSE:
 *   Fixed navigation bar at the top of every page. Provides site navigation
 *   links, branding, and a Resume CTA button. Includes a hamburger menu for
 *   mobile screens.
 *
 * PROPS:
 *   None — this component manages its own state internally.
 *
 * STATE:
 *   mobileMenuOpen: boolean (via useState hook)
 *     - Controls whether the mobile dropdown menu is visible
 *     - useState is React's way of adding a "private field" to a function
 *       component. It returns [currentValue, setterFunction].
 *     - Java analogy: like a private boolean field with a setter, except
 *       calling the setter triggers React to re-render the component with
 *       the new value. You can't just mutate it with `=` — you MUST use
 *       the setter, or React won't know something changed.
 *     - Why not a regular `let` variable? Because React re-creates the
 *       function body on every render. A `let` would reset to its initial
 *       value each time. useState persists the value across renders.
 *
 * DATA:
 *   navLinks (array at top of file)
 *     - Static array of { label, href } objects
 *     - Defined outside the component so it's not recreated on each render
 *     - href values are "#" placeholders — will become React Router <NavLink>
 *       components in Issue #4
 *
 * HTML STRUCTURE:
 *   <header>                              ← semantic HTML: the page header
 *     <nav>                               ← semantic HTML: navigation section
 *       <a>Casey Quinn.</a>               ← logo/brand link
 *       <div>                             ← desktop nav links (hidden on mobile)
 *         <a>Home</a>
 *         <a>Projects</a>
 *         ...
 *       </div>
 *       <div>                             ← right side: Resume button + hamburger
 *         <a>Resume</a>                   ← hidden on mobile, shown sm+
 *         <button>☰ / ✕</button>          ← hamburger, shown on mobile, hidden md+
 *       </div>
 *     </nav>
 *     <div>                               ← mobile dropdown panel (conditional)
 *       <a>Home</a>
 *       <a>Projects</a>
 *       ...
 *       <a>Resume</a>                     ← Resume link inside mobile menu
 *     </div>
 *   </header>
 *
 * TAILWIND BREAKDOWN:
 *
 *   <header>: "fixed top-0 left-0 right-0 z-50 bg-surface-container-low/70 backdrop-blur-[16px] border-b border-outline-variant/15"
 *   ┌──────────────────────┬──────────────────────────────┬──────────────────────────────────────┐
 *   │ Tailwind              │ CSS                          │ What it does                         │
 *   ├──────────────────────┼──────────────────────────────┼──────────────────────────────────────┤
 *   │ fixed                 │ position: fixed              │ Removed from normal document flow.   │
 *   │                       │                              │ Positioned relative to the browser   │
 *   │                       │                              │ viewport — stays in place on scroll  │
 *   │ top-0                 │ top: 0                       │ Pinned to the top edge of screen     │
 *   │ left-0                │ left: 0                      │ Pinned to the left edge              │
 *   │ right-0               │ right: 0                     │ Pinned to the right edge             │
 *   │                       │                              │ (left-0 + right-0 = full width)      │
 *   │ z-50                  │ z-index: 50                  │ Stacks above all normal content.     │
 *   │                       │                              │ z-index controls overlap order —     │
 *   │                       │                              │ higher number = closer to viewer     │
 *   │ bg-surface-container- │ background-color:            │ Dark background (#131313) at 70%     │
 *   │ low/70                │ rgba(19,19,19, 0.7)        │ opacity. The 30% transparency lets   │
 *   │                       │                              │ page content show through faintly    │
 *   │ backdrop-blur-[16px]  │ backdrop-filter: blur(16px)  │ Blurs whatever is BEHIND this        │
 *   │                       │                              │ element by 16px. Combined with the   │
 *   │                       │                              │ semi-transparent bg, creates the     │
 *   │                       │                              │ "frosted glass" effect               │
 *   │                       │                              │ [16px] = arbitrary value syntax      │
 *   │ border-b              │ border-bottom-width: 1px     │ Adds a border on the bottom only     │
 *   │ border-outline-       │ border-color:                │ The border color is #494847 at 15% │
 *   │ variant/15            │ rgba(73,72,71, 0.15)       │ opacity — a "ghost border" that is   │
 *   │                       │                              │ felt, not seen (design system rule)  │
 *   └──────────────────────┴──────────────────────────────┴──────────────────────────────────────┘
 *
 *   <nav>: "mx-auto flex h-16 max-w-7xl items-center justify-between px-6"
 *   ┌──────────────────────┬──────────────────────────────┬──────────────────────────────────────┐
 *   │ mx-auto               │ margin-left: auto            │ Centers this container horizontally  │
 *   │                       │ margin-right: auto           │ within the full-width header         │
 *   │ flex                  │ display: flex                │ Children (logo, links, buttons)      │
 *   │                       │                              │ arranged in a horizontal row         │
 *   │ h-16                  │ height: 64px                 │ Fixed navbar height (16 × 4px)       │
 *   │ max-w-7xl             │ max-width: 1280px            │ Content doesn't stretch beyond       │
 *   │                       │                              │ 1280px on ultra-wide monitors        │
 *   │ items-center          │ align-items: center          │ Vertically center all children       │
 *   │                       │                              │ within the 64px height               │
 *   │ justify-between       │ justify-content:             │ Push logo to the left and the        │
 *   │                       │ space-between                │ right-side elements to the right,    │
 *   │                       │                              │ with nav links centered between      │
 *   │ px-6                  │ padding-left: 24px           │ Horizontal breathing room so         │
 *   │                       │ padding-right: 24px          │ content doesn't touch screen edges   │
 *   └──────────────────────┴──────────────────────────────┴──────────────────────────────────────┘
 *
 *   Logo <a>: "font-headline text-xl font-bold tracking-tight text-on-surface"
 *   ┌──────────────────────┬──────────────────────────────┬──────────────────────────────────────┐
 *   │ font-headline         │ font-family: Space Grotesk   │ Display font for branding            │
 *   │ text-xl               │ font-size: 1.25rem (20px)    │ Slightly larger than nav links       │
 *   │ font-bold             │ font-weight: 700             │ Bold weight for emphasis              │
 *   │ tracking-tight        │ letter-spacing: -0.025em     │ Letters slightly closer together —   │
 *   │                       │                              │ compact, modern feel                  │
 *   │ text-on-surface       │ color: #ffffff             │ White text                            │
 *   └──────────────────────┴──────────────────────────────┴──────────────────────────────────────┘
 *
 *   Desktop nav links container: "hidden items-center gap-8 md:flex"
 *   ┌──────────────────────┬──────────────────────────────┬──────────────────────────────────────┐
 *   │ hidden                │ display: none                │ DEFAULT (mobile): completely hidden   │
 *   │ md:flex               │ @media (min-width: 768px)    │ TABLET+ (768px): show as flex row    │
 *   │                       │ { display: flex }            │ This is mobile-first responsive —    │
 *   │                       │                              │ hide by default, show on larger      │
 *   │ items-center          │ align-items: center          │ Vertically center links               │
 *   │ gap-8                 │ gap: 32px                    │ 32px spacing between each link        │
 *   └──────────────────────┴──────────────────────────────┴──────────────────────────────────────┘
 *
 *   Each nav <a>: "font-headline text-sm tracking-wide text-on-surface-variant transition-colors hover:text-on-surface"
 *   ┌──────────────────────┬──────────────────────────────┬──────────────────────────────────────┐
 *   │ font-headline         │ font-family: Space Grotesk   │ Consistent with the nav's font       │
 *   │ text-sm               │ font-size: 0.875rem (14px)   │ Smaller than the logo — hierarchy    │
 *   │ tracking-wide         │ letter-spacing: 0.025em      │ Slightly spread out letters           │
 *   │ text-on-surface-      │ color: #adaaaa               │ Muted gray — inactive state           │
 *   │ variant               │                              │                                       │
 *   │ transition-colors     │ transition: color 150ms...   │ Smooth fade when color changes        │
 *   │ hover:text-on-surface │ :hover { color: #ffffff }    │ On hover: text becomes white          │
 *   └──────────────────────┴──────────────────────────────┴──────────────────────────────────────┘
 *
 *   Resume button: "hidden rounded-md bg-gradient-to-br from-primary to-primary-dim px-5 py-2
 *                    font-headline text-sm font-bold tracking-wide text-on-primary
 *                    shadow-[0_0_15px_rgba(163,166,255,0.3)] transition-transform
 *                    hover:brightness-110 active:scale-95 sm:inline-block"
 *   ┌──────────────────────┬──────────────────────────────┬──────────────────────────────────────┐
 *   │ hidden                │ display: none                │ DEFAULT: hidden on very small         │
 *   │                       │                              │ screens (shown in mobile menu)        │
 *   │ sm:inline-block       │ @media (min-width: 640px)    │ PHONES LANDSCAPE+: show the button   │
 *   │                       │ { display: inline-block }    │                                       │
 *   │ rounded-md            │ border-radius: 0.375rem      │ Slightly rounded corners              │
 *   │ bg-gradient-to-br     │ background: linear-gradient  │ Gradient flows from top-left to      │
 *   │                       │ (to bottom right, ...)       │ bottom-right (~135 degrees)           │
 *   │ from-primary          │ from #a3a6ff                 │ Gradient starts with light indigo     │
 *   │ to-primary-dim        │ to #6063ee                   │ Gradient ends with deep indigo        │
 *   │ px-5 py-2             │ padding: 8px 20px            │ Horizontal + vertical padding         │
 *   │ font-headline         │ font-family: Space Grotesk   │ Display font                          │
 *   │ text-sm               │ font-size: 14px              │ Small text                            │
 *   │ font-bold             │ font-weight: 700             │ Bold                                  │
 *   │ tracking-wide         │ letter-spacing: 0.025em      │ Slightly spread letters               │
 *   │ text-on-primary       │ color: #0f00a4               │ Dark blue text — readable on the      │
 *   │                       │                              │ light indigo gradient background      │
 *   │ shadow-[0_0_15px_     │ box-shadow: 0 0 15px         │ Soft indigo glow around the button.   │
 *   │ rgba(163,166,255,     │ rgba(163,166,255, 0.3)       │ No offset (0,0), 15px blur, 30%      │
 *   │ 0.3)]                 │                              │ opacity. The "accent glow" effect.   │
 *   │                       │                              │ Brackets = arbitrary value syntax     │
 *   │ transition-transform  │ transition: transform 150ms  │ Animate transform changes smoothly    │
 *   │ hover:brightness-110  │ :hover { filter:             │ On hover: brighten the gradient 10%   │
 *   │                       │ brightness(1.1) }            │                                       │
 *   │ active:scale-95       │ :active { transform:         │ On click: shrink to 95% for a         │
 *   │                       │ scale(0.95) }                │ "button press" tactile effect         │
 *   └──────────────────────┴──────────────────────────────┴──────────────────────────────────────┘
 *
 *   Hamburger <button>: "flex h-10 w-10 items-center justify-center rounded-md
 *                         text-on-surface-variant transition-colors hover:text-on-surface md:hidden"
 *   ┌──────────────────────┬──────────────────────────────┬──────────────────────────────────────┐
 *   │ flex                  │ display: flex                │ Flex container to center the SVG      │
 *   │ h-10 w-10             │ height: 40px; width: 40px    │ Square 40×40px tap target             │
 *   │ items-center          │ align-items: center          │ Center SVG vertically                  │
 *   │ justify-center        │ justify-content: center      │ Center SVG horizontally                │
 *   │ rounded-md            │ border-radius: 0.375rem      │ Rounded corners                        │
 *   │ text-on-surface-      │ color: #adaaaa               │ Gray icon color (SVG inherits via     │
 *   │ variant               │                              │ stroke="currentColor")                │
 *   │ transition-colors     │ transition: color 150ms      │ Smooth color fade on hover             │
 *   │ hover:text-on-surface │ :hover { color: #ffffff }    │ White icon on hover                    │
 *   │ md:hidden             │ @media (min-width: 768px)    │ TABLET+: hide the hamburger (desktop  │
 *   │                       │ { display: none }            │ nav links are visible instead)        │
 *   └──────────────────────┴──────────────────────────────┴──────────────────────────────────────┘
 *
 *   Mobile menu panel: "border-t border-outline-variant/15 bg-surface-container-low/95
 *                        backdrop-blur-[16px] md:hidden"
 *   ┌──────────────────────┬──────────────────────────────┬──────────────────────────────────────┐
 *   │ border-t              │ border-top-width: 1px        │ Top ghost border separating the       │
 *   │ border-outline-       │ border-color:                │ dropdown from the nav bar above       │
 *   │ variant/15            │ rgba(73,72,71, 0.15)         │                                       │
 *   │ bg-surface-container- │ background-color:            │ Same dark bg as nav but at 95%        │
 *   │ low/95                │ rgba(19,19,19, 0.95)         │ opacity — nearly opaque so links      │
 *   │                       │                              │ are readable over page content        │
 *   │ backdrop-blur-[16px]  │ backdrop-filter: blur(16px)  │ Glass blur behind the panel            │
 *   │ md:hidden             │ @media (min-width: 768px)    │ TABLET+: never show mobile menu       │
 *   │                       │ { display: none }            │ (desktop nav links visible instead)   │
 *   └──────────────────────┴──────────────────────────────┴──────────────────────────────────────┘
 *
 *   Mobile menu links: "rounded-md px-4 py-3 font-headline text-sm tracking-wide
 *                        text-on-surface-variant transition-colors
 *                        hover:bg-surface-container-highest hover:text-on-surface"
 *   ┌──────────────────────┬──────────────────────────────┬──────────────────────────────────────┐
 *   │ rounded-md            │ border-radius: 0.375rem      │ Rounded corners on hover highlight   │
 *   │ px-4 py-3             │ padding: 12px 16px           │ Generous tap target (touch-friendly) │
 *   │ font-headline         │ font-family: Space Grotesk   │ Consistent nav font                   │
 *   │ text-sm               │ font-size: 14px              │ Same size as desktop links             │
 *   │ tracking-wide         │ letter-spacing: 0.025em      │ Slightly spread letters                │
 *   │ text-on-surface-      │ color: #adaaaa               │ Muted gray default                     │
 *   │ variant               │                              │                                       │
 *   │ transition-colors     │ transition: color, bg 150ms  │ Smooth fade on hover                   │
 *   │ hover:bg-surface-     │ :hover { background-color:   │ On hover: background shifts to         │
 *   │ container-highest     │ #262626 }                    │ a lighter surface (tonal layering —   │
 *   │                       │                              │ no border needed for highlight)        │
 *   │ hover:text-on-surface │ :hover { color: #ffffff }    │ On hover: text becomes white           │
 *   └──────────────────────┴──────────────────────────────┴──────────────────────────────────────┘
 *
 * REACT PATTERNS USED:
 *
 *   useState(false)
 *     - React hook that creates a piece of state (mobileMenuOpen) and a setter
 *     - Every time setMobileMenuOpen is called with a new value, React
 *       re-renders this component with the updated state
 *     - Java analogy: private boolean mobileMenuOpen = false; with a setter
 *       that also triggers a UI repaint
 *
 *   {mobileMenuOpen && <div>...</div>}
 *     - Conditional rendering — the mobile menu JSX only exists in the DOM
 *       when mobileMenuOpen is true
 *     - Uses JavaScript's short-circuit evaluation: if left side is false,
 *       the right side (the JSX) is never evaluated
 *     - Java analogy: if (mobileMenuOpen) { renderMobileMenu(); }
 *
 *   onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
 *     - Arrow function that toggles the boolean (true→false, false→true)
 *     - The () => syntax is an inline function — like a Java lambda
 *
 *   onClick={() => setMobileMenuOpen(false)}
 *     - On mobile menu links: clicking a link closes the menu
 *
 *   <> ... </> (React Fragment)
 *     - Groups multiple elements without adding an extra DOM node
 *     - Used here to wrap the SVG lines because JSX requires a single
 *       root element in each branch of the ternary
 *     - Java analogy: like returning multiple items from a method — you'd
 *       need a container (List), but Fragment is invisible in the output
 *
 *   aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
 *     - Accessibility attribute for screen readers — the button has no
 *       visible text, so aria-label provides the text equivalent
 *     - Important for users who navigate with keyboard or screen readers
 *
 *   stroke="currentColor"
 *     - SVG attribute that makes the icon lines inherit the CSS `color`
 *       property. This is why text-on-surface-variant and hover:text-on-surface
 *       also change the icon color — the SVG follows along automatically
 *
 * ============================================================================
 */
