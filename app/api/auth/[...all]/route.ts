import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// ✅ Force dynamic - prevents static generation
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// ✅ Standard Better Auth export pattern
export const { POST, GET } = toNextJsHandler(auth);


