import { ApiProperty } from '@nestjs/swagger';
import { SettingProperty } from '../utils';

export class SettingResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ enum: SettingProperty })
  property: SettingProperty;

  @ApiProperty({
    nullable: true,
    description:
      'Plaintext value for non-sensitive settings; null for sensitive settings',
  })
  value: string | null;

  @ApiProperty({
    description:
      'True when a value is stored (use for sensitive settings where value is not returned)',
  })
  hasValue: boolean;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: Date;
}
