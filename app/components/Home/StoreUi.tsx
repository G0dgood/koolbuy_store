"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { FiImage } from "react-icons/fi";
import { formatNaira, productHref, type StorefrontProduct } from "@/lib/store/api/storefront-api";

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
        <h2 className="text-[20px] md:text-[28px] font-semibold text-brand-charcoal tracking-[-0.025em] leading-tight">
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
  image?: string | null;
  href?: string;
}

/** Maps a /koolbuy/products/ item to a store tile */
export function toStoreProduct(p: StorefrontProduct): StoreProduct {
  return {
    id: p.id,
    name: p.name,
    vendor: p.vendor?.name,
    price: formatNaira(p.price),
    image: p.image,
  };
}

/**
 * A product photo that fills its (relative) parent. Remote images skip the
 * optimiser so any host the backend stores works; a missing image shows a
 * quiet placeholder instead of a broken tile.
 */
export function StoreImage({
  src,
  alt,
  sizes,
  className = "",
  priority,
}: {
  src?: string | null;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  if (!src) {
    return (
      <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center text-faint">
        <FiImage size={28} />
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={/^https?:\/\//.test(src)}
      className={className}
    />
  );
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
      <Link href={product.href ?? (product.id ? productHref(product.id) : "/products")} className="group flex flex-col h-full rounded-tile bg-white border border-light-gray overflow-hidden transition-all duration-300 hover:shadow-lift">
        <div className="relative w-full aspect-square bg-off-white overflow-hidden">
          <StoreImage
            src={product.image}
            alt={product.name}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
            // multiply drops the white backgrounds baked into many product photos onto the grey stage
            className="object-contain mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        </div>
        <div className="flex flex-col gap-0.5 px-4 pt-3 pb-4">
          <h3 className="text-[14px] font-semibold text-brand-charcoal leading-snug line-clamp-2">{product.name}</h3>
          {product.vendor && <p className="text-[12px] text-faint truncate">{product.vendor}</p>}
          <p className="mt-1 text-[14px] font-semibold text-brand-charcoal tabular-nums">{product.price}</p>
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

/** Loading placeholder matching StoreProductGrid's tiles */
export function StoreProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div aria-hidden="true" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`rounded-tile bg-white border border-light-gray overflow-hidden ${twoRowClass(i)}`}>
          <div className="w-full aspect-square bg-black/[0.04] animate-pulse" />
          <div className="px-4 pt-3 pb-4 flex flex-col gap-2">
            <div className="h-3.5 w-4/5 rounded-full bg-black/[0.04] animate-pulse" />
            <div className="h-3 w-1/2 rounded-full bg-black/[0.04] animate-pulse" />
            <div className="h-3.5 w-2/5 rounded-full bg-black/[0.04] animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
