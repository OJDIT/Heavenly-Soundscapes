import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { ScrollToTop } from "@/components/scroll-to-top"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Heavenly Soundscapes | Premium Recording Studio",
  description:
    "Where Sound Meets Perfection. Professional music recording, mixing, mastering, and production services. Book your session today.",
  keywords: ["recording studio", "music production", "mixing", "mastering", "audio engineering", "podcast recording"],
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  other: {
    "trustpilot-one-time-domain-verification-id": "95cc9115-2f8f-4b6d-88c1-5e521ddbe0c2",
  },
  openGraph: {
    title: "Heavenly Soundscapes | Premium Recording Studio",
    description: "Where Sound Meets Perfection. Professional music recording, mixing, and mastering services.",
    type: "website",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <ScrollToTop />
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
