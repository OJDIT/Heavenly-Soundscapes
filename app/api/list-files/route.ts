// Create a file at /app/api/list-files/route.ts (for App Router)
// or /pages/api/list-files.ts (for Pages Router)

import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    // Get the bucket and path parameters from the URL
    const { searchParams } = new URL(request.url)
    const bucket = searchParams.get("bucket")
    const path = searchParams.get("path") || ""

    if (!bucket) {
      return NextResponse.json({ error: "Missing bucket parameter" }, { status: 400 })
    }

    // Get the Supabase client with service role
    const supabase = createServerSupabaseClient()

    if (!supabase) {
      return NextResponse.json({ error: "Failed to initialize Supabase client" }, { status: 500 })
    }

    // List files in the bucket with the specified path
    const { data: files, error } = await supabase.storage.from(bucket).list(path)

    if (error) {
      console.error("Error listing files:", error)
      return NextResponse.json({ error: `Failed to list files: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({ files })
  } catch (error) {
    console.error("Error in list-files API route:", error)
    return NextResponse.json({ 
      error: `List files operation failed: ${error instanceof Error ? error.message : "Unknown error"}` 
    }, { status: 500 })
  }
}