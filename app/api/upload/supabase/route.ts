import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

// Maximum file size for Supabase (50MB)
const MAX_FILE_SIZE = 50 * 1024 * 1024

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const bucket = (formData.get("bucket") as string) || "audio-files"
    const path = formData.get("pathname") as string
    const title = formData.get("title") as string
    const category = formData.get("category") as string
    const description = formData.get("description") as string
    const price = formData.get("price") as string

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds the ${MAX_FILE_SIZE / (1024 * 1024)}MB Supabase limit` },
        { status: 400 },
      )
    }

    // Get the Supabase client with service role
    const supabase = createServerSupabaseClient()

    if (!supabase) {
      return NextResponse.json({ error: "Failed to initialize Supabase client" }, { status: 500 })
    }

    // Ensure the bucket exists
    try {
      const { data: bucketData, error: bucketError } = await supabase.storage.getBucket(bucket)

      if (bucketError) {
        if (bucketError.message.includes("does not exist") || bucketError.message.includes("not found")) {
          // Create the bucket if it doesn't exist
          const { error: createError } = await supabase.storage.createBucket(bucket, {
            public: true,
            fileSizeLimit: MAX_FILE_SIZE,
          })

          if (createError) {
            return NextResponse.json({ error: `Failed to create bucket: ${createError.message}` }, { status: 500 })
          }
        } else {
          return NextResponse.json({ error: `Bucket error: ${bucketError.message}` }, { status: 500 })
        }
      }
    } catch (bucketError) {
      console.error("Error checking/creating bucket:", bucketError)
    }

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    // Clean up the path
    const supabasePath = path.startsWith("/") ? path.substring(1) : path

    // Upload the file
    const { data, error } = await supabase.storage.from(bucket).upload(supabasePath, buffer, {
      contentType: file.type,
      upsert: true,
    })

    if (error) {
      console.error("Supabase upload error:", error)
      return NextResponse.json({ error: `Upload failed: ${error.message}` }, { status: 500 })
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path)

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
      path: data.path,
      url: publicUrl,
      file: newAudio,
    })
  } catch (error) {
    console.error("Error in upload API route:", error)
    return NextResponse.json({ error: `Upload failed: ${error.message || "Unknown error"}` }, { status: 500 })
  }
}
