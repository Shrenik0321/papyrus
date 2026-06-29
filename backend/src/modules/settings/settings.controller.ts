import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import type { Request } from 'express';
import type { AccessTokenPayload } from '../../lib/auth/utils';
import { envelopeRef } from '../../lib/swagger/api-envelope.dto';
import { Response } from '../../lib/utils';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SettingResponseDto } from './dto/setting-response.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { SettingsService } from './settings.service';
import { SettingProperty } from './utils';

@ApiTags('Settings')
@ApiExtraModels(SettingResponseDto, UpdateSettingDto)
@ApiBearerAuth('bearer')
@ApiCookieAuth('authToken')
@ApiUnauthorizedResponse({
  description: 'Missing or invalid authToken (cookie or Bearer JWT)',
})
@Controller('settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
  private readonly settingsService: SettingsService;

  constructor(settingsService: SettingsService) {
    this.settingsService = settingsService;
  }

  @Get()
  @ApiOperation({ summary: 'List all settings for the current user' })
  @ApiOkResponse(
    envelopeRef(getSchemaPath(SettingResponseDto), { isArray: true }),
  )
  findAll(
    @Req() request: Request & { user?: AccessTokenPayload },
  ): Promise<Response<SettingResponseDto[]>> {
    return this.settingsService.findAll(request.user!.sub);
  }

  @Get(':property')
  @ApiOperation({ summary: 'Get a setting by property for the current user' })
  @ApiParam({ name: 'property', enum: SettingProperty })
  @ApiOkResponse(envelopeRef(getSchemaPath(SettingResponseDto)))
  findByProperty(
    @Req() request: Request & { user?: AccessTokenPayload },
    @Param('property') property: string,
  ): Promise<Response<SettingResponseDto>> {
    return this.settingsService.findByProperty(request.user!.sub, property);
  }

  @Put(':property')
  @ApiOperation({ summary: 'Update a setting value for the current user' })
  @ApiParam({ name: 'property', enum: SettingProperty })
  @ApiBody({ type: UpdateSettingDto })
  @ApiOkResponse(envelopeRef(getSchemaPath(SettingResponseDto)))
  update(
    @Req() request: Request & { user?: AccessTokenPayload },
    @Param('property') property: string,
    @Body() dto: UpdateSettingDto,
  ): Promise<Response<SettingResponseDto>> {
    return this.settingsService.update(request.user!.sub, property, dto);
  }

  @Delete(':property')
  @ApiOperation({ summary: 'Clear a setting value for the current user' })
  @ApiParam({ name: 'property', enum: SettingProperty })
  @ApiOkResponse(envelopeRef(getSchemaPath(SettingResponseDto)))
  clear(
    @Req() request: Request & { user?: AccessTokenPayload },
    @Param('property') property: string,
  ): Promise<Response<SettingResponseDto>> {
    return this.settingsService.clear(request.user!.sub, property);
  }
}
