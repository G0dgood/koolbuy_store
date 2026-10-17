"use client";

import React from "react";
import { ComingSoonPanel } from "@/app/components/Admin/ComingSoonPanel";

/**
 * Promo codes. The backend has no promo code model or endpoints, and checkout
 * applies no discounts, so this page says so instead of listing sample codes.
 */
export default function MarketingPromocodePage() {
  return (
    <div className="flex flex-col gap-6">
      <ComingSoonPanel
        illustration="promotions"
        title="Promocode"
        description="This page will let you create promo codes (fixed or percentage off), set who funds the discount, cap usage and schedule start and end dates, then see how often each code was used. Promo codes don't exist in the backend yet, so there are no codes to manage."
        needs={[
          "A promo code table (code, discount type and value, funded by vendor or KoolBuy, usage limits, start and end dates, status)",
          "Admin endpoints to create, edit, pause and delete promo codes",
          "Checkout validating a code and recording the discount on the order",
        ]}
        related={[
          { label: "Transactions", href: "/admin/transactions" },
          { label: "Orders", href: "/admin/orders" },
        ]}
      />
    </div>
  );
}
