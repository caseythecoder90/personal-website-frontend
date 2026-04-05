import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Projects', to: '/projects' },
  { label: 'Blog', to: '/blog' },
  { label: 'Certifications', to: '/certifications' },
  { label: 'Contact', to: '/contact' },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-low/70 backdrop-blur-[16px] border-b border-outline-variant/15">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="font-headline text-xl font-bold tracking-tight text-on-surface">
          Casey Quinn.
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `font-headline text-sm tracking-wide transition-colors ${
                  isActive
                    ? 'text-primary font-bold border-b-2 border-primary pb-1'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`
              }
            >
              {link.label}
            </NavLink>
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
              <NavLink
                key={link.label}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-md px-4 py-3 font-headline text-sm tracking-wide transition-colors ${
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
                  }`
                }
              >
                {link.label}
              </NavLink>
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

/*
 * ============================================================================
 * COMPONENT: Navbar (Updated with React Router)
 * ============================================================================
 *
 * WHAT CHANGED FROM ISSUE #1:
 *   - <a href="#"> replaced with React Router's <NavLink> and <Link>
 *   - navLinks array now has `to` (route path) instead of `href`
 *   - Active link highlighting with purple text + bottom border
 *
 * REACT ROUTER CONCEPTS:
 *
 *   <Link to="/">
 *     - React Router's replacement for <a href="...">
 *     - Navigates WITHOUT a full page reload (client-side routing)
 *     - Java analogy: like a Spring MVC forward vs redirect — Link stays
 *       in the same "application" without hitting the server again
 *
 *   <NavLink to="/projects" className={({ isActive }) => ...}>
 *     - Like <Link> but knows if its route is currently active
 *     - className can be a FUNCTION that receives { isActive } boolean
 *     - This is how we apply the purple text + border to the current page
 *     - Java analogy: like a tab component that knows if it's selected
 *
 *   end={link.to === '/'}
 *     - The `end` prop means "only match this EXACT path"
 *     - Without it, "/" would match "/projects", "/blog", etc. (because
 *       every route starts with "/")
 *     - We only need this on the Home link since "/" is a prefix of all routes
 *
 * ACTIVE LINK STYLING:
 *   Desktop (active):   text-primary font-bold border-b-2 border-primary pb-1
 *   Desktop (inactive): text-on-surface-variant hover:text-on-surface
 *   Mobile (active):    text-primary bg-primary/10
 *   Mobile (inactive):  text-on-surface-variant hover:bg-surface-container-highest
 *
 * ============================================================================
 */
