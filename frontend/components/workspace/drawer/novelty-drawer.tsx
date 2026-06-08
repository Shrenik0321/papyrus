"use client";

import { MOCK_NOVELTY_RESULT } from "@/lib/mock/novelty";
import { useWorkspaceStore } from "@/lib/stores/workspace-store";

export function NoveltyDrawer() {
  const openPaperTab = useWorkspaceStore((s) => s.openPaperTab);
  const result = MOCK_NOVELTY_RESULT;

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Reasoning
        </h3>
        <ol className="space-y-2">
          {result.reasoning.map((step, i) => (
            <li
              key={step}
              className="flex gap-2 text-sm leading-relaxed text-foreground"
            >
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-medium text-accent-foreground">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-2">
        <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          References
        </h3>
        <div className="space-y-1.5">
          {result.closestPapers.map((paper) => (
            <button
              key={paper.id}
              type="button"
              onClick={() =>
                openPaperTab({ id: paper.id, title: paper.title })
              }
              className="flex w-full flex-col rounded-xl border border-border bg-muted/30 p-3 text-left transition-colors hover:border-primary/20 hover:bg-accent/30"
            >
              <span className="text-sm font-medium">{paper.title}</span>
              <span className="mt-0.5 text-xs text-muted-foreground">
                {Math.round(paper.similarity * 100)}% similarity
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
