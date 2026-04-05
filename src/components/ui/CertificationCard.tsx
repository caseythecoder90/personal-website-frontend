import type { CertificationResponse } from '@/types';
import { TechPill } from './TechPill';
import { CertificationStatusBadge } from './CertificationStatusBadge';

interface CertificationCardProps {
  certification: CertificationResponse;
}

export function CertificationCard({ certification }: CertificationCardProps) {
  const issueDate = certification.issueDate
    ? new Date(certification.issueDate + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
    : null;

  return (
    <div className="group bg-surface-container-low p-10 rounded-xl transition-all duration-500 hover:bg-surface-container-high border border-outline-variant/10">
      <div className="flex flex-col h-full">
        {/* Status + date row */}
        <div className="flex items-center gap-3 mb-8">
          <CertificationStatusBadge status={certification.status} />
          {issueDate && (
            <span className="text-on-surface-variant text-sm tracking-wide">
              {issueDate}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-headline text-xl font-bold mb-2 group-hover:text-primary transition-colors">
          {certification.name}
        </h3>

        {/* Organization */}
        <p className="text-on-surface-variant text-sm mb-4">
          {certification.issuingOrganization}
        </p>

        {/* Description */}
        {certification.description && (
          <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
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
 *   Used on the Certifications page.
 *
 * PROPS:
 *   certification: CertificationResponse — full certification from the API
 *
 * REACT PATTERNS:
 *
 *   new Date(certification.issueDate + 'T00:00:00')
 *     - The backend returns date-only strings like "2023-10-15" (no time)
 *     - Appending 'T00:00:00' prevents timezone parsing issues where
 *       "2023-10-15" alone might be interpreted as UTC midnight and
 *       display as the previous day in western timezones
 *     - Java analogy: LocalDate vs LocalDateTime parsing differences
 *
 *   mt-auto on the tech pills container
 *     - Pushes the tech pills to the bottom of the card regardless of
 *       how much content is above them. This ensures all cards in a grid
 *       have their tech pills aligned at the same vertical position.
 *     - Works because the parent has `flex flex-col h-full`
 *
 * TAILWIND BREAKDOWN:
 *   Card: "group bg-surface-container-low p-10 rounded-xl transition-all duration-500
 *          hover:bg-surface-container-high border border-outline-variant/10"
 *   ┌─────────────────────────┬──────────────────────────────────┬──────────────────────────────────┐
 *   │ Tailwind                 │ CSS                              │ What it does                     │
 *   ├─────────────────────────┼──────────────────────────────────┼──────────────────────────────────┤
 *   │ bg-surface-container-    │ background: #131313              │ Dark card background             │
 *   │ low                      │                                  │                                  │
 *   │ p-10                     │ padding: 40px                    │ Generous padding (more than      │
 *   │                          │                                  │ project cards — spacious feel)   │
 *   │ hover:bg-surface-        │ :hover { background: #201f1f }  │ Tonal lift on hover              │
 *   │ container-high           │                                  │                                  │
 *   │ border                   │ border-width: 1px                │ Very subtle border               │
 *   │ border-outline-          │ border-color: rgba(73,72,71,     │ at 10% opacity — barely          │
 *   │ variant/10               │ 0.1)                             │ visible ghost border             │
 *   └─────────────────────────┴──────────────────────────────────┴──────────────────────────────────┘
 *
 *   Title hover: "group-hover:text-primary transition-colors"
 *   ┌─────────────────────────┬──────────────────────────────────┬──────────────────────────────────┐
 *   │ group-hover:text-primary │ .group:hover & { color:          │ Title turns indigo when the      │
 *   │                          │ #a3a6ff }                        │ CARD is hovered (not just the    │
 *   │                          │                                  │ title itself)                    │
 *   │ transition-colors        │ transition: color 150ms          │ Smooth color fade                │
 *   └─────────────────────────┴──────────────────────────────────┴──────────────────────────────────┘
 *
 * ============================================================================
 */
