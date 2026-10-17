"use client";

import React from "react";
import { ComingSoonPanel } from "@/app/components/Admin/ComingSoonPanel";

/**
 * Wishlists. Shoppers' wishlists are kept only in their own browser
 * (localStorage) and never reach the backend, so there's nothing to report.
 */
export default function AdminWishlistPage() {
  return (
    <div className="flex flex-col gap-6">
      <ComingSoonPanel
        illustration="wishlist"
        title="Wishlist Products"
        description="This page will show which products shoppers are saving to their wishlists and how many saves each one has, so you can spot demand. Right now a wishlist is stored only in the shopper's own browser and is never sent to the backend, so KoolBuy can't see it."
        needs={[
          "A wishlist table linking signed-in customers to the products they saved",
          "Storefront endpoints to add and remove wishlist items (replacing browser-only storage)",
          "An admin endpoint listing wishlisted products with save counts",
        ]}
        related={[
          { label: "Products", href: "/admin/products" },
          { label: "Product performance", href: "/admin/product-performance" },
        ]}
      />
    </div>
  );
}
