import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const bucket = formData.get("bucket") as string
    const path = formData.get("path") as string

    if (!file || !bucket || !path) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
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
            fileSizeLimit: 50 * 1024 * 1024, // 50MB
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

    // Upload the file
    const { data, error } = await supabase.storage.from(bucket).upload(path, buffer, {
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

    return NextResponse.json({
      success: true,
      path: data.path,
      url: publicUrl,
    })
  } catch (error) {
    console.error("Error in upload API route:", error)
    return NextResponse.json({ error: `Upload failed: ${error.message || "Unknown error"}` }, { status: 500 })
  }
}
