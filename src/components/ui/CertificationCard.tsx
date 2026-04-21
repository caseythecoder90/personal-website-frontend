import type { CertificationResponse } from '@/types';
import { TechPill } from './TechPill';
import { CertificationStatusBadge } from './CertificationStatusBadge';

interface CertificationCardProps {
  certification: CertificationResponse;
  featured?: boolean;
}

export function CertificationCard({ certification, featured = false }: CertificationCardProps) {
  const issueDate = certification.issueDate
    ? new Date(certification.issueDate + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
    : null;

  const containerClasses = featured
    ? 'group relative bg-surface-container-low p-10 rounded-xl transition-all duration-500 hover:bg-surface-container-high border border-primary/20 shadow-[0_0_40px_rgba(163,166,255,0.05)] overflow-hidden lg:col-span-2'
    : 'group bg-surface-container-low p-10 rounded-xl transition-all duration-500 hover:bg-surface-container-high border border-outline-variant/10';

  const titleClasses = featured
    ? 'font-headline text-3xl font-bold mb-4 group-hover:text-primary transition-colors'
    : 'font-headline text-xl font-bold mb-2 group-hover:text-primary transition-colors';

  const descriptionClasses = featured
    ? 'text-on-surface-variant mb-8 max-w-lg font-body leading-relaxed'
    : 'text-on-surface-variant text-sm mb-8 leading-relaxed';

  return (
    <div className={containerClasses}>
      {featured && (
        <>
          {/* Decorative watermark — a large, low-opacity badge icon that
              signals "this is the featured card" without pulling focus. */}
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
            <svg width="128" height="128" viewBox="0 0 24 24" fill="currentColor" className="text-primary">
              <path d="M12 2l2.39 4.84 5.34.78-3.86 3.77.91 5.32L12 14.19l-4.78 2.52.91-5.32L4.27 7.62l5.34-.78L12 2z" />
            </svg>
          </div>
        </>
      )}

      <div className="relative z-10 flex flex-col h-full">
        {/* Status + date row */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-3">
            <CertificationStatusBadge status={certification.status} />
            {issueDate && (
              <span className="text-on-surface-variant text-sm tracking-wide">
                {featured ? `Issued: ${issueDate}` : issueDate}
              </span>
            )}
          </div>
          {featured && (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          )}
        </div>

        {/* Title */}
        <h3 className={titleClasses}>
          {certification.name}
        </h3>

        {/* Organization */}
        <p className="text-on-surface-variant text-sm mb-4">
          {certification.issuingOrganization}
        </p>

        {/* Description */}
        {certification.description && (
          <p className={descriptionClasses}>
            {certification.description}
          </p>
        )}

        {/* Tech pills */}
        <div className="mt-auto flex flex-wrap gap-2">
          {(certification.technologies ?? []).map((tech) => (
            <TechPill key={tech.id} name={tech.name} />
          ))}
        </div>
      </div>
    </div>
  );
}

/*
 * ============================================================================
 * COMPONENT: CertificationCard
 * ============================================================================
 *
 * PURPOSE:
 *   Card displaying a professional certification with status badge, issue
 *   date, organization name, description, and associated technologies.
 *   Supports a `featured` variant that spans 2 grid columns, adds a primary
 *   glow border, a verified checkmark, and a decorative watermark icon.
 *
 * PROPS:
 *   certification: CertificationResponse — full certification from the API
 *   featured?: boolean — when true, render the hero "featured" variant
 *
 * REACT PATTERNS:
 *
 *   Default parameter value in destructuring: `featured = false`
 *     - Same as Java method overloading / default arguments. The caller can
 *       omit `featured` entirely and the component defaults to the regular
 *       card. Keeps every existing callsite working without a prop update.
 *
 *   Derived class strings via if-else
 *     - Rather than building className with template literals and ternaries
 *       inline in JSX (which gets hard to read), we compute the container /
 *       title / description classes as named variables and slot them in.
 *
 *   new Date(certification.issueDate + 'T00:00:00')
 *     - The backend returns date-only strings like "2023-10-15" (no time).
 *       Appending 'T00:00:00' prevents timezone parsing issues where
 *       "2023-10-15" alone might be interpreted as UTC midnight and
 *       display as the previous day in western timezones.
 *     - Java analogy: LocalDate vs LocalDateTime parsing differences.
 *
 *   mt-auto on the tech pills container
 *     - Pushes the tech pills to the bottom of the card regardless of
 *       how much content is above them. This ensures all cards in a grid
 *       have their tech pills aligned at the same vertical position.
 *     - Works because the parent has `flex flex-col h-full`.
 *
 * TAILWIND BREAKDOWN (featured variant additions):
 *   ┌─────────────────────────┬──────────────────────────────────┬──────────────────────────────────┐
 *   │ Tailwind                 │ CSS                              │ What it does                     │
 *   ├─────────────────────────┼──────────────────────────────────┼──────────────────────────────────┤
 *   │ lg:col-span-2            │ grid-column: span 2              │ At lg breakpoint, card           │
 *   │                          │                                  │ spans 2 of the 3 grid columns    │
 *   │ border-primary/20        │ border-color: rgba(163,166,255,  │ Indigo-tinted border —           │
 *   │                          │ 0.2)                             │ signals "featured" subtly        │
 *   │ shadow-[0_0_40px_rgba    │ box-shadow: 0 0 40px             │ Outer glow, very faint — the    │
 *   │ (163,166,255,0.05)]      │ rgba(163,166,255,0.05)           │ "atmospheric" feel the design   │
 *   │                          │                                  │ system calls for                │
 *   │ overflow-hidden          │ overflow: hidden                 │ Clips the watermark icon so it   │
 *   │                          │                                  │ doesn't leak outside the card    │
 *   │ absolute top-0 right-0   │ position: absolute; top/right 0  │ Pins watermark to top-right     │
 *   │ opacity-10 group-hover:  │ opacity transitions on card hvr  │ Watermark brightens when user   │
 *   │ opacity-20               │                                  │ hovers the card                 │
 *   │ pointer-events-none      │ pointer-events: none             │ Watermark never intercepts      │
 *   │                          │                                  │ clicks — purely decorative       │
 *   └─────────────────────────┴──────────────────────────────────┴──────────────────────────────────┘
 *
 * ============================================================================
 */
