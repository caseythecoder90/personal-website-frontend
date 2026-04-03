const socialLinks = [
  { label: 'GitHub', href: '#' },
  { label: 'LinkedIn', href: '#' },
  { label: 'Twitter', href: '#' },
  { label: 'Email', href: '#' },
];

export function Footer() {
  return (
    <footer className="bg-surface-container-low py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 md:flex-row">
        <div className="text-center md:text-left">
          <div className="font-headline text-lg font-bold text-on-surface">
            Casey Quinn.
          </div>
          <div className="mt-1 text-sm text-on-surface-variant/60">
            &copy; {new Date().getFullYear()} Casey Quinn. Crafted with precision.
          </div>
        </div>

        <div className="flex items-center gap-8">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-on-surface-variant/60 underline-offset-4 transition-colors hover:text-primary hover:underline"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
