import { useQuery } from "@tanstack/react-query";
import { mockDelay } from "@/lib/mock/delay";
import { MOCK_ACTIVITIES } from "@/lib/mock/activities";

export const activitiesKey = ["activities"] as const;

export function useRecentActivity() {
  return useQuery({
    queryKey: activitiesKey,
    queryFn: async () => {
      await mockDelay(500);
      return MOCK_ACTIVITIES;
    },
    staleTime: Infinity,
  });
}
