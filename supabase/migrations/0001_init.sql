-- ============================================================================
-- Pretty Pearls — Supabase schema, RLS, and storage policies
-- Run this once via `supabase db push`, the SQL editor, or the CLI migration
-- pipeline (`supabase migration up`).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Extensions
-- ----------------------------------------------------------------------------
create extension if not exists "uuid-ossp";

-- ----------------------------------------------------------------------------
-- admin_users
-- Explicit allowlist of the single admin account. This table — not just
-- "any authenticated user" — is what RLS checks against, so even if another
-- user is ever created in auth.users, they get zero write access unless an
-- existing admin adds them here.
-- ----------------------------------------------------------------------------
create table if not exists public.admin_users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- Admins can see the admin list (needed for the dashboard); nobody else can.
create policy "admin_users_select_self_or_admin"
  on public.admin_users for select
  using (auth.uid() = id);

-- Helper function: is the current session an admin?
-- SECURITY DEFINER so it can read admin_users regardless of the caller's
-- own row-level access, avoiding recursive-policy issues.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admin_users where id = auth.uid()
  );
$$;

-- ----------------------------------------------------------------------------
-- categories
-- ----------------------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

create policy "categories_public_read"
  on public.categories for select
  using (true);

create policy "categories_admin_write"
  on public.categories for insert
  with check (public.is_admin());

create policy "categories_admin_update"
  on public.categories for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "categories_admin_delete"
  on public.categories for delete
  using (public.is_admin());

-- ----------------------------------------------------------------------------
-- products
-- ----------------------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  price numeric(10, 2) not null default 0 check (price >= 0),
  category text not null default 'uncategorized',
  image text not null default '',
  gallery text[] not null default '{}',
  featured boolean not null default false,
  stock integer not null default 0 check (stock >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_featured_idx on public.products (featured);
create index if not exists products_category_idx on public.products (category);
create index if not exists products_slug_idx on public.products (slug);

alter table public.products enable row level security;

-- Public storefront can read every product. (If you later want to hide
-- out-of-stock or draft items, add a `published boolean` column and filter
-- both here and in the storefront query.)
create policy "products_public_read"
  on public.products for select
  using (true);

create policy "products_admin_insert"
  on public.products for insert
  with check (public.is_admin());

create policy "products_admin_update"
  on public.products for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "products_admin_delete"
  on public.products for delete
  using (public.is_admin());

-- Keep updated_at fresh on every write.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Storage: `products` bucket for product photography
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

-- Anyone can view product images (they're rendered on the public site).
create policy "products_bucket_public_read"
  on storage.objects for select
  using (bucket_id = 'products');

-- Only the admin can upload, replace, or remove files in this bucket.
create policy "products_bucket_admin_insert"
  on storage.objects for insert
  with check (bucket_id = 'products' and public.is_admin());

create policy "products_bucket_admin_update"
  on storage.objects for update
  using (bucket_id = 'products' and public.is_admin())
  with check (bucket_id = 'products' and public.is_admin());

create policy "products_bucket_admin_delete"
  on storage.objects for delete
  using (bucket_id = 'products' and public.is_admin());

-- ----------------------------------------------------------------------------
-- Seed categories (safe to edit/remove)
-- ----------------------------------------------------------------------------
insert into public.categories (name, slug) values
  ('Bracelets', 'bracelets'),
  ('Keychains', 'keychains'),
  ('Charms', 'charms')
on conflict (slug) do nothing;
