"use client";

import { motion } from "framer-motion";

const paragraphs = [
  "Pretty Pearls began at a kitchen table, not a factory floor. A spool of thread, a jar of mismatched beads, and a habit of making things by hand for people we loved.",
  "That habit became a craft. Each bracelet still passes through one pair of hands, from the first bead chosen to the final knot tied — nothing is templated, nothing is rushed.",
  "We believe jewelry should carry a story, not just an appearance. So every piece we make is slightly imperfect, entirely intentional, and made to be worn, not just admired.",
];

const reveal = {
  hidden: { opacity: 0, y: 34 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function AboutSection() {
  return (
    <section className="relative overflow-hidden bg-ivory px-6 py-32 md:py-44">
      {/* decorative blurred circles */}
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-10 h-96 w-96 rounded-full bg-beige/40 blur-3xl" />

      <div className="mx-auto max-w-3xl text-center">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="eyebrow text-gold-dark"
        >
          Our Story
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 font-display text-4xl font-light leading-tight text-charcoal md:text-5xl"
        >
          Made by hand,
          <br />
          <span className="italic">not by machine.</span>
        </motion.h2>

        <div className="mt-12 space-y-7">
          {paragraphs.map((p, i) => (
            <motion.p
              key={i}
              custom={i}
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              className="font-body text-lg font-light leading-relaxed text-charcoal/70 md:text-xl"
            >
              {p}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  );
}
