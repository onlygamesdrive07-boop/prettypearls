"use client";

import { motion } from "framer-motion";
import { instagramImages } from "@/lib/data";

export default function InstagramGallery() {
  return (
    <section className="bg-ivory px-6 py-28 md:py-36">
      <div className="mx-auto max-w-xl text-center">
        <span className="eyebrow text-gold-dark">@prettypearls</span>
        <h2 className="mt-5 font-display text-4xl font-light text-charcoal md:text-5xl">
          From the atelier floor.
        </h2>
      </div>

      <div className="mx-auto mt-16 grid max-w-6xl grid-cols-2 gap-4 md:grid-cols-3">
        {instagramImages.map((src, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className={`group relative overflow-hidden rounded-2xl bg-beige/40 ${
              i === 0 ? "col-span-2 row-span-2 md:col-span-1" : ""
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt="Handmade jewelry from the atelier"
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-luxe group-hover:scale-110"
            />
            <div className="absolute inset-0 flex items-end bg-charcoal/0 p-4 opacity-0 transition-all duration-500 group-hover:bg-charcoal/25 group-hover:opacity-100">
              <span className="text-xs tracking-wide text-ivory">
                View on Instagram
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
