export class CreateUserDto {
  email: string;
  name: string;
  /** Required when creating a user with login credentials via Better Auth. */
  password?: string;
}
