export default function Home() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-20">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Logo/Icon */}
                    <div className="mb-8">
                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                        Sidebar Notepads PRO
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-600 mb-8">
                        Your notes, always at your side while you browse
                    </p>

                    {/* Features */}
                    <div className="grid md:grid-cols-3 gap-6 mb-12 text-left">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Lightning Fast</h3>
                            <p className="text-gray-600 text-sm">Quick access to your notes without leaving your current page</p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Cloud Sync</h3>
                            <p className="text-gray-600 text-sm">Sync your notes across devices with Google Drive</p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Secure</h3>
                            <p className="text-gray-600 text-sm">Your data is encrypted and protected</p>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="space-y-4">
                        <a
                            href="https://chromewebstore.google.com"
                            className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                        >
                            Add to Chrome - It's Free
                        </a>
                        <p className="text-sm text-gray-500">
                            Join thousands of users who love Sidebar Notepads PRO
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-gray-200 py-8 mt-20">
                <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
                    <p>&copy; 2024 Sidebar Notepads PRO. All rights reserved.</p>
                </div>
            </footer>
        </main>
    )
}
