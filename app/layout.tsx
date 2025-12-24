import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
    title: "Sidebar Notepads PRO",
    description: "Your notes, always at your side",
}

export default function RootLayout({
    children,
}: {
    children: React.Node
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}
