import { Pool } from './database';
const url = new URL(process.env.DATABASE_URL ?? '');
if (!['127.0.0.1','localhost'].includes(url.hostname)) throw new Error('This command only creates a local development database.');
const name = url.pathname.slice(1);
if (!/^clayface_(dev|test)$/.test(name)) throw new Error('Use clayface_dev or clayface_test for the local database.');
url.pathname = '/postgres';
const db = new Pool({ connectionString: url.toString() });
try {
  if (!(await db.query('SELECT 1 FROM pg_database WHERE datname=$1', [name])).rowCount) await db.query(`CREATE DATABASE "${name}"`);
  console.log(`Local database ${name} is ready.`);
} finally { await db.end(); }
