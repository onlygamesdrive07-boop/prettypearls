"use client";

import { logout } from "@/lib/actions";

export default function LogoutButton() {
  return (
    <form action={logout} className="mt-3">
      <button
        type="submit"
        className="w-full rounded-full border border-charcoal/15 px-4 py-2 text-xs tracking-wide text-charcoal/70 transition-colors hover:border-gold hover:text-gold-dark"
      >
        Log Out
      </button>
    </form>
  );
}
