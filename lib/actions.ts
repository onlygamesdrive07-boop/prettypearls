"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/database";
import type { OrderRow } from "@/types/database";

export type ActionState = { error: string | null; success?: string | null };
export type LoginState = { error: string | null };

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Please enter both email and password." };
  }

  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return { error: "Invalid email or password." };
  }

  const { data: adminRow } = await supabase
    .from("admin_users")
    .select("*")
    .eq("id", data.user.id)
    .single();

  if (!adminRow) {
    await supabase.auth.signOut();
    return { error: "This account is not authorized for admin access." };
  }

  redirect("/admin");
}

export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function updatePassword(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  const password = String(formData.get("password") || "");
  const confirm = String(formData.get("confirm") || "");

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (password !== confirm) {
    return { error: "Passwords do not match." };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };

  return { error: null, success: "Password updated." };
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

function readProductFields(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const shortDescription = String(formData.get("short_description") || "").trim();
  const price = Number(formData.get("price") || 0);
  const comparePriceRaw = formData.get("compare_price");
  const comparePrice = comparePriceRaw ? Number(comparePriceRaw) : null;
  const category = String(formData.get("category") || "uncategorized").trim();
  const stock = Number(formData.get("stock") || 0);
  const sku = String(formData.get("sku") || "").trim() || null;
  const material = String(formData.get("material") || "").trim();
  const colors = String(formData.get("colors") || "")
    .split(",").map((s) => s.trim()).filter(Boolean);
  const sizes = String(formData.get("sizes") || "")
    .split(",").map((s) => s.trim()).filter(Boolean);
  const featured = formData.get("featured") === "on";
  const bestseller = formData.get("bestseller") === "on";
  const status = formData.get("status") === "draft" ? "draft" : "published";
  const image = String(formData.get("image") || "");
  const galleryRaw = String(formData.get("gallery") || "");
  const gallery = galleryRaw.split(",").map((s) => s.trim()).filter(Boolean);
  const slugInput = String(formData.get("slug") || "") || name;

  return {
    name,
    description,
    short_description: shortDescription,
    price,
    compare_price: comparePrice,
    category,
    stock,
    sku,
    material,
    colors,
    sizes,
    featured,
    bestseller,
    status: status as "published" | "draft",
    image,
    gallery,
    slug: slugify(slugInput),
  };
}

export async function createProduct(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  const fields = readProductFields(formData);

  if (!fields.name) return { error: "Product name is required." };
  if (!fields.image) return { error: "Please upload a main image." };

  const supabase = createClient();
  const { error } = await supabase.from("products").insert(fields);

  if (error) {
    return {
      error: error.message.includes("duplicate")
        ? "A product with this slug or SKU already exists."
        : error.message,
    };
  }

  revalidatePath("/");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProduct(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  const fields = readProductFields(formData);

  if (!fields.name) return { error: "Product name is required." };

  const supabase = createClient();
  const { error } = await supabase.from("products").update(fields).eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  const supabase = createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/products");
}

export async function bulkDeleteProducts(ids: string[]) {
  await requireAdmin();
  const supabase = createClient();
  const { error } = await supabase.from("products").delete().in("id", ids);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/products");
}

export async function duplicateProduct(id: string) {
  await requireAdmin();
  const supabase = createClient();
  const { data: original, error: fetchError } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !original) throw new Error(fetchError?.message ?? "Product not found.");

  const { id: _oldId, created_at, updated_at, slug, sku, ...rest } = original;
  const newName = `${original.name} (Copy)`;

  const { error } = await supabase.from("products").insert({
    ...rest,
    name: newName,
    slug: slugify(`${newName}-${Date.now()}`),
    sku: null, // SKUs are unique — don't carry the original over
    status: "draft",
  });

  if (error) throw new Error(error.message);
  revalidatePath("/admin/products");
}

export async function toggleFeatured(id: string, featured: boolean) {
  await requireAdmin();
  const supabase = createClient();
  const { error } = await supabase.from("products").update({ featured }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/products");
}

export async function toggleBestseller(id: string, bestseller: boolean) {
  await requireAdmin();
  const supabase = createClient();
  const { error } = await supabase.from("products").update({ bestseller }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/products");
}

export async function toggleStatus(id: string, status: "published" | "draft") {
  await requireAdmin();
  const supabase = createClient();
  const { error } = await supabase.from("products").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/products");
}

export async function updateStock(id: string, stock: number) {
  await requireAdmin();
  const supabase = createClient();
  const { error } = await supabase
    .from("products")
    .update({ stock: Math.max(0, stock) })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/products");
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export async function createCategory(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  const name = String(formData.get("name") || "").trim();
  const image = String(formData.get("image") || "");
  if (!name) return { error: "Category name is required." };

  const supabase = createClient();
  const { error } = await supabase
    .from("categories")
    .insert({ name, slug: slugify(name), image });

  if (error) {
    return {
      error: error.message.includes("duplicate") ? "That category already exists." : error.message,
    };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin/products/new");
  return { error: null, success: "Category added." };
}

export async function updateCategory(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  const name = String(formData.get("name") || "").trim();
  const image = String(formData.get("image") || "");
  if (!name) return { error: "Category name is required." };

  const supabase = createClient();
  const { error } = await supabase
    .from("categories")
    .update({ name, slug: slugify(name), image })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/categories");
  return { error: null, success: "Category updated." };
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  const supabase = createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/categories");
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

export async function updateOrderStatus(
  id: string,
  order_status: OrderRow["order_status"]
) {
  await requireAdmin();
  const supabase = createClient();
  const { error } = await supabase.from("orders").update({ order_status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
}

export type PlaceOrderResult = { error: string | null; whatsappUrl?: string };

/**
 * Public action — no admin check. This is what the storefront's "Order via
 * WhatsApp" button calls: it records the order (status `pending`) and hands
 * back a wa.me deep link with the order summary pre-filled.
 */
export async function placeOrderViaWhatsApp(
  product: { id: string; name: string; price: number },
  quantity: number,
  customer: { name: string; phone: string }
): Promise<PlaceOrderResult> {
  const supabase = createClient();

  const total = product.price * quantity;

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      customer_name: customer.name || "WhatsApp customer",
      phone: customer.phone || "",
      payment_method: "cod",
      order_status: "pending",
      total_price: total,
    })
    .select()
    .single();

  if (error || !order) {
    return { error: error?.message ?? "Could not place the order." };
  }

  await supabase.from("order_items").insert({
    order_id: order.id,
    product_id: product.id,
    quantity,
    price: product.price,
  });

  const { data: settings } = await supabase
    .from("settings")
    .select("*")
    .eq("id", true)
    .single();

  const number = (settings?.whatsapp || "").replace(/[^0-9]/g, "");
  const message = encodeURIComponent(
    `Hi! I'd like to order:\n${quantity} × ${product.name} — $${total.toFixed(2)}\nOrder ref: ${order.id.slice(0, 8)}`
  );
  const whatsappUrl = number
    ? `https://wa.me/${number}?text=${message}`
    : `https://wa.me/?text=${message}`;

  return { error: null, whatsappUrl };
}

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

export async function updateSettings(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const fields = {
    business_name: String(formData.get("business_name") || "Pretty Pearls"),
    logo: String(formData.get("logo") || ""),
    favicon: String(formData.get("favicon") || ""),
    whatsapp: String(formData.get("whatsapp") || ""),
    instagram: String(formData.get("instagram") || ""),
    facebook: String(formData.get("facebook") || ""),
    email: String(formData.get("email") || ""),
    address: String(formData.get("address") || ""),
    currency: String(formData.get("currency") || "USD"),
    shipping_charge: Number(formData.get("shipping_charge") || 0),
    footer_text: String(formData.get("footer_text") || ""),
  };

  const supabase = createClient();
  const { error } = await supabase.from("settings").update(fields).eq("id", true);

  if (error) return { error: error.message };

  revalidatePath("/admin/settings");
  revalidatePath("/");
  return { error: null, success: "Settings saved." };
}
