import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// ✅ Create database connection
// During build, DATABASE_URL might not be set - that's okay, it will be set at runtime
function createDb() {
    if (!process.env.DATABASE_URL) {
        console.warn('[DB] DATABASE_URL not set');
        return null;
    }
    const sql = neon(process.env.DATABASE_URL);
    return drizzle(sql);
}

// Create the db instance
// It's okay if this is null during build - it will work at runtime
export const db = createDb()!;
