"use client";

import React from "react";
import { StoreProductGrid, StoreSectionHeader } from "../Home/StoreUi";

interface RelatedProduct {
  name: string;
  price: string;
  image: string;
}

interface RelatedProductsProps {
  products: RelatedProduct[];
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => {
  return (
    <section className="flex flex-col gap-6 w-full">
      <StoreSectionHeader title="Related products" />
      <StoreProductGrid
        products={products.map((item) => ({
          name: item.name,
          price: item.price,
          image: item.image,
          href: "/products/detail",
        }))}
      />
    </section>
  );
};
