"use client";

import { InsightSection } from "@/components/workspace/shared/insight-section";
import { Skeleton } from "@/components/ui/skeleton";
import { useActiveTab, useWorkspaceStore } from "@/lib/stores/workspace-store";
import { usePaperInsights } from "@/modules/research/hooks/useInsights";

export function PaperDrawer() {
  const activeTab = useActiveTab();
  const paperId = activeTab?.meta?.paperId as string | undefined;
  const { data: insights, isLoading } = usePaperInsights(paperId);
  const openPaperTab = useWorkspaceStore((s) => s.openPaperTab);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!insights) return null;

  return (
    <div className="space-y-1">
      <InsightSection title="Summary">{insights.summary}</InsightSection>
      <InsightSection title="Key Findings">
        <ul className="list-inside list-disc space-y-1">
          {insights.keyFindings.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </InsightSection>
      <InsightSection title="Methods">{insights.methods}</InsightSection>
      <InsightSection title="Future Work" defaultOpen={false}>
        <ul className="list-inside list-disc space-y-1">
          {insights.futureWork.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </InsightSection>
      <InsightSection title="Research Gaps" defaultOpen={false}>
        <ul className="list-inside list-disc space-y-1">
          {insights.researchGaps.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
      </InsightSection>
      <InsightSection title="Related Papers" defaultOpen={false}>
        <div className="space-y-1.5">
          {insights.relatedPapers.map((rp) => (
            <button
              key={rp.id}
              type="button"
              onClick={() => openPaperTab({ id: rp.id, title: rp.title })}
              className="block w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-left text-sm transition-colors hover:border-primary/20 hover:bg-accent/30"
            >
              {rp.title}
            </button>
          ))}
          {insights.relatedPapers.length === 0 && (
            <p className="text-sm text-muted-foreground">None identified</p>
          )}
        </div>
      </InsightSection>
    </div>
  );
}
