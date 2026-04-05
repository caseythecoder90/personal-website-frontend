import { usePageTitle } from '@/hooks';

export function ContactPage() {
  usePageTitle('Contact');

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <h1 className="font-headline text-5xl font-bold text-on-surface tracking-tight">
        Get In Touch
      </h1>
      <p className="mt-4 text-lg text-on-surface-variant">
        Contact form coming in Issue #10.
      </p>
    </div>
  );
}
