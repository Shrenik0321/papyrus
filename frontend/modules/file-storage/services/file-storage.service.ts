import { unwrapApiResponse } from "@/lib/types";
import * as fileStorageApi from "../api/file-storage.api";
import type { UploadFileResult } from "../types/file-storage.type";

export async function uploadFile(file: File): Promise<UploadFileResult> {
  const response = await fileStorageApi.uploadFile(file);
  return unwrapApiResponse(response);
}

export async function deleteFile(fileUrl: string): Promise<void> {
  if (!fileUrl.trim()) {
    throw new Error("Invalid file URL");
  }
  await fileStorageApi.deleteFile(fileUrl);
}
