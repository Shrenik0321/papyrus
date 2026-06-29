export enum ChatRole {
  User = 'user',
  Assistant = 'assistant',
}

export const CHAT_API_MESSAGES = {
  SESSION_NOT_FOUND: 'Chat session not found',
  WORKSPACE_NOT_FOUND: (workspaceId: string) =>
    `Workspace #${workspaceId} not found`,
  MESSAGE_EMPTY: 'Message content cannot be empty',
} as const;

