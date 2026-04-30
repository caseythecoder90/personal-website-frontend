import { useEffect } from 'react';

// ----------------------------------------------------------------------------
// Site-wide constants
// ----------------------------------------------------------------------------

const SITE_NAME = 'Casey Quinn';
const SITE_URL = 'https://caseyrquinn.com';
const DEFAULT_IMAGE = `${SITE_URL}/og-default.png`;

// ----------------------------------------------------------------------------
// Hook
// ----------------------------------------------------------------------------

export interface UseMetaOptions {
  /** Page-specific title. Empty string uses the default "Casey Quinn | Portfolio". */
  title: string;
  /** 1-2 sentence description for search engines and link previews. */
  description: string;
  /** Absolute URL or path. Defaults to the site-wide social card. */
  image?: string;
  /** `website` for most pages, `article` for blog posts. */
  type?: 'website' | 'article';
  /** Canonical URL. Defaults to the current browser URL. */
  url?: string;
}

/**
 * Sets per-page SEO metadata: `<title>`, `<meta name="description">`,
 * Open Graph tags (Facebook, LinkedIn, iMessage), and Twitter Card tags.
 *
 * Call at the top of each page component. Values update whenever the
 * dependencies change — so pages that load data asynchronously (blog
 * post detail, project detail) can pass loaded values and the meta will
 * update once the fetch resolves.
 */
export function useMeta(options: UseMetaOptions) {
  const {
    title,
    description,
    image = DEFAULT_IMAGE,
    type = 'website',
    url,
  } = options;

  useEffect(() => {
    const fullTitle = title
      ? `${title} | ${SITE_NAME}`
      : `${SITE_NAME} | Portfolio`;
    const canonical = url ?? window.location.origin + window.location.pathname;
    const absoluteImage = image.startsWith('http') ? image : `${SITE_URL}${image}`;

    document.title = fullTitle;

    setMeta('name', 'description', description);

    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:image', absoluteImage);
    setMeta('property', 'og:url', canonical);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:site_name', SITE_NAME);

    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', absoluteImage);
  }, [title, description, image, type, url]);
}

// ----------------------------------------------------------------------------
// Internal: upsert a meta tag by (attr, key)
// ----------------------------------------------------------------------------

// Creates the tag if it doesn't exist yet — so pages don't depend on
// index.html pre-declaring every slot.
function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}
