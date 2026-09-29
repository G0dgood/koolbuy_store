"use client";

import React from "react";
import { ProductCard, ProductShelf } from "./ProductCard";

interface RelatedProduct {
  name: string;
  price: string;
  image: string;
}

interface RelatedProductsProps {
  products: RelatedProduct[];
}

// Apple Store shelf: "Related products."
export const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => {
  return (
    <section className="flex flex-col gap-5 w-full">
      <h3 className="text-[24px] md:text-[28px] font-semibold tracking-[-0.02em]">
        <span className="text-ink">Related products.</span>{" "}
        <span className="text-gray-500">Pairs well with this one.</span>
      </h3>
      <ProductShelf label="Related products">
        {products.map((item, idx) => (
          <div role="listitem" key={`${item.name}-${idx}`}>
            <ProductCard
              variant="shelf"
              product={{ id: `rel-${idx}`, title: item.name, price: item.price, image: item.image }}
            />
          </div>
        ))}
      </ProductShelf>
    </section>
  );
};
