import {
  All,
  Controller,
  Get,
  Query,
  Req,
  Res,
  ServiceUnavailableException,
} from '@nestjs/common';
import {
  ApiExcludeEndpoint,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { CORS_ORIGIN, isGoogleOAuthConfigured } from '../../lib/auth/utils';
import { OAUTH_API_MESSAGES } from './utils';
import { OauthService } from './oauth.service';

@ApiTags('OAuth')
@Controller('oauth')
export class OauthController {
  constructor(private readonly oauthService: OauthService) {}

  @Get('google')
  @ApiOperation({
    summary: 'Start Google OAuth sign-in',
    description:
      'Redirects the browser to Google. On success, the callback sets authToken and refreshToken cookies (same as email login).',
  })
  @ApiQuery({
    name: 'callbackURL',
    required: false,
    description: 'Frontend URL to return to after sign-in (defaults to dashboard)',
    example: 'http://localhost:3000/dashboard',
  })
  @ApiResponse({
    status: 302,
    description: 'Redirect to Google authorization URL',
  })
  @ApiResponse({
    status: 503,
    description: 'Google OAuth is not configured (missing client ID/secret)',
  })
  async googleStart(
    @Req() req: Request,
    @Res() res: Response,
    @Query('callbackURL') callbackURL?: string,
  ): Promise<void> {
    if (!isGoogleOAuthConfigured()) {
      throw new ServiceUnavailableException(
        OAUTH_API_MESSAGES.googleNotConfigured,
      );
    }

    const defaultCallback = `${CORS_ORIGIN}/dashboard`;
    const authorizeUrl = await this.oauthService.startGoogleSignIn(
      req,
      res,
      callbackURL ?? defaultCallback,
    );
    res.redirect(authorizeUrl);
  }

  @All('error')
  @ApiExcludeEndpoint()
  async oauthError(@Req() req: Request, @Res() res: Response): Promise<void> {
    await this.oauthService.forwardToBetterAuth(req, res);
  }

  @All('sign-in/social')
  @ApiExcludeEndpoint()
  async signInSocial(@Req() req: Request, @Res() res: Response): Promise<void> {
    await this.oauthService.forwardToBetterAuth(req, res);
  }

  @All('callback/:provider')
  @ApiExcludeEndpoint()
  async callback(@Req() req: Request, @Res() res: Response): Promise<void> {
    await this.oauthService.forwardToBetterAuth(req, res);
  }
}
