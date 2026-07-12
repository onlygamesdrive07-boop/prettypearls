"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { placeOrderViaWhatsApp } from "@/lib/actions";
import { useToast } from "@/components/Toast";

export default function WhatsAppOrderButton({
  product,
}: {
  product: { id: string; name: string; price: number };
}) {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pending, startTransition] = useTransition();
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await placeOrderViaWhatsApp(product, quantity, { name, phone });
      if (result.error) {
        showToast(result.error, "error");
        return;
      }
      if (result.whatsappUrl) {
        window.open(result.whatsappUrl, "_blank", "noopener,noreferrer");
      }
      showToast("Order placed — continue on WhatsApp.");
      setOpen(false);
    });
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-4 w-full rounded-full bg-[#25D366] px-8 py-4 text-sm tracking-wide text-white transition-colors duration-300 hover:brightness-95"
      >
        Order via WhatsApp
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/60 p-4 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.form
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleSubmit}
              className="w-full max-w-sm rounded-3xl bg-ivory p-7 shadow-luxe"
            >
              <h3 className="font-display text-2xl font-light text-charcoal">
                Quick Order
              </h3>
              <p className="mt-1 text-sm text-charcoal/50">{product.name}</p>

              <div className="mt-5 space-y-3">
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-lg border border-charcoal/15 bg-white/70 px-4 py-3 text-sm focus:border-gold focus:outline-none"
                />
                <input
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone number"
                  className="w-full rounded-lg border border-charcoal/15 bg-white/70 px-4 py-3 text-sm focus:border-gold focus:outline-none"
                />
                <div className="flex items-center gap-3">
                  <label className="text-sm text-charcoal/60">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-20 rounded-lg border border-charcoal/15 bg-white/70 px-3 py-2 text-sm focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={pending}
                className="mt-6 w-full rounded-full bg-[#25D366] px-8 py-3.5 text-sm text-white transition-colors hover:brightness-95 disabled:opacity-50"
              >
                {pending ? "Placing order…" : "Continue on WhatsApp"}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-2 w-full rounded-full px-8 py-2 text-xs text-charcoal/40"
              >
                Cancel
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
