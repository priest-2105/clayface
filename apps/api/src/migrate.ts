import { readFile } from 'node:fs/promises';
import { Pool, transaction } from './database';

if (!process.env.DATABASE_URL) throw new Error('Set DATABASE_URL in .env first.');
const db = new Pool({ connectionString: process.env.DATABASE_URL });
try {
  await transaction(db, async tx => {
    await tx.query('SELECT pg_advisory_xact_lock(730214)');
    await tx.query('CREATE TABLE IF NOT EXISTS clayface_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())');
    for (const name of ['0001_server_foundation.sql', '0002_accounts_onboarding.sql']) {
      if ((await tx.query('SELECT 1 FROM clayface_migrations WHERE name=$1', [name])).rowCount) continue;
      await tx.query(await readFile(new URL(`../../../packages/persistence/migrations/${name}`, import.meta.url), 'utf8'));
      await tx.query('INSERT INTO clayface_migrations(name) VALUES ($1)', [name]);
      console.log(`Applied ${name}`);
    }
  });
} finally { await db.end(); }
