import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

// Maximum chunk size (2MB)
const MAX_CHUNK_SIZE = 2 * 1024 * 1024 // 2MB
// Maximum file size for Supabase (50MB)
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

// In-memory storage for chunks (this will be cleared when the serverless function restarts)
const chunkStorage = new Map<string, Array<Buffer>>()

export async function POST(request: Request) {
  try {
    const formData = await request.formData()

    // Get chunk information
    const chunk = formData.get("chunk") as Blob
    const chunkIndex = Number.parseInt(formData.get("chunkIndex") as string)
    const totalChunks = Number.parseInt(formData.get("totalChunks") as string)
    const fileName = formData.get("fileName") as string
    const fileType = formData.get("fileType") as string
    const title = formData.get("title") as string
    const category = formData.get("category") as string
    const description = formData.get("description") as string
    const price = formData.get("price") as string

    // Validate chunk
    if (!chunk) {
      return NextResponse.json({ success: false, error: "No chunk uploaded" }, { status: 400 })
    }

    // Check chunk size
    if (chunk.size > MAX_CHUNK_SIZE) {
      return NextResponse.json(
        { success: false, error: `Chunk size exceeds the ${MAX_CHUNK_SIZE / (1024 * 1024)}MB limit.` },
        { status: 413 },
      )
    }

    console.log(`Processing chunk ${chunkIndex + 1}/${totalChunks} for file: ${fileName}`)

    // Create a unique ID for this upload session
    const sessionId = `${fileName}-${Date.now()}`

    // Convert chunk to buffer
    const chunkBuffer = Buffer.from(await chunk.arrayBuffer())

    // Store chunk in memory
    if (!chunkStorage.has(sessionId)) {
      chunkStorage.set(sessionId, [])
    }

    const chunks = chunkStorage.get(sessionId)
    chunks[chunkIndex] = chunkBuffer

    // Check if we have all chunks
    const receivedChunks = chunks.filter(Boolean).length

    // If this is the last chunk, combine all chunks and upload to Supabase
    if (receivedChunks === totalChunks) {
      console.log(`Received all chunks. Combining chunks for ${fileName}...`)

      // Combine chunks
      const combinedFile = Buffer.concat(chunks)

      // Check total file size
      if (combinedFile.length > MAX_FILE_SIZE) {
        // Clean up memory
        chunkStorage.delete(sessionId)

        return NextResponse.json(
          { success: false, error: `Combined file size exceeds the ${MAX_FILE_SIZE / (1024 * 1024)}MB limit.` },
          { status: 413 },
        )
      }

      // Upload combined file to Supabase
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
              throw new Error(`Failed to create bucket: ${createError.message}`)
            }
          } else {
            throw new Error(`Bucket error: ${bucketError.message}`)
          }
        }
      } catch (bucketError) {
        console.error("Error checking/creating bucket:", bucketError)
      }

      // Upload the combined file
      const { data, error } = await supabase.storage.from("audio-files").upload(fileName, combinedFile, {
        contentType: fileType,
        upsert: true,
      })

      // Clean up memory
      chunkStorage.delete(sessionId)

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
        title: title || fileName.replace(/\.\w+$/, "").replace(/-/g, " "),
        category: category || "Audio",
        description: description || "Uploaded audio file",
        price: price ? Number(price) : 29.99,
        filename: fileName,
        url: publicUrl,
        path: data.path,
        storageType: "supabase",
        size: combinedFile.length,
        type: fileType,
        duration: "3:45", // In a real app, you'd calculate this
        dateAdded: new Date().toISOString(),
      }

      return NextResponse.json({
        success: true,
        file: newAudio,
        url: publicUrl,
        message: "File uploaded successfully",
      })
    } else {
      // If not all chunks received yet, just acknowledge receipt
      return NextResponse.json({
        success: true,
        message: `Chunk ${chunkIndex + 1}/${totalChunks} received (${receivedChunks}/${totalChunks} total)`,
      })
    }
  } catch (error) {
    console.error("Error in upload-chunk API route:", error)
    return NextResponse.json(
      { success: false, error: `Upload failed: ${error.message || "Unknown error"}` },
      { status: 500 },
    )
  }
}
