"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { WORKSPACE_ROUTES } from "@/lib/routes";
import { useWorkspaceStore } from "@/lib/stores/workspace-store";
import {
  deserializeWorkspaceTabs,
  getDefaultWorkspaceTabState,
  serializeWorkspaceTabs,
} from "@/lib/workspace-url";
import { useWorkspaces } from "@/modules/workspace/hooks/useWorkspace";
import { parseWorkspaceIdFromPath } from "@/modules/workspace/utils";

export function useWorkspaceRouteSync() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabs = useWorkspaceStore((state) => state.tabs);
  const activeTabId = useWorkspaceStore((state) => state.activeTabId);
  const hydrateWorkspaceTabs = useWorkspaceStore(
    (state) => state.hydrateWorkspaceTabs,
  );
  const resetWorkspaceUiForRoute = useWorkspaceStore(
    (state) => state.resetWorkspaceUiForRoute,
  );
  const { data: workspaces = [], isLoading } = useWorkspaces();
  const isHydratingFromUrlRef = useRef(false);
  const lastHydratedKeyRef = useRef<string | null>(null);

  const workspaceId = parseWorkspaceIdFromPath(pathname);
  const tabsParam = searchParams.get("tabs");
  const activeParam = searchParams.get("active");
  const urlKey = `${pathname}?tabs=${tabsParam ?? ""}&active=${activeParam ?? ""}`;

  useEffect(() => {
    if (workspaceId === null) {
      if (lastHydratedKeyRef.current === urlKey) {
        return;
      }

      lastHydratedKeyRef.current = urlKey;
      resetWorkspaceUiForRoute(null);
      return;
    }

    if (lastHydratedKeyRef.current === urlKey) {
      return;
    }

    lastHydratedKeyRef.current = urlKey;
    isHydratingFromUrlRef.current = true;

    const deserialized = deserializeWorkspaceTabs(tabsParam, activeParam);
    if (deserialized) {
      hydrateWorkspaceTabs(deserialized.tabs, deserialized.activeTabId);
    } else {
      const defaults = getDefaultWorkspaceTabState();
      hydrateWorkspaceTabs(defaults.tabs, defaults.activeTabId);
    }

    queueMicrotask(() => {
      isHydratingFromUrlRef.current = false;
    });
  }, [
    workspaceId,
    urlKey,
    tabsParam,
    activeParam,
    hydrateWorkspaceTabs,
    resetWorkspaceUiForRoute,
  ]);

  useEffect(() => {
    if (!workspaceId || isHydratingFromUrlRef.current) {
      return;
    }

    const { tabs: tabsValue, active } = serializeWorkspaceTabs(tabs, activeTabId);

    if (tabsParam === tabsValue && activeParam === active) {
      return;
    }

    router.replace(WORKSPACE_ROUTES.byIdWithTabs(workspaceId, tabsValue, active));
  }, [
    workspaceId,
    tabs,
    activeTabId,
    tabsParam,
    activeParam,
    router,
  ]);

  useEffect(() => {
    if (isLoading || !workspaceId) {
      return;
    }

    const exists = workspaces.some((workspace) => workspace.id === workspaceId);
    if (!exists) {
      router.replace("/");
    }
  }, [workspaceId, workspaces, isLoading, router]);
}
