import { ApiProperty } from '@nestjs/swagger';

export class CreateWorkspaceDto {
  @ApiProperty({
    description: 'Title for the new workspace',
    maxLength: 255,
  })
  title: string;
}
