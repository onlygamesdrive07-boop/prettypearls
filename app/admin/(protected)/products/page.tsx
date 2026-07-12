import Link from "next/link";
import { getProducts, type ProductQuery } from "@/lib/database";
import { getAllCategories } from "@/lib/categories";
import ProductsFilterBar from "@/components/admin/ProductsFilterBar";
import ProductsTable from "@/components/admin/ProductsTable";

const PER_PAGE = 20;

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const page = Number(searchParams.page || 1);
  const query: ProductQuery = {
    search: searchParams.search || undefined,
    category: searchParams.category || undefined,
    status: (searchParams.status as ProductQuery["status"]) || "all",
    sort: (searchParams.sort as ProductQuery["sort"]) || "newest",
    page,
    perPage: PER_PAGE,
    includeAll: true,
  };

  const [{ products, count }, categories] = await Promise.all([
    getProducts(query),
    getAllCategories(),
  ]);

  const totalPages = Math.max(1, Math.ceil(count / PER_PAGE));

  const buildPageUrl = (p: number) => {
    const params = new URLSearchParams(
      Object.entries(searchParams).filter(([, v]) => v) as [string, string][]
    );
    params.set("page", String(p));
    return `/admin/products?${params.toString()}`;
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-light text-charcoal">
            Products
          </h1>
          <p className="mt-1 text-sm text-charcoal/50">{count} total</p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-charcoal px-6 py-3 text-sm text-ivory transition-colors hover:bg-gold-dark"
        >
          + Add Product
        </Link>
      </div>

      <div className="mt-6">
        <ProductsFilterBar categories={categories} />
      </div>

      <div className="mt-6">
        <ProductsTable products={products} />
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={buildPageUrl(p)}
              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors ${
                p === page
                  ? "bg-charcoal text-ivory"
                  : "border border-charcoal/15 text-charcoal/60 hover:border-gold"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
