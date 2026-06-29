import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { getDatabaseConfig } from './database/index';
import { OauthModule } from './modules/oauth/oauth.module';
import { UserModule } from './modules/user/user.module';
import { LibraryModule } from './modules/library/library.module';
import { WorkspaceModule } from './modules/workspace/workspace.module';
import { FileStorageModule } from './modules/file-storage/file-storage.module';
import { ChatModule } from './modules/chat/chat.module';
import { SettingsModule } from './modules/settings/settings.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...getDatabaseConfig(),
      autoLoadEntities: true,
    }),
    AuthModule,
    OauthModule,
    DatabaseModule,
    UserModule,
    WorkspaceModule,
    FileStorageModule,
    LibraryModule,
    ChatModule,
    SettingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
