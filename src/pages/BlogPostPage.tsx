import { useParams } from 'react-router-dom';
import { usePageTitle } from '@/hooks';

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  usePageTitle(slug ?? 'Blog Post');

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <h1 className="font-headline text-5xl font-bold text-on-surface tracking-tight">
        Blog Post: {slug}
      </h1>
      <p className="mt-4 text-lg text-on-surface-variant">
        Blog post detail coming in Issue #8.
      </p>
    </div>
  );
}
