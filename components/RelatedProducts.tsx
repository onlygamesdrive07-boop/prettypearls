"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import type { Product } from "@/lib/products";

export default function RelatedProducts({ products }: { products: Product[] }) {
  const [selected, setSelected] = useState<Product | null>(null);

  return (
    <>
      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} onOpen={setSelected} />
        ))}
      </div>
      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </>
  );
}
