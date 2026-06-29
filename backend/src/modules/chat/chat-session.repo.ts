import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatSession } from './entities/chat-session.entity';

@Injectable()
export class ChatSessionRepository {
  constructor(
    @InjectRepository(ChatSession)
    private readonly repository: Repository<ChatSession>,
  ) {}

  findByWorkspaceAndUser(
    workspaceId: string,
    userId: string,
  ): Promise<ChatSession[]> {
    return this.repository.find({
      where: { workspaceId, userId },
      order: { updatedAt: 'DESC' },
    });
  }

  findById(id: string): Promise<ChatSession | null> {
    return this.repository.findOne({ where: { id } });
  }

  save(session: Partial<ChatSession>): Promise<ChatSession> {
    return this.repository.save(session);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}

