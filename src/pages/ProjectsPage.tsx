import { useState, useEffect, useCallback } from 'react';
import { usePageTitle } from '@/hooks';
import { projectApi } from '@/api/projects';
import { ProjectCard, LoadingSpinner, ErrorDisplay } from '@/components/ui';
import type { ProjectResponse, TechnologyResponse, TechnologyCategory } from '@/types';

/** Filter categories shown in the filter bar, mapped to TechnologyCategory values. */
const CATEGORY_FILTERS: { label: string; value: TechnologyCategory | null }[] = [
  { label: 'All Projects', value: null },
  { label: 'Languages',    value: 'LANGUAGE' },
  { label: 'Frameworks',   value: 'FRAMEWORK' },
  { label: 'Databases',    value: 'DATABASE' },
  { label: 'DevOps',       value: 'DEPLOYMENT' },
  { label: 'Cloud',        value: 'CLOUD' },
];

const PAGE_SIZE = 6;

export function ProjectsPage() {
  usePageTitle('Projects');

  // ---- Data state ----
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(0);

  // ---- Filter state (client-side on loaded data) ----
  const [activeCategory, setActiveCategory] = useState<TechnologyCategory | null>(null);

  // ---- Fetch a page of published projects ----
  const fetchPage = useCallback((pageNum: number, append: boolean) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    setError(null);

    projectApi
      .getPaginated({ page: pageNum, size: PAGE_SIZE, sort: 'displayOrder,asc', published: true })
      .then((data) => {
        setProjects((prev) => (append ? [...prev, ...data.content] : data.content));
        setHasMore(data.page.number < data.page.totalPages - 1);
        setPage(pageNum);
      })
      .catch(() => setError('Failed to load projects.'))
      .finally(() => {
        setLoading(false);
        setLoadingMore(false);
      });
  }, []);

  // ---- Initial fetch ----
  useEffect(() => {
    fetchPage(0, false);
  }, [fetchPage]);

  // ---- Derived: client-side category filter on loaded projects ----
  const displayed: ProjectResponse[] = activeCategory
    ? projects.filter((p: ProjectResponse): boolean =>
        (p.technologies ?? []).some((t: TechnologyResponse): boolean => t.category === activeCategory),
      )
    : projects;

  return (
    <main className="pt-16 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      {/* ==============================================================
          HERO HEADER
          ============================================================== */}
      <header className="mb-16 md:ml-[15%]">
        <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tighter text-on-surface mb-4">
          Projects<span className="text-primary">.</span>
        </h1>
        <p className="font-body text-on-surface-variant text-lg max-w-2xl leading-relaxed">
          Real-world projects spanning backend systems, cloud infrastructure,
          and full-stack applications — built with intention and technical depth.
        </p>
      </header>

      {/* ==============================================================
          FILTER BAR
          ============================================================== */}
      <section className="mb-12 flex flex-wrap items-center gap-3">
        <span className="font-label text-xs uppercase tracking-widest text-outline mr-2">
          Category:
        </span>
        {CATEGORY_FILTERS.map((cat) => {
          const isActive = activeCategory === cat.value;
          return (
            <button
              key={cat.label}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-5 py-2 rounded-full font-label text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-variant text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </section>

      {/* ==============================================================
          PROJECT GRID
          ============================================================== */}
      {loading && <LoadingSpinner message="Loading projects..." />}
      {error && <ErrorDisplay message={error} onRetry={() => fetchPage(0, false)} />}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {displayed.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {/* Empty state */}
          {displayed.length === 0 && (
            <p className="text-on-surface-variant text-center py-16 text-lg">
              No projects found in this category.
            </p>
          )}

          {/* ==============================================================
              LOAD MORE
              ============================================================== */}
          {hasMore && (
            <div className="mt-24 flex flex-col items-center gap-6">
              <div className="w-24 h-[1px] bg-outline-variant/30" />
              <button
                onClick={() => fetchPage(page + 1, true)}
                disabled={loadingMore}
                className="group px-12 py-4 rounded-md border border-outline-variant/30 hover:border-primary/50 text-on-surface font-headline font-bold tracking-widest uppercase transition-all duration-300 hover:bg-surface-container-highest flex items-center gap-4 disabled:opacity-50"
              >
                {loadingMore ? 'Loading...' : 'Load More Projects'}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:translate-y-1 transition-transform"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
