"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";
import { ProductCard } from "@/app/components/Products/ProductCard";

const recommendedItems = [
  {
    title: "Kool - Scanfrost 600L Inverter Chest Freezer",
    price: "₦1,406,000.00",
    image: "/images/koolboks/items/5.webp",
  },
  {
    title: "Kool Scanfrost 60ah Pedestal Battery Unit",
    price: "₦1,287,600.00",
    image: "/images/koolboks/items/1.webp",
  },
  {
    title: "Kool Bruhm 60ah Pedestal Power Controller",
    price: "₦1,287,600.00",
    image: "/images/koolboks/items/4.webp",
  },
  {
    title: "200L AC Inverter Freezers with Solar Kit",
    price: "₦2,420,000.00",
    image: "/images/koolboks/items/3.webp",
  },
  {
    title: "Koolboks 600L AC Inverter Commercial Freezer",
    price: "₦1,468,000.00",
    image: "/images/koolboks/items/6.webp",
  },
  {
    title: "Koolboks 538L Refurbished Hybrid Freezer",
    price: "₦1,538,000.00",
    image: "/images/koolboks/items/2.webp",
  },
  {
    title: "Koolboks 208L DC Solar Deep Freezer",
    price: "₦1,950,000.00",
    image: "/images/koolboks/items/3.webp",
  },
  {
    title: "Koolboks 100Ah AC Lithium Battery",
    price: "₦1,662,370.00",
    image: "/images/koolboks/items/1.webp",
  },
];

const RecommendedItems = () => {
  return (
    <section className="w-full flex flex-col gap-5">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-[24px] md:text-[34px] font-semibold text-ink tracking-[-0.02em]">
          Recommended Items
        </h3>

        <Link
          href="/products"
          className="kb-link text-sm md:text-[17px] shrink-0 whitespace-nowrap"
        >
          See all ›
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {recommendedItems?.map((item, idx) => (
          <ProductCard
            key={idx}
            variant="grid"
            showAddToCart={false}
            product={{ id: `rec-${idx}`, title: item.title, price: item.price, image: item.image }}
          />
        ))}
      </div>
    </section>
  );
};

export default RecommendedItems;
