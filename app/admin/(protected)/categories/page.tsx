import { getAllCategories } from "@/lib/categories";
import CategoryManager from "@/components/admin/CategoryManager";

export default async function AdminCategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div>
      <h1 className="font-display text-3xl font-light text-charcoal">
        Categories
      </h1>
      <p className="mt-1 text-sm text-charcoal/50">
        Organize your catalog. Deleting a category won&rsquo;t delete its
        products — they&rsquo;ll just need reassigning.
      </p>

      <div className="mt-8 max-w-xl rounded-2xl border border-charcoal/10 bg-white/50 p-6 md:p-8">
        <CategoryManager categories={categories} />
      </div>
    </div>
  );
}
