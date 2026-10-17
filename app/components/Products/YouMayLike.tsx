"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { toast } from "sonner";
import { Icon } from "../Icon";
import { StoreSectionHeader } from "../Home/StoreUi";
import { EmptyState } from "@/app/components/EmptyState";
import { apiErrorMessage } from "@/lib/store/base-api";
import { Bone, formatNaira, ProductImage, productHref, type ListedProduct } from "./productDetailShared";

interface YouMayLikeProps {
  products: ListedProduct[];
  isLoading?: boolean;
  error?: unknown;
  onRetry?: () => void;
}

/** A short list of other (newest) products. */
const YouMayLike: React.FC<YouMayLikeProps> = ({ products, isLoading = false, error, onRetry }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (item: ListedProduct) => {
    addToCart({
      id: item.id,
      title: item.name,
      price: formatNaira(item.price),
      image: item.image,
      meta: item.vendorName ? { seller: item.vendorName } : undefined,
    });
    toast.success("Added to cart.");
  };

  return (
    <div className="w-full bg-white rounded-tile border border-light-gray p-6 flex flex-col gap-5">
      <StoreSectionHeader title="You may like" />
      {isLoading ? (
        <div className="flex flex-col gap-3" aria-busy>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Bone className="w-16 h-16 shrink-0" />
              <div className="flex-1 flex flex-col gap-2">
                <Bone className="h-4 w-full" />
                <Bone className="h-4 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <EmptyState
          illustration="products"
          size="sm"
          title="Suggestions didn't load"
          description={apiErrorMessage(error)}
          action={onRetry ? { label: "Try again", onClick: onRetry } : undefined}
        />
      ) : products.length === 0 ? (
        <EmptyState
          illustration="products"
          size="sm"
          title="Nothing to suggest yet"
          description="More products will appear here as sellers add them."
          action={{ label: "Browse products", href: "/products" }}
        />
      ) : (
        <div className="flex flex-col gap-2">
          {products.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 group relative rounded-stage p-2 -mx-2 hover:bg-off-white transition-colors"
            >
              <Link
                href={productHref(item.id)}
                className="w-16 h-16 relative flex-shrink-0 rounded-stage overflow-hidden bg-off-white"
              >
                <ProductImage
                  src={item.image}
                  alt={item.name}
                  sizes="64px"
                  className="p-1.5 transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />
              </Link>
              <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                <Link
                  href={productHref(item.id)}
                  className="text-[14px] font-semibold text-brand-charcoal line-clamp-2 leading-snug hover:text-brand-orange-text transition-colors"
                >
                  {item.name}
                </Link>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-brand-charcoal tabular-nums">{formatNaira(item.price)}</span>
                  <button
                    type="button"
                    onClick={() => handleAddToCart(item)}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-brand-orange-text hover:bg-white transition-colors cursor-pointer opacity-100 lg:opacity-0 lg:group-hover:opacity-100 focus-visible:opacity-100"
                    title="Add to cart"
                    aria-label={`Add ${item.name} to cart`}
                  >
                    <Icon name="shopping_cart" size="xs" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { YouMayLike };
