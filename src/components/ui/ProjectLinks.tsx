import type { ProjectLinkResponse, LinkType } from '@/types';

// ============================================================================
// Link type configuration — icon + label for each LinkType enum value
// ============================================================================

interface LinkConfig {
  label: string;
  icon: React.ReactNode;
}

const LINK_ICONS: Record<LinkType, LinkConfig> = {
  GITHUB: {
    label: 'GitHub Repository',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  LIVE: {
    label: 'Live Site',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
      </svg>
    ),
  },
  DEMO: {
    label: 'Live Demo',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
  },
  STAGING: {
    label: 'Staging',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  DOCUMENTATION: {
    label: 'Documentation',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  DOCKER: {
    label: 'Docker Hub',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12.5c-.5-1-1.5-1.5-2.5-1.5h-1v-2h-2v2h-2v-2h-2v2h-2v-2H8v2H6V9H4v2H2.5C1.5 11 .5 11.5 0 12.5" /><rect x="5" y="14" width="14" height="7" rx="1" />
      </svg>
    ),
  },
  NPM: {
    label: 'NPM Package',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 4H4v16h8V8h4v12h4V4z" />
      </svg>
    ),
  },
  MAVEN: {
    label: 'Maven Central',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      </svg>
    ),
  },
  API: {
    label: 'API Reference',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  OTHER: {
    label: 'Link',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
  },
};

// ============================================================================
// Component
// ============================================================================

interface ProjectLinksProps {
  links: ProjectLinkResponse[];
}

export function ProjectLinks({ links }: ProjectLinksProps) {
  if (links.length === 0) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-on-surface font-headline">
        Repository & Deployment
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {links.map((link: ProjectLinkResponse, index: number) => {
          const config: LinkConfig = LINK_ICONS[link.type] ?? LINK_ICONS.OTHER;
          const isFirst: boolean = index === 0;

          return (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-between px-6 py-4 rounded-lg group transition-all hover:scale-[1.02] ${
                isFirst
                  ? 'bg-gradient-to-br from-primary to-primary-dim text-on-primary'
                  : 'bg-surface-variant border border-outline-variant/30 text-on-surface hover:bg-surface-container-highest'
              }`}
            >
              <div className="flex items-center gap-3">
                {config.icon}
                <span className="font-medium">{link.label ?? config.label}</span>
              </div>
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className={`group-hover:translate-x-1 transition-transform ${isFirst ? 'opacity-70' : 'text-on-surface-variant'}`}
              >
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          );
        })}
      </div>
    </div>
  );
}
