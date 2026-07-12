"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "@/lib/products";

export default function ProductModal({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const [activeImg, setActiveImg] = useState(0);
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);

  const gallery =
    product && product.gallery.length > 0 ? product.gallery : product ? [product.image] : [];

  return (
    <AnimatePresence
      onExitComplete={() => {
        setActiveImg(0);
        setAdded(false);
      }}
    >
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/70 p-4 backdrop-blur-md md:p-10"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative grid max-h-[88vh] w-full max-w-5xl grid-cols-1 overflow-y-auto rounded-[28px] bg-ivory shadow-luxe md:grid-cols-2 md:overflow-hidden"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-ivory/80 text-charcoal backdrop-blur transition hover:bg-ivory"
            >
              ✕
            </button>

            {/* Gallery */}
            <div className="relative bg-beige/40">
              <div className="relative aspect-square w-full overflow-hidden md:aspect-auto md:h-full">
                <AnimatePresence mode="wait">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <motion.img
                    key={activeImg}
                    src={gallery[activeImg]}
                    alt={product.name}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full w-full object-cover"
                  />
                </AnimatePresence>
              </div>
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                {gallery.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`View image ${i + 1}`}
                    onClick={() => setActiveImg(i)}
                    className={`h-1.5 w-6 rounded-full transition-all duration-300 ${
                      activeImg === i ? "bg-gold" : "bg-ivory/70"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="flex flex-col justify-center p-8 md:p-12">
              <span className="eyebrow w-fit rounded-full bg-gold/15 px-3 py-1 text-gold-dark">
                Handmade Piece
              </span>
              <h2 className="mt-5 font-display text-4xl font-light text-charcoal">
                {product.name}
              </h2>
              <p className="mt-4 font-body text-base font-light leading-relaxed text-charcoal/65">
                {product.description}
              </p>

              <div className="mt-7">
                <p className="eyebrow mb-3 text-charcoal/40">Details</p>
                <ul className="space-y-1.5">
                  <li className="flex items-center gap-2 text-sm font-light capitalize text-charcoal/70">
                    <span className="h-1 w-1 rounded-full bg-gold" />
                    Category: {product.category}
                  </li>
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
                    <span className="h-1 w-1 rounded-full bg-gold" />
                    {product.stock > 0
                      ? `${product.stock} in stock`
                      : "Made to order"}
                  </li>
                  <li className="flex items-center gap-2 text-sm font-light text-charcoal/70">
                    <span className="h-1 w-1 rounded-full bg-gold" />
                    Hand-finished, one piece at a time
                  </li>
                </ul>
              </div>

              <div className="mt-9 flex items-center gap-4">
                <span className="font-display text-3xl text-gold-dark">
                  ${product.price.toFixed(2)}
                </span>
                {product.compare_price && product.compare_price > product.price && (
                  <span className="font-body text-lg text-charcoal/35 line-through">
                    ${product.compare_price.toFixed(2)}
                  </span>
                )}
              </div>

              <div className="mt-6 flex items-center gap-3">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setAdded(true)}
                  className="relative flex-1 overflow-hidden rounded-full bg-charcoal px-8 py-4 text-sm tracking-wide text-ivory transition-colors duration-500 hover:bg-gold-dark"
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={added ? "added" : "add"}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="block"
                    >
                      {added ? "Added to Bag ✓" : "Add to Bag"}
                    </motion.span>
                  </AnimatePresence>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => setLiked(!liked)}
                  aria-label="Save to favorites"
                  className="flex h-14 w-14 items-center justify-center rounded-full border border-charcoal/15 text-xl"
                >
                  <motion.span
                    animate={liked ? { scale: [1, 1.4, 1] } : { scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className={liked ? "text-gold-dark" : "text-charcoal/40"}
                  >
                    {liked ? "♥" : "♡"}
                  </motion.span>
                </motion.button>
              </div>

              <a
                href={`/product/${product.slug}`}
                className="mt-4 inline-block text-center text-xs uppercase tracking-widest2 text-charcoal/40 underline-offset-4 transition-colors hover:text-gold-dark hover:underline"
              >
                View full product page →
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
