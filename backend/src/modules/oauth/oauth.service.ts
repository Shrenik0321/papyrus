import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { fromNodeHeaders, toNodeHandler } from 'better-auth/node';
import { auth, GOOGLE_OAUTH_PROVIDER } from '../../lib/auth/utils';
import { OAUTH_API_MESSAGES } from './utils';

@Injectable()
export class OauthService {
  private readonly nodeHandler = toNodeHandler(auth);

  forwardToBetterAuth(req: Request, res: Response): Promise<void> {
    const originalUrl = req.originalUrl ?? req.url;
    if (!originalUrl.startsWith('/api/oauth')) {
      req.url = `/api/oauth${req.url.startsWith('/') ? '' : '/'}${req.url}`;
    } else {
      req.url = originalUrl;
    }
    return this.nodeHandler(req, res);
  }

  async startGoogleSignIn(
    req: Request,
    res: Response,
    callbackURL: string,
  ): Promise<string> {
    const { headers, response } = await auth.api.signInSocial({
      body: {
        provider: GOOGLE_OAUTH_PROVIDER,
        callbackURL,
        disableRedirect: true,
      },
      headers: fromNodeHeaders(req.headers),
      returnHeaders: true,
    });

    this.applySetCookieHeaders(res, headers);

    if (!response?.url) {
      throw new InternalServerErrorException(
        OAUTH_API_MESSAGES.googleSignInFailed,
      );
    }

    return response.url;
  }

  /** Forward Better Auth OAuth state cookies to the browser (required for callback). */
  private applySetCookieHeaders(res: Response, headers: Headers | null): void {
    if (!headers) {
      return;
    }

    const setCookies =
      typeof headers.getSetCookie === 'function'
        ? headers.getSetCookie()
        : headers.get('set-cookie')
          ? [headers.get('set-cookie')!]
          : [];

    for (const cookie of setCookies) {
      res.append('Set-Cookie', cookie);
    }
  }
}
