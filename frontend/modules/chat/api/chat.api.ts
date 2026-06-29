import { apiDelete, apiGet, apiPost } from "@/lib/utils";
import type { ApiResponse } from "@/lib/types";
import { CHAT_ROUTES } from "@/lib/routes";
import type {
  ChatSession,
  ChatSession as ChatSessionDetail,
  SendMessageInput,
  SendMessageResult,
} from "../types/chat.type";

export function fetchChatSessions(
  workspaceId: string,
): Promise<ApiResponse<ChatSession[]>> {
  return apiGet<ChatSession[]>(CHAT_ROUTES.byWorkspace(workspaceId));
}

export function createChatSession(
  workspaceId: string,
  title?: string,
): Promise<ApiResponse<ChatSession>> {
  return apiPost<ChatSession>(CHAT_ROUTES.byWorkspace(workspaceId), {
    title,
  });
}

export function fetchChatSession(
  sessionId: string,
): Promise<ApiResponse<ChatSessionDetail>> {
  return apiGet<ChatSessionDetail>(CHAT_ROUTES.byId(sessionId));
}

export function deleteChatSession(
  sessionId: string,
): Promise<ApiResponse<null>> {
  return apiDelete<null>(CHAT_ROUTES.byId(sessionId));
}

export function sendChatMessage(
  sessionId: string,
  input: SendMessageInput,
): Promise<ApiResponse<SendMessageResult>> {
  return apiPost<SendMessageResult>(CHAT_ROUTES.messages(sessionId), input);
}

