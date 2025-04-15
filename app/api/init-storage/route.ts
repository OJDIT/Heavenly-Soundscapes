import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const specificBucket = searchParams.get("bucket")

    const supabase = createServerSupabaseClient()

    if (!supabase) {
      return NextResponse.json(
        {
          success: false,
          error: "Supabase client could not be initialized. Check your environment variables.",
        },
        { status: 500 },
      )
    }

    // Check if buckets exist, create them if they don't
    const buckets = specificBucket ? [specificBucket] : ["audio-files", "video-files"]
    const results = []

    for (const bucket of buckets) {
      try {
        // Check if bucket exists
        const { data: existingBucket, error: getBucketError } = await supabase.storage.getBucket(bucket)

        if (getBucketError) {
          if (getBucketError.message.includes("does not exist") || getBucketError.message.includes("not found")) {
            console.log(`Bucket ${bucket} does not exist, creating it...`)

            // Create the bucket
            const { data, error } = await supabase.storage.createBucket(bucket, {
              public: true,
              fileSizeLimit: 50 * 1024 * 1024, // 50MB
            })

            if (error) {
              console.error(`Error creating bucket ${bucket}:`, error)
              results.push({ bucket, status: "error", error: error.message })
            } else {
              console.log(`Bucket ${bucket} created successfully`)

              // Update bucket to be public
              const { error: updateError } = await supabase.storage.updateBucket(bucket, {
                public: true,
              })

              if (updateError) {
                console.warn(`Warning: Could not make bucket ${bucket} public:`, updateError)
              }

              // Set public access policy for the bucket
              try {
                // Add a policy to allow public access to all files
                const { error: policyError } = await supabase.storage.from(bucket).createSignedUrl("test.txt", 60)
                if (policyError && !policyError.message.includes("not found")) {
                  console.warn(`Warning: Could not test bucket ${bucket} access:`, policyError)
                }
              } catch (policyError) {
                console.warn(`Warning: Error testing bucket ${bucket} access:`, policyError)
              }

              results.push({ bucket, status: "created", data })
            }
          } else {
            console.error(`Error checking bucket ${bucket}:`, getBucketError)
            results.push({ bucket, status: "error", error: getBucketError.message })
          }
        } else {
          console.log(`Bucket ${bucket} already exists`)

          // Ensure bucket is public
          const { error: updateError } = await supabase.storage.updateBucket(bucket, {
            public: true,
          })

          if (updateError) {
            console.warn(`Warning: Could not update bucket ${bucket} to be public:`, updateError)
          }

          results.push({ bucket, status: "exists", data: existingBucket })
        }
      } catch (bucketError) {
        console.error(`Error with bucket ${bucket}:`, bucketError)
        results.push({ bucket, status: "error", error: bucketError.message })
      }
    }

    // Check if any buckets were successfully created or exist
    const successfulBuckets = results.filter((result) => result.status === "created" || result.status === "exists")

    if (successfulBuckets.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to initialize any storage buckets",
          results,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: `Storage buckets initialized (${successfulBuckets.length}/${buckets.length} successful)`,
      results,
    })
  } catch (error) {
    console.error("Error initializing storage buckets:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Unknown error",
      },
      { status: 500 },
    )
  }
}
