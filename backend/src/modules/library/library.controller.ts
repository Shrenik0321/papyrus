import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import type { Request } from 'express';
import type { AccessTokenPayload } from '../../lib/auth/utils';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { envelopeRef } from '../../lib/swagger/api-envelope.dto';
import { Response } from '../../lib/utils';
import { LibraryResponseDto } from './dto/library-response.dto';
import { LibraryService } from './library.service';

@ApiExtraModels(LibraryResponseDto)
@ApiBearerAuth('bearer')
@ApiCookieAuth('authToken')
@ApiUnauthorizedResponse({
  description: 'Missing or invalid authToken (cookie or Bearer JWT)',
})
@Controller('library')
@UseGuards(JwtAuthGuard)
export class LibraryController {
  private readonly libraryService: LibraryService;

  constructor(libraryService: LibraryService) {
    this.libraryService = libraryService;
  }

  @Get('workspace/:workspaceId')
  @ApiOperation({ summary: 'List library items for a workspace' })
  @ApiParam({ name: 'workspaceId', description: 'Workspace UUID' })
  @ApiOkResponse(
    envelopeRef(getSchemaPath(LibraryResponseDto), { isArray: true }),
  )
  findAll(
    @Param('workspaceId') workspaceId: string,
    @Req() request: Request & { user?: AccessTokenPayload },
  ): Promise<Response<LibraryResponseDto[]>> {
    return this.libraryService.findAll(workspaceId, request.user!.sub);
  }
}
