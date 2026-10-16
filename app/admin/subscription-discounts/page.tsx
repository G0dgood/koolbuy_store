"use client";

import React from "react";
import { ComingSoonPanel } from "@/app/components/Admin/ComingSoonPanel";

/**
 * Subscription discount accounting. There are no subscriptions in the backend
 * yet (no table, no endpoints), so this page says so instead of showing sample
 * figures.
 */
export default function SubscriptionDiscountsPage() {
  return (
    <div className="flex flex-col gap-6">
      <ComingSoonPanel
        illustration="loyalty"
        title="Subscription discounts"
        description="This page will show discounts given on subscription orders and how they split between KoolBuy's and the vendor's account. Subscriptions don't exist in the backend yet, so there's nothing to report."
        needs={[
          "Subscription plans and customer subscriptions in the database",
          "Recurring orders that record the discount and who funds it",
          "An admin endpoint listing those orders with admin vs vendor discount totals",
        ]}
        related={[
          { label: "Transactions", href: "/admin/transactions" },
          { label: "BNPL orders", href: "/admin/bnpl-orders" },
        ]}
      />
    </div>
  );
}
