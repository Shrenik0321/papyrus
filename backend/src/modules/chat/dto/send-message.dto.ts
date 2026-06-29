import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
  @ApiProperty({
    description: 'Content of the user message',
    maxLength: 8000,
  })
  content: string;
}
