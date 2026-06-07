import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from '../auth.service';
import type { AccessTokenPayload } from '../../../lib/auth/utils';

type RequestWithUser = Request & { user?: AccessTokenPayload };

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = this.authService.extractAccessTokenFromRequest(request);

    if (!token) {
      throw new UnauthorizedException('Missing access token');
    }

    request.user = await this.authService.verifyAccessToken(token);
    return true;
  }
}
