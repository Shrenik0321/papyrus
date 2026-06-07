"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/utils";
import { USER_ROUTES } from "@/lib/routes";
import type { User } from "../types/user.type";

export const currentUserKey = ["user", "me"] as const;

export function useCurrentUser() {
  return useQuery({
    queryKey: currentUserKey,
    queryFn: async () => {
      const response = await apiGet<User>(USER_ROUTES.me);
      return response.data;
    },
  });
}
