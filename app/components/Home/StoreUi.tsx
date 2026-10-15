"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";

/* Storefront building blocks in an Apple-store style (DESIGN.md §13):
   large tight section titles, soft grey product tiles with big rounded
   corners, calm hover, and pill links. */

/** Section title row: big headline, optional line under it, and a "See all ›" link. */
export function StoreSectionHeader({
  title,
  subtitle,
  href,
  linkLabel = "See all",
}: {
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="text-[26px] md:text-[34px] font-semibold text-brand-charcoal tracking-[-0.025em] leading-tight">
          {title}
        </h2>
        {subtitle && <p className="mt-1 text-[15px] md:text-[17px] text-subtle">{subtitle}</p>}
      </div>
      {href && (
        <Link href={href} className="shrink-0 text-[14px] md:text-[15px] font-medium text-brand-orange-text hover:underline whitespace-nowrap">
          {linkLabel} ›
        </Link>
      )}
    </div>
  );
}

export interface StoreProduct {
  id?: string;
  name: string;
  vendor?: string;
  price: string;
  image: string;
  href?: string;
}

const grid: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

/** A product tile: the product on a soft grey stage, then name, vendor and price. */
export function StoreProductCard({ product, className = "" }: { product: StoreProduct; className?: string }) {
  return (
    <motion.div variants={item} className={`h-full ${className}`}>
      <Link href={product.href ?? "/products/detail"} className="group flex flex-col h-full rounded-[22px] bg-white overflow-hidden transition-shadow duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
        <div className="relative w-full aspect-square bg-off-white overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
            // multiply drops the white backgrounds baked into many product photos onto the grey stage
            className="object-contain mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        </div>
        <div className="flex flex-col gap-0.5 px-4 pt-3 pb-4">
          <h3 className="text-[14px] font-semibold text-brand-charcoal leading-snug line-clamp-2">{product.name}</h3>
          {product.vendor && <p className="text-[12px] text-faint truncate">{product.vendor}</p>}
          <p className="mt-1 text-[14px] text-brand-charcoal tabular-nums">{product.price}</p>
        </div>
      </Link>
    </motion.div>
  );
}

/* Hides tiles past the second row at each breakpoint (2 / 3 / 6 columns). */
function twoRowClass(i: number) {
  if (i >= 12) return "hidden";
  if (i >= 6) return "hidden lg:block";
  if (i >= 4) return "hidden sm:block";
  return "";
}

/** A responsive grid of product tiles that eases in once when scrolled into view. */
export function StoreProductGrid({ products, twoRows = false }: { products: StoreProduct[]; twoRows?: boolean }) {
  return (
    <motion.div
      variants={grid}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4"
    >
      {products.map((p, i) => (
        <StoreProductCard key={p.id ?? `${p.name}-${i}`} product={p} className={twoRows ? twoRowClass(i) : ""} />
      ))}
    </motion.div>
  );
}
