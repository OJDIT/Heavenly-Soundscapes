"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, Check, RefreshCw, Trash } from "lucide-react"
import AdminAuthCheck from "@/components/admin-auth-check"
import Link from "next/link"

export default function DeepCleanPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [localStorageCleared, setLocalStorageCleared] = useState(false)

  const handleDeepClean = async () => {
    if (
      confirm(
        "⚠️ WARNING: This will perform a deep clean of ALL audio files from your system. This action cannot be undone. Are you sure you want to continue?",
      )
    ) {
      setIsLoading(true)
      setError(null)
      setResult(null)
      setLocalStorageCleared(false)

      try {
        // 1. Clear localStorage first
        localStorage.setItem("audioContent", "[]")
        localStorage.setItem("featuredTracks", "[]")
        setLocalStorageCleared(true)

        // 2. Call the deep-clean API
        const response = await fetch("/api/content/deep-clean")

        if (!response.ok) {
          throw new Error(`Failed to perform deep clean: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        setResult(data)
      } catch (err) {
        console.error("Error during deep clean:", err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleManualClear = () => {
    try {
      localStorage.setItem("audioContent", "[]")
      localStorage.setItem("featuredTracks", "[]")
      localStorage.setItem("videoContent", "[]")
      setLocalStorageCleared(true)
      setResult({
        success: true,
        message: "Local storage cleared successfully",
      })
    } catch (err) {
      console.error("Error clearing localStorage:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    }
  }

  return (
    <AdminAuthCheck>
      <div className="container py-12 pt-24">
        <h1 className="text-2xl font-bold mb-6">Deep Clean Utility</h1>

        <div className="border border-red-500/20 rounded-lg p-6 mb-8 bg-red-500/5">
          <h2 className="text-xl font-semibold mb-4 text-red-500">Emergency Deep Clean</h2>
          <p className="mb-4 text-muted-foreground">
            Use this utility only when standard cleaning methods have failed. This will aggressively remove ALL audio
            files from your system.
          </p>

          <div className="flex flex-col gap-4">
            <Button
              onClick={handleDeepClean}
              disabled={isLoading}
              className="w-full sm:w-auto flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Trash className="h-4 w-4" />}
              {isLoading ? "Performing Deep Clean..." : "Perform Emergency Deep Clean"}
            </Button>

            <Button onClick={handleManualClear} className="w-full sm:w-auto" variant="outline">
              Manual localStorage Clear Only
            </Button>
          </div>

          {error && (
            <div className="mt-4 bg-red-500/10 border border-red-500/50 text-red-500 rounded-md p-3 flex items-start gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {(result || localStorageCleared) && (
            <div className="mt-4 bg-green-500/10 border border-green-500/50 text-green-500 rounded-md p-3">
              <div className="flex items-start gap-2 mb-2">
                <Check className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <p className="font-medium">Deep clean completed</p>
              </div>

              <div className="text-sm space-y-1 mt-2">
                {localStorageCleared && <p>✓ Cleared localStorage (audioContent and featuredTracks)</p>}
                {result?.supabase?.success && <p>✓ {result.supabase.message}</p>}
                {result?.blob?.success && <p>✓ {result.blob.message}</p>}
              </div>

              <div className="mt-4 pt-2 border-t border-green-500/20">
                <p className="text-sm">
                  Your system has been deep cleaned. Go to the{" "}
                  <Link href="/admin/dashboard?tab=upload" className="underline">
                    upload page
                  </Link>{" "}
                  to add your own content.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="border border-gold-500/20 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">After Deep Clean</h2>
          <p className="mb-2 text-muted-foreground">After performing a deep clean, follow these steps:</p>

          <ol className="list-decimal pl-5 space-y-2 text-sm">
            <li>Refresh the page completely</li>
            <li>Go to the Admin Dashboard Upload tab</li>
            <li>Try uploading a new audio file using the Simple Upload method first</li>
            <li>Check if the file appears in the Audio tab of the dashboard</li>
            <li>Visit the homepage to see if the featured track appears</li>
            <li>Visit the store page to verify the audio is listed there</li>
          </ol>
        </div>
      </div>
    </AdminAuthCheck>
  )
}
