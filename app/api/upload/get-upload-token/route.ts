import { createServerSupabaseClient } from "@/lib/supabase";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return NextResponse.json(
      { success: false, error: "Failed to initialize Supabase client" },
      { status: 500 }
    );
  }

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      token: process.env.BLOB_READ_WRITE_TOKEN!,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const isAudio = pathname.startsWith("audio/");
        const isVideo = pathname.startsWith("videos/");
        const isThumb = pathname.startsWith("thumbnails/");

        return {
          allowedContentTypes: isVideo
            ? ["video/*"]
            : isAudio
            ? ["audio/*"]
            : isThumb
            ? ["image/*"]
            : ["*/*"],
          maximumSizeInBytes: 500 * 1024 * 1024,
          tokenPayload: clientPayload,
        };
      },
      onUploadCompleted: async () => {},
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
