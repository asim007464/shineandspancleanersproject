import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "FATAL: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in your .env file. See .env.example. Restart the dev server after updating."
  );
}

if (
  supabaseUrl.includes("placeholder") ||
  supabaseUrl.includes("your-project") ||
  supabaseAnonKey.includes("your-anon")
) {
  console.error(
    "FATAL: Supabase credentials still contain placeholder values. Update .env with real credentials."
  );
}

/**
 * Supabase client — will throw on any request if credentials are missing.
 * Never falls back to placeholder values.
 */
export const supabase = createClient(
  supabaseUrl || "https://invalid.supabase.co",
  supabaseAnonKey || "invalid-key"
);
