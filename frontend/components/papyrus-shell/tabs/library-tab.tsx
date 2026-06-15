"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { FileUploadButton } from "@/components/file-upload-button";
import {
  LibraryContentFilterBar,
  type LibraryContentFilter,
} from "@/components/papyrus-shell/tabs/library-content-filter";
import { useWorkspaceStore } from "@/lib/stores/workspace-store";
import {
  cn,
  countByProperty,
  filterBySegment,
  formatDate,
  LIBRARY_FILE_ACCEPT,
  mapDefined,
} from "@/lib/utils";
import {
  useDeleteLibraryItem,
  useLibrary,
} from "@/modules/library/hooks/useLibrary";
import { useLibraryUploadActions } from "@/modules/library/hooks/useLibraryUploadActions";
import type { LibraryItem } from "@/modules/library/types/library.type";
import { useActiveWorkspaceId } from "@/modules/workspace/hooks/useWorkspace";
import {
  FileStackIcon,
  FileTextIcon,
  Loader2Icon,
  StickyNoteIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";

interface LibraryRow extends LibraryItem {
  onOpen: () => void;
}

export function LibraryTab() {
  const workspaceId = useActiveWorkspaceId() ?? "";
  const { data: items, isLoading } = useLibrary(workspaceId);

  const { handleUploadSuccess } = useLibraryUploadActions(workspaceId);
  const deleteMutation = useDeleteLibraryItem();
  const openPaperTab = useWorkspaceStore((s) => s.openPaperTab);
  const openNoteTab = useWorkspaceStore((s) => s.openNoteTab);

  const [contentFilter, setContentFilter] =
    React.useState<LibraryContentFilter>("all");

  const allRows = React.useMemo(
    () =>
      mapDefined(items, (item) => ({
        ...item,
        onOpen: () => {
          if (item.type === "paper") {
            openPaperTab({ id: item.id, title: item.title });
          } else {
            openNoteTab({ id: item.id, title: item.title });
          }
        },
      })),
    [items, openPaperTab, openNoteTab],
  );

  const rows = React.useMemo(
    () =>
      filterBySegment(allRows, contentFilter, "all", {
        papers: (row) => row.type === "paper",
        notes: (row) => row.type === "note",
      }),
    [allRows, contentFilter],
  );

  const paperCount = countByProperty(allRows, "type", "paper");
  const noteCount = countByProperty(allRows, "type", "note");

  const handleDelete = (id: string, title: string) => {
    if (!workspaceId) return;

    deleteMutation.mutate(
      { id, workspaceId },
      {
        onSuccess: () => {
          toast.success(`Deleted ${title}`);
        },
        onError: (error) => {
          toast.error(error.message || "Delete failed");
        },
      },
    );
  };

  if (!isLoading && allRows.length === 0) {
    return (
      <div className="flex h-full items-center justify-center px-8">
        <div className="flex max-w-md flex-col items-center rounded-xl border border-border bg-card p-10 text-center shadow-sm">
          <div className="mb-4 flex size-14 items-center justify-center rounded-xl bg-muted">
            <FileStackIcon className="size-7 text-muted-foreground" />
          </div>
          <h2 className="font-heading text-xl font-semibold">
            Start building your research library
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Upload papers and notes to begin organizing your research.
          </p>
          <FileUploadButton
            className="mt-6"
            label="Upload First File"
            accept={LIBRARY_FILE_ACCEPT}
            disabled={!workspaceId}
            onUploadSuccess={handleUploadSuccess}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <LibraryContentFilterBar
        value={contentFilter}
        onChange={setContentFilter}
        counts={{
          all: allRows.length,
          papers: paperCount,
          notes: noteCount,
        }}
        trailing={
          <FileUploadButton
            label="Upload"
            size="sm"
            accept={LIBRARY_FILE_ACCEPT}
            disabled={!workspaceId}
            onUploadSuccess={handleUploadSuccess}
          />
        }
      />

      <div className="min-h-0 flex-1 overflow-auto">
        {rows.length === 0 ? (
          <div className="flex h-full items-center justify-center px-8">
            <div className="text-center">
              <p className="text-sm font-medium">No items match this filter</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try a different filter.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 rounded-[10px]"
                onClick={() => setContentFilter("all")}
              >
                Clear filters
              </Button>
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-10 pl-6">
                  <input
                    type="checkbox"
                    className="size-3.5 rounded border-border"
                  />
                </TableHead>
                <TableHead className="w-10" />
                <TableHead className="min-w-[200px]">Title</TableHead>
                <TableHead className="min-w-[100px]">Added</TableHead>
                <TableHead className="min-w-[100px]">Updated</TableHead>
                <TableHead className="min-w-[110px]">Type</TableHead>
                <TableHead className="w-10 pr-6" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="pl-6">
                        <Skeleton className="size-3.5" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="size-4" />
                      </TableCell>
                      <TableCell colSpan={5}>
                        <Skeleton className="h-4 w-full max-w-md" />
                      </TableCell>
                    </TableRow>
                  ))
                : rows.map((row) => {
                    const isNote = row.type === "note";
                    const RowIcon = isNote ? StickyNoteIcon : FileTextIcon;
                    const isDeleting =
                      deleteMutation.isPending &&
                      deleteMutation.variables?.id === row.id;

                    return (
                      <TableRow
                        key={row.id}
                        className={cn(
                          "cursor-pointer",
                          isNote && "bg-muted/20",
                        )}
                        onClick={row.onOpen}
                      >
                        <TableCell
                          className="pl-6"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            className="size-3.5 rounded border-border"
                          />
                        </TableCell>
                        <TableCell>
                          <div
                            className={cn(
                              "flex size-7 items-center justify-center rounded-md",
                              isNote ? "bg-muted" : "bg-primary/5",
                            )}
                          >
                            <RowIcon
                              className={cn(
                                "size-3.5",
                                isNote
                                  ? "text-muted-foreground"
                                  : "text-primary",
                              )}
                            />
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[280px] truncate font-medium">
                          {row.title}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(row.createdAt)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(row.updatedAt)}
                        </TableCell>
                        <TableCell>
                          {isNote ? (
                            <Badge
                              variant="outline"
                              className="rounded-md border-border bg-muted/60 font-normal text-muted-foreground"
                            >
                              Note
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="rounded-md border-primary/20 bg-primary/5 font-normal text-primary"
                            >
                              Paper
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell
                          className="pr-6"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 rounded-[8px] text-muted-foreground hover:text-destructive"
                            disabled={isDeleting}
                            onClick={() => handleDelete(row.id, row.title)}
                            aria-label={`Delete ${row.title}`}
                          >
                            {isDeleting ? (
                              <Loader2Icon className="size-4 animate-spin" />
                            ) : (
                              <Trash2Icon className="size-4" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
