export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
}

export interface ChatSession {
  id: string;
  title: string;
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
  messages?: ChatMessage[];
}

export interface SendMessageInput {
  content: string;
}

export interface SendMessageMutationInput extends SendMessageInput {
  workspaceId: string;
}

export interface SendMessageResult {
  session: ChatSession;
  userMessage: ChatMessage;
  assistantMessage: ChatMessage;
}

