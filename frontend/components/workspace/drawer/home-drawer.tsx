"use client";

import { useWorkspaceStore } from "@/lib/stores/workspace-store";
import {
  HOME_RECOMMENDATIONS,
  HOME_SUGGESTED_ACTIONS,
} from "@/lib/mock/recommendations";
import { getPaperById } from "@/lib/mock/papers";
import { getNoteById } from "@/lib/mock/notes";

export function HomeDrawer() {
  const openPaperTab = useWorkspaceStore((s) => s.openPaperTab);
  const openNoteTab = useWorkspaceStore((s) => s.openNoteTab);
  const openNoveltyTab = useWorkspaceStore((s) => s.openNoveltyTab);
  const openNavTab = useWorkspaceStore((s) => s.openNavTab);

  const handleRecClick = (rec: (typeof HOME_RECOMMENDATIONS)[0]) => {
    if (rec.type === "paper" && rec.refId) {
      const paper = getPaperById(rec.refId);
      openPaperTab({ id: rec.refId, title: paper?.title ?? rec.title });
    } else if (rec.type === "note" && rec.refId) {
      const note = getNoteById(rec.refId);
      openNoteTab({ id: rec.refId, title: note?.title ?? rec.title });
    } else if (rec.action === "novelty") {
      openNoveltyTab();
    }
  };

  const handleActionClick = (action: string | undefined) => {
    if (action === "library") openNavTab("library");
    else if (action === "novelty") openNoveltyTab();
  };

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Workspace Recommendations
        </h3>
        <div className="space-y-2">
          {HOME_RECOMMENDATIONS.map((rec) => (
            <button
              key={rec.id}
              type="button"
              onClick={() => handleRecClick(rec)}
              className="flex w-full flex-col rounded-xl border border-border bg-muted/30 p-3 text-left transition-colors hover:border-primary/20 hover:bg-accent/30"
            >
              <span className="text-sm font-medium">{rec.title}</span>
              <span className="mt-1 text-xs text-muted-foreground">
                {rec.description}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Suggested Actions
        </h3>
        <div className="space-y-2">
          {HOME_SUGGESTED_ACTIONS.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={() => handleActionClick(action.action)}
              className="flex w-full flex-col rounded-xl border border-border bg-muted/30 p-3 text-left transition-colors hover:border-primary/20 hover:bg-accent/30"
            >
              <span className="text-sm font-medium">{action.title}</span>
              <span className="mt-1 text-xs text-muted-foreground">
                {action.description}
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
