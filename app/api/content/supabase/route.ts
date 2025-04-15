import { NextResponse } from "next/server"
import { listFilesInBucket, getFilePublicUrl } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const contentType = searchParams.get("type") || "audio"
    const bucket = contentType === "audio" ? "audio-files" : "video-files"

    // List files from Supabase Storage
    const { data: files, error } = await listFilesInBucket(bucket)

    if (error) {
      throw error
    }

    // Transform the files into the expected format
    const content = files.map((file) => {
      const isAudio = contentType === "audio"
      const publicUrl = getFilePublicUrl(bucket, file.name)

      // Extract filename without timestamp prefix
      const originalFilename = file.name
        .replace(/^\d+-/, "")
        .replace(/-/g, " ")
        .replace(/\.\w+$/, "")

      return {
        id: `${contentType}-${file.id}`,
        title: originalFilename,
        category: isAudio ? "Music" : "Video",
        description: `${isAudio ? "Audio" : "Video"} file uploaded to Supabase Storage`,
        price: 29.99,
        filename: file.name,
        url: publicUrl,
        size: file.metadata?.size || 0,
        type: isAudio ? "audio/mpeg" : "video/mp4",
        duration: isAudio ? "3:45" : "5:30", // In a real app, you'd calculate this
        dateAdded: file.created_at || new Date().toISOString(),
      }
    })

    return NextResponse.json({ success: true, data: content })
  } catch (error) {
    console.error(`Error fetching ${contentType} content from Supabase:`, error)
    return NextResponse.json({ success: false, error: error.message || "Unknown error" }, { status: 500 })
  }
}
