"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronsUpDownIcon, LayersIcon, PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const workspaces = [
  { name: "AML Research", plan: "Personal" },
  { name: "Thesis Draft", plan: "Academic" },
  { name: "Lab Notes", plan: "Shared" },
];

interface WorkspaceSwitcherProps {
  collapsed?: boolean;
}

export function WorkspaceSwitcher({ collapsed }: WorkspaceSwitcherProps) {
  const [active, setActive] = React.useState(workspaces[0]);

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
              <span className="truncate font-medium">{active.name}</span>
              <span className="truncate text-xs text-muted-foreground">
                {active.plan}
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
        {workspaces.map((workspace, index) => (
          <DropdownMenuItem
            key={workspace.name}
            onClick={() => setActive(workspace)}
            className="gap-2"
          >
            <LayersIcon className="size-4 text-muted-foreground" />
            <span>{workspace.name}</span>
            <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 text-muted-foreground">
          <PlusIcon className="size-4" />
          New workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
