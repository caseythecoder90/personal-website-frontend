import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePageTitle } from '@/hooks';
import { projectApi } from '@/api/projects';
import { technologyApi } from '@/api/technologies';
import { SectionHeader, ProjectCard, TechnologyShowcase, LoadingSpinner, ErrorDisplay, Button } from '@/components/ui';
import type { ProjectResponse, TechnologyResponse } from '@/types';
import heroImage from '@/assets/hero.png';

export function HomePage() {
  usePageTitle('');

  // ---- State for featured projects ----
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState<string | null>(null);

  // ---- State for featured technologies ----
  const [technologies, setTechnologies] = useState<TechnologyResponse[]>([]);
  const [techLoading, setTechLoading] = useState(true);
  const [techError, setTechError] = useState<string | null>(null);

  // ---- Fetch featured projects on mount ----
  useEffect(() => {
    projectApi
      .getFeatured()
      .then((data) => setProjects(data))
      .catch(() => setProjectsError('Failed to load projects.'))
      .finally(() => setProjectsLoading(false));
  }, []);

  // ---- Fetch featured technologies on mount ----
  useEffect(() => {
    technologyApi
      .getFeatured()
      .then((data) => setTechnologies(data))
      .catch(() => setTechError('Failed to load technologies.'))
      .finally(() => setTechLoading(false));
  }, []);

  // ---- Retry handler for technologies ----
  const retryTechnologies = () => {
    setTechError(null);
    setTechLoading(true);
    technologyApi
      .getFeatured()
      .then((data) => setTechnologies(data))
      .catch(() => setTechError('Failed to load technologies.'))
      .finally(() => setTechLoading(false));
  };

  return (
    <>
      {/* ================================================================
          HERO SECTION
          ================================================================ */}
      <section className="mx-auto max-w-7xl px-6 py-24 md:py-32 grid md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-7 space-y-8 md:ml-[10%]">
          <div className="space-y-4">
            <h2 className="text-primary font-headline font-medium tracking-widest text-sm uppercase">
              Available for work
            </h2>
            <h1 className="text-6xl md:text-7xl font-headline font-bold text-on-surface tracking-tighter leading-[0.9]">
              Casey Quinn
            </h1>
            <p className="text-2xl text-secondary-dim font-headline font-light tracking-tight">
              Full-Stack Software Engineer
            </p>
          </div>
          <p className="text-on-surface-variant text-lg max-w-xl leading-relaxed">
            Architecting high-performance, enterprise-grade applications with
            Java and Spring Boot. Specialized in building scalable distributed
            systems that prioritize security, reliability, and technical excellence.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Button href="/projects" size="lg">View Projects</Button>
            <Button variant="secondary" href="#" size="lg">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download Resume
            </Button>
          </div>
        </div>

        <div className="md:col-span-5 flex justify-center items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
            <div className="relative w-72 h-72 md:w-80 md:h-80 rounded-full p-1 bg-gradient-to-tr from-primary/50 to-transparent">
              <img
                src={heroImage}
                alt="Casey Quinn"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          FEATURED PROJECTS SECTION
          ================================================================ */}
      <section className="bg-surface-container-low py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader
            overline="Selection"
            title="Featured Projects"
            linkText="Archive"
            linkHref="/projects"
          />

          {projectsLoading && <LoadingSpinner message="Loading projects..." />}
          {projectsError && (
            <ErrorDisplay
              message={projectsError}
              onRetry={() => {
                setProjectsError(null);
                setProjectsLoading(true);
                projectApi
                  .getFeatured()
                  .then((data) => setProjects(data))
                  .catch(() => setProjectsError('Failed to load projects.'))
                  .finally(() => setProjectsLoading(false));
              }}
            />
          )}
          {!projectsLoading && !projectsError && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
              {projects.length === 0 && (
                <p className="text-on-surface-variant col-span-full text-center py-8">
                  No featured projects yet.
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ================================================================
          TECHNOLOGY SHOWCASE SECTION
          ================================================================ */}
      <TechnologyShowcase
        technologies={technologies}
        loading={techLoading}
        error={techError}
        onRetry={retryTechnologies}
      />

      {/* ================================================================
          CTA SECTION
          ================================================================ */}
      <section className="bg-surface-container-low py-32">
        <div className="mx-auto max-w-4xl px-6 text-center space-y-8">
          <h2 className="text-5xl md:text-6xl font-headline font-bold text-white tracking-tighter">
            Ready to build the next generation?
          </h2>
          <p className="text-on-surface-variant text-xl">
            Let's talk about your system architecture and how I can help bring precision to your code.
          </p>
          <div className="pt-8">
            <Link
              to="/contact"
              className="inline-block bg-gradient-to-br from-primary to-primary-dim text-on-primary px-12 py-5 rounded-md font-bold tracking-widest uppercase text-sm hover:scale-105 active:scale-95 transition-all shadow-[0_10px_30px_rgba(163,166,255,0.2)]"
            >
              Initialize Connection
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

/*
 * ============================================================================
 * PAGE: HomePage
 * ============================================================================
 *
 * PURPOSE:
 *   The landing page — first thing visitors see. Displays a hero section with
 *   Casey's name and title, featured projects from the API, a technology
 *   proficiency showcase, and a CTA to the contact page.
 *
 * DATA FETCHING:
 *   This is the first page that fetches live data from the backend API.
 *   Two API calls are made when the page loads:
 *     - GET /api/v1/projects/featured → featured projects
 *     - GET /api/v1/technologies/featured → featured technologies
 *
 * REACT PATTERN — Data Fetching with useState + useEffect:
 *
 *   For each data source, we need THREE pieces of state:
 *     const [data, setData] = useState([]);           ← the actual data
 *     const [loading, setLoading] = useState(true);   ← is it still loading?
 *     const [error, setError] = useState(null);       ← did something go wrong?
 *
 *   Java analogy: like a CompletableFuture<List<T>> that can be:
 *     - pending (loading = true)
 *     - completed (loading = false, data populated)
 *     - failed (loading = false, error populated)
 *
 *   useEffect(() => { ... }, [])
 *     - The empty dependency array [] means "run this once, when the
 *       component first appears on screen" (mounts).
 *     - Java analogy: like @PostConstruct — initialization logic that runs
 *       once after the object is created.
 *     - WITHOUT the [] it would run on EVERY render (infinite loop with
 *       setState inside it).
 *
 *   The fetch pattern:
 *     useEffect(() => {
 *       apiCall()
 *         .then(data => setData(data))      ← success: store the data
 *         .catch(() => setError('...'))      ← failure: store error message
 *         .finally(() => setLoading(false))  ← either way: stop loading
 *     }, []);
 *
 *   This is the Promise-based pattern (like Java's CompletableFuture).
 *   .then() = success handler, .catch() = error handler, .finally() = always runs.
 *
 * REACT PATTERN — Conditional Rendering (Loading/Error/Data):
 *
 *   {loading && <LoadingSpinner />}
 *   {error && <ErrorDisplay />}
 *   {!loading && !error && <div>...actual content...</div>}
 *
 *   Only ONE of these renders at a time because the conditions are mutually
 *   exclusive. This is the standard loading/error/data trifecta pattern in
 *   React — you'll use it on every page that fetches data.
 *
 * REACT PATTERN — Retry on Error:
 *
 *   The ErrorDisplay's onRetry prop receives a function that:
 *   1. Clears the error state
 *   2. Sets loading back to true
 *   3. Re-runs the API call
 *   This lets users recover from temporary network failures.
 *
 * LAYOUT:
 *   The page uses <> ... </> (React Fragment) as its root element instead of
 *   a <div>. This is because each section has its own background color —
 *   wrapping them all in a <div> would add an unnecessary DOM node. The
 *   Fragment groups them without rendering anything to the page.
 *
 * TAILWIND BREAKDOWN (key sections):
 *
 *   Hero grid: "grid md:grid-cols-12 gap-12 items-center"
 *   ┌─────────────────────────┬──────────────────────────────────┬──────────────────────────────────┐
 *   │ Tailwind                 │ CSS                              │ What it does                     │
 *   ├─────────────────────────┼──────────────────────────────────┼──────────────────────────────────┤
 *   │ grid                     │ display: grid                    │ 2D grid layout                   │
 *   │ md:grid-cols-12          │ grid-template-columns:           │ 12-column grid on tablet+        │
 *   │                          │ repeat(12, 1fr)                  │ (single column on mobile)        │
 *   │ gap-12                   │ gap: 48px                        │ Space between grid items         │
 *   │ items-center             │ align-items: center              │ Vertically center text and image │
 *   └─────────────────────────┴──────────────────────────────────┴──────────────────────────────────┘
 *
 *   Text column: "md:col-span-7" → takes 7 of 12 columns (58%)
 *   Image column: "md:col-span-5" → takes 5 of 12 columns (42%)
 *   This asymmetric split gives more space to the text — intentional design choice.
 *
 *   Hero glow effect (behind profile image):
 *   ┌─────────────────────────┬──────────────────────────────────┬──────────────────────────────────┐
 *   │ absolute inset-0         │ position: absolute; all edges 0  │ Fills the parent container       │
 *   │ bg-primary/20            │ background: rgba(163,166,255,    │ Faint indigo                     │
 *   │                          │ 0.2)                             │                                  │
 *   │ blur-3xl                 │ filter: blur(64px)               │ Heavily blurred = soft glow      │
 *   │ rounded-full             │ border-radius: 9999px            │ Circle shape                     │
 *   └─────────────────────────┴──────────────────────────────────┴──────────────────────────────────┘
 *   This creates a soft indigo aura behind the profile photo — the "atmospheric
 *   glow" element from the design system.
 *
 *   Featured Projects section: "bg-surface-container-low py-24"
 *   - bg-surface-container-low (#131313) creates a tonal boundary with the hero
 *     section above (bg-surface #0e0e0e). No border needed — the color shift IS
 *     the boundary (the "No-Line Rule").
 *
 *   Technology grid: "grid md:grid-cols-2 gap-x-24 gap-y-12"
 *   - 2 columns on tablet+ with generous horizontal gap (96px) and vertical
 *     gap (48px) between skill bars.
 *
 * ============================================================================
 */
