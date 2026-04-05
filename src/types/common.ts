/** Backend API response envelope — all endpoints return this wrapper. */
export interface ApiResponse<T> {
  status: string;
  errorCode?: string;
  message: string;
  data: T;
  timestamp: string;
  requestId: string;
}

/** Field-level validation error returned by the backend. */
export interface ValidationError {
  field: string;
  message: string;
}

/** Spring Page response for paginated endpoints. */
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

/** Query parameters for paginated API calls. */
export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
}
