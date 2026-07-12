// Data access now lives in lib/database.ts. Kept as a re-export so existing
// imports of "@/lib/categories" keep working unchanged.
export {
  getAllCategories,
  getCategoryBySlug,
  type Category,
} from "@/lib/database";
