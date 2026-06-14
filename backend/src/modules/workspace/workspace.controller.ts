import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
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
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import type { Request } from 'express';
import type { AccessTokenPayload } from '../../lib/auth/utils';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { envelopeRef } from '../../lib/swagger/api-envelope.dto';
import { Response } from '../../lib/utils';
import { WorkspaceResponseDto } from './dto/workspace-response.dto';
import { WorkspaceService } from './workspace.service';

@ApiExtraModels(WorkspaceResponseDto)
@ApiBearerAuth('bearer')
@ApiCookieAuth('authToken')
@ApiUnauthorizedResponse({
  description: 'Missing or invalid authToken (cookie or Bearer JWT)',
})
@Controller('workspace')
@UseGuards(JwtAuthGuard)
export class WorkspaceController {
  private readonly workspaceService: WorkspaceService;

  constructor(workspaceService: WorkspaceService) {
    this.workspaceService = workspaceService;
  }

  @Get()
  @ApiOperation({ summary: 'List workspaces for the current user' })
  @ApiOkResponse(
    envelopeRef(getSchemaPath(WorkspaceResponseDto), { isArray: true }),
  )
  findAll(
    @Req() request: Request & { user?: AccessTokenPayload },
  ): Promise<Response<WorkspaceResponseDto[]>> {
    return this.workspaceService.findAll(request.user!.sub);
  }
}
