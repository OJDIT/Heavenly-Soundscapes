import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for the browser
export const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase credentials are missing");
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey);
};

// Create a server-side supabase client (for API routes)
export const createServerSupabaseClient = () => {
  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Supabase server credentials are missing");
    return null;
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

const makeSafeKey = (name: string) => {
  return name
    .normalize("NFC")
    .replace(/[\u2013\u2014:]+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "_");
};

export const uploadFileToSupabase = async (
  file: File,
  bucket: string,
  path: string
): Promise<{
  data: { path: string; url: string } | null;
  error: Error | null;
}> => {
  try {
    const MAX = 50 * 1024 * 1024;

    if (file.size > MAX) {
      throw new Error(
        "File size exceeds the 50 MB limit. Please upload a smaller file."
      );
    }

    const supabase = createServerSupabaseClient();

    if (!supabase) {
      throw new Error("Supabase client could not be initialized");
    }

    const safePath = makeSafeKey(path);
    const { data: uploadData, error: uploadErr } = await supabase.storage
      .from(bucket)
      .upload(safePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadErr || !uploadData) {
      throw uploadErr ?? new Error("Supabase upload failed");
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(uploadData.path);

    return {
      data: { path: uploadData.path, url: publicUrl },
      error: null,
    };
  } catch (error) {
    console.error("Error uploading file to Supabase:", error);
    return { data: null, error: error as Error };
  }
};

// Helper function to list files in a bucket
export const listFilesInBucket = async (bucket: string, path?: string) => {
  try {
    // First, ensure the bucket exists by calling the init-storage API
    try {
      const initResponse = await fetch(`/api/init-storage?bucket=${bucket}`);
      const initData = await initResponse.json();

      if (!initData.success) {
        console.warn(
          `Warning: Could not initialize bucket ${bucket}:`,
          initData.error
        );
      }
    } catch (initError) {
      console.warn(`Warning: Error calling init-storage API:`, initError);
    }

    // Use the server-side client for listing files
    const response = await fetch(
      `/api/list-files?bucket=${bucket}&path=${path || ""}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to list files");
    }

    const data = await response.json();

    return { data: data.files, error: null };
  } catch (error) {
    console.error("Error listing files:", error);
    return { data: [], error };
  }
};

// Helper function to get a public URL for a file
export const getFilePublicUrl = (bucket: string, path: string) => {
  try {
    const supabase = createSupabaseClient();

    if (!supabase) {
      throw new Error("Supabase client could not be initialized");
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  } catch (error) {
    console.error("Error getting public URL:", error);
    return "";
  }
};

export const ensureBucketExists = async (bucket: string): Promise<boolean> => {
  try {
    const initResponse = await fetch(`/api/init-storage?bucket=${bucket}`);
    const initData = await initResponse.json();
    return initData.success;
  } catch (error) {
    console.error("Error ensuring bucket exists:", error);
    return false;
  }
};
