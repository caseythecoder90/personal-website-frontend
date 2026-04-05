interface SkillBarProps {
  name: string;
  percentage: number;
}

export function SkillBar({ name, percentage }: SkillBarProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center text-sm font-bold tracking-wider uppercase">
        <span>{name}</span>
        <span className="text-on-surface-variant">{percentage}%</span>
      </div>
      <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-dim to-primary transition-all duration-700"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

/*
 * ============================================================================
 * COMPONENT: SkillBar
 * ============================================================================
 *
 * PURPOSE:
 *   Horizontal progress bar showing technology proficiency level. Used on the
 *   homepage "Technology Showcase" section.
 *
 * PROPS:
 *   name: string       — technology name (e.g., "Java / Spring Boot")
 *   percentage: number  — proficiency level 0-100
 *
 * HTML STRUCTURE:
 *   <div>                              ← outer wrapper with vertical spacing
 *     <div>                            ← label row: name left, percentage right
 *       <span>Java / Spring Boot</span>
 *       <span>95%</span>
 *     </div>
 *     <div>                            ← track (gray background)
 *       <div style="width: 95%" />     ← fill (gradient, dynamic width)
 *     </div>
 *   </div>
 *
 * REACT PATTERN — Inline Style for Dynamic Values:
 *   The fill bar width uses `style={{ width: `${percentage}%` }}` instead of
 *   a Tailwind class because the percentage is dynamic data from the API.
 *   Tailwind classes like `w-[95%]` are generated at build time — they can't
 *   handle runtime values. For dynamic CSS values, inline styles are the
 *   correct approach.
 *
 * TAILWIND BREAKDOWN:
 *   Label row: "flex justify-between items-center text-sm font-bold tracking-wider uppercase"
 *   ┌─────────────────────────┬──────────────────────────────────┬──────────────────────────────────┐
 *   │ flex justify-between     │ display: flex; justify-content:  │ Name on left, % on right         │
 *   │                          │ space-between                    │                                  │
 *   │ items-center             │ align-items: center              │ Vertically centered              │
 *   │ text-sm                  │ font-size: 14px                  │ Small label text                 │
 *   │ font-bold                │ font-weight: 700                 │ Bold                             │
 *   │ tracking-wider           │ letter-spacing: 0.05em           │ Spread letters                   │
 *   │ uppercase                │ text-transform: uppercase        │ "java" → "JAVA"                 │
 *   └─────────────────────────┴──────────────────────────────────┴──────────────────────────────────┘
 *
 *   Bar track: "h-1 bg-surface-container-highest rounded-full overflow-hidden"
 *   ┌─────────────────────────┬──────────────────────────────────┬──────────────────────────────────┐
 *   │ h-1                      │ height: 4px                      │ Thin bar                         │
 *   │ bg-surface-container-    │ background: #262626              │ Dark gray track                  │
 *   │ highest                  │                                  │                                  │
 *   │ rounded-full             │ border-radius: 9999px            │ Fully rounded ends               │
 *   │ overflow-hidden          │ overflow: hidden                 │ Clips the fill bar to the track  │
 *   └─────────────────────────┴──────────────────────────────────┴──────────────────────────────────┘
 *
 *   Bar fill: "h-full bg-gradient-to-r from-primary-dim to-primary"
 *   ┌─────────────────────────┬──────────────────────────────────┬──────────────────────────────────┐
 *   │ h-full                   │ height: 100%                     │ Same height as track (4px)       │
 *   │ bg-gradient-to-r         │ linear-gradient(to right, ...)   │ Gradient left to right           │
 *   │ from-primary-dim         │ from #6063ee                     │ Deep indigo on left              │
 *   │ to-primary               │ to #a3a6ff                       │ Light indigo on right            │
 *   │ transition-all           │ transition: all 700ms            │ Animate width changes            │
 *   │ duration-700             │                                  │ (smooth fill on load)            │
 *   └─────────────────────────┴──────────────────────────────────┴──────────────────────────────────┘
 *
 * ============================================================================
 */
