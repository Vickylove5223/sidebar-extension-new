'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
    const [checking, setChecking] = useState(true)
    const router = useRouter()

    useEffect(() => {
        // Check if user just completed OAuth
        const checkAuthAndRedirect = async () => {
            try {
                const res = await fetch('/api/auth/session', {
                    credentials: 'include',
                    cache: 'no-store'
                })

                if (res.ok) {
                    const data = await res.json()

                    if (data.session && data.user) {
                        // User just signed in via OAuth, redirect to auth-success
                        router.push('/auth-success')
                        return
                    }
                }
            } catch (error) {
                console.error('Session check error:', error)
            }

            // No session or not from OAuth, show landing page
            setChecking(false)
        }

        checkAuthAndRedirect()
    }, [router])

    if (checking) {
        return (
            <main className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4">
                        <div className="w-full h-full border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin" />
                    </div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </main>
        )
    }

    return (
        <main>
            <section className="hero" aria-label="Main content">
                <div className="container">
                    <div className="hero-content">
                        {/* Left Column: Favicon, Title, Subtitle, Button */}
                        <div className="hero-left">
                            <div className="hero-favicon">
                                <img src="/icons/sidebar notepads favicon.png" alt="Sidebar Notepads" width="40" height="40" loading="eager" />
                            </div>
                            <div className="hero-text">
                                <h1>Your Everyday Notes, Always One Click Away.</h1>
                                <p className="subtitle">Write, sort, and separate your draft into notes for quick access. Each note saves automatically and stays private in your browser.</p>

                                <a href="https://chromewebstore.google.com/detail/kfmdhphdeiclomoaepkfohdodfeaaded?utm_source=item-share-cb" className="cta-btn" target="_blank" rel="noopener noreferrer">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Google_Chrome_icon_%28February_2022%29.svg/1024px-Google_Chrome_icon_%28February_2022%29.svg.png" alt="Google Chrome browser icon" width="20" height="20" style={{ width: '20px', height: '20px', objectFit: 'contain' }} loading="lazy" />
                                    <span>Install Extension</span>
                                </a>
                            </div>
                            {/* Footer in Left Column */}
                            <div className="hero-footer">
                                <p>© 2025. Built with ❤️ by <a href="https://ifeoluwaajetomobi.framer.website/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'underline', transition: 'color 0.3s ease' }}>Ifeoluwa Ajetomobi</a>. <a href="https://www.paypal.com/ncp/payment/FTYL8B3DQG8WU" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'underline', transition: 'color 0.3s ease' }}>Support me here</a>. <a href="/privacy-policy.html" style={{ color: 'var(--text-secondary)', textDecoration: 'underline', transition: 'color 0.3s ease' }}>Privacy Policy</a>.</p>
                            </div>
                        </div>

                        {/* Right Column: Inspiration Section and Demo GIF */}
                        <div className="hero-right">
                            {/* Mockup Card */}
                            <div className="mockup-wrapper">
                                <div className="mockup-card">
                                    <div className="mockup-header">
                                        <div className="mockup-header-left">
                                            <img src="/icons/sidebar notepads favicon.png" alt="Sidebar Notepads extension logo" width="20" height="20" loading="lazy" />
                                            <span>Sidebar Notepads</span>
                                        </div>
                                        <div className="mockup-header-right">
                                            <div className="mockup-icon" title="New Note">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mockup-search">
                                        <div className="mockup-search-wrapper">
                                            <svg className="mockup-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="11" cy="11" r="8"></circle>
                                                <path d="m21 21-4.35-4.35"></path>
                                            </svg>
                                            <input type="text" placeholder="Search notes..." />
                                        </div>
                                    </div>
                                    <div className="mockup-notes">
                                        <div className="mockup-note-card">
                                            <div className="mockup-note-icon">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                            </div>
                                            <div className="mockup-note-title">Project Ideas</div>
                                            <div className="mockup-note-delete">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="mockup-note-card">
                                            <div className="mockup-note-icon">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                            </div>
                                            <div className="mockup-note-title">My testing password</div>
                                            <div className="mockup-note-delete">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="mockup-note-card">
                                            <div className="mockup-note-icon">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                            </div>
                                            <div className="mockup-note-title">My Prompts</div>
                                            <div className="mockup-note-delete">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="mockup-note-card">
                                            <div className="mockup-note-icon">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                            </div>
                                            <div className="mockup-note-title">debugging rules</div>
                                            <div className="mockup-note-delete">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="mockup-note-card">
                                            <div className="mockup-note-icon">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                            </div>
                                            <div className="mockup-note-title">microcopy for projects</div>
                                            <div className="mockup-note-delete">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Footer with Sticky Note */}
                                <div className="mockup-footer">
                                    <div className="credit-section">
                                        <p>
                                            <strong>Inspired by</strong> <a
                                                href="https://chromewebstore.google.com/detail/jnajbdnopbhnfjjhkpichjdbfobeokjh?utm_source=item-share-cb"
                                                target="_blank" rel="noopener noreferrer">Side Notepad</a>. I&apos;ve always enjoyed using it, but I needed a way to organize different notes separately — so I built Sidebar Notepads to make that possible.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
