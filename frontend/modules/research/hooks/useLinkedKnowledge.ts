import { useQuery } from "@tanstack/react-query";
import { mockDelay } from "@/lib/mock/delay";
import { getLinkedKnowledge } from "@/lib/mock/linked-knowledge";

export const linkedKnowledgeKey = (noteId: string) =>
  ["linked-knowledge", noteId] as const;

export function useLinkedKnowledge(noteId: string | undefined) {
  return useQuery({
    queryKey: linkedKnowledgeKey(noteId ?? ""),
    queryFn: async () => {
      await mockDelay(500);
      return getLinkedKnowledge(noteId!);
    },
    enabled: !!noteId,
    staleTime: Infinity,
  });
}
