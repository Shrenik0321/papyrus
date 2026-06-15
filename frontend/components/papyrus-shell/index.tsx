"use client";

import { Suspense } from "react";
import { useWorkspaceRouteSync } from "@/lib/hooks/use-workspace-route-sync";
import { ChatBar } from "./chat-bar";
import { LeftSidebar } from "./left-sidebar";
import { TabBar } from "./tab-bar";

function WorkspaceRouteSync() {
  useWorkspaceRouteSync();
  return null;
}

export function PapyrusShell() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Suspense fallback={null}>
        <WorkspaceRouteSync />
      </Suspense>
      <LeftSidebar />
      <TabBar />
      <ChatBar />
    </div>
  );
}
