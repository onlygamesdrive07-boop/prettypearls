"use client";

import { useFormState, useFormStatus } from "react-dom";
import { login, type LoginState } from "@/lib/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-charcoal px-8 py-3.5 text-sm tracking-wide text-ivory transition-colors duration-300 hover:bg-gold-dark disabled:opacity-50"
    >
      {pending ? "Signing in…" : "Sign In"}
    </button>
  );
}

export default function AdminLoginPage() {
  const [state, formAction] = useFormState<LoginState, FormData>(login, {
    error: null,
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-display text-3xl text-charcoal">
            Pretty <span className="italic text-gold-dark">Pearls</span>
          </p>
          <p className="mt-2 text-xs uppercase tracking-widest2 text-charcoal/40">
            Admin Sign In
          </p>
        </div>

        <form action={formAction} className="glass space-y-4 rounded-3xl p-8 shadow-luxe">
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-widest2 text-charcoal/50">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              autoComplete="username"
              className="w-full rounded-lg border border-charcoal/15 bg-white/70 px-4 py-3 text-sm focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-widest2 text-charcoal/50">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-charcoal/15 bg-white/70 px-4 py-3 text-sm focus:border-gold focus:outline-none"
            />
          </div>

          {state.error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {state.error}
            </p>
          )}

          <SubmitButton />
        </form>

        <p className="mt-6 text-center text-xs text-charcoal/40">
          This dashboard is restricted to the Pretty Pearls team.
        </p>
      </div>
    </div>
  );
}
