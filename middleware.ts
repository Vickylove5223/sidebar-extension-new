import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define allowed origins
const ALLOWED_ORIGINS = [
    'https://sidebar-notepads.vercel.app',
    'https://sidebar-notepads.com',
    'http://localhost:3000' // For local development
]

export function middleware(request: NextRequest) {
    const origin = request.headers.get('origin')
    const response = NextResponse.next()

    // Handle CORS
    if (origin) {
        // Check if origin is in the allowed list or is a valid Chrome extension
        if (isAllowedOrigin(origin)) {
            response.headers.set('Access-Control-Allow-Origin', origin)
            response.headers.set('Access-Control-Allow-Credentials', 'true')
            response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
        }
    }

    // Handle preflight OPTIONS request specifically
    if (request.method === 'OPTIONS') {
        const preflightResponse = new NextResponse(null, { status: 200 })

        if (origin && isAllowedOrigin(origin)) {
            preflightResponse.headers.set('Access-Control-Allow-Origin', origin)
            preflightResponse.headers.set('Access-Control-Allow-Credentials', 'true')
            preflightResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            preflightResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
        }

        return preflightResponse
    }

    return response
}

function isAllowedOrigin(origin: string): boolean {
    // 1. Check strict allowed domains
    if (ALLOWED_ORIGINS.includes(origin)) {
        return true
    }

    // 2. Check for Allowed Extension IDs
    if (origin.startsWith('chrome-extension://')) {
        const extensionId = origin.replace('chrome-extension://', '')
        const allowedIds = (process.env.ALLOWED_EXTENSION_IDS || '').split(',').map(id => id.trim()).filter(Boolean)

        // If no IDs configured in env, we fallback to strictly blocking unless it matches a hardcoded ID if we had one.
        // For now, we rely on the env var. 
        // SECURITY NOTE: If env var is empty, NO extensions are allowed.
        if (allowedIds.includes(extensionId)) {
            return true
        }
    }

    return false
}

export const config = {
    matcher: '/api/:path*',
}
