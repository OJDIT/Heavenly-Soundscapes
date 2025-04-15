import { NextResponse } from "next/server"
import { generateClientTokenFromReadWriteToken } from "@vercel/blob"

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { pathname, clientPayload } = await request.json()

    if (!pathname) {
      return NextResponse.json({ error: "Pathname is required" }, { status: 400 })
    }

    // Get the token from environment variables
    const token = process.env.BLOB_READ_WRITE_TOKEN
    if (!token) {
      return NextResponse.json({ error: "BLOB_READ_WRITE_TOKEN is not configured" }, { status: 500 })
    }

    // Parse metadata if available
    let metadata = {}
    try {
      if (clientPayload) {
        metadata = JSON.parse(clientPayload)
        console.log("Received metadata:", metadata)
      }
    } catch (error) {
      console.error("Error parsing client payload:", error)
    }

    // Determine content type based on pathname
    const isAudio = pathname.startsWith("audio/")

    // Generate the client token
    const clientToken = await generateClientTokenFromReadWriteToken({
      pathname,
      readWriteToken: token,
      tokenPayload: clientPayload,
      allowedContentTypes: isAudio ? ["audio/*"] : ["*/*"],
      maximumSizeInBytes: 500 * 1024 * 1024, // 500 MB max size
    })

    return NextResponse.json({
      clientToken,
      uploadUrl: clientToken.uploadUrl,
      tokenPayload: clientToken.tokenPayload,
    })
  } catch (error) {
    console.error("Error in upload token handler:", error)
    return NextResponse.json(
      {
        error: "Error generating upload token: " + (error.message || "Unknown error"),
      },
      { status: 500 },
    )
  }
}
