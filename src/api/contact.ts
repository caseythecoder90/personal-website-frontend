import type {
  ContactSubmissionResponse,
  ContactSubmissionRequest,
  UpdateContactStatusRequest,
} from '@/types';
import { apiGet, apiPost, apiPut, apiDelete } from './client';

export const contactApi = {
  // --------------------------------------------------------------------------
  // Public
  // --------------------------------------------------------------------------

  /** Submit a contact form (public, rate-limited). */
  submit: (data: ContactSubmissionRequest) =>
    apiPost<ContactSubmissionResponse>('/contact', data),

  // --------------------------------------------------------------------------
  // Admin
  // --------------------------------------------------------------------------

  /** @admin */
  getAll: () =>
    apiGet<ContactSubmissionResponse[]>('/contact'),

  /** @admin */
  getById: (id: number) =>
    apiGet<ContactSubmissionResponse>(`/contact/${id}`),

  /** @admin */
  getByStatus: (status: string) =>
    apiGet<ContactSubmissionResponse[]>(`/contact/status/${status}`),

  /** @admin */
  getByInquiryType: (type: string) =>
    apiGet<ContactSubmissionResponse[]>(`/contact/inquiry-type/${type}`),

  /** @admin */
  updateStatus: (id: number, data: UpdateContactStatusRequest) =>
    apiPut<ContactSubmissionResponse>(`/contact/${id}/status`, data),

  /** @admin */
  remove: (id: number) =>
    apiDelete(`/contact/${id}`),
};
