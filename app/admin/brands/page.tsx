"use client";

import React from "react";
import { ComingSoonPanel } from "@/app/components/Admin/ComingSoonPanel";

/**
 * Brands. The backend has no brand model or endpoints (a product's brand is
 * only a free-text field), so this page says so instead of listing samples.
 */
export default function BrandsListing() {
  return (
    <div className="flex flex-col gap-6">
      <ComingSoonPanel
        illustration="products"
        title="Brands"
        description="This page will let you manage the brands shown on the store: add a brand with its logo, turn it on or off, and see how many products each one has. Brands aren't a separate record in the backend yet; a product's brand is only text typed on the product, so there's no list to manage here."
        needs={[
          "A brand table (name, slug, logo, status)",
          "Admin endpoints to create, edit, deactivate and delete brands",
          "Products linking to a brand record instead of free text, with a product count per brand",
        ]}
        related={[
          { label: "Products", href: "/admin/products" },
          { label: "Categories", href: "/admin/categories" },
        ]}
      />
    </div>
  );
}
