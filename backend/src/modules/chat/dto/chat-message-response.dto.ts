import { ApiProperty } from '@nestjs/swagger';
import { ChatRole } from '../utils';

export class ChatMessageResponseDto {
  @ApiProperty({ description: 'Message ID' })
  id: string;

  @ApiProperty({ enum: ChatRole })
  role: ChatRole;

  @ApiProperty()
  content: string;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;
}

