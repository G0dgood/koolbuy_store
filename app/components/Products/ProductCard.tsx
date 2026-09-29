"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useCart } from "@/app/context/CartContext";
import { toast } from "sonner";

/**
 * Apple Store-style product cards (see DESIGN.md → Components → Store cards).
 *
 *  - "shelf": tall 313×460 card for horizontal shelves. Text sits top-left
 *    (eyebrow → large name → "From" price), the product image fills the bottom.
 *  - "grid":  catalog tile. Image on top, then eyebrow → name → price → actions.
 */

export interface ProductCardData {
  id: string;
  title: string;
  price: string;
  originalPrice?: string;
  image: string;
  vendor?: string;
  eyebrow?: string;
  href?: string;
}

// "₦1,406,000.00" → "₦1,406,000"
export const displayPrice = (price: string) => price.replace(/\.00$/, "");

export const ProductCard: React.FC<{
  product: ProductCardData;
  variant?: "shelf" | "grid";
  showAddToCart?: boolean;
}> = ({ product, variant = "grid", showAddToCart = true }) => {
  const { addToCart } = useCart();
  const href = product.href || "/products/detail";

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
    });
    toast.success("Added to cart");
  };

  if (variant === "shelf") {
    return (
      <Link
        href={href}
        className="kb-card kb-card-hover group relative flex flex-col w-[272px] sm:w-[313px] h-[420px] sm:h-[460px] overflow-hidden"
      >
        <div className="relative z-10 px-7 pt-7 flex flex-col gap-1.5">
          {product.eyebrow && <span className="kb-sticker">{product.eyebrow}</span>}
          <h4 className="text-[22px] sm:text-[24px] font-semibold text-ink leading-[1.17] tracking-[-0.015em] line-clamp-2">
            {product.title}
          </h4>
          <p className="text-[14px] text-ink mt-1">
            From {displayPrice(product.price)}
            {product.originalPrice && (
              <span className="ml-2 text-gray-500 line-through">{displayPrice(product.originalPrice)}</span>
            )}
          </p>
          {product.vendor && <p className="text-[12px] text-gray-500 truncate">{product.vendor}</p>}
        </div>

        <div className="relative flex-1 mx-7 mb-7 mt-4">
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="313px"
            className="object-contain object-bottom"
          />
        </div>
      </Link>
    );
  }

  // grid: the link covers image + text; "Add to cart" sits beside it (no button inside a link)
  return (
    <div className="kb-card kb-card-hover group relative flex flex-col h-full overflow-hidden">
      <Link href={href} className="flex flex-col flex-1">
        <div className="relative w-full aspect-square">
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-contain p-8 sm:p-10"
          />
        </div>

        <div className="flex flex-col gap-1 px-5 sm:px-6 flex-1">
          {product.eyebrow && <span className="kb-sticker">{product.eyebrow}</span>}
          <h4 className="text-[15px] sm:text-[17px] font-semibold text-ink leading-[1.24] tracking-[-0.01em] line-clamp-2">
            {product.title}
          </h4>
          {product.vendor && <p className="text-[12px] text-gray-500 truncate">{product.vendor}</p>}
          <p className="text-[15px] sm:text-[17px] text-ink mt-2">
            {displayPrice(product.price)}
            {product.originalPrice && (
              <span className="ml-2 text-[14px] text-gray-500 line-through">{displayPrice(product.originalPrice)}</span>
            )}
          </p>
        </div>
      </Link>

      <div className="px-5 sm:px-6 pb-6 pt-4">
        {showAddToCart ? (
          <button
            type="button"
            onClick={handleAddToCart}
            className="kb-btn kb-btn-primary h-8 px-4 text-[14px]"
          >
            Add to cart
          </button>
        ) : (
          <Link href={href} className="kb-link text-[14px]">
            Learn more ›
          </Link>
        )}
      </div>
    </div>
  );
};

/** Horizontal Apple-style shelf with round "paddle" controls. */
export const ProductShelf: React.FC<{ children: React.ReactNode; label: string }> = ({
  children,
  label,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * 333 * 2, behavior: "smooth" });

  return (
    <div className="relative group/shelf">
      <div ref={ref} className="kb-shelf" role="list" aria-label={label}>
        {children}
      </div>
      <div className="hidden md:flex justify-end gap-3 mt-2">
        <button
          type="button"
          onClick={() => scroll(-1)}
          aria-label={`Previous ${label}`}
          className="w-9 h-9 rounded-full bg-[rgba(210,210,215,0.64)] hover:bg-[rgba(210,210,215,0.85)] text-ink flex items-center justify-center transition-colors cursor-pointer"
        >
          <FiChevronLeft size={20} />
        </button>
        <button
          type="button"
          onClick={() => scroll(1)}
          aria-label={`Next ${label}`}
          className="w-9 h-9 rounded-full bg-[rgba(210,210,215,0.64)] hover:bg-[rgba(210,210,215,0.85)] text-ink flex items-center justify-center transition-colors cursor-pointer"
        >
          <FiChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};
