import { NextResponse } from "next/server";
import { Polar } from "@polar-sh/sdk";
import { auth } from "@/lib/auth";

// Initialize Polar SDK client
const polarClient = new Polar({
    accessToken: process.env.POLAR_ACCESS_TOKEN!,
    server: process.env.POLAR_SANDBOX === 'true' ? 'sandbox' : 'production'
});

/**
 * GET /api/check-pro-status
 * 
 * Checks if a user has Pro status via Polar.
 * 
 * SECURITY UPDATE:
 * - Now requires authentication via Better Auth session
 * - Removed email query parameter to prevent privacy leaks
 * - Returns boolean status only
 */
export async function GET(request: Request) {
    try {
        // Enforce authentication
        const session = await auth.api.getSession({ headers: request.headers });

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const email = session.user.email;
        console.log('[CheckProStatus] Checking Pro status for authenticated user:', email);

        // Look up customer by email via Polar SDK
        try {
            const customersResponse = await polarClient.customers.list({
                email: email,
                limit: 1
            });

            const customer = customersResponse.result?.items?.[0];

            if (!customer) {
                // No Polar customer found - free user
                return NextResponse.json({
                    hasPro: false,
                    plan: null
                });
            }

            // Check for active subscriptions or lifetime purchases
            const hasActiveSubscription = (customer as any).subscriptions?.some(
                (sub: { status?: string }) => sub.status === 'active'
            ) || false;
            const hasLifetimePurchase = (customer as any).purchases && (customer as any).purchases.length > 0;
            const hasPro = hasActiveSubscription || hasLifetimePurchase;

            // Determine plan type
            let plan = null;
            if (hasActiveSubscription) {
                plan = 'pro_yearly';
            } else if (hasLifetimePurchase) {
                plan = 'pro_lifetime';
            }

            console.log('[CheckProStatus] Result for', email, ':', { hasPro, plan });

            return NextResponse.json({
                hasPro,
                plan
            });

        } catch (polarError) {
            console.error('[CheckProStatus] Polar API error:', polarError);
            return NextResponse.json(
                { error: 'Failed to verify status' },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error('[CheckProStatus] Error:', error);
        return NextResponse.json(
            { error: 'Failed to check Pro status' },
            { status: 500 }
        );
    }
}
