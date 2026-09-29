"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";
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
      {/* Section Header */}
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col items-start gap-2">
          <span className="kb-sticker">Fresh drop</span>
          <h3 className="kb-title kb-squiggle text-2xl md:text-[1.75rem]">
            New Products
          </h3>
        </div>

        <Link
          href="/products"
          className="kb-btn kb-btn-ghost h-10 px-4 text-xs md:text-sm group shrink-0"
        >
          <span>See all</span>
          <span className="w-6 h-6 rounded-full bg-brand-orange text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
            <FiChevronRight size={14} />
          </span>
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
              whileHover={{
                y: -4,
                transition: { type: "spring", stiffness: 300, damping: 15 },
              }}
              className="kb-card hover:shadow-[var(--shadow-lift)] hover:border-brand-orange/30 p-2.5 flex flex-col justify-between h-full group cursor-pointer"
            >
              {/* Product Image Area */}
              <div className="w-full aspect-square relative mb-3 flex items-center justify-center rounded-[1.1rem] bg-linear-to-b from-cream to-cream-dark overflow-hidden">
                {idx < 2 && (
                  <span className="absolute top-2.5 left-2.5 z-10 kb-sticker kb-sticker-mint text-[10px]! px-2! py-1!">New</span>
                )}
                <Image
                  src={prod.image}
                  alt={prod.name}
                  fill
                  className="object-contain p-3 group-hover:scale-[1.06] transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                />
              </div>

              {/* Product Info */}
              <div className="flex flex-col gap-1 text-left w-full px-1.5 pb-1.5">
                <h4 className="text-[13px] sm:text-sm font-bold text-ink group-hover:text-brand-orange-hover transition-colors truncate">
                  {prod.name}
                </h4>
                <p className="text-[11px] text-gray-500 font-medium truncate">
                  {prod.vendor}
                </p>
                <div className="flex items-center justify-between gap-2 mt-1.5">
                  <span className="text-sm sm:text-[15px] font-extrabold text-ink tracking-tight">
                    {prod.price}
                  </span>
                  <span className="w-8 h-8 rounded-full bg-brand-orange-light text-brand-orange-hover flex items-center justify-center text-lg font-bold leading-none shrink-0 group-hover:bg-brand-orange group-hover:text-white transition-colors" aria-hidden>
                    +
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
