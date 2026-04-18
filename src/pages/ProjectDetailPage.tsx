import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePageTitle } from '@/hooks';
import { projectApi } from '@/api/projects';
import { TechPill, StatusBadge, ProjectLinks, ProjectGallery, LoadingSpinner, ErrorDisplay } from '@/components/ui';
import { formatDate } from '@/utils';
import type { ProjectResponse, ProjectImageResponse } from '@/types';

/** Human-readable project type labels. */
const PROJECT_TYPE_LABELS: Record<string, string> = {
  PERSONAL: 'Personal',
  PROFESSIONAL: 'Professional',
  OPEN_SOURCE: 'Open Source',
  LEARNING: 'Learning',
  FREELANCE: 'Freelance',
};

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const [project, setProject] = useState<ProjectResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState<boolean>(false);
  const viewCounted = useRef(false);

  usePageTitle(project?.name ?? 'Project');

  useEffect(() => {
    if (!slug) return;

    setLoading(true);
    setError(null);
    setNotFound(false);

    projectApi
      .getBySlug(slug)
      .then((data: ProjectResponse) => {
        setProject(data);
        if (!viewCounted.current) {
          viewCounted.current = true;
          projectApi.incrementViews(data.id).catch(() => {});
        }
      })
      .catch((err) => {
        if (err?.response?.status === 404) {
          setNotFound(true);
        } else {
          setError('Failed to load project.');
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  // ---- Loading state ----
  if (loading) {
    return (
      <main className="pt-32 pb-24">
        <LoadingSpinner message="Loading project..." />
      </main>
    );
  }

  // ---- Error state ----
  if (error) {
    return (
      <main className="pt-32 pb-24 px-8 max-w-7xl mx-auto">
        <ErrorDisplay message={error} onRetry={() => {
          if (slug) {
            setLoading(true);
            setError(null);
            projectApi
              .getBySlug(slug)
              .then((data: ProjectResponse) => setProject(data))
              .catch(() => setError('Failed to load project.'))
              .finally(() => setLoading(false));
          }
        }} />
      </main>
    );
  }

  // ---- 404 state ----
  if (notFound || !project) {
    return (
      <main className="pt-32 pb-24 px-8 max-w-7xl mx-auto text-center">
        <h1 className="font-headline text-6xl font-bold text-on-surface tracking-tighter mb-4">
          404
        </h1>
        <p className="text-on-surface-variant text-lg mb-8">
          No project found with slug "{slug}".
        </p>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Projects
        </Link>
      </main>
    );
  }

  // ---- Derived data ----
  const images: ProjectImageResponse[] = project.images ?? [];
  const primaryImage: ProjectImageResponse | undefined = images.find((img) => img.isPrimary) ?? images[0];
  const galleryImages: ProjectImageResponse[] = images.filter((img) => img !== primaryImage);
  const technologies = project.technologies ?? [];
  const links = project.links ?? [];

  return (
    <main className="min-h-screen">
      {/* ================================================================
          BACK NAVIGATION
          ================================================================ */}
      <div className="max-w-7xl mx-auto px-8 py-6">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group"
        >
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="group-hover:-translate-x-1 transition-transform"
          >
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
          <span className="font-label text-sm tracking-wide uppercase">Back to Projects</span>
        </Link>
      </div>

      {/* ================================================================
          HERO IMAGE
          ================================================================ */}
      {primaryImage && (
        <section className="relative w-full h-[500px] md:h-[614px] overflow-hidden">
          <img
            src={primaryImage.url}
            alt={primaryImage.altText ?? project.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background" />
        </section>
      )}

      {/* ================================================================
          PROJECT IDENTITY — Badges, Title, Metadata
          ================================================================ */}
      <section className={`max-w-7xl mx-auto px-8 relative z-10 ${primaryImage ? '-mt-32' : 'pt-8'}`}>
        <div className="flex flex-col gap-6">
          {/* Badges */}
          <div className="flex flex-wrap gap-3">
            <StatusBadge status={project.status} />
            {project.difficultyLevel && (
              <StatusBadge status={project.difficultyLevel} />
            )}
            {project.type && (
              <span className="bg-surface-variant text-on-surface-variant px-4 py-1 rounded-full text-[10px] font-bold tracking-[0.1em] uppercase border border-white/5">
                {PROJECT_TYPE_LABELS[project.type] ?? project.type}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-headline font-bold tracking-tighter leading-none max-w-4xl">
            {project.name.includes(' ')
              ? (
                <>
                  {project.name.split(' ').slice(0, -1).join(' ')}{' '}
                  <span className="text-primary italic">
                    {project.name.split(' ').slice(-1)}
                  </span>
                </>
              )
              : <span className="text-primary">{project.name}</span>
            }
          </h1>

          {/* Short description */}
          <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed">
            {project.shortDescription}
          </p>

          {/* Metadata row */}
          <div className="flex flex-wrap items-center gap-x-12 gap-y-4 pt-4 border-t border-white/5 max-w-fit">
            {project.startDate && (
              <div className="flex flex-col">
                <span className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">Start Date</span>
                <span className="font-headline text-lg font-medium">{formatDate(project.startDate)}</span>
              </div>
            )}
            {project.completionDate && (
              <div className="flex flex-col">
                <span className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">Completed</span>
                <span className="font-headline text-lg font-medium">{formatDate(project.completionDate)}</span>
              </div>
            )}
            {project.estimatedHours != null && (
              <div className="flex flex-col">
                <span className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">Estimated Hours</span>
                <span className="font-headline text-lg font-medium text-primary">{project.estimatedHours}h</span>
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">Views</span>
              <span className="font-headline text-lg font-medium">{project.viewCount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          CONTENT GRID — Description (left) + Tech Stack Sidebar (right)
          ================================================================ */}
      <section className="max-w-7xl mx-auto px-8 mt-24 grid grid-cols-1 lg:grid-cols-12 gap-20">
        {/* Description + Links */}
        <div className="lg:col-span-7 space-y-12">
          {project.fullDescription && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-on-surface border-l-2 border-primary pl-6 font-headline">
                Mission Overview
              </h2>
              <div className="font-body text-lg leading-relaxed text-on-surface-variant space-y-6">
                {project.fullDescription.split('\n\n').map((paragraph: string, i: number) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
          )}

          <ProjectLinks links={links} />
        </div>

        {/* Tech Stack Sidebar */}
        {technologies.length > 0 && (
          <div className="lg:col-span-5">
            <div className="bg-surface-container-low p-10 rounded-xl border border-white/5">
              <h2 className="text-xl font-bold mb-8 flex items-center gap-3 font-headline">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
                </svg>
                Technology Stack
              </h2>
              <div className="flex flex-wrap gap-3">
                {technologies.map((tech) => (
                  <TechPill key={tech.id} name={tech.name} />
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ================================================================
          IMAGE GALLERY
          ================================================================ */}
      <ProjectGallery images={galleryImages} />

      {/* Bottom spacing */}
      <div className="h-32" />
    </main>
  );
}
