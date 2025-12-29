import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import { drizzle, NeonHttpDatabase } from 'drizzle-orm/neon-http';

// ✅ Build-safe: Only create connection if DATABASE_URL exists
// During Vercel build, DATABASE_URL might not be available
let sql: NeonQueryFunction<false, false>;
let db: NeonHttpDatabase<Record<string, never>>;

if (process.env.DATABASE_URL) {
    sql = neon(process.env.DATABASE_URL);
    db = drizzle(sql);
} else {
    console.warn('[DB] ⚠️ DATABASE_URL not set - database features disabled during build');
    // Create a placeholder that will throw if used during build
    sql = (() => { throw new Error('DATABASE_URL not configured'); }) as unknown as typeof sql;
    db = {} as unknown as typeof db;
}

export { db, sql };

