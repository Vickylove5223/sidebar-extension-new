export default function Home() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="text-center px-4">
                <h1 className="text-5xl font-bold text-gray-900 mb-4">
                    Sidebar Notepads PRO
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                    Your notes, always at your side
                </p>
                <a
                    href="https://chromewebstore.google.com"
                    className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                    Add to Chrome
                </a>
            </div>
        </main>
    )
}
