"use client";

import { useWorkspaceRouteSync } from "@/lib/hooks/use-workspace-route-sync";
import { ChatBar } from "./chat-bar";
import { LeftSidebar } from "./left-sidebar";
import { TabBar } from "./tab-bar";

export function PapyrusShell() {
  useWorkspaceRouteSync();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <LeftSidebar />
      <TabBar />
      <ChatBar />
    </div>
  );
}
