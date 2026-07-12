import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, getRelatedProducts } from "@/lib/database";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/ProductGallery";
import WhatsAppOrderButton from "@/components/WhatsAppOrderButton";
import RelatedProducts from "@/components/RelatedProducts";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const gallery = product.gallery.length > 0 ? product.gallery : [product.image];
  const related = await getRelatedProducts(product);

  return (
    <main>
      <Navbar />

      <section className="px-6 pb-20 pt-32 md:pt-40">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/#collection"
            className="text-xs uppercase tracking-widest2 text-charcoal/40 transition-colors hover:text-gold-dark"
          >
            ← Back to Collection
          </Link>

          <div className="mt-6 grid grid-cols-1 gap-12 md:grid-cols-2">
            <ProductGallery images={gallery} name={product.name} />

            <div>
              <div className="flex items-center gap-2">
                <span className="eyebrow rounded-full bg-gold/15 px-3 py-1 text-gold-dark capitalize">
                  {product.category}
                </span>
                {product.bestseller && (
                  <span className="eyebrow rounded-full bg-charcoal/5 px-3 py-1 text-charcoal/60">
                    Bestseller
                  </span>
                )}
              </div>

              <h1 className="mt-5 font-display text-4xl font-light text-charcoal md:text-5xl">
                {product.name}
              </h1>

              <div className="mt-4 flex items-center gap-3">
                <span className="font-display text-3xl text-gold-dark">
                  ${product.price.toFixed(2)}
                </span>
                {product.compare_price && product.compare_price > product.price && (
                  <span className="text-lg text-charcoal/35 line-through">
                    ${product.compare_price.toFixed(2)}
                  </span>
                )}
              </div>

              <p className="mt-5 font-body text-base font-light leading-relaxed text-charcoal/65">
                {product.description}
              </p>

              <ul className="mt-6 space-y-1.5">
                {product.material && (
                  <li className="flex items-center gap-2 text-sm font-light text-charcoal/70">
                    <span className="h-1 w-1 rounded-full bg-gold" />
                    Material: {product.material}
                  </li>
                )}
                {product.colors.length > 0 && (
                  <li className="flex items-center gap-2 text-sm font-light text-charcoal/70">
                    <span className="h-1 w-1 rounded-full bg-gold" />
                    Colors: {product.colors.join(", ")}
                  </li>
                )}
                {product.sizes.length > 0 && (
                  <li className="flex items-center gap-2 text-sm font-light text-charcoal/70">
                    <span className="h-1 w-1 rounded-full bg-gold" />
                    Sizes: {product.sizes.join(", ")}
                  </li>
                )}
                <li className="flex items-center gap-2 text-sm font-light text-charcoal/70">
                  <span className={`h-1.5 w-1.5 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-charcoal/30"}`} />
                  {product.stock > 0 ? `${product.stock} in stock` : "Made to order"}
                </li>
              </ul>

              <WhatsAppOrderButton
                product={{ id: product.id, name: product.name, price: product.price }}
              />
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-beige/20 px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-display text-3xl font-light text-charcoal">
              You may also like
            </h2>
            <RelatedProducts products={related} />
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
