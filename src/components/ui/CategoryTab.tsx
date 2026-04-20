interface CategoryTabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

/**
 * Primary filter pill — larger, rounded, used as a tab-like category selector.
 * Active state uses the primary accent. Pair with TagChip for two-tier filter bars.
 */
export function CategoryTab({ label, isActive, onClick }: CategoryTabProps) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-full font-label text-sm font-semibold transition-all ${
        isActive
          ? 'bg-primary text-on-primary'
          : 'bg-surface-variant text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
      }`}
    >
      {label}
    </button>
  );
}
