"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { Product } from "@/lib/products";

export default function ProductCard({
  product,
  onOpen,
  index,
}: {
  product: Product;
  onOpen: (p: Product) => void;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), {
    stiffness: 150,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), {
    stiffness: 150,
    damping: 18,
  });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1000 }}
      className="group"
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onClick={() => onOpen(product)}
        className="glass shadow-luxe relative cursor-pointer overflow-hidden rounded-[28px] p-4 transition-shadow duration-500 hover:shadow-gold"
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-beige/40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-luxe group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <span className="absolute right-3 top-3 rounded-full bg-ivory/80 px-3 py-1 text-[10px] uppercase tracking-widest2 text-charcoal/70 backdrop-blur">
            Handmade
          </span>
        </div>

        <div className="mt-5 flex items-start justify-between px-1">
          <div>
            <h3 className="font-display text-xl font-medium text-charcoal">
              {product.name}
            </h3>
            <p className="mt-1.5 max-w-[220px] text-sm font-light leading-snug text-charcoal/60">
              {product.short_description ||
                (product.description.length > 90
                  ? `${product.description.slice(0, 90).trim()}…`
                  : product.description)}
            </p>
          </div>
          <span className="whitespace-nowrap font-display text-lg text-gold-dark">
            ${product.price.toFixed(2)}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
