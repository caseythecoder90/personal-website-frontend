interface PaginationProps {
  /** Current page index — zero-indexed to match the backend Spring Page response. */
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Accessible label for the <nav>. Defaults to "Pagination". */
  ariaLabel?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  ariaLabel = 'Pagination',
}: PaginationProps) {
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
      aria-label={ariaLabel}
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
