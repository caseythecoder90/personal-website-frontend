import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout';

// Code-split each route into its own chunk. Vite emits a separate JS file
// per lazy import, and the chunk only downloads when the user navigates
// to that route. Pages use named exports, so we re-shape the module to
// expose the page as `default` (which is what React.lazy expects).
const HomePage = lazy(() => import('@/pages/HomePage').then((m) => ({ default: m.HomePage })));
const ProjectsPage = lazy(() => import('@/pages/ProjectsPage').then((m) => ({ default: m.ProjectsPage })));
const ProjectDetailPage = lazy(() => import('@/pages/ProjectDetailPage').then((m) => ({ default: m.ProjectDetailPage })));
const BlogPage = lazy(() => import('@/pages/BlogPage').then((m) => ({ default: m.BlogPage })));
const BlogPostPage = lazy(() => import('@/pages/BlogPostPage').then((m) => ({ default: m.BlogPostPage })));
const CertificationsPage = lazy(() => import('@/pages/CertificationsPage').then((m) => ({ default: m.CertificationsPage })));
const ContactPage = lazy(() => import('@/pages/ContactPage').then((m) => ({ default: m.ContactPage })));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:slug" element={<ProjectDetailPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/certifications" element={<CertificationsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;

/*
 * ============================================================================
 * APP ROUTER CONFIGURATION
 * ============================================================================
 *
 * REACT ROUTER CONCEPTS:
 *
 *   <Routes>
 *     - Container for all route definitions. React Router matches the current
 *       URL against these routes and renders the matching one.
 *     - Java analogy: like your Spring @RequestMapping controller methods —
 *       the framework matches the URL to the right handler.
 *
 *   <Route element={<Layout />}>  (no path — layout route)
 *     - A "layout route" with NO path — it always matches. Its children are
 *       nested inside it. The Layout component renders <Outlet /> where the
 *       matched child route appears.
 *     - This means every page gets the Navbar + Footer automatically.
 *
 *   <Route path="/" element={<HomePage />} />
 *     - When the URL is exactly "/", render HomePage.
 *
 *   <Route path="/projects/:slug" element={<ProjectDetailPage />} />
 *     - `:slug` is a URL parameter (like Spring's @PathVariable).
 *     - URL "/projects/my-cool-app" → slug = "my-cool-app"
 *     - The page reads it with the useParams() hook.
 *
 *   <Route path="*" element={<NotFoundPage />} />
 *     - Catch-all route — matches any URL that didn't match above.
 *     - "*" is always least specific, so it acts as the 404 fallback.
 *
 * ROUTE STRUCTURE:
 *   /                    → HomePage
 *   /projects            → ProjectsPage
 *   /projects/:slug      → ProjectDetailPage
 *   /blog                → BlogPage
 *   /blog/:slug          → BlogPostPage
 *   /certifications      → CertificationsPage
 *   /contact             → ContactPage
 *   *                    → NotFoundPage (404)
 *
 * ============================================================================
 */
