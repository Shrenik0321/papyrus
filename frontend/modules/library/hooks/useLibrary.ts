"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import * as libraryService from "../services/library.service";
import type { AddLibraryItemInput } from "../types/library.type";

export const libraryKeys = {
  all: ["library"] as const,
  lists: () => [...libraryKeys.all, "list"] as const,
  byWorkspace: (workspaceId: string) =>
    [...libraryKeys.lists(), workspaceId] as const,
};

export function useLibrary(workspaceId: string) {
  return useQuery({
    queryKey: libraryKeys.byWorkspace(workspaceId),
    queryFn: () => libraryService.getLibraryByWorkspace(workspaceId),
    enabled: Boolean(workspaceId),
  });
}

export function useLibraryItem(
  workspaceId: string,
  itemId: string | undefined,
) {
  return useQuery({
    queryKey: libraryKeys.byWorkspace(workspaceId),
    queryFn: () => libraryService.getLibraryByWorkspace(workspaceId),
    enabled: Boolean(workspaceId) && Boolean(itemId),
    select: (items) => items.find((item) => item.id === itemId),
  });
}

export function useAddLibrary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AddLibraryItemInput) =>
      libraryService.addLibraryItem(input),
    onSuccess: (_data, { workspaceId }) => {
      queryClient.invalidateQueries({
        queryKey: libraryKeys.byWorkspace(workspaceId),
      });
    },
  });
}

export function useDeleteLibraryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
    }: {
      id: string;
      workspaceId: string;
    }) => libraryService.deleteLibraryItem(id),
    onSuccess: (_data, { workspaceId }) => {
      queryClient.invalidateQueries({
        queryKey: libraryKeys.byWorkspace(workspaceId),
      });
    },
  });
}
