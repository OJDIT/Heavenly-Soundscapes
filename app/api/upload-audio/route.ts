import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

// Maximum file size for Vercel Blob
const BLOB_MAX_SIZE = 500 * 1024 * 1024 // 500MB
const SUPABASE_MAX_SIZE = 50 * 1024 * 1024 // 50MB

export async function POST(request: Request) {
  // Check content length header to reject too large requests early
  const contentLength = request.headers.get("content-length")
  if (contentLength && Number.parseInt(contentLength) > BLOB_MAX_SIZE) {
    return NextResponse.json(
      { success: false, error: `File size exceeds the ${BLOB_MAX_SIZE / (1024 * 1024)}MB limit.` },
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
    const pathname = (formData.get("pathname") as string) || `audio/${Date.now()}-${file.name.replace(/\s+/g, "-")}`
    // Get explicitly set storage method or determine based on file size
    const storageMethod =
      (formData.get("storageMethod") as string) || (file.size > SUPABASE_MAX_SIZE ? "blob" : "supabase")

    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 })
    }

    // Check file size
    if (file.size > BLOB_MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: `File size exceeds the ${BLOB_MAX_SIZE / (1024 * 1024)}MB limit.` },
        { status: 413 },
      )
    }

    console.log(`Uploading audio file using ${storageMethod}:`, file.name, "Size:", file.size, "Type:", file.type)

    let fileUrl = ""
    let filePath = ""

    try {
      // Upload based on selected storage method
      if (storageMethod === "blob" || file.size > SUPABASE_MAX_SIZE) {
        // For large files, redirect to the Vercel Blob client-side upload
        return NextResponse.json(
          {
            success: false,
            error: "File too large for direct upload. Please use the client-side upload method.",
            shouldUseClientUpload: true,
          },
          { status: 413 },
        )
      } else {
        // Upload to Supabase
        const supabase = createServerSupabaseClient()
        if (!supabase) {
          throw new Error("Failed to initialize Supabase client")
        }

        // Ensure the bucket exists
        try {
          const { data: bucketData, error: bucketError } = await supabase.storage.getBucket("audio-files")

          if (bucketError) {
            if (bucketError.message.includes("does not exist") || bucketError.message.includes("not found")) {
              // Create the bucket if it doesn't exist
              const { error: createError } = await supabase.storage.createBucket("audio-files", {
                public: true,
                fileSizeLimit: SUPABASE_MAX_SIZE,
              })

              if (createError) {
                throw new Error(`Failed to create bucket: ${createError.message}`)
              }
            } else {
              throw new Error(`Bucket error: ${bucketError.message}`)
            }
          }
        } catch (bucketError) {
          console.error("Error checking/creating bucket:", bucketError)
        }

        // Convert File to ArrayBuffer
        const arrayBuffer = await file.arrayBuffer()
        const buffer = new Uint8Array(arrayBuffer)

        const supabasePath = pathname.startsWith("/") ? pathname.substring(1) : pathname

        // Upload the file
        const { data, error } = await supabase.storage.from("audio-files").upload(supabasePath, buffer, {
          contentType: file.type,
          upsert: true,
        })

        if (error) {
          throw error
        }

        // Get the public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("audio-files").getPublicUrl(data.path)

        fileUrl = publicUrl
        filePath = data.path
        console.log("File uploaded successfully to Supabase:", fileUrl)
      }

      // Create a unique ID for the audio
      const audioId = `audio-${Date.now()}`

      // Create audio metadata
      const newAudio = {
        id: audioId,
        title:
          title ||
          pathname
            .split("/")
            .pop()
            ?.replace(/\.\w+$/, "")
            .replace(/-/g, " ") ||
          "Untitled Audio",
        category: category || "Audio",
        description: description || "Uploaded audio file",
        price: price ? Number(price) : 29.99,
        filename: file.name,
        url: fileUrl,
        path: filePath,
        storageType: storageMethod,
        size: file.size,
        type: file.type,
        duration: "3:45", // In a real app, you'd calculate this
        dateAdded: new Date().toISOString(),
      }

      return NextResponse.json({
        success: true,
        file: newAudio,
        url: fileUrl,
        storageUsed: storageMethod,
      })
    } catch (uploadError) {
      console.error(`${storageMethod} upload error:`, uploadError)
      return NextResponse.json(
        { success: false, error: `Failed to upload to ${storageMethod}: ${uploadError.message || "Unknown error"}` },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error in upload-audio API route:", error)
    return NextResponse.json(
      { success: false, error: `Upload failed: ${error.message || "Unknown error"}` },
      { status: 500 },
    )
  }
}
