"use client";

import { FileUploadButton } from "@/components/file-upload-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, LIBRARY_FILE_ACCEPT } from "@/lib/utils";
import { useLibraryUploadActions } from "@/modules/library/hooks/useLibraryUploadActions";
import { useActiveWorkspaceId } from "@/modules/workspace/hooks/useWorkspace";
import {
  FilePenLineIcon,
  FileUpIcon,
  Loader2Icon,
  SquarePenIcon,
} from "lucide-react";
import * as React from "react";
import { collapsedSidebarIconClass } from "./sidebar-nav-item";

interface SidebarCreateProps {
  collapsed?: boolean;
}

export function SidebarCreate({ collapsed }: SidebarCreateProps) {
  const workspaceId = useActiveWorkspaceId() ?? "";
  const { handleUploadSuccess, handleCreateNote, isPending } =
    useLibraryUploadActions(workspaceId);

  const [uploadOpen, setUploadOpen] = React.useState(false);

  return (
    <>
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
          <DropdownMenuItem
            disabled={!workspaceId || isPending}
            onClick={() => void handleCreateNote()}
          >
            {isPending ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <FilePenLineIcon />
            )}
            Note
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={!workspaceId || isPending}
            onSelect={(event) => {
              event.preventDefault();
              setUploadOpen(true);
            }}
          >
            <FileUpIcon />
            File upload
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <FileUploadButton
        showTrigger={false}
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        accept={LIBRARY_FILE_ACCEPT}
        disabled={!workspaceId}
        onUploadSuccess={handleUploadSuccess}
      />
    </>
  );
}
