/**
 * API Response Types
 */

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export interface ApiSuccessResponse<T> {
  data: T;
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
    totalPages?: number;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Type guard to check if response is an error
 */
export function isApiError(response: ApiResponse<unknown>): response is ApiErrorResponse {
  return "error" in response;
}

/**
 * Pagination params
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

/**
 * Sort params
 */
export interface SortParams {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * Common filter params
 */
export interface FilterParams {
  search?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

/**
 * Server action params
 */
export type ServerAction = "start" | "stop" | "restart" | "rebuild";

export interface ServerActionParams {
  action: ServerAction;
  os_template?: string; // Required for rebuild
}

/**
 * Auth types
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  full_name: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
  } | null;
  session: {
    access_token: string;
    refresh_token: string;
  } | null;
}
