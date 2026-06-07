export const UserRole = {
  Admin: "admin",
  User: "user",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.Admin]: "Admin",
  [UserRole.User]: "User",
};

export function formatUserRole(role: UserRole | undefined): string {
  if (!role) {
    return "User";
  }
  return ROLE_LABELS[role] ?? role;
}

export function isAdmin(role: UserRole | undefined): boolean {
  return role === UserRole.Admin;
}
