import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateChatSessionDto {
  @ApiPropertyOptional({
    description: 'Optional title for the new chat session',
    maxLength: 255,
  })
  title?: string;
}
