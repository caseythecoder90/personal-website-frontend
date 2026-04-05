import type { ProjectStatus, DifficultyLevel } from '@/types';

interface StatusBadgeProps {
  status: ProjectStatus | DifficultyLevel;
  label?: string;
}

const statusStyles: Record<string, string> = {
  // Project statuses
  COMPLETED: 'bg-tertiary/10 text-tertiary outline outline-1 outline-tertiary/20',
  IN_PROGRESS: 'bg-secondary/10 text-secondary outline outline-1 outline-secondary/20',
  MAINTAINED: 'bg-primary/10 text-primary outline outline-1 outline-primary/20',
  PLANNING: 'bg-outline-variant/20 text-outline outline outline-1 outline-outline-variant/30',
  ARCHIVED: 'bg-outline-variant/20 text-outline outline outline-1 outline-outline-variant/30',

  // Difficulty levels
  BEGINNER: 'bg-emerald-500/10 text-emerald-400 outline outline-1 outline-emerald-500/20',
  INTERMEDIATE: 'bg-secondary/10 text-secondary outline outline-1 outline-secondary/20',
  ADVANCED: 'bg-primary/10 text-primary outline outline-1 outline-primary/20',
  EXPERT: 'bg-tertiary/10 text-tertiary outline outline-1 outline-tertiary/20',
};

const displayLabels: Record<string, string> = {
  COMPLETED: 'Completed',
  IN_PROGRESS: 'In Progress',
  MAINTAINED: 'Maintained',
  PLANNING: 'Planning',
  ARCHIVED: 'Archived',
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
  EXPERT: 'Expert',
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const colorClasses = statusStyles[status] ?? statusStyles.PLANNING;
  const text = label ?? displayLabels[status] ?? status;

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${colorClasses}`}>
      {text}
    </span>
  );
}

/*
 * ============================================================================
 * COMPONENT: StatusBadge
 * ============================================================================
 *
 * PURPOSE:
 *   Colored badge that displays a project status (COMPLETED, IN_PROGRESS, etc.)
 *   or difficulty level (BEGINNER, ADVANCED, etc.). Each value gets a distinct
 *   color so users can scan status at a glance.
 *
 * PROPS:
 *   status: ProjectStatus | DifficultyLevel — the enum value to display
 *   label?: string — override the display text (default: human-readable version)
 *
 * DESIGN PATTERN — Color Mapping:
 *   Each status maps to a color set using the same structure:
 *     bg-{color}/10      → very faint colored background (10% opacity)
 *     text-{color}       → colored text
 *     outline-{color}/20 → subtle colored outline (20% opacity)
 *   This creates a "tinted chip" effect — the color is present but not
 *   overwhelming against the dark surface backgrounds.
 *
 * TAILWIND BREAKDOWN:
 *   Base classes (all badges):
 *   ┌─────────────────────────┬──────────────────────────────────┬──────────────────────────────────┐
 *   │ Tailwind                 │ CSS                              │ What it does                     │
 *   ├─────────────────────────┼──────────────────────────────────┼──────────────────────────────────┤
 *   │ px-3 py-1                │ padding: 4px 12px                │ Compact padding                  │
 *   │ rounded-full             │ border-radius: 9999px            │ Pill shape                       │
 *   │ text-[10px]              │ font-size: 10px                  │ Very small text                  │
 *   │ font-bold                │ font-weight: 700                 │ Bold for readability             │
 *   │ tracking-widest          │ letter-spacing: 0.1em            │ Wide spacing for small caps      │
 *   │ uppercase                │ text-transform: uppercase        │ Force uppercase                  │
 *   └─────────────────────────┴──────────────────────────────────┴──────────────────────────────────┘
 *
 *   COMPLETED example:
 *   ┌─────────────────────────┬──────────────────────────────────┬──────────────────────────────────┐
 *   │ bg-tertiary/10           │ background: rgba(255,165,217,    │ Faint pink background            │
 *   │                          │ 0.1)                             │                                  │
 *   │ text-tertiary            │ color: #ffa5d9                   │ Pink text                        │
 *   │ outline outline-1        │ outline: 1px solid               │ 1px outline (like border but     │
 *   │ outline-tertiary/20      │ rgba(255,165,217, 0.2)           │ doesn't affect layout)           │
 *   └─────────────────────────┴──────────────────────────────────┴──────────────────────────────────┘
 *
 * ============================================================================
 */
