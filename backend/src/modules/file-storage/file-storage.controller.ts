import {
  Body,
  Controller,
  Delete,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCookieAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  envelopeRef,
  envelopeSchema,
} from '../../lib/swagger/api-envelope.dto';
import { createFileStorageUploadConfig, Response } from '../../lib/utils';
import { DeleteFileDto } from './dto/delete-file.dto';
import { UploadFileResponseDto } from './dto/upload-file-response.dto';
import type { FileStorageUploadedFile } from './types/file-storage.types';
import { FileStorageService } from './file-storage.service';

@ApiExtraModels(UploadFileResponseDto)
@ApiBearerAuth('bearer')
@ApiCookieAuth('authToken')
@ApiUnauthorizedResponse({
  description: 'Missing or invalid authToken (cookie or Bearer JWT)',
})
@Controller('files')
@UseGuards(JwtAuthGuard)
export class FileStorageController {
  constructor(private readonly fileStorageService: FileStorageService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload a file to file storage' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiOkResponse(envelopeRef(getSchemaPath(UploadFileResponseDto)))
  @UseInterceptors(
    FileInterceptor('file', { storage: createFileStorageUploadConfig() }),
  )
  upload(
    @UploadedFile() file: FileStorageUploadedFile,
  ): Promise<Response<UploadFileResponseDto>> {
    return this.fileStorageService.upload(file);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete a stored file by URL' })
  @ApiBody({ type: DeleteFileDto })
  @ApiOkResponse(envelopeSchema({ type: 'null', nullable: true }))
  remove(@Body() deleteFileDto: DeleteFileDto): Promise<Response<null>> {
    return this.fileStorageService.remove(deleteFileDto);
  }
}
