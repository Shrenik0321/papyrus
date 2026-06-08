import { useQuery } from "@tanstack/react-query";
import { mockDelay } from "@/lib/mock/delay";
import { MOCK_PAPERS, getPaperById } from "@/lib/mock/papers";

export const papersKey = ["papers"] as const;
export const paperKey = (id: string) => ["papers", id] as const;

export function usePapers() {
  return useQuery({
    queryKey: papersKey,
    queryFn: async () => {
      await mockDelay();
      return MOCK_PAPERS;
    },
    staleTime: Infinity,
  });
}

export function usePaper(id: string | undefined) {
  return useQuery({
    queryKey: paperKey(id ?? ""),
    queryFn: async () => {
      await mockDelay(400);
      const paper = getPaperById(id!);
      if (!paper) throw new Error("Paper not found");
      return paper;
    },
    enabled: !!id,
    staleTime: Infinity,
  });
}
