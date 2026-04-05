interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-surface-container-highest border-t-primary" />
      <p className="text-sm text-on-surface-variant">{message}</p>
    </div>
  );
}

/*
 * ============================================================================
 * COMPONENT: LoadingSpinner
 * ============================================================================
 *
 * PURPOSE:
 *   Loading indicator shown while data is being fetched from the API.
 *   Displays a spinning circle and an optional message below it.
 *
 * PROPS:
 *   message?: string — text below the spinner (default: "Loading...")
 *
 * TAILWIND BREAKDOWN:
 *   Spinner: "h-8 w-8 animate-spin rounded-full border-2 border-surface-container-highest border-t-primary"
 *   ┌─────────────────────────┬──────────────────────────────────┬──────────────────────────────────┐
 *   │ Tailwind                 │ CSS                              │ What it does                     │
 *   ├─────────────────────────┼──────────────────────────────────┼──────────────────────────────────┤
 *   │ h-8 w-8                  │ height/width: 32px               │ 32px square                      │
 *   │ animate-spin             │ animation: spin 1s linear        │ Continuous 360° rotation         │
 *   │                          │ infinite                         │                                  │
 *   │ rounded-full             │ border-radius: 9999px            │ Circle shape                     │
 *   │ border-2                 │ border-width: 2px                │ Visible border                   │
 *   │ border-surface-          │ border-color: #262626            │ Dark gray — most of the circle   │
 *   │ container-highest        │                                  │                                  │
 *   │ border-t-primary         │ border-top-color: #a3a6ff        │ Top edge is indigo — as it       │
 *   │                          │                                  │ spins, this creates the          │
 *   │                          │                                  │ "loading arc" effect             │
 *   └─────────────────────────┴──────────────────────────────────┴──────────────────────────────────┘
 *
 * HOW THE SPINNER WORKS:
 *   A circle with a mostly-dark border and one indigo edge (top). When
 *   `animate-spin` rotates it continuously, the indigo arc appears to
 *   chase itself around the circle. Classic CSS spinner technique.
 *
 * ============================================================================
 */
