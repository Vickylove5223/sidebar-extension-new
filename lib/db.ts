import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// ✅ Create Neon HTTP client (optimized for serverless)
const sql = neon(process.env.DATABASE_URL!);

// ✅ Create Drizzle instance with Neon HTTP
export const db = drizzle(sql);
