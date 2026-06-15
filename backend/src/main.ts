import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';
import cookieParser from 'cookie-parser';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  });

  const storageRoot = process.env.FILE_STORAGE_ROOT ?? 'files';
  app.useStaticAssets(join(process.cwd(), storageRoot), {
    prefix: '/files',
  });

  app.setGlobalPrefix('api');
  setupSwagger(app);
  const port = Number(process.env.PORT);
  await app.listen(port, '0.0.0.0');
}
bootstrap();
