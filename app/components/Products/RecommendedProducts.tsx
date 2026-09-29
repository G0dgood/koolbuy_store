"use client";

import React from "react";
import { ProductCard, ProductShelf } from "./ProductCard";

interface RecommendedProduct {
  id: string;
  title: string;
  price: string;
  image: string;
}

interface RecommendedProductsProps {
  products: RecommendedProduct[];
}

// Apple Store shelf: "You may also like."
export const RecommendedProducts: React.FC<RecommendedProductsProps> = ({ products }) => {
  if (products.length === 0) return null;
  return (
    <section className="flex flex-col gap-5 mt-12 px-4 md:px-0">
      <h2 className="text-[24px] md:text-[28px] font-semibold tracking-[-0.02em]">
        <span className="text-ink">You may also like.</span>{" "}
        <span className="text-gray-500">More from Koolbuy vendors.</span>
      </h2>
      <ProductShelf label="You may also like">
        {products.map((product) => (
          <div role="listitem" key={product.id}>
            <ProductCard variant="shelf" product={product} />
          </div>
        ))}
      </ProductShelf>
    </section>
  );
};
