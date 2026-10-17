"use client";

import React from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { StoreSectionHeader } from "../Home/StoreUi";
import { Bone, formatNaira, ProductImage, productHref, type ListedProduct } from "./productDetailShared";

const grid: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const tile: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

interface RelatedProductsProps {
  products: ListedProduct[];
  isLoading?: boolean;
  /** "See all" link, e.g. the category listing */
  href?: string;
}

/** Other products in the same category. Hidden when there are none. */
export const RelatedProducts: React.FC<RelatedProductsProps> = ({ products, isLoading = false, href }) => {
  if (!isLoading && products.length === 0) return null;

  return (
    <section className="flex flex-col gap-6 w-full">
      <StoreSectionHeader title="Related products" href={href} />
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4" aria-busy>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`flex-col gap-2 ${i < 2 ? "flex" : i < 3 ? "hidden sm:flex" : "hidden lg:flex"}`}>
              <Bone className="aspect-square w-full rounded-tile" />
              <Bone className="h-4 w-3/4" />
              <Bone className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          variants={grid}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4"
        >
          {products.map((p) => (
            <motion.div key={p.id} variants={tile} className="h-full">
              <Link
                href={productHref(p.id)}
                className="group flex flex-col h-full rounded-tile bg-white border border-light-gray overflow-hidden transition-all duration-300 hover:shadow-lift"
              >
                <div className="relative w-full aspect-square bg-off-white overflow-hidden">
                  <ProductImage
                    src={p.image}
                    alt={p.name}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className="transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                  />
                </div>
                <div className="flex flex-col gap-0.5 px-4 pt-3 pb-4">
                  <h3 className="text-[14px] font-semibold text-brand-charcoal leading-snug line-clamp-2">{p.name}</h3>
                  {p.vendorName && <p className="text-[12px] text-faint truncate">{p.vendorName}</p>}
                  <p className="mt-1 text-[14px] font-semibold text-brand-charcoal tabular-nums">{formatNaira(p.price)}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
};
