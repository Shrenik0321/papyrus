import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { extname } from 'path';
import { Response, ApiResponse } from '../../lib/utils';
import { FileStorageService } from '../file-storage/file-storage.service';
import { WorkspaceRepository } from '../workspace/workspace.repo';
import { CreateLibraryDto } from './dto/create-library.dto';
import { LibraryContentResponseDto } from './dto/library-content-response.dto';
import { LibraryResponseDto } from './dto/library-response.dto';
import { UpdateLibraryContentDto } from './dto/update-library-content.dto';
import { LibraryRepository } from './library.repo';
import { LIBRARY_API_MESSAGES, LibraryType } from './utils';
import { Library } from './entities/library.entity';

@Injectable()
export class LibraryService {
  private readonly libraryRepository: LibraryRepository;
  private readonly workspaceRepository: WorkspaceRepository;
  private readonly fileStorageService: FileStorageService;

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
    fileStorageService: FileStorageService,
  ) {
    this.libraryRepository = libraryRepository;
    this.workspaceRepository = workspaceRepository;
    this.fileStorageService = fileStorageService;
  }

  private async assertWorkspaceOwnership(
    workspaceId: string,
    userId: string,
  ): Promise<void> {
    const workspace = await this.workspaceRepository.findById(workspaceId);
    if (!workspace || workspace.userId !== userId) {
      throw new NotFoundException(`Workspace #${workspaceId} not found`);
    }
  }

  private inferLibraryTypeFromUrl(fileUrl: string): LibraryType {
    const extension = extname(fileUrl).toLowerCase();
    if (extension === '.pdf') {
      return LibraryType.Paper;
    }
    return LibraryType.Note;
  }

  private deriveTitleFromUrl(fileUrl: string): string {
    const filename = fileUrl.split('/').pop() ?? 'Untitled';
    const extension = extname(filename);
    return extension ? filename.slice(0, -extension.length) : filename;
  }

  async findAll(
    workspaceId: string,
    userId: string,
  ): Promise<Response<LibraryResponseDto[]>> {
    await this.assertWorkspaceOwnership(workspaceId, userId);

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

  async create(
    userId: string,
    createLibraryDto: CreateLibraryDto,
  ): Promise<Response<LibraryResponseDto>> {
    if (!createLibraryDto.workspaceId?.trim()) {
      throw new BadRequestException('workspaceId is required');
    }

    if (!createLibraryDto.fileUrl?.trim()) {
      throw new BadRequestException('fileUrl is required');
    }

    if (!this.fileStorageService.isValidFileUrl(createLibraryDto.fileUrl)) {
      throw new BadRequestException('Invalid file URL');
    }

    await this.assertWorkspaceOwnership(createLibraryDto.workspaceId, userId);

    const libraryType =
      createLibraryDto.type ??
      this.inferLibraryTypeFromUrl(createLibraryDto.fileUrl);
    const title =
      createLibraryDto.title?.trim() ||
      this.deriveTitleFromUrl(createLibraryDto.fileUrl);

    const library = await this.libraryRepository.save({
      title,
      type: libraryType,
      fileUrl: createLibraryDto.fileUrl,
      workspaceId: createLibraryDto.workspaceId,
      createdById: userId,
      updatedById: null,
    });

    return ApiResponse(
      this.toResponseDto(library),
      LIBRARY_API_MESSAGES.create,
    );
  }

  async remove(id: string, userId: string): Promise<Response<null>> {
    const library = await this.libraryRepository.findById(id);
    if (!library) {
      throw new NotFoundException(`Library #${id} not found`);
    }

    await this.assertWorkspaceOwnership(library.workspaceId, userId);

    if (this.fileStorageService.isValidFileUrl(library.fileUrl)) {
      this.fileStorageService.delete(library.fileUrl);
    }

    const deleted = await this.libraryRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Library #${id} not found`);
    }

    return ApiResponse(null, LIBRARY_API_MESSAGES.delete);
  }

  /**
   * Content endpoints read and write UTF-8 text via a library item's fileUrl.
   * Before touching disk we must: (1) confirm the item exists, (2) confirm the
   * caller owns the workspace, and (3) restrict to note-type items — papers are
   * binary PDFs and must not use the text content API.
   */
  private async assertContentAccessibleLibraryItem(
    id: string,
    userId: string,
  ): Promise<Library> {
    const library = await this.libraryRepository.findById(id);
    if (!library) {
      throw new NotFoundException(`Library #${id} not found`);
    }

    await this.assertWorkspaceOwnership(library.workspaceId, userId);

    if (library.type !== LibraryType.Note) {
      throw new BadRequestException(
        'Library content is only available for note items',
      );
    }

    return library;
  }

  async getContent(
    id: string,
    userId: string,
  ): Promise<Response<LibraryContentResponseDto>> {
    const library = await this.assertContentAccessibleLibraryItem(id, userId);
    const content = this.fileStorageService.read(library.fileUrl);

    return ApiResponse({ content }, LIBRARY_API_MESSAGES.getOne);
  }

  async updateContent(
    id: string,
    userId: string,
    updateLibraryContentDto: UpdateLibraryContentDto,
  ): Promise<Response<LibraryResponseDto>> {
    if (typeof updateLibraryContentDto.content !== 'string') {
      throw new BadRequestException('content is required');
    }

    const library = await this.assertContentAccessibleLibraryItem(id, userId);
    this.fileStorageService.write(
      library.fileUrl,
      updateLibraryContentDto.content,
    );

    const updated = await this.libraryRepository.save({
      id: library.id,
      updatedById: userId,
    });

    return ApiResponse(this.toResponseDto(updated), LIBRARY_API_MESSAGES.update);
  }
}
