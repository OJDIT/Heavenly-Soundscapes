import { NextResponse } from "next/server"
import { listFilesInBucket, getFilePublicUrl } from "@/lib/supabase"

// Mock data for video content (fallback if no uploads)
const mockVideoContent = [
  {
    id: "video-1",
    title: "Worship Night Highlights",
    category: "Live Event",
    description: "Highlights from our recent worship night event.",
    price: 39.99,
    filename: "worship-night.mp4",
    url: "/placeholder.svg?height=400&width=400",
    thumbnailUrl: "/placeholder.svg?height=400&width=400",
    size: 104857600,
    type: "video/mp4",
    duration: "5:30",
    dateAdded: new Date().toISOString(),
  },
  {
    id: "video-2",
    title: "Studio Session - Gospel Choir",
    category: "Behind Scenes",
    description: "Behind the scenes of our latest gospel choir recording.",
    price: 29.99,
    filename: "studio-session.mp4",
    url: "/placeholder.svg?height=400&width=400",
    thumbnailUrl: "/placeholder.svg?height=400&width=400",
    size: 83886080,
    type: "video/mp4",
    duration: "4:45",
    dateAdded: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
  {
    id: "video-3",
    title: "Ambient Worship Tutorial",
    category: "Tutorial",
    description: "Learn how to create ambient worship sounds.",
    price: 19.99,
    filename: "ambient-tutorial.mp4",
    url: "/placeholder.svg?height=400&width=400",
    thumbnailUrl: "/placeholder.svg?height=400&width=400",
    size: 62914560,
    type: "video/mp4",
    duration: "12:20",
    dateAdded: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
  },
]

export async function GET() {
  try {
    // Try to get stored video content from localStorage
    let videoContent = []
    try {
      const storedContent = localStorage.getItem("videoContent")
      if (storedContent) {
        videoContent = JSON.parse(storedContent)

        // Ensure all items have valid IDs
        videoContent = videoContent.map((item) => {
          if (!item.id) {
            return { ...item, id: `video-${Date.now()}-${Math.random().toString(36).substring(2, 9)}` }
          }
          return item
        })

        if (videoContent.length > 0) {
          return NextResponse.json({ success: true, data: videoContent })
        }
      }
    } catch (error) {
      console.error("Error parsing stored video content:", error)
    }

    // Initialize storage buckets first
    try {
      const initResponse = await fetch("/api/init-storage?bucket=video-files")
      const initData = await initResponse.json()

      if (!initData.success) {
        console.warn("Warning: Failed to initialize video-files bucket:", initData.error)
      }
    } catch (initError) {
      console.warn("Warning: Error calling init-storage API:", initError)
    }

    // Try to get video files from Supabase Storage
    try {
      const { data: files, error } = await listFilesInBucket("video-files", "videos")

      if (error) {
        console.error("Error listing files in video-files bucket:", error)
        return NextResponse.json({ success: true, data: mockVideoContent })
      }

      if (files && files.length > 0) {
        // Get thumbnails as well
        const { data: thumbnails } = await listFilesInBucket("video-files", "thumbnails")

        // Create metadata from the files
        const videoFiles = files.map((file) => {
          const publicUrl = getFilePublicUrl("video-files", file.name)

          // Try to find a matching thumbnail
          let thumbnailUrl = null
          if (thumbnails) {
            const fileBaseName = file.name.split(".")[0].replace(/^\d+-/, "")
            const matchingThumbnail = thumbnails.find(
              (t) => t.name.includes(fileBaseName) || file.name.includes(t.name.split(".")[0]),
            )

            if (matchingThumbnail) {
              thumbnailUrl = getFilePublicUrl("video-files", matchingThumbnail.name)
            }
          }

          // Extract filename without timestamp prefix
          const originalFilename = file.name
            .replace(/^\d+-/, "")
            .replace(/-/g, " ")
            .replace(/\.\w+$/, "")

          return {
            id: `video-${file.id || Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            title: originalFilename,
            category: "Video",
            description: "Video file uploaded to Supabase Storage",
            price: 29.99,
            filename: file.name,
            path: file.name, // Add the path for easier deletion
            url: publicUrl,
            thumbnailUrl: thumbnailUrl || "/placeholder.svg?height=400&width=400",
            size: file.metadata?.size || 0,
            type: "video/mp4",
            duration: "5:30",
            dateAdded: file.created_at || new Date().toISOString(),
          }
        })

        // Store in localStorage for future use
        try {
          localStorage.setItem("videoContent", JSON.stringify(videoFiles))
        } catch (storageError) {
          console.error("Error saving to localStorage:", storageError)
        }

        return NextResponse.json({ success: true, data: videoFiles })
      }
    } catch (supabaseError) {
      console.error("Error fetching from Supabase Storage:", supabaseError)
    }

    // If no uploaded files, return mock data with IDs
    const mockDataWithIds = mockVideoContent.map((item) => {
      if (!item.id) {
        return { ...item, id: `video-mock-${Date.now()}-${Math.random().toString(36).substring(2, 9)}` }
      }
      return item
    })

    // Store mock data in localStorage for future deletion
    try {
      localStorage.setItem("videoContent", JSON.stringify(mockDataWithIds))
    } catch (storageError) {
      console.error("Error saving mock data to localStorage:", storageError)
    }

    return NextResponse.json({ success: true, data: mockDataWithIds })
  } catch (error) {
    console.error("Error fetching video content:", error)
    return NextResponse.json({ success: true, data: mockVideoContent })
  }
}
