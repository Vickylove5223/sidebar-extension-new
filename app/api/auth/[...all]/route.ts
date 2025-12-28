import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"

const handler = toNextJsHandler(auth);

export async function GET(request: Request) {
    try {
        return await handler.GET(request);
    } catch (error: unknown) {
        console.error('[Auth] GET Error:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return new Response(JSON.stringify({
            error: message,
            hint: 'Check Vercel environment variables: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, DATABASE_URL, BETTER_AUTH_SECRET'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export async function POST(request: Request) {
    try {
        return await handler.POST(request);
    } catch (error: unknown) {
        console.error('[Auth] POST Error:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return new Response(JSON.stringify({
            error: message,
            hint: 'Check Vercel environment variables: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, DATABASE_URL, BETTER_AUTH_SECRET'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
