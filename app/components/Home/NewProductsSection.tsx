"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

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
          <span className="text-ink">New products.</span> 
          <span className="text-gray-500">Fresh from verified vendors.</span>
        </h3>

        <Link
          href="/products"
          className="kb-link text-sm md:text-[17px] shrink-0 whitespace-nowrap"
        >
          See all ›
        </Link>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5"
      >
        {newProductsList.map((prod, idx) => (
          <Link key={idx} href="/products/detail" className="flex flex-col">
            <motion.div
              variants={itemVariants}
              className="kb-card kb-card-hover p-4 md:p-5 flex flex-col justify-between h-full group cursor-pointer"
            >
              {/* Product Image Area */}
              <div className="w-full aspect-square relative mb-4 flex items-center justify-center rounded-lg bg-cream overflow-hidden">
                <Image
                  src={prod.image}
                  alt={prod.name}
                  fill
                  className="object-contain p-4 kb-product-img group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                />
              </div>

              {/* Product Info */}
              <div className="flex flex-col gap-0.5 text-left w-full">
                {idx < 2 && (
                  <span className="kb-sticker">New</span>
                )}
                <h4 className="text-[14px] sm:text-[15px] font-semibold text-ink leading-snug line-clamp-2">
                  {prod.name}
                </h4>
                <p className="text-[12px] text-gray-500 truncate">
                  {prod.vendor}
                </p>
                <div className="flex items-center justify-between gap-2 mt-3">
                  <span className="text-[14px] sm:text-[15px] text-ink">
                    {prod.price}
                  </span>
                  <span className="kb-btn kb-btn-primary h-7 px-3.5 text-[12px] shrink-0">
                    Buy
                  </span>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </motion.div>
    </section>
  );
};
