"use client";

import { useWorkspaceStore } from "@/lib/stores/workspace-store";
import {
  inferLibraryTypeFromFilename,
  stripFileExtension,
} from "@/lib/utils";
import { useUploadFile } from "@/modules/file-storage/hooks/useFileStorage";
import type { FileUploadSuccessPayload } from "@/modules/file-storage/types/file-storage.type";
import { useCallback } from "react";
import { toast } from "sonner";
import { useAddLibrary } from "./useLibrary";

const NEW_NOTE_TEMPLATE = "# New Note\n\n";
const NEW_NOTE_FILENAME = "New Note.md";

export function useLibraryUploadActions(workspaceId: string) {
  const uploadMutation = useUploadFile();
  const addMutation = useAddLibrary();
  const openNoteTab = useWorkspaceStore((s) => s.openNoteTab);

  const handleUploadSuccess = useCallback(
    (payload: FileUploadSuccessPayload) => {
      if (!workspaceId) return;

      const { result, file } = payload;

      addMutation.mutate(
        {
          workspaceId,
          fileUrl: result.fileUrl,
          type: inferLibraryTypeFromFilename(file.name),
          title: stripFileExtension(file.name),
        },
        {
          onSuccess: () => {
            toast.success(`Added ${file.name} to library`);
          },
          onError: (error) => {
            toast.error(error.message || "Failed to add to library");
          },
        },
      );
    },
    [addMutation, workspaceId],
  );

  const handleCreateNote = useCallback(async () => {
    if (!workspaceId) {
      toast.error("No workspace selected");
      return;
    }

    const file = new File([NEW_NOTE_TEMPLATE], NEW_NOTE_FILENAME, {
      type: "text/markdown",
    });

    try {
      const result = await uploadMutation.mutateAsync(file);
      const item = await addMutation.mutateAsync({
        workspaceId,
        fileUrl: result.fileUrl,
        type: "note",
        title: "New Note",
      });
      openNoteTab({ id: item.id, title: item.title });
      toast.success("Note created");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create note";
      toast.error(message);
    }
  }, [addMutation, openNoteTab, uploadMutation, workspaceId]);

  const isPending = uploadMutation.isPending || addMutation.isPending;

  return {
    handleUploadSuccess,
    handleCreateNote,
    isPending,
  };
}
