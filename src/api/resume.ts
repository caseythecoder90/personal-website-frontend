import type { ResumeResponse } from '@/types';
import { env } from '@/config';
import { apiGet, apiDelete, apiClient } from './client';

export const resumeApi = {
  // --------------------------------------------------------------------------
  // Public
  // --------------------------------------------------------------------------

  /** Get resume metadata (file name, size, upload date). */
  getMetadata: () =>
    apiGet<ResumeResponse>('/resume'),

  /**
   * Get the resume download URL.
   * The backend returns a 302 redirect to Cloudinary, so we expose the URL
   * string for use in <a href> or window.open() rather than making an
   * Axios call that would follow the redirect.
   */
  getDownloadUrl: () =>
    `${env.apiBaseUrl}/resume/download`,

  // --------------------------------------------------------------------------
  // Admin
  // --------------------------------------------------------------------------

  /** @admin — Upload a new resume PDF (replaces existing). */
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post<ResumeResponse>(
      '/resume',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    ).then(r => r.data);
  },

  /** @admin */
  remove: () =>
    apiDelete('/resume'),
};
