"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const LINKS = [
  { label: "Collection", href: "#collection" },
  { label: "Our Craft", href: "#why-handmade" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ease-luxe ${
        scrolled ? "py-3" : "py-6"
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-full px-6 transition-all duration-500 ease-luxe md:px-8 ${
          scrolled ? "glass shadow-luxe py-3" : "py-2"
        }`}
        style={{ marginLeft: "1rem", marginRight: "1rem" }}
      >
        <a href="#" className="font-display text-xl tracking-wide text-charcoal">
          Pretty <span className="italic text-gold-dark">Pearls</span>
        </a>

        <nav className="hidden items-center gap-9 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-sm font-light tracking-wide text-charcoal/80 transition-colors hover:text-charcoal after:absolute after:-bottom-1 after:left-0 after:h-[1px] after:w-0 after:bg-gold after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className="hidden rounded-full border border-charcoal/20 px-5 py-2 text-sm text-charcoal transition-all duration-300 hover:border-gold hover:text-gold-dark md:inline-block"
        >
          Get in Touch
        </a>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
          className="flex flex-col gap-1.5 md:hidden"
        >
          <span className="h-[1px] w-6 bg-charcoal" />
          <span className="h-[1px] w-6 bg-charcoal" />
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass mx-4 mt-2 flex flex-col gap-1 rounded-3xl p-4 md:hidden"
        >
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-sm text-charcoal/80 hover:bg-white/40"
            >
              {link.label}
            </a>
          ))}
        </motion.div>
      )}
    </motion.header>
  );
}
