import { ApiProperty } from '@nestjs/swagger';

export class ChatSessionResponseDto {
  @ApiProperty({ description: 'Chat session ID' })
  id: string;

  @ApiProperty({ description: 'Chat session title' })
  title: string;

  @ApiProperty({
    description: 'Timestamp of the last message in the session',
    type: String,
    format: 'date-time',
  })
  lastMessageAt: string;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: string;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: string;
}

