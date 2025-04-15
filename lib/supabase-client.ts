import { createClient } from "@supabase/supabase-js"

// Create a singleton Supabase client for client-side use
let supabaseClient: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (supabaseClient) return supabaseClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase credentials are missing")
    return null
  }

  supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  return supabaseClient
}

// Helper function to upload a file directly to Supabase Storage
export async function uploadToSupabase(
  file: File,
  bucket: string,
  path: string,
): Promise<{ url: string; error: Error | null }> {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      throw new Error("Supabase client could not be initialized")
    }

    // Upload the file
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: "3600",
      upsert: true,
    })

    if (error) throw error

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data?.path || path)

    return { url: publicUrl, error: null }
  } catch (error) {
    console.error("Error uploading to Supabase:", error)
    return { url: "", error: error as Error }
  }
}

// Helper function to ensure a bucket exists
export async function ensureSupabaseBucket(bucket: string): Promise<boolean> {
  try {
    // For client-side, we'll use the API route to ensure the bucket exists
    const response = await fetch(`/api/init-storage?bucket=${bucket}`)
    const data = await response.json()
    return data.success
  } catch (error) {
    console.error("Error ensuring bucket exists:", error)
    return false
  }
}
