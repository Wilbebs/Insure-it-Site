import { Pool } from 'pg';

// Use explicit connection parameters for more reliable connection
export const pool = new Pool({
  host: 'database-1.c69qosw28o1m.us-east-1.rds.amazonaws.com',
  port: 5432,
  user: 'wilbebs',
  password: process.env.DB_PASSWORD || '0221021wW!!',
  database: 'postgres',
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
