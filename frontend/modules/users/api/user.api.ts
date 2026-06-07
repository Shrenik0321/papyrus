import {
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
  apiPut,
} from "@/lib/utils";
import type { ApiResponse } from "@/lib/types";
import { USER_ROUTES } from "@/lib/routes";
import type {
  CreateUserInput,
  UpdateUserInput,
  User,
} from "../types/user.type";

export function fetchUsers(): Promise<ApiResponse<User[]>> {
  return apiGet<User[]>(USER_ROUTES.base);
}

export function fetchUserById(id: string): Promise<ApiResponse<User>> {
  return apiGet<User>(USER_ROUTES.byId(id));
}

export function createUser(
  input: CreateUserInput,
): Promise<ApiResponse<User>> {
  return apiPost<User>(USER_ROUTES.base, input);
}

export function replaceUser(
  id: string,
  input: CreateUserInput,
): Promise<ApiResponse<User>> {
  return apiPut<User>(USER_ROUTES.byId(id), input);
}

export function updateUser(
  id: string,
  input: UpdateUserInput,
): Promise<ApiResponse<User>> {
  return apiPatch<User>(USER_ROUTES.byId(id), input);
}

export function deleteUser(id: string): Promise<ApiResponse<null>> {
  return apiDelete<null>(USER_ROUTES.byId(id));
}
