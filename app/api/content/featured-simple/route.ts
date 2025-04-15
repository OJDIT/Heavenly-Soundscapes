import { NextResponse } from "next/server"

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
  // Return mock data (up to 3 items)
  return NextResponse.json({
    success: true,
    data: mockAudioContent.slice(0, 3),
  })
}
