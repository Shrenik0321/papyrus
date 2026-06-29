import { ApiProperty } from '@nestjs/swagger';
import { ChatMessageResponseDto } from './chat-message-response.dto';
import { ChatSessionResponseDto } from './chat-session-response.dto';

export class SendMessageResponseDto {
  @ApiProperty({ type: ChatSessionResponseDto })
  session: ChatSessionResponseDto;

  @ApiProperty({ type: ChatMessageResponseDto })
  userMessage: ChatMessageResponseDto;

  @ApiProperty({ type: ChatMessageResponseDto })
  assistantMessage: ChatMessageResponseDto;
}

