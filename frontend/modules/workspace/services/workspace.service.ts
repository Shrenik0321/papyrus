import { unwrapApiResponse } from "@/lib/types";
import * as workspaceApi from "../api/workspace.api";
import type { Workspace } from "../types/workspace.type";
import { assertValidId } from "@/lib/utils";

export async function getWorkspaces(): Promise<Workspace[]> {
  const response = await workspaceApi.fetchWorkspaces();
  return unwrapApiResponse(response);
}

export async function getWorkspace(id: string): Promise<Workspace> {
  assertValidId(id);
  const response = await workspaceApi.fetchWorkspaceById(id);
  return unwrapApiResponse(response);
}

export async function createWorkspace(title: string): Promise<Workspace> {
  const response = await workspaceApi.createWorkspace(title);
  return unwrapApiResponse(response);
}
