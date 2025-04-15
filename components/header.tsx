"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ShoppingBag, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import Image from "next/image"

const navItems = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Store", href: "/store" },
  { name: "Contact", href: "/contact" },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  return (
    <header
      className={`fixed top-0 w-full z-40 transition-all duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur-md shadow-md" : "bg-background/80 backdrop-blur-md"
      } border-b border-gold-500/20`}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative flex items-center">
            <Image
              src="/logo.png"
              alt="Heavenly Soundscapes Logo"
              width={32}
              height={32}
              className="h-8 w-8 text-gold-500"
            />
            <div className="absolute inset-0 bg-gold-500/20 rounded-full blur-md animate-gold-pulse"></div>
          </div>
          <span className="font-playfair font-bold text-xl">
            Heavenly <span className="gold-text">Soundscapes</span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-gold-400 ${
                pathname === item.href ? "text-gold-400" : ""
              }`}
            >
              {item.name}
            </Link>
          ))}
          <Button
            asChild
            variant="default"
            size="sm"
            className="ml-4 bg-gold-500 hover:bg-gold-600 text-primary-foreground"
          >
            <Link href="/store">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Shop
            </Link>
          </Button>
        </nav>

        {/* Mobile menu button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gold-500/20 bg-background/95 backdrop-blur-md">
          <div className="container py-4 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block py-2 text-base font-medium transition-colors hover:text-gold-400 ${
                  pathname === item.href ? "text-gold-400" : ""
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Button
              asChild
              variant="default"
              size="sm"
              className="w-full mt-4 bg-gold-500 hover:bg-gold-600 text-primary-foreground"
            >
              <Link href="/store" onClick={() => setMobileMenuOpen(false)}>
                <ShoppingBag className="mr-2 h-4 w-4" />
                Shop Sound Packs
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
