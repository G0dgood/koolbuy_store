"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";

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
        <h3 className="text-lg md:text-xl font-bold uppercase tracking-wider text-gray-900">
          Recommended Items
        </h3>

        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs md:text-sm font-semibold text-gray-600 hover:text-brand-orange group transition-colors"
        >
          <span>See All</span>
          <span className="w-5 h-5 rounded-full bg-[#FF7A00] text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
            <FiChevronRight size={14} />
          </span>
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
        {recommendedItems?.map((item, idx) => (
          <Link
            key={idx}
            href="/products/detail"
            className="bg-white border border-[#1C1C1C1A] rounded-[6px] p-4 flex flex-col gap-3 hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="w-full aspect-square relative mb-2">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-contain group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-bold text-gray-900">{item.price}</span>
              <p className="text-sm text-gray-500 line-clamp-2 leading-tight group-hover:text-brand-blue transition-colors">
                {item.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RecommendedItems;
