-- ============================================================================
-- Pretty Pearls — e-commerce expansion
-- Adds the extra product fields, category images, orders, order items, and
-- a single-row settings table. Run after 0001_init.sql.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- products: new fields
-- ----------------------------------------------------------------------------
alter table public.products
  add column if not exists short_description text not null default '',
  add column if not exists compare_price numeric(10, 2),
  add column if not exists sku text,
  add column if not exists material text not null default '',
  add column if not exists colors text[] not null default '{}',
  add column if not exists sizes text[] not null default '{}',
  add column if not exists bestseller boolean not null default false,
  add column if not exists status text not null default 'published'
    check (status in ('published', 'draft'));

create unique index if not exists products_sku_idx
  on public.products (sku)
  where sku is not null and sku <> '';

-- The storefront should only ever see published items. Replace the
-- "everything is public" policy from migration 1 with a status-aware one.
drop policy if exists "products_public_read" on public.products;

create policy "products_public_read"
  on public.products for select
  using (status = 'published' or public.is_admin());

-- ----------------------------------------------------------------------------
-- categories: image
-- ----------------------------------------------------------------------------
alter table public.categories
  add column if not exists image text not null default '';

-- ----------------------------------------------------------------------------
-- orders
-- ----------------------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  customer_name text not null,
  phone text not null,
  email text,
  address text not null default '',
  city text not null default '',
  state text not null default '',
  country text not null default '',
  pincode text not null default '',
  payment_method text not null default 'cod',
  order_status text not null default 'pending'
    check (order_status in ('pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled')),
  total_price numeric(10, 2) not null default 0,
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

-- Orders carry personal contact details, so only the admin can read them.
create policy "orders_admin_select"
  on public.orders for select
  using (public.is_admin());

-- Anyone (including anonymous storefront visitors) can place an order —
-- this is what the WhatsApp-order button on the product page uses.
create policy "orders_public_insert"
  on public.orders for insert
  with check (true);

create policy "orders_admin_update"
  on public.orders for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "orders_admin_delete"
  on public.orders for delete
  using (public.is_admin());

-- ----------------------------------------------------------------------------
-- order_items
-- ----------------------------------------------------------------------------
create table if not exists public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  quantity integer not null default 1 check (quantity > 0),
  price numeric(10, 2) not null default 0
);

create index if not exists order_items_order_id_idx on public.order_items (order_id);

alter table public.order_items enable row level security;

create policy "order_items_admin_select"
  on public.order_items for select
  using (public.is_admin());

-- Must be insertable alongside the parent order from the public storefront.
create policy "order_items_public_insert"
  on public.order_items for insert
  with check (true);

create policy "order_items_admin_delete"
  on public.order_items for delete
  using (public.is_admin());

-- ----------------------------------------------------------------------------
-- settings (single row)
-- ----------------------------------------------------------------------------
create table if not exists public.settings (
  id boolean primary key default true constraint settings_singleton check (id),
  business_name text not null default 'Pretty Pearls',
  logo text not null default '',
  favicon text not null default '',
  whatsapp text not null default '',
  instagram text not null default '',
  facebook text not null default '',
  email text not null default '',
  address text not null default '',
  currency text not null default 'USD',
  shipping_charge numeric(10, 2) not null default 0,
  footer_text text not null default '',
  updated_at timestamptz not null default now()
);

insert into public.settings (id) values (true) on conflict (id) do nothing;

alter table public.settings enable row level security;

-- Business info (currency, WhatsApp number, etc.) is rendered on the public
-- site, so anyone can read it; only the admin can change it.
create policy "settings_public_read"
  on public.settings for select
  using (true);

create policy "settings_admin_update"
  on public.settings for update
  using (public.is_admin())
  with check (public.is_admin());

drop trigger if exists settings_set_updated_at on public.settings;
create trigger settings_set_updated_at
  before update on public.settings
  for each row execute function public.set_updated_at();
