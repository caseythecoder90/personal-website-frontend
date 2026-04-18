import type {
  ProjectResponse,
  ProjectImageResponse,
  ProjectLinkResponse,
  PageResponse,
  PaginationParams,
  CreateProjectRequest,
  UpdateProjectRequest,
  CreateProjectImageRequest,
  UpdateProjectImageRequest,
  CreateProjectLinkRequest,
  UpdateProjectLinkRequest,
} from '@/types';
import { apiGet, apiPost, apiPut, apiDelete, apiClient } from './client';

export const projectApi = {
  // --------------------------------------------------------------------------
  // Projects — Public
  // --------------------------------------------------------------------------

  getAll: () =>
    apiGet<ProjectResponse[]>('/projects'),

  getPaginated: (params?: PaginationParams & { published?: boolean }) =>
    apiGet<PageResponse<ProjectResponse>>('/projects/paginated', params as Record<string, unknown>),

  getById: (id: number) =>
    apiGet<ProjectResponse>(`/projects/${id}`),

  getBySlug: (slug: string) =>
    apiGet<ProjectResponse>(`/projects/slug/${slug}`),

  getByTechnology: (tech: string) =>
    apiGet<ProjectResponse[]>(`/projects/technology/${tech}`),

  getFeatured: () =>
    apiGet<ProjectResponse[]>('/projects/featured'),

  incrementViews: (id: number) =>
    apiPut<void>(`/projects/${id}/views`),

  // --------------------------------------------------------------------------
  // Projects — Admin
  // --------------------------------------------------------------------------

  /** @admin */
  create: (data: CreateProjectRequest) =>
    apiPost<ProjectResponse>('/projects', data),

  /** @admin */
  update: (id: number, data: UpdateProjectRequest) =>
    apiPut<ProjectResponse>(`/projects/${id}`, data),

  /** @admin */
  remove: (id: number) =>
    apiDelete(`/projects/${id}`),

  // --------------------------------------------------------------------------
  // Project Images — Public
  // --------------------------------------------------------------------------

  getImages: (projectId: number) =>
    apiGet<ProjectImageResponse[]>(`/projects/${projectId}/images`),

  getImage: (projectId: number, imageId: number) =>
    apiGet<ProjectImageResponse>(`/projects/${projectId}/images/${imageId}`),

  // --------------------------------------------------------------------------
  // Project Images — Admin
  // --------------------------------------------------------------------------

  /** @admin — Upload a project image (multipart/form-data). */
  createImage: (projectId: number, file: File, metadata: CreateProjectImageRequest) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('metadata', JSON.stringify(metadata));
    return apiClient.post<ProjectImageResponse>(
      `/projects/${projectId}/images`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    ).then(r => r.data);
  },

  /** @admin */
  updateImage: (projectId: number, imageId: number, data: UpdateProjectImageRequest) =>
    apiPut<ProjectImageResponse>(`/projects/${projectId}/images/${imageId}`, data),

  /** @admin */
  setPrimaryImage: (projectId: number, imageId: number) =>
    apiPut<ProjectImageResponse>(`/projects/${projectId}/images/${imageId}/set-primary`),

  /** @admin */
  deleteImage: (projectId: number, imageId: number) =>
    apiDelete(`/projects/${projectId}/images/${imageId}`),

  // --------------------------------------------------------------------------
  // Project Links — Public
  // --------------------------------------------------------------------------

  getLinks: (projectId: number) =>
    apiGet<ProjectLinkResponse[]>(`/projects/${projectId}/links`),

  getLink: (projectId: number, linkId: number) =>
    apiGet<ProjectLinkResponse>(`/projects/${projectId}/links/${linkId}`),

  // --------------------------------------------------------------------------
  // Project Links — Admin
  // --------------------------------------------------------------------------

  /** @admin */
  createLink: (projectId: number, data: CreateProjectLinkRequest) =>
    apiPost<ProjectLinkResponse>(`/projects/${projectId}/links`, data),

  /** @admin */
  updateLink: (projectId: number, linkId: number, data: UpdateProjectLinkRequest) =>
    apiPut<ProjectLinkResponse>(`/projects/${projectId}/links/${linkId}`, data),

  /** @admin */
  deleteLink: (projectId: number, linkId: number) =>
    apiDelete(`/projects/${projectId}/links/${linkId}`),
};
