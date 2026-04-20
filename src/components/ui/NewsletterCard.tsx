export function NewsletterCard() {
  return (
    <section
      aria-labelledby="newsletter-heading"
      className="bg-primary/5 p-8 rounded-xl"
    >
      <h3
        id="newsletter-heading"
        className="font-headline font-bold text-xl text-on-background mb-3"
      >
        Newsletter
      </h3>
      <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
        Technical deep-dives and system design notes. Coming soon.
      </p>
      <input
        type="email"
        disabled
        placeholder="email@example.com"
        className="w-full bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/60 rounded-md mb-4 text-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
      />
      <button
        type="button"
        disabled
        className="w-full bg-gradient-to-r from-primary to-primary-dim text-on-primary py-3 rounded-md font-bold text-sm transition-opacity opacity-70 cursor-not-allowed"
      >
        Subscribe (soon)
      </button>
    </section>
  );
}
