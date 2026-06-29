import { ApiProperty } from '@nestjs/swagger';
import { ChatMessageResponseDto } from './chat-message-response.dto';
import { ChatSessionResponseDto } from './chat-session-response.dto';

export class ChatSessionDetailResponseDto extends ChatSessionResponseDto {
  @ApiProperty({ type: ChatMessageResponseDto, isArray: true })
  messages: ChatMessageResponseDto[];
}

