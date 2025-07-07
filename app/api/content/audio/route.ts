import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

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
      file_path,
      file_name,
      file_size,
      file_type,
      storage_type,
      category,
      description,
      is_free,
    } = payload;

    // Basic validations
    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing or invalid title" },
        { status: 400 }
      );
    }

    if (!duration || !file_url || !file_name) {
      return NextResponse.json(
        { success: false, error: "Missing required audio file data" },
        { status: 400 }
      );
    }

    // Validate price for paid sounds
    const isFree = is_free === true;
    const normalizedPrice = isFree ? 0 : parseFloat(price);
    if (!isFree && (!price || isNaN(normalizedPrice) || normalizedPrice <= 0)) {
      return NextResponse.json(
        { success: false, error: "Price must be a positive number" },
        { status: 400 }
      );
    }

    // Final object to insert
    const insertPayload = {
      title,
      description: description || null,
      category: category?.trim() || null,
      price: normalizedPrice,
      duration,
      file_url,
      file_path: file_path || null,
      file_name,
      file_size,
      file_type,
      storage_type,
      is_free: isFree,
    };

    const { data, error } = await supabase
      .from("audio_items")
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error.message);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Unexpected error in POST /api/content/audio:", err);
    const message = err instanceof Error ? err.message : JSON.stringify(err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
