import { loadConfig } from './config';
import { Pool } from './database';
import { createServer } from './server';
const config = loadConfig();
const db = new Pool({ connectionString: config.DATABASE_URL, max: 10, connectionTimeoutMillis: 5000 });
const app = await createServer(db, config);
await app.listen({ host: '127.0.0.1', port: Number(process.env.API_PORT ?? 4000) });
console.log(`Clayface API listening on port ${process.env.API_PORT ?? 4000}`);
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, async () => { await app.close(); await db.end(); process.exit(0); });
