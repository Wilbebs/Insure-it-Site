import { Pool } from 'pg';

const connectionString = process.env.RDS_DATABASE_URL || process.env.DATABASE_URL;

export const pool = new Pool({
  host: process.env.RDS_HOST || undefined,
  port: process.env.RDS_PORT ? parseInt(process.env.RDS_PORT) : undefined,
  user: process.env.RDS_USER || undefined,
  password: process.env.RDS_PASSWORD || undefined,
  database: process.env.RDS_DBNAME || undefined,
  connectionString: (process.env.RDS_HOST ? undefined : connectionString),
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err);
});
