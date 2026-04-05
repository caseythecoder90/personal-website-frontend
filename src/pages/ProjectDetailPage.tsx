import { useParams } from 'react-router-dom';
import { usePageTitle } from '@/hooks';

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  usePageTitle(slug ?? 'Project');

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <h1 className="font-headline text-5xl font-bold text-on-surface tracking-tight">
        Project: {slug}
      </h1>
      <p className="mt-4 text-lg text-on-surface-variant">
        Project detail coming in Issue #7.
      </p>
    </div>
  );
}
