import { Injectable, OnModuleInit } from '@nestjs/common';
import { SeedRunner } from './seed.runner';

@Injectable()
export class SeedBootstrap implements OnModuleInit {
  constructor(private readonly seedRunner: SeedRunner) {}

  async onModuleInit(): Promise<void> {
    if (process.env.RUN_SEEDS === 'false') {
      return;
    }
    await this.seedRunner.run();
  }
}
