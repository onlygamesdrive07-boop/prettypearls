import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/products";

export async function GET(request: NextRequest) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");

  let query = supabase.from("products").select("*").order("created_at", { ascending: false });
  if (category) query = query.eq("category", category);
  if (featured === "true") query = query.eq("featured", true);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ products: data });
}

/**
 * Admin-only product creation via REST, as an alternative to the
 * `createProduct` Server Action used by the dashboard form — useful for
 * scripted imports or a future external integration.
 */
export async function POST(request: NextRequest) {
  await requireAdmin(); // throws/redirects if not the admin

  const body = await request.json();
  const { name, description = "", price = 0, category = "uncategorized", image = "", gallery = [], featured = false, stock = 0 } = body;

  if (!name || !image) {
    return NextResponse.json(
      { error: "`name` and `image` are required." },
      { status: 400 }
    );
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .insert({
      name,
      slug: slugify(body.slug || name),
      description,
      price,
      category,
      image,
      gallery,
      featured,
      stock,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ product: data }, { status: 201 });
}
