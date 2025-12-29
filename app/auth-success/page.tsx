'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthSuccessPage() {
    const [status, setStatus] = useState<'checking' | 'syncing' | 'complete' | 'error'>('checking')
    const [message, setMessage] = useState('Verifying authentication...')
    const router = useRouter()

    useEffect(() => {
        const handleAuthSuccess = async () => {
            // Retry configuration
            const maxRetries = 5
            const initialDelay = 500 // Start with 500ms

            for (let attempt = 0; attempt <= maxRetries; attempt++) {
                try {
                    // Wait before checking (exponential backoff)
                    if (attempt > 0) {
                        const delay = initialDelay * Math.pow(2, attempt - 1)
                        setMessage(`Verifying authentication... (attempt ${attempt}/${maxRetries})`)
                        await new Promise(resolve => setTimeout(resolve, delay))
                    }

                    // Check session
                    const sessionResponse = await fetch('/api/auth/session', {
                        credentials: 'include',
                        cache: 'no-store' // Force fresh request
                    })

                    if (!sessionResponse.ok) {
                        // If not last attempt, retry
                        if (attempt < maxRetries) {
                            continue
                        }
                        throw new Error('No active session found')
                    }

                    const sessionData = await sessionResponse.json()

                    if (!sessionData.session || !sessionData.user) {
                        if (attempt < maxRetries) {
                            continue
                        }
                        throw new Error('Invalid session data')
                    }

                    // ✅ SUCCESS! Session confirmed
                    setStatus('syncing')
                    setMessage('Authentication successful! Syncing your notes...')

                    // Notify extension via message if opened from extension
                    if (window.opener && !window.opener.closed) {
                        window.opener.postMessage({
                            type: 'AUTH_SUCCESS',
                            user: sessionData.user,
                            session: sessionData.session
                        }, '*')
                    }

                    // Wait a moment for sync to initialize
                    await new Promise(resolve => setTimeout(resolve, 2000))

                    setStatus('complete')
                    setMessage('All set! Closing this window...')

                    // Auto-close after 1 second
                    setTimeout(() => {
                        window.close()

                        // If close fails, show manual instruction
                        setTimeout(() => {
                            setMessage('Please close this tab and return to the extension.')
                        }, 500)
                    }, 1000)

                    // Break out of retry loop on success
                    return

                } catch (error) {
                    // If this was the last attempt, show error
                    if (attempt === maxRetries) {
                        console.error('Auth success handler error:', error)
                        setStatus('error')
                        setMessage(
                            error instanceof Error
                                ? error.message
                                : 'Authentication session could not be verified. Please try signing in again.'
                        )
                    }
                    // Otherwise, continue to next retry
                }
            }
        }

        handleAuthSuccess()
    }, [])

    return (
        <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                {/* Success Icon */}
                <div className="text-center mb-6">
                    {status === 'checking' && (
                        <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}
                    {status === 'syncing' && (
                        <div className="w-16 h-16 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-indigo-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </div>
                    )}
                    {status === 'complete' && (
                        <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
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

                    <h1 className="text-2xl font-bold text-gray-900">
                        {status === 'checking' && 'Verifying...'}
                        {status === 'syncing' && 'Syncing Notes'}
                        {status === 'complete' && 'Success!'}
                        {status === 'error' && 'Error'}
                    </h1>
                    <p className="text-gray-600 mt-2">{message}</p>
                </div>

                {/* Progress Indicator */}
                {(status === 'checking' || status === 'syncing') && (
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <div className="bg-indigo-600 h-2 rounded-full animate-pulse" style={{ width: status === 'checking' ? '33%' : '66%' }} />
                    </div>
                )}

                {/* Manual Close Button (if auto-close fails) */}
                {status === 'complete' && (
                    <button
                        onClick={() => window.close()}
                        className="w-full mt-4 bg-indigo-600 text-white rounded-xl py-3 px-6 font-semibold hover:bg-indigo-700 transition-all"
                    >
                        Close Window
                    </button>
                )}

                {status === 'error' && (
                    <button
                        onClick={() => router.push('/signin')}
                        className="w-full mt-4 bg-red-600 text-white rounded-xl py-3 px-6 font-semibold hover:bg-red-700 transition-all"
                    >
                        Try Again
                    </button>
                )}
            </div>
        </main>
    )
}
