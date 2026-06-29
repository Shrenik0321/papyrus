import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ChatMessage } from './entities/chat-message.entity';

@Injectable()
export class ChatMessageRepository {
  constructor(
    @InjectRepository(ChatMessage)
    private readonly repository: Repository<ChatMessage>,
  ) {}

  findBySessionId(sessionId: string): Promise<ChatMessage[]> {
    return this.repository.find({
      where: { sessionId },
      order: { createdAt: 'ASC' },
    });
  }

  save(message: Partial<ChatMessage>): Promise<ChatMessage> {
    return this.repository.save(message);
  }

  saveMany(messages: Partial<ChatMessage>[]): Promise<ChatMessage[]> {
    return this.repository.save(messages);
  }

  deleteByIds(ids: string[]): Promise<void> {
    if (!ids.length) return Promise.resolve();
    return this.repository
      .delete({ id: In(ids) })
      .then(() => undefined);
  }
}

