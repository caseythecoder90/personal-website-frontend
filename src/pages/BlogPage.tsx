import { useState, useEffect, useCallback } from 'react';
import { usePageTitle } from '@/hooks';
import { blogApi } from '@/api/blog';
import { BlogPostCard, LoadingSpinner, ErrorDisplay } from '@/components/ui';
import type { BlogPostResponse } from '@/types';

const PAGE_SIZE = 5;

export function BlogPage() {
  usePageTitle('Blog');

  // ---- Data state ----
  const [posts, setPosts] = useState<BlogPostResponse[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---- Fetch a page of published posts ----
  const fetchPage = useCallback((pageNum: number) => {
    setLoading(true);
    setError(null);

    blogApi.posts
      .getPublishedPaginated({ page: pageNum, size: PAGE_SIZE, sort: 'publishedAt,desc' })
      .then((data) => {
        setPosts(data.content);
        setPage(data.page.number);
        setTotalPages(data.page.totalPages);
      })
      .catch(() => setError('Failed to load blog posts.'))
      .finally(() => setLoading(false));
  }, []);

  // ---- Initial fetch ----
  useEffect(() => {
    fetchPage(0);
  }, [fetchPage]);

  // ---- Change page and scroll to top of list ----
  const handlePageChange = (next: number) => {
    fetchPage(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="pt-16 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      {/* ==============================================================
          HERO HEADER
          ============================================================== */}
      <header className="mb-16 md:ml-[10%]">
        <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tighter text-on-surface mb-4">
          Blog<span className="text-primary">.</span>
        </h1>
        <p className="font-body text-on-surface-variant text-lg max-w-2xl leading-relaxed">
          Notes, walkthroughs, and engineering decisions from the projects I ship.
        </p>
      </header>

      {/* ==============================================================
          POST LIST
          ============================================================== */}
      {loading && <LoadingSpinner message="Loading posts..." />}
      {error && <ErrorDisplay message={error} onRetry={() => fetchPage(0)} />}
      {!loading && !error && (
        <>
          {posts.length === 0 ? (
            <p className="text-on-surface-variant text-center py-16 text-lg">
              No posts published yet.
            </p>
          ) : (
            <div className="flex flex-col gap-6">
              {posts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {/* ==============================================================
              PAGINATION
              ============================================================== */}
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </main>
  );
}

// ============================================================================
// Pagination — inline for now. Extract to components/ui if reused elsewhere.
// ============================================================================

interface PaginationProps {
  currentPage: number;     // zero-indexed (matches backend)
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i);
  const prevDisabled = currentPage === 0;
  const nextDisabled = currentPage >= totalPages - 1;

  const baseBtn =
    'min-w-[40px] h-10 px-3 rounded-md font-label text-sm font-semibold transition-all flex items-center justify-center';
  const inactive =
    'bg-surface-variant text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest';
  const active = 'bg-primary text-on-primary';
  const disabled = 'opacity-40 cursor-not-allowed';

  return (
    <nav
      aria-label="Blog pagination"
      className="mt-16 flex items-center justify-center gap-2 flex-wrap"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={prevDisabled}
        className={`${baseBtn} ${inactive} ${prevDisabled ? disabled : ''}`}
        aria-label="Previous page"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          aria-current={p === currentPage ? 'page' : undefined}
          className={`${baseBtn} ${p === currentPage ? active : inactive}`}
        >
          {p + 1}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={nextDisabled}
        className={`${baseBtn} ${inactive} ${nextDisabled ? disabled : ''}`}
        aria-label="Next page"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </nav>
  );
}
