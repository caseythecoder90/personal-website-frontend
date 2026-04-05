import { usePageTitle } from '@/hooks';

export function ProjectsPage() {
  usePageTitle('Projects');

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <h1 className="font-headline text-5xl font-bold text-on-surface tracking-tight">
        Projects
      </h1>
      <p className="mt-4 text-lg text-on-surface-variant">
        Projects listing coming in Issue #6.
      </p>
    </div>
  );
}
