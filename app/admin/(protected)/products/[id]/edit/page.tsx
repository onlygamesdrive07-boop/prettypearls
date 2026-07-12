import { notFound } from "next/navigation";
import { getProductById } from "@/lib/products";
import { getAllCategories } from "@/lib/categories";
import { updateProduct } from "@/lib/actions";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const [product, categories] = await Promise.all([
    getProductById(params.id),
    getAllCategories(),
  ]);

  if (!product) notFound();

  const boundUpdate = updateProduct.bind(null, product.id);

  return (
    <div>
      <h1 className="font-display text-3xl font-light text-charcoal">
        Edit Product
      </h1>
      <p className="mt-1 text-sm text-charcoal/50">{product.name}</p>

      <div className="mt-8 rounded-2xl border border-charcoal/10 bg-white/50 p-6 md:p-8">
        <ProductForm
          action={boundUpdate}
          product={product}
          categories={categories}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}
