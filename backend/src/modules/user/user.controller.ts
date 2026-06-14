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
import {
  envelopeRef,
  envelopeSchema,
} from '../../lib/swagger/api-envelope.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Response } from '../../lib/utils';
import { UserRole } from './utils';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserService } from './user.service';

@ApiTags('User')
@ApiExtraModels(UserResponseDto)
@ApiBearerAuth('bearer')
@ApiCookieAuth('authToken')
@ApiUnauthorizedResponse({
  description: 'Missing or invalid authToken (cookie or Bearer JWT)',
})
@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  private readonly userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiOkResponse(envelopeRef(getSchemaPath(UserResponseDto)))
  getMe(
    @Req() request: Request & { user?: AccessTokenPayload },
  ): Promise<Response<UserResponseDto>> {
    return this.userService.findById(request.user!.sub);
  }

  @Get()
  @ApiOperation({ summary: 'List all users' })
  @ApiOkResponse(envelopeRef(getSchemaPath(UserResponseDto), { isArray: true }))
  findAll(): Promise<Response<UserResponseDto[]>> {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiOkResponse(envelopeRef(getSchemaPath(UserResponseDto)))
  findById(@Param('id') id: string): Promise<Response<UserResponseDto>> {
    return this.userService.findById(id);
  }

  @Post()
  @Roles(UserRole.Admin)
  @ApiOperation({
    summary: 'Create user (admin only)',
    description: 'Requires role admin.',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiOkResponse(envelopeRef(getSchemaPath(UserResponseDto)))
  @ApiForbiddenResponse({ description: 'Requires admin role' })
  create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<Response<UserResponseDto>> {
    return this.userService.create(createUserDto);
  }

  @Put(':id')
  @Roles(UserRole.Admin)
  @ApiOperation({
    summary: 'Replace user (admin only)',
    description: 'Requires role admin.',
  })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiBody({ type: CreateUserDto })
  @ApiOkResponse(envelopeRef(getSchemaPath(UserResponseDto)))
  @ApiForbiddenResponse({ description: 'Requires admin role' })
  replace(
    @Param('id') id: string,
    @Body() createUserDto: CreateUserDto,
  ): Promise<Response<UserResponseDto>> {
    return this.userService.replace(id, createUserDto);
  }

  @Patch(':id')
  @Roles(UserRole.Admin)
  @ApiOperation({
    summary: 'Partially update user (admin only)',
    description: 'Requires role admin.',
  })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse(envelopeRef(getSchemaPath(UserResponseDto)))
  @ApiForbiddenResponse({ description: 'Requires admin role' })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Response<UserResponseDto>> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.Admin)
  @ApiOperation({
    summary: 'Delete user (admin only)',
    description: 'Requires role admin.',
  })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiOkResponse(envelopeSchema({ type: 'null', nullable: true }))
  @ApiForbiddenResponse({ description: 'Requires admin role' })
  remove(@Param('id') id: string): Promise<Response<null>> {
    return this.userService.remove(id);
  }
}
