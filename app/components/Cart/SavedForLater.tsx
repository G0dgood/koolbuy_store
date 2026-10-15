"use client";

import React from "react";
import Image from "next/image";
import { Icon } from "../Icon";
import { Button } from "../Button";

import { useCart } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishlistContext";

import { EmptySavedIllustration } from "./EmptySavedIllustration";

const SavedForLater = () => {
  const { addToCart } = useCart();
  const { wishlistItems, removeFromWishlist } = useWishlist();

  const handleMoveToCart = (item: any) => {
    addToCart({
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
    });
    removeFromWishlist(item.id);
  };

  if (wishlistItems.length === 0) {
    return (
      <section className="bg-white rounded-tile border border-light-gray overflow-hidden p-6 md:p-8 flex flex-col gap-6">
        <h3 className="text-[20px] md:text-[24px] font-semibold text-brand-charcoal tracking-[-0.02em]">
          Saved for later
        </h3>
        <div className="py-6 md:py-10 flex flex-col items-center text-center gap-4">
          <EmptySavedIllustration className="w-48 h-40 md:w-56 md:h-44" />
          <div className="flex flex-col items-center gap-1.5 max-w-sm">
            <h4 className="text-[18px] md:text-[20px] font-bold text-brand-charcoal tracking-[-0.01em]">
              No saved items
            </h4>
            <p className="text-[14px] md:text-[15px] text-subtle leading-relaxed">
              Items you save for later will appear here so you can easily move them to your cart anytime.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-tile border border-light-gray overflow-hidden">
      <div className="px-6 pt-6 md:px-8 md:pt-8">
        <h3 className="text-[20px] md:text-[24px] font-semibold text-brand-charcoal tracking-[-0.02em]">
          Saved for later <span className="text-faint tabular-nums">({wishlistItems.length})</span>
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 p-4 md:p-6">
        {wishlistItems.map((item) => (
          <div key={item.id} className="flex flex-col gap-3 group cursor-pointer rounded-[22px] overflow-hidden border border-light-gray">
            <div className="w-full aspect-square relative bg-off-white overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill sizes="(max-width: 768px) 100vw, 33vw"
                className="object-contain mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              />
            </div>
            <div className="flex flex-col gap-3 px-4 pb-4">
              <div className="flex flex-col gap-0.5">
                <p className="text-[14px] font-semibold text-brand-charcoal leading-snug line-clamp-2">{item.title}</p>
                <span className="text-[14px] text-brand-charcoal tabular-nums">{item.price}</span>
              </div>
              <div className="flex flex-row items-center gap-2">
                <Button 
                  onClick={() => handleMoveToCart(item)}
                  variant="primary" 
                  shape="pill"
                  size="sm" 
                  className="flex-1 h-9 text-[13px]! justify-center" 
                  iconLeft={<Icon name="shopping_cart" size="xs" />}
                >
                  Move to cart
                </Button>
                <Button 
                  onClick={() => removeFromWishlist(item.id)}
                  variant="ghost" 
                  shape="pill"
                  size="sm" 
                  className="h-9 px-4 text-[13px]! font-normal! text-brand-orange-text justify-center"
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export { SavedForLater };
