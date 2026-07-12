import { createClient } from "@/lib/supabase/server";
import type { ProductRow, CategoryRow, OrderRow, OrderItemRow, SettingsRow } from "@/types/database";

export type Product = ProductRow;
export type Category = CategoryRow;
export type Order = OrderRow;
export type OrderItem = OrderItemRow;
export type Settings = SettingsRow;

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

/** Featured, published products for the homepage gallery. */
export async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("featured", true)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getFeaturedProducts:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getBestsellerProducts(limit = 8): Promise<Product[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("bestseller", true)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getBestsellerProducts:", error.message);
    return [];
  }
  return data ?? [];
}

export type ProductQuery = {
  search?: string;
  category?: string;
  status?: "published" | "draft" | "all";
  sort?: "newest" | "oldest" | "price_asc" | "price_desc" | "name_asc";
  page?: number;
  perPage?: number;
  /** Admin views need drafts too; the public storefront never sets this. */
  includeAll?: boolean;
};

/**
 * The single flexible product listing query, used by both the admin
 * product table (search/filter/sort/pagination) and any storefront
 * category/browse views.
 */
export async function getProducts(opts: ProductQuery = {}): Promise<{
  products: Product[];
  count: number;
}> {
  const {
    search,
    category,
    status = "all",
    sort = "newest",
    page = 1,
    perPage = 20,
    includeAll = false,
  } = opts;

  const supabase = createClient();
  let query = supabase.from("products").select("*", { count: "exact" });

  if (!includeAll) {
    query = query.eq("status", "published");
  } else if (status !== "all") {
    query = query.eq("status", status);
  }

  if (category) query = query.eq("category", category);
  if (search) query = query.ilike("name", `%${search}%`);

  switch (sort) {
    case "oldest":
      query = query.order("created_at", { ascending: true });
      break;
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    case "name_asc":
      query = query.order("name", { ascending: true });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const from = (page - 1) * perPage;
  const to = from + perPage - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error("getProducts:", error.message);
    return { products: [], count: 0 };
  }
  return { products: data ?? [], count: count ?? 0 };
}

/** All products, newest first — convenience wrapper for admin pages. */
export async function getAllProducts(): Promise<Product[]> {
  const { products } = await getProducts({ includeAll: true, perPage: 500 });
  return products;
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("getProductById:", error.message);
    return null;
  }
  return data;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) {
    console.error("getProductBySlug:", error.message);
    return null;
  }
  return data;
}

export async function getRelatedProducts(
  product: Product,
  limit = 4
): Promise<Product[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", product.category)
    .eq("status", "published")
    .neq("id", product.id)
    .limit(limit);

  if (error) {
    console.error("getRelatedProducts:", error.message);
    return [];
  }
  return data ?? [];
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export async function getAllCategories(): Promise<Category[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("getAllCategories:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data;
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

export async function getOrders(): Promise<Order[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getOrders:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getOrderById(
  id: string
): Promise<{ order: Order; items: (OrderItem & { product: Product | null })[] } | null> {
  const supabase = createClient();
  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !order) return null;

  const { data: items } = await supabase
    .from("order_items")
    .select("*, product:products(*)")
    .eq("order_id", id);

  return {
    order,
    items: (items ?? []) as unknown as (OrderItem & { product: Product | null })[],
  };
}

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

export async function getSettings(): Promise<Settings> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .eq("id", true)
    .single();

  if (error || !data) {
    // Sensible fallback so the storefront never crashes if settings hasn't
    // been seeded yet.
    return {
      id: true,
      business_name: "Pretty Pearls",
      logo: "",
      favicon: "",
      whatsapp: "",
      instagram: "",
      facebook: "",
      email: "",
      address: "",
      currency: "USD",
      shipping_charge: 0,
      footer_text: "",
      updated_at: new Date().toISOString(),
    };
  }
  return data;
}
