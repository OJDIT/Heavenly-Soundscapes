import { createClient } from "@supabase/supabase-js"

// Create a Supabase client for secure server-side operations.
// This version uses the Service Role key, which bypasses Row-Level Security (RLS).
// ⚠️ IMPORTANT: Never expose the Service Role key to the client-side code.
export function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false, // No need for cookie-based sessions in server actions
    },
  })
}
