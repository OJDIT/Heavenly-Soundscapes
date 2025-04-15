import { NextResponse } from "next/server"
import { put, list } from "@vercel/blob"

export async function GET() {
  try {
    // Try to list blobs to check if Vercel Blob is working
    const { blobs } = await list()

    return NextResponse.json({
      success: true,
      message: "Vercel Blob is working correctly",
      blobCount: blobs.length,
      blobToken: process.env.BLOB_READ_WRITE_TOKEN ? "Token exists" : "Token missing",
    })
  } catch (error) {
    console.error("Error testing Vercel Blob:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Unknown error",
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}

export async function POST() {
  try {
    // Create a simple test file
    const testContent = "This is a test file to verify Vercel Blob is working correctly."
    const testFile = new Blob([testContent], { type: "text/plain" })

    // Try to upload to Vercel Blob
    const blob = await put(`test/test-file-${Date.now()}.txt`, testFile, {
      access: "public",
    })

    return NextResponse.json({
      success: true,
      message: "Test file uploaded successfully to Vercel Blob",
      url: blob.url,
    })
  } catch (error) {
    console.error("Error uploading test file to Vercel Blob:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Unknown error",
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}
