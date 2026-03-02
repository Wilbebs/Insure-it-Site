import { pool } from './db';

/**
 * Idempotent schema migration — creates all required tables in RDS if they
 * don't already exist.  Safe to run on every server startup.
 */
export async function runMigrations(): Promise<void> {
    const client = await pool.connect();
    try {
        console.log('🔄 Running database migrations...');

        await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id         VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        username   TEXT NOT NULL UNIQUE,
        password   TEXT NOT NULL
      );
    `);

        await client.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id         VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        email      TEXT NOT NULL UNIQUE,
        full_name  TEXT,
        phone      TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

        await client.query(`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id             VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        contact_id     VARCHAR NOT NULL REFERENCES contacts(id),
        policy_type    TEXT NOT NULL,
        coverage_level TEXT,
        message        TEXT,
        submitted_at   TIMESTAMPTZ DEFAULT NOW()
      );
    `);

        await client.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id            VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        submission_id VARCHAR NOT NULL,
        file_name     TEXT,
        s3_bucket     TEXT,
        s3_key        TEXT,
        file_type     TEXT,
        uploaded_at   TIMESTAMPTZ DEFAULT NOW()
      );
    `);

        await client.query(`
      CREATE TABLE IF NOT EXISTS policy_applications (
        id                       VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        applicant_name           TEXT NOT NULL,
        email                    TEXT NOT NULL,
        phone                    TEXT NOT NULL,
        policy_type              TEXT NOT NULL,
        preferred_contact_method TEXT,
        status                   TEXT NOT NULL DEFAULT 'pending',
        core_details             TEXT,
        auto_details             TEXT,
        home_details             TEXT,
        life_details             TEXT,
        commercial_details       TEXT,
        documents                TEXT[],
        notes                    TEXT,
        created_at               TIMESTAMPTZ DEFAULT NOW(),
        submitted_at             TIMESTAMPTZ DEFAULT NOW()
      );
    `);

        await client.query(`
      CREATE TABLE IF NOT EXISTS feature_requests (
        id          SERIAL PRIMARY KEY,
        title       TEXT NOT NULL,
        description TEXT,
        priority    TEXT NOT NULL DEFAULT 'medium',
        status      TEXT NOT NULL DEFAULT 'open',
        created_at  TIMESTAMPTZ DEFAULT NOW()
      );
    `);

        console.log('✅ Database migrations complete.');
    } catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    } finally {
        client.release();
    }
}
