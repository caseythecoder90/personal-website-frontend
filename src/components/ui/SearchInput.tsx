interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  ariaLabel?: string;
}

/**
 * Text input styled for the Casey Quinn. design system: input-well background,
 * ghost border, focus ring in primary. Shows a clear button when non-empty.
 * The consumer is expected to debounce the onChange value before firing API calls.
 */
export function SearchInput({
  value,
  onChange,
  onClear,
  placeholder = 'Search...',
  ariaLabel = 'Search',
}: SearchInputProps) {
  const handleClear = () => {
    onChange('');
    onClear?.();
  };

  return (
    <div className="relative w-full max-w-xl">
      {/* Search icon */}
      <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-on-surface-variant">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="w-full pl-12 pr-10 py-3 bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/60 rounded-md font-body text-base outline-none ring-1 ring-outline-variant/20 focus:ring-2 focus:ring-primary transition-all"
      />

      {/* Clear button (shown when there's input) */}
      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute inset-y-0 right-3 flex items-center text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}
