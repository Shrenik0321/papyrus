import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
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
import {
  envelopeRef,
  envelopeSchema,
} from '../../lib/swagger/api-envelope.dto';
import { Response } from '../../lib/utils';
import { CreateLibraryDto } from './dto/create-library.dto';
import { LibraryContentResponseDto } from './dto/library-content-response.dto';
import { LibraryResponseDto } from './dto/library-response.dto';
import { UpdateLibraryContentDto } from './dto/update-library-content.dto';
import { LibraryService } from './library.service';

@ApiExtraModels(
  LibraryResponseDto,
  CreateLibraryDto,
  LibraryContentResponseDto,
  UpdateLibraryContentDto,
)
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

  @Post()
  @ApiOperation({ summary: 'Create a library item' })
  @ApiBody({ type: CreateLibraryDto })
  @ApiOkResponse(envelopeRef(getSchemaPath(LibraryResponseDto)))
  create(
    @Body() createLibraryDto: CreateLibraryDto,
    @Req() request: Request & { user?: AccessTokenPayload },
  ): Promise<Response<LibraryResponseDto>> {
    return this.libraryService.create(request.user!.sub, createLibraryDto);
  }

  @Get(':id/content')
  @ApiOperation({ summary: 'Get text content for a note library item' })
  @ApiParam({ name: 'id', description: 'Library item UUID' })
  @ApiOkResponse(envelopeRef(getSchemaPath(LibraryContentResponseDto)))
  getContent(
    @Param('id') id: string,
    @Req() request: Request & { user?: AccessTokenPayload },
  ): Promise<Response<LibraryContentResponseDto>> {
    return this.libraryService.getContent(id, request.user!.sub);
  }

  @Put(':id/content')
  @ApiOperation({ summary: 'Update text content for a note library item' })
  @ApiParam({ name: 'id', description: 'Library item UUID' })
  @ApiBody({ type: UpdateLibraryContentDto })
  @ApiOkResponse(envelopeRef(getSchemaPath(LibraryResponseDto)))
  updateContent(
    @Param('id') id: string,
    @Body() updateLibraryContentDto: UpdateLibraryContentDto,
    @Req() request: Request & { user?: AccessTokenPayload },
  ): Promise<Response<LibraryResponseDto>> {
    return this.libraryService.updateContent(
      id,
      request.user!.sub,
      updateLibraryContentDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a library item' })
  @ApiParam({ name: 'id', description: 'Library item UUID' })
  @ApiOkResponse(envelopeSchema({ type: 'null', nullable: true }))
  remove(
    @Param('id') id: string,
    @Req() request: Request & { user?: AccessTokenPayload },
  ): Promise<Response<null>> {
    return this.libraryService.remove(id, request.user!.sub);
  }
}
