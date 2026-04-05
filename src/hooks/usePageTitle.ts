import { useEffect } from 'react';

/**
 * Sets the browser tab title. Appends " | Casey Quinn" suffix.
 * Call at the top of each page component.
 */
export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} | Casey Quinn` : 'Casey Quinn | Portfolio';
  }, [title]);
}
