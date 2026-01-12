import { db } from "./db";
import * as schema from "./schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { polar, checkout, webhooks } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";

// Initialize Polar SDK client
const polarClient = new Polar({
    accessToken: process.env.POLAR_ACCESS_TOKEN!,
    // Use sandbox for development, production for live
    server: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'
});

export const auth = betterAuth({
    // ✅ CRITICAL: secret is required by Better Auth
    secret: process.env.BETTER_AUTH_SECRET!,
    // Explicitly set baseURL matching user guide advice
    baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "https://sidebar-notepads.vercel.app",
    trustedOrigins: [
        process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "https://sidebar-notepads.vercel.app",
        "chrome-extension://ghlieciaoaeoecmofbfeifkmlbolamfh",
    ],
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            user: schema.user,
            session: schema.session,
            account: schema.account,
            verification: schema.verification,
        },
    }),
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            accessType: "offline",
            // ✅ FIXED: Documentation specifies "select_account consent" (space-separated)
            // This ensures BOTH account selection AND consent, guaranteeing refresh tokens
            prompt: "select_account consent",
            // ✅ Request Google Drive permissions upfront during sign-in
            scopes: [
                "openid",
                "profile",
                "email",
                "https://www.googleapis.com/auth/drive.file",
                "https://www.googleapis.com/auth/drive.appdata"
            ]
        },
    },
    plugins: [
        nextCookies(),
        polar({
            client: polarClient,
            // Automatically create Polar customer when user signs up
            createCustomerOnSignUp: true,
            use: [
                checkout({
                    // Map product IDs to friendly slugs
                    products: [
                        {
                            productId: process.env.POLAR_YEARLY_PLAN_ID!,
                            slug: "pro_yearly"
                        },
                        {
                            productId: process.env.POLAR_LIFETIME_PLAN_ID!,
                            slug: "pro_lifetime"
                        }
                    ],
                    // Redirect to auth-success page after payment
                    successUrl: "/auth-success?checkout_id={CHECKOUT_ID}",
                    // Only authenticated users can checkout
                    authenticatedUsersOnly: true
                }),
                webhooks({
                    secret: process.env.POLAR_WEBHOOK_SECRET!,
                    // Handle successful payment
                    onOrderPaid: async (payload) => {
                        console.log('[Polar] Order paid:', {
                            orderId: payload.data.id,
                            customerId: payload.data.customerId,
                            amount: payload.data.amount
                        });
                        // Polar automatically updates customer state
                        // Extension will poll session-status to detect Pro upgrade
                    },
                    // Handle subscription activation
                    onSubscriptionActive: async (payload) => {
                        console.log('[Polar] Subscription activated:', {
                            subscriptionId: payload.data.id,
                            customerId: payload.data.customerId
                        });
                    },
                    // Handle subscription cancellation
                    onSubscriptionCanceled: async (payload) => {
                        console.log('[Polar] Subscription canceled:', {
                            subscriptionId: payload.data.id,
                            customerId: payload.data.customerId
                        });
                    },
                    // Catch-all for debugging
                    onPayload: async (payload) => {
                        console.log('[Polar] Webhook received:', payload.type);
                    }
                })
            ]
        })
    ],
});
