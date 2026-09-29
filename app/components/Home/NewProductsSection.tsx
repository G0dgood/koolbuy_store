"use client";

import React from "react";
import Link from "next/link";
import { ProductCard, ProductShelf } from "@/app/components/Products/ProductCard";

const newProductsList = [
  {
    id: "np1",
    name: "Kool - Scanfrost 600L Inverter...",
    vendor: "Koolbuy - SOLA BEST ELECTRONICS",
    price: "₦1,406,000.00",
    image: "/images/koolboks/items/5.webp",
  },
  {
    id: "np2",
    name: "Kool Scanfrost 60ah Pedestal...",
    vendor: "Koolbuy - DESTINY ELECTRONICS",
    price: "₦1,287,600.00",
    image: "/images/koolboks/items/1.webp",
  },
  {
    id: "np3",
    name: "Kool Bruhm 60ah Pedestal ...",
    vendor: "Koolbuy - MKK Electronics",
    price: "₦1,287,600.00",
    image: "/images/koolboks/items/4.webp",
  },
  {
    id: "np4",
    name: "200L AC Inverter Freezers (...",
    vendor: "Koolbuy - Cash / Carry V.I",
    price: "₦2,420,000.00",
    image: "/images/koolboks/items/3.webp",
  },
  {
    id: "np5",
    name: "Koolboks 600L AC Inverter ...",
    vendor: "Koolbuy - Wugobest",
    price: "₦1,468,000.00",
    image: "/images/koolboks/items/6.webp",
  },
  {
    id: "np6",
    name: "Koolboks 538L Refurbished",
    vendor: "Koolbuy - MATT C VENTURES",
    price: "₦1,538,000.00",
    image: "/images/koolboks/items/2.webp",
  },
];

export const NewProductsSection: React.FC = () => {
  return (
    <section className="w-full flex flex-col gap-5">
      {/* Section Header — Apple two-tone headline */}
      <div className="flex items-end justify-between gap-4">
        <h3 className="text-[24px] md:text-[34px] font-semibold tracking-[-0.02em] leading-[1.15]">
          <span className="text-ink">New products.</span>{" "}
          <span className="text-gray-500">Fresh from verified vendors.</span>
        </h3>

        <Link
          href="/products"
          className="kb-link text-sm md:text-[17px] shrink-0 whitespace-nowrap"
        >
          See all ›
        </Link>
      </div>

      <ProductShelf label="New products">
        {newProductsList.map((prod, idx) => (
          <div role="listitem" key={prod.id}>
            <ProductCard
              variant="shelf"
              product={{
                id: prod.id,
                title: prod.name.replace(/\s*\.\.\.$/, ""),
                price: prod.price,
                image: prod.image,
                vendor: prod.vendor,
                eyebrow: idx < 2 ? "New" : undefined,
              }}
            />
          </div>
        ))}
      </ProductShelf>
    </section>
  );
};
