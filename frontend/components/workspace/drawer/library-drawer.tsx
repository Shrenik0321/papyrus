"use client";

import { useWorkspaceStore } from "@/lib/stores/workspace-store";
import { LIBRARY_RECOMMENDATIONS } from "@/lib/mock/recommendations";
import { MOCK_PAPERS } from "@/lib/mock/papers";
import { getPaperById } from "@/lib/mock/papers";

export function LibraryDrawer() {
  const openPaperTab = useWorkspaceStore((s) => s.openPaperTab);

  const recentlyAdded = [...MOCK_PAPERS]
    .sort(
      (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime(),
    )
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Paper Recommendations
        </h3>
        <div className="space-y-2">
          {LIBRARY_RECOMMENDATIONS.map((rec) => (
            <button
              key={rec.id}
              type="button"
              onClick={() => {
                if (rec.refId) {
                  const paper = getPaperById(rec.refId);
                  openPaperTab({
                    id: rec.refId,
                    title: paper?.title ?? rec.title,
                  });
                }
              }}
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
          Recently Added
        </h3>
        <div className="space-y-2">
          {recentlyAdded.map((paper) => (
            <button
              key={paper.id}
              type="button"
              onClick={() => openPaperTab({ id: paper.id, title: paper.title })}
              className="flex w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-left text-sm transition-colors hover:border-primary/20 hover:bg-accent/30"
            >
              <span className="line-clamp-2">{paper.title}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
