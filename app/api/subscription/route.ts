import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { Polar } from "@polar-sh/sdk";

// Determine Polar environment - use explicit POLAR_SANDBOX env var
const useSandbox = process.env.POLAR_SANDBOX === 'true';

// Initialize Polar SDK client
const polarClient = new Polar({
    accessToken: process.env.POLAR_ACCESS_TOKEN!,
    server: useSandbox ? 'sandbox' : 'production'
});

export async function GET(request: Request) {
    try {
        const session = await auth.api.getSession({ headers: request.headers });

        if (!session || !session.user) {
            return NextResponse.json(
                { hasSubscription: false, error: 'Not authenticated' },
                { status: 401 }
            );
        }

        // 1. List valid subscriptions for this user's email
        // We filter by active status to ensure they have access
        const subscriptions = await polarClient.subscriptions.list({
            organizationId: process.env.POLAR_ORG_ID, // Optional if token is scoped? Better to filter by email
            customerEmail: session.user.email,
            page: 1,
            limit: 10
        });

        // Check if any subscription is active
        const activeSubscription = subscriptions.items?.find(
            (sub) => sub.status === 'active'
        );

        if (activeSubscription) {
            return NextResponse.json({
                hasSubscription: true,
                subscription: {
                    id: activeSubscription.id,
                    status: activeSubscription.status,
                    planId: activeSubscription.productId, // mapped property
                    currentPeriodEnd: activeSubscription.currentPeriodEnd
                }
            });
        }

        // 2. Also check one-time orders (Lifetime Plan)
        const orders = await polarClient.orders.list({
            customerEmail: session.user.email,
            page: 1,
            limit: 10
        });

        // Check for completed orders for the lifetime product
        const lifetimeOrder = orders.items?.find(
            (order) =>
            (order.product.name.toLowerCase().includes('lifetime') ||           // Name check
                order.productId === process.env.POLAR_LIFETIME_PLAN_ID ||          // ID check
                order.productId === process.env.POLAR_PRODUCT_LIFETIME)            // Fallback ID check
        );

        if (lifetimeOrder) {
            return NextResponse.json({
                hasSubscription: true,
                subscription: {
                    id: lifetimeOrder.id,
                    status: 'active',
                    planId: lifetimeOrder.productId,
                    isLifetime: true
                }
            });
        }

        return NextResponse.json({
            hasSubscription: false,
            subscription: null
        });

    } catch (error) {
        console.error('[Subscription] Error checking status:', error);
        return NextResponse.json(
            { hasSubscription: false, error: 'Failed to check subscription' },
            { status: 500 }
        );
    }
}
