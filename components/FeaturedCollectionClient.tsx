"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import type { Product } from "@/lib/products";

export default function FeaturedCollectionClient({
  products,
}: {
  products: Product[];
}) {
  const [selected, setSelected] = useState<Product | null>(null);

  return (
    <>
      <div className="mx-auto max-w-xl text-center">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="eyebrow text-gold-dark"
        >
          Featured Collection
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 font-display text-4xl font-light text-charcoal md:text-5xl"
        >
          Pieces with a pulse.
        </motion.h2>
      </div>

      {products.length === 0 ? (
        <p className="mx-auto mt-16 max-w-md text-center font-body text-sm font-light text-charcoal/50">
          New pieces are being woven — check back soon, or mark a product as
          “Featured” in the admin dashboard to show it here.
        </p>
      ) : (
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} onOpen={setSelected} />
          ))}
        </div>
      )}

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </>
  );
}
