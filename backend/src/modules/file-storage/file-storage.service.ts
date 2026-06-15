import {
  existsSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from 'fs';
import { join } from 'path';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ApiResponse, getFileStorageConfig, Response } from '../../lib/utils';
import { DeleteFileDto } from './dto/delete-file.dto';
import { UploadFileResponseDto } from './dto/upload-file-response.dto';
import type { FileStorageUploadedFile } from './types/file-storage.types';
import { FILE_STORAGE_API_MESSAGES } from './utils';

@Injectable()
export class FileStorageService {
  async upload(
    file: FileStorageUploadedFile,
  ): Promise<Response<UploadFileResponseDto>> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const { publicBaseUrl } = getFileStorageConfig();
    const stored: UploadFileResponseDto = {
      fileUrl: `${publicBaseUrl}/${file.filename}`,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    };

    return ApiResponse(stored, FILE_STORAGE_API_MESSAGES.upload);
  }

  async remove(deleteFileDto: DeleteFileDto): Promise<Response<null>> {
    if (!deleteFileDto.fileUrl?.trim()) {
      throw new BadRequestException('fileUrl is required');
    }

    if (!this.isValidFileUrl(deleteFileDto.fileUrl)) {
      throw new BadRequestException('Invalid file URL');
    }

    this.delete(deleteFileDto.fileUrl);

    return ApiResponse(null, FILE_STORAGE_API_MESSAGES.delete);
  }

  read(fileUrl: string): string {
    const filePath = this.resolveFilePath(fileUrl);

    if (!existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }

    return readFileSync(filePath, 'utf8');
  }

  write(fileUrl: string, content: string): void {
    const filePath = this.resolveFilePath(fileUrl);
    writeFileSync(filePath, content, 'utf8');
  }

  delete(fileUrl: string): void {
    const filePath = this.resolveFilePath(fileUrl);

    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }
  }

  isValidFileUrl(fileUrl: string): boolean {
    const { publicBaseUrl } = getFileStorageConfig();
    return fileUrl.startsWith(publicBaseUrl.replace(/\/$/, ''));
  }

  private resolveFilePath(fileUrl: string): string {
    if (!this.isValidFileUrl(fileUrl)) {
      throw new BadRequestException('Invalid file URL');
    }

    const { publicBaseUrl, root } = getFileStorageConfig();
    const normalizedBase = publicBaseUrl.replace(/\/$/, '');
    const relativePath = fileUrl
      .slice(normalizedBase.length)
      .replace(/^\//, '');

    return join(process.cwd(), root, relativePath);
  }
}
