interface SkillBarProps {
  name: string;
  percentage: number;
}

export function SkillBar({ name, percentage }: SkillBarProps) {
  return (
    <div className="group space-y-4">
      <div className="flex justify-between items-end">
        <h4 className="text-lg font-bold text-white tracking-widest uppercase">
          {name}
        </h4>
        <span className="text-secondary font-bold font-headline text-xl">{percentage}%</span>
      </div>
      <div className="h-1.5 w-full bg-surface-variant rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-dim to-primary rounded-full transition-all duration-1000"
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
 *   Label row: "flex justify-between items-end"
 *   ┌─────────────────────────┬──────────────────────────────────┬──────────────────────────────────┐
 *   │ flex justify-between     │ display: flex; justify-content:  │ Name on left, % on right         │
 *   │                          │ space-between                    │                                  │
 *   │ items-end                │ align-items: flex-end            │ Align to bottom (baseline of     │
 *   │                          │                                  │ different-sized text)             │
 *   └─────────────────────────┴──────────────────────────────────┴──────────────────────────────────┘
 *
 *   Name: "text-lg font-bold text-white tracking-widest uppercase"
 *   ┌─────────────────────────┬──────────────────────────────────┬──────────────────────────────────┐
 *   │ text-lg                  │ font-size: 18px                  │ Larger than before (was 14px)    │
 *   │ font-bold                │ font-weight: 700                 │ Bold                             │
 *   │ tracking-widest          │ letter-spacing: 0.1em            │ Very wide spacing                │
 *   │ uppercase                │ text-transform: uppercase        │ "java" → "JAVA"                 │
 *   └─────────────────────────┴──────────────────────────────────┴──────────────────────────────────┘
 *
 *   Percentage: "text-secondary font-bold font-headline text-xl"
 *   ┌─────────────────────────┬──────────────────────────────────┬──────────────────────────────────┐
 *   │ text-secondary           │ color: #a28efc                   │ Purple accent (was gray)         │
 *   │ font-headline            │ font-family: Space Grotesk       │ Display font for emphasis        │
 *   │ text-xl                  │ font-size: 20px                  │ Larger percentage number         │
 *   │ font-bold                │ font-weight: 700                 │ Bold                             │
 *   └─────────────────────────┴──────────────────────────────────┴──────────────────────────────────┘
 *
 *   Bar track: "h-1.5 w-full bg-surface-variant rounded-full overflow-hidden"
 *   ┌─────────────────────────┬──────────────────────────────────┬──────────────────────────────────┐
 *   │ h-1.5                    │ height: 6px                      │ Thicker bar (was 4px)            │
 *   │ bg-surface-variant       │ background: #262626              │ Dark gray track                  │
 *   │ rounded-full             │ border-radius: 9999px            │ Fully rounded ends               │
 *   │ overflow-hidden          │ overflow: hidden                 │ Clips the fill bar to the track  │
 *   └─────────────────────────┴──────────────────────────────────┴──────────────────────────────────┘
 *
 *   Bar fill: "h-full bg-gradient-to-r from-primary-dim to-primary rounded-full transition-all duration-1000"
 *   ┌─────────────────────────┬──────────────────────────────────┬──────────────────────────────────┐
 *   │ h-full                   │ height: 100%                     │ Same height as track (6px)       │
 *   │ bg-gradient-to-r         │ linear-gradient(to right, ...)   │ Gradient left to right           │
 *   │ from-primary-dim         │ from #6063ee                     │ Deep indigo on left              │
 *   │ to-primary               │ to #a3a6ff                       │ Light indigo on right            │
 *   │ rounded-full             │ border-radius: 9999px            │ Rounded fill cap                 │
 *   │ transition-all           │ transition: all 1000ms           │ Smooth 1s fill animation         │
 *   │ duration-1000            │                                  │                                  │
 *   └─────────────────────────┴──────────────────────────────────┴──────────────────────────────────┘
 *
 * ============================================================================
 */
