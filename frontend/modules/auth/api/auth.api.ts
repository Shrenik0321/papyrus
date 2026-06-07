import { API_URL } from "@/lib/constants";
import { AUTH_ROUTES } from "@/lib/routes";
import {
  ApiErrorBody,
  ApiRequestError,
  ApiResponse,
  formatApiErrorMessage,
} from "@/lib/types";
import type { AuthSession, LoginInput, RegisterInput } from "../types/auth.type";

/**
 * Auth endpoints intentionally bypass the shared `request()` client in lib/utils:
 * its 401 handler auto-refreshes and redirects to sign-in, which would mask
 * legitimate auth errors (e.g. bad credentials).
 */
async function authFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  return fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
}

async function parseAuthResponse<T>(
  response: Response,
  fallbackMessage: string,
): Promise<ApiResponse<T>> {
  const json = (await response.json().catch(() => null)) as
    | (ApiResponse<T> & ApiErrorBody)
    | null;

  if (!response.ok) {
    const message =
      json?.message != null
        ? formatApiErrorMessage(json.message)
        : response.statusText || fallbackMessage;
    throw new ApiRequestError(response.status, message);
  }

  return json as ApiResponse<T>;
}

export async function login(
  input: LoginInput,
): Promise<ApiResponse<AuthSession>> {
  const response = await authFetch(AUTH_ROUTES.login, {
    method: "POST",
    body: JSON.stringify(input),
  });
  return parseAuthResponse<AuthSession>(response, "Sign in failed");
}

export async function register(
  input: RegisterInput,
): Promise<ApiResponse<AuthSession>> {
  const response = await authFetch(AUTH_ROUTES.register, {
    method: "POST",
    body: JSON.stringify(input),
  });
  return parseAuthResponse<AuthSession>(response, "Sign up failed");
}

export async function refresh(): Promise<boolean> {
  const response = await authFetch(AUTH_ROUTES.refresh, { method: "POST" });
  return response.ok;
}

export async function logout(): Promise<void> {
  await authFetch(AUTH_ROUTES.logout, { method: "POST" });
}
