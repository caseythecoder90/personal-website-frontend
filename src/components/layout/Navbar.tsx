import { useState } from 'react';

const navLinks = [
  { label: 'Home', href: '#' },
  { label: 'Projects', href: '#' },
  { label: 'Blog', href: '#' },
  { label: 'Certifications', href: '#' },
  { label: 'Contact', href: '#' },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-low/70 backdrop-blur-[16px] border-b border-outline-variant/15">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <a href="#" className="font-headline text-xl font-bold tracking-tight text-on-surface">
          Casey Quinn.
        </a>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-headline text-sm tracking-wide text-on-surface-variant transition-colors hover:text-on-surface"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <a
            href="#"
            className="hidden rounded-md bg-gradient-to-br from-primary to-primary-dim px-5 py-2 font-headline text-sm font-bold tracking-wide text-on-primary shadow-[0_0_15px_rgba(163,166,255,0.3)] transition-transform hover:brightness-110 active:scale-95 sm:inline-block"
          >
            Resume
          </a>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-md text-on-surface-variant transition-colors hover:text-on-surface md:hidden"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {mobileMenuOpen ? (
                <>
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="6" y1="18" x2="18" y2="6" />
                </>
              ) : (
                <>
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu panel */}
      {mobileMenuOpen && (
        <div className="border-t border-outline-variant/15 bg-surface-container-low/95 backdrop-blur-[16px] md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md px-4 py-3 font-headline text-sm tracking-wide text-on-surface-variant transition-colors hover:bg-surface-container-highest hover:text-on-surface"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#"
              className="mt-2 rounded-md bg-gradient-to-br from-primary to-primary-dim px-4 py-3 text-center font-headline text-sm font-bold tracking-wide text-on-primary sm:hidden"
            >
              Resume
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
