export const UserRole = {
  Admin: 'admin',
  User: 'user',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const WORKSPACE_API_MESSAGES = {
  getAll: 'User list retrieved successfully',
  getOne: 'Workspace retrieved successfully',
  create: 'Workspace created successfully',
  replace: 'Workspace replaced successfully',
  update: 'Workspace updated successfully',
  delete: 'Workspace deleted successfully',
} as const;
