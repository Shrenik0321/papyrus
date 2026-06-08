import { useQuery } from "@tanstack/react-query";
import { mockDelay } from "@/lib/mock/delay";
import { MOCK_NOTES, getNoteById } from "@/lib/mock/notes";

export const notesKey = ["notes"] as const;
export const noteKey = (id: string) => ["notes", id] as const;

export function useNotes() {
  return useQuery({
    queryKey: notesKey,
    queryFn: async () => {
      await mockDelay();
      return MOCK_NOTES;
    },
    staleTime: Infinity,
  });
}

export function useNote(id: string | undefined) {
  return useQuery({
    queryKey: noteKey(id ?? ""),
    queryFn: async () => {
      await mockDelay(400);
      const note = getNoteById(id!);
      if (!note) throw new Error("Note not found");
      return note;
    },
    enabled: !!id,
    staleTime: Infinity,
  });
}
