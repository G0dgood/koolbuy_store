"use client";

import React from "react";
import { SpecsTable } from "./ProductDetailSpecs";
import type { ProductAttribute } from "./productDetailShared";

/** "Product parameters": the seller's attributes for this product. Hidden when there are none. */
export const ProductFeatureGallery: React.FC<{ attributes: ProductAttribute[] }> = ({ attributes }) => {
  if (attributes.length === 0) return null;
  return (
    <section className="w-full bg-white rounded-tile md:rounded-hero border border-light-gray p-6 sm:p-8 md:p-10">
      <h2 className="text-[22px] md:text-[26px] font-semibold text-brand-charcoal tracking-[-0.02em] mb-4">
        Product parameters
      </h2>
      <SpecsTable specs={attributes} />
    </section>
  );
};
