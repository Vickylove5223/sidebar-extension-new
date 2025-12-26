import { betterAuth } from "better-auth"

export const auth = betterAuth({
    // ✅ Base configuration
    baseURL: process.env.BETTER_AUTH_URL || "https://sidebar-notepads.vercel.app",
    secret: process.env.BETTER_AUTH_SECRET!,

    // ✅ Database (Vercel Postgres for production)
    database: {
        provider: "postgres",
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
            prompt: "consent", // For testing - remove later
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
        crossSiteCookies: true, // ✅ CRITICAL: Allow extension to send cookies
        useSecureCookies: process.env.NODE_ENV === "production"
    }
})
