import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Response, ApiResponse } from '../../lib/utils';
import { Workspace } from './entities/workspace.entity';
import { WorkspaceResponseDto } from './dto/workspace-response.dto';
import { WorkspaceRepository } from './workspace.repo';
import { WORKSPACE_API_MESSAGES } from './utils';

@Injectable()
export class WorkspaceService {
  private readonly workspaceRepository: WorkspaceRepository;
  private toResponseDto(workspace: Workspace): WorkspaceResponseDto {
    return {
      id: workspace.id,
      title: workspace.title,
      userId: workspace.userId,
      createdById: workspace.createdById,
      updatedById: workspace.updatedById,
      createdAt: workspace.createdAt,
      updatedAt: workspace.updatedAt,
    };
  }

  constructor(workspaceRepository: WorkspaceRepository) {
    this.workspaceRepository = workspaceRepository;
  }

  async findAll(userId: string): Promise<Response<WorkspaceResponseDto[]>> {
    const workspaceList = await this.workspaceRepository.findByUserId(userId);
    const responseData: WorkspaceResponseDto[] = workspaceList.map((w) =>
      this.toResponseDto(w),
    );
    return ApiResponse(responseData, WORKSPACE_API_MESSAGES.getAll);
  }

  async findById(id: string): Promise<Response<WorkspaceResponseDto>> {
    const workspace = await this.workspaceRepository.findById(id);
    if (!workspace) {
      throw new NotFoundException(`Workspace #${id} not found`);
    }
    const responseData: WorkspaceResponseDto = this.toResponseDto(workspace);
    return ApiResponse(responseData, WORKSPACE_API_MESSAGES.getOne);
  }
}
