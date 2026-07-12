"use client";

import { useTransition } from "react";
import { updateOrderStatus } from "@/lib/actions";
import { useToast } from "@/components/Toast";
import type { OrderRow } from "@/types/database";

const STATUSES: OrderRow["order_status"][] = [
  "pending",
  "confirmed",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
];

const STATUS_STYLES: Record<OrderRow["order_status"], string> = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-blue-50 text-blue-700",
  packed: "bg-purple-50 text-purple-700",
  shipped: "bg-indigo-50 text-indigo-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
};

export default function OrderStatusSelect({
  id,
  status,
}: {
  id: string;
  status: OrderRow["order_status"];
}) {
  const [pending, startTransition] = useTransition();
  const { showToast } = useToast();

  return (
    <select
      value={status}
      disabled={pending}
      onChange={(e) =>
        startTransition(async () => {
          try {
            await updateOrderStatus(id, e.target.value as OrderRow["order_status"]);
            showToast(`Order marked ${e.target.value}.`);
          } catch (err) {
            showToast(err instanceof Error ? err.message : "Failed to update status.", "error");
          }
        })
      }
      className={`rounded-full border-0 px-3 py-1.5 text-xs capitalize outline-none ${STATUS_STYLES[status]}`}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
