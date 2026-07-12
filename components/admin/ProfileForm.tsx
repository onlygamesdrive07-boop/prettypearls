"use client";

import { useFormState, useFormStatus } from "react-dom";
import { updatePassword, type ActionState } from "@/lib/actions";

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-charcoal px-8 py-3.5 text-sm tracking-wide text-ivory transition-colors duration-300 hover:bg-gold-dark disabled:opacity-50"
    >
      {pending ? "Updating…" : "Update Password"}
    </button>
  );
}

export default function ProfileForm() {
  const [state, formAction] = useFormState<ActionState, FormData>(updatePassword, {
    error: null,
  });

  return (
    <form action={formAction} className="max-w-sm space-y-4">
      <div>
        <label className="mb-1.5 block text-xs uppercase tracking-widest2 text-charcoal/50">
          New password
        </label>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          className="w-full rounded-lg border border-charcoal/15 bg-white/60 px-4 py-3 text-sm focus:border-gold focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs uppercase tracking-widest2 text-charcoal/50">
          Confirm new password
        </label>
        <input
          name="confirm"
          type="password"
          required
          minLength={8}
          className="w-full rounded-lg border border-charcoal/15 bg-white/60 px-4 py-3 text-sm focus:border-gold focus:outline-none"
        />
      </div>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>
      )}
      {state.success && (
        <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">{state.success}</p>
      )}

      <SaveButton />
    </form>
  );
}
