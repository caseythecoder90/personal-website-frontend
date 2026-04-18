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

const PAGE_SIZE = 5;
const SEARCH_DEBOUNCE_MS = 300;

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
function fetchBlogPosts({
  search,
  category,
  tag,
  page,
}: BlogFetchParams): Promise<BlogFetchResult> {
  if (search) {
    return blogApi.posts.search(search).then(wrapList);
  }
  if (category) {
    return blogApi.posts.getByCategory(category).then(wrapList);
  }
  if (tag) {
    return blogApi.posts.getByTag(tag).then(wrapList);
  }
  return blogApi.posts
    .getPublishedPaginated({ page, size: PAGE_SIZE, sort: 'publishedAt,desc' })
    .then((pageData) => ({
      content: pageData.content,
      totalPages: pageData.page.totalPages,
      pageNumber: pageData.page.number,
    }));
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

