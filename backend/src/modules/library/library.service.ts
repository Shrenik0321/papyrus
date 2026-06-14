import { Injectable, NotFoundException } from '@nestjs/common';
import { Response, ApiResponse } from '../../lib/utils';
import { WorkspaceRepository } from '../workspace/workspace.repo';
import { LibraryResponseDto } from './dto/library-response.dto';
import { LibraryRepository } from './library.repo';
import { LIBRARY_API_MESSAGES } from './utils';
import { Library } from './entities/library.entity';

@Injectable()
export class LibraryService {
  private readonly libraryRepository: LibraryRepository;
  private readonly workspaceRepository: WorkspaceRepository;
  private toResponseDto(library: Library): LibraryResponseDto {
    return {
      id: library.id,
      title: library.title,
      type: library.type,
      fileUrl: library.fileUrl,
      workspaceId: library.workspaceId,
      createdById: library.createdById,
      updatedById: library.updatedById,
      createdAt: library.createdAt,
      updatedAt: library.updatedAt,
    };
  }

  constructor(
    libraryRepository: LibraryRepository,
    workspaceRepository: WorkspaceRepository,
  ) {
    this.libraryRepository = libraryRepository;
    this.workspaceRepository = workspaceRepository;
  }

  async findAll(
    workspaceId: string,
    userId: string,
  ): Promise<Response<LibraryResponseDto[]>> {
    const workspace = await this.workspaceRepository.findById(workspaceId);
    if (!workspace || workspace.userId !== userId) {
      throw new NotFoundException(`Workspace #${workspaceId} not found`);
    }

    const libraries =
      await this.libraryRepository.findByWorkspaceId(workspaceId);
    const responseData: LibraryResponseDto[] = libraries.map((library) =>
      this.toResponseDto(library),
    );
    return ApiResponse(responseData, LIBRARY_API_MESSAGES.getAll);
  }

  async findById(id: string): Promise<Response<LibraryResponseDto>> {
    const library = await this.libraryRepository.findById(id);
    if (!library) {
      throw new NotFoundException(`Library #${id} not found`);
    }
    const responseData: LibraryResponseDto = this.toResponseDto(library);
    return ApiResponse(responseData, LIBRARY_API_MESSAGES.getOne);
  }
}
