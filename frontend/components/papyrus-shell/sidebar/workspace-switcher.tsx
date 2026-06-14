"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useActiveWorkspace } from "@/modules/workspace/hooks/useWorkspace";
import { ChevronsUpDownIcon, HomeIcon, LayersIcon, PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkspaceSwitcherProps {
  collapsed?: boolean;
}

export function WorkspaceSwitcher({ collapsed }: WorkspaceSwitcherProps) {
  const {
    workspaces,
    activeWorkspace,
    selectWorkspace,
    isLoading,
  } = useActiveWorkspace();

  if (isLoading) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-[10px]",
          collapsed ? "size-9 justify-center" : "w-full p-2",
        )}
      >
        <Skeleton className={cn(collapsed ? "size-7 rounded-lg" : "size-8 rounded-lg")} />
        {!collapsed && (
          <div className="grid min-w-0 flex-1 gap-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        )}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex items-center gap-2 rounded-[10px] text-left transition-colors duration-200 outline-none",
          collapsed
            ? "size-9 justify-center hover:bg-muted/60"
            : "w-full border border-border bg-card p-2 hover:bg-muted/60",
        )}
      >
        <div
          className={cn(
            "flex shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground",
            collapsed ? "size-7" : "size-8",
          )}
        >
          <LayersIcon className={cn(collapsed ? "size-3.5" : "size-4")} />
        </div>
        {!collapsed && (
          <>
            <div className="grid min-w-0 flex-1 text-sm leading-tight">
              <span className="truncate font-medium">
                {activeWorkspace?.title ?? "Select workspace"}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                Workspace
              </span>
            </div>
            <ChevronsUpDownIcon className="size-4 shrink-0 text-muted-foreground" />
          </>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56 rounded-xl">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Workspaces
        </DropdownMenuLabel>
        {activeWorkspace && (
          <DropdownMenuItem
            onClick={() => selectWorkspace(null)}
            className="gap-2"
          >
            <HomeIcon className="size-4 text-muted-foreground" />
            <span>All workspaces</span>
          </DropdownMenuItem>
        )}
        {activeWorkspace && <DropdownMenuSeparator />}
        {workspaces.map((workspace, index) => {
          const isActive = workspace.id === activeWorkspace?.id;

          return (
            <DropdownMenuItem
              key={workspace.id}
              onClick={() => selectWorkspace(workspace.id)}
              className={cn(
                "gap-2",
                isActive &&
                  "bg-accent font-medium text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              )}
            >
              <LayersIcon
                className={cn(
                  "size-4",
                  isActive ? "text-accent-foreground" : "text-muted-foreground",
                )}
              />
              <span>{workspace.title}</span>
              <DropdownMenuShortcut
                className={isActive ? "text-accent-foreground" : undefined}
              >
                ⌘{index + 1}
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 text-muted-foreground">
          <PlusIcon className="size-4" />
          New workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
