import { AppRoute } from "./types";

export const FORBIDDEN_ROUTE = "/forbidden" as const;

export const appRoutes: AppRoute[] = [
  { route: "/", isProtected: true },
  { route: "/workspace", isProtected: true },
  { route: "/sign-in", isProtected: false },
  { route: "/sign-up", isProtected: false },
  { route: FORBIDDEN_ROUTE, isProtected: false },
] as const;

// API Routes

export const USER_ROUTES = {
  base: "/user",
  me: "/user/me",
  byId: (id: string) => `/user/${id}`,
};

export const AUTH_ROUTES = {
  login: "/auth/login",
  register: "/auth/register",
  refresh: "/auth/refresh",
  logout: "/auth/logout",
} as const;

export const OAUTH_ROUTES = {
  google: "/oauth/google",
} as const;

export const WORKSPACE_ROUTES = {
  base: "/workspace",
  byId: (id: string) => `/workspace/${id}`,
  byIdWithTabs: (id: string, tabs: string, active: string) =>
    `/workspace/${id}?tabs=${encodeURIComponent(tabs)}&active=${encodeURIComponent(active)}`,
};

export const LIBRARY_ROUTES = {
  byWorkspace: (workspaceId: string) => `/library/workspace/${workspaceId}`,
  create: () => `/library`,
  byId: (id: string) => `/library/${id}`,
  content: (id: string) => `/library/${id}/content`,
};

export const FILE_ROUTES = {
  upload: "/files/upload",
  delete: "/files",
};

export const CHAT_ROUTES = {
  byWorkspace: (workspaceId: string) => `/chat/workspace/${workspaceId}`,
  byId: (sessionId: string) => `/chat/${sessionId}`,
  messages: (sessionId: string) => `/chat/${sessionId}/messages`,
};

export const SETTINGS_ROUTES = {
  base: "/settings",
  byProperty: (property: string) => `/settings/${property}`,
};
