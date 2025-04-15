import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import { list, del } from "@vercel/blob"

export async function GET(request: Request) {
  try {
    let clearedFromLocalStorage = false
    let clearedFromSupabase = false
    let clearedFromBlob = false
    let localStorageCount = 0
    let supabaseCount = 0
    let blobCount = 0

    // 1. Clear from localStorage
    try {
      // Get existing audio content
      const storedContent = localStorage.getItem("audioContent")
      if (storedContent) {
        const audioContent = JSON.parse(storedContent)
        localStorageCount = audioContent.length

        // Clear the audio content
        localStorage.setItem("audioContent", JSON.stringify([]))
        clearedFromLocalStorage = true
        console.log(`Cleared ${localStorageCount} audio files from localStorage`)
      }
    } catch (storageError) {
      console.error("Error accessing localStorage:", storageError)
    }

    // 2. Clear from Supabase Storage
    try {
      const supabase = createServerSupabaseClient()
      if (supabase) {
        // List files in the audio-files bucket
        const { data: files, error } = await supabase.storage.from("audio-files").list()

        if (!error && files && files.length > 0) {
          supabaseCount = files.length
          // Delete all files in the bucket
          const filePaths = files.map((file) => file.name)
          const { error: deleteError } = await supabase.storage.from("audio-files").remove(filePaths)

          if (!deleteError) {
            clearedFromSupabase = true
            console.log(`Cleared ${supabaseCount} audio files from Supabase`)
          } else {
            console.error("Error deleting from Supabase:", deleteError)
          }
        }
      }
    } catch (supabaseError) {
      console.error("Error with Supabase deletion:", supabaseError)
    }

    // 3. Try to clear from Vercel Blob
    try {
      // List all blobs
      const { blobs } = await list({ prefix: "audio/" })
      blobCount = blobs.length

      // Delete each blob
      if (blobs.length > 0) {
        for (const blob of blobs) {
          try {
            await del(blob.url)
          } catch (blobError) {
            console.error("Error deleting blob:", blob.url, blobError)
          }
        }
        clearedFromBlob = true
        console.log(`Cleared ${blobCount} audio files from Vercel Blob`)
      }
    } catch (blobError) {
      console.error("Error with Blob deletion:", blobError)
    }

    // 4. Clear featured tracks
    try {
      localStorage.setItem("featuredTracks", JSON.stringify([]))
    } catch (error) {
      console.error("Error clearing featured tracks:", error)
    }

    return NextResponse.json({
      success: true,
      clearedFromLocalStorage,
      clearedFromSupabase,
      clearedFromBlob,
      localStorageCount,
      supabaseCount,
      blobCount,
      message: "Cleared all audio files from storage locations",
    })
  } catch (error) {
    console.error("Error in clear-all API route:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unknown error occurred",
      },
      { status: 500 },
    )
  }
}
