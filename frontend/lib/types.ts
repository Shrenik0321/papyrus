// Request Options Type
export type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

// App Route Type
export type AppRoute = {
  route: string;
  isProtected: boolean;
};

// API Types : Mirrors the backend ApiResponse envelope: { data, message }.
export type ApiResponse<T> = {
  data: T;
  message: string;
};

export type ApiErrorBody = {
  statusCode: number;
  message: string | string[];
  error?: string;
};

export class ApiRequestError extends Error {
  readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = "ApiRequestError";
    this.statusCode = statusCode;
  }
}

export function unwrapApiResponse<T>(response: ApiResponse<T>): T {
  return response.data;
}

export function formatApiErrorMessage(message: string | string[]): string {
  return Array.isArray(message) ? message.join(", ") : message;
}
