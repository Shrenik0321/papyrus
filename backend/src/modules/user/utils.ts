export const UserRole = {
  Admin: 'admin',
  User: 'user',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const USER_API_MESSAGES = {
  getAll: 'User list retrieved successfully',
  getOne: 'User retrieved successfully',
  create: 'User created successfully',
  replace: 'User replaced successfully',
  update: 'User updated successfully',
  delete: 'User deleted successfully',
} as const;
