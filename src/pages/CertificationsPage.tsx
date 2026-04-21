import { useState, useEffect } from 'react';
import { usePageTitle } from '@/hooks';
import { certificationApi } from '@/api/certifications';
import { CertificationCard, LoadingSpinner, ErrorDisplay } from '@/components/ui';
import type { CertificationResponse, CertificationStatus } from '@/types';

/** Filter buttons shown above the grid. `null` means "All". */
const STATUS_FILTERS: { label: string; value: CertificationStatus | null }[] = [
  { label: 'All',         value: null },
  { label: 'Earned',      value: 'EARNED' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Expired',     value: 'EXPIRED' },
];

/**
 * Sort order for the grid:
 *   1. Featured certs first (the design shows a big hero card up top)
 *   2. Then by displayOrder ascending (curated ordering from admin)
 *   3. Finally by issueDate descending (most recent first) as a tiebreaker
 */
function sortForDisplay(list: CertificationResponse[]): CertificationResponse[] {
  return [...list].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    if (a.displayOrder !== b.displayOrder) return a.displayOrder - b.displayOrder;
    const aDate = a.issueDate ?? '';
    const bDate = b.issueDate ?? '';
    return bDate.localeCompare(aDate);
  });
}

export function CertificationsPage() {
  usePageTitle('Certifications');

  const [certifications, setCertifications] = useState<CertificationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryNonce, setRetryNonce] = useState(0);

  const [activeStatus, setActiveStatus] = useState<CertificationStatus | null>(null);

  // Fetch all published certs once. Status filtering happens client-side so
  // clicking between tabs is instant and doesn't re-hit the API.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    certificationApi
      .getPublished()
      .then((data) => {
        if (cancelled) return;
        setCertifications(sortForDisplay(data));
      })
      .catch(() => {
        if (cancelled) return;
        setError('Failed to load certifications.');
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [retryNonce]);

  const displayed = activeStatus
    ? certifications.filter((c) => c.status === activeStatus)
    : certifications;

  // Only the first featured cert in the CURRENT view renders as the big hero
  // card. When the user filters to "In Progress", the featured hero may not
  // appear — that's intended: it's a visual hierarchy tied to the list, not
  // a permanent attribute of a specific cert.
  const featuredId = displayed.find((c) => c.featured)?.id ?? null;

  return (
    <main className="pt-16 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      {/* ==============================================================
          HERO HEADER
          ============================================================== */}
      <header className="mb-12 md:ml-[10%]">
        <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tighter text-on-surface mb-4">
          Certifications<span className="text-primary">.</span>
        </h1>
        <p className="font-body text-on-surface-variant text-lg max-w-2xl leading-relaxed">
          Validating technical expertise and continuous learning.
        </p>
      </header>

      {/* ==============================================================
          STATUS FILTER
          ============================================================== */}
      <section className="mb-12 flex flex-wrap items-center gap-3">
        <span className="font-label text-xs uppercase tracking-widest text-outline mr-2">
          Status:
        </span>
        {STATUS_FILTERS.map((filter) => {
          const isActive = activeStatus === filter.value;
          return (
            <button
              key={filter.label}
              onClick={() => setActiveStatus(filter.value)}
              className={`px-6 py-2 rounded-full font-label text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-variant text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </section>

      {/* ==============================================================
          CERT GRID
          ============================================================== */}
      {loading && <LoadingSpinner message="Loading certifications..." />}
      {error && <ErrorDisplay message={error} onRetry={() => setRetryNonce((n) => n + 1)} />}
      {!loading && !error && (
        <>
          {displayed.length === 0 ? (
            <p className="text-on-surface-variant text-center py-16 text-lg">
              {activeStatus
                ? 'No certifications match this filter.'
                : 'No certifications published yet.'}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayed.map((cert) => (
                <CertificationCard
                  key={cert.id}
                  certification={cert}
                  featured={cert.id === featuredId}
                />
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}

/*
 * ============================================================================
 * PAGE: CertificationsPage
 * ============================================================================
 *
 * PURPOSE:
 *   Certifications showcase at /certifications. Displays published certs in
 *   a responsive grid with status filtering (All / Earned / In Progress).
 *   The first featured cert in the current view spans 2 columns and gets
 *   the "hero card" treatment.
 *
 * DATA STRATEGY:
 *   Fetch GET /certifications/published once on mount, then filter client-
 *   side. This keeps tab switching instant and avoids spamming the API.
 *
 * REACT PATTERNS:
 *
 *   1. CLIENT-SIDE FILTER
 *      `displayed` is derived from `certifications` + `activeStatus` on each
 *      render. No separate state for filtered data — it's a pure function
 *      of the source list and the active filter. This avoids the classic
 *      "two states out of sync" bug.
 *
 *      Java analogue: like calling list.stream().filter(...).toList()
 *      every time you need the filtered view, rather than caching it.
 *
 *   2. STALE-RESPONSE GUARD (`cancelled` flag)
 *      If the retry button is mashed, or the component unmounts before the
 *      fetch resolves, the cleanup flips `cancelled = true` and the
 *      handlers bail out — preventing a "setting state on an unmounted
 *      component" warning and out-of-order state writes.
 *
 *   3. RETRY VIA NONCE BUMP
 *      `retryNonce` is a counter the retry button increments. Because it's
 *      in the effect's deps array, bumping it re-runs the effect. Retrying
 *      doesn't touch filter state, so the user's tab selection survives.
 *
 *   4. SORT STABILITY
 *      `sortForDisplay` uses [...list].sort(...) — the spread creates a
 *      fresh array so we don't mutate the original. Array.prototype.sort is
 *      in-place; without the copy we'd be mutating state directly, which
 *      React wouldn't notice (same reference = no re-render triggered).
 *
 *   5. DYNAMIC FEATURED SELECTION
 *      `featuredId` is picked from the CURRENT `displayed` list, not the
 *      full `certifications`. So if the user filters to "In Progress" and
 *      none of those are marked featured, the grid renders all regular
 *      cards — no awkward empty hero slot.
 *
 * ============================================================================
 */
