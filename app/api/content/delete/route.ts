import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { deleteFileFromSupabase } from "@/lib/supabase-delete";

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const tableName = searchParams.get("tableName");

    if (!supabase) {
      return NextResponse.json(
        { success: false, error: "Failed to initialize Supabase client" },
        { status: 500 }
      );
    }

    if (!id || !tableName) {
      return NextResponse.json(
        { success: false, error: "Missing id or tableName in query string" },
        { status: 400 }
      );
    }

    const { error } = await supabase.from(tableName).delete().eq("id", id);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in delete API route:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}
