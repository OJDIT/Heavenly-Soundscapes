import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Admin - Heavenly Soundscapes",
  description: "Admin dashboard for Heavenly Soundscapes",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-gold-500/20 bg-background/95 backdrop-blur-md">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative flex items-center">
              <Image
                src="/logo.png"
                alt="Heavenly Soundscapes Logo"
                width={28}
                height={28}
                className="h-6 w-6 text-gold-500"
              />
              <div className="absolute inset-0 bg-gold-500/20 rounded-full blur-md"></div>
            </div>
            <span className="font-playfair font-bold text-lg">
              Heavenly <span className="gold-text">Soundscapes</span>
            </span>
          </Link>
          <span className="ml-4 text-sm text-muted-foreground">Admin Portal</span>
        </div>
      </div>
      {children}
    </div>
  )
}
