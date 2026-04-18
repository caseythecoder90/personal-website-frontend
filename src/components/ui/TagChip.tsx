interface TagChipProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

/**
 * Secondary filter chip — smaller, uppercase, used for quick-filter tag rows.
 * Active state uses the tertiary (pink) accent for micro-moment emphasis.
 */
export function TagChip({ label, isActive, onClick }: TagChipProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full font-label text-[10px] uppercase tracking-wider font-bold transition-all ${
        isActive
          ? 'bg-tertiary/20 text-tertiary'
          : 'bg-surface-variant text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
      }`}
    >
      {label}
    </button>
  );
}
