import type { ProjectResponse } from '@/types';
import { TechPill } from './TechPill';
import { StatusBadge } from './StatusBadge';

interface ProjectCardProps {
  project: ProjectResponse;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const primaryImage = project.images.find((img) => img.isPrimary) ?? project.images[0];

  return (
    <article className="group bg-surface-container-low p-8 rounded-xl transition-all duration-300 hover:bg-surface-container-highest hover:shadow-[0_1px_0_0_rgba(163,166,255,0.4)_inset] relative overflow-hidden">
      {/* Image */}
      <div className="aspect-video mb-8 overflow-hidden rounded-lg bg-surface-container-highest">
        {primaryImage ? (
          <img
            src={primaryImage.url}
            alt={primaryImage.altText ?? project.name}
            className="h-full w-full object-cover opacity-60 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-on-surface-variant/30">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
      </div>

      {/* Badges */}
      <div className="mb-4 flex flex-wrap gap-2">
        <StatusBadge status={project.status} />
        {project.difficultyLevel && (
          <StatusBadge status={project.difficultyLevel} />
        )}
      </div>

      {/* Title */}
      <h3 className="font-headline text-xl font-bold text-on-surface mb-3 tracking-tight">
        {project.name}
      </h3>

      {/* Description */}
      <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
        {project.shortDescription}
      </p>

      {/* Tech pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {project.technologies.map((tech) => (
          <TechPill key={tech.id} name={tech.name} />
        ))}
      </div>

      {/* View link */}
      <a
        href={`/projects/${project.slug}`}
        className="text-primary font-semibold flex items-center gap-1 group/link"
      >
        View Case Study
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover/link:translate-x-1">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </a>
    </article>
  );
}

/*
 * ============================================================================
 * COMPONENT: ProjectCard
 * ============================================================================
 *
 * PURPOSE:
 *   Card displaying a project summary with image, badges, description, tech
 *   stack, and a link to the detail page. Used on the Projects listing page
 *   and the Homepage featured projects section.
 *
 * PROPS:
 *   project: ProjectResponse — the full project object from the API
 *
 * COMPONENT COMPOSITION:
 *   This component uses TechPill and StatusBadge — smaller components we
 *   built earlier. This is the power of React composition: complex UI built
 *   from simple, tested pieces.
 *
 * REACT PATTERNS:
 *
 *   project.images.find(img => img.isPrimary) ?? project.images[0]
 *     - .find() searches the array for the primary image
 *     - ?? (nullish coalescing) falls back to the first image if no primary
 *     - If no images at all, shows a placeholder SVG icon
 *
 *   project.technologies.map(tech => <TechPill key={tech.id} ... />)
 *     - Renders a TechPill for each technology in the project
 *     - key={tech.id} uses the database ID as the unique key
 *
 *   {project.difficultyLevel && <StatusBadge ... />}
 *     - Only renders the difficulty badge if the field is not null
 *     - Short-circuit rendering: if left side is null/falsy, nothing renders
 *
 *   group/link and group-hover/link:translate-x-1
 *     - Tailwind's named group pattern. The /link suffix creates a NAMED
 *       group so the arrow only moves when hovering this specific link,
 *       not the entire card (which has its own `group` class)
 *
 * TAILWIND BREAKDOWN:
 *   Card: "group bg-surface-container-low p-8 rounded-xl transition-all duration-300
 *          hover:bg-surface-container-highest hover:shadow-[0_1px_0_0_rgba(163,166,255,0.4)_inset]"
 *   ┌─────────────────────────┬──────────────────────────────────┬──────────────────────────────────┐
 *   │ Tailwind                 │ CSS                              │ What it does                     │
 *   ├─────────────────────────┼──────────────────────────────────┼──────────────────────────────────┤
 *   │ group                    │ (no CSS — Tailwind marker)       │ Marks this as a group parent so  │
 *   │                          │                                  │ children can use group-hover:     │
 *   │ bg-surface-container-    │ background: #131313              │ Dark card background             │
 *   │ low                      │                                  │                                  │
 *   │ p-8                      │ padding: 32px                    │ Generous internal spacing        │
 *   │ rounded-xl               │ border-radius: 0.75rem          │ Rounded corners                  │
 *   │ transition-all           │ transition: all 300ms            │ Animate all property changes     │
 *   │ duration-300             │                                  │                                  │
 *   │ hover:bg-surface-        │ :hover { background: #262626 }  │ Lighter bg on hover (tonal lift) │
 *   │ container-highest        │                                  │                                  │
 *   │ hover:shadow-[...]       │ :hover { box-shadow: inset      │ Indigo glow on top edge — the    │
 *   │                          │ 0 1px 0 0 rgba(163,166,255,     │ "accent glow" from the design    │
 *   │                          │ 0.4) }                           │ system. Inset = inside the card  │
 *   └─────────────────────────┴──────────────────────────────────┴──────────────────────────────────┘
 *
 *   Image: "h-full w-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-100"
 *   ┌─────────────────────────┬──────────────────────────────────┬──────────────────────────────────┐
 *   │ object-cover             │ object-fit: cover                │ Image fills container, crops     │
 *   │                          │                                  │ overflow (no distortion)         │
 *   │ opacity-60               │ opacity: 0.6                     │ Dimmed by default                │
 *   │ group-hover:opacity-100  │ .group:hover & { opacity: 1 }   │ Full brightness when card        │
 *   │                          │                                  │ is hovered                       │
 *   │ group-hover:scale-105    │ .group:hover & { transform:     │ Slight zoom on card hover        │
 *   │                          │ scale(1.05) }                    │                                  │
 *   └─────────────────────────┴──────────────────────────────────┴──────────────────────────────────┘
 *
 * ============================================================================
 */
