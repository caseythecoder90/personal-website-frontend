import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

/*
 * ============================================================================
 * APPLICATION ENTRY POINT (Updated with React Router)
 * ============================================================================
 *
 * WHAT CHANGED:
 *   Added <BrowserRouter> wrapper around <App />.
 *
 * WHY BrowserRouter IS HERE (not in App.tsx):
 *   BrowserRouter must wrap everything that uses React Router — including
 *   the Navbar (which uses <NavLink>). Since Layout is rendered inside
 *   <Routes> in App.tsx, and <Routes> requires a router parent, we wrap
 *   at the top level here in main.tsx.
 *
 *   Java analogy: BrowserRouter is like the DispatcherServlet in Spring MVC.
 *   It intercepts all navigation and routes it to the correct component
 *   instead of letting the browser make a full HTTP request.
 *
 * HOW CLIENT-SIDE ROUTING WORKS:
 *   1. User clicks a <Link to="/projects">
 *   2. BrowserRouter intercepts the click (prevents default browser navigation)
 *   3. Updates the browser URL bar using the History API
 *   4. React Router matches "/projects" to <ProjectsPage />
 *   5. React re-renders only the <Outlet /> content — Navbar/Footer stay
 *   6. NO HTTP request is made — it's all JavaScript in the browser
 *
 *   This is why it's called a "Single Page Application" (SPA) — there's
 *   only one HTML page (index.html), and JavaScript swaps the content.
 *
 * ============================================================================
 */
