import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshSession } from './entities/refresh-session.entity';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(RefreshSession)
    private readonly repository: Repository<RefreshSession>,
  ) {}

  findByHash(hash: string): Promise<RefreshSession | null> {
    return this.repository.findOne({ where: { refreshTokenHash: hash } });
  }

  async create(session: Partial<RefreshSession>): Promise<RefreshSession> {
    const entity = this.repository.create(session);
    return this.repository.save(entity);
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete({ id });
  }

  async deleteByHash(hash: string): Promise<void> {
    await this.repository.delete({ refreshTokenHash: hash });
  }

  async deleteAllForUser(userId: string): Promise<void> {
    await this.repository.delete({ userId });
  }
}
