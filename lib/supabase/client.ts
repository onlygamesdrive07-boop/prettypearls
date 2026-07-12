import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

/**
 * Client-side Supabase instance. Safe to use in "use client" components —
 * it only ever holds the public anon key. Row Level Security is what
 * actually stops writes from unauthenticated or non-admin sessions, not
 * this client.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
