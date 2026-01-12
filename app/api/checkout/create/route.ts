import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { Polar } from "@polar-sh/sdk";

// Determine Polar environment - use explicit POLAR_SANDBOX env var
// On Vercel, NODE_ENV is always 'production', so we need an explicit flag
const useSandbox = process.env.POLAR_SANDBOX === 'true';

// Initialize Polar SDK client
const polarClient = new Polar({
    accessToken: process.env.POLAR_ACCESS_TOKEN!,
    server: useSandbox ? 'sandbox' : 'production'
});

// Product IDs mapping - use both naming conventions for compatibility
const PRODUCT_IDS: Record<string, string> = {
    pro_yearly: process.env.POLAR_YEARLY_PLAN_ID || process.env.POLAR_PRODUCT_YEARLY || '4678413a-4109-48c6-9d72-fe842b255e4b',
    pro_lifetime: process.env.POLAR_LIFETIME_PLAN_ID || process.env.POLAR_PRODUCT_LIFETIME || '873fe78c-55d0-4de0-919f-4cbe5ffc9f10'
};

const BACKEND_URL = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'https://sidebar-notepads.vercel.app';

/**
 * POST /api/checkout/create
 * 
 * Creates a Polar checkout session for the authenticated user.
 * Requires the user to be signed in.
 */
export async function POST(request: Request) {
    try {
        // Get Better Auth session
        const session = await auth.api.getSession({ headers: request.headers });

        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Not authenticated. Please sign in first.' },
                { status: 401 }
            );
        }

        // Parse request body
        const body = await request.json();
        const { plan } = body;

        if (!plan || !PRODUCT_IDS[plan]) {
            return NextResponse.json(
                { error: 'Invalid plan selected' },
                { status: 400 }
            );
        }

        const productId = PRODUCT_IDS[plan];
        console.log('[Checkout] Creating checkout for user:', session.user.email, 'plan:', plan, 'productId:', productId);

        // Create Polar checkout
        const checkout = await polarClient.checkouts.create({
            products: [productId],
            successUrl: `${BACKEND_URL}/auth-success?checkout_id={CHECKOUT_ID}`,
            customerEmail: session.user.email,
            metadata: {
                userId: session.user.id,
                plan: plan
            }
        });

        console.log('[Checkout] Created checkout:', checkout.id);

        return NextResponse.json({
            checkoutUrl: checkout.url,
            checkoutId: checkout.id
        });

    } catch (error) {
        console.error('[Checkout] Error creating checkout:', error);

        // Extract error details for debugging
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const errorDetails = error instanceof Error && 'cause' in error ? error.cause : undefined;

        console.error('[Checkout] Error details:', {
            message: errorMessage,
            details: errorDetails,
            stack: error instanceof Error ? error.stack : undefined
        });

        return NextResponse.json(
            { error: `Failed to create checkout: ${errorMessage}` },
            { status: 500 }
        );
    }
}
