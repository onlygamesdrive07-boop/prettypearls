# Pretty Pearls — Full-Stack Handcrafted Jewelry Store

A cinematic, gallery-style storefront for a handmade bracelet & keychain
brand — now a complete Supabase-backed e-commerce application. The frontend
(hero 3D scene, animations, layout, typography) is untouched; everything
below it is new.

## Stack

- **Next.js 14 (App Router)** + **TypeScript**
- **Supabase** — Postgres database, Auth, Storage, Row Level Security
- **Tailwind CSS**, **Framer Motion**, **GSAP + ScrollTrigger**, **Lenis**,
  **React Three Fiber / drei / three.js** (unchanged from the original build)

## 1. Create your Supabase project

1. Go to [supabase.com](https://supabase.com) → New Project.
2. Once it's ready, open **Settings → API** and copy the **Project URL**,
   **anon public key**, and **service_role key**.

## 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in the three Supabase values. Never commit `.env.local` or expose the
service role key to the browser — it's used only by the one-time admin seed
script (step 4), not by the running app.

## 3. Run the SQL migrations

In the Supabase dashboard, open **SQL Editor** and run, in order:

1. `supabase/migrations/0001_init.sql` — products, categories, admin_users,
   RLS policies, the `products` storage bucket and its policies, seed
   categories.
2. `supabase/migrations/0002_ecommerce_expansion.sql` — adds the extra
   product fields (SKU, material, colors, sizes, bestseller, status),
   orders, order_items, and the single-row settings table.

(If you use the Supabase CLI instead: `supabase db push`.)

## 4. Create the one and only admin account

There is no public sign-up page anywhere in this app — admin access is
provisioned once, from the command line:

```bash
npm install
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='a-strong-password' npm run seed:admin
```

This script (`scripts/create-admin.mjs`) refuses to run if an admin already
exists, so there's no way to end up with a second one by accident.

## 5. Run it

```bash
npm run dev
```

- Storefront: `http://localhost:3000`
- Admin dashboard: `http://localhost:3000/admin/login`

Log in with the email/password you just created, then add your first
product — it appears on the homepage's Featured Collection immediately if
you check "Show in Featured Collection."

## What's inside

### Auth & route protection
- `middleware.ts` — refreshes the Supabase session on every request and
  redirects unauthenticated visitors away from any `/admin/*` route.
- `lib/auth.ts` — `requireAdmin()`, a second check (defense-in-depth) that
  confirms the session belongs to the row in `admin_users`, not just "any
  logged-in user."
- `app/admin/login/page.tsx` — the only way in. No registration form exists.

### Data & actions
- `types/database.ts` — hand-written types mirroring the SQL schema exactly
  (the shape `supabase gen types typescript` would produce).
- `lib/supabase.ts` — re-exports the browser/server client factories from
  `lib/supabase/client.ts` and `lib/supabase/server.ts`.
- `lib/database.ts` — every read query (products with search/filter/sort/
  pagination, categories, orders, settings).
- `lib/actions.ts` — every Server Action: auth, product CRUD + bulk delete +
  duplicate + status/featured/bestseller toggles + stock updates, category
  CRUD, order status updates, the public "place order via WhatsApp" action,
  and settings updates.
- `lib/products.ts` / `lib/categories.ts` — thin re-exports of the above,
  kept so the original storefront components' imports didn't need to change.

### Admin dashboard (`/admin`)
- **Dashboard** — catalog stats and recent products.
- **Products** — search, filter by category/status, sort, pagination, bulk
  select + bulk delete, duplicate, publish/draft toggle, featured toggle,
  edit, delete.
- **Add / Edit Product** — full field set (name, slug, description, short
  description, price, compare-at price, category, stock, SKU, material,
  colors, sizes, featured, bestseller, status) with drag-and-drop multi-image
  upload straight to Supabase Storage.
- **Categories** — add/delete, each with its own image.
- **Orders** — list + detail view with line items and a status dropdown
  (pending → confirmed → packed → shipped → delivered, or cancelled).
- **Settings** — business name, logo, favicon, WhatsApp/Instagram/Facebook,
  email, address, currency, shipping charge, footer text.
- **Profile** — change the admin password.
- **Logout**.

### Storefront additions
- `app/product/[slug]/page.tsx` — a new product detail page (gallery with
  hover-zoom, category/bestseller badges, availability, related products,
  and an **Order via WhatsApp** button) alongside the original homepage
  gallery/modal experience, which is unchanged.
- Toast notifications (`components/Toast.tsx`) for admin actions and
  storefront ordering.
- Skeleton loaders (`app/loading.tsx`, `app/admin/(protected)/products/loading.tsx`)
  and error boundaries (`app/error.tsx`, `app/admin/(protected)/error.tsx`).

### API routes (alongside the Server Actions)
- `GET /api/products` — public list, `?category=` and `?featured=true` filters.
- `POST /api/products` — admin-only create.
- `GET/PATCH/DELETE /api/products/[id]` — admin-only read/update/delete.
- `GET /api/categories` — public list.

## Database schema

**products** — id, name, slug, description, short_description, price,
compare_price, category, stock, sku, featured, bestseller, image, gallery,
material, colors, sizes, status, created_at, updated_at.

**categories** — id, name, slug, image, created_at.

**orders** — id, customer_name, phone, email, address, city, state, country,
pincode, payment_method, order_status, total_price, created_at.

**order_items** — id, order_id, product_id, quantity, price.

**settings** — single row: business_name, logo, favicon, whatsapp,
instagram, facebook, email, currency, shipping_charge, footer_text,
updated_at.

Full definitions, indexes, RLS policies, and storage policies are in
`supabase/migrations/`.

## Row Level Security, in short

- **products / categories**: public can read published products and all
  categories; only the admin (checked via `admin_users` + a `is_admin()`
  SQL function) can insert/update/delete.
- **orders / order_items**: anyone can *insert* (so the WhatsApp-order flow
  works for anonymous visitors); only the admin can read, update, or delete
  — these contain customer contact details.
- **settings**: public read (the storefront needs the WhatsApp number and
  currency), admin-only update.
- **Storage (`products` bucket)**: public read, admin-only write/delete.

## Ordering flow (honest scope note)

This build doesn't include a full multi-item cart/checkout — the original
frontend has no cart UI, and adding one would mean designing new pages,
which the brief asked me not to do. Instead, "Order via WhatsApp" on the
product page records a real row in `orders`/`order_items` (so it shows up
in the admin Orders dashboard) and hands the customer a pre-filled WhatsApp
message to confirm details and payment. If you want a proper cart later,
the `orders`/`order_items` tables are already shaped to support one.

## Deploying

Works on Vercel out of the box — set the same three environment variables
in the Vercel project settings, run the migrations against your production
Supabase project, and seed the admin account once against that project.
