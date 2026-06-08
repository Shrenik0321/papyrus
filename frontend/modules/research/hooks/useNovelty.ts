import { useMutation } from "@tanstack/react-query";
import { mockDelay } from "@/lib/mock/delay";
import { MOCK_NOVELTY_RESULT } from "@/lib/mock/novelty";
import type { NoveltyResult } from "@/lib/mock/types";

export type NoveltyStage = "idle" | "finding" | "generating" | "complete";

export function useNoveltyAnalysis() {
  return useMutation({
    mutationFn: async (idea: string): Promise<{ result: NoveltyResult; stages: NoveltyStage[] }> => {
      void idea;
      await mockDelay(800);
      await mockDelay(1000);
      await mockDelay(600);
      return {
        result: MOCK_NOVELTY_RESULT,
        stages: ["finding", "generating", "complete"],
      };
    },
  });
}
