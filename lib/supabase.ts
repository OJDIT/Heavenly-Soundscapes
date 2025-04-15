import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for the browser
export const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase credentials are missing")
    return null
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

// Create a server-side supabase client (for API routes)
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Supabase server credentials are missing")
    return null
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Helper function to upload a file to Supabase Storage
export const uploadFileToSupabase = async (
  file: File,
  bucket: string,
  path: string,
): Promise<{ data: { path: string; url: string } | null; error: Error | null }> => {
  try {
    // Use the server-side client with service role key for uploads
    // This bypasses RLS policies
    const supabase = createServerSupabaseClient()

    if (!supabase) {
      throw new Error("Supabase client could not be initialized")
    }

    // Check file size - limit to 50MB
    if (file.size > 50 * 1024 * 1024) {
      throw new Error("File size exceeds the 50MB limit. Please upload a smaller file.")
    }

    // Upload the file using the API route instead of direct upload
    const formData = new FormData()
    formData.append("file", file)
    formData.append("bucket", bucket)
    formData.append("path", path)

    const response = await fetch("/api/upload/supabase", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()

    return {
      data: {
        path: data.path,
        url: data.url,
      },
      error: null,
    }
  } catch (error) {
    console.error("Error uploading file to Supabase:", error)
    return { data: null, error: error as Error }
  }
}

// Helper function to list files in a bucket
export const listFilesInBucket = async (bucket: string, path?: string) => {
  try {
    // First, ensure the bucket exists by calling the init-storage API
    try {
      const initResponse = await fetch(`/api/init-storage?bucket=${bucket}`)
      const initData = await initResponse.json()

      if (!initData.success) {
        console.warn(`Warning: Could not initialize bucket ${bucket}:`, initData.error)
      }
    } catch (initError) {
      console.warn(`Warning: Error calling init-storage API:`, initError)
    }

    // Use the server-side client for listing files
    const response = await fetch(`/api/list-files?bucket=${bucket}&path=${path || ""}`)

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to list files")
    }

    const data = await response.json()

    return { data: data.files, error: null }
  } catch (error) {
    console.error("Error listing files:", error)
    return { data: [], error }
  }
}

// Helper function to get a public URL for a file
export const getFilePublicUrl = (bucket: string, path: string) => {
  try {
    const supabase = createSupabaseClient()

    if (!supabase) {
      throw new Error("Supabase client could not be initialized")
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
  } catch (error) {
    console.error("Error getting public URL:", error)
    return ""
  }
}

export const ensureBucketExists = async (bucket: string): Promise<boolean> => {
  try {
    const initResponse = await fetch(`/api/init-storage?bucket=${bucket}`)
    const initData = await initResponse.json()
    return initData.success
  } catch (error) {
    console.error("Error ensuring bucket exists:", error)
    return false
  }
}
