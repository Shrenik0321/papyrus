import { apiDelete, apiUploadForm } from "@/lib/utils";
import type { ApiResponse } from "@/lib/types";
import { FILE_ROUTES } from "@/lib/routes";
import type { UploadFileResult } from "../types/file-storage.type";

export function uploadFile(file: File): Promise<ApiResponse<UploadFileResult>> {
  const formData = new FormData();
  formData.append("file", file);
  return apiUploadForm<UploadFileResult>(FILE_ROUTES.upload, formData);
}

export function deleteFile(fileUrl: string): Promise<ApiResponse<null>> {
  return apiDelete<null>(FILE_ROUTES.delete, { fileUrl });
}
