import 'dotenv/config';
import { AppDataSource } from '../index';

async function runMigrations(): Promise<void> {
  await AppDataSource.initialize();
  const migrations = await AppDataSource.runMigrations();

  if (migrations.length === 0) {
    console.log('No pending migrations.');
  } else {
    console.log(
      `Ran ${migrations.length} migration(s): ${migrations.map((m) => m.name).join(', ')}`,
    );
  }

  await AppDataSource.destroy();
}

runMigrations().catch((error: unknown) => {
  console.error('Migration failed.', error);
  process.exit(1);
});
