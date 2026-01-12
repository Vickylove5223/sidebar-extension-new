'use client';

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function AuthSuccessContent() {
    const [status, setStatus] = useState<'checking' | 'syncing' | 'complete' | 'error'>('checking')
    const [message, setMessage] = useState('Verifying authentication...')
    const router = useRouter()
    const searchParams = useSearchParams()
    const checkoutId = searchParams.get('checkout_id')

    useEffect(() => {
        const handleAuthSuccess = async () => {
            // Check if this is a post-payment callback
            const isPaymentCallback = !!checkoutId

            if (isPaymentCallback) {
                // ✅ POST-PAYMENT FLOW
                setMessage('🎉 Payment successful! Setting up your Pro account...')
                setStatus('syncing')

                // Give Polar webhook time to process (2-3 seconds)
                await new Promise(resolve => setTimeout(resolve, 2500))

                // Verify session and Pro status
                try {
                    const sessionResponse = await fetch('/api/auth/session-status', {
                        credentials: 'include',
                        cache: 'no-store'
                    })

                    if (sessionResponse.ok) {
                        const sessionData = await sessionResponse.json()

                        if (sessionData.hasPro) {
                            setMessage('✅ Pro account activated! Syncing your notes to Google Drive...')

                            // Notify extension about successful payment
                            if (window.opener && !window.opener.closed) {
                                window.opener.postMessage({
                                    type: 'PAYMENT_SUCCESS',
                                    user: sessionData.user,
                                    plan: sessionData.plan
                                }, '*')
                            }

                            setStatus('complete')
                            setMessage('All done! Your notes are now syncing. Closing this window...')

                            // Auto-close after 3 seconds
                            setTimeout(() => {
                                window.close()
                                setTimeout(() => {
                                    setMessage('Please close this tab and return to the extension.')
                                }, 500)
                            }, 3000)
                            return
                        }
                    }

                    // If Pro status not yet confirmed, show message
                    setStatus('complete')
                    setMessage('Payment processing... Your Pro features will be activated shortly. You can close this window.')

                } catch (error) {
                    console.error('Payment verification error:', error)
                    setStatus('error')
                    setMessage('Payment received but verification failed. Please refresh the extension.')
                }

            } else {
                // ✅ AUTH-ONLY FLOW (No payment yet)
                // Retry configuration for session verification
                const maxRetries = 5
                const initialDelay = 500

                for (let attempt = 0; attempt <= maxRetries; attempt++) {
                    try {
                        if (attempt > 0) {
                            const delay = initialDelay * Math.pow(2, attempt - 1)
                            setMessage(`Verifying authentication... (attempt ${attempt}/${maxRetries})`)
                            await new Promise(resolve => setTimeout(resolve, delay))
                        }

                        const sessionResponse = await fetch('/api/auth/session', {
                            credentials: 'include',
                            cache: 'no-store'
                        })

                        if (!sessionResponse.ok) {
                            if (attempt < maxRetries) continue
                            throw new Error('No active session found')
                        }

                        const sessionData = await sessionResponse.json()

                        if (!sessionData.session || !sessionData.user) {
                            if (attempt < maxRetries) continue
                            throw new Error('Invalid session data')
                        }

                        // ✅ AUTH SUCCESS!
                        console.log('[AuthSuccess] Session verified successfully');

                        // Check for pending checkout plan stored before OAuth
                        const pendingPlan = localStorage.getItem('pending_checkout_plan');
                        console.log('[AuthSuccess] Pending plan from localStorage:', pendingPlan);

                        if (pendingPlan) {
                            // User came from pricing flow - redirect to checkout
                            setStatus('syncing')
                            setMessage('Creating checkout session...')
                            localStorage.removeItem('pending_checkout_plan');

                            try {
                                // Create checkout session
                                const checkoutResponse = await fetch('/api/checkout/create', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    credentials: 'include',
                                    body: JSON.stringify({ plan: pendingPlan })
                                });

                                if (checkoutResponse.ok) {
                                    const checkoutData = await checkoutResponse.json();

                                    if (checkoutData.checkoutUrl) {
                                        setStatus('complete')
                                        setMessage('Redirecting to payment...')

                                        // Notify extension that auth was successful (will complete payment flow)
                                        if (window.opener && !window.opener.closed) {
                                            window.opener.postMessage({
                                                type: 'AUTH_SUCCESS',
                                                user: sessionData.user,
                                                session: sessionData.session,
                                                redirectingToCheckout: true
                                            }, '*')
                                        }

                                        // Redirect to Polar checkout
                                        setTimeout(() => {
                                            window.location.href = checkoutData.checkoutUrl;
                                        }, 1000);
                                        return;
                                    }
                                }

                                // Checkout creation failed - fallback to normal flow
                                console.error('[AuthSuccess] Failed to create checkout');
                                setStatus('error')
                                setMessage('Failed to create checkout. Please try upgrading from the extension.');

                            } catch (checkoutError) {
                                console.error('[AuthSuccess] Checkout error:', checkoutError);
                                setStatus('error')
                                setMessage('Error creating checkout. Please try again from the extension.');
                            }
                            return;
                        }

                        // No pending plan - regular auth flow (just notify extension)
                        setStatus('complete')
                        setMessage('Signed in successfully!')

                        // Notify extension
                        if (window.opener && !window.opener.closed) {
                            window.opener.postMessage({
                                type: 'AUTH_SUCCESS',
                                user: sessionData.user,
                                session: sessionData.session
                            }, '*')
                        }

                        // Auto-close after 2 seconds
                        setTimeout(() => {
                            window.close()
                            setTimeout(() => {
                                setMessage('Please close this tab.')
                            }, 500)
                        }, 2000)

                        return

                    } catch (error) {
                        if (attempt === maxRetries) {
                            console.error('Auth success handler error:', error)
                            setStatus('error')
                            setMessage(
                                error instanceof Error
                                    ? error.message
                                    : 'Authentication session could not be verified. Please try signing in again.'
                            )
                        }
                    }
                }
            }
        }

        handleAuthSuccess()
    }, [checkoutId])

    return (
        <main className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-black/10 p-8">
                {/* Success Icon */}
                <div className="text-center mb-6">
                    {status === 'checking' && (
                        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
                        </div>
                    )}
                    {status === 'syncing' && (
                        <div className="w-16 h-16 mx-auto bg-[#ECFF71]/20 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-black animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </div>
                    )}
                    {status === 'complete' && (
                        <div className="w-16 h-16 mx-auto bg-[#ECFF71] rounded-full flex items-center justify-center mb-4 shadow-lg">
                            <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                    )}
                    {status === 'error' && (
                        <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                    )}

                    <h1 className="text-2xl font-bold text-black" style={{ fontWeight: 800 }}>
                        {status === 'checking' && 'Verifying...'}
                        {status === 'syncing' && 'Syncing Notes'}
                        {status === 'complete' && 'Success!'}
                        {status === 'error' && 'Error'}
                    </h1>
                    <p className="text-[#666666] mt-2">{message}</p>
                </div>

                {/* Progress Indicator */}
                {(status === 'checking' || status === 'syncing') && (
                    <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                        <div className="bg-black h-2 rounded-full animate-pulse" style={{ width: status === 'checking' ? '33%' : '66%' }} />
                    </div>
                )}

                {/* Manual Close Button (if auto-close fails) */}
                {status === 'complete' && (
                    <button
                        onClick={() => window.close()}
                        className="w-full mt-4 bg-black text-white rounded-xl py-3 px-6 font-semibold hover:bg-[#333] transition-all shadow-lg"
                    >
                        Close Window
                    </button>
                )}

                {status === 'error' && (
                    <button
                        onClick={() => router.push('/signin')}
                        className="w-full mt-4 bg-black text-white rounded-xl py-3 px-6 font-semibold hover:bg-[#333] transition-all"
                    >
                        Try Again
                    </button>
                )}
            </div>
        </main>
    )
}

export default function AuthSuccessPage() {
    return (
        <Suspense fallback={
            <main className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-black/10 p-8">
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
                        </div>
                        <h1 className="text-2xl font-bold text-black" style={{ fontWeight: 800 }}>Loading...</h1>
                    </div>
                </div>
            </main>
        }>
            <AuthSuccessContent />
        </Suspense>
    )
}
