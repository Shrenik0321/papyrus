import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Library } from './entities/library.entity';
import { LibraryType } from './utils';

@Injectable()
export class LibraryRepository {
  constructor(
    @InjectRepository(Library)
    private readonly repository: Repository<Library>,
  ) {}

  findByWorkspaceId(workspaceId: string): Promise<Library[]> {
    return this.repository.find({
      where: { workspaceId },
      order: { createdAt: 'DESC' },
    });
  }

  findByWorkspaceIdAndType(
    workspaceId: string,
    type: LibraryType,
  ): Promise<Library[]> {
    return this.repository.find({
      where: { workspaceId, type },
      order: { createdAt: 'DESC' },
    });
  }

  findById(id: string): Promise<Library | null> {
    return this.repository.findOne({ where: { id } });
  }

  save(library: Library): Promise<Library> {
    return this.repository.save(library);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
