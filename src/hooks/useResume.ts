import { useEffect, useState } from 'react';
import { resumeApi } from '@/api/resume';
import type { ResumeResponse } from '@/types';

// ----------------------------------------------------------------------------
// Module-level cache
// ----------------------------------------------------------------------------

// Shared promise across all hook consumers. The first mount kicks off the
// request; any later mounts await the same promise instead of firing their
// own. A 404 (no resume uploaded) resolves to `null` rather than rejecting —
// so the caller can treat "no resume" as a legitimate state.
let cachedPromise: Promise<ResumeResponse | null> | null = null;

function fetchResumeOnce(): Promise<ResumeResponse | null> {
  if (!cachedPromise) {
    cachedPromise = resumeApi.getMetadata().catch(() => null);
  }
  return cachedPromise;
}

// ----------------------------------------------------------------------------
// Hook
// ----------------------------------------------------------------------------

export interface UseResumeResult {
  /** True once metadata resolves and a resume is available. */
  available: boolean;
  /** Backend URL that 302-redirects to the Cloudinary file. */
  downloadUrl: string;
  /** File name from metadata (e.g. "casey-quinn-resume.pdf"), or null. */
  fileName: string | null;
  /** True while the initial metadata fetch is in flight. */
  loading: boolean;
}

/**
 * Reads resume metadata and exposes a render-ready download URL.
 *
 * Intended for the "Download Resume" buttons in the navbar and on the
 * homepage. Consumers typically render the button only when `available`
 * is true, so a portfolio without an uploaded resume just hides the CTA
 * instead of linking to a broken page.
 *
 * The underlying fetch is shared across all mounts via a module-level
 * cache — no duplicate network calls when multiple components use the hook.
 */
export function useResume(): UseResumeResult {
  const [metadata, setMetadata] = useState<ResumeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetchResumeOnce().then((data) => {
      if (cancelled) return;
      setMetadata(data);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    available: metadata !== null,
    downloadUrl: resumeApi.getDownloadUrl(),
    fileName: metadata?.fileName ?? null,
    loading,
  };
}
