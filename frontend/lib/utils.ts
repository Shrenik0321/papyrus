import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Accept } from "react-dropzone";
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

export function formatDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) return "Today";

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export const LIBRARY_FILE_ACCEPT: Accept = {
  "application/pdf": [".pdf"],
  "text/plain": [".txt", ".md"],
  "text/markdown": [".md"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
};

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function stripFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf(".");
  return lastDot > 0 ? filename.slice(0, lastDot) : filename;
}

export function inferLibraryTypeFromFilename(
  filename: string,
): "paper" | "note" {
  return filename.toLowerCase().endsWith(".pdf") ? "paper" : "note";
}

export function mapDefined<T, R>(
  items: T[] | undefined,
  mapFn: (item: T, index: number) => R,
): R[] {
  return items?.map(mapFn) ?? [];
}

export function countByProperty<T, K extends keyof T>(
  items: T[],
  key: K,
  value: T[K],
): number {
  return items.filter((item) => item[key] === value).length;
}

export function filterBySegment<T>(
  items: T[],
  segment: string,
  allSegment: string,
  matchers: Record<string, (item: T) => boolean>,
): T[] {
  if (segment === allSegment) return items;
  const matcher = matchers[segment];
  return matcher ? items.filter(matcher) : items;
}

// API Client
let refreshPromise: Promise<boolean> | null = null;

function redirectToSignIn(): void {
  if (typeof window === "undefined") return;
  const path = window.location.pathname;
  if (path.startsWith("/sign-in") || path.startsWith("/sign-up")) return;
  window.location.href = "/sign-in";
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

export function apiDelete<T>(
  path: string,
  body?: unknown,
): Promise<ApiResponse<T>> {
  return request<T>(path, { method: "DELETE", body });
}

async function requestFormData<T>(
  path: string,
  formData: FormData,
  isRetry = false,
): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const json: unknown = await response.json().catch(() => null);

  if (response.status === 401 && !isRetry) {
    const refreshed = await tryRefreshSession();
    if (refreshed) {
      return requestFormData<T>(path, formData, true);
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

export function apiUploadForm<T>(
  path: string,
  formData: FormData,
): Promise<ApiResponse<T>> {
  return requestFormData<T>(path, formData);
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
