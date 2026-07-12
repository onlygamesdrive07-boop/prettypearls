import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import { getAllCategories } from "@/lib/categories";

export default async function AdminDashboardPage() {
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
  ]);

  const featuredCount = products.filter((p) => p.featured).length;
  const outOfStock = products.filter((p) => p.stock === 0).length;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

  const stats = [
    { label: "Total Products", value: products.length },
    { label: "Featured", value: featuredCount },
    { label: "Categories", value: categories.length },
    { label: "Out of Stock", value: outOfStock },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-light text-charcoal">
        Dashboard
      </h1>
      <p className="mt-1 text-sm text-charcoal/50">
        A quick look at the Pretty Pearls catalog.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-charcoal/10 bg-white/60 p-5"
          >
            <p className="text-xs uppercase tracking-widest2 text-charcoal/40">
              {s.label}
            </p>
            <p className="mt-2 font-display text-3xl text-charcoal">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/admin/products/new"
          className="rounded-full bg-charcoal px-6 py-3 text-sm text-ivory transition-colors hover:bg-gold-dark"
        >
          + Add Product
        </Link>
        <Link
          href="/admin/products"
          className="rounded-full border border-charcoal/15 px-6 py-3 text-sm text-charcoal transition-colors hover:border-gold"
        >
          Manage Products
        </Link>
        <Link
          href="/admin/categories"
          className="rounded-full border border-charcoal/15 px-6 py-3 text-sm text-charcoal transition-colors hover:border-gold"
        >
          Manage Categories
        </Link>
      </div>

      <div className="mt-12">
        <h2 className="font-display text-xl text-charcoal">Recently added</h2>
        <div className="mt-4 space-y-2">
          {products.slice(0, 5).map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-xl border border-charcoal/10 bg-white/50 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image}
                  alt=""
                  className="h-10 w-10 rounded-lg object-cover"
                />
                <span className="text-sm text-charcoal">{p.name}</span>
              </div>
              <span className="text-sm text-gold-dark">
                ${p.price.toFixed(2)}
              </span>
            </div>
          ))}
          {products.length === 0 && (
            <p className="text-sm text-charcoal/40">
              No products yet — add your first one.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
