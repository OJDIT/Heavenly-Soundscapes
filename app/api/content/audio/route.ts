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

    const {
      title,
      price,
      duration,
      file_url,
      is_free
    } = payload;

    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing or invalid title" },
        { status: 400 }
      );
    }

    if (!file_url || !duration) {
      return NextResponse.json(
        { success: false, error: "Missing audio file or duration" },
        { status: 400 }
      );
    }

    const normalizedPrice = typeof price === "number" ? price : null;
    const normalizedIsFree = typeof is_free === "boolean" ? is_free : false;

    if (!normalizedIsFree && (normalizedPrice === null || normalizedPrice <= 0)) {
      return NextResponse.json(
        { success: false, error: "Price must be a positive number for paid sounds" },
        { status: 400 }
      );
    }

    const finalPayload = {
      ...payload,
      price: normalizedIsFree ? 0 : normalizedPrice,
      is_free: normalizedIsFree
    };

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
