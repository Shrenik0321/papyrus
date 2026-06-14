"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useWorkspaceStore } from "@/lib/stores/workspace-store";
import { useWorkspaces } from "@/modules/workspace/hooks/useWorkspace";
import { parseWorkspaceIdFromPath } from "@/modules/workspace/utils";

export function useWorkspaceRouteSync() {
  const pathname = usePathname();
  const router = useRouter();
  const resetWorkspaceUiForRoute = useWorkspaceStore(
    (s) => s.resetWorkspaceUiForRoute,
  );
  const { data: workspaces = [], isLoading } = useWorkspaces();
  const lastAppliedIdRef = useRef<string | null | undefined>(undefined);

  const workspaceId = parseWorkspaceIdFromPath(pathname);

  useEffect(() => {
    if (lastAppliedIdRef.current === workspaceId) return;
    lastAppliedIdRef.current = workspaceId;
    resetWorkspaceUiForRoute(workspaceId);
  }, [workspaceId, resetWorkspaceUiForRoute]);

  useEffect(() => {
    if (isLoading || !workspaceId) return;

    const exists = workspaces.some((w) => w.id === workspaceId);
    if (!exists) {
      router.replace("/");
    }
  }, [workspaceId, workspaces, isLoading, router]);
}
