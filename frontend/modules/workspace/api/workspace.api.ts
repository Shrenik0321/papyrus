import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from "@/lib/utils";
import type { ApiResponse } from "@/lib/types";
import { WORKSPACE_ROUTES } from "@/lib/routes";
import { Workspace } from "../types/workspace.type";

export function fetchWorkspaces(): Promise<ApiResponse<Workspace[]>> {
  return apiGet<Workspace[]>(WORKSPACE_ROUTES.base);
}

export function fetchWorkspaceById(
  id: string,
): Promise<ApiResponse<Workspace>> {
  return apiGet<Workspace>(WORKSPACE_ROUTES.byId(id));
}

export function createWorkspace(
  title: string,
): Promise<ApiResponse<Workspace>> {
  return apiPost<Workspace>(WORKSPACE_ROUTES.base, { title });
}
