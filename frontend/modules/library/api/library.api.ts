import { apiDelete, apiGet, apiPost } from "@/lib/utils";
import type { ApiResponse } from "@/lib/types";
import { LIBRARY_ROUTES } from "@/lib/routes";
import type { AddLibraryItemInput, LibraryItem } from "../types/library.type";

export function fetchLibraryByWorkspace(
  workspaceId: string,
): Promise<ApiResponse<LibraryItem[]>> {
  return apiGet<LibraryItem[]>(LIBRARY_ROUTES.byWorkspace(workspaceId));
}

export function addLibraryItem(
  input: AddLibraryItemInput,
): Promise<ApiResponse<LibraryItem>> {
  return apiPost<LibraryItem>(LIBRARY_ROUTES.create(), input);
}

export function deleteLibraryItem(id: string): Promise<ApiResponse<null>> {
  return apiDelete<null>(LIBRARY_ROUTES.byId(id));
}
