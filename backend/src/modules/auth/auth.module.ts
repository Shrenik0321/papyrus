// Registers auth controllers, hybrid JWT service, repository, and Better Auth integration.
import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';
import { User } from '../user/entities/user.entity';
import { auth, registerAuthService } from '../../lib/auth/utils';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repo';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { RefreshSession } from './entities/refresh-session.entity';

@Module({
  imports: [
    BetterAuthModule.forRoot({
      auth,
      disableControllers: true,
      disableGlobalAuthGuard: true,
      bodyParser: {
        json: { enabled: false },
        urlencoded: { enabled: false },
      },
    }),
    TypeOrmModule.forFeature([User, RefreshSession]),
  ],
  controllers: [AuthController],
  providers: [AuthRepository, AuthService, JwtAuthGuard, RolesGuard],
  exports: [AuthService, JwtAuthGuard, RolesGuard],
})
export class AuthModule implements OnModuleInit {
  constructor(private readonly authService: AuthService) {}

  onModuleInit(): void {
    registerAuthService(this.authService);
  }
}
