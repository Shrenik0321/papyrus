import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Workspace } from '../workspace/entities/workspace.entity';
import { WorkspaceRepository } from '../workspace/workspace.repo';
import { ChatController } from './chat.controller';
import { ChatMessageRepository } from './chat-message.repo';
import { ChatService } from './chat.service';
import { ChatSessionRepository } from './chat-session.repo';
import { ChatMessage } from './entities/chat-message.entity';
import { ChatSession } from './entities/chat-session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatSession, ChatMessage, Workspace]), AuthModule],
  controllers: [ChatController],
  providers: [
    ChatService,
    ChatSessionRepository,
    ChatMessageRepository,
    WorkspaceRepository,
  ],
})
export class ChatModule {}

