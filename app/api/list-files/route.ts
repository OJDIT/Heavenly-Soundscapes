import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const bucket = searchParams.get("bucket")
    const path = searchParams.get("path") || ""

    if (!bucket) {
      return NextResponse.json({ error: "Bucket parameter is required" }, { status: 400 })
    }

    // Get the Supabase client with service role
    const supabase = createServerSupabaseClient()

    if (!supabase) {
      return NextResponse.json({ error: "Failed to initialize Supabase client" }, { status: 500 })
    }

    // List files in the bucket
    const { data, error } = await supabase.storage.from(bucket).list(path)

    if (error) {
      // If bucket not found, return empty array instead of error
      if (error.message.includes("bucket") && error.message.includes("not found")) {
        return NextResponse.json({ files: [] })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ files: data || [] })
  } catch (error) {
    console.error("Error listing files:", error)
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 })
  }
}
