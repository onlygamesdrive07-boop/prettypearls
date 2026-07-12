// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------
export type ProductRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: number;
  compare_price: number | null;
  category: string;
  image: string;
  gallery: string[];
  material: string;
  colors: string[];
  sizes: string[];
  featured: boolean;
  bestseller: boolean;
  status: "published" | "draft";
  stock: number;
  sku: string | null;
  created_at: string;
  updated_at: string;
};

export type ProductInsert = {
  id?: string;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  price?: number;
  compare_price?: number | null;
  category?: string;
  image?: string;
  gallery?: string[];
  material?: string;
  colors?: string[];
  sizes?: string[];
  featured?: boolean;
  bestseller?: boolean;
  status?: "published" | "draft";
  stock?: number;
  sku?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type ProductUpdate = Partial<ProductInsert>;

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------
export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  image: string;
  created_at: string;
};

export type CategoryInsert = {
  id?: string;
  name: string;
  slug: string;
  image?: string;
  created_at?: string;
};

export type CategoryUpdate = Partial<CategoryInsert>;

// ---------------------------------------------------------------------------
// Admin users
// ---------------------------------------------------------------------------
export type AdminUserRow = {
  id: string;
  email: string;
  created_at: string;
};

export type AdminUserInsert = {
  id: string;
  email: string;
  created_at?: string;
};

export type AdminUserUpdate = Partial<AdminUserInsert>;

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled";

export type OrderRow = {
  id: string;
  customer_name: string;
  phone: string;
  email: string | null;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  payment_method: string;
  order_status: OrderStatus;
  total_price: number;
  created_at: string;
};

export type OrderInsert = {
  id?: string;
  customer_name: string;
  phone: string;
  email?: string | null;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  payment_method?: string;
  order_status?: OrderStatus;
  total_price?: number;
  created_at?: string;
};

export type OrderUpdate = Partial<OrderInsert>;

// ---------------------------------------------------------------------------
// Order items
// ---------------------------------------------------------------------------
export type OrderItemRow = {
  id: string;
  order_id: string;
  product_id: string | null;
  quantity: number;
  price: number;
};

export type OrderItemInsert = {
  id?: string;
  order_id: string;
  product_id?: string | null;
  quantity?: number;
  price?: number;
};

export type OrderItemUpdate = Partial<OrderItemInsert>;

// ---------------------------------------------------------------------------
// Settings (single row)
// ---------------------------------------------------------------------------
export type SettingsRow = {
  id: boolean;
  business_name: string;
  logo: string;
  favicon: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  email: string;
  address: string;
  currency: string;
  shipping_charge: number;
  footer_text: string;
  updated_at: string;
};

export type SettingsInsert = Partial<SettingsRow>;
export type SettingsUpdate = Partial<SettingsRow>;

// ---------------------------------------------------------------------------
// Database
// ---------------------------------------------------------------------------
export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "12";
  };
  public: {
    Tables: {
      products: { Row: ProductRow; Insert: ProductInsert; Update: ProductUpdate };
      categories: { Row: CategoryRow; Insert: CategoryInsert; Update: CategoryUpdate };
      admin_users: { Row: AdminUserRow; Insert: AdminUserInsert; Update: AdminUserUpdate };
      orders: { Row: OrderRow; Insert: OrderInsert; Update: OrderUpdate };
      order_items: { Row: OrderItemRow; Insert: OrderItemInsert; Update: OrderItemUpdate };
      settings: { Row: SettingsRow; Insert: SettingsInsert; Update: SettingsUpdate };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
