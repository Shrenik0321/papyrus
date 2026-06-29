import { useEffect } from "react";
import { useChatStore } from "@/lib/stores/chat-store";
import { useActiveWorkspace } from "@/modules/workspace/hooks/useWorkspace";
import {
  useChatSession,
  useChatSessions,
  useCreateChatSession,
  useSendMessage,
} from "./useChat";
import type { ChatSession } from "../types/chat.type";

export function useChatActions() {
  const { activeWorkspaceId } = useActiveWorkspace();
  const { data: sessionsData } = useChatSessions(activeWorkspaceId);
  const activeTabId = useChatStore((s) => s.activeTabId);
  const openTabs = useChatStore((s) => s.openTabs);
  const openChat = useChatStore((s) => s.openChat);
  const closeChatTab = useChatStore((s) => s.closeChatTab);
  const setActiveChatTab = useChatStore((s) => s.setActiveChatTab);
  const reset = useChatStore((s) => s.reset);

  const { mutateAsync: createSession, isPending: isCreating } =
    useCreateChatSession();
  const { mutateAsync: send, isPending: isSending } = useSendMessage(
    activeTabId,
  );

  const sessions = sessionsData ?? [];

  useEffect(() => {
    if (!activeWorkspaceId) {
      reset();
    }
  }, [activeWorkspaceId, reset]);

  const createNewChat = async () => {
    if (!activeWorkspaceId) return;
    const session = await createSession({
      workspaceId: activeWorkspaceId,
      title: "New chat",
    });
    openChat({ id: session.id, title: session.title });
  };

  const selectChat = (chat: { id: string; title: string }) => {
    openChat(chat);
  };

  const activeSessionQuery = useChatSession(activeTabId);

  const activeSession: ChatSession | undefined = activeSessionQuery.data;

  const sendMessage = async (content: string) => {
    if (!activeTabId || !activeWorkspaceId || !content.trim()) return;
    await send({ content, workspaceId: activeWorkspaceId });
  };

  return {
    sessions,
    openTabs,
    activeTabId,
    activeSession,
    isCreating,
    isSending,
    createNewChat,
    selectChat,
    closeChatTab,
    setActiveChatTab,
    sendMessage,
  };
}

