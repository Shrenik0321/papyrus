"use client";

import { useCallback, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { WORKSPACE_ROUTES } from "@/lib/routes";
import { parseWorkspaceIdFromPath } from "../utils";
import * as workspaceService from "../services/workspace.service";

export const workspaceKeys = {
  all: ["workspaces"] as const,
  lists: () => [...workspaceKeys.all, "list"] as const,
  detail: (id: string) => [...workspaceKeys.all, "detail", id] as const,
};

export function useWorkspaces() {
  return useQuery({
    queryKey: workspaceKeys.lists(),
    queryFn: workspaceService.getWorkspaces,
  });
}

export function useWorkspace(id: string) {
  return useQuery({
    queryKey: workspaceKeys.detail(id),
    queryFn: () => workspaceService.getWorkspace(id),
    enabled: Boolean(id),
  });
}

export function useActiveWorkspaceId(): string | null {
  const pathname = usePathname();
  return parseWorkspaceIdFromPath(pathname);
}

export function useActiveWorkspace() {
  const router = useRouter();
  const activeWorkspaceId = useActiveWorkspaceId();
  const { data: workspaces = [], isLoading, error } = useWorkspaces();

  const activeWorkspace =
    workspaces.find((w) => w.id === activeWorkspaceId) ?? null;

  const selectWorkspace = useCallback(
    (id: string | null) => {
      router.push(id ? WORKSPACE_ROUTES.byId(id) : "/");
    },
    [router],
  );

  return {
    workspaces,
    activeWorkspace,
    activeWorkspaceId,
    selectWorkspace,
    isLoading,
    error,
  };
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ title }: { title: string }) =>
      workspaceService.createWorkspace(title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() });
    },
  });
}

export function useCreateWorkspaceFlow() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { selectWorkspace } = useActiveWorkspace();
  const { mutateAsync: createWorkspace, isPending } = useCreateWorkspace();

  const handleCreateWorkspace = useCallback(
    async (title: string) => {
      try {
        const workspace = await createWorkspace({ title });
        toast.success("Workspace created");
        setDialogOpen(false);
        selectWorkspace(workspace.id);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to create workspace";
        toast.error(message);
      }
    },
    [createWorkspace, selectWorkspace],
  );

  return {
    dialogOpen,
    setDialogOpen,
    handleCreateWorkspace,
    isPending,
  };
}
