/**
 * One-time setup script: creates the single Pretty Pearls admin account.
 *
 * This is intentionally NOT exposed anywhere in the app — there is no public
 * sign-up form. Run it once, locally, with the service role key:
 *
 *   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='a-strong-password' \
 *     node scripts/create-admin.mjs
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your
 * environment (e.g. loaded from .env.local — see the `-r dotenv/config`
 * usage below, or export them manually first).
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!url || !serviceRoleKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in the environment."
  );
  process.exit(1);
}
if (!email || !password) {
  console.error("Usage: ADMIN_EMAIL=... ADMIN_PASSWORD=... node scripts/create-admin.mjs");
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  // 1. Refuse to run if an admin already exists — enforces "one admin only".
  const { data: existing, error: existingErr } = await supabase
    .from("admin_users")
    .select("id, email");

  if (existingErr) {
    console.error("Could not check existing admins:", existingErr.message);
    process.exit(1);
  }
  if (existing && existing.length > 0) {
    console.error(
      `An admin already exists (${existing[0].email}). Refusing to create a second one.`
    );
    process.exit(1);
  }

  // 2. Create the auth user.
  const { data: created, error: createErr } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createErr || !created?.user) {
    console.error("Failed to create auth user:", createErr?.message);
    process.exit(1);
  }

  // 3. Register them as the admin.
  const { error: insertErr } = await supabase
    .from("admin_users")
    .insert({ id: created.user.id, email });

  if (insertErr) {
    console.error("Auth user created, but failed to register as admin:", insertErr.message);
    console.error(`You can fix this manually: insert into admin_users (id, email) values ('${created.user.id}', '${email}');`);
    process.exit(1);
  }

  console.log(`✅ Admin account created for ${email}. You can now log in at /admin/login.`);
}

main();
