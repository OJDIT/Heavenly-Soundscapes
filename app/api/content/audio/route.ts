import { NextResponse } from "next/server"
import { listFilesInBucket, getFilePublicUrl } from "@/lib/supabase"

// Mock data for audio content (fallback if no uploads)
const mockAudioContent = [
  {
    id: "audio-1",
    title: "Joyful Praise",
    category: "Praise",
    description: "A uplifting gospel praise beat with powerful drums, organ, and piano.",
    price: 29.99,
    filename: "joyful-praise.mp3",
    url: "/placeholder.svg?height=400&width=400",
    size: 5242880,
    type: "audio/mpeg",
    duration: "3:45",
    dateAdded: new Date().toISOString(),
  },
  {
    id: "audio-2",
    title: "Spirit Worship",
    category: "Worship",
    description: "Gentle worship track with piano and soft pads.",
    price: 34.99,
    filename: "spirit-worship.mp3",
    url: "/placeholder.svg?height=400&width=400",
    size: 6291456,
    type: "audio/mpeg",
    duration: "4:30",
    dateAdded: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
  {
    id: "audio-3",
    title: "Grace Melody",
    category: "Contemporary",
    description: "Contemporary gospel track with modern elements.",
    price: 24.99,
    filename: "grace-melody.mp3",
    url: "/placeholder.svg?height=400&width=400",
    size: 4194304,
    type: "audio/mpeg",
    duration: "3:15",
    dateAdded: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
  },
]

export async function GET() {
  try {
    console.log("Fetching audio content")

    // First, try to get content from localStorage
    let audioContent = []
    try {
      const storedContent = localStorage.getItem("audioContent")
      if (storedContent) {
        audioContent = JSON.parse(storedContent)
        console.log(`Found ${audioContent.length} audio files in localStorage`)

        // Ensure all items have valid price values and IDs
        audioContent = audioContent.map((item) => {
          // If price is missing or invalid, set a default
          if (item.price === undefined || item.price === null || isNaN(Number(item.price))) {
            return { ...item, price: 29.99 }
          }

          // If price is a string, convert to number
          if (typeof item.price === "string") {
            return { ...item, price: Number.parseFloat(item.price) }
          }

          // Make sure each item has an ID
          if (!item.id) {
            return { ...item, id: `audio-${Date.now()}-${Math.random().toString(36).substring(2, 9)}` }
          }

          return item
        })

        if (audioContent.length > 0) {
          return NextResponse.json({ success: true, data: audioContent })
        }
      }
    } catch (storageError) {
      console.error("Error accessing localStorage:", storageError)
    }

    // Initialize storage buckets first
    try {
      const initResponse = await fetch("/api/init-storage?bucket=audio-files")
      const initData = await initResponse.json()

      if (!initData.success) {
        console.warn("Warning: Failed to initialize audio-files bucket:", initData.error)
      }
    } catch (initError) {
      console.warn("Warning: Error calling init-storage API:", initError)
    }

    // If no localStorage content, try Supabase Storage
    try {
      console.log("Trying to fetch from Supabase Storage")
      const { data: files, error } = await listFilesInBucket("audio-files")

      if (error) {
        console.error("Error listing files in audio-files bucket:", error)
        return NextResponse.json({ success: true, data: mockAudioContent })
      }

      console.log(`Found ${files?.length || 0} audio files in Supabase Storage`)

      if (files && files.length > 0) {
        // Create metadata from the files
        const audioFiles = files.map((file) => {
          const publicUrl = getFilePublicUrl("audio-files", file.name)

          // Extract filename without timestamp prefix
          const originalFilename = file.name
            .replace(/^\d+-/, "")
            .replace(/-/g, " ")
            .replace(/\.\w+$/, "")

          return {
            id: `audio-${file.id || Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            title: originalFilename,
            category: "Music",
            description: "Audio file uploaded to Supabase Storage",
            price: 29.99,
            filename: file.name,
            path: file.name, // Add the path for easier deletion
            url: publicUrl,
            size: file.metadata?.size || 0,
            type: "audio/mpeg",
            duration: "3:45",
            dateAdded: file.created_at || new Date().toISOString(),
          }
        })

        // Store these in localStorage for future use
        try {
          localStorage.setItem("audioContent", JSON.stringify(audioFiles))
        } catch (storageError) {
          console.error("Error saving to localStorage:", storageError)
        }

        return NextResponse.json({ success: true, data: audioFiles })
      }
    } catch (supabaseError) {
      console.error("Error fetching from Supabase Storage:", supabaseError)
    }

    // If no content found in localStorage or Supabase, return mock data
    console.log("No audio files found, returning mock data")

    // Add IDs to mock data if they don't exist
    const mockDataWithIds = mockAudioContent.map((item) => {
      if (!item.id) {
        return { ...item, id: `audio-mock-${Date.now()}-${Math.random().toString(36).substring(2, 9)}` }
      }
      return item
    })

    // Store mock data in localStorage for future deletion
    try {
      localStorage.setItem("audioContent", JSON.stringify(mockDataWithIds))
    } catch (storageError) {
      console.error("Error saving mock data to localStorage:", storageError)
    }

    return NextResponse.json({ success: true, data: mockDataWithIds })
  } catch (error) {
    console.error("Error fetching audio content:", error)
    return NextResponse.json({
      success: false,
      error: error.message || "Unknown error",
      data: mockAudioContent, // Return mock data as fallback
    })
  }
}
