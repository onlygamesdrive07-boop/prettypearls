import Link from "next/link";
import LogoutButton from "./LogoutButton";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/products/new", label: "Add Product" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/profile", label: "Profile" },
];

export default function AdminSidebar({ email }: { email: string }) {
  return (
    <aside className="flex h-full w-full flex-col justify-between border-r border-charcoal/10 bg-ivory p-6 md:w-64">
      <div>
        <p className="font-display text-xl text-charcoal">
          Pretty <span className="italic text-gold-dark">Pearls</span>
        </p>
        <p className="mt-1 text-xs uppercase tracking-widest2 text-charcoal/40">
          Admin
        </p>

        <nav className="mt-10 flex flex-col gap-1">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-4 py-2.5 text-sm text-charcoal/70 transition-colors hover:bg-beige/40 hover:text-charcoal"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-charcoal/10 pt-5">
        <p className="truncate text-xs text-charcoal/40">{email}</p>
        <LogoutButton />
      </div>
    </aside>
  );
}
