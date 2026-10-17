"use client";

import React from "react";
import Link from "next/link";
import { EmptyState } from "@/app/components/EmptyState";
import type { ProductView } from "./productDetailShared";

const ProductDescription: React.FC<{ product: ProductView }> = ({ product }) => {
  if (!product.description && product.tags.length === 0) {
    return (
      <EmptyState
        illustration="documents"
        title="No description yet"
        description="The seller's description will appear here once they add one."
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-[800px]">
      {product.description && (
        <p className="text-subtle text-[15px] md:text-[16px] leading-relaxed whitespace-pre-line">
          {product.description}
        </p>
      )}

      {product.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {product.tags.map((tag) => (
            <Link
              key={tag}
              href={`/products?search=${encodeURIComponent(tag)}`}
              className="px-3 py-1.5 rounded-full bg-black/[0.04] text-[13px] text-brand-charcoal hover:bg-black/[0.08] transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export { ProductDescription };
