"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useWorkspaceShortcuts } from "@/lib/hooks/use-workspace-shortcuts";
import { useBreakpoint } from "@/lib/use-breakpoint";
import { useWorkspaceStore } from "@/lib/stores/workspace-store";
import { LeftSidebar } from "./left-sidebar";
import { TabBar } from "./tab-bar";
import { TabContent } from "./tab-content";
import { ContextDrawer } from "./context-drawer";
import { MenuIcon } from "lucide-react";

export function WorkspaceShell() {
  useWorkspaceShortcuts();
  const { isMobile, isTablet, isCompact } = useBreakpoint();

  const sidebarCollapsed = useWorkspaceStore((s) => s.sidebarCollapsed);
  const drawerOpen = useWorkspaceStore((s) => s.drawerOpen);
  const sidebarMobileOpen = useWorkspaceStore((s) => s.sidebarMobileOpen);
  const drawerMobileOpen = useWorkspaceStore((s) => s.drawerMobileOpen);
  const toggleSidebar = useWorkspaceStore((s) => s.toggleSidebar);
  const setSidebarMobileOpen = useWorkspaceStore((s) => s.setSidebarMobileOpen);
  const setDrawerMobileOpen = useWorkspaceStore((s) => s.setDrawerMobileOpen);
  const setDrawerOpen = useWorkspaceStore((s) => s.setDrawerOpen);

  const showInlineSidebar = !isMobile;
  const showInlineDrawer = !isCompact && drawerOpen;
  const showDrawerSheet = isCompact && drawerMobileOpen;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {showInlineSidebar && (
        <LeftSidebar
          collapsed={isTablet ? true : sidebarCollapsed}
          onToggleCollapse={isTablet ? undefined : toggleSidebar}
        />
      )}

      <Sheet open={sidebarMobileOpen} onOpenChange={setSidebarMobileOpen}>
        <SheetContent side="left" className="w-[280px] p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <LeftSidebar />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        {isCompact && (
          <div className="flex h-11 shrink-0 items-center gap-2 border-b border-border bg-card px-3">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setSidebarMobileOpen(true)}
              aria-label="Open sidebar"
            >
              <MenuIcon className="size-4" />
            </Button>
            <span className="font-heading text-sm font-medium">Papyrus</span>
          </div>
        )}

        <TabBar />

        <div className="flex min-h-0 flex-1">
          <main className="min-w-0 flex-1 overflow-auto bg-background">
            <TabContent />
          </main>

          {showInlineDrawer && <ContextDrawer />}
        </div>
      </div>

      <Sheet
        open={showDrawerSheet}
        onOpenChange={(open) => {
          setDrawerMobileOpen(open);
          if (!isCompact) setDrawerOpen(open);
        }}
      >
        <SheetContent
          side={isMobile ? "bottom" : "right"}
          className={isMobile ? "h-[70vh] rounded-t-2xl p-0" : "w-[380px] p-0"}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>AI Assistant</SheetTitle>
          </SheetHeader>
          <ContextDrawer className="w-full border-0" />
        </SheetContent>
      </Sheet>
    </div>
  );
}
