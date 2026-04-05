import type { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Navbar />
      <main className="flex-1 pt-16">
        {children}
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
 *   children: ReactNode
 *     - The page content to render between the Navbar and Footer.
 *     - In React, `children` is a special prop — it represents whatever JSX
 *       you put BETWEEN the opening and closing tags of a component:
 *         <Layout>
 *           <h1>This is the children</h1>   ← this gets passed as `children`
 *         </Layout>
 *     - `ReactNode` is the TypeScript type that means "anything React can render"
 *       (strings, numbers, JSX elements, arrays of elements, null, etc.)
 *     - Java analogy: like a method parameter of type `Object` — accepts anything.
 *
 * HTML STRUCTURE:
 *   <div>              ← outer wrapper (the full page container)
 *     <Navbar />       ← fixed to viewport top (rendered by Navbar component)
 *     <main>           ← semantic HTML tag for primary content area
 *       {children}     ← the actual page content injected here
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
 * ============================================================================
 */
