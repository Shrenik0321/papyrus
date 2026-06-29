import { unwrapApiResponse } from "@/lib/types";
import * as chatApi from "../api/chat.api";
import type {
  ChatSession,
  ChatMessage,
  SendMessageInput,
  SendMessageResult,
} from "../types/chat.type";

export async function getChatSessions(
  workspaceId: string,
): Promise<ChatSession[]> {
  const response = await chatApi.fetchChatSessions(workspaceId);
  return unwrapApiResponse(response);
}

export async function createChatSession(
  workspaceId: string,
  title?: string,
): Promise<ChatSession> {
  const response = await chatApi.createChatSession(workspaceId, title);
  return unwrapApiResponse(response);
}

export async function getChatSession(
  sessionId: string,
): Promise<ChatSession> {
  const response = await chatApi.fetchChatSession(sessionId);
  return unwrapApiResponse(response);
}

export async function deleteChatSession(sessionId: string): Promise<void> {
  await chatApi.deleteChatSession(sessionId);
}

export async function sendMessage(
  sessionId: string,
  input: SendMessageInput,
): Promise<SendMessageResult> {
  const response = await chatApi.sendChatMessage(sessionId, input);
  return unwrapApiResponse(response);
}

