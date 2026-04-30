// ─────────────────────────────────────────────────────────────────────────────
// RDS connection DISABLED for the time being.
// To re-enable: uncomment the block below and delete the Proxy stub at the end.
// ─────────────────────────────────────────────────────────────────────────────
//
// import { Pool } from 'pg';
//
// export const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false
//   }
// });
//
// pool.on('connect', () => {
//   console.log('✅ Connected to PostgreSQL database');
// });
//
// pool.on('error', (err) => {
//   console.error('❌ Database connection error:', err);
// });

// Stub `pool` so existing imports (server/routes.ts, server/pgStorage.ts,
// server/migrate.ts) still compile while the DB is offline. Any real call
// (pool.query, pool.connect, etc.) throws a clear runtime error.
const dbDisabledHandler: ProxyHandler<Record<string, unknown>> = {
  get(_target, prop) {
    throw new Error(
      `RDS connection is disabled. Tried to access pool.${String(prop)} — re-enable in server/db.ts to use the database.`
    );
  },
};
export const pool: any = new Proxy({}, dbDisabledHandler);
