import { NextResponse } from "next/server"
import { handleUpload } from "@vercel/blob/client"

export async function POST(request: Request) {
  try {
    const response = await handleUpload({
      request,
      token: process.env.BLOB_READ_WRITE_TOKEN,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        // This is where you can validate the user is authorized, pathname,
        // and any other upload metadata
        console.log("Generating token for path:", pathname)

        // Determine content type based on pathname
        const isVideo = pathname.startsWith("videos/")
        const isAudio = pathname.startsWith("audio/")
        const isThumbnail = pathname.startsWith("thumbnails/")

        return {
          allowedContentTypes: isVideo ? ["video/*"] : isAudio ? ["audio/*"] : isThumbnail ? ["image/*"] : ["*/*"],
          maximumSizeInBytes: 500 * 1024 * 1024, // 500 MB max size
          tokenPayload: clientPayload, // Pass through the original payload
        }
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // This is called after upload is complete
        console.log("Upload completed:", blob.url, "Path:", blob.pathname)

        try {
          // Parse the metadata from tokenPayload
          let metadata = {}
          if (tokenPayload) {
            try {
              metadata = JSON.parse(tokenPayload)
              console.log("Parsed metadata:", metadata)
            } catch (error) {
              console.error("Error parsing token payload:", error)
            }
          }

          // Determine content type based on pathname
          const isVideo = blob.pathname.startsWith("videos/")
          const isAudio = blob.pathname.startsWith("audio/")
          const contentType = isVideo ? "video" : isAudio ? "audio" : "file"

          console.log(`Successfully uploaded ${contentType} to Blob storage`)
        } catch (error) {
          console.error("Error in onUploadCompleted:", error)
        }
      },
    })

    return response
  } catch (error) {
    console.error("Error in upload token handler:", error)
    return NextResponse.json({ error: "Error generating upload token" }, { status: 500 })
  }
}
