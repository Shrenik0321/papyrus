import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Response } from '../../lib/utils';
import { WorkspaceRepository } from '../workspace/workspace.repo';
import { ChatMessageRepository } from './chat-message.repo';
import { ChatSessionRepository } from './chat-session.repo';
import { ChatMessage } from './entities/chat-message.entity';
import { ChatSession } from './entities/chat-session.entity';
import { CHAT_API_MESSAGES, ChatRole } from './utils';

export interface ChatSessionSummary {
  id: string;
  title: string;
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatSessionDetail extends ChatSessionSummary {
  messages: ChatMessage[];
}

export interface SendMessageResult {
  session: ChatSessionSummary;
  userMessage: ChatMessage;
  assistantMessage: ChatMessage;
}

const MOCK_ASSISTANT_REPLY = 'Hi, how can I help?';
const DEFAULT_TITLE = 'New chat';
const MAX_TITLE_LENGTH = 40;

@Injectable()
export class ChatService {
  private readonly chatSessionRepository: ChatSessionRepository;
  private readonly chatMessageRepository: ChatMessageRepository;
  private readonly workspaceRepository: WorkspaceRepository;

  constructor(
    chatSessionRepository: ChatSessionRepository,
    chatMessageRepository: ChatMessageRepository,
    workspaceRepository: WorkspaceRepository,
  ) {
    this.chatSessionRepository = chatSessionRepository;
    this.chatMessageRepository = chatMessageRepository;
    this.workspaceRepository = workspaceRepository;
  }

  private async assertWorkspaceOwnership(
    workspaceId: string,
    userId: string,
  ): Promise<void> {
    const workspace = await this.workspaceRepository.findById(workspaceId);
    if (!workspace || workspace.userId !== userId) {
      throw new NotFoundException(
        CHAT_API_MESSAGES.WORKSPACE_NOT_FOUND(workspaceId),
      );
    }
  }

  private async assertSessionAccess(
    sessionId: string,
    userId: string,
  ): Promise<ChatSession> {
    const session = await this.chatSessionRepository.findById(sessionId);
    if (!session || session.userId !== userId) {
      throw new NotFoundException(CHAT_API_MESSAGES.SESSION_NOT_FOUND);
    }
    return session;
  }

  private toSummary(session: ChatSession, lastMessageAt: Date): ChatSessionSummary {
    return {
      id: session.id,
      title: session.title,
      lastMessageAt: lastMessageAt.toISOString(),
      createdAt: session.createdAt.toISOString(),
      updatedAt: session.updatedAt.toISOString(),
    };
  }

  private deriveTitleFromContent(content: string): string {
    const trimmed = content.trim();
    if (!trimmed) return DEFAULT_TITLE;
    return trimmed.length > MAX_TITLE_LENGTH
      ? `${trimmed.slice(0, MAX_TITLE_LENGTH)}…`
      : trimmed;
  }

  async listSessions(
    workspaceId: string,
    userId: string,
  ): Promise<Response<ChatSessionSummary[]>> {
    await this.assertWorkspaceOwnership(workspaceId, userId);

    const sessions =
      await this.chatSessionRepository.findByWorkspaceAndUser(
        workspaceId,
        userId,
      );

    const items: ChatSessionSummary[] = await Promise.all(
      sessions.map(async (session) => {
        const messages = await this.chatMessageRepository.findBySessionId(
          session.id,
        );
        const last =
          messages[messages.length - 1]?.createdAt ?? session.createdAt;
        return this.toSummary(session, last);
      }),
    );

    return {
      data: items,
      message: 'Chat sessions fetched successfully',
    };
  }

  async createSession(
    workspaceId: string,
    userId: string,
    title?: string,
  ): Promise<Response<ChatSessionSummary>> {
    await this.assertWorkspaceOwnership(workspaceId, userId);

    const now = new Date();
    const session = await this.chatSessionRepository.save({
      workspaceId,
      userId,
      title: title?.trim() || DEFAULT_TITLE,
      createdAt: now,
      updatedAt: now,
    });

    const summary = this.toSummary(session, session.createdAt);

    return {
      data: summary,
      message: 'Chat session created successfully',
    };
  }

  async getSession(
    sessionId: string,
    userId: string,
  ): Promise<Response<ChatSessionDetail>> {
    const session = await this.assertSessionAccess(sessionId, userId);
    const messages = await this.chatMessageRepository.findBySessionId(
      session.id,
    );
    const last =
      messages[messages.length - 1]?.createdAt ?? session.createdAt;

    return {
      data: {
        ...this.toSummary(session, last),
        messages,
      },
      message: 'Chat session fetched successfully',
    };
  }

  async deleteSession(
    sessionId: string,
    userId: string,
  ): Promise<Response<null>> {
    await this.assertSessionAccess(sessionId, userId);
    await this.chatSessionRepository.delete(sessionId);

    return {
      data: null,
      message: 'Chat session deleted successfully',
    };
  }

  async sendMessage(
    sessionId: string,
    userId: string,
    content: string,
  ): Promise<Response<SendMessageResult>> {
    const trimmed = content.trim();
    if (!trimmed) {
      throw new BadRequestException(CHAT_API_MESSAGES.MESSAGE_EMPTY);
    }

    const session = await this.assertSessionAccess(sessionId, userId);
    const now = new Date();

    const [userMessage, assistantMessage] =
      await this.chatMessageRepository.saveMany([
        {
          sessionId: session.id,
          role: ChatRole.User,
          content: trimmed,
          createdAt: now,
        },
        {
          sessionId: session.id,
          role: ChatRole.Assistant,
          content: MOCK_ASSISTANT_REPLY,
          createdAt: new Date(),
        },
      ]);

    let updatedTitle = session.title;
    if (session.title === DEFAULT_TITLE) {
      updatedTitle = this.deriveTitleFromContent(trimmed);
    }

    const updatedSession = await this.chatSessionRepository.save({
      ...session,
      title: updatedTitle,
      updatedAt: new Date(),
    });

    const summary = this.toSummary(updatedSession, assistantMessage.createdAt);

    return {
      data: {
        session: summary,
        userMessage,
        assistantMessage,
      },
      message: 'Message sent successfully',
    };
  }
}

