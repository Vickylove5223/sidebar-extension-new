import { db } from "./db";
import * as schema from "./schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

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
            scopes: [
                "openid",
                "profile",
                "email",
                "https://www.googleapis.com/auth/drive.file"
            ]
        },
    },
    plugins: [
        nextCookies(),
    ],
});
