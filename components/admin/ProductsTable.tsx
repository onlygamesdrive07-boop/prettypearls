"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  deleteProduct,
  bulkDeleteProducts,
  duplicateProduct,
  toggleFeatured,
  toggleStatus,
} from "@/lib/actions";
import { useToast } from "@/components/Toast";
import type { Product } from "@/lib/products";

export default function ProductsTable({ products }: { products: Product[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pending, startTransition] = useTransition();
  const { showToast } = useToast();

  const allSelected = products.length > 0 && selected.size === products.length;

  const toggleAll = () => {
    setSelected(allSelected ? new Set() : new Set(products.map((p) => p.id)));
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleBulkDelete = () => {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} selected product(s)? This can't be undone.`)) return;
    startTransition(async () => {
      try {
        await bulkDeleteProducts(Array.from(selected));
        showToast(`${selected.size} product(s) deleted.`);
        setSelected(new Set());
      } catch (err) {
        showToast(err instanceof Error ? err.message : "Bulk delete failed.", "error");
      }
    });
  };

  return (
    <div>
      {selected.size > 0 && (
        <div className="mb-3 flex items-center justify-between rounded-xl bg-charcoal px-5 py-3 text-sm text-ivory">
          <span>{selected.size} selected</span>
          <button
            onClick={handleBulkDelete}
            disabled={pending}
            className="rounded-full bg-red-500/90 px-4 py-1.5 text-xs transition-colors hover:bg-red-500 disabled:opacity-50"
          >
            Delete Selected
          </button>
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-charcoal/10 bg-white/50">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-charcoal/10 text-xs uppercase tracking-widest2 text-charcoal/40">
              <th className="w-10 px-5 py-4">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="h-4 w-4 accent-gold"
                />
              </th>
              <th className="px-5 py-4">Product</th>
              <th className="px-5 py-4">Category</th>
              <th className="px-5 py-4">Price</th>
              <th className="px-5 py-4">Stock</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Featured</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-charcoal/5 last:border-0">
                <td className="px-5 py-4">
                  <input
                    type="checkbox"
                    checked={selected.has(p.id)}
                    onChange={() => toggleOne(p.id)}
                    className="h-4 w-4 accent-gold"
                  />
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
                    <div>
                      <p className="font-medium text-charcoal">{p.name}</p>
                      {p.sku && <p className="text-xs text-charcoal/40">SKU: {p.sku}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 capitalize text-charcoal/70">{p.category}</td>
                <td className="px-5 py-4 text-gold-dark">${p.price.toFixed(2)}</td>
                <td className="px-5 py-4 text-charcoal/70">{p.stock}</td>
                <td className="px-5 py-4">
                  <button
                    onClick={() =>
                      startTransition(async () => {
                        try {
                          await toggleStatus(p.id, p.status === "published" ? "draft" : "published");
                          showToast(
                            p.status === "published" ? "Moved to draft." : "Published."
                          );
                        } catch (err) {
                          showToast(err instanceof Error ? err.message : "Failed.", "error");
                        }
                      })
                    }
                    className={`rounded-full px-3 py-1 text-xs ${
                      p.status === "published"
                        ? "bg-green-50 text-green-700"
                        : "bg-charcoal/5 text-charcoal/50"
                    }`}
                  >
                    {p.status === "published" ? "Published" : "Draft"}
                  </button>
                </td>
                <td className="px-5 py-4">
                  <button
                    onClick={() =>
                      startTransition(async () => {
                        try {
                          await toggleFeatured(p.id, !p.featured);
                          showToast(!p.featured ? "Featured." : "Unfeatured.");
                        } catch (err) {
                          showToast(err instanceof Error ? err.message : "Failed.", "error");
                        }
                      })
                    }
                    className={`rounded-full px-4 py-1.5 text-xs transition-colors ${
                      p.featured
                        ? "bg-gold/20 text-gold-dark"
                        : "border border-charcoal/15 text-charcoal/50 hover:border-gold"
                    }`}
                  >
                    {p.featured ? "★ Featured" : "☆ Feature"}
                  </button>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="rounded-full border border-charcoal/15 px-4 py-1.5 text-xs text-charcoal transition-colors hover:border-gold"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() =>
                        startTransition(async () => {
                          try {
                            await duplicateProduct(p.id);
                            showToast("Product duplicated as a draft.");
                          } catch (err) {
                            showToast(err instanceof Error ? err.message : "Failed.", "error");
                          }
                        })
                      }
                      className="rounded-full border border-charcoal/15 px-4 py-1.5 text-xs text-charcoal transition-colors hover:border-gold"
                    >
                      Duplicate
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${p.name}"? This can't be undone.`)) {
                          startTransition(async () => {
                            try {
                              await deleteProduct(p.id);
                              showToast(`"${p.name}" deleted.`);
                            } catch (err) {
                              showToast(err instanceof Error ? err.message : "Failed.", "error");
                            }
                          });
                        }
                      }}
                      className="rounded-full border border-red-200 px-4 py-1.5 text-xs text-red-600 transition-colors hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-10 text-center text-charcoal/40">
                  No products match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
