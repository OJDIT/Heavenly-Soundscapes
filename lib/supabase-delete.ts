import { createSupabaseClient } from "./supabase"

// Helper function to delete a file from Supabase Storage
export const deleteFileFromSupabase = async (
  bucket: string,
  path: string,
): Promise<{ success: boolean; error: Error | null }> => {
  try {
    const supabase = createSupabaseClient()

    if (!supabase) {
      throw new Error("Supabase client could not be initialized")
    }

    const { error } = await supabase.storage.from(bucket).remove([path])

    if (error) {
      throw error
    }

    return {
      success: true,
      error: null,
    }
  } catch (error) {
    console.error("Error deleting file from Supabase:", error)
    return { success: false, error: error as Error }
  }
}
