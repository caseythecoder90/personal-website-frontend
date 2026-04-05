import { usePageTitle } from '@/hooks';
import { Button } from '@/components/ui';

export function NotFoundPage() {
  usePageTitle('404');

  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-6 py-32 text-center">
      <h1 className="font-headline text-8xl font-bold text-primary mb-4">404</h1>
      <p className="text-2xl font-headline text-on-surface mb-2">Page Not Found</p>
      <p className="text-on-surface-variant mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button href="/">Back to Home</Button>
    </div>
  );
}
