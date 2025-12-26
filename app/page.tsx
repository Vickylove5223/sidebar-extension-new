export default function Home() {
    return (
        <main className="min-h-screen bg-white flex items-center justify-center px-4">
            <div className="max-w-2xl mx-auto text-center py-20">
                {/* Extension Icon */}
                <div className="mb-8">
                    <div className="w-24 h-24 mx-auto bg-indigo-600 rounded-3xl flex items-center justify-center shadow-xl">
                        <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </div>
                </div>

                {/* Headline */}
                <h1 className="text-5xl font-bold text-gray-900 mb-4">
                    Sidebar Notepads PRO
                </h1>

                <p className="text-xl text-gray-600 mb-12">
                    Take notes in your browser sidebar while you browse.<br />
                    Simple. Fast. Always there.
                </p>

                {/* CTA Button */}
                <a
                    href="https://chromewebstore.google.com"
                    className="inline-block bg-indigo-600 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
                >
                    Add to Chrome
                </a>

                {/* Simple Features */}
                <div className="mt-16 pt-16 border-t border-gray-200">
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="text-3xl mb-2">⚡</div>
                            <h3 className="font-semibold text-gray-900 mb-1">Quick Access</h3>
                            <p className="text-sm text-gray-600">Always in your sidebar</p>
                        </div>
                        <div>
                            <div className="text-3xl mb-2">☁️</div>
                            <h3 className="font-semibold text-gray-900 mb-1">Cloud Sync</h3>
                            <p className="text-sm text-gray-600">Google Drive backup</p>
                        </div>
                        <div>
                            <div className="text-3xl mb-2">🔒</div>
                            <h3 className="font-semibold text-gray-900 mb-1">Private</h3>
                            <p className="text-sm text-gray-600">Your data stays yours</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-20 pt-8 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                        © 2024 Sidebar Notepads PRO
                    </p>
                </footer>
            </div>
        </main>
    )
}
