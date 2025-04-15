import { NextResponse } from "next/server"
import { put } from "@vercel/blob"

// Maximum file size for this API route (4MB)
const MAX_FILE_SIZE = 4 * 1024 * 1024

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
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
        {
          error: `File is too large for this endpoint. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB. Use direct upload for larger files.`,
        },
        { status: 413 },
      )
    }

    console.log("Uploading small file:", file.name, "Size:", file.size, "Type:", file.type)

    try {
      // Generate a unique filename
      const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`

      // Upload to Vercel Blob
      const blob = await put(`audio/${filename}`, file, {
        access: "public",
      })

      console.log("File uploaded successfully to Vercel Blob:", blob.url)

      return NextResponse.json({
        success: true,
        url: blob.url,
        path: blob.pathname,
      })
    } catch (blobError) {
      console.error("Vercel Blob upload error:", blobError)
      return NextResponse.json(
        { error: `Failed to upload to Vercel Blob: ${blobError.message || "Unknown error"}` },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error in small upload API route:", error)
    return NextResponse.json({ error: `Upload failed: ${error.message || "Unknown error"}` }, { status: 500 })
  }
}
