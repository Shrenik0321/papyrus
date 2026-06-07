import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
import { Pool } from 'pg';

async function runAuthMigrations(): Promise<void> {
  const initialSql = path.join(__dirname, '..', 'initial.sql');

  if (!fs.existsSync(initialSql)) {
    console.log('No Better Auth migrations found; skipping.');
    return;
  }

  const pool = new Pool({
    host: process.env.DATABASE_HOST!,
    port: Number(process.env.DATABASE_PORT!),
    user: process.env.DATABASE_USER!,
    password: process.env.DATABASE_PASSWORD!,
    database: process.env.DATABASE_NAME!,
  });

  try {
    const sql = fs.readFileSync(initialSql, 'utf8');
    await pool.query(sql);
    console.log('Better Auth schema applied.');
  } finally {
    await pool.end();
  }
}

runAuthMigrations().catch((error: unknown) => {
  console.error('Better Auth migration failed.', error);
  process.exit(1);
});
