import { NextResponse } from "next/server"
import { put } from "@vercel/blob"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const thumbnail = formData.get("thumbnail") as File | null
    const title = formData.get("title") as string
    const category = formData.get("category") as string
    const description = formData.get("description") as string
    const price = formData.get("price") as string

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    console.log("Uploading video file:", file.name, "Size:", file.size, "Type:", file.type)

    try {
      // Upload video file to Vercel Blob
      const videoBlob = await put(`video/${Date.now()}-${file.name.replace(/\s+/g, "-")}`, file, {
        access: "public",
      })

      console.log("Video file uploaded successfully to Vercel Blob:", videoBlob.url)

      // Upload thumbnail if provided
      let thumbnailUrl = null
      if (thumbnail) {
        console.log("Uploading thumbnail:", thumbnail.name)
        const thumbnailBlob = await put(`thumbnails/${Date.now()}-${thumbnail.name.replace(/\s+/g, "-")}`, thumbnail, {
          access: "public",
        })
        thumbnailUrl = thumbnailBlob.url
        console.log("Thumbnail uploaded successfully:", thumbnailUrl)
      }

      // Create a unique ID for the video
      const videoId = `video-${Date.now()}`

      // Create video metadata
      const newVideo = {
        id: videoId,
        title,
        category,
        description,
        price: Number.parseFloat(price),
        filename: file.name,
        url: videoBlob.url,
        thumbnailUrl,
        size: file.size,
        type: file.type,
        duration: "5:30", // In a real app, you'd calculate this
        dateAdded: new Date().toISOString(),
      }

      console.log("Created video metadata:", newVideo)

      return NextResponse.json({
        success: true,
        file: newVideo,
      })
    } catch (blobError) {
      console.error("Vercel Blob upload error:", blobError)
      return NextResponse.json(
        { error: `Failed to upload to Vercel Blob: ${blobError.message || "Unknown error"}` },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error in video upload API route:", error)
    return NextResponse.json({ error: `Upload failed: ${error.message || "Unknown error"}` }, { status: 500 })
  }
}
