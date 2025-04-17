// app/api/content/audio/route.ts
import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()
    
    if (!supabase) {
      return NextResponse.json({ success: false, error: "Failed to initialize Supabase client" }, { status: 500 })
    }

    const { data, error } = await supabase
      .from("audio-files")
      .select("*")
      .order("date_added", { ascending: false })

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "An unknown error occurred" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    
    if (!supabase) {
      return NextResponse.json({ success: false, error: "Failed to initialize Supabase client" }, { status: 500 })
    }

    const data = await request.json()
    
    // Add timestamp for date_added if not provided
    if (!data.date_added) {
      data.date_added = new Date().toISOString()
    }

    const { data: insertData, error } = await supabase
      .from("audio-files")
      .insert([data])
      .select()

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: insertData[0] })
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "An unknown error occurred" },
      { status: 500 }
    )
  }
}