import type {
  BlogPostResponse,
  BlogCategoryResponse,
  BlogTagResponse,
  BlogPostImageResponse,
  PageResponse,
  PaginationParams,
  CreateBlogPostRequest,
  UpdateBlogPostRequest,
  CreateBlogCategoryRequest,
  UpdateBlogCategoryRequest,
  CreateBlogTagRequest,
  UpdateBlogTagRequest,
  CreateBlogPostImageRequest,
  UpdateBlogPostImageRequest,
} from '@/types';
import { apiGet, apiPost, apiPut, apiDelete, apiClient } from './client';

export const blogApi = {
  // ==========================================================================
  // Posts
  // ==========================================================================
  posts: {
    // Public
    getAll: () =>
      apiGet<BlogPostResponse[]>('/blog/posts'),

    getPublished: () =>
      apiGet<BlogPostResponse[]>('/blog/posts/published'),

    getPublishedPaginated: (params?: PaginationParams) =>
      apiGet<PageResponse<BlogPostResponse>>('/blog/posts/published/paginated', params as Record<string, unknown>),

    getById: (id: number) =>
      apiGet<BlogPostResponse>(`/blog/posts/${id}`),

    /** Fetching by slug increments the view count on the backend. */
    getBySlug: (slug: string) =>
      apiGet<BlogPostResponse>(`/blog/posts/slug/${slug}`),

    getByCategory: (categorySlug: string) =>
      apiGet<BlogPostResponse[]>(`/blog/posts/category/${categorySlug}`),

    getByTag: (tagSlug: string) =>
      apiGet<BlogPostResponse[]>(`/blog/posts/tag/${tagSlug}`),

    search: (query: string) =>
      apiGet<BlogPostResponse[]>('/blog/posts/search', { q: query }),

    // Admin
    /** @admin */
    create: (data: CreateBlogPostRequest) =>
      apiPost<BlogPostResponse>('/blog/posts', data),

    /** @admin */
    update: (id: number, data: UpdateBlogPostRequest) =>
      apiPut<BlogPostResponse>(`/blog/posts/${id}`, data),

    /** @admin */
    remove: (id: number) =>
      apiDelete(`/blog/posts/${id}`),

    /** @admin */
    publish: (id: number) =>
      apiPut<BlogPostResponse>(`/blog/posts/${id}/publish`),

    /** @admin */
    unpublish: (id: number) =>
      apiPut<BlogPostResponse>(`/blog/posts/${id}/unpublish`),

    /** @admin */
    addCategory: (postId: number, categoryId: number) =>
      apiPost<void>(`/blog/posts/${postId}/categories/${categoryId}`),

    /** @admin */
    removeCategory: (postId: number, categoryId: number) =>
      apiDelete(`/blog/posts/${postId}/categories/${categoryId}`),

    /** @admin */
    addTag: (postId: number, tagId: number) =>
      apiPost<void>(`/blog/posts/${postId}/tags/${tagId}`),

    /** @admin */
    removeTag: (postId: number, tagId: number) =>
      apiDelete(`/blog/posts/${postId}/tags/${tagId}`),
  },

  // ==========================================================================
  // Categories
  // ==========================================================================
  categories: {
    getAll: () =>
      apiGet<BlogCategoryResponse[]>('/blog/categories'),

    getById: (id: number) =>
      apiGet<BlogCategoryResponse>(`/blog/categories/${id}`),

    getBySlug: (slug: string) =>
      apiGet<BlogCategoryResponse>(`/blog/categories/slug/${slug}`),

    /** @admin */
    create: (data: CreateBlogCategoryRequest) =>
      apiPost<BlogCategoryResponse>('/blog/categories', data),

    /** @admin */
    update: (id: number, data: UpdateBlogCategoryRequest) =>
      apiPut<BlogCategoryResponse>(`/blog/categories/${id}`, data),

    /** @admin */
    remove: (id: number) =>
      apiDelete(`/blog/categories/${id}`),
  },

  // ==========================================================================
  // Tags
  // ==========================================================================
  tags: {
    getAll: () =>
      apiGet<BlogTagResponse[]>('/blog/tags'),

    getPopular: () =>
      apiGet<BlogTagResponse[]>('/blog/tags/popular'),

    getById: (id: number) =>
      apiGet<BlogTagResponse>(`/blog/tags/${id}`),

    getBySlug: (slug: string) =>
      apiGet<BlogTagResponse>(`/blog/tags/slug/${slug}`),

    /** @admin */
    create: (data: CreateBlogTagRequest) =>
      apiPost<BlogTagResponse>('/blog/tags', data),

    /** @admin */
    update: (id: number, data: UpdateBlogTagRequest) =>
      apiPut<BlogTagResponse>(`/blog/tags/${id}`, data),

    /** @admin */
    remove: (id: number) =>
      apiDelete(`/blog/tags/${id}`),
  },

  // ==========================================================================
  // Post Images
  // ==========================================================================
  images: {
    getAll: (postId: number) =>
      apiGet<BlogPostImageResponse[]>(`/blog/posts/${postId}/images`),

    getById: (postId: number, imageId: number) =>
      apiGet<BlogPostImageResponse>(`/blog/posts/${postId}/images/${imageId}`),

    /** @admin — Upload a blog post image (multipart/form-data). */
    create: (postId: number, file: File, metadata: CreateBlogPostImageRequest) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('metadata', JSON.stringify(metadata));
      return apiClient.post<BlogPostImageResponse>(
        `/blog/posts/${postId}/images`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      ).then(r => r.data);
    },

    /** @admin */
    update: (postId: number, imageId: number, data: UpdateBlogPostImageRequest) =>
      apiPut<BlogPostImageResponse>(`/blog/posts/${postId}/images/${imageId}`, data),

    /** @admin */
    setPrimary: (postId: number, imageId: number) =>
      apiPut<BlogPostImageResponse>(`/blog/posts/${postId}/images/${imageId}/primary`),

    /** @admin */
    remove: (postId: number, imageId: number) =>
      apiDelete(`/blog/posts/${postId}/images/${imageId}`),
  },
};
