import { getAllCategories } from "@/lib/categories";
import { createProduct } from "@/lib/actions";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const categories = await getAllCategories();

  return (
    <div>
      <h1 className="font-display text-3xl font-light text-charcoal">
        Add Product
      </h1>
      <p className="mt-1 text-sm text-charcoal/50">
        Upload photos and details for a new handmade piece.
      </p>

      <div className="mt-8 rounded-2xl border border-charcoal/10 bg-white/50 p-6 md:p-8">
        <ProductForm
          action={createProduct}
          categories={categories}
          submitLabel="Publish Product"
        />
      </div>
    </div>
  );
}
