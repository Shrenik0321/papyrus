import { betterAuth } from 'better-auth';
import { createAuthMiddleware } from 'better-auth/api';
import { Pool } from 'pg';
import { parseDurationToSeconds } from '../utils';
import {
  UserRole,
  type UserRole as UserRoleType,
} from '../../modules/user/utils';
import type { AuthService } from '../../modules/auth/auth.service';

// JWT / app session cookies
export const ACCESS_TOKEN_COOKIE = 'authToken';
export const REFRESH_TOKEN_COOKIE = 'refreshToken';

export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
export const JWT_ACCESS_TTL_SECONDS = parseDurationToSeconds(
  process.env.JWT_ACCESS_TTL!,
);
export const JWT_REFRESH_TTL_SECONDS = parseDurationToSeconds(
  process.env.JWT_REFRESH_TTL!,
);

// Better Auth
export const BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET!;
export const BETTER_AUTH_URL = process.env.BETTER_AUTH_URL!;
export const BETTER_AUTH_BASE_PATH = '/api/oauth';
export const CORS_ORIGIN = process.env.CORS_ORIGIN!;

// Database (Better Auth Pool)
export const DATABASE_HOST = process.env.DATABASE_HOST!;
export const DATABASE_PORT = Number(process.env.DATABASE_PORT!);
export const DATABASE_USER = process.env.DATABASE_USER!;
export const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD!;
export const DATABASE_NAME = process.env.DATABASE_NAME!;

// Google OAuth
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ?? '';
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET ?? '';
export const GOOGLE_OAUTH_PROVIDER = 'google';
export const GOOGLE_OAUTH_CALLBACK_PATH = '/callback/google';

export type AccessTokenPayload = {
  sub: string;
  email: string;
  name: string;
  role: UserRoleType;
};

const isProduction = process.env.NODE_ENV === 'production';

let authServiceInstance: AuthService | undefined;

export function registerAuthService(service: AuthService): void {
  authServiceInstance = service;
}

function getAuthService(): AuthService {
  if (!authServiceInstance) {
    throw new Error('AuthService is not registered');
  }
  return authServiceInstance;
}

function getGoogleProviderConfig():
  | { clientId: string; clientSecret: string }
  | undefined {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    return undefined;
  }
  return {
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
  };
}

const googleProvider = getGoogleProviderConfig();

export const auth = betterAuth({
  secret: BETTER_AUTH_SECRET,
  baseURL: BETTER_AUTH_URL,
  basePath: BETTER_AUTH_BASE_PATH,
  trustedOrigins: [CORS_ORIGIN],
  database: new Pool({
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: UserRole.User,
        input: false,
      },
    },
  },
  account: {
    // Cookie strategy avoids verification-table lookups on callback (see state_mismatch docs).
    storeStateStrategy: 'cookie',
    accountLinking: {
      enabled: true,
      trustedProviders: [GOOGLE_OAUTH_PROVIDER],
    },
  },
  // Email/password sign-up sets emailVerified=false; OAuth linking requires a verified local email.
  databaseHooks: {
    user: {
      create: {
        before: async (user) => ({
          data: {
            ...user,
            emailVerified: user.emailVerified ?? true,
          },
        }),
      },
    },
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: 'lax',
      secure: isProduction,
    },
  },
  onAPIError: {
    errorURL: `${CORS_ORIGIN}/sign-in`,
  },
  ...(googleProvider
    ? {
        socialProviders: {
          [GOOGLE_OAUTH_PROVIDER]: googleProvider,
        },
      }
    : {}),
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== GOOGLE_OAUTH_CALLBACK_PATH || !ctx.context.newSession) {
        return;
      }

      const authService = getAuthService();
      const userId = ctx.context.newSession.user.id;
      const claims = await authService.getClaimsForUserId(userId);
      const tokens = await authService.issueTokenPair(claims, {
        userAgent:
          typeof ctx.request?.headers?.get === 'function'
            ? (ctx.request.headers.get('user-agent') ?? undefined)
            : undefined,
      });

      ctx.setCookie(ACCESS_TOKEN_COOKIE, tokens.accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        path: '/',
        maxAge: JWT_ACCESS_TTL_SECONDS,
      });
      ctx.setCookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        path: '/',
        maxAge: JWT_REFRESH_TTL_SECONDS,
      });
    }),
  },
});

export type Auth = typeof auth;

export function isGoogleOAuthConfigured(): boolean {
  return googleProvider !== undefined;
}
