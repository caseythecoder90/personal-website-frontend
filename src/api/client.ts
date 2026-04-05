import axios from 'axios';
import { env } from '@/config';
import type { ApiResponse, ValidationError } from '@/types';

// ============================================================================
// Constants
// ============================================================================

export const AUTH_TOKEN_KEY = 'auth_token';

// ============================================================================
// Error type
// ============================================================================

/** Structured error thrown by the API client on failed requests. */
export interface ApiError {
  status: number;
  message: string;
  errorCode?: string;
  validationErrors?: ValidationError[];
  requestId?: string;
}

// ============================================================================
// Axios instance
// ============================================================================

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================================================
// Request interceptor — inject JWT token
// ============================================================================

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============================================================================
// Response interceptor — unwrap ApiResponse envelope + handle errors
// ============================================================================

apiClient.interceptors.response.use(
  // Success: unwrap the ApiResponse<T> envelope → return just the data
  (response) => {
    const body = response.data as ApiResponse<unknown>;
    response.data = body.data;
    return response;
  },

  // Error: parse the error response into a structured ApiError
  (error) => {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;

      // Clear token on 401 (expired or invalid)
      if (status === 401) {
        localStorage.removeItem(AUTH_TOKEN_KEY);
      }

      // Parse the backend error envelope
      const body = data as Partial<ApiResponse<unknown>> | undefined;
      const apiError: ApiError = {
        status,
        message: body?.message ?? error.message,
        errorCode: body?.errorCode,
        requestId: body?.requestId,
        validationErrors: (body?.data as ValidationError[] | undefined),
      };
      return Promise.reject(apiError);
    }

    // Network error or unexpected failure
    const apiError: ApiError = {
      status: 0,
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
    return Promise.reject(apiError);
  },
);

// ============================================================================
// Typed helper functions
// ============================================================================

/**
 * These helpers exist because the response interceptor unwraps the ApiResponse
 * envelope, but Axios's generic type parameter doesn't know about that. These
 * functions bridge the gap so service methods return Promise<T> correctly.
 */

export async function apiGet<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const response = await apiClient.get<T>(url, { params });
  return response.data;
}

export async function apiPost<T>(url: string, data?: unknown): Promise<T> {
  const response = await apiClient.post<T>(url, data);
  return response.data;
}

export async function apiPut<T>(url: string, data?: unknown): Promise<T> {
  const response = await apiClient.put<T>(url, data);
  return response.data;
}

export async function apiDelete<T = void>(url: string): Promise<T> {
  const response = await apiClient.delete<T>(url);
  return response.data;
}
