interface SectionHeaderProps {
  overline: string;
  title: string;
  linkText?: string;
  linkHref?: string;
}

export function SectionHeader({ overline, title, linkText, linkHref }: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between mb-16">
      <div className="space-y-4">
        <h3 className="text-tertiary font-headline text-sm tracking-[0.2em] uppercase">
          {overline}
        </h3>
        <h2 className="text-4xl font-headline font-bold text-white tracking-tight">
          {title}
        </h2>
      </div>

      {linkText && (
        <>
          <div className="hidden h-px flex-grow mx-12 bg-outline-variant/20 mb-3 md:block" />
          <a
            href={linkHref ?? '#'}
            className="hidden text-primary hover:text-white transition-colors font-bold items-center gap-2 md:flex"
          >
            {linkText}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </>
      )}
    </div>
  );
}

/*
 * ============================================================================
 * COMPONENT: SectionHeader
 * ============================================================================
 *
 * PURPOSE:
 *   Consistent section title pattern used across pages. Has a small colored
 *   overline label, a large title, and an optional link with a horizontal
 *   divider line.
 *
 * PROPS:
 *   overline: string   — small label above the title (e.g., "Selection")
 *   title: string      — the main section heading (e.g., "Featured Projects")
 *   linkText?: string  — optional link text on the right (e.g., "Archive")
 *   linkHref?: string  — URL for the link
 *
 * HTML STRUCTURE:
 *   <div>                         ← flex row, items aligned to bottom
 *     <div>                       ← left side: overline + title
 *       <h3>Selection</h3>        ← small pink overline
 *       <h2>Featured Projects</h2>← large white title
 *     </div>
 *     <div />                     ← horizontal line (optional, hidden mobile)
 *     <a>Archive →</a>            ← link (optional, hidden mobile)
 *   </div>
 *
 * TAILWIND BREAKDOWN:
 *   Overline: "text-tertiary font-headline text-sm tracking-[0.2em] uppercase"
 *   ┌─────────────────────────┬──────────────────────────────────┬──────────────────────────────────┐
 *   │ text-tertiary            │ color: #ffa5d9                   │ Pink accent color                │
 *   │ font-headline            │ font-family: Space Grotesk       │ Display font                     │
 *   │ text-sm                  │ font-size: 14px                  │ Small label size                 │
 *   │ tracking-[0.2em]         │ letter-spacing: 0.2em            │ Very wide spacing (arbitrary)    │
 *   │ uppercase                │ text-transform: uppercase        │ Force uppercase                  │
 *   └─────────────────────────┴──────────────────────────────────┴──────────────────────────────────┘
 *
 *   Divider line: "hidden h-px flex-grow mx-12 bg-outline-variant/20 mb-3 md:block"
 *   ┌─────────────────────────┬──────────────────────────────────┬──────────────────────────────────┐
 *   │ hidden md:block          │ display: none / block at 768px+  │ Only visible on tablet+          │
 *   │ h-px                     │ height: 1px                      │ Hairline thin                    │
 *   │ flex-grow                │ flex-grow: 1                     │ Stretches to fill available      │
 *   │                          │                                  │ space between title and link     │
 *   │ mx-12                    │ margin: 0 48px                   │ 48px gap on each side            │
 *   │ bg-outline-variant/20    │ background: rgba(73,72,71, 0.2)  │ Very subtle gray line            │
 *   └─────────────────────────┴──────────────────────────────────┴──────────────────────────────────┘
 *
 * ============================================================================
 */
