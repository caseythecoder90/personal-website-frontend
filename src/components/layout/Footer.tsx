const socialLinks = [
  { label: 'GitHub', href: '#' },
  { label: 'LinkedIn', href: '#' },
  { label: 'Twitter', href: '#' },
  { label: 'Email', href: '#' },
];

export function Footer() {
  return (
    <footer className="bg-surface-container-low py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 md:flex-row">
        <div className="text-center md:text-left">
          <div className="font-headline text-lg font-bold text-on-surface">
            Casey Quinn.
          </div>
          <div className="mt-1 text-sm text-on-surface-variant/60">
            &copy; {new Date().getFullYear()} Casey Quinn. Crafted with precision.
          </div>
        </div>

        <div className="flex items-center gap-8">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-on-surface-variant/60 underline-offset-4 transition-colors hover:text-primary hover:underline"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

/*
 * ============================================================================
 * COMPONENT: Footer
 * ============================================================================
 *
 * PURPOSE:
 *   Site-wide footer with branding, copyright, and social media links.
 *   Appears at the bottom of every page via the Layout component.
 *
 * PROPS:
 *   None — this component takes no props. It renders the same content on every
 *   page. The social link URLs are placeholder (#) and will be updated with
 *   real URLs later.
 *
 * DATA:
 *   socialLinks (array at top of file)
 *     - Each object has { label, href }
 *     - We define this outside the component so it's not recreated on every
 *       render. In Java terms, it's like a static final List — the data never
 *       changes, so there's no reason to rebuild it.
 *
 * HTML STRUCTURE:
 *   <footer>                          ← semantic HTML: the page footer
 *     <div>                           ← inner container (centers + constrains width)
 *       <div>                         ← left side: branding
 *         <div>Casey Quinn.</div>     ← logo/name
 *         <div>© 2026 ...</div>       ← copyright
 *       </div>
 *       <div>                         ← right side: social links
 *         <a>GitHub</a>
 *         <a>LinkedIn</a>
 *         <a>Twitter</a>
 *         <a>Email</a>
 *       </div>
 *     </div>
 *   </footer>
 *
 * TAILWIND BREAKDOWN:
 *
 *   <footer>: "bg-surface-container-low py-12"
 *   ┌────────────────────────┬────────────────────────────┬──────────────────────────────┐
 *   │ Tailwind               │ CSS                        │ What it does                 │
 *   ├────────────────────────┼────────────────────────────┼──────────────────────────────┤
 *   │ bg-surface-container-  │ background-color: #131313 │ Slightly lighter than the   │
 *   │ low                     │                            │ page bg (#0e0e0e). This      │
 *   │                         │                            │ color shift IS the boundary  │
 *   │                         │                            │ — no border needed (the      │
 *   │                         │                            │ "No-Line Rule" from the      │
 *   │                         │                            │ design system)               │
 *   │ py-12                   │ padding-top: 48px          │ 48px of vertical breathing   │
 *   │                         │ padding-bottom: 48px       │ room inside the footer       │
 *   └────────────────────────┴────────────────────────────┴──────────────────────────────┘
 *
 *   Inner container: "mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 md:flex-row"
 *   ┌────────────────────────┬────────────────────────────┬──────────────────────────────┐
 *   │ Tailwind                │ CSS                        │ What it does                 │
 *   ├────────────────────────┼────────────────────────────┼──────────────────────────────┤
 *   │ mx-auto                 │ margin-left: auto          │ Centers the container        │
 *   │                         │ margin-right: auto         │ horizontally on the page     │
 *   │ max-w-7xl               │ max-width: 1280px          │ Content won't stretch wider  │
 *   │                         │                            │ than 1280px on large screens  │
 *   │ flex                    │ display: flex              │ Children become flex items    │
 *   │ flex-col                │ flex-direction: column     │ DEFAULT: stack vertically     │
 *   │                         │                            │ (mobile layout)              │
 *   │ md:flex-row             │ @media (min-width: 768px)  │ TABLET+: switch to           │
 *   │                         │ { flex-direction: row }    │ horizontal row               │
 *   │ items-center            │ align-items: center        │ Cross-axis centering         │
 *   │                         │                            │ (vertical in row mode)       │
 *   │ justify-between         │ justify-content:           │ Push branding left and       │
 *   │                         │ space-between              │ social links right            │
 *   │ gap-8                   │ gap: 32px                  │ 32px space between the two   │
 *   │                         │                            │ sections                     │
 *   │ px-6                    │ padding-left: 24px         │ Horizontal breathing room    │
 *   │                         │ padding-right: 24px        │ so content isn't edge-to-edge│
 *   └────────────────────────┴────────────────────────────┴──────────────────────────────┘
 *
 *   Logo text: "font-headline text-lg font-bold text-on-surface"
 *   ┌────────────────────────┬────────────────────────────┬──────────────────────────────┐
 *   │ font-headline           │ font-family: Space Grotesk │ Display font for branding    │
 *   │ text-lg                 │ font-size: 1.125rem (18px) │ Slightly larger than body    │
 *   │ font-bold               │ font-weight: 700           │ Bold weight                  │
 *   │ text-on-surface         │ color: #ffffff             │ White text                   │
 *   └────────────────────────┴────────────────────────────┴──────────────────────────────┘
 *
 *   Copyright text: "mt-1 text-sm text-on-surface-variant/60"
 *   ┌────────────────────────┬────────────────────────────┬──────────────────────────────┐
 *   │ mt-1                    │ margin-top: 4px            │ Tiny gap below the logo      │
 *   │ text-sm                 │ font-size: 0.875rem (14px) │ Small text                   │
 *   │ text-on-surface-        │ color: rgba(173,170,170,   │ Gray text at 60% opacity —   │
 *   │ variant/60              │ 0.6)                       │ very muted, tertiary info    │
 *   └────────────────────────┴────────────────────────────┴──────────────────────────────┘
 *
 *   Social links: "text-sm text-on-surface-variant/60 underline-offset-4 transition-colors hover:text-primary hover:underline"
 *   ┌────────────────────────┬────────────────────────────┬──────────────────────────────┐
 *   │ text-sm                 │ font-size: 14px            │ Small link text               │
 *   │ text-on-surface-        │ color: rgba(173,170,170,   │ Muted gray at 60% — matches  │
 *   │ variant/60              │ 0.6)                       │ the copyright text tone       │
 *   │ underline-offset-4      │ text-underline-offset: 4px │ When underline appears, it    │
 *   │                         │                            │ sits 4px below the text       │
 *   │                         │                            │ (more elegant spacing)        │
 *   │ transition-colors       │ transition: color 150ms,   │ Animate color changes         │
 *   │                         │ background-color 150ms...  │ smoothly (not instant)        │
 *   │ hover:text-primary      │ :hover { color: #a3a6ff }  │ On hover: text turns indigo   │
 *   │ hover:underline         │ :hover { text-decoration:  │ On hover: underline appears   │
 *   │                         │ underline }                │                               │
 *   └────────────────────────┴────────────────────────────┴──────────────────────────────┘
 *
 *   <a> attributes:
 *   - target="_blank"         → opens link in a new browser tab
 *   - rel="noopener noreferrer" → security best practice for external links:
 *       noopener  = prevents the new page from accessing window.opener
 *       noreferrer = prevents sending the referrer header to the new page
 *
 * REACT PATTERNS USED:
 *   socialLinks.map((link) => <a key={link.label}>...</a>)
 *     - .map() is how you render a list in React (like a for-each loop in Java)
 *     - `key` is required on list items — React uses it to efficiently track
 *       which items changed when the list re-renders. Like a primary key in a
 *       database table — each must be unique within the list.
 *
 *   {new Date().getFullYear()}
 *     - Runs JavaScript inline in JSX to get the current year
 *     - Curly braces {} in JSX = "evaluate this JavaScript expression"
 *
 * ============================================================================
 */
