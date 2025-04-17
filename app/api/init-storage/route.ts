import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    // Get the bucket parameter from the URL
    const { searchParams } = new URL(request.url)
    const bucket = searchParams.get("bucket")

    if (!bucket) {
      return NextResponse.json({ error: "Missing bucket parameter", success: false }, { status: 400 })
    }

    // Get the Supabase client with service role
    const supabase = createServerSupabaseClient()

    if (!supabase) {
      return NextResponse.json({ error: "Failed to initialize Supabase client", success: false }, { status: 500 })
    }

    // Check if the bucket exists
    try {
      const { data: bucketData, error: bucketError } = await supabase.storage.getBucket(bucket)

      if (bucketError) {
        // Bucket doesn't exist, create it
        if (bucketError.message.includes("does not exist") || bucketError.message.includes("not found")) {
          const { error: createError } = await supabase.storage.createBucket(bucket, {
            public: false, // Set to false for better security
            fileSizeLimit: 50 * 1024 * 1024, // 50MB
          })

          if (createError) {
            console.error("Error creating bucket:", createError)
            return NextResponse.json({ error: `Failed to create bucket: ${createError.message}`, success: false }, { status: 500 })
          }

          // Bucket created successfully
          return NextResponse.json({ message: `Bucket ${bucket} created successfully`, success: true })
        } else {
          // Other error occurred
          console.error("Error checking bucket:", bucketError)
          return NextResponse.json({ error: `Bucket error: ${bucketError.message}`, success: false }, { status: 500 })
        }
      }

      // Bucket already exists
      return NextResponse.json({ message: `Bucket ${bucket} already exists`, success: true })
    } catch (error) {
      console.error("Error in init-storage API route:", error)
      return NextResponse.json({ 
        error: `Bucket operation failed: ${error instanceof Error ? error.message : "Unknown error"}`, 
        success: false 
      }, { status: 500 })
    }
  } catch (error) {
    console.error("Unexpected error in init-storage API route:", error)
    return NextResponse.json({ 
      error: `Unexpected error: ${error instanceof Error ? error.message : "Unknown error"}`, 
      success: false 
    }, { status: 500 })
  }
}