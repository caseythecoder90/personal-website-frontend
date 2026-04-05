interface TechPillProps {
  name: string;
}

export function TechPill({ name }: TechPillProps) {
  return (
    <span className="bg-surface-variant text-on-surface-variant px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
      {name}
    </span>
  );
}

/*
 * ============================================================================
 * COMPONENT: TechPill
 * ============================================================================
 *
 * PURPOSE:
 *   Small badge/pill that displays a technology name (e.g., "Java",
 *   "Spring Boot", "Docker"). Used in project cards, certification cards,
 *   and blog post cards to show the tech stack.
 *
 * PROPS:
 *   name: string — the technology name to display
 *
 * HTML STRUCTURE:
 *   <span>Java</span>    ← single inline element
 *
 * TAILWIND BREAKDOWN:
 *   ┌─────────────────────────┬──────────────────────────────────┬──────────────────────────────────┐
 *   │ Tailwind                 │ CSS                              │ What it does                     │
 *   ├─────────────────────────┼──────────────────────────────────┼──────────────────────────────────┤
 *   │ bg-surface-variant       │ background-color: #262626        │ Dark gray background             │
 *   │ text-on-surface-variant  │ color: #adaaaa                   │ Muted gray text                  │
 *   │ px-3 py-1                │ padding: 4px 12px                │ Compact horizontal padding       │
 *   │ rounded-full             │ border-radius: 9999px            │ Fully rounded (pill shape)       │
 *   │ text-[10px]              │ font-size: 10px                  │ Very small text (arbitrary val)  │
 *   │ font-bold                │ font-weight: 700                 │ Bold for readability at 10px     │
 *   │ uppercase                │ text-transform: uppercase        │ "java" → "JAVA"                 │
 *   │ tracking-wider           │ letter-spacing: 0.05em           │ Spread letters for readability   │
 *   └─────────────────────────┴──────────────────────────────────┴──────────────────────────────────┘
 *
 * ============================================================================
 */
