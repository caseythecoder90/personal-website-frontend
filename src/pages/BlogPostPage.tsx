import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePageTitle } from '@/hooks';
import { blogApi } from '@/api/blog';
import {
  LoadingSpinner,
  ErrorDisplay,
  MarkdownRenderer,
  RelatedPosts,
} from '@/components/ui';
import type { BlogPostResponse } from '@/types';

const MAX_RELATED_POSTS = 3;

function formatPostDate(iso: string | null): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();

  const [post, setPost] = useState<BlogPostResponse | null>(null);
  const [related, setRelated] = useState<BlogPostResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [retryNonce, setRetryNonce] = useState<number>(0);

  usePageTitle(post?.title ?? 'Blog Post');

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    setLoading(true);
    setError(null);
    setNotFound(false);
    setRelated([]);

    blogApi.posts
      .getBySlug(slug)
      .then((data) => {
        if (cancelled) return;
        setPost(data);

        // Fire-and-forget related posts lookup based on first category.
        // If it fails or there's no category, sidebar just hides.
        const firstCategory = (data.categories ?? [])[0];
        if (firstCategory) {
          blogApi.posts
            .getByCategory(firstCategory.slug)
            .then((posts) => {
              if (cancelled) return;
              const filtered = posts
                .filter((p) => p.id !== data.id && p.published)
                .slice(0, MAX_RELATED_POSTS);
              setRelated(filtered);
            })
            .catch(() => {});
        }
      })
      .catch((err: { response?: { status?: number } }) => {
        if (cancelled) return;
        if (err?.response?.status === 404) {
          setNotFound(true);
        } else {
          setError('Failed to load blog post.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug, retryNonce]);

  if (loading) {
    return (
      <main className="pt-32 pb-24">
        <LoadingSpinner message="Loading post..." />
      </main>
    );
  }

  if (error) {
    return (
      <main className="pt-32 pb-24 px-8 max-w-7xl mx-auto">
        <ErrorDisplay message={error} onRetry={() => setRetryNonce((n) => n + 1)} />
      </main>
    );
  }

  if (notFound || !post) {
    return (
      <main className="pt-32 pb-24 px-8 max-w-7xl mx-auto text-center">
        <h1 className="font-headline text-6xl font-bold text-on-surface tracking-tighter mb-4">
          404
        </h1>
        <p className="text-on-surface-variant text-lg mb-8">
          No post found with slug "{slug}".
        </p>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Blog
        </Link>
      </main>
    );
  }

  const images = post.images ?? [];
  const heroImage = images.find((img) => img.isPrimary) ?? images[0];
  const primaryCategory = (post.categories ?? [])[0];
  const publishDate = formatPostDate(post.publishedAt);
  const tags = post.tags ?? [];

  return (
    <main>
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-6">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-primary hover:text-secondary transition-colors group"
        >
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="group-hover:-translate-x-1 transition-transform"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span className="font-medium">Back to blog</span>
        </Link>
      </div>

      {heroImage && (
        <div className="w-full h-[320px] md:h-[450px] relative">
          <img
            src={heroImage.url}
            alt={heroImage.altText ?? post.title}
            className="w-full h-full object-cover grayscale opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>
      )}

      <article
        className={`max-w-4xl mx-auto px-6 relative z-10 ${
          heroImage ? '-mt-24 md:-mt-32' : 'mt-8'
        }`}
      >
        <div className="bg-surface-container-low p-6 md:p-10 lg:p-12 rounded-xl">
          <header className="mb-10">
            {primaryCategory && (
              <span className="inline-block px-3 py-1 bg-surface-container-highest text-tertiary rounded-full text-xs font-bold tracking-widest mb-4 uppercase">
                {primaryCategory.name}
              </span>
            )}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-headline font-bold text-on-background leading-tight tracking-tighter mb-8">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-y-4 gap-x-8 text-on-surface-variant font-medium text-sm py-6 border-y border-outline-variant/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-dim flex items-center justify-center text-[10px] text-on-primary font-bold">
                  CQ
                </div>
                <span>Casey Quinn</span>
              </div>
              {publishDate && (
                <div className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span>{publishDate}</span>
                </div>
              )}
              {post.readTimeMinutes != null && (
                <div className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>{post.readTimeMinutes} min read</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span>{post.viewCount.toLocaleString()} views</span>
              </div>
            </div>
          </header>

          <MarkdownRenderer content={post.content} />

          {tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-outline-variant/10 flex flex-wrap gap-3">
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-3 py-1 bg-surface-container text-on-surface-variant rounded-full text-xs font-mono"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>

      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 mt-24">
          <RelatedPosts posts={related} />
        </section>
      )}

      <div className="h-24" />
    </main>
  );
}

/*
 * ============================================================================
 * PAGE: BlogPostPage
 * ============================================================================
 *
 * PURPOSE:
 *   Individual blog post at /blog/:slug. Fetches the post by slug (the
 *   backend increments the view count on this GET), renders markdown
 *   with syntax-highlighted code blocks, and loads related posts from
 *   the same category in the sidebar.
 *
 * URL PARAMETER EXTRACTION:
 *   const { slug } = useParams<{ slug: string }>();
 *   The generic <{ slug: string }> tells TypeScript what params this route
 *   declares. useParams returns an object matching the :slug in the route
 *   definition (see App.tsx → "/blog/:slug").
 *
 *   Java analogue: like @PathVariable String slug in a Spring controller.
 *
 * FOUR UI STATES:
 *   The component has four mutually exclusive states, handled by early
 *   returns so the main JSX only ever runs when we have a real post:
 *
 *     1. loading              → <LoadingSpinner />
 *     2. error                → <ErrorDisplay /> with retry button
 *     3. 404 (notFound)       → custom 404 markup with back link
 *     4. success (post set)   → the full article layout
 *
 *   Each early return is a React idiom for "short-circuit the render."
 *   Unlike a Spring controller (one return path), React renders whatever
 *   JSX you return, so multiple returns on different branches are normal.
 *
 * REACT / TYPESCRIPT PATTERNS:
 *
 *   1. STALE-RESPONSE GUARD (same pattern as BlogPage)
 *      let cancelled = false;
 *      ...fetch.then(data => { if (cancelled) return; setPost(data); })
 *      return () => { cancelled = true; };
 *
 *      The cleanup runs:
 *        - Before the effect re-runs (slug or retryNonce changed)
 *        - On unmount
 *        - Twice in dev with React.StrictMode
 *
 *      Each effect invocation has its own `cancelled` closure. Flipping
 *      the old invocation's flag in cleanup prevents a slow fetch for
 *      slug A from overwriting state after the user has navigated to
 *      slug B.
 *
 *   2. FIRE-AND-FORGET NESTED FETCH
 *      Inside the success handler, we kick off the related-posts call
 *      WITHOUT awaiting it and WITHOUT blocking the main post render:
 *
 *        blogApi.posts.getByCategory(...)
 *          .then(posts => { if (cancelled) return; setRelated(...) })
 *          .catch(() => {});   // swallow errors — sidebar just stays empty
 *
 *      The main post renders immediately; the sidebar populates when
 *      (and if) related loads. If it fails, the UI degrades silently.
 *
 *   3. TYPESCRIPT ERROR SHAPE ANNOTATION
 *      .catch((err: { response?: { status?: number } }) => { ... })
 *
 *      This is NOT destructuring — it's a TypeScript TYPE ANNOTATION
 *      on the parameter. The shape says "err has an optional `response`
 *      field, which has an optional `status` field." This matches
 *      axios's error shape: HTTP errors have err.response.status (404,
 *      500, etc.), but network errors (offline, DNS fail) don't.
 *
 *      Java analogue: declaring a parameter as a specific type
 *      (ErrorResponse err) vs a general Object. We're giving the
 *      compiler structure info so downstream field accesses are typed.
 *
 *   4. OPTIONAL CHAINING (?.)
 *      err?.response?.status === 404
 *
 *      The ?. operator short-circuits to `undefined` if any link in the
 *      chain is null or undefined, instead of throwing a TypeError.
 *      Here we distinguish "server said 404" from all other failures.
 *
 *      Java analogue: Optional.ofNullable(err).map(e -> e.response)
 *      .map(r -> r.status).orElse(null) — just one line.
 *
 *   5. DERIVED DATA AFTER EARLY RETURNS
 *      const images = post.images ?? [];
 *      const heroImage = images.find((img) => img.isPrimary) ?? images[0];
 *
 *      Computed from state on every render. We don't store these in
 *      useState — that would be a derived-state anti-pattern. If it can
 *      be computed from existing state, compute it; don't duplicate it.
 *
 *   6. NULL-COALESCING (??) vs OR (||)
 *      post.images ?? []   // falls back ONLY on null/undefined
 *      post.images || []   // falls back on ANY falsy value (0, "", false too)
 *
 *      We want ?? almost always when the field is "object or missing."
 *      Using || here would be fine (arrays are always truthy), but ??
 *      is the safer habit for fields that could legitimately be 0 or "".
 *
 * ============================================================================
 */
