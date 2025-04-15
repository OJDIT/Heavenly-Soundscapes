"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Lock, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AdminSignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  // Initialize default admin credentials if not set
  useEffect(() => {
    if (!localStorage.getItem("adminEmail")) {
      localStorage.setItem("adminEmail", "admin@heavenlysoundscapes.com")
    }
    if (!localStorage.getItem("adminPassword")) {
      localStorage.setItem("adminPassword", "admin123")
    }
    if (!localStorage.getItem("adminName")) {
      localStorage.setItem("adminName", "Admin User")
    }
  }, [])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Get stored credentials
      const storedEmail = localStorage.getItem("adminEmail")
      const storedPassword = localStorage.getItem("adminPassword")

      // Check if credentials match
      if (email === storedEmail && password === storedPassword) {
        // Set authentication flag
        localStorage.setItem("isAuthenticated", "true")
        router.push("/admin/dashboard")
      } else {
        setError("Invalid credentials. Please try again.")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
      <div className="container max-w-md">
        <div className="gold-border bg-black/60 rounded-lg p-6 md:p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-playfair font-bold mb-2">
              Admin <span className="gold-text">Access</span>
            </h1>
            <p className="text-muted-foreground">Sign in to manage your content</p>
          </div>

          {error && (
            <div className="bg-destructive/20 border border-destructive/50 text-destructive rounded-md p-3 mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@heavenlysoundscapes.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-xs text-gold-400 hover:text-gold-300">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gold-500 hover:bg-gold-600 text-primary-foreground"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="text-center text-xs text-muted-foreground mt-4">
              <p>Default credentials:</p>
              <p>Email: admin@heavenlysoundscapes.com</p>
              <p>Password: admin123</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
