import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import { del } from "@vercel/blob"

export async function POST(request: Request) {
  try {
    const { bucket, path, contentType, id, storageType } = await request.json()

    // For mock data or placeholder images, skip the deletion
    const isMockData = path.includes("placeholder.svg") || !path.includes("/")

    if (!isMockData) {
      console.log(`Attempting to delete file: ${path} from ${storageType || "supabase"}`)

      // If it's a Blob file
      if (storageType === "blob") {
        try {
          // Try to delete from Vercel Blob
          await del(path)
          console.log(`Successfully deleted file from Vercel Blob: ${path}`)
        } catch (blobError) {
          console.error(`Error deleting file from Vercel Blob: ${blobError.message}`)
          // Continue with local deletion even if Blob deletion fails
        }
      } else if (storageType === "external") {
        // For external URLs, we don't need to delete anything
        console.log(`Skipping deletion for external URL: ${path}`)
      } else {
        // If it's not a Blob file, use Supabase
        if (!bucket) {
          return NextResponse.json({ success: false, error: "Bucket is required" }, { status: 400 })
        }

        // Process the path to ensure it's in the correct format for Supabase
        let filePath = path

        // If the path is a full URL, extract just the filename
        if (path.includes("://")) {
          try {
            const url = new URL(path)
            // Get the last part of the path (the filename)
            filePath = url.pathname.split("/").pop() || path
          } catch (error) {
            console.error("Error parsing URL:", error)
            // If URL parsing fails, try to extract the filename directly
            const parts = path.split("/")
            filePath = parts[parts.length - 1]
          }
        }

        // Get the Supabase client with service role
        const supabase = createServerSupabaseClient()

        if (!supabase) {
          return NextResponse.json({ error: "Failed to initialize Supabase client" }, { status: 500 })
        }

        // Try to delete from Supabase Storage
        const { error } = await supabase.storage.from(bucket).remove([filePath])

        if (error) {
          // If the error is about the file not found, consider it a success
          if (error.message.includes("not found")) {
            console.warn(`File ${filePath} not found in bucket ${bucket}, but continuing with deletion`)
          } else {
            console.error(`Error deleting file from Supabase: ${error.message}`)
            // Continue with local deletion even if Supabase deletion fails
          }
        } else {
          console.log(`Successfully deleted file from Supabase: ${filePath}`)
        }
      }
    }

    // Always remove from localStorage to ensure UI is updated
    try {
      if (contentType === "audio") {
        const storedContent = localStorage.getItem("audioContent")
        if (storedContent) {
          const audioContent = JSON.parse(storedContent)
          const updatedContent = audioContent.filter((item: any) => item.id !== id)
          localStorage.setItem("audioContent", JSON.stringify(updatedContent))
          console.log(`Removed audio with ID ${id} from localStorage`)
        }
      } else if (contentType === "video") {
        const storedContent = localStorage.getItem("videoContent")
        if (storedContent) {
          const videoContent = JSON.parse(storedContent)
          const updatedContent = videoContent.filter((item: any) => item.id !== id)
          localStorage.setItem("videoContent", JSON.stringify(updatedContent))
          console.log(`Removed video with ID ${id} from localStorage`)
        }
      }
    } catch (storageError) {
      console.error("Error updating localStorage:", storageError)
      // Continue even if localStorage update fails
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in delete API route:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unknown error occurred",
      },
      { status: 500 },
    )
  }
}
