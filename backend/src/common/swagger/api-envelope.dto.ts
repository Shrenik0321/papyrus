import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../modules/user/dto/user-response.dto';

export class MessageEnvelopeDto {
  @ApiProperty({ example: 'Operation completed successfully' })
  message: string;
}

export class UserEnvelopeDto {
  @ApiProperty({ type: UserResponseDto })
  data: UserResponseDto;

  @ApiProperty({ example: 'User retrieved successfully' })
  message: string;
}

export class UserListEnvelopeDto {
  @ApiProperty({ type: UserResponseDto, isArray: true })
  data: UserResponseDto[];

  @ApiProperty({ example: 'User list retrieved successfully' })
  message: string;
}

export class AuthUserEnvelopeDto {
  @ApiProperty({
    description: 'Signed-in user (subset of UserResponseDto)',
    example: {
      id: 'uuid',
      email: 'admin@papyrus.io',
      name: 'Admin',
      role: 'admin',
    },
  })
  data: { user: Record<string, unknown> };

  @ApiProperty({ example: 'Signed in' })
  message: string;
}
