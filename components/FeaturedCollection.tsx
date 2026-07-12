import FeaturedCollectionClient from "./FeaturedCollectionClient";
import { getFeaturedProducts } from "@/lib/products";

// Note: this reads from Supabase on every render. The `dynamic =
// "force-dynamic"` export that guarantees "no caching" lives in
// app/page.tsx, since Next.js only honors that route-segment config in
// page/layout/route files, not in arbitrary components.
export default async function FeaturedCollection() {
  const products = await getFeaturedProducts();

  return (
    <section id="collection" className="bg-ivory px-6 py-28 md:py-36">
      <div className="mx-auto max-w-6xl">
        <FeaturedCollectionClient products={products} />
      </div>
    </section>
  );
}
