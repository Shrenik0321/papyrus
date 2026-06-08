"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWorkspaceStore } from "@/lib/stores/workspace-store";
import { cn } from "@/lib/utils";
import {
  BarChart3Icon,
  HomeIcon,
  LibraryIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  SearchIcon,
  SettingsIcon,
} from "lucide-react";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { SidebarProfile } from "./sidebar-profile";
import { SidebarCreate } from "./sidebar-create";
import { SidebarNavItem } from "./sidebar-nav-item";
import { SidebarChatsAccordion } from "./sidebar-chats-accordion";

interface LeftSidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

export function LeftSidebar({
  collapsed = false,
  onToggleCollapse,
  className,
}: LeftSidebarProps) {
  const activeTabId = useWorkspaceStore((s) => s.activeTabId);
  const tabs = useWorkspaceStore((s) => s.tabs);
  const openNavTab = useWorkspaceStore((s) => s.openNavTab);

  const activeTab = tabs.find((t) => t.id === activeTabId);
  const activeType = activeTab?.type;

  const isHomeActive = activeTabId === "home";
  const isLibraryActive =
    activeType === "library" || activeType === "paper" || activeType === "note";
  const isSearchActive = activeType === "search";

  const navItems = [
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
          <SidebarCreate collapsed={collapsed} />

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

          <SidebarChatsAccordion collapsed={collapsed} />
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
