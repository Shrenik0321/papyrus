import { unwrapApiResponse } from "@/lib/types";
import * as userApi from "../api/user.api";
import type {
  CreateUserInput,
  UpdateUserInput,
  User,
} from "../types/user.type";

function assertValidId(id: string): void {
  if (!id.trim()) {
    throw new Error("Invalid user id");
  }
}

export async function getUsers(): Promise<User[]> {
  const response = await userApi.fetchUsers();
  return unwrapApiResponse(response);
}

export async function getUser(id: string): Promise<User> {
  assertValidId(id);
  const response = await userApi.fetchUserById(id);
  return unwrapApiResponse(response);
}

export async function createUser(input: CreateUserInput): Promise<User> {
  const response = await userApi.createUser(input);
  return unwrapApiResponse(response);
}

export async function updateUser(
  id: string,
  input: UpdateUserInput,
): Promise<User> {
  assertValidId(id);
  const response = await userApi.updateUser(id, input);
  return unwrapApiResponse(response);
}

export async function replaceUser(
  id: string,
  input: CreateUserInput,
): Promise<User> {
  assertValidId(id);
  const response = await userApi.replaceUser(id, input);
  return unwrapApiResponse(response);
}

export async function deleteUser(id: string): Promise<void> {
  assertValidId(id);
  await userApi.deleteUser(id);
}
