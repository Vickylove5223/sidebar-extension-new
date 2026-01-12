import { NextResponse } from "next/server";
import { Polar } from "@polar-sh/sdk";

// Initialize Polar SDK client
const polarClient = new Polar({
    accessToken: process.env.POLAR_ACCESS_TOKEN!,
    server: process.env.POLAR_SANDBOX === 'true' ? 'sandbox' : 'production'
});

/**
 * GET /api/check-pro-status?email=xxx
 * 
 * Public endpoint that checks if a user has Pro status via Polar.
 * Used by the extension to verify payment status without requiring session cookies.
 * 
 * Note: This endpoint is intentionally unauthenticated to allow the extension to check
 * status without complex session management. It only returns boolean status, no sensitive data.
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        console.log('[CheckProStatus] Checking Pro status for:', email);

        // Look up customer by email via Polar SDK
        try {
            const customersResponse = await polarClient.customers.list({
                email: email,
                limit: 1
            });

            const customer = customersResponse.result?.items?.[0];

            if (!customer) {
                // No Polar customer found - free user
                console.log('[CheckProStatus] No customer found for:', email);
                return NextResponse.json({
                    hasPro: false,
                    plan: null
                });
            }

            // Check for active subscriptions or lifetime purchases
            const hasActiveSubscription = customer.subscriptions?.some(
                (sub: { status?: string }) => sub.status === 'active'
            ) || false;
            const hasLifetimePurchase = customer.purchases && customer.purchases.length > 0;
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
                { error: 'Failed to check status' },
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
