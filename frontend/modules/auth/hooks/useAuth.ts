"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authToast } from "@/components/app-toast";
import { currentUserKey } from "@/modules/users/hooks/useCurrentUser";
import * as authService from "../services/auth.service";
import type { LoginInput, RegisterInput } from "../types/auth.type";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: LoginInput) => authService.login(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: currentUserKey });
      authToast.signedIn();
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: RegisterInput) => authService.register(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: currentUserKey });
      authToast.signedUp();
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: currentUserKey });
      authToast.signedOut();
    },
  });
}
