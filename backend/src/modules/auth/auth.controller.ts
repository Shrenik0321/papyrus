import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../../lib/auth/utils';
import {
  envelopeSchema,
  MessageEnvelopeDto,
} from '../../lib/swagger/api-envelope.dto';
import { AuthService } from './auth.service';
import { AUTH_API_MESSAGES } from './utils';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Auth')
@Controller()
export class AuthController {
  private readonly authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  @Post('auth/login')
  @ApiOperation({
    summary: 'Sign in with email and password',
    description:
      'On success, sets authToken and refreshToken HTTP-only cookies on the response. ' +
      'For Swagger UI: execute this first, then call User routes (cookies) or Authorize with Bearer using the authToken JWT value.',
  })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse(
    envelopeSchema(
      {
        type: 'object',
        properties: {
          user: { type: 'object', additionalProperties: true },
        },
      },
      'Signed in',
    ),
  )
  @ApiUnauthorizedResponse({ description: 'Invalid email or password' })
  async login(
    @Body() body: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await auth.api.signInEmail({
      body: {
        email: body.email,
        password: body.password,
      },
      headers: fromNodeHeaders(req.headers),
    });

    if (!result?.user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const user = await this.authService.completeAppSignIn(
      result.user.id,
      req,
      res,
    );

    return { data: { user }, message: AUTH_API_MESSAGES.signIn };
  }

  @Post('auth/register')
  @ApiOperation({
    summary: 'Create account with email and password',
    description:
      'On success, sets authToken and refreshToken HTTP-only cookies on the response.',
  })
  @ApiBody({ type: RegisterDto })
  @ApiOkResponse(
    envelopeSchema(
      {
        type: 'object',
        properties: {
          user: { type: 'object', additionalProperties: true },
        },
      },
      'Account created',
    ),
  )
  @ApiUnauthorizedResponse({ description: 'Registration failed' })
  async register(
    @Body() body: RegisterDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await auth.api.signUpEmail({
      body: {
        email: body.email,
        password: body.password,
        name: body.name,
      },
      headers: fromNodeHeaders(req.headers),
    });

    if (!result?.user) {
      throw new UnauthorizedException('Registration failed');
    }

    const user = await this.authService.completeAppSignIn(
      result.user.id,
      req,
      res,
    );

    return { data: { user }, message: AUTH_API_MESSAGES.signUp };
  }

  @Post('auth/refresh')
  @ApiOperation({
    summary: 'Rotate access and refresh tokens',
    description:
      'Requires refreshToken cookie. On success, sets new authToken and refreshToken cookies.',
  })
  @ApiCookieAuth('refreshToken')
  @ApiOkResponse({ type: MessageEnvelopeDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid refresh token' })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const rawRefresh = this.authService.extractRefreshTokenFromRequest(req);
    if (!rawRefresh) {
      throw new UnauthorizedException('Missing refresh token');
    }

    const { accessToken, refreshToken } =
      await this.authService.rotateRefreshToken(
        rawRefresh,
        this.authService.requestMeta(req),
      );
    this.authService.setAuthCookies(res, accessToken, refreshToken);

    return { message: AUTH_API_MESSAGES.refresh };
  }

  @Post('auth/logout')
  @ApiOperation({
    summary: 'Sign out',
    description: 'Revokes refresh session and clears auth cookies.',
  })
  @ApiOkResponse({ type: MessageEnvelopeDto })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const rawRefresh = this.authService.extractRefreshTokenFromRequest(req);
    await this.authService.revokeRefreshToken(rawRefresh);

    try {
      await auth.api.signOut({
        headers: fromNodeHeaders(req.headers),
      });
    } catch {
      // Better Auth session may already be absent
    }

    this.authService.clearAuthCookies(res);
    return { message: AUTH_API_MESSAGES.signOut };
  }
}
