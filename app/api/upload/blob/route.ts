import { NextResponse } from "next/server"
import { put } from "@vercel/blob"

// Maximum file size for Vercel Blob (500MB)
const BLOB_MAX_SIZE = 500 * 1024 * 1024

export async function POST(request: Request) {
  try {
    // Check if the request is too large
    const contentLength = request.headers.get("content-length")
    if (contentLength && Number.parseInt(contentLength) > BLOB_MAX_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: `Request too large. Maximum size is ${BLOB_MAX_SIZE / (1024 * 1024)}MB. Please use the URL upload method instead.`,
        },
        { status: 413 },
      )
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const title = formData.get("title") as string
    const category = formData.get("category") as string
    const description = formData.get("description") as string
    const price = formData.get("price") as string

    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 })
    }

    console.log("Uploading file to Vercel Blob:", file.name, "Size:", file.size, "Type:", file.type)

    try {
      // Generate a unique filename
      const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`

      // Upload to Vercel Blob
      const blob = await put(`audio/${filename}`, file, {
        access: "public",
        contentType: file.type,
        token: process.env.BLOB_READ_WRITE_TOKEN || "",
      })

      console.log("File uploaded successfully to Vercel Blob:", blob.url)

      // Create a unique ID for the audio
      const audioId = `audio-${Date.now()}`

      // Create audio metadata
      const newAudio = {
        id: audioId,
        title: title || filename.replace(/\.\w+$/, "").replace(/-/g, " "),
        category: category || "Audio",
        description: description || "Uploaded audio file",
        price: price ? Number(price) : 29.99,
        filename: filename,
        url: blob.url,
        path: blob.pathname,
        storageType: "blob", // Mark this as stored in Blob
        size: file.size,
        type: file.type,
        duration: "3:45", // In a real app, you'd calculate this
        dateAdded: new Date().toISOString(),
      }

      // Store in localStorage
      try {
        const existingContent = localStorage.getItem("audioContent")
        const audioContent = existingContent ? JSON.parse(existingContent) : []
        audioContent.push(newAudio)
        localStorage.setItem("audioContent", JSON.stringify(audioContent))
        console.log("Saved audio metadata to localStorage")
      } catch (storageError) {
        console.error("Failed to save to localStorage:", storageError)
      }

      return NextResponse.json({
        success: true,
        url: blob.url,
        file: newAudio,
      })
    } catch (blobError) {
      console.error("Vercel Blob upload error:", blobError)
      return NextResponse.json(
        { success: false, error: `Failed to upload to Vercel Blob: ${blobError.message || "Unknown error"}` },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error in blob upload API route:", error)
    return NextResponse.json(
      { success: false, error: `Upload failed: ${error.message || "Unknown error"}` },
      { status: 500 },
    )
  }
}
