import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workspace } from './entities/workspace.entity';

@Injectable()
export class WorkspaceRepository {
  constructor(
    @InjectRepository(Workspace)
    private readonly repository: Repository<Workspace>,
  ) {}

  findByUserId(userId: string): Promise<Workspace[]> {
    return this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  findById(id: string): Promise<Workspace | null> {
    return this.repository.findOne({ where: { id } });
  }

  save(workspace: Workspace): Promise<Workspace> {
    return this.repository.save(workspace);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
