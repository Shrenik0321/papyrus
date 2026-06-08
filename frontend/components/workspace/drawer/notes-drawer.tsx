"use client";

import {
  LinkedKnowledgeCard,
  RefCard,
  StickyNoteIcon,
  FileTextIcon,
} from "@/components/workspace/shared/linked-knowledge-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useActiveTab, useWorkspaceStore } from "@/lib/stores/workspace-store";
import { useLinkedKnowledge } from "@/modules/research/hooks/useLinkedKnowledge";

export function NotesDrawer() {
  const activeTab = useActiveTab();
  const noteId = activeTab?.meta?.noteId as string | undefined;
  const { data: knowledge, isLoading } = useLinkedKnowledge(noteId);
  const openPaperTab = useWorkspaceStore((s) => s.openPaperTab);
  const openNoteTab = useWorkspaceStore((s) => s.openNoteTab);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!knowledge) return null;

  return (
    <div className="space-y-5">
      <LinkedKnowledgeCard
        title="Linked Knowledge"
        items={knowledge.linkedItems.map((item) => ({
          label: `${item.type}: ${item.title}`,
        }))}
      />

      <section className="space-y-2">
        <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Connected Papers
        </h4>
        <div className="space-y-1.5">
          {knowledge.connectedPapers.map((p) => (
            <RefCard
              key={p.id}
              title={p.title}
              icon={FileTextIcon}
              onClick={() => openPaperTab({ id: p.id, title: p.title })}
            />
          ))}
          {knowledge.connectedPapers.length === 0 && (
            <p className="text-sm text-muted-foreground">None yet</p>
          )}
        </div>
      </section>

      <section className="space-y-2">
        <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Related Notes
        </h4>
        <div className="space-y-1.5">
          {knowledge.relatedNotes.map((n) => (
            <RefCard
              key={n.id}
              title={n.title}
              icon={StickyNoteIcon}
              onClick={() => openNoteTab({ id: n.id, title: n.title })}
            />
          ))}
        </div>
      </section>

      <LinkedKnowledgeCard
        title="Research Questions"
        items={knowledge.researchQuestions.map((q) => ({ label: q }))}
      />

      <LinkedKnowledgeCard
        title="Research Ideas"
        items={knowledge.researchIdeas.map((i) => ({ label: i }))}
      />
    </div>
  );
}
