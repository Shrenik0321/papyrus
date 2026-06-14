import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Workspace } from '../workspace/entities/workspace.entity';
import { WorkspaceRepository } from '../workspace/workspace.repo';
import { Library } from './entities/library.entity';
import { LibraryController } from './library.controller';
import { LibraryRepository } from './library.repo';
import { LibraryService } from './library.service';

@Module({
  imports: [TypeOrmModule.forFeature([Library, Workspace]), AuthModule],
  controllers: [LibraryController],
  providers: [LibraryRepository, LibraryService, WorkspaceRepository],
  exports: [LibraryRepository],
})
export class LibraryModule {}
