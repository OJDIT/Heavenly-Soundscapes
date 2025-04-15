import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import { del } from "@vercel/blob"

export async function GET(request: Request) {
  try {
    const targetFileName = "1744684630167 Voice 001"
    const targetFileId = "1744684630167"
    let deletedFromLocalStorage = false
    let deletedFromSupabase = false
    let deletedFromBlob = false

    // 1. Remove from localStorage
    try {
      // Get existing audio content
      const storedContent = localStorage.getItem("audioContent")
      if (storedContent) {
        const audioContent = JSON.parse(storedContent)

        // Filter out the problematic file
        const filteredContent = audioContent.filter((item: any) => {
          return !(
            item.filename?.includes(targetFileName) ||
            item.title?.includes(targetFileName) ||
            item.id?.includes(targetFileId)
          )
        })

        // Save the filtered content back to localStorage
        if (filteredContent.length !== audioContent.length) {
          localStorage.setItem("audioContent", JSON.stringify(filteredContent))
          deletedFromLocalStorage = true
          console.log("Removed problematic file from localStorage")
        }
      }
    } catch (storageError) {
      console.error("Error accessing localStorage:", storageError)
    }

    // 2. Remove from Supabase Storage
    try {
      const supabase = createServerSupabaseClient()
      if (supabase) {
        // List files in the audio-files bucket
        const { data: files, error } = await supabase.storage.from("audio-files").list()

        if (!error && files) {
          // Find files that match the target name
          const matchingFiles = files.filter(
            (file) => file.name.includes(targetFileName) || file.name.includes(targetFileId),
          )

          // Delete matching files
          if (matchingFiles.length > 0) {
            const filePaths = matchingFiles.map((file) => file.name)
            const { error: deleteError } = await supabase.storage.from("audio-files").remove(filePaths)

            if (!deleteError) {
              deletedFromSupabase = true
              console.log("Removed problematic file(s) from Supabase:", filePaths)
            } else {
              console.error("Error deleting from Supabase:", deleteError)
            }
          }
        }
      }
    } catch (supabaseError) {
      console.error("Error with Supabase deletion:", supabaseError)
    }

    // 3. Try to remove from Vercel Blob if it exists there
    try {
      // We don't have a direct way to list blobs, but we can try to delete by potential paths
      const potentialPaths = [
        `audio/${targetFileId}-Voice-001.mp3`,
        `audio/${targetFileId}-Voice-001.wav`,
        `audio/${targetFileId}-Voice-001.m4a`,
        `audio/${targetFileId} Voice 001.mp3`,
        `audio/${targetFileId} Voice 001.wav`,
        `audio/${targetFileId} Voice 001.m4a`,
      ]

      for (const path of potentialPaths) {
        try {
          await del(path)
          deletedFromBlob = true
          console.log("Potentially removed file from Vercel Blob:", path)
        } catch (blobError) {
          // Ignore errors as we're just trying potential paths
        }
      }
    } catch (blobError) {
      console.error("Error with Blob deletion:", blobError)
    }

    return NextResponse.json({
      success: true,
      deletedFromLocalStorage,
      deletedFromSupabase,
      deletedFromBlob,
      message: "Attempted to remove the problematic file from all storage locations",
    })
  } catch (error) {
    console.error("Error in delete-specific API route:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unknown error occurred",
      },
      { status: 500 },
    )
  }
}
