"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import ImageUploader from "./ImageUploader";
import type { Product } from "@/lib/products";
import type { Category } from "@/lib/categories";
import type { ActionState } from "@/lib/actions";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-charcoal px-8 py-3.5 text-sm tracking-wide text-ivory transition-colors duration-300 hover:bg-gold-dark disabled:opacity-50"
    >
      {pending ? "Saving…" : label}
    </button>
  );
}

export default function ProductForm({
  action,
  product,
  categories,
  submitLabel,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  product?: Product;
  categories: Category[];
  submitLabel: string;
}) {
  const [state, formAction] = useFormState<ActionState, FormData>(action, {
    error: null,
  });

  const [image, setImage] = useState<string[]>(product?.image ? [product.image] : []);
  const [gallery, setGallery] = useState<string[]>(product?.gallery ?? []);

  return (
    <form action={formAction} className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="space-y-5">
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-widest2 text-charcoal/50">
            Product name
          </label>
          <input
            name="name"
            required
            defaultValue={product?.name}
            placeholder="Rosé Knot Bracelet"
            className="w-full rounded-lg border border-charcoal/15 bg-white/60 px-4 py-3 text-sm focus:border-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-widest2 text-charcoal/50">
            Slug (leave blank to auto-generate)
          </label>
          <input
            name="slug"
            defaultValue={product?.slug}
            placeholder="rose-knot-bracelet"
            className="w-full rounded-lg border border-charcoal/15 bg-white/60 px-4 py-3 text-sm focus:border-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-widest2 text-charcoal/50">
            Description
          </label>
          <textarea
            name="description"
            rows={4}
            defaultValue={product?.description}
            placeholder="Woven over three evenings, each blush bead was chosen by hand..."
            className="w-full resize-none rounded-lg border border-charcoal/15 bg-white/60 px-4 py-3 text-sm focus:border-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-widest2 text-charcoal/50">
            Short description <span className="normal-case text-charcoal/30">(product card teaser)</span>
          </label>
          <input
            name="short_description"
            defaultValue={product?.short_description}
            placeholder="A single hand-tied bow beside a freshwater pearl."
            className="w-full rounded-lg border border-charcoal/15 bg-white/60 px-4 py-3 text-sm focus:border-gold focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-widest2 text-charcoal/50">
              Price (USD)
            </label>
            <input
              name="price"
              type="number"
              step="0.01"
              min="0"
              required
              defaultValue={product?.price}
              className="w-full rounded-lg border border-charcoal/15 bg-white/60 px-4 py-3 text-sm focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-widest2 text-charcoal/50">
              Compare-at price <span className="normal-case text-charcoal/30">(optional)</span>
            </label>
            <input
              name="compare_price"
              type="number"
              step="0.01"
              min="0"
              defaultValue={product?.compare_price ?? ""}
              placeholder="For showing a strikethrough discount"
              className="w-full rounded-lg border border-charcoal/15 bg-white/60 px-4 py-3 text-sm focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-widest2 text-charcoal/50">
              Stock
            </label>
            <input
              name="stock"
              type="number"
              min="0"
              defaultValue={product?.stock ?? 0}
              className="w-full rounded-lg border border-charcoal/15 bg-white/60 px-4 py-3 text-sm focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-widest2 text-charcoal/50">
              SKU <span className="normal-case text-charcoal/30">(optional)</span>
            </label>
            <input
              name="sku"
              defaultValue={product?.sku ?? ""}
              placeholder="PP-BR-001"
              className="w-full rounded-lg border border-charcoal/15 bg-white/60 px-4 py-3 text-sm focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-widest2 text-charcoal/50">
              Material
            </label>
            <input
              name="material"
              defaultValue={product?.material}
              placeholder="Freshwater pearls, cotton cord"
              className="w-full rounded-lg border border-charcoal/15 bg-white/60 px-4 py-3 text-sm focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-widest2 text-charcoal/50">
              Status
            </label>
            <select
              name="status"
              defaultValue={product?.status ?? "published"}
              className="w-full rounded-lg border border-charcoal/15 bg-white/60 px-4 py-3 text-sm focus:border-gold focus:outline-none"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-widest2 text-charcoal/50">
              Colors <span className="normal-case text-charcoal/30">(comma separated)</span>
            </label>
            <input
              name="colors"
              defaultValue={product?.colors?.join(", ")}
              placeholder="Blush, Ivory, Gold"
              className="w-full rounded-lg border border-charcoal/15 bg-white/60 px-4 py-3 text-sm focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-widest2 text-charcoal/50">
              Sizes <span className="normal-case text-charcoal/30">(comma separated)</span>
            </label>
            <input
              name="sizes"
              defaultValue={product?.sizes?.join(", ")}
              placeholder="S, M, L"
              className="w-full rounded-lg border border-charcoal/15 bg-white/60 px-4 py-3 text-sm focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-widest2 text-charcoal/50">
            Category
          </label>
          <select
            name="category"
            defaultValue={product?.category}
            className="w-full rounded-lg border border-charcoal/15 bg-white/60 px-4 py-3 text-sm focus:border-gold focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm text-charcoal/70">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={product?.featured}
            className="h-4 w-4 accent-gold"
          />
          Show in Featured Collection on the homepage
        </label>

        <label className="flex items-center gap-2 text-sm text-charcoal/70">
          <input
            type="checkbox"
            name="bestseller"
            defaultChecked={product?.bestseller}
            className="h-4 w-4 accent-gold"
          />
          Mark as bestseller
        </label>
      </div>

      <div className="space-y-5">
        <ImageUploader
          label="Main image"
          initialUrls={image}
          onChange={setImage}
        />
        <ImageUploader
          label="Gallery images (optional, shown in product view)"
          multiple
          initialUrls={gallery}
          onChange={setGallery}
        />

        {/* Hidden fields carry the uploaded URLs into the form submission */}
        <input type="hidden" name="image" value={image[0] ?? ""} />
        <input type="hidden" name="gallery" value={gallery.join(",")} />
      </div>

      <div className="md:col-span-2">
        {state.error && (
          <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {state.error}
          </p>
        )}
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}
