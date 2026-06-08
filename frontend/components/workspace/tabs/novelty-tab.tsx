"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { NoveltyScoreRing } from "@/components/workspace/shared/novelty-score-ring";
import { useNoveltyAnalysis } from "@/modules/research/hooks/useNovelty";
import type { NoveltyResult } from "@/lib/mock/types";
import { SparklesIcon } from "lucide-react";

type AnalysisStage = "idle" | "finding" | "generating" | "complete";

export function NoveltyTab() {
  const [idea, setIdea] = React.useState("");
  const [stage, setStage] = React.useState<AnalysisStage>("idle");
  const [result, setResult] = React.useState<NoveltyResult | null>(null);
  const mutation = useNoveltyAnalysis();

  const handleAnalyze = async () => {
    if (!idea.trim()) return;
    setResult(null);
    setStage("finding");
    await new Promise((r) => setTimeout(r, 800));
    setStage("generating");
    const { result: data } = await mutation.mutateAsync(idea);
    setStage("complete");
    setResult(data);
  };

  return (
    <div className="h-full overflow-auto">
      <div className="mx-auto max-w-4xl px-8 py-10">
        <div className="mb-8">
          <h1 className="font-heading text-2xl font-semibold">
            Novelty Analysis
          </h1>
          <p className="mt-1 text-muted-foreground">
            Validate whether your research idea is novel against your library.
          </p>
        </div>

        <div className="mb-8 space-y-3">
          <Textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Describe your research idea..."
            className="min-h-[140px] resize-none rounded-xl text-base"
            disabled={stage === "finding" || stage === "generating"}
          />
          <Button
            onClick={handleAnalyze}
            disabled={
              !idea.trim() ||
              mutation.isPending ||
              stage === "finding" ||
              stage === "generating"
            }
            className="rounded-[10px]"
          >
            <SparklesIcon className="size-4" />
            {mutation.isPending || stage === "finding" || stage === "generating"
              ? "Analyzing…"
              : "Analyze Novelty"}
          </Button>
        </div>

        {(stage === "finding" || stage === "generating") && (
          <div className="mb-8 space-y-3">
            <p className="text-sm text-muted-foreground">
              {stage === "finding"
                ? "Finding related work…"
                : "Generating novelty assessment…"}
            </p>
            <Skeleton className="h-40 w-full rounded-xl" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
            </div>
          </div>
        )}

        {stage === "complete" && result && (
          <div className="space-y-8">
            <div className="flex flex-col items-center rounded-xl border border-border bg-card py-10">
              <NoveltyScoreRing score={result.score} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <InsightCard title="Research Gaps" items={result.researchGaps} />
              <InsightCard
                title="Closest Papers"
                items={result.closestPapers.map(
                  (p) => `${p.title} (${Math.round(p.similarity * 100)}% similar)`,
                )}
              />
              <InsightCard
                title="Potential Contributions"
                items={result.potentialContributions}
              />
              <InsightCard
                title="Risks & Challenges"
                items={result.risksAndChallenges}
              />
            </div>
          </div>
        )}

        {stage === "idle" && !result && (
          <p className="text-center text-sm text-muted-foreground">
            Ask your workspace a question to begin
          </p>
        )}
      </div>
    </div>
  );
}

function InsightCard({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="mb-3 font-heading text-sm font-medium">{title}</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item}
            className="text-sm leading-relaxed text-muted-foreground"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
