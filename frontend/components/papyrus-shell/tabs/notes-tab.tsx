"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useActiveTab } from "@/lib/stores/workspace-store";
import {
  useLibraryContent,
  useLibraryItem,
  useUpdateLibraryContent,
} from "@/modules/library/hooks/useLibrary";
import { useActiveWorkspaceId } from "@/modules/workspace/hooks/useWorkspace";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

export function NotesTab() {
  const activeTab = useActiveTab();
  const workspaceId = useActiveWorkspaceId() ?? "";
  const libraryItemId = activeTab?.meta?.libraryItemId as string | undefined;

  const { data: item, isLoading: metaLoading, isError: metaError } =
    useLibraryItem(workspaceId, libraryItemId);
  const {
    data: contentData,
    isLoading: contentLoading,
    isError: contentError,
  } = useLibraryContent(libraryItemId);
  const updateMutation = useUpdateLibraryContent();

  const [draft, setDraft] = React.useState("");
  const [savedContent, setSavedContent] = React.useState("");
  const [mode, setMode] = React.useState<"edit" | "preview">("edit");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (contentData) {
      setDraft(contentData.content);
      setSavedContent(contentData.content);
    }
  }, [contentData, libraryItemId]);

  const isDirty = draft !== savedContent;
  const isLoading = metaLoading || contentLoading;
  const isError = metaError || contentError;

  const handleSave = () => {
    if (!libraryItemId || !workspaceId || !isDirty) return;

    updateMutation.mutate(
      { id: libraryItemId, workspaceId, content: draft },
      {
        onSuccess: () => {
          setSavedContent(draft);
          toast.success("Note saved");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to save note");
        },
      },
    );
  };

  if (!libraryItemId) {
    return (
      <div className="flex h-full items-center justify-center px-8">
        <p className="text-sm text-muted-foreground">No note selected</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-prose space-y-4 p-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full items-center justify-center px-8">
        <p className="text-sm text-destructive">
          Failed to load note. It may have been deleted or is not a note item.
        </p>
      </div>
    );
  }

  const title = item?.title ?? activeTab?.title ?? "Note";

  const saveStatus = updateMutation.isPending
    ? "Saving…"
    : isDirty
      ? "Unsaved changes"
      : "Saved";

  return (
    <div className="h-full overflow-auto">
      <div className="mx-auto max-w-prose px-8 py-10">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="font-heading text-2xl font-semibold">{title}</h1>
          <div className="flex shrink-0 items-center gap-2">
            <span
              className={
                isDirty
                  ? "text-xs text-amber-600 dark:text-amber-500"
                  : "text-xs text-muted-foreground"
              }
            >
              {saveStatus}
            </span>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!isDirty || updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
            <Button
              size="sm"
              variant={mode === "edit" ? "default" : "ghost"}
              onClick={() => setMode("edit")}
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant={mode === "preview" ? "default" : "ghost"}
              onClick={() => setMode("preview")}
            >
              Preview
            </Button>
          </div>
        </div>

        {mode === "edit" ? (
          <Textarea
            ref={textareaRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="min-h-[60vh] resize-none rounded-xl border-border font-mono text-sm leading-relaxed"
            placeholder="Start writing..."
          />
        ) : (
          <article className="markdown-preview space-y-4 text-sm leading-relaxed [&_h1]:font-heading [&_h1]:text-2xl [&_h1]:font-semibold [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-medium [&_li]:ml-4 [&_ol]:list-decimal [&_p]:text-foreground [&_strong]:font-semibold [&_ul]:list-disc">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{draft}</ReactMarkdown>
          </article>
        )}
      </div>
    </div>
  );
}
