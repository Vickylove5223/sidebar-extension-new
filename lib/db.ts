import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

// ✅ Simpler approach: Just use process.env.DATABASE_URL
// On Vercel, this is always available at runtime.
// During build, if it's missing, we let it fail or handle it at the call site depending on usage.
// But for Better Auth adapter, it needs a valid db instance.
// We use ! assertion because we know it exists in production.
export const db = drizzle(neon(process.env.DATABASE_URL!));
