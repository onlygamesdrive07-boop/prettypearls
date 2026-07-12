"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ContactSection() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section id="contact" className="bg-beige/30 px-6 py-28 md:py-36">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-14 md:grid-cols-2 md:gap-20">
        <div>
          <span className="eyebrow text-gold-dark">Say Hello</span>
          <h2 className="mt-5 font-display text-4xl font-light leading-tight text-charcoal md:text-5xl">
            Have a story
            <br />
            <span className="italic">you&rsquo;d like woven?</span>
          </h2>
          <p className="mt-6 max-w-sm font-body text-base font-light leading-relaxed text-charcoal/60">
            Custom colors, initials, or a piece made for someone specific —
            write to us and we&rsquo;ll bring it to life by hand.
          </p>

          <div className="mt-10 flex items-center gap-4">
            <a
              href="https://wa.me/10000000000"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Message us on WhatsApp"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-charcoal text-ivory transition-transform duration-300 hover:scale-105"
            >
              ✆
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit our Instagram"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-charcoal/20 text-charcoal transition-transform duration-300 hover:scale-105"
            >
              ◎
            </a>
            <a
              href="mailto:hello@prettypearls.com"
              aria-label="Email us"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-charcoal/20 text-charcoal transition-transform duration-300 hover:scale-105"
            >
              ✉
            </a>
          </div>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          onSubmit={handleSubmit}
          className="glass flex flex-col gap-4 rounded-3xl p-8 shadow-luxe"
        >
          <input
            required
            type="text"
            placeholder="Your name"
            className="rounded-xl border border-charcoal/10 bg-ivory/70 px-5 py-3.5 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-gold focus:outline-none"
          />
          <input
            required
            type="email"
            placeholder="Your email"
            className="rounded-xl border border-charcoal/10 bg-ivory/70 px-5 py-3.5 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-gold focus:outline-none"
          />
          <textarea
            required
            rows={4}
            placeholder="Tell us about the piece you have in mind..."
            className="resize-none rounded-xl border border-charcoal/10 bg-ivory/70 px-5 py-3.5 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-gold focus:outline-none"
          />
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="mt-2 rounded-full bg-charcoal px-8 py-4 text-sm tracking-wide text-ivory transition-colors duration-500 hover:bg-gold-dark"
          >
            {sent ? "Message Sent ✓" : "Send Message"}
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
}
