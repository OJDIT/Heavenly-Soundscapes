import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

// Maximum file size for Supabase (50MB)
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

export async function POST(request: Request) {
  // Check content length header to reject too large requests early
  const contentLength = request.headers.get("content-length")
  if (contentLength && Number.parseInt(contentLength) > MAX_FILE_SIZE) {
    return NextResponse.json(
      { success: false, error: `File size exceeds the 50MB limit. Please upload a smaller file.` },
      { status: 413 },
    )
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const title = formData.get("title") as string
    const category = formData.get("category") as string
    const description = formData.get("description") as string
    const price = formData.get("price") as string

    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 })
    }

    // Double-check file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: `File size exceeds the 50MB limit. Please upload a smaller file.` },
        { status: 413 },
      )
    }

    console.log(`Uploading audio file to Supabase:`, file.name, "Size:", file.size, "Type:", file.type)

    // Get the Supabase client
    const supabase = createServerSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ success: false, error: "Failed to initialize Supabase client" }, { status: 500 })
    }

    // Ensure the bucket exists
    try {
      const { data: bucketData, error: bucketError } = await supabase.storage.getBucket("audio-files")

      if (bucketError) {
        if (bucketError.message.includes("does not exist") || bucketError.message.includes("not found")) {
          // Create the bucket if it doesn't exist
          const { error: createError } = await supabase.storage.createBucket("audio-files", {
            public: true,
            fileSizeLimit: MAX_FILE_SIZE,
          })

          if (createError) {
            return NextResponse.json(
              { success: false, error: `Failed to create bucket: ${createError.message}` },
              { status: 500 },
            )
          }
        } else {
          return NextResponse.json({ success: false, error: `Bucket error: ${bucketError.message}` }, { status: 500 })
        }
      }
    } catch (bucketError) {
      console.error("Error checking/creating bucket:", bucketError)
      return NextResponse.json(
        { success: false, error: `Error checking storage bucket: ${bucketError.message}` },
        { status: 500 },
      )
    }

    // Generate a unique filename
    const filename = `audio-${Date.now()}-${file.name.replace(/\s+/g, "-")}`

    try {
      // Convert File to ArrayBuffer
      const arrayBuffer = await file.arrayBuffer()
      const buffer = new Uint8Array(arrayBuffer)

      // Upload the file
      const { data, error } = await supabase.storage.from("audio-files").upload(filename, buffer, {
        contentType: file.type,
        upsert: true,
      })

      if (error) {
        console.error("Supabase upload error:", error)
        return NextResponse.json({ success: false, error: `Upload failed: ${error.message}` }, { status: 500 })
      }

      // Get the public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("audio-files").getPublicUrl(data.path)

      // Create a unique ID for the audio
      const audioId = `audio-${Date.now()}`

      // Create audio metadata
      const newAudio = {
        id: audioId,
        title: title || file.name.replace(/\.\w+$/, "").replace(/-/g, " "),
        category: category || "Audio",
        description: description || "Uploaded audio file",
        price: price ? Number(price) : 29.99,
        filename: file.name,
        url: publicUrl,
        path: data.path,
        storageType: "supabase",
        size: file.size,
        type: file.type,
        duration: "3:45", // In a real app, you'd calculate this
        dateAdded: new Date().toISOString(),
      }

      return NextResponse.json({
        success: true,
        file: newAudio,
        url: publicUrl,
      })
    } catch (uploadError) {
      console.error("Upload error:", uploadError)
      return NextResponse.json(
        { success: false, error: `Upload failed: ${uploadError.message || "Unknown error"}` },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error in upload-simple API route:", error)
    return NextResponse.json(
      { success: false, error: `Upload failed: ${error.message || "Unknown error"}` },
      { status: 500 },
    )
  }
}
