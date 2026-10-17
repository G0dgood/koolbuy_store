"use client";

import React from "react";
import { EmptyState } from "@/app/components/EmptyState";

/* Product reviews. Buyers can leave reviews (products_productreview, shown on
   each product page through the public GET /products/:id/reviews/), but the
   admin API has no endpoint to list, reply to or remove reviews yet. Until
   one exists this page explains that instead of showing sample reviews. */

export default function ReviewsPage() {
  return (
    <div className="flex flex-col gap-6 pb-12">
      <EmptyState
        variant="card"
        illustration="reviews"
        title="Review moderation isn't available yet"
        description="Buyers' reviews show on each product page. Listing, replying to and removing them from here will come with a future update."
        action={{ label: "View products", href: "/admin/products" }}
      />
    </div>
  );
}
