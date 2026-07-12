"use client";

import { motion } from "framer-motion";
import { timeline } from "@/lib/data";

export default function WhyHandmade() {
  return (
    <section
      id="why-handmade"
      className="relative overflow-hidden bg-charcoal px-6 py-32 text-ivory md:py-44"
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-gold/10 blur-[120px]" />

      <div className="relative mx-auto max-w-3xl text-center">
        <span className="eyebrow text-gold-light">Why Handmade</span>
        <h2 className="mt-5 font-display text-4xl font-light md:text-5xl">
          From raw bead
          <br />
          <span className="italic text-gold-light">to finished story.</span>
        </h2>
      </div>

      <div className="relative mx-auto mt-24 max-w-2xl">
        <div className="absolute left-[15px] top-2 h-full w-[1px] bg-ivory/10 md:left-1/2 md:-translate-x-1/2" />

        {timeline.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className={`relative mb-14 flex items-start gap-6 md:mb-20 md:w-1/2 ${
              i % 2 === 0
                ? "md:ml-0 md:flex-row md:pr-12 md:text-right"
                : "md:ml-auto md:flex-row-reverse md:pl-12 md:text-left"
            }`}
          >
            <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold bg-charcoal text-xs text-gold-light md:absolute md:top-0 md:h-8 md:w-8">
              {i + 1}
            </span>
            <div className={i % 2 === 0 ? "md:mr-8" : "md:ml-8"}>
              <h3 className="font-display text-2xl font-light text-ivory">
                {step.title}
              </h3>
              <p className="mt-2 text-sm font-light leading-relaxed text-ivory/55 md:max-w-xs">
                {step.text}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
