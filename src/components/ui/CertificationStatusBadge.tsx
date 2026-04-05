import type { CertificationStatus } from '@/types';

interface CertificationStatusBadgeProps {
  status: CertificationStatus;
}

const statusStyles: Record<CertificationStatus, string> = {
  EARNED: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  IN_PROGRESS: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  EXPIRED: 'bg-neutral-500/10 text-neutral-400 border border-neutral-500/20',
};

const displayLabels: Record<CertificationStatus, string> = {
  EARNED: 'Earned',
  IN_PROGRESS: 'In Progress',
  EXPIRED: 'Expired',
};

export function CertificationStatusBadge({ status }: CertificationStatusBadgeProps) {
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold ${statusStyles[status]}`}>
      {displayLabels[status]}
    </span>
  );
}

/*
 * ============================================================================
 * COMPONENT: CertificationStatusBadge
 * ============================================================================
 *
 * PURPOSE:
 *   Status badge specifically for certifications. Separate from StatusBadge
 *   because certifications use standard Tailwind colors (emerald, amber,
 *   neutral) rather than the custom design system tokens.
 *
 * PROPS:
 *   status: CertificationStatus — 'EARNED' | 'IN_PROGRESS' | 'EXPIRED'
 *
 * COLOR MAPPING:
 *   EARNED      → green  (emerald-400/500) — success, achievement
 *   IN_PROGRESS → yellow (amber-400/500)   — in-progress, working on it
 *   EXPIRED     → gray   (neutral-400/500) — inactive, past
 *
 * TAILWIND BREAKDOWN:
 *   EARNED example:
 *   ┌─────────────────────────┬──────────────────────────────────┬──────────────────────────────────┐
 *   │ Tailwind                 │ CSS                              │ What it does                     │
 *   ├─────────────────────────┼──────────────────────────────────┼──────────────────────────────────┤
 *   │ bg-emerald-500/10        │ background: rgba(16,185,129,     │ Very faint green background      │
 *   │                          │ 0.1)                             │                                  │
 *   │ text-emerald-400         │ color: #34d399                   │ Green text                       │
 *   │ border                   │ border-width: 1px                │ Thin border                      │
 *   │ border-emerald-500/20    │ border-color: rgba(16,185,129,   │ Subtle green border              │
 *   │                          │ 0.2)                             │                                  │
 *   └─────────────────────────┴──────────────────────────────────┴──────────────────────────────────┘
 *
 * WHY SEPARATE FROM StatusBadge?
 *   StatusBadge uses custom theme tokens (tertiary, secondary, primary).
 *   CertificationStatusBadge uses Tailwind's built-in color palette (emerald,
 *   amber, neutral) because the Stitch designs used these standard colors for
 *   certification status — they carry universal meaning (green=success,
 *   yellow=pending, gray=inactive) that the abstract design tokens don't.
 *
 * ============================================================================
 */
