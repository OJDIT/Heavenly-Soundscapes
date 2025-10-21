"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createBrowserClient } from "@supabase/ssr"
import Image from "next/image"

export function AdminHeader() {
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/admin" className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="Heavenly Soundscapes"
              width={40}
              height={40}
              className="brightness-0 invert"
            />
            <span className="font-serif text-xl font-bold text-gold">Admin Dashboard</span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link href="/" className="text-gray-400 hover:text-gold transition-colors">
              View Site
            </Link>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-gold bg-transparent"
            >
              Sign Out
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
