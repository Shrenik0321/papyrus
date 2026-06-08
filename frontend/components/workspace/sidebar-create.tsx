"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWorkspaceStore } from "@/lib/stores/workspace-store";
import { cn } from "@/lib/utils";
import { FilePenLineIcon, FileUpIcon, SquarePenIcon } from "lucide-react";
import { toast } from "sonner";
import { collapsedSidebarIconClass } from "./sidebar-nav-item";

interface SidebarCreateProps {
  collapsed?: boolean;
}

export function SidebarCreate({ collapsed }: SidebarCreateProps) {
  const openNoteTab = useWorkspaceStore((s) => s.openNoteTab);

  const handleUpload = () => {
    toast.info("Import coming soon");
  };

  const handleNote = () => {
    openNoteTab({ id: "note-4", title: "New Note" });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          title={collapsed ? "Create" : undefined}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-[10px] px-2.5 py-2 text-sm font-medium transition-colors duration-150",
            "text-foreground hover:bg-muted/60",
            "data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
            collapsed && collapsedSidebarIconClass,
          )}
        >
          <SquarePenIcon className="size-4 shrink-0" />
          {!collapsed && <span className="flex-1 text-left">Create</span>}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side={collapsed ? "right" : "bottom"}
        align="start"
        className="w-52 rounded-xl"
      >
        <DropdownMenuItem onClick={handleNote}>
          <FilePenLineIcon />
          Note
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleUpload}>
          <FileUpIcon />
          File upload
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
