import type {
  CertificationResponse,
  CreateCertificationRequest,
  UpdateCertificationRequest,
} from '@/types';
import { apiGet, apiPost, apiPut, apiDelete } from './client';

export const certificationApi = {
  // --------------------------------------------------------------------------
  // Public
  // --------------------------------------------------------------------------

  getAll: () =>
    apiGet<CertificationResponse[]>('/certifications'),

  getById: (id: number) =>
    apiGet<CertificationResponse>(`/certifications/${id}`),

  getBySlug: (slug: string) =>
    apiGet<CertificationResponse>(`/certifications/slug/${slug}`),

  getByStatus: (status: string) =>
    apiGet<CertificationResponse[]>(`/certifications/status/${status}`),

  getPublished: () =>
    apiGet<CertificationResponse[]>('/certifications/published'),

  getFeatured: () =>
    apiGet<CertificationResponse[]>('/certifications/featured'),

  getByOrganization: (org: string) =>
    apiGet<CertificationResponse[]>(`/certifications/organization/${org}`),

  // --------------------------------------------------------------------------
  // Admin
  // --------------------------------------------------------------------------

  /** @admin */
  create: (data: CreateCertificationRequest) =>
    apiPost<CertificationResponse>('/certifications', data),

  /** @admin */
  update: (id: number, data: UpdateCertificationRequest) =>
    apiPut<CertificationResponse>(`/certifications/${id}`, data),

  /** @admin */
  remove: (id: number) =>
    apiDelete(`/certifications/${id}`),

  /** @admin — Link a technology to a certification. */
  addTechnology: (certId: number, techId: number) =>
    apiPost<void>(`/certifications/${certId}/technologies/${techId}`),

  /** @admin — Unlink a technology from a certification. */
  removeTechnology: (certId: number, techId: number) =>
    apiDelete(`/certifications/${certId}/technologies/${techId}`),
};
