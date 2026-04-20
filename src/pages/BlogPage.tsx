import { useState, useEffect } from 'react';
import { usePageTitle } from '@/hooks';
import { blogApi } from '@/api/blog';
import {
  BlogPostCard,
  LoadingSpinner,
  ErrorDisplay,
  Pagination,
  CategoryTab,
  TagChip,
  SearchInput,
} from '@/components/ui';
import type {
  BlogPostResponse,
  BlogCategoryResponse,
  BlogTagResponse,
} from '@/types';

const PAGE_SIZE: number = 5;
const SEARCH_DEBOUNCE_MS: number = 300;

// Normalized shape we pass to the page regardless of which endpoint was hit.
// List endpoints (search/category/tag) return no pagination info, so
// totalPages/pageNumber are 0 — the page hides the pager in those modes.
interface BlogFetchResult {
  content: BlogPostResponse[];
  totalPages: number;
  pageNumber: number;
}

interface BlogFetchParams {
  search: string;
  category: string | null;
  tag: string | null;
  page: number;
}

function wrapList(list: BlogPostResponse[]): BlogFetchResult {
  return { content: list, totalPages: 0, pageNumber: 0 };
}

/**
 * Picks the right blog endpoint based on active filter state.
 * Priority: search > category > tag > paginated (default). Mutual exclusion
 * is enforced by the page's click handlers, so at most one is non-empty.
 */
async function fetchBlogPosts({
  search,
  category,
  tag,
  page,
}: BlogFetchParams): Promise<BlogFetchResult> {
  if (search) {
    return wrapList(await blogApi.posts.search(search));
  }
  if (category) {
    return wrapList(await blogApi.posts.getByCategory(category));
  }
  if (tag) {
    return wrapList(await blogApi.posts.getByTag(tag));
  }
  const pageData = await blogApi.posts.getPublishedPaginated({
    page,
    size: PAGE_SIZE,
    sort: 'publishedAt,desc',
  });
  return {
    content: pageData.content,
    totalPages: pageData.page.totalPages,
    pageNumber: pageData.page.number,
  };
}

export function BlogPage() {
  usePageTitle('Blog');

  // ---- Filter state ----
  // At most one of category/tag/search is "active" at a time (one-filter rule).
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  // ---- Search state ----
  // `searchInput` updates on every keystroke (live UI).
  // `debouncedSearch` lags behind by SEARCH_DEBOUNCE_MS and is what the fetch
  // effect reads — so we don't hit the API on every keystroke.
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // ---- Data state ----
  const [posts, setPosts] = useState<BlogPostResponse[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Nonce bumped by the retry button — the fetch effect depends on it, so
  // changing it re-runs the effect even when no filter/page state changed.
  const [retryNonce, setRetryNonce] = useState(0);

  // ---- Filter-bar data (categories + popular tags) ----
  const [categories, setCategories] = useState<BlogCategoryResponse[]>([]);
  const [popularTags, setPopularTags] = useState<BlogTagResponse[]>([]);

  // ---- Debounce searchInput → debouncedSearch ----
  // Every keystroke schedules a setter 300ms out. The cleanup cancels the
  // pending timer before it can fire, so only the LAST keystroke in a burst
  // actually updates debouncedSearch (which is what the fetch depends on).
  useEffect(() => {
    const timerId = setTimeout(
      () => setDebouncedSearch(searchInput.trim()),
      SEARCH_DEBOUNCE_MS,
    );
    return () => clearTimeout(timerId);
  }, [searchInput]);

  // Load categories + popular tags once on mount. Parallel via Promise.all.
  // Non-blocking: if they fail, the filter bar just hides — posts still load.
  useEffect(() => {
    Promise.all([blogApi.categories.getAll(), blogApi.tags.getPopular()])
      .then(([cats, tags]) => {
        setCategories(cats);
        setPopularTags(tags);
      })
      .catch(() => {
        /* filter bar stays empty */
      });
  }, []);

  // ---- Main post fetch: re-runs when filters or page change ----
  // The `cancelled` flag is our stale-response guard. If this effect re-runs
  // before the in-flight request resolves (e.g. user clicks filter B while
  // filter A's request is still loading), the cleanup below flips the flag
  // and the stale .then() becomes a no-op.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchBlogPosts({
      search: debouncedSearch,
      category: activeCategory,
      tag: activeTag,
      page,
    })
      .then((result) => {
        if (cancelled) return;
        setPosts(result.content);
        setTotalPages(result.totalPages);
        // Only sync page when paginated (filters and search don't paginate).
        if (!debouncedSearch && !activeCategory && !activeTag) {
          setPage(result.pageNumber);
        }
      })
      .catch(() => {
        if (cancelled) return;
        setError('Failed to load blog posts.');
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    // Cleanup runs before next effect execution, or on unmount.
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, activeCategory, activeTag, page, retryNonce]);

  // ---- Filter click handlers ----
  // Any filter action clears the others to keep the one-filter-at-a-time rule.
  const handleSelectCategory = (slug: string | null) => {
    setActiveCategory(slug);
    setActiveTag(null);
    setSearchInput('');
    setDebouncedSearch('');
    setPage(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTag = (slug: string) => {
    setActiveTag((current) => (current === slug ? null : slug));
    setActiveCategory(null);
    setSearchInput('');
    setDebouncedSearch('');
    setPage(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (next: string) => {
    setSearchInput(next);
    // Clear category/tag the moment the user starts typing. debouncedSearch
    // will update 300ms after they stop, which is what triggers the fetch.
    if (next.length > 0) {
      setActiveCategory(null);
      setActiveTag(null);
      setPage(0);
    }
  };

  const handlePageChange = (next: number) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasActiveFilter =
    activeCategory !== null || activeTag !== null || debouncedSearch.length > 0;

  return (
    <main className="pt-16 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      {/* ==============================================================
          HERO HEADER
          ============================================================== */}
      <header className="mb-12 md:ml-[10%]">
        <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tighter text-on-surface mb-4">
          Blog<span className="text-primary">.</span>
        </h1>
        <p className="font-body text-on-surface-variant text-lg max-w-2xl leading-relaxed">
          Notes, walkthroughs, and engineering decisions from the projects I ship.
        </p>
      </header>

      {/* ==============================================================
          FILTER BAR — search + categories (primary) + popular tags (secondary)
          ============================================================== */}
      <section className="mb-12 space-y-6">
        {/* Search input */}
        <SearchInput
          value={searchInput}
          onChange={handleSearchChange}
          placeholder="Search posts by title, content, or excerpt..."
          ariaLabel="Search blog posts"
        />

        {(categories.length > 0 || popularTags.length > 0) && (
          <>
          {/* Category tabs */}
          {categories.length > 0 && (
            <div className="flex flex-wrap items-center gap-3">
              <CategoryTab
                label="All Topics"
                isActive={activeCategory === null && activeTag === null}
                onClick={() => handleSelectCategory(null)}
              />
              {categories.map((cat) => (
                <CategoryTab
                  key={cat.id}
                  label={cat.name}
                  isActive={activeCategory === cat.slug}
                  onClick={() => handleSelectCategory(cat.slug)}
                />
              ))}
            </div>
          )}

          {/* Popular tag chips */}
          {popularTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-label text-[10px] uppercase tracking-widest text-outline mr-2">
                Quick filter:
              </span>
              {popularTags.map((tag) => (
                <TagChip
                  key={tag.id}
                  label={tag.name}
                  isActive={activeTag === tag.slug}
                  onClick={() => handleSelectTag(tag.slug)}
                />
              ))}
            </div>
          )}
          </>
        )}
      </section>

      {/* ==============================================================
          POST LIST
          ============================================================== */}
      {loading && <LoadingSpinner message="Loading posts..." />}
      {error && <ErrorDisplay message={error} onRetry={() => setRetryNonce((n) => n + 1)} />}
      {!loading && !error && (
        <>
          {posts.length === 0 ? (
            <p className="text-on-surface-variant text-center py-16 text-lg">
              {debouncedSearch
                ? `No posts match "${debouncedSearch}".`
                : hasActiveFilter
                ? 'No posts match this filter.'
                : 'No posts published yet.'}
            </p>
          ) : (
            <div className="flex flex-col gap-6">
              {posts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {/* Pagination only when we're in unfiltered mode */}
          {!hasActiveFilter && totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              ariaLabel="Blog pagination"
            />
          )}
        </>
      )}
    </main>
  );
}

/*
 * ============================================================================
 * PAGE: BlogPage
 * ============================================================================
 *
 * PURPOSE:
 *   Blog listing at /blog. Shows paginated posts with three mutually
 *   exclusive filter modes: keyword search, category tab, or tag chip.
 *   One-filter-at-a-time is enforced by the click handlers — selecting one
 *   clears the others.
 *
 * STATE OVERVIEW:
 *   Filter state:     activeCategory, activeTag, searchInput, debouncedSearch
 *   Pagination:       page, totalPages
 *   Data:             posts
 *   Async lifecycle:  loading, error, retryNonce
 *   Filter-bar data:  categories, popularTags
 *
 * REACT PATTERNS:
 *
 *   1. DEBOUNCED SEARCH
 *      Two state vars: searchInput (live, drives the UI) and debouncedSearch
 *      (lagged by 300ms, drives the fetch). The debounce useEffect schedules
 *      a setTimeout on every keystroke and clears it on the next — so only
 *      the LAST keystroke in a burst actually fires the API call.
 *
 *      Java analogue: like a ScheduledExecutorService where each typing
 *      event cancels the previous pending task.
 *
 *   2. STALE-RESPONSE GUARD (the `cancelled` flag)
 *      useEffect's cleanup function runs in three situations:
 *        - Before the effect re-runs (a dep in the deps array changed)
 *        - When the component unmounts
 *        - In React.StrictMode dev-only: mount → cleanup → remount
 *
 *      Each effect invocation creates its own `cancelled` variable (a
 *      closure, scoped to that invocation). The fetch handlers capture a
 *      reference to THAT specific variable. If the user clicks filter B
 *      while filter A's request is still in-flight:
 *        1. Cleanup fires, flips the OLD invocation's cancelled = true
 *        2. New effect runs, creates a fresh cancelled = false
 *        3. Old fetch eventually resolves → handler sees cancelled = true
 *           → bails out silently (no stale state write)
 *        4. New fetch resolves → handler sees cancelled = false → updates
 *
 *      Without this, a slow request for filter A could overwrite state
 *      that a fast request for filter B already set.
 *
 *      Java analogue: like giving each worker thread its own volatile
 *      boolean and telling the old one "your results don't matter anymore."
 *
 *   3. RETRY VIA NONCE BUMP
 *      retryNonce is a counter the retry button increments. Because it's
 *      in the effect's deps array, bumping it re-runs the effect. This
 *      lets us retry WITHOUT touching filter/page state — so the retry
 *      preserves exactly what the user was viewing.
 *
 *   4. PARALLEL FETCH ON MOUNT (Promise.all)
 *      Categories and popular tags are independent API calls, so we fire
 *      both in parallel with Promise.all and destructure the array result:
 *
 *        const [cats, tags] = await Promise.all([...])
 *
 *      Java analogue: like CompletableFuture.allOf(f1, f2).thenApply(...).
 *      The .catch(() => {}) is intentional — if the filter bar fails to
 *      load, the page still shows posts, it just hides the filters.
 *
 *   5. CONDITIONAL RENDERING
 *        {loading && <LoadingSpinner />}       // render only when truthy
 *        {error && <ErrorDisplay ... />}
 *        {condition ? <A /> : <B />}           // ternary for either/or
 *
 *      Short-circuit evaluation: the left side is falsy → nothing renders.
 *      Same behavior as Java's `cond && callSomething()` — just used for
 *      rendering instead of side effects.
 *
 *   6. FUNCTIONAL UPDATER FORM
 *        setRetryNonce((n) => n + 1)
 *        setActiveTag((current) => (current === slug ? null : slug))
 *
 *      When the new state depends on the previous state, pass a function
 *      instead of a value. React guarantees you see the latest state even
 *      if multiple updates are batched. Passing `retryNonce + 1` can read
 *      stale state in rare cases.
 *
 * ============================================================================
 */

