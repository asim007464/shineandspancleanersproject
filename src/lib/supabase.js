import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase: Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file (see .env.example). Restart the dev server after changing .env."
  );
}

/**
 * Supabase client. Requires valid URL and anon key in .env or requests will fail.
 */
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createClient("https://placeholder.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1wbGFjZWhvbGRlciIsInJvbGUiOiJhbm9uIn0.placeholder");
