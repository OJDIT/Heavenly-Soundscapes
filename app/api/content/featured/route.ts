import { NextResponse } from "next/server"

// Helper function to get audio content directly
async function getAudioContent() {
  try {
    // Try to get stored audio content from localStorage
    let audioContent = []
    try {
      const storedContent = localStorage.getItem("audioContent")
      if (storedContent) {
        audioContent = JSON.parse(storedContent)
        return audioContent
      }
    } catch (storageError) {
      console.error("Error accessing localStorage:", storageError)
    }

    // If no localStorage content, return empty array
    // In a real production environment, we would query the database directly here
    return []
  } catch (error) {
    console.error("Error getting audio content:", error)
    return []
  }
}

export async function GET() {
  try {
    // Get audio content directly instead of making an API call
    const audioContent = await getAudioContent()

    // Get up to 3 tracks from the store
    const featuredTracks = audioContent.slice(0, 3)

    return NextResponse.json({
      success: true,
      data: featuredTracks,
    })
  } catch (error) {
    console.error("Error fetching featured tracks:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch featured tracks",
      },
      { status: 500 },
    )
  }
}
