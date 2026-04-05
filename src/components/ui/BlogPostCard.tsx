import type { BlogPostResponse } from '@/types';
import { TechPill } from './TechPill';

interface BlogPostCardProps {
  post: BlogPostResponse;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const primaryImage = post.images.find((img) => img.isPrimary) ?? post.images[0];
  const primaryCategory = post.categories[0];
  const publishDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : null;

  return (
    <article className="group bg-surface-container-low rounded-xl overflow-hidden hover:bg-surface-container-highest transition-all duration-500 relative flex flex-col md:flex-row gap-8 p-6 md:p-10 border-l-2 border-transparent hover:border-primary">
      {/* Image */}
      <div className="w-full md:w-1/3 aspect-[16/10] overflow-hidden rounded-lg bg-surface-container-highest">
        {primaryImage ? (
          <img
            src={primaryImage.url}
            alt={primaryImage.altText ?? post.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-on-surface-variant/30">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center">
        {/* Metadata row */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          {primaryCategory && (
            <span className="text-tertiary bg-tertiary/10 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
              {primaryCategory.name}
            </span>
          )}
          {publishDate && (
            <span className="text-on-surface-variant text-xs">{publishDate}</span>
          )}
          {post.readTimeMinutes && (
            <span className="text-on-surface-variant text-xs">{post.readTimeMinutes} min read</span>
          )}
        </div>

        {/* Title */}
        <h2 className="font-headline text-2xl md:text-3xl font-bold text-on-surface mb-4 group-hover:text-primary transition-colors tracking-tight">
          <a href={`/blog/${post.slug}`}>{post.title}</a>
        </h2>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-on-surface-variant leading-relaxed mb-6">{post.excerpt}</p>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {post.tags.map((tag) => (
            <TechPill key={tag.id} name={`#${tag.name}`} />
          ))}
        </div>
      </div>
    </article>
  );
}

/*
 * ============================================================================
 * COMPONENT: BlogPostCard
 * ============================================================================
 *
 * PURPOSE:
 *   Horizontal card for blog post listings. Shows a thumbnail image on the
 *   left and post metadata, title, excerpt, and tags on the right. On mobile
 *   it stacks vertically.
 *
 * PROPS:
 *   post: BlogPostResponse — the full blog post object from the API
 *
 * REACT PATTERNS:
 *
 *   new Date(post.publishedAt).toLocaleDateString('en-US', { ... })
 *     - Converts ISO date string to human-readable format
 *     - 'en-US' locale with month/day/year options → "May 12, 2024"
 *     - Java analogy: DateTimeFormatter.ofPattern("MMM d, yyyy")
 *
 *   post.tags.map(tag => <TechPill name={`#${tag.name}`} />)
 *     - Template literal with # prefix: tag "WASM" → "#WASM"
 *     - Reuses TechPill component for tag display
 *
 * TAILWIND BREAKDOWN:
 *   Card: "group bg-surface-container-low rounded-xl overflow-hidden
 *          hover:bg-surface-container-highest transition-all duration-500
 *          flex flex-col md:flex-row gap-8 p-6 md:p-10
 *          border-l-2 border-transparent hover:border-primary"
 *   ┌─────────────────────────┬──────────────────────────────────┬──────────────────────────────────┐
 *   │ Tailwind                 │ CSS                              │ What it does                     │
 *   ├─────────────────────────┼──────────────────────────────────┼──────────────────────────────────┤
 *   │ flex flex-col            │ display: flex;                   │ DEFAULT: stack vertically        │
 *   │ md:flex-row              │ flex-direction: column/row       │ TABLET+: side by side            │
 *   │ border-l-2               │ border-left-width: 2px           │ Left accent border               │
 *   │ border-transparent       │ border-color: transparent        │ Invisible by default             │
 *   │ hover:border-primary     │ :hover { border-color:           │ Indigo left border on hover —    │
 *   │                          │ #a3a6ff }                        │ subtle accent highlight           │
 *   └─────────────────────────┴──────────────────────────────────┴──────────────────────────────────┘
 *
 *   Category badge: "text-tertiary bg-tertiary/10 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase"
 *   ┌─────────────────────────┬──────────────────────────────────┬──────────────────────────────────┐
 *   │ text-tertiary            │ color: #ffa5d9                   │ Pink text                        │
 *   │ bg-tertiary/10           │ background: rgba(255,165,217,    │ Very faint pink background       │
 *   │                          │ 0.1)                             │                                  │
 *   └─────────────────────────┴──────────────────────────────────┴──────────────────────────────────┘
 *
 * ============================================================================
 */
