import type { ReactNode } from 'react';

interface ContactInfoLinkProps {
  href: string;
  label: string;
  value: string;
  icon: ReactNode;
  external?: boolean;
}

export function ContactInfoLink({ href, label, value, icon, external = false }: ContactInfoLinkProps) {
  const externalAttrs = external
    ? { target: '_blank' as const, rel: 'noopener noreferrer' }
    : undefined;

  return (
    <a
      href={href}
      {...externalAttrs}
      className="group flex items-center gap-4 text-on-surface-variant hover:text-primary transition-colors"
    >
      <span
        aria-hidden="true"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-highest text-primary transition-colors group-hover:bg-primary/10"
      >
        {icon}
      </span>
      <span className="flex flex-col">
        <span className="font-label text-[10px] uppercase tracking-widest text-outline">
          {label}
        </span>
        <span className="font-medium tracking-tight">
          {value}
        </span>
      </span>
    </a>
  );
}

/*
 * ============================================================================
 * COMPONENT: ContactInfoLink
 * ============================================================================
 *
 * PURPOSE:
 *   Icon-bubble contact link used on the Contact page. Pairs a circular
 *   icon (email, GitHub, LinkedIn…) with a small uppercase label above the
 *   actual contact value.
 *
 * PROPS:
 *   href: string         — the mailto: / https:// destination
 *   label: string        — small label above the value ("Email", "GitHub")
 *   value: string        — the visible contact text ("you@example.com")
 *   icon: ReactNode      — inline SVG for the icon bubble
 *   external?: boolean   — when true, adds target=_blank + rel=noopener
 *
 * REACT PATTERNS:
 *
 *   Spread with conditional object
 *     const externalAttrs = external ? { target: '_blank' as const, rel: '...' } : undefined;
 *     ... <a {...externalAttrs}>
 *
 *     Spreading `undefined` is a no-op in JSX, so we either add both attrs
 *     or none — keeping the JSX clean vs. three inline ternaries.
 *
 *   `as const` on target
 *     TypeScript narrows '_blank' to the literal type, matching React's
 *     HTMLAnchorElement typing. Without it the inferred type is `string`,
 *     which the spread would reject.
 *
 * ============================================================================
 */
