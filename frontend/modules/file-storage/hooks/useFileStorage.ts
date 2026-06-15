"use client";

import { useMutation } from "@tanstack/react-query";
import * as fileStorageService from "../services/file-storage.service";

export const fileStorageKeys = {
  all: ["file-storage"] as const,
  uploads: () => [...fileStorageKeys.all, "upload"] as const,
};

export function useUploadFile() {
  return useMutation({
    mutationKey: fileStorageKeys.uploads(),
    mutationFn: (file: File) => fileStorageService.uploadFile(file),
  });
}

export function useDeleteFile() {
  return useMutation({
    mutationFn: (fileUrl: string) => fileStorageService.deleteFile(fileUrl),
  });
}
