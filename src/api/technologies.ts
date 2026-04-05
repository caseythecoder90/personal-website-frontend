import type {
  TechnologyResponse,
  CreateTechnologyRequest,
  UpdateTechnologyRequest,
} from '@/types';
import { apiGet, apiPost, apiPut, apiDelete } from './client';

export const technologyApi = {
  // --------------------------------------------------------------------------
  // Public
  // --------------------------------------------------------------------------

  getAll: () =>
    apiGet<TechnologyResponse[]>('/technologies'),

  getById: (id: number) =>
    apiGet<TechnologyResponse>(`/technologies/${id}`),

  getByCategory: (category: string) =>
    apiGet<TechnologyResponse[]>(`/technologies/category/${category}`),

  getByProficiency: (level: string) =>
    apiGet<TechnologyResponse[]>(`/technologies/proficiency/${level}`),

  getFeatured: () =>
    apiGet<TechnologyResponse[]>('/technologies/featured'),

  getMostUsed: () =>
    apiGet<TechnologyResponse[]>('/technologies/most-used'),

  // --------------------------------------------------------------------------
  // Admin
  // --------------------------------------------------------------------------

  /** @admin */
  create: (data: CreateTechnologyRequest) =>
    apiPost<TechnologyResponse>('/technologies', data),

  /** @admin */
  update: (id: number, data: UpdateTechnologyRequest) =>
    apiPut<TechnologyResponse>(`/technologies/${id}`, data),

  /** @admin */
  remove: (id: number) =>
    apiDelete(`/technologies/${id}`),
};
