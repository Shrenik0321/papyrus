import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import * as chatService from "../services/chat.service";
import type { SendMessageMutationInput } from "../types/chat.type";

export const chatKeys = {
  all: ["chat"] as const,
  byWorkspace: (workspaceId: string) =>
    [...chatKeys.all, "workspace", workspaceId] as const,
  session: (sessionId: string) =>
    [...chatKeys.all, "session", sessionId] as const,
};

export function useChatSessions(workspaceId: string | undefined) {
  return useQuery({
    queryKey: workspaceId ? chatKeys.byWorkspace(workspaceId) : chatKeys.all,
    queryFn: () => chatService.getChatSessions(workspaceId as string),
    enabled: Boolean(workspaceId),
  });
}

export function useChatSession(sessionId: string | null | undefined) {
  return useQuery({
    queryKey: sessionId ? chatKeys.session(sessionId) : chatKeys.all,
    queryFn: () => chatService.getChatSession(sessionId as string),
    enabled: Boolean(sessionId),
  });
}

export function useCreateChatSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      title,
    }: {
      workspaceId: string;
      title?: string;
    }) => chatService.createChatSession(workspaceId, title),
    onSuccess: (session) => {
      queryClient.invalidateQueries({
        queryKey: chatKeys.byWorkspace(session.workspaceId),
      });
    },
  });
}

export function useDeleteChatSession(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => chatService.deleteChatSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: chatKeys.byWorkspace(workspaceId),
      });
    },
  });
}

export function useSendMessage(sessionId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ content }: SendMessageMutationInput) =>
      chatService.sendMessage(sessionId as string, { content }),
    onSuccess: async (result, { workspaceId }) => {
      await Promise.all([
        queryClient.refetchQueries({
          queryKey: chatKeys.session(result.session.id),
        }),
        queryClient.refetchQueries({
          queryKey: chatKeys.byWorkspace(workspaceId),
        }),
      ]);
    },
    meta: {
      requiresSessionId: true,
    },
  });
}

