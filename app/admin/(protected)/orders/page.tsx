import Link from "next/link";
import { getOrders } from "@/lib/database";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <h1 className="font-display text-3xl font-light text-charcoal">Orders</h1>
      <p className="mt-1 text-sm text-charcoal/50">{orders.length} total</p>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-charcoal/10 bg-white/50">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-charcoal/10 text-xs uppercase tracking-widest2 text-charcoal/40">
              <th className="px-5 py-4">Order</th>
              <th className="px-5 py-4">Customer</th>
              <th className="px-5 py-4">Total</th>
              <th className="px-5 py-4">Placed</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-right">View</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-charcoal/5 last:border-0">
                <td className="px-5 py-4 font-mono text-xs text-charcoal/60">
                  {o.id.slice(0, 8)}
                </td>
                <td className="px-5 py-4">
                  <p className="text-charcoal">{o.customer_name}</p>
                  <p className="text-xs text-charcoal/40">{o.phone}</p>
                </td>
                <td className="px-5 py-4 text-gold-dark">${o.total_price.toFixed(2)}</td>
                <td className="px-5 py-4 text-charcoal/60">
                  {new Date(o.created_at).toLocaleDateString()}
                </td>
                <td className="px-5 py-4">
                  <OrderStatusSelect id={o.id} status={o.order_status} />
                </td>
                <td className="px-5 py-4 text-right">
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="rounded-full border border-charcoal/15 px-4 py-1.5 text-xs text-charcoal transition-colors hover:border-gold"
                  >
                    Details
                  </Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-charcoal/40">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
