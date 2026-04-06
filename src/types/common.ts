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

/** Spring Boot 3.x Page response — uses a nested `page` object. */
export interface PageResponse<T> {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

/** Query parameters for paginated API calls. */
export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
}
