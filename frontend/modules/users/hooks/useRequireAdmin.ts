"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isAdmin } from "../constants/user-role.constants";
import { useCurrentUser } from "./useCurrentUser";

export function useRequireAdmin(redirectTo = "/forbidden") {
  const router = useRouter();
  const { data: user, isPending } = useCurrentUser();

  useEffect(() => {
    if (isPending) {
      return;
    }
    if (!isAdmin(user?.role)) {
      router.replace(redirectTo);
    }
  }, [isPending, user?.role, router, redirectTo]);

  return { user, isPending, isAdmin: isAdmin(user?.role) };
}
