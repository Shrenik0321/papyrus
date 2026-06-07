import { Module } from '@nestjs/common';
import { SeedBootstrap } from './seeds/seed.bootstrap';
import { SeedRunner } from './seeds/seed.runner';

@Module({
  providers: [SeedRunner, SeedBootstrap],
})
export class DatabaseModule {}
