/**
 * Supabase client factories, in one place.
 *
 * Next.js App Router needs two different Supabase clients — a browser one
 * for client components, and a cookie-aware one for Server Components /
 * Server Actions / Route Handlers. They live in lib/supabase/client.ts and
 * lib/supabase/server.ts respectively; this file just re-exports both under
 * clear names so you only need to remember one import path.
 *
 *   import { createBrowserSupabaseClient, createServerSupabaseClient } from "@/lib/supabase";
 */
export { createClient as createBrowserSupabaseClient } from "@/lib/supabase/client";
export { createClient as createServerSupabaseClient } from "@/lib/supabase/server";
export type { Database, ProductRow, CategoryRow, OrderRow, OrderItemRow, SettingsRow } from "@/types/database";
