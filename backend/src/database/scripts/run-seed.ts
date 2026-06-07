import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { SeedRunner } from '../seeds/seed.runner';

async function runSeed(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    await app.get(SeedRunner).run();
    console.log('Database seeding completed.');
  } finally {
    await app.close();
  }
}

runSeed().catch((error: unknown) => {
  console.error('Database seeding failed.', error);
  process.exit(1);
});
