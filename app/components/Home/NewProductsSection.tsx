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
      <div className="flex items-center justify-between">
        <h3 className="text-lg md:text-xl font-bold tracking-wider text-gray-900">
          New Products
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
              className="bg-white border border-[#1C1C1C1A] rounded-xl p-4 flex flex-col justify-between h-full hover:shadow-md transition-shadow group cursor-pointer"
            >
              {/* Product Image Area */}
              <div className="w-full aspect-square relative mb-3 flex items-center justify-center">
                <Image
                  src={prod.image}
                  alt={prod.name}
                  fill
                  className="object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Product Info */}
              <div className="flex flex-col gap-1 text-left w-full">
                <h4 className="text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-brand-blue transition-colors truncate">
                  {prod.name}
                </h4>
                <p className="text-[11px] text-gray-400 font-medium truncate">
                  {prod.vendor}
                </p>
                <span className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5">
                  {prod.price}
                </span>
              </div>
            </motion.div>
          </Link>
        ))}
      </motion.div>
    </section>
  );
};
