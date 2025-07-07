import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();

    if (!supabase) {
      return NextResponse.json(
        { success: false, error: "Failed to initialize Supabase client" },
        { status: 500 }
      );
    }

    const { data, error } = await supabase
      .from("audio_items")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const payload = await req.json();

    if (!supabase) {
      return NextResponse.json(
        { success: false, error: "Failed to initialize Supabase client" },
        { status: 500 }
      );
    }

    const { title, price, duration, file_url, is_free } = payload;

    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing or invalid title" },
        { status: 400 }
      );
    }
    if (typeof price !== "number" || price <= 0) {
      return NextResponse.json(
        { success: false, error: "Price must be a positive number" },
        { status: 400 }
      );
    }
    if (!file_url || !title || !price || !duration) {
      return NextResponse.json(
        { success: false, error: "Upload data incomplete" },
        { status: 400 }
      );
    }

    // ✅ Normalize is_free
    const isFreeValue = typeof is_free === "boolean" ? is_free : false;

    // ✅ Final payload with is_free included
    const finalPayload = {
      ...payload,
      is_free: isFreeValue,
    };

    // ✅ Use finalPayload instead of payload here
    const { data, error } = await supabase
      .from("audio_items")
      .insert(finalPayload)
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Unexpected error in API route:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Unknown server error",
      },
      { status: 500 }
    );
  }
}
