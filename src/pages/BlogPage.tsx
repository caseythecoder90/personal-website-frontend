import { usePageTitle } from '@/hooks';

export function BlogPage() {
  usePageTitle('Blog');

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <h1 className="font-headline text-5xl font-bold text-on-surface tracking-tight">
        Blog
      </h1>
      <p className="mt-4 text-lg text-on-surface-variant">
        Blog listing coming in Issue #8.
      </p>
    </div>
  );
}
