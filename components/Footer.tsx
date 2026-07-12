"use client";

import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="bg-charcoal px-6 pb-10 pt-24 text-ivory md:pt-32">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-14 border-b border-ivory/10 pb-16 md:grid-cols-3 md:gap-10">
          <div>
            <p className="font-display text-3xl">
              Pretty <span className="italic text-gold-light">Pearls</span>
            </p>
            <p className="mt-4 max-w-xs text-sm font-light leading-relaxed text-ivory/50">
              Handcrafted bracelets and keychains, woven bead by bead, story by
              story.
            </p>
          </div>

          <div className="flex gap-16">
            <div>
              <p className="eyebrow mb-4 text-ivory/40">Explore</p>
              <ul className="space-y-2 text-sm font-light text-ivory/70">
                <li><a href="#collection" className="hover:text-gold-light">Collection</a></li>
                <li><a href="#why-handmade" className="hover:text-gold-light">Our Craft</a></li>
                <li><a href="#reviews" className="hover:text-gold-light">Reviews</a></li>
                <li><a href="#contact" className="hover:text-gold-light">Contact</a></li>
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-4 text-ivory/40">Follow</p>
              <ul className="space-y-2 text-sm font-light text-ivory/70">
                <li><a href="https://instagram.com" className="hover:text-gold-light">Instagram</a></li>
                <li><a href="https://wa.me/10000000000" className="hover:text-gold-light">WhatsApp</a></li>
                <li><a href="mailto:hello@prettypearls.com" className="hover:text-gold-light">Email</a></li>
              </ul>
            </div>
          </div>

          <div>
            <p className="eyebrow mb-4 text-ivory/40">Stay in the story</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubscribed(true);
              }}
              className="flex overflow-hidden rounded-full border border-ivory/20"
            >
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="w-full bg-transparent px-5 py-3 text-sm text-ivory placeholder:text-ivory/40 focus:outline-none"
              />
              <button
                type="submit"
                className="whitespace-nowrap bg-gold px-5 text-sm text-charcoal transition-colors hover:bg-gold-light"
              >
                {subscribed ? "✓" : "Join"}
              </button>
            </form>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-8 text-xs font-light text-ivory/40 md:flex-row">
          <p>© {new Date().getFullYear()} Pretty Pearls. All pieces handmade with care.</p>
          <p>Designed as a gallery, not a store.</p>
        </div>
      </div>
    </footer>
  );
}
