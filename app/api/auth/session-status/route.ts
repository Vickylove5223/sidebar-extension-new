import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { Polar } from "@polar-sh/sdk";

// Force dynamic rendering (uses request.headers for auth)
export const dynamic = 'force-dynamic';

// Initialize Polar SDK client
const polarClient = new Polar({
    accessToken: process.env.POLAR_ACCESS_TOKEN!,
    server: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'
});

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

        // Check if user has Pro via Polar SDK
        // Look up customer by email
        try {
            const customersResponse = await polarClient.customers.list({
                email: session.user.email,
                limit: 1
            });

            const customer = customersResponse.result?.items?.[0];

            if (!customer) {
                // No Polar customer found - free user
                return NextResponse.json({
                    authenticated: true,
                    hasPro: false,
                    plan: null,
                    user: {
                        id: session.user.id,
                        email: session.user.email,
                        name: session.user.name,
                        image: session.user.image
                    }
                });
            }

            // Check for active subscriptions or lifetime purchases
            // ✅ FIX: Properly verify subscription status is 'active', not just that subscriptions exist
            const hasActiveSubscription = (customer as any).subscriptions?.some(
                (sub: { status?: string }) => sub.status === 'active'
            ) || false;
            const hasLifetimePurchase = (customer as any).purchases && (customer as any).purchases.length > 0;
            const hasPro = hasActiveSubscription || hasLifetimePurchase;

            // Determine plan type
            let plan = null;
            if (hasActiveSubscription) {
                plan = 'pro_yearly'; // Subscription = yearly plan
            } else if (hasLifetimePurchase) {
                plan = 'pro_lifetime'; // One-time purchase = lifetime
            }

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

        } catch (polarError) {
            console.error('[Session Status] Polar API error:', polarError);
            // If Polar API fails, assume free user but don't block
            return NextResponse.json({
                authenticated: true,
                hasPro: false,
                plan: null,
                user: {
                    id: session.user.id,
                    email: session.user.email,
                    name: session.user.name,
                    image: session.user.image
                }
            });
        }

    } catch (error) {
        console.error('[Session Status] Error:', error);
        return NextResponse.json(
            { error: 'Failed to get session status' },
            { status: 500 }
        );
    }
}
