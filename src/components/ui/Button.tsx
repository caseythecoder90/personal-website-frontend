import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

type ButtonAsButton = ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    href?: never;
  };

type ButtonAsAnchor = ButtonBaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps> & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsAnchor;

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-5 py-2 text-sm',
  md: 'px-8 py-3 text-sm',
  lg: 'px-8 py-4 text-sm',
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    'bg-gradient-to-br from-primary to-primary-dim text-on-primary',
    'rounded-md font-bold tracking-wide',
    'shadow-[0_0_20px_rgba(163,166,255,0.25)]',
    'hover:brightness-110 active:scale-95',
    'transition-all',
  ].join(' '),
  secondary: [
    'border border-outline-variant/30 text-primary',
    'rounded-md font-bold tracking-wide',
    'hover:bg-white/5',
    'transition-all',
  ].join(' '),
  tertiary: [
    'text-primary font-bold tracking-wide',
    'hover:underline underline-offset-4',
    'transition-all',
  ].join(' '),
};

export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', children, ...rest } = props;
  const classes = `inline-flex items-center justify-center gap-2 ${variantClasses[variant]} ${sizeClasses[size]}`;

  if ('href' in rest && rest.href) {
    return (
      <a className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}

/*
 * ============================================================================
 * COMPONENT: Button
 * ============================================================================
 *
 * PURPOSE:
 *   Reusable button component with three visual variants matching the Stitch
 *   design system. Can render as a <button> or <a> tag depending on whether
 *   an `href` prop is provided.
 *
 * PROPS:
 *   variant?: 'primary' | 'secondary' | 'tertiary'  (default: 'primary')
 *   size?: 'sm' | 'md' | 'lg'                        (default: 'md')
 *   children: ReactNode                               — button label/content
 *   href?: string                                     — if provided, renders <a> instead of <button>
 *   ...rest                                           — all native button or anchor attributes
 *
 * TYPESCRIPT PATTERN — Discriminated Union Props:
 *   This component uses a union type (ButtonAsButton | ButtonAsAnchor) so that:
 *   - When `href` is provided, you get <a> tag attributes (target, rel, etc.)
 *   - When `href` is NOT provided, you get <button> tag attributes (onClick, type, disabled, etc.)
 *   Java analogy: like method overloading where the parameter types change the return type.
 *
 * TAILWIND BREAKDOWN:
 *
 *   Primary variant:
 *   ┌─────────────────────────┬──────────────────────────────────┬──────────────────────────────────┐
 *   │ Tailwind                 │ CSS                              │ What it does                     │
 *   ├─────────────────────────┼──────────────────────────────────┼──────────────────────────────────┤
 *   │ bg-gradient-to-br        │ background: linear-gradient      │ Indigo gradient from top-left    │
 *   │ from-primary             │ (to bottom right,                │ (#a3a6ff) to bottom-right        │
 *   │ to-primary-dim           │ #a3a6ff, #6063ee)                │ (#6063ee)                        │
 *   │ text-on-primary          │ color: #0f00a4                   │ Dark blue text on light bg       │
 *   │ rounded-md               │ border-radius: 0.375rem          │ Slightly rounded corners         │
 *   │ font-bold                │ font-weight: 700                 │ Bold text                        │
 *   │ shadow-[...]             │ box-shadow: 0 0 20px             │ Soft indigo glow                 │
 *   │                          │ rgba(163,166,255,0.25)           │                                  │
 *   │ hover:brightness-110     │ :hover { filter:                 │ 10% brighter on hover            │
 *   │                          │ brightness(1.1) }                │                                  │
 *   │ active:scale-95          │ :active { transform:             │ Press-in effect on click         │
 *   │                          │ scale(0.95) }                    │                                  │
 *   └─────────────────────────┴──────────────────────────────────┴──────────────────────────────────┘
 *
 *   Secondary variant:
 *   ┌─────────────────────────┬──────────────────────────────────┬──────────────────────────────────┐
 *   │ border                   │ border-width: 1px                │ Ghost border outline             │
 *   │ border-outline-          │ border-color:                    │ at 30% opacity                   │
 *   │ variant/30               │ rgba(73,72,71, 0.3)              │                                  │
 *   │ text-primary             │ color: #a3a6ff                   │ Indigo text                      │
 *   │ hover:bg-white/5         │ :hover { background:             │ Very subtle white tint on hover  │
 *   │                          │ rgba(255,255,255,0.05) }         │                                  │
 *   └─────────────────────────┴──────────────────────────────────┴──────────────────────────────────┘
 *
 *   Tertiary variant:
 *   ┌─────────────────────────┬──────────────────────────────────┬──────────────────────────────────┐
 *   │ text-primary             │ color: #a3a6ff                   │ Indigo text, no background       │
 *   │ hover:underline          │ :hover { text-decoration:        │ Underline appears on hover       │
 *   │                          │ underline }                      │                                  │
 *   │ underline-offset-4       │ text-underline-offset: 4px       │ Underline sits 4px below text    │
 *   └─────────────────────────┴──────────────────────────────────┴──────────────────────────────────┘
 *
 * ============================================================================
 */
