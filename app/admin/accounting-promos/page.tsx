"use client";

import React from "react";
import { ComingSoonPanel } from "@/app/components/Admin/ComingSoonPanel";

/**
 * Promo code accounting. The backend has no promo codes or discounts yet
 * (no table, no endpoints; checkout applies no discounts), so this page says
 * so instead of showing sample figures.
 */
export default function AccountingPromosPage() {
  return (
    <div className="flex flex-col gap-6">
      <ComingSoonPanel
        illustration="promotions"
        title="Promo code accounting"
        description="This page will show which orders used a promo code, how much of each discount the vendor or KoolBuy paid for, and promo usage totals. Promo codes don't exist in the backend yet, so there's nothing to report."
        needs={[
          "A promo code table (code, type, value, who funds it: vendor or admin, limits, dates)",
          "Checkout applying the code and recording the discount on the order",
          "An admin endpoint listing orders with their promo discounts and totals",
        ]}
        related={[
          { label: "Transactions", href: "/admin/transactions" },
          { label: "Orders", href: "/admin/orders" },
        ]}
      />
    </div>
  );
}
