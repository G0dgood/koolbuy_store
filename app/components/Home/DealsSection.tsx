"use client";

import React from "react";
import Link from "next/link";
import { ProductCard, ProductShelf } from "@/app/components/Products/ProductCard";

const dealProducts = [
  {
    id: "d1",
    name: "Kool Bruhm 60ah Pedestal ...",
    vendor: "Koolbuy - Solar Energy and El...",
    price: "₦1,287,600.00",
    image: "/images/koolboks/items/1.webp",
  },
  {
    id: "d2",
    name: "Kool Bruhm 100ah Pedesta...",
    vendor: "Koolbuy - GOLDEN CROWN ELE...",
    price: "₦1,662,370.00",
    image: "/images/koolboks/items/4.webp",
  },
  {
    id: "d3",
    name: "Kool-242L Somotex - Glass...",
    vendor: "Koolbuy - Don Vic LTD",
    price: "₦2,100,000.00",
    image: "/images/koolboks/items/3.webp",
  },
  {
    id: "d4",
    name: "Kool Thermocool 100ah Pe...",
    vendor: "Koolbuy - Quality Naija Stores",
    price: "₦1,662,370.00",
    image: "/images/koolboks/items/4.webp",
  },
  {
    id: "d5",
    name: "Kool Thermocool 100ah Pe...",
    vendor: "Koolbuy - Thermocool Showr...",
    price: "₦1,662,370.00",
    image: "/images/koolboks/items/4.webp",
  },
  {
    id: "d6",
    name: "230L Hisense Freezer",
    vendor: "Koolbuy - Olas & BS Electronics",
    price: "₦430,000.00",
    image: "/images/koolboks/items/5.webp",
  },
];

const DealsSection = () => {
  return (
    <section className="w-full flex flex-col gap-5">
      {/* Section Header — Apple two-tone headline */}
      <div className="flex items-end justify-between gap-4">
        <h3 className="text-[24px] md:text-[34px] font-semibold tracking-[-0.02em] leading-[1.15]">
          <span className="text-ink">On sale.</span>{" "}
          <span className="text-gray-500">Great prices on cold storage, today.</span>
        </h3>

        <Link
          href="/products"
          className="kb-link text-sm md:text-[17px] shrink-0 whitespace-nowrap"
        >
          See all ›
        </Link>
      </div>

      <ProductShelf label="On sale">
        {dealProducts.map((prod, idx) => (
          <div role="listitem" key={prod.id}>
            <ProductCard
              variant="shelf"
              product={{
                id: prod.id,
                title: prod.name.replace(/\s*\.\.\.$/, ""),
                price: prod.price,
                image: prod.image,
                vendor: prod.vendor,
                eyebrow: `Save ${8 + idx * 3}%`,
              }}
            />
          </div>
        ))}
      </ProductShelf>
    </section>
  );
};

export { DealsSection };
