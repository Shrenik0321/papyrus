import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
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
import {
  envelopeRef,
  envelopeSchema,
} from '../../lib/swagger/api-envelope.dto';
import { Response } from '../../lib/utils';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChatService } from './chat.service';
import { ChatSessionDetailResponseDto } from './dto/chat-session-detail-response.dto';
import { ChatSessionResponseDto } from './dto/chat-session-response.dto';
import { CreateChatSessionDto } from './dto/create-chat-session.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { SendMessageResponseDto } from './dto/send-message-response.dto';

@ApiExtraModels(
  ChatSessionResponseDto,
  ChatSessionDetailResponseDto,
  CreateChatSessionDto,
  SendMessageDto,
  SendMessageResponseDto,
)
@ApiBearerAuth('bearer')
@ApiCookieAuth('authToken')
@ApiUnauthorizedResponse({
  description: 'Missing or invalid authToken (cookie or Bearer JWT)',
})
@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  private readonly chatService: ChatService;

  constructor(chatService: ChatService) {
    this.chatService = chatService;
  }

  @Get('workspace/:workspaceId')
  @ApiOperation({ summary: 'List chat sessions for a workspace' })
  @ApiParam({ name: 'workspaceId', description: 'Workspace UUID' })
  @ApiOkResponse(
    envelopeRef(getSchemaPath(ChatSessionResponseDto), { isArray: true }),
  )
  findAll(
    @Param('workspaceId') workspaceId: string,
    @Req() request: Request & { user?: AccessTokenPayload },
  ): Promise<Response<ChatSessionResponseDto[]>> {
    return this.chatService.listSessions(workspaceId, request.user!.sub);
  }

  @Post('workspace/:workspaceId')
  @ApiOperation({ summary: 'Create a chat session for a workspace' })
  @ApiParam({ name: 'workspaceId', description: 'Workspace UUID' })
  @ApiBody({ type: CreateChatSessionDto })
  @ApiOkResponse(envelopeRef(getSchemaPath(ChatSessionResponseDto)))
  create(
    @Param('workspaceId') workspaceId: string,
    @Body() dto: CreateChatSessionDto,
    @Req() request: Request & { user?: AccessTokenPayload },
  ): Promise<Response<ChatSessionResponseDto>> {
    return this.chatService.createSession(workspaceId, request.user!.sub, dto.title);
  }

  @Get(':sessionId')
  @ApiOperation({ summary: 'Get a chat session and its messages' })
  @ApiParam({ name: 'sessionId', description: 'Chat session UUID' })
  @ApiOkResponse(envelopeRef(getSchemaPath(ChatSessionDetailResponseDto)))
  findOne(
    @Param('sessionId') sessionId: string,
    @Req() request: Request & { user?: AccessTokenPayload },
  ): Promise<Response<ChatSessionDetailResponseDto>> {
    return this.chatService.getSession(sessionId, request.user!.sub);
  }

  @Delete(':sessionId')
  @ApiOperation({ summary: 'Delete a chat session' })
  @ApiParam({ name: 'sessionId', description: 'Chat session UUID' })
  @ApiOkResponse(envelopeSchema({ type: 'null', nullable: true }))
  remove(
    @Param('sessionId') sessionId: string,
    @Req() request: Request & { user?: AccessTokenPayload },
  ): Promise<Response<null>> {
    return this.chatService.deleteSession(sessionId, request.user!.sub);
  }

  @Post(':sessionId/messages')
  @ApiOperation({ summary: 'Send a message within a chat session' })
  @ApiParam({ name: 'sessionId', description: 'Chat session UUID' })
  @ApiBody({ type: SendMessageDto })
  @ApiOkResponse(envelopeRef(getSchemaPath(SendMessageResponseDto)))
  sendMessage(
    @Param('sessionId') sessionId: string,
    @Body() dto: SendMessageDto,
    @Req() request: Request & { user?: AccessTokenPayload },
  ): Promise<Response<SendMessageResponseDto>> {
    return this.chatService.sendMessage(sessionId, request.user!.sub, dto.content);
  }
}

