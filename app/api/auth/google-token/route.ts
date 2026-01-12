import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { account } from "@/lib/schema";
import { eq } from "drizzle-orm";

/**
 * GET /api/auth/google-token
 * 
 * Returns the user's Google access token from their Better Auth account.
 * This allows the Chrome extension to use the same token for Google Drive sync
 * instead of requiring a separate OAuth flow.
 */
export async function GET(request: Request) {
    try {
        // Get Better Auth session
        const session = await auth.api.getSession({ headers: request.headers });

        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        // Find the user's Google account in the database
        const accounts = await db
            .select()
            .from(account)
            .where(eq(account.userId, session.user.id));

        const googleAccount = accounts.find(a => a.providerId === 'google');

        if (!googleAccount) {
            return NextResponse.json(
                { error: 'No Google account linked' },
                { status: 404 }
            );
        }

        if (!googleAccount.accessToken) {
            return NextResponse.json(
                { error: 'No access token available. Please re-authenticate with Google.' },
                { status: 404 }
            );
        }

        // Check if token is expired
        const isExpired = googleAccount.accessTokenExpiresAt &&
            new Date(googleAccount.accessTokenExpiresAt) < new Date();

        if (isExpired) {
            // Token is expired, try to refresh it
            // Note: Better Auth should handle refresh automatically on next request
            // For now, return an error indicating re-auth is needed
            return NextResponse.json(
                {
                    error: 'Access token expired. Please re-authenticate with Google.',
                    expired: true
                },
                { status: 401 }
            );
        }

        // Calculate time until expiry for client-side caching
        let expiresIn = null;
        if (googleAccount.accessTokenExpiresAt) {
            const expiryTime = new Date(googleAccount.accessTokenExpiresAt).getTime();
            expiresIn = Math.max(0, Math.floor((expiryTime - Date.now()) / 1000));
        }

        return NextResponse.json({
            accessToken: googleAccount.accessToken,
            expiresAt: googleAccount.accessTokenExpiresAt?.toISOString() || null,
            expiresIn: expiresIn,
            scopes: googleAccount.scope?.split(' ') || []
        });

    } catch (error) {
        console.error('[Google Token] Error:', error);
        return NextResponse.json(
            { error: 'Failed to get Google token' },
            { status: 500 }
        );
    }
}
