import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import * as schema from "@/lib/schema";

/**
 * GET /api/auth/session-status
 * 
 * Returns the current user's authentication and Pro status.
 * Used by the extension to check if user has paid for Pro.
 */
export async function GET(request: Request) {
    try {
        // Get Better Auth session
        const session = await auth.api.getSession({ headers: request.headers });

        if (!session || !session.user) {
            return NextResponse.json({
                authenticated: false,
                hasPro: false
            });
        }

        // Check if user has Pro via Polar
        // Polar Better Auth plugin automatically creates/updates customer records
        // We need to query the user's accounts to check for Polar connection
        const userAccounts = await db.query.account.findMany({
            where: eq(schema.account.userId, session.user.id)
        });

        // Check if user has active Polar subscription/purchase
        // The Polar plugin stores this info in the account metadata
        const polarAccount = userAccounts.find(acc => acc.providerId === 'polar');
        const hasPro = polarAccount?.metadata?.hasPro || false;
        const plan = polarAccount?.metadata?.plan || null;

        return NextResponse.json({
            authenticated: true,
            hasPro,
            plan,
            user: {
                id: session.user.id,
                email: session.user.email,
                name: session.user.name,
                image: session.user.image
            }
        });

    } catch (error) {
        console.error('[Session Status] Error:', error);
        return NextResponse.json(
            { error: 'Failed to get session status' },
            { status: 500 }
        );
    }
}
