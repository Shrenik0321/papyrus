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
import { useWorkspaceStore } from "@/lib/stores/workspace-store";
import { usePapers } from "@/modules/research/hooks/usePapers";
import { useNotes } from "@/modules/research/hooks/useNotes";
import { getPaperInsights } from "@/lib/mock/insights";
import type { NoteType, Paper } from "@/lib/mock/types";
import { cn } from "@/lib/utils";
import {
  Columns3Icon,
  FileStackIcon,
  FileTextIcon,
  FlaskConicalIcon,
  LightbulbIcon,
  SlidersHorizontalIcon,
  StickyNoteIcon,
  UploadIcon,
  ArrowUpDownIcon,
  BookOpenIcon,
} from "lucide-react";
import { toast } from "sonner";

type ContentFilter = "all" | "documents" | "notes";

const NOTE_TYPE_CONFIG: Record<
  NoteType,
  { label: string; icon: typeof BookOpenIcon; badgeClass: string }
> = {
  literature: {
    label: "Literature",
    icon: BookOpenIcon,
    badgeClass:
      "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  },
  experiment: {
    label: "Experiment",
    icon: FlaskConicalIcon,
    badgeClass:
      "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  },
  idea: {
    label: "Idea",
    icon: LightbulbIcon,
    badgeClass:
      "border-violet-500/20 bg-violet-500/10 text-violet-700 dark:text-violet-300",
  },
  general: {
    label: "General",
    icon: StickyNoteIcon,
    badgeClass: "border-border bg-muted/60 text-muted-foreground",
  },
};

const NOTE_TYPE_FILTERS: { value: NoteType | "all"; label: string }[] = [
  { value: "all", label: "All notes" },
  { value: "literature", label: "Literature" },
  { value: "experiment", label: "Experiment" },
  { value: "idea", label: "Idea" },
  { value: "general", label: "General" },
];

const CONTENT_FILTERS: {
  value: ContentFilter;
  label: string;
  icon: typeof FileTextIcon;
}[] = [
  { value: "all", label: "All", icon: FileStackIcon },
  { value: "documents", label: "Papers", icon: FileTextIcon },
  { value: "notes", label: "Notes", icon: StickyNoteIcon },
];

interface LibraryRow {
  id: string;
  title: string;
  fileType: "Note" | "Document";
  noteType?: NoteType;
  authors: string | null;
  addedAt: string;
  fullText: string | null;
  viewedAt: string | null;
  summary: string | null;
  onOpen: () => void;
}

function formatAuthors(authors: string[]): string | null {
  if (authors.length === 0) return null;
  if (authors.length === 1) return authors[0];
  return `${authors[0]}, et al.`;
}

function formatAddedDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) return "Today";

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatViewedDate(iso: string | null): string | null {
  if (!iso) return null;

  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) {
    return minutes <= 1 ? "1 minute ago" : `${minutes} minutes ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return days === 1 ? "1 day ago" : `${days} days ago`;
  }

  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function buildLibraryRows(
  papers: Paper[] | undefined,
  notes:
    | { id: string; title: string; updatedAt: string; type: NoteType }[]
    | undefined,
  openPaperTab: (paper: { id: string; title: string }) => void,
  openNoteTab: (note: { id: string; title: string }) => void,
): LibraryRow[] {
  const noteRows: LibraryRow[] =
    notes
      ?.filter((n) => n.id !== "note-4")
      .map((note) => ({
        id: note.id,
        title: note.title,
        fileType: "Note" as const,
        noteType: note.type,
        authors: null,
        addedAt: note.updatedAt,
        fullText: null,
        viewedAt: note.updatedAt,
        summary: null,
        onOpen: () => openNoteTab({ id: note.id, title: note.title }),
      })) ?? [];

  const paperRows: LibraryRow[] =
    papers?.map((paper) => ({
      id: paper.id,
      title: paper.title,
      fileType: "Document" as const,
      authors: formatAuthors(paper.authors),
      addedAt: paper.addedAt,
      fullText:
        paper.availability === "open_access" ||
        paper.availability === "preprint"
          ? "Available"
          : null,
      viewedAt: paper.lastViewedAt,
      summary: getPaperInsights(paper.id).summary,
      onOpen: () => openPaperTab({ id: paper.id, title: paper.title }),
    })) ?? [];

  return [...noteRows, ...paperRows].sort(
    (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime(),
  );
}

function filterRows(
  rows: LibraryRow[],
  contentFilter: ContentFilter,
  noteTypeFilter: NoteType | "all",
): LibraryRow[] {
  return rows.filter((row) => {
    if (contentFilter === "documents" && row.fileType !== "Document") {
      return false;
    }
    if (contentFilter === "notes" && row.fileType !== "Note") {
      return false;
    }
    if (
      row.fileType === "Note" &&
      noteTypeFilter !== "all" &&
      row.noteType !== noteTypeFilter
    ) {
      return false;
    }
    return true;
  });
}

function SegmentButton({
  active,
  onClick,
  children,
  className,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-sm font-medium transition-colors duration-150",
        active
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function LibraryTab() {
  const { data: papers, isLoading: papersLoading } = usePapers();
  const { data: notes, isLoading: notesLoading } = useNotes();
  const openPaperTab = useWorkspaceStore((s) => s.openPaperTab);
  const openNoteTab = useWorkspaceStore((s) => s.openNoteTab);

  const [contentFilter, setContentFilter] = React.useState<ContentFilter>("all");
  const [noteTypeFilter, setNoteTypeFilter] = React.useState<NoteType | "all">(
    "all",
  );

  const isLoading = papersLoading || notesLoading;
  const allRows = React.useMemo(
    () => buildLibraryRows(papers, notes, openPaperTab, openNoteTab),
    [papers, notes, openPaperTab, openNoteTab],
  );
  const rows = React.useMemo(
    () => filterRows(allRows, contentFilter, noteTypeFilter),
    [allRows, contentFilter, noteTypeFilter],
  );

  const documentCount = allRows.filter((r) => r.fileType === "Document").length;
  const noteCount = allRows.filter((r) => r.fileType === "Note").length;
  const showPaperColumns = contentFilter !== "notes";

  const handleImport = () => {
    toast.info("Import coming soon");
  };

  const handleToolbarAction = (action: string) => {
    toast.info(`${action} coming soon`);
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
            Import papers to begin organizing your literature and insights.
          </p>
          <Button className="mt-6 rounded-[10px]" onClick={handleImport}>
            <UploadIcon className="size-4" />
            Upload First Paper
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-border px-6 py-3">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-[10px] text-muted-foreground"
            onClick={() => handleToolbarAction("Display")}
          >
            <Columns3Icon className="size-4" />
            Display
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-[10px] text-muted-foreground"
            onClick={() => handleToolbarAction("Sort")}
          >
            <ArrowUpDownIcon className="size-4" />
            Sort
          </Button>
        </div>

        <span className="text-sm text-muted-foreground">
          {rows.length} of {allRows.length} items
        </span>
      </div>

      <div className="shrink-0 space-y-3 border-b border-border px-6 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-[10px] bg-muted/60 p-0.5">
            {CONTENT_FILTERS.map(({ value, label, icon: Icon }) => (
              <SegmentButton
                key={value}
                active={contentFilter === value}
                onClick={() => {
                  setContentFilter(value);
                  if (value === "documents") {
                    setNoteTypeFilter("all");
                  }
                }}
              >
                <Icon className="size-3.5" />
                {label}
                <span className="text-xs text-muted-foreground">
                  {value === "all"
                    ? allRows.length
                    : value === "documents"
                      ? documentCount
                      : noteCount}
                </span>
              </SegmentButton>
            ))}
          </div>

          {contentFilter !== "documents" && (
            <div className="flex flex-wrap items-center gap-1.5">
              <SlidersHorizontalIcon className="size-3.5 text-muted-foreground" />
              {NOTE_TYPE_FILTERS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setNoteTypeFilter(value)}
                  className={cn(
                    "rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors duration-150",
                    noteTypeFilter === value
                      ? "border-foreground/20 bg-foreground/5 text-foreground"
                      : "border-transparent bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        {rows.length === 0 ? (
          <div className="flex h-full items-center justify-center px-8">
            <div className="text-center">
              <p className="text-sm font-medium">No items match this filter</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try a different content or note type filter.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 rounded-[10px]"
                onClick={() => {
                  setContentFilter("all");
                  setNoteTypeFilter("all");
                }}
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
                {showPaperColumns && (
                  <TableHead className="min-w-[120px]">Authors</TableHead>
                )}
                <TableHead className="min-w-[100px]">Added</TableHead>
                {showPaperColumns && (
                  <TableHead className="min-w-[90px]">Full text</TableHead>
                )}
                <TableHead className="min-w-[100px]">Viewed</TableHead>
                <TableHead className="min-w-[110px]">Type</TableHead>
                {showPaperColumns && (
                  <TableHead className="min-w-[240px] pr-6">Summary</TableHead>
                )}
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
                      <TableCell colSpan={showPaperColumns ? 7 : 4}>
                        <Skeleton className="h-4 w-full max-w-md" />
                      </TableCell>
                    </TableRow>
                  ))
                : rows.map((row) => {
                    const noteConfig = row.noteType
                      ? NOTE_TYPE_CONFIG[row.noteType]
                      : null;
                    const RowIcon =
                      row.fileType === "Note"
                        ? (noteConfig?.icon ?? StickyNoteIcon)
                        : FileTextIcon;

                    return (
                      <TableRow
                        key={row.id}
                        className={cn(
                          "cursor-pointer",
                          row.fileType === "Note" && "bg-muted/20",
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
                              row.fileType === "Note"
                                ? "bg-muted"
                                : "bg-primary/5",
                            )}
                          >
                            <RowIcon
                              className={cn(
                                "size-3.5",
                                row.fileType === "Note"
                                  ? "text-muted-foreground"
                                  : "text-primary",
                              )}
                            />
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[280px] truncate font-medium">
                          {row.title}
                        </TableCell>
                        {showPaperColumns && (
                          <TableCell className="text-muted-foreground">
                            {row.authors ?? "—"}
                          </TableCell>
                        )}
                        <TableCell className="text-muted-foreground">
                          {formatAddedDate(row.addedAt)}
                        </TableCell>
                        {showPaperColumns && (
                          <TableCell className="text-muted-foreground">
                            {row.fullText ?? "—"}
                          </TableCell>
                        )}
                        <TableCell className="text-muted-foreground">
                          {formatViewedDate(row.viewedAt) ?? "—"}
                        </TableCell>
                        <TableCell>
                          {row.fileType === "Document" ? (
                            <Badge
                              variant="outline"
                              className="rounded-md border-primary/20 bg-primary/5 font-normal text-primary"
                            >
                              Paper
                            </Badge>
                          ) : noteConfig ? (
                            <Badge
                              variant="outline"
                              className={cn(
                                "rounded-md font-normal",
                                noteConfig.badgeClass,
                              )}
                            >
                              {noteConfig.label}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        {showPaperColumns && (
                          <TableCell className="max-w-[320px] truncate pr-6 text-muted-foreground">
                            {row.summary ?? "—"}
                          </TableCell>
                        )}
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
