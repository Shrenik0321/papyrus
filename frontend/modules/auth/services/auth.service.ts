import { unwrapApiResponse } from "@/lib/types";
import * as authApi from "../api/auth.api";
import type { AuthUser, LoginInput, RegisterInput } from "../types/auth.type";

export async function login(input: LoginInput): Promise<AuthUser> {
  const response = await authApi.login(input);
  return unwrapApiResponse(response).user;
}

export async function register(input: RegisterInput): Promise<AuthUser> {
  const response = await authApi.register(input);
  return unwrapApiResponse(response).user;
}

export async function refreshSession(): Promise<boolean> {
  return authApi.refresh();
}

export async function logout(): Promise<void> {
  await authApi.logout();
}
