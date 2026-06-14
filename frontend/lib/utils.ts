import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { API_URL } from "./constants";
import { QueryClient } from "@tanstack/react-query";
import {
  ApiErrorBody,
  ApiRequestError,
  ApiResponse,
  formatApiErrorMessage,
  RequestOptions,
} from "./types";
import { refresh as refreshAuthTokens } from "@/modules/auth/api/auth.api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// API Client
let refreshPromise: Promise<boolean> | null = null;

function redirectToSignIn(): void {
  if (typeof window !== "undefined") {
    window.location.href = "/sign-in";
  }
}

async function tryRefreshSession(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = refreshAuthTokens().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

async function request<T>(
  path: string,
  options: RequestOptions = {},
  isRetry = false,
): Promise<ApiResponse<T>> {
  const { body, headers, ...rest } = options;

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const json: unknown = await response.json().catch(() => null);

  if (response.status === 401 && !isRetry) {
    const refreshed = await tryRefreshSession();
    if (refreshed) {
      return request<T>(path, options, true);
    }
    redirectToSignIn();
  }

  if (!response.ok) {
    if (response.status === 401) {
      redirectToSignIn();
    }
    const errorBody = json as ApiErrorBody | null;
    const message =
      errorBody?.message != null
        ? formatApiErrorMessage(errorBody.message)
        : response.statusText || "Request failed";
    throw new ApiRequestError(response.status, message);
  }

  return json as ApiResponse<T>;
}

export function apiGet<T>(path: string): Promise<ApiResponse<T>> {
  return request<T>(path, { method: "GET" });
}

export function apiPost<T>(
  path: string,
  body: unknown,
): Promise<ApiResponse<T>> {
  return request<T>(path, { method: "POST", body });
}

export function apiPut<T>(
  path: string,
  body: unknown,
): Promise<ApiResponse<T>> {
  return request<T>(path, { method: "PUT", body });
}

export function apiPatch<T>(
  path: string,
  body: unknown,
): Promise<ApiResponse<T>> {
  return request<T>(path, { method: "PATCH", body });
}

export function apiDelete<T>(path: string): Promise<ApiResponse<T>> {
  return request<T>(path, { method: "DELETE" });
}

// Query Client
export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}

export function assertValidId(id: string): void {
  if (!id.trim()) {
    throw new Error("Invalid user id");
  }
}
