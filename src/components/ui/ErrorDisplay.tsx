import { Button } from './Button';

interface ErrorDisplayProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorDisplay({
  message = 'Something went wrong. Please try again.',
  onRetry,
}: ErrorDisplayProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-error/10">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-error">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <p className="max-w-md text-on-surface-variant">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}

/*
 * ============================================================================
 * COMPONENT: ErrorDisplay
 * ============================================================================
 *
 * PURPOSE:
 *   Error state shown when an API request fails or data can't be loaded.
 *   Displays an error icon, a message, and an optional retry button.
 *
 * PROPS:
 *   message?: string           — error message (default: generic message)
 *   onRetry?: () => void       — if provided, shows a "Try Again" button
 *
 * REACT PATTERN — Composing Components:
 *   This component uses the Button component we already built. This is
 *   component composition — building complex UI from simpler pieces.
 *   Java analogy: like calling a method from another class rather than
 *   duplicating the logic.
 *
 * TAILWIND BREAKDOWN:
 *   Error icon circle: "flex h-16 w-16 items-center justify-center rounded-full bg-error/10"
 *   ┌─────────────────────────┬──────────────────────────────────┬──────────────────────────────────┐
 *   │ Tailwind                 │ CSS                              │ What it does                     │
 *   ├─────────────────────────┼──────────────────────────────────┼──────────────────────────────────┤
 *   │ h-16 w-16                │ height/width: 64px               │ 64px circle                      │
 *   │ rounded-full             │ border-radius: 9999px            │ Circle shape                     │
 *   │ bg-error/10              │ background: rgba(255,110,132,    │ Very faint red/pink background   │
 *   │                          │ 0.1)                             │                                  │
 *   │ flex items-center        │ display: flex; align/justify:    │ Center the SVG icon inside       │
 *   │ justify-center           │ center                           │                                  │
 *   └─────────────────────────┴──────────────────────────────────┴──────────────────────────────────┘
 *
 * ============================================================================
 */
