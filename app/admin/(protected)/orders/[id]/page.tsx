import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/database";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const result = await getOrderById(params.id);
  if (!result) notFound();
  const { order, items } = result;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-light text-charcoal">
            Order #{order.id.slice(0, 8)}
          </h1>
          <p className="mt-1 text-sm text-charcoal/50">
            Placed {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
        <OrderStatusSelect id={order.id} status={order.order_status} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-charcoal/10 bg-white/50 p-5">
          <p className="eyebrow mb-3 text-charcoal/40">Customer</p>
          <p className="text-sm text-charcoal">{order.customer_name}</p>
          <p className="text-sm text-charcoal/60">{order.phone}</p>
          {order.email && <p className="text-sm text-charcoal/60">{order.email}</p>}
        </div>
        <div className="rounded-2xl border border-charcoal/10 bg-white/50 p-5">
          <p className="eyebrow mb-3 text-charcoal/40">Shipping</p>
          <p className="text-sm text-charcoal/70">
            {[order.address, order.city, order.state, order.pincode, order.country]
              .filter(Boolean)
              .join(", ") || "Not provided"}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <p className="eyebrow mb-3 text-charcoal/40">Items</p>
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl border border-charcoal/10 bg-white/50 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                {item.product?.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.product.image}
                    alt=""
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                )}
                <div>
                  <p className="text-sm text-charcoal">
                    {item.product?.name ?? "Product removed"}
                  </p>
                  <p className="text-xs text-charcoal/40">Qty {item.quantity}</p>
                </div>
              </div>
              <span className="text-sm text-gold-dark">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-charcoal/10 pt-4">
          <span className="text-sm text-charcoal/60">Total</span>
          <span className="font-display text-xl text-gold-dark">
            ${order.total_price.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
