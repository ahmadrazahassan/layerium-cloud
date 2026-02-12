import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

let client: SupabaseClient<Database> | null = null;

export const createClient = () => {
  // Only create client in browser environment
  if (typeof window === "undefined") {
    throw new Error("createClient should only be called in browser environment");
  }

  if (client) return client;
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables. Please check your .env.local file.");
  }
  
  // Note: We cast here because the SSR client has issues with generic types
  client = createBrowserClient(supabaseUrl, supabaseKey) as SupabaseClient<Database>;
  return client;
};
