import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useScrollToTop } from '@/hooks';

export function Layout() {
  useScrollToTop();

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

/*
 * ============================================================================
 * COMPONENT: Layout
 * ============================================================================
 *
 * PURPOSE:
 *   Wraps every page with a consistent structure: Navbar on top, page content
 *   in the middle, Footer on the bottom. This is the "shell" of the app.
 *
 * PROPS:
 *   None — Layout no longer accepts children directly. Instead, React Router's
 *   <Outlet /> renders the matched child route automatically.
 *
 *   PREVIOUSLY (Issue #1): Layout accepted `children: ReactNode` and you
 *   wrapped pages manually: <Layout><HomePage /></Layout>
 *   NOW (Issue #4): Layout is a "layout route" — React Router renders the
 *   matched child route into <Outlet /> automatically.
 *
 * HTML STRUCTURE:
 *   <div>              ← outer wrapper (the full page container)
 *     <Navbar />       ← fixed to viewport top (rendered by Navbar component)
 *     <main>           ← semantic HTML tag for primary content area
 *       <Outlet />     ← React Router renders the matched child route here
 *     </main>
 *     <Footer />       ← sits at the bottom
 *   </div>
 *
 * TAILWIND BREAKDOWN:
 *
 *   Outer <div>: "flex min-h-screen flex-col bg-surface"
 *   ┌──────────────┬──────────────────────────┬─────────────────────────────────┐
 *   │ Tailwind      │ CSS                      │ What it does                    │
 *   ├──────────────┼──────────────────────────┼─────────────────────────────────┤
 *   │ flex          │ display: flex            │ Makes this a flex container —   │
 *   │               │                          │ children (Navbar, main, Footer) │
 *   │               │                          │ become flex items               │
 *   │ flex-col      │ flex-direction: column   │ Stack children vertically       │
 *   │               │                          │ (top to bottom) instead of the  │
 *   │               │                          │ default horizontal row          │
 *   │ min-h-screen  │ min-height: 100vh        │ Container is at LEAST the full  │
 *   │               │                          │ viewport height. If content is  │
 *   │               │                          │ short, the page still fills the │
 *   │               │                          │ screen (no floating footer)     │
 *   │ bg-surface    │ background-color:        │ Page background = #0e0e0e       │
 *   │               │ #0e0e0e                  │ (near-black from design system) │
 *   └──────────────┴──────────────────────────┴─────────────────────────────────┘
 *
 *   <main>: "flex-1 pt-16"
 *   ┌──────────────┬──────────────────────────┬─────────────────────────────────┐
 *   │ Tailwind      │ CSS                      │ What it does                    │
 *   ├──────────────┼──────────────────────────┼─────────────────────────────────┤
 *   │ flex-1        │ flex: 1 1 0%             │ Grow to fill ALL remaining      │
 *   │               │                          │ vertical space between Navbar   │
 *   │               │                          │ and Footer. This is what pushes │
 *   │               │                          │ the Footer to the bottom even   │
 *   │               │                          │ when content is short.          │
 *   │ pt-16         │ padding-top: 64px        │ Adds 64px of space at the top   │
 *   │               │                          │ so content doesn't hide behind  │
 *   │               │                          │ the fixed Navbar (which is      │
 *   │               │                          │ removed from normal flow and    │
 *   │               │                          │ overlaps content without this)  │
 *   └──────────────┴──────────────────────────┴─────────────────────────────────┘
 *
 * WHY flex + flex-col + min-h-screen + flex-1?
 *   This is the standard "sticky footer" pattern in CSS:
 *   - The outer div is a vertical flex container that's at least screen height
 *   - Navbar and Footer have fixed heights (they don't grow)
 *   - <main> has flex-1, so it expands to absorb all leftover space
 *   - Result: Footer is always at the bottom, whether content is short or long
 *
 * REACT ROUTER CONCEPTS (added in Issue #4):
 *
 *   <Outlet />
 *     - React Router's placeholder component — it renders whatever child
 *       route matches the current URL.
 *     - Java analogy: like a Thymeleaf layout template with th:fragment —
 *       the layout defines the shell (header, footer), and each page fills
 *       the content area.
 *     - In App.tsx, Layout is set up as a parent route with child routes
 *       nested inside it. React Router renders those children at <Outlet />.
 *
 *   useScrollToTop()
 *     - Custom hook that scrolls to the top of the page on every route change.
 *     - Without this, navigating from a long page would keep the scroll
 *       position — you'd land in the middle of the new page.
 *     - It uses useLocation() to detect route changes and useEffect() to
 *       trigger the scroll.
 *
 * ============================================================================
 */
