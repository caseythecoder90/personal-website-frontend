import { useState } from 'react';
import type { TechnologyResponse } from '@/types';
import { SkillBar } from './SkillBar';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorDisplay } from './ErrorDisplay';

// ============================================================================
// Display group configuration
// ============================================================================

/** Technologies with these names are classified as Frontend, not Backend. */
const FRONTEND_TECH_NAMES = new Set([
  'React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Next.js', 'Vue',
  'Angular', 'JavaScript', 'HTML', 'CSS', 'Svelte',
]);

interface DisplayGroup {
  label: string;
  categories: string[];
  quote: string;
}

const DISPLAY_GROUPS: DisplayGroup[] = [
  {
    label: 'Backend',
    categories: ['LANGUAGE', 'FRAMEWORK', 'LIBRARY'],
    quote: "Specializing in the backend layer allows me to build the resilient 'engine' that drives high-scale applications. My focus is always on type-safety, performance benchmarks, and clean architectural patterns.",
  },
  {
    label: 'Frontend',
    categories: ['FRAMEWORK', 'LIBRARY'],
    quote: 'The interface is the user\'s first impression. I focus on building responsive, accessible experiences that feel as polished as the systems behind them.',
  },
  {
    label: 'Databases',
    categories: ['DATABASE'],
    quote: 'Data modeling is where architecture meets reality. Getting the schema right means everything downstream — queries, caching, migrations — falls into place.',
  },
  {
    label: 'DevOps',
    categories: ['TOOL', 'DEPLOYMENT', 'TESTING'],
    quote: 'Automation and observability turn good code into reliable systems. I believe the deploy pipeline is just as important as the application itself.',
  },
  {
    label: 'Cloud',
    categories: ['CLOUD'],
    quote: 'Cloud infrastructure is about making deliberate tradeoffs — cost, latency, availability. I approach it with the same rigor as application architecture.',
  },
];

// ============================================================================
// Props
// ============================================================================

interface TechnologyShowcaseProps {
  technologies: TechnologyResponse[];
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
}

// ============================================================================
// Helper
// ============================================================================

const proficiencyToPercent = (level: string | null): number => {
  switch (level) {
    case 'EXPERT': return 95;
    case 'PROFICIENT': return 80;
    case 'FAMILIAR': return 60;
    case 'LEARNING': return 40;
    default: return 50;
  }
};

// ============================================================================
// Component
// ============================================================================

export function TechnologyShowcase({ technologies, loading, error, onRetry }: TechnologyShowcaseProps) {
  const [activeTab, setActiveTab] = useState(0);
  const activeGroup = DISPLAY_GROUPS[activeTab];

  // Filter technologies for the active tab
  const filteredTechs = technologies.filter((tech) => {
    if (!activeGroup.categories.includes(tech.category)) return false;

    // Disambiguate Frontend vs Backend for shared categories (FRAMEWORK, LIBRARY)
    const isFrontendTab = activeGroup.label === 'Frontend';
    const isBackendTab = activeGroup.label === 'Backend';
    const isFrontendTech = FRONTEND_TECH_NAMES.has(tech.name);

    if (isFrontendTab) return isFrontendTech;
    if (isBackendTab && (tech.category === 'FRAMEWORK' || tech.category === 'LIBRARY')) {
      return !isFrontendTech;
    }
    return true;
  });

  return (
    <section className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-16 max-w-3xl space-y-4">
          <h3 className="text-tertiary font-headline text-sm tracking-[0.25em] font-bold uppercase">
            Core Competencies
          </h3>
          <h2 className="text-5xl md:text-6xl font-headline font-bold text-white tracking-tighter">
            Technology Showcase
          </h2>
        </div>

        {/* Tab buttons */}
        <div className="flex flex-wrap gap-3 mb-16">
          {DISPLAY_GROUPS.map((group, index) => (
            <button
              key={group.label}
              onClick={() => setActiveTab(index)}
              className={`px-8 py-2.5 rounded-full font-bold text-sm tracking-wide transition-all ${
                index === activeTab
                  ? 'bg-primary text-background shadow-[0_4px_15px_rgba(163,166,255,0.2)]'
                  : 'bg-surface-variant text-on-surface-variant hover:text-white hover:bg-neutral-800'
              }`}
            >
              {group.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading && <LoadingSpinner message="Loading technologies..." />}
        {error && <ErrorDisplay message={error} onRetry={onRetry} />}
        {!loading && !error && (
          <div className="grid lg:grid-cols-12 gap-12">
            {/* Skill bars */}
            <div className="lg:col-span-8 space-y-12">
              {filteredTechs.length > 0 ? (
                filteredTechs.map((tech) => (
                  <SkillBar
                    key={tech.id}
                    name={tech.name}
                    percentage={proficiencyToPercent(tech.proficiencyLevel)}
                  />
                ))
              ) : (
                <p className="text-on-surface-variant py-8">
                  No {activeGroup.label.toLowerCase()} technologies featured yet.
                </p>
              )}
            </div>

            {/* Philosophy quote card */}
            <div className="lg:col-span-4 hidden lg:block">
              <div className="rounded-2xl bg-surface-container-low border-l-4 border-primary/20 p-8 space-y-6">
                <p className="text-on-surface-variant leading-relaxed italic text-lg">
                  "{activeGroup.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-px w-10 bg-primary/40" />
                  <span className="text-primary font-bold text-xs uppercase tracking-widest">
                    Philosophy
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/*
 * ============================================================================
 * COMPONENT: TechnologyShowcase
 * ============================================================================
 *
 * PURPOSE:
 *   Tabbed technology proficiency section for the homepage. Displays skill
 *   bars filtered by category (Backend, Frontend, Databases, DevOps, Cloud)
 *   with a philosophy quote card that changes per tab.
 *
 * PROPS:
 *   technologies: TechnologyResponse[]  — all featured technologies from API
 *   loading: boolean                    — is data still fetching?
 *   error: string | null               — error message if fetch failed
 *   onRetry?: () => void               — callback to retry the fetch
 *
 * DATA ARCHITECTURE — Display Groups:
 *   The backend has TechnologyCategory enums (LANGUAGE, FRAMEWORK, etc.) but
 *   the UI needs display groups (Backend, Frontend, etc.). Instead of changing
 *   the backend, we map categories to display groups on the frontend:
 *
 *   Backend  → LANGUAGE, FRAMEWORK, LIBRARY (excluding frontend techs)
 *   Frontend → FRAMEWORK, LIBRARY (only frontend techs like React, Vue)
 *   Databases → DATABASE
 *   DevOps   → TOOL, DEPLOYMENT, TESTING
 *   Cloud    → CLOUD
 *
 *   Since FRAMEWORK and LIBRARY belong to both Backend AND Frontend, we use
 *   a FRONTEND_TECH_NAMES set to disambiguate. If a tech's name is in this
 *   set, it goes to Frontend; otherwise it goes to Backend.
 *
 *   Java analogy: this is like having a simple mapping layer between your
 *   domain model and your view model — the backend stores raw categories,
 *   the frontend transforms them for display.
 *
 * REACT PATTERNS:
 *
 *   useState for tab selection:
 *     const [activeTab, setActiveTab] = useState(0);
 *     - Stores which tab index is active (0 = Backend, 1 = Frontend, etc.)
 *     - Clicking a tab calls setActiveTab(index), React re-renders, and
 *       the filtered list + quote update automatically
 *
 *   Filtering derived from state:
 *     const filteredTechs = technologies.filter(...)
 *     - This runs on EVERY render, but that's fine — filtering a small array
 *       is nearly instant. No need to cache/memoize this.
 *     - The filter logic runs whenever activeTab changes (because the
 *       component re-renders when state changes)
 *     - Java analogy: like a Stream.filter() that runs on demand
 *
 *   Conditional className with ternary:
 *     className={`... ${index === activeTab ? 'active styles' : 'inactive styles'}`}
 *     - Template literal with embedded ternary to swap classes
 *     - Same pattern used in Navbar's NavLink, but here we control it
 *       with our own state instead of React Router's isActive
 *
 * TAILWIND BREAKDOWN:
 *
 *   Active tab: "px-8 py-2.5 rounded-full bg-primary text-background font-bold
 *                text-sm tracking-wide shadow-[0_4px_15px_rgba(163,166,255,0.2)]"
 *   ┌─────────────────────────┬──────────────────────────────────┬──────────────────────────────────┐
 *   │ Tailwind                 │ CSS                              │ What it does                     │
 *   ├─────────────────────────┼──────────────────────────────────┼──────────────────────────────────┤
 *   │ bg-primary               │ background: #a3a6ff              │ Solid indigo background          │
 *   │ text-background          │ color: #0e0e0e                   │ Dark text on light bg            │
 *   │ shadow-[...]             │ box-shadow: 0 4px 15px           │ Downward indigo glow beneath     │
 *   │                          │ rgba(163,166,255,0.2)            │ the active tab                   │
 *   └─────────────────────────┴──────────────────────────────────┴──────────────────────────────────┘
 *
 *   Inactive tab: "bg-surface-variant text-on-surface-variant hover:text-white hover:bg-neutral-800"
 *   ┌─────────────────────────┬──────────────────────────────────┬──────────────────────────────────┐
 *   │ bg-surface-variant       │ background: #262626              │ Dark gray pill                   │
 *   │ text-on-surface-variant  │ color: #adaaaa                   │ Muted text                       │
 *   │ hover:text-white         │ :hover { color: #fff }           │ Brighten text on hover           │
 *   │ hover:bg-neutral-800     │ :hover { background: ~#262626 }  │ Slightly lighter bg on hover     │
 *   └─────────────────────────┴──────────────────────────────────┴──────────────────────────────────┘
 *
 *   Quote card: "rounded-2xl bg-surface-container-low border-l-4 border-primary/20 p-8"
 *   ┌─────────────────────────┬──────────────────────────────────┬──────────────────────────────────┐
 *   │ rounded-2xl              │ border-radius: 1rem              │ Large rounded corners            │
 *   │ bg-surface-container-    │ background: #131313              │ Slightly elevated surface        │
 *   │ low                      │                                  │                                  │
 *   │ border-l-4               │ border-left: 4px solid           │ Thick left accent border         │
 *   │ border-primary/20        │ rgba(163,166,255, 0.2)           │ at 20% opacity — subtle          │
 *   └─────────────────────────┴──────────────────────────────────┴──────────────────────────────────┘
 *
 *   Grid layout: "grid lg:grid-cols-12 gap-12"
 *   ┌─────────────────────────┬──────────────────────────────────┬──────────────────────────────────┐
 *   │ lg:grid-cols-12          │ 12-column grid at 1024px+        │ Only splits on desktop           │
 *   │ lg:col-span-8            │ skills take 8 of 12 columns      │ ~67% width                       │
 *   │ lg:col-span-4            │ quote takes 4 of 12 columns      │ ~33% width                       │
 *   │ hidden lg:block          │ quote hidden below 1024px         │ Mobile: skills only              │
 *   └─────────────────────────┴──────────────────────────────────┴──────────────────────────────────┘
 *
 * ============================================================================
 */
