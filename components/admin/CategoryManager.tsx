"use client";

import { useTransition } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { createCategory, deleteCategory, type ActionState } from "@/lib/actions";
import type { Category } from "@/lib/categories";

function AddButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-charcoal px-6 py-3 text-sm text-ivory transition-colors hover:bg-gold-dark disabled:opacity-50"
    >
      {pending ? "Adding…" : "Add Category"}
    </button>
  );
}

export default function CategoryManager({
  categories,
}: {
  categories: Category[];
}) {
  const [state, formAction] = useFormState<ActionState, FormData>(createCategory, {
    error: null,
  });
  const [pending, startTransition] = useTransition();

  return (
    <div>
      <form action={formAction} className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[220px]">
          <label className="mb-1.5 block text-xs uppercase tracking-widest2 text-charcoal/50">
            New category name
          </label>
          <input
            name="name"
            required
            placeholder="Anklets"
            className="w-full rounded-lg border border-charcoal/15 bg-white/60 px-4 py-3 text-sm focus:border-gold focus:outline-none"
          />
        </div>
        <AddButton />
      </form>
      {state.error && (
        <p className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <div className="mt-8 space-y-2">
        {categories.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between rounded-xl border border-charcoal/10 bg-white/50 px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium text-charcoal">{c.name}</p>
              <p className="text-xs text-charcoal/40">/{c.slug}</p>
            </div>
            <button
              onClick={() => {
                if (confirm(`Delete category "${c.name}"?`)) {
                  startTransition(() => deleteCategory(c.id));
                }
              }}
              disabled={pending}
              className="rounded-full border border-red-200 px-4 py-1.5 text-xs text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="text-sm text-charcoal/40">No categories yet.</p>
        )}
      </div>
    </div>
  );
}
