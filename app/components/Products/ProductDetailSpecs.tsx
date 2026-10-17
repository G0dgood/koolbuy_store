"use client";

import React from "react";
import type { ProductAttribute } from "./productDetailShared";

/** Label / value rows for a product's attributes (from the product's `attributes`). */
export const SpecsTable: React.FC<{ specs: ProductAttribute[] }> = ({ specs }) => {
  return (
    <dl className="flex flex-col text-[14px] md:text-[15px]">
      {specs.map((spec) => (
        <div
          key={spec.label}
          className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-3.5 border-t border-black/[0.06] first:border-t-0"
        >
          <dt className="text-subtle sm:w-56 shrink-0">{spec.label}</dt>
          <dd className="text-brand-charcoal">{spec.value}</dd>
        </div>
      ))}
    </dl>
  );
};
