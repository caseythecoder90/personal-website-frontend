import { usePageTitle } from '@/hooks';

export function HomePage() {
  usePageTitle('');

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <h1 className="font-headline text-5xl font-bold text-on-surface tracking-tight">
        Casey Quinn.
      </h1>
      <p className="mt-4 text-lg text-on-surface-variant">
        Full-Stack Software Engineer — Homepage coming in Issue #5.
      </p>
    </div>
  );
}
