import { useQuery } from "@tanstack/react-query";
import { mockDelay } from "@/lib/mock/delay";
import { getPaperInsights } from "@/lib/mock/insights";

export const insightsKey = (paperId: string) => ["insights", paperId] as const;

export function usePaperInsights(paperId: string | undefined) {
  return useQuery({
    queryKey: insightsKey(paperId ?? ""),
    queryFn: async () => {
      await mockDelay(700);
      return getPaperInsights(paperId!);
    },
    enabled: !!paperId,
    staleTime: Infinity,
  });
}
