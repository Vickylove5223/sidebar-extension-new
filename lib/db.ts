import { config } from "dotenv";
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

config({ path: ".env" });

// ✅ Handle build time when DATABASE_URL is not available
const getDrizzle = () => {
    if (!process.env.DATABASE_URL) {
        // During build, return a mock that won't be used
        console.warn('[DB] DATABASE_URL not set - using placeholder for build');
        return null;
    }
    const sql = neon(process.env.DATABASE_URL);
    return drizzle(sql);
};

export const db = getDrizzle()!;
