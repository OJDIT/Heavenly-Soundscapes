"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, Check, Trash, RefreshCw } from "lucide-react"
import AdminAuthCheck from "@/components/admin-auth-check"
import Link from "next/link"

export default function UtilitiesPage() {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleDeleteSpecificFile = async () => {
    if (confirm("Are you sure you want to delete the file '1744684630167 Voice 001' from all storage locations?")) {
      setIsDeleting(true)
      setError(null)
      setResult(null)

      try {
        const response = await fetch("/api/content/delete-specific")

        if (!response.ok) {
          throw new Error(`Failed to delete file: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        setResult(data)
      } catch (err) {
        console.error("Error deleting file:", err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const handleClearAllAudio = async () => {
    if (
      confirm(
        "⚠️ WARNING: This will delete ALL audio files from your system. This action cannot be undone. Are you sure you want to continue?",
      )
    ) {
      setIsClearing(true)
      setError(null)
      setResult(null)

      try {
        const response = await fetch("/api/content/clear-all")

        if (!response.ok) {
          throw new Error(`Failed to clear files: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        setResult(data)
      } catch (err) {
        console.error("Error clearing files:", err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setIsClearing(false)
      }
    }
  }

  const handleManualCleanup = () => {
    try {
      // Get existing audio content
      const storedContent = localStorage.getItem("audioContent")
      if (storedContent) {
        const audioContent = JSON.parse(storedContent)

        // Filter out the problematic file
        const filteredContent = audioContent.filter((item: any) => {
          return !(
            (item.filename && item.filename.includes("1744684630167 Voice 001")) ||
            (item.title && item.title.includes("1744684630167 Voice 001")) ||
            (item.id && item.id.includes("1744684630167"))
          )
        })

        // Save the filtered content back to localStorage
        localStorage.setItem("audioContent", JSON.stringify(filteredContent))

        setResult({
          success: true,
          deletedFromLocalStorage: true,
          message: "Manually removed problematic file from localStorage",
        })
      } else {
        setResult({
          success: false,
          message: "No audio content found in localStorage",
        })
      }
    } catch (err) {
      console.error("Error with manual cleanup:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    }
  }

  const handleManualClearAll = () => {
    try {
      // Clear all audio content
      localStorage.setItem("audioContent", JSON.stringify([]))

      // Clear featured tracks
      localStorage.setItem("featuredTracks", JSON.stringify([]))

      setResult({
        success: true,
        clearedFromLocalStorage: true,
        message: "Manually cleared all audio files from localStorage",
      })
    } catch (err) {
      console.error("Error with manual clear all:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    }
  }

  return (
    <AdminAuthCheck>
      <div className="container py-12 pt-24">
        <h1 className="text-2xl font-bold mb-6">Admin Utilities</h1>

        <div className="border border-gold-500/20 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Clear All Audio Files</h2>
          <p className="mb-4 text-muted-foreground">
            Use this utility to clear ALL audio files from your system. This will give you a clean slate to upload your
            own content.
          </p>

          <div className="flex flex-col gap-4">
            <Button
              onClick={handleClearAllAudio}
              disabled={isClearing}
              className="w-full sm:w-auto flex items-center gap-2"
              variant="destructive"
            >
              <RefreshCw className="h-4 w-4" />
              {isClearing ? "Clearing..." : "Clear All Audio Files"}
            </Button>

            <Button onClick={handleManualClearAll} className="w-full sm:w-auto" variant="outline">
              Manual localStorage Clear Only
            </Button>
          </div>

          {result && result.clearedFromLocalStorage !== undefined && (
            <div className="mt-4 bg-green-500/10 border border-green-500/50 text-green-500 rounded-md p-3">
              <div className="flex items-start gap-2 mb-2">
                <Check className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <p className="font-medium">{result.message}</p>
              </div>

              <div className="text-sm space-y-1 mt-2">
                {result.clearedFromLocalStorage && (
                  <p>✓ Cleared {result.localStorageCount || "all"} files from localStorage</p>
                )}
                {result.clearedFromSupabase && (
                  <p>✓ Cleared {result.supabaseCount || "all"} files from Supabase Storage</p>
                )}
                {result.clearedFromBlob && <p>✓ Cleared {result.blobCount || "all"} files from Vercel Blob</p>}
              </div>

              <div className="mt-4 pt-2 border-t border-green-500/20">
                <p className="text-sm">
                  Your system has been cleared. Go to the{" "}
                  <Link href="/admin/dashboard?tab=upload" className="underline">
                    upload page
                  </Link>{" "}
                  to add your own content.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="border border-gold-500/20 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Delete Specific File</h2>
          <p className="mb-4 text-muted-foreground">
            Use this utility to remove the problematic file "1744684630167 Voice 001" from all storage locations.
          </p>

          <div className="flex flex-col gap-4">
            <Button
              onClick={handleDeleteSpecificFile}
              disabled={isDeleting}
              className="w-full sm:w-auto flex items-center gap-2"
              variant="destructive"
            >
              <Trash className="h-4 w-4" />
              {isDeleting ? "Deleting..." : "Delete Problematic File"}
            </Button>

            <Button onClick={handleManualCleanup} className="w-full sm:w-auto" variant="outline">
              Manual localStorage Cleanup Only
            </Button>
          </div>

          {error && (
            <div className="mt-4 bg-red-500/10 border border-red-500/50 text-red-500 rounded-md p-3 flex items-start gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {result && result.deletedFromLocalStorage !== undefined && (
            <div className="mt-4 bg-green-500/10 border border-green-500/50 text-green-500 rounded-md p-3">
              <div className="flex items-start gap-2 mb-2">
                <Check className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <p className="font-medium">{result.message}</p>
              </div>

              <div className="text-sm space-y-1 mt-2">
                {result.deletedFromLocalStorage && <p>✓ Removed from localStorage</p>}
                {result.deletedFromSupabase && <p>✓ Removed from Supabase Storage</p>}
                {result.deletedFromBlob && <p>✓ Potentially removed from Vercel Blob</p>}
              </div>
            </div>
          )}
        </div>

        <div className="border border-gold-500/20 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Manual Instructions</h2>
          <p className="mb-2 text-muted-foreground">
            If the automatic deletion doesn't work, you can try these manual steps:
          </p>

          <ol className="list-decimal pl-5 space-y-2 text-sm">
            <li>Go to your Admin Dashboard</li>
            <li>Look for any audio files with "1744684630167 Voice 001" in the title</li>
            <li>Delete these files using the delete button in the dashboard</li>
            <li>
              If the file still appears, try clearing your browser's localStorage:
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Open browser DevTools (F12 or right-click → Inspect)</li>
                <li>Go to the "Application" tab</li>
                <li>Select "Local Storage" on the left</li>
                <li>Find the "audioContent" item and delete it</li>
              </ul>
            </li>
            <li>Refresh the page and check if the file is gone</li>
          </ol>
        </div>
      </div>
    </AdminAuthCheck>
  )
}
