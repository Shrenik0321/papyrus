import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash, randomBytes } from 'crypto';
import type { CookieOptions, Request, Response } from 'express';
import { SignJWT, jwtVerify } from 'jose';
import { Repository } from 'typeorm';
import {
  UserRole,
  type UserRole as UserRoleType,
} from '../user/utils';
import { User } from '../user/entities/user.entity';
import {
  ACCESS_TOKEN_COOKIE,
  type AccessTokenPayload,
  JWT_ACCESS_SECRET,
  JWT_ACCESS_TTL_SECONDS,
  JWT_REFRESH_TTL_SECONDS,
  REFRESH_TOKEN_COOKIE,
} from '../../lib/auth/utils';
import { AuthRepository } from './auth.repo';

export type AuthUserClaims = AccessTokenPayload;

type IssueTokensMeta = {
  userAgent?: string;
  ipAddress?: string;
  deviceId?: string;
};

const isProduction = process.env.NODE_ENV === 'production';

@Injectable()
export class AuthService {
  private readonly accessSecret = new TextEncoder().encode(JWT_ACCESS_SECRET);

  constructor(
    private readonly authRepository: AuthRepository,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ): void {
    res.cookie(ACCESS_TOKEN_COOKIE, accessToken, {
      ...this.cookieOptions(JWT_ACCESS_TTL_SECONDS),
      sameSite: 'lax',
    });
    res.cookie(
      REFRESH_TOKEN_COOKIE,
      refreshToken,
      this.cookieOptions(JWT_REFRESH_TTL_SECONDS),
    );
  }

  clearAuthCookies(res: Response): void {
    const clearOpts: CookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    };
    res.clearCookie(ACCESS_TOKEN_COOKIE, clearOpts);
    res.clearCookie(REFRESH_TOKEN_COOKIE, {
      ...clearOpts,
      sameSite: isProduction ? 'strict' : 'lax',
    });
  }

  hashRefreshToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  async signAccessToken(claims: AccessTokenPayload): Promise<string> {
    return new SignJWT({
      email: claims.email,
      name: claims.name,
      role: claims.role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(claims.sub)
      .setIssuedAt()
      .setExpirationTime(`${JWT_ACCESS_TTL_SECONDS}s`)
      .sign(this.accessSecret);
  }

  async verifyAccessToken(token: string): Promise<AccessTokenPayload> {
    try {
      const { payload } = await jwtVerify(token, this.accessSecret, {
        algorithms: ['HS256'],
      });
      const sub = payload.sub;
      const email = payload.email;
      const name = payload.name;
      const role = payload.role;
      if (
        typeof sub !== 'string' ||
        typeof email !== 'string' ||
        typeof name !== 'string' ||
        (role !== UserRole.Admin && role !== UserRole.User)
      ) {
        throw new UnauthorizedException('Invalid access token');
      }
      return { sub, email, name, role: role as UserRoleType };
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }

  extractAccessTokenFromRequest(req: Request): string | undefined {
    const cookieToken = req.cookies?.[ACCESS_TOKEN_COOKIE] as string | undefined;
    if (cookieToken) {
      return cookieToken;
    }
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.slice(7);
    }
    return undefined;
  }

  extractRefreshTokenFromRequest(req: Request): string | undefined {
    return req.cookies?.[REFRESH_TOKEN_COOKIE] as string | undefined;
  }

  async issueTokenPair(
    claims: AccessTokenPayload,
    meta: IssueTokensMeta = {},
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = await this.signAccessToken(claims);
    const refreshToken = randomBytes(32).toString('base64url');
    const refreshTokenHash = this.hashRefreshToken(refreshToken);
    const expiresAt = new Date(Date.now() + JWT_REFRESH_TTL_SECONDS * 1000);

    await this.authRepository.create({
      userId: claims.sub,
      refreshTokenHash,
      expiresAt,
      deviceId: meta.deviceId ?? null,
      userAgent: meta.userAgent ?? null,
      ipAddress: meta.ipAddress ?? null,
    });

    return { accessToken, refreshToken };
  }

  async rotateRefreshToken(
    rawRefreshToken: string,
    meta: IssueTokensMeta = {},
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    claims: AccessTokenPayload;
  }> {
    const hash = this.hashRefreshToken(rawRefreshToken);
    const session = await this.authRepository.findByHash(hash);

    if (!session || session.expiresAt.getTime() <= Date.now()) {
      if (session) {
        await this.authRepository.deleteById(session.id);
      }
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const claims = await this.loadUserClaims(session.userId);
    await this.authRepository.deleteById(session.id);

    const tokens = await this.issueTokenPair(claims, meta);
    return { ...tokens, claims };
  }

  async revokeRefreshToken(rawRefreshToken: string | undefined): Promise<void> {
    if (!rawRefreshToken) {
      return;
    }
    const hash = this.hashRefreshToken(rawRefreshToken);
    await this.authRepository.deleteByHash(hash);
  }

  toClaimsFromUser(user: {
    id: string;
    email: string;
    name: string;
    role: UserRoleType;
  }): AccessTokenPayload {
    return {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  async getClaimsForUserId(userId: string): Promise<AccessTokenPayload> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.toClaimsFromUser(user);
  }

  async findUserById(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  async completeAppSignIn(
    userId: string,
    req: Request,
    res: Response,
  ): Promise<User> {
    const claims = await this.getClaimsForUserId(userId);
    const tokens = await this.issueTokenPair(claims, this.requestMeta(req));
    this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
    return this.findUserById(userId);
  }

  requestMeta(req: Request): IssueTokensMeta {
    return {
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip,
    };
  }

  private async loadUserClaims(userId: string): Promise<AccessTokenPayload> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found for refresh session');
    }
    return this.toClaimsFromUser(user);
  }

  private cookieOptions(maxAgeSeconds: number): CookieOptions {
    return {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      path: '/',
      maxAge: maxAgeSeconds * 1000,
    };
  }
}
