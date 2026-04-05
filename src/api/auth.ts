import type { AuthResponse, LoginRequest } from '@/types';
import { apiPost, AUTH_TOKEN_KEY } from './client';

export const authApi = {
  /** Authenticate with username and password. Returns a JWT token. */
  login: (data: LoginRequest) =>
    apiPost<AuthResponse>('/auth/login', data),

  /** Store the JWT token in localStorage. */
  setToken: (token: string) =>
    localStorage.setItem(AUTH_TOKEN_KEY, token),

  /** Remove the JWT token from localStorage. */
  clearToken: () =>
    localStorage.removeItem(AUTH_TOKEN_KEY),

  /** Check if a JWT token exists in localStorage. */
  isAuthenticated: () =>
    localStorage.getItem(AUTH_TOKEN_KEY) !== null,
};
