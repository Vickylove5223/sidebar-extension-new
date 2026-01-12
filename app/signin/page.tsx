'use client'

import { useEffect, useState } from 'react'
import { signIn } from "@/lib/auth-client"

const BACKEND_URL = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'https://sidebar-notepads.vercel.app'

// Polar product IDs (should match your Polar dashboard)
const POLAR_PRODUCTS = {
    pro_yearly: process.env.NEXT_PUBLIC_POLAR_PRODUCT_YEARLY || '4678413a-4109-48c6-9d72-fe842b255e4b',
    pro_lifetime: process.env.NEXT_PUBLIC_POLAR_PRODUCT_LIFETIME || '873fe78c-55d0-4de0-919f-4cbe5ffc9f10'
}

export default function SignInPage() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')
    const [pendingPlan, setPendingPlan] = useState<string | null>(null)

    // Check for plan parameter on load
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const plan = urlParams.get('plan')
        const success = urlParams.get('success')
        const error = urlParams.get('error')

        if (plan) {
            setPendingPlan(plan)
            console.log('[SignIn] Plan parameter detected:', plan)
        }

        if (success === 'true') {
            setStatus('success')
            setMessage('Connected successfully! Redirecting to checkout...')

            // If there's a pending plan, create checkout
            if (plan) {
                createCheckoutAndRedirect(plan)
            } else {
                setMessage('Connected successfully! You can now close this window.')
            }
        } else if (error) {
            setStatus('error')
            setMessage(`Sign-in failed: ${error}`)
        }
    }, [])

    const createCheckoutAndRedirect = async (plan: string) => {
        try {
            setMessage('Creating checkout session...')

            // Call our API to create a Polar checkout
            const response = await fetch('/api/checkout/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ plan })
            })

            if (!response.ok) {
                throw new Error('Failed to create checkout')
            }

            const data = await response.json()

            if (data.checkoutUrl) {
                setMessage('Redirecting to payment...')
                window.location.href = data.checkoutUrl
            } else {
                throw new Error('No checkout URL returned')
            }
        } catch (error) {
            console.error('[SignIn] Checkout error:', error)
            setStatus('error')
            setMessage('Failed to create checkout. Please try again.')
        }
    }

    const handleSignIn = async () => {
        console.log('[SignIn] handleSignIn called');
        setStatus('loading')
        setMessage('Redirecting to Google...')

        try {
            // Store pending plan in localStorage before OAuth redirect
            // This persists through the OAuth flow since callbackURL alone isn't reliable
            if (pendingPlan) {
                localStorage.setItem('pending_checkout_plan', pendingPlan);
                console.log('[SignIn] Stored pending plan in localStorage:', pendingPlan);
            }

            // Include plan in callback URL if present
            const callbackUrl = pendingPlan
                ? `/signin?success=true&plan=${pendingPlan}`
                : '/signin?success=true'

            console.log('[SignIn] Calling signIn.social with callbackURL:', callbackUrl);

            const result = await signIn.social({
                provider: "google",
                callbackURL: callbackUrl
            });

            console.log('[SignIn] signIn.social result:', result);

            // If we get here without redirect, something went wrong
            if (result?.error) {
                throw new Error(result.error.message || 'Sign-in failed');
            }
        } catch (error) {
            console.error('[SignIn] Error:', error);
            setStatus('error')
            setMessage(error instanceof Error ? error.message : 'Failed to start sign-in. Please try again.')
        }
    }

    return (
        <main className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-black/10 p-8">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto mb-4">
                        <img src="/icons/sidebar notepads favicon.png" alt="Sidebar Notepads" className="w-16 h-16 object-contain" />
                    </div>
                    <h1 className="text-2xl font-bold text-black tracking-tight" style={{ fontWeight: 800 }}>Sidebar Notepads PRO</h1>
                    <p className="text-[#666666] mt-2">
                        {pendingPlan
                            ? 'Sign in with Google to complete your purchase'
                            : 'Connect your Google account to sync notes'}
                    </p>
                </div>

                {/* Plan Badge */}
                {pendingPlan && status !== 'success' && (
                    <div className="bg-[#ECFF71]/20 border border-[#ECFF71] rounded-xl p-4 mb-6">
                        <div className="flex items-center justify-center">
                            <span className="text-black font-semibold">
                                {pendingPlan === 'pro_yearly' ? '📅 Annual Plan - $5/year' : '🎁 Lifetime Plan - $18 one-time'}
                            </span>
                        </div>
                    </div>
                )}

                {/* Status Messages */}
                {status === 'success' && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-green-800">{message}</span>
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span className="text-red-800">{message}</span>
                        </div>
                    </div>
                )}

                {/* Sign In Button */}
                {status !== 'success' && (
                    <button
                        onClick={handleSignIn}
                        disabled={status === 'loading'}
                        className="w-full flex items-center justify-center gap-3 bg-black text-white border border-transparent rounded-xl py-4 px-6 font-semibold hover:bg-[#333] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                        {status === 'loading' ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                        )}
                        <span>{status === 'loading' ? 'Connecting...' : 'Sign in with Google'}</span>
                    </button>
                )}

                {/* Permissions Info */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                    <p className="text-xs text-[#666666] text-center">
                        This will allow Sidebar Notepads to:<br />
                        • Access your Google profile<br />
                        • Create and manage notes in Google Drive
                    </p>
                </div>
            </div>
        </main>
    )
}

