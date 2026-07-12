// Data access now lives in lib/database.ts. Kept as a re-export so existing
// imports of "@/lib/products" (ProductCard, ProductModal, FeaturedCollection)
// keep working unchanged.
export {
  getFeaturedProducts,
  getBestsellerProducts,
  getAllProducts,
  getProducts,
  getProductById,
  getProductBySlug,
  getRelatedProducts,
  slugify,
  type Product,
  type ProductQuery,
} from "@/lib/database";
