import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/utils";
import type { ApiResponse } from "@/lib/types";
import { LIBRARY_ROUTES } from "@/lib/routes";
import type {
  AddLibraryItemInput,
  LibraryContent,
  LibraryItem,
  UpdateLibraryContentInput,
} from "../types/library.type";

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

export function fetchLibraryContent(
  id: string,
): Promise<ApiResponse<LibraryContent>> {
  return apiGet<LibraryContent>(LIBRARY_ROUTES.content(id));
}

export function updateLibraryContent(
  id: string,
  input: UpdateLibraryContentInput,
): Promise<ApiResponse<LibraryItem>> {
  return apiPut<LibraryItem>(LIBRARY_ROUTES.content(id), input);
}
