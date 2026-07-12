"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import type { Category } from "@/lib/categories";

export default function ProductsFilterBar({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page"); // reset pagination whenever a filter changes
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        defaultValue={searchParams.get("search") ?? ""}
        onChange={(e) => setParam("search", e.target.value)}
        placeholder="Search products…"
        className="w-full max-w-xs rounded-lg border border-charcoal/15 bg-white/60 px-4 py-2.5 text-sm focus:border-gold focus:outline-none"
      />

      <select
        defaultValue={searchParams.get("category") ?? ""}
        onChange={(e) => setParam("category", e.target.value)}
        className="rounded-lg border border-charcoal/15 bg-white/60 px-4 py-2.5 text-sm focus:border-gold focus:outline-none"
      >
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.slug}>
            {c.name}
          </option>
        ))}
      </select>

      <select
        defaultValue={searchParams.get("status") ?? "all"}
        onChange={(e) => setParam("status", e.target.value)}
        className="rounded-lg border border-charcoal/15 bg-white/60 px-4 py-2.5 text-sm focus:border-gold focus:outline-none"
      >
        <option value="all">All statuses</option>
        <option value="published">Published</option>
        <option value="draft">Draft</option>
      </select>

      <select
        defaultValue={searchParams.get("sort") ?? "newest"}
        onChange={(e) => setParam("sort", e.target.value)}
        className="rounded-lg border border-charcoal/15 bg-white/60 px-4 py-2.5 text-sm focus:border-gold focus:outline-none"
      >
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
        <option value="price_asc">Price: low to high</option>
        <option value="price_desc">Price: high to low</option>
        <option value="name_asc">Name: A–Z</option>
      </select>
    </div>
  );
}
