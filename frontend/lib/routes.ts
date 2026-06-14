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
};
