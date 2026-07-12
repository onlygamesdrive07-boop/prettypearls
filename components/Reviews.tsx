"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { reviews } from "@/lib/data";

export default function Reviews() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame: number;
    let x = 0;
    const speed = 0.35;

    const loop = () => {
      x -= speed;
      const resetPoint = -(track.scrollWidth / 2);
      if (x <= resetPoint) x = 0;
      track.style.transform = `translate3d(${x}px, 0, 0)`;
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);

  const doubled = [...reviews, ...reviews];

  return (
    <section id="reviews" className="overflow-hidden bg-beige/40 py-28 md:py-36">
      <div className="mx-auto max-w-xl px-6 text-center">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="eyebrow text-gold-dark"
        >
          Kind Words
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 font-display text-4xl font-light text-charcoal md:text-5xl"
        >
          Worn, loved, remembered.
        </motion.h2>
      </div>

      <div className="relative mt-16 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div ref={trackRef} className="flex w-max gap-6 px-6">
          {doubled.map((r, i) => (
            <div
              key={i}
              className="glass w-[300px] shrink-0 rounded-3xl p-7 shadow-luxe md:w-[340px]"
            >
              <p className="text-gold-dark">★★★★★</p>
              <p className="mt-4 font-body text-sm font-light leading-relaxed text-charcoal/75">
                “{r.text}”
              </p>
              <p className="mt-5 font-display text-base text-charcoal/90">
                {r.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
