"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SidebarChatsAccordion } from "./sidebar/sidebar-chats-accordion";
import { SidebarCreate } from "./sidebar/sidebar-create";
import { SidebarNavItem } from "./sidebar/sidebar-nav-item";
import { SidebarProfile } from "./sidebar/sidebar-profile";
import { WorkspaceSwitcher } from "./sidebar/workspace-switcher";
import { useWorkspaceShortcuts } from "@/lib/hooks/use-workspace-shortcuts";
import { useWorkspaceStore } from "@/lib/stores/workspace-store";
import { useBreakpoint } from "@/lib/use-breakpoint";
import { cn } from "@/lib/utils";
import { useActiveWorkspace } from "@/modules/workspace/hooks/useWorkspace";
import {
  BarChart3Icon,
  HomeIcon,
  LibraryIcon,
  Loader2,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  SearchIcon,
  SettingsIcon,
} from "lucide-react";

interface SidebarPanelProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  hasWorkspace?: boolean;
  className?: string;
}

function SidebarPanel({
  collapsed = false,
  onToggleCollapse,
  hasWorkspace = false,
  className,
}: SidebarPanelProps) {
  const activeTabId = useWorkspaceStore((s) => s.activeTabId);
  const tabs = useWorkspaceStore((s) => s.tabs);
  const openNavTab = useWorkspaceStore((s) => s.openNavTab);
  const { selectWorkspace } = useActiveWorkspace();

  const activeTab = tabs.find((t) => t.id === activeTabId);
  const activeType = activeTab?.type;

  const isHomeActive = !hasWorkspace || activeTabId === "home";
  const isLibraryActive =
    activeType === "library" || activeType === "paper" || activeType === "note";
  const isSearchActive = activeType === "search";

  const navItems = hasWorkspace
    ? [
        {
          label: "Home",
          icon: HomeIcon,
          isActive: isHomeActive,
          onClick: () => openNavTab("home"),
        },
        {
          label: "Library",
          icon: LibraryIcon,
          isActive: isLibraryActive,
          onClick: () => openNavTab("library"),
        },
        {
          label: "Search",
          icon: SearchIcon,
          isActive: isSearchActive,
          onClick: () => openNavTab("search"),
        },
      ]
    : [
        {
          label: "Home",
          icon: HomeIcon,
          isActive: isHomeActive,
          onClick: () => selectWorkspace(null),
        },
      ];

  return (
    <aside
      className={cn(
        "flex h-full shrink-0 flex-col border-r border-border bg-sidebar transition-[width] duration-200 ease-out",
        collapsed ? "w-14" : "w-[280px]",
        className,
      )}
    >
      <div
        className={cn(
          "flex border-b border-border",
          collapsed
            ? "flex-col items-center gap-1 px-2 py-2"
            : "items-center gap-1.5 p-3",
        )}
      >
        <div className={cn("min-w-0", !collapsed && "flex-1")}>
          <WorkspaceSwitcher collapsed={collapsed} />
        </div>
        {onToggleCollapse && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onToggleCollapse}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "shrink-0 text-muted-foreground",
              collapsed && "size-9",
            )}
          >
            {collapsed ? (
              <PanelLeftOpenIcon className="size-4" />
            ) : (
              <PanelLeftCloseIcon className="size-4" />
            )}
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div
          className={cn(
            "min-w-0 overflow-hidden",
            collapsed ? "space-y-0.5 p-2" : "space-y-1 p-3",
          )}
        >
          {hasWorkspace && <SidebarCreate collapsed={collapsed} />}

          {navItems.map((item) => (
            <SidebarNavItem
              key={item.label}
              label={item.label}
              icon={item.icon}
              isActive={item.isActive}
              collapsed={collapsed}
              onClick={item.onClick}
            />
          ))}

          {hasWorkspace && <SidebarChatsAccordion collapsed={collapsed} />}
        </div>
      </ScrollArea>

      <div
        className={cn(
          "border-t border-border",
          collapsed ? "space-y-0.5 p-2" : "space-y-1 p-3",
        )}
      >
        {!collapsed && (
          <>
            <button
              type="button"
              title="Usage"
              className="flex w-full items-center gap-2.5 rounded-[10px] px-2.5 py-2 text-sm text-muted-foreground transition-colors duration-150 hover:bg-muted/60 hover:text-foreground"
            >
              <BarChart3Icon className="size-4 shrink-0" />
              <span>Usage</span>
            </button>
            <button
              type="button"
              title="Settings"
              className="flex w-full items-center gap-2.5 rounded-[10px] px-2.5 py-2 text-sm text-muted-foreground transition-colors duration-150 hover:bg-muted/60 hover:text-foreground"
            >
              <SettingsIcon className="size-4 shrink-0" />
              <span>Settings</span>
            </button>
          </>
        )}
        <SidebarProfile collapsed={collapsed} />
      </div>
    </aside>
  );
}

function ShellStatus({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      {children}
    </div>
  );
}

export function LeftSidebar() {
  useWorkspaceShortcuts();
  const { isMobile, isTablet } = useBreakpoint();

  const sidebarCollapsed = useWorkspaceStore((s) => s.sidebarCollapsed);
  const sidebarMobileOpen = useWorkspaceStore((s) => s.sidebarMobileOpen);
  const toggleSidebar = useWorkspaceStore((s) => s.toggleSidebar);
  const setSidebarMobileOpen = useWorkspaceStore((s) => s.setSidebarMobileOpen);

  const { activeWorkspaceId, isLoading, error } = useActiveWorkspace();

  const hasWorkspace = Boolean(activeWorkspaceId);

  if (error) {
    return (
      <ShellStatus>
        <p className="text-sm text-muted-foreground">
          Failed to load workspaces. Please try again.
        </p>
      </ShellStatus>
    );
  }

  if (isLoading) {
    return (
      <ShellStatus>
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </ShellStatus>
    );
  }

  return (
    <>
      {!isMobile && (
        <SidebarPanel
          hasWorkspace={hasWorkspace}
          collapsed={isTablet ? true : sidebarCollapsed}
          onToggleCollapse={isTablet ? undefined : toggleSidebar}
        />
      )}

      <Sheet open={sidebarMobileOpen} onOpenChange={setSidebarMobileOpen}>
        <SheetContent side="left" className="w-[280px] p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <SidebarPanel hasWorkspace={hasWorkspace} />
        </SheetContent>
      </Sheet>
    </>
  );
}
