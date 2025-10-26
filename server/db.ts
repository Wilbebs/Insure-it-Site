import { Pool } from 'pg';

export const pool = new Pool({
  host: 'database-1.c69qosw28o1m.us-east-1.rds.amazonaws.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: '0221021wW!!', // Put your actual password
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