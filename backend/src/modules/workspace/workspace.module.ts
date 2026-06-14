// Registers the user controller, service, repository, and TypeORM entity for this feature.
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Workspace } from './entities/workspace.entity';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceRepository } from './workspace.repo';
import { WorkspaceService } from './workspace.service';

@Module({
  imports: [TypeOrmModule.forFeature([Workspace]), AuthModule],
  controllers: [WorkspaceController],
  providers: [WorkspaceRepository, WorkspaceService],
})
export class WorkspaceModule {}
