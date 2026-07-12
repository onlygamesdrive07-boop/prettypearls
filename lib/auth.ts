import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type AdminUserRow = Database["public"]["Tables"]["admin_users"]["Row"];

/**
 * Defense-in-depth on top of middleware: confirms the logged-in user is
 * actually present in `admin_users` (not just "someone with a session"),
 * and redirects to the login screen otherwise. Call this at the top of
 * every admin page/layout/server action.
 */
export async function requireAdmin() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: adminRow }: { data: AdminUserRow | null } = await supabase
    .from("admin_users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!adminRow) {
    // A session exists but isn't the registered admin — sign them out and
    // bounce to login rather than silently rendering nothing.
    await supabase.auth.signOut();
    redirect("/admin/login");
  }

  return { user, admin: adminRow };
}
