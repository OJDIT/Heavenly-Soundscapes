import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import { list, del } from "@vercel/blob"

export async function GET(request: Request) {
  try {
    // 1. Clear localStorage (this won't work server-side, but included for documentation)
    // This needs to be done client-side

    // 2. Clear from Supabase Storage
    let supabaseResults = { success: false, message: "Not attempted", count: 0 }
    try {
      const supabase = createServerSupabaseClient()
      if (supabase) {
        // List files in the audio-files bucket
        const { data: files, error } = await supabase.storage.from("audio-files").list()

        if (!error && files && files.length > 0) {
          // Delete all files in the bucket
          const filePaths = files.map((file) => file.name)
          const { error: deleteError } = await supabase.storage.from("audio-files").remove(filePaths)

          if (!deleteError) {
            supabaseResults = {
              success: true,
              message: `Cleared ${files.length} files from Supabase`,
              count: files.length,
            }
          } else {
            supabaseResults = {
              success: false,
              message: `Error: ${deleteError.message}`,
              count: 0,
            }
          }
        } else {
          supabaseResults = {
            success: true,
            message: "No files found in Supabase",
            count: 0,
          }
        }
      }
    } catch (supabaseError) {
      console.error("Error with Supabase deletion:", supabaseError)
      supabaseResults = {
        success: false,
        message: `Error: ${supabaseError.message || "Unknown Supabase error"}`,
        count: 0,
      }
    }

    // 3. Clear from Vercel Blob
    let blobResults = { success: false, message: "Not attempted", count: 0 }
    try {
      // List all blobs with audio prefix
      const { blobs } = await list({ prefix: "audio/" })

      if (blobs.length > 0) {
        // Delete each blob
        let deletedCount = 0
        for (const blob of blobs) {
          try {
            await del(blob.url)
            deletedCount++
          } catch (blobError) {
            console.error("Error deleting blob:", blob.url, blobError)
          }
        }

        blobResults = {
          success: true,
          message: `Cleared ${deletedCount} of ${blobs.length} files from Vercel Blob`,
          count: deletedCount,
        }
      } else {
        blobResults = {
          success: true,
          message: "No files found in Vercel Blob",
          count: 0,
        }
      }
    } catch (blobError) {
      console.error("Error with Blob deletion:", blobError)
      blobResults = {
        success: false,
        message: `Error: ${blobError.message || "Unknown Blob error"}`,
        count: 0,
      }
    }

    return NextResponse.json({
      success: true,
      message: "Deep clean completed",
      supabase: supabaseResults,
      blob: blobResults,
      instructions:
        'You must also clear localStorage on the client side. Run \'localStorage.setItem("audioContent", "[]")\' in your browser console.',
    })
  } catch (error) {
    console.error("Error in deep-clean API route:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unknown error occurred",
      },
      { status: 500 },
    )
  }
}
