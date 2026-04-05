import { usePageTitle } from '@/hooks';

export function CertificationsPage() {
  usePageTitle('Certifications');

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <h1 className="font-headline text-5xl font-bold text-on-surface tracking-tight">
        Certifications
      </h1>
      <p className="mt-4 text-lg text-on-surface-variant">
        Certifications page coming in Issue #9.
      </p>
    </div>
  );
}
