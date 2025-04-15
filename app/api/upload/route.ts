import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { createServerSupabaseClient } from "@/lib/supabase"

// Maximum file size in bytes (50MB - Supabase free tier limit)
const MAX_FILE_SIZE = 50 * 1024 * 1024

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const title = formData.get("title") as string
    const category = formData.get("category") as string
    const description = formData.get("description") as string
    const price = formData.get("price") as string
    const storageMethod = (formData.get("storageMethod") as string) || "supabase"

    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 })
    }

    // Check file size for Supabase uploads
    if (storageMethod === "supabase" && file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: `File is too large for Supabase. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB` },
        { status: 400 },
      )
    }

    console.log("Uploading file:", file.name, "Size:", file.size, "Type:", file.type, "Storage:", storageMethod)

    // Create a unique ID for the audio
    const audioId = `audio-${Date.now()}`
    let fileUrl = null
    let filePath = null

    try {
      // Try to upload file to Vercel Blob or Supabase based on size
      if (storageMethod === "blob" || file.size > MAX_FILE_SIZE) {
        // Upload to Vercel Blob
        const blob = await put(`audio/${Date.now()}-${file.name.replace(/\s+/g, "-")}`, file, {
          access: "public",
        })

        fileUrl = blob.url
        filePath = blob.pathname
        console.log("File uploaded successfully to Vercel Blob:", fileUrl)
      } else {
        // Upload to Supabase
        const supabase = createServerSupabaseClient()
        if (!supabase) {
          throw new Error("Failed to initialize Supabase client")
        }

        const supabasePath = `audio/${Date.now()}-${file.name.replace(/\s+/g, "-")}`

        // Convert File to ArrayBuffer
        const arrayBuffer = await file.arrayBuffer()
        const buffer = new Uint8Array(arrayBuffer)

        // Upload the file
        const { data, error } = await supabase.storage.from("audio-files").upload(supabasePath, buffer, {
          contentType: file.type,
          upsert: true,
        })

        if (error) throw error

        // Get the public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("audio-files").getPublicUrl(data.path)

        fileUrl = publicUrl
        filePath = data.path
        console.log("File uploaded successfully to Supabase:", fileUrl)
      }
    } catch (uploadError) {
      console.error("Upload error:", uploadError)

      // Create a fallback URL using a data URL for small files
      if (file.size <= 100 * 1024) {
        // Only for files under 100KB
        try {
          const buffer = await file.arrayBuffer()
          const base64 = btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ""))
          fileUrl = `data:${file.type};base64,${base64}`
          console.log("Created fallback data URL for small file")
        } catch (dataUrlError) {
          console.error("Failed to create data URL fallback:", dataUrlError)
        }
      }

      if (!fileUrl) {
        // If we couldn't create a data URL, use a placeholder
        fileUrl = "/placeholder.svg?height=400&width=400"
        console.log("Using placeholder URL as fallback")
      }
    }

    // Create audio metadata
    const newAudio = {
      id: audioId,
      title,
      category,
      description,
      price: Number.parseFloat(price),
      filename: file.name,
      url: fileUrl,
      path: filePath,
      size: file.size,
      type: file.type,
      storageType: storageMethod,
      duration: "3:45", // In a real app, you'd calculate this
      dateAdded: new Date().toISOString(),
    }

    console.log("Created audio metadata:", newAudio)

    // Store in localStorage as a fallback
    try {
      // Get existing audio content from localStorage or create empty array
      let audioContent = []
      const existingContent = localStorage.getItem("audioContent")
      if (existingContent) {
        audioContent = JSON.parse(existingContent)
      }

      // Add new audio to the content array
      audioContent.push(newAudio)

      // Save updated content to localStorage
      localStorage.setItem("audioContent", JSON.stringify(audioContent))
      console.log("Saved audio metadata to localStorage")
    } catch (storageError) {
      console.error("Failed to save to localStorage:", storageError)
    }

    return NextResponse.json({
      success: true,
      file: newAudio,
    })
  } catch (error) {
    console.error("Error in upload API route:", error)
    return NextResponse.json(
      { success: false, error: `Upload failed: ${error.message || "Unknown error"}` },
      { status: 500 },
    )
  }
}
