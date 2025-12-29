import { betterAuth } from "better-auth"
import { neon } from "@neondatabase/serverless"

// ✅ Validate environment variables at startup
if (!process.env.DATABASE_URL) {
    console.error('[Auth] ❌ DATABASE_URL is not set');
}
if (!process.env.BETTER_AUTH_SECRET) {
    console.error('[Auth] ❌ BETTER_AUTH_SECRET is not set');
}
if (!process.env.GOOGLE_CLIENT_ID) {
    console.error('[Auth] ❌ GOOGLE_CLIENT_ID is not set');
}
if (!process.env.GOOGLE_CLIENT_SECRET) {
    console.error('[Auth] ❌ GOOGLE_CLIENT_SECRET is not set');
}

// ✅ Create Neon HTTP client - better for serverless
const sql = neon(process.env.DATABASE_URL!);

export const auth = betterAuth({
    // ✅ Base configuration
    baseURL: process.env.BETTER_AUTH_URL || "https://sidebar-notepads.vercel.app",
    secret: process.env.BETTER_AUTH_SECRET!,

    // ✅ Database - Using neon HTTP driver (serverless optimized)
    database: {
        provider: "pg",
        url: process.env.DATABASE_URL!
    },

    // ✅ Session configuration
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // 1 day
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60 // 5 minutes
        }
    },

    // ✅ Trusted origins (Chrome extension)
    trustedOrigins: [
        "chrome-extension://ghlieciaoaeoecmofbfeifkmlbolamfh",
        process.env.BETTER_AUTH_URL || "https://sidebar-notepads.vercel.app"
    ],

    // ✅ Google OAuth with Drive scope
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            accessType: "offline",
            prompt: "consent",
            scopes: [
                "openid",
                "profile",
                "email",
                "https://www.googleapis.com/auth/drive.file"
            ]
        }
    },

    // ✅ Advanced settings for Chrome extension
    advanced: {
        crossSubDomainCookies: {
            enabled: true
        },
        crossSiteCookies: true,
        useSecureCookies: process.env.NODE_ENV === "production"
    }
})

console.log('[Auth] ✅ Better Auth initialized successfully');


