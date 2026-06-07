import { AppRoute } from "./types";

export const USER_ROUTES = {
  base: "/user",
  me: "/user/me",
  byId: (id: string) => `/user/${id}`,
} as const;

export const AUTH_ROUTES = {
  login: "/auth/login",
  register: "/auth/register",
  refresh: "/auth/refresh",
  logout: "/auth/logout",
} as const;

export const OAUTH_ROUTES = {
  google: "/oauth/google",
} as const;

export const FORBIDDEN_ROUTE = "/forbidden" as const;

export const appRoutes: AppRoute[] = [
  { route: "/dashboard", isProtected: true },
  { route: "/users", isProtected: true },
  { route: "/sign-in", isProtected: false },
  { route: "/sign-up", isProtected: false },
  { route: FORBIDDEN_ROUTE, isProtected: false },
] as const;