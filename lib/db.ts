import { config } from "dotenv";
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

// Load environment variables from .env file (if it exists)
config({ path: ".env" });

// ✅ Direct connection - fails fast if env var is missing
// On Vercel, DATABASE_URL is available at build & runtime.
// Locally, make sure you have a .env file!
export const db = drizzle(neon(process.env.DATABASE_URL!));
