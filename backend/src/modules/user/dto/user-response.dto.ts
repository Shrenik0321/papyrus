import type { UserRole } from '../utils';

export class UserResponseDto {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}
