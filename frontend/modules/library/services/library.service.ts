import { unwrapApiResponse } from "@/lib/types";
import { assertValidId } from "@/lib/utils";
import * as fileStorageService from "@/modules/file-storage/services/file-storage.service";
import * as libraryApi from "../api/library.api";
import type { AddLibraryItemInput, LibraryItem } from "../types/library.type";

export async function getLibraryByWorkspace(
  workspaceId: string,
): Promise<LibraryItem[]> {
  assertValidId(workspaceId);
  const response = await libraryApi.fetchLibraryByWorkspace(workspaceId);
  return unwrapApiResponse(response);
}

export async function addLibraryItem(
  input: AddLibraryItemInput,
): Promise<LibraryItem> {
  assertValidId(input.workspaceId);

  try {
    const response = await libraryApi.addLibraryItem(input);
    return unwrapApiResponse(response);
  } catch (error) {
    await fileStorageService.deleteFile(input.fileUrl).catch(() => {});
    throw error;
  }
}

export async function deleteLibraryItem(id: string): Promise<void> {
  assertValidId(id);
  await libraryApi.deleteLibraryItem(id);
}
