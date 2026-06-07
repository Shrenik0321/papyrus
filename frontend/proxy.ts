import { NextRequest, NextResponse } from "next/server";
import { UserRole } from "./modules/users/constants/user-role.constants";
import { appRoutes, FORBIDDEN_ROUTE } from "./lib/routes";
import type { ApiResponse } from "./lib/types";
import type { User } from "./modules/users/types/user.type";

async function fetchCurrentUser(
  request: NextRequest,
): Promise<User | null> {
  const cookie = request.headers.get("cookie");
  if (!cookie) {
    return null;
  }

  const url = new URL("/api/user/me", request.url);
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { cookie },
      cache: "no-store",
    });
    if (!response.ok) {
      return null;
    }
    const body = (await response.json()) as ApiResponse<User>;
    return body.data ?? null;
  } catch {
    return null;
  }
}

function isAdminOnlyUserPath(pathname: string): boolean {
  if (pathname === "/users/create") {
    return true;
  }
  const editMatch = /^\/users\/([^/]+)$/.exec(pathname);
  if (!editMatch) {
    return false;
  }
  return editMatch[1] !== "create";
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = appRoutes.some(
    (entry) =>
      entry.isProtected &&
      (pathname === entry.route || pathname.startsWith(`${entry.route}/`)),
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const user = await fetchCurrentUser(request);

  if (!user) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set(
      "callbackUrl",
      `${pathname}${request.nextUrl.search}`,
    );
    return NextResponse.redirect(signInUrl);
  }

  if (
    isAdminOnlyUserPath(pathname) &&
    user.role !== UserRole.Admin
  ) {
    return NextResponse.redirect(new URL(FORBIDDEN_ROUTE, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/users", "/users/:path*"],
};
