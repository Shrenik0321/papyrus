"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useActiveTab } from "@/lib/stores/workspace-store";
import { useNote } from "@/modules/research/hooks/useNotes";

export function NotesTab() {
  const activeTab = useActiveTab();
  const noteId = activeTab?.meta?.noteId as string | undefined;
  const { data: note, isLoading } = useNote(noteId);
  const [localEdits, setLocalEdits] = React.useState<Record<string, string>>({});
  const [mode, setMode] = React.useState<"edit" | "preview">("edit");

  const content =
    noteId && localEdits[noteId] !== undefined
      ? localEdits[noteId]
      : (note?.content ?? "");

  const setContent = (value: string) => {
    if (noteId) {
      setLocalEdits((prev) => ({ ...prev, [noteId]: value }));
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-prose space-y-4 p-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <div className="mx-auto max-w-prose px-8 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-heading text-2xl font-semibold">
            {note?.title ?? "Research Notes"}
          </h1>
          <div className="flex gap-1">
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
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[60vh] resize-none rounded-xl border-border font-mono text-sm leading-relaxed"
            placeholder="Start writing..."
          />
        ) : (
          <article className="markdown-preview space-y-4 text-sm leading-relaxed [&_h1]:font-heading [&_h1]:text-2xl [&_h1]:font-semibold [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-medium [&_li]:ml-4 [&_ol]:list-decimal [&_p]:text-foreground [&_strong]:font-semibold [&_ul]:list-disc">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </article>
        )}
      </div>
    </div>
  );
}
