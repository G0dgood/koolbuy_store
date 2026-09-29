"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { toast } from "sonner";
import { PRODUCTS } from "@/app/data/catalog";
import { displayPrice } from "./ProductCard";

// Apple-style compact list card ("You may also like") for the product page sidebar.
const YouMayLike = () => {
  const { addToCart } = useCart();
  const items = PRODUCTS.slice(0, 5);

  return (
    <div className="kb-card w-full lg:w-72 flex-shrink-0 p-6 flex flex-col gap-4">
      <h3 className="text-[17px] font-semibold text-ink tracking-[-0.01em]">You may also like</h3>
      <div className="flex flex-col divide-y divide-hairline">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
            <Link href="/products/detail" className="w-14 h-14 relative shrink-0">
              <Image src={item.image} alt={item.title} fill sizes="56px" className="object-contain" />
            </Link>
            <div className="flex-1 min-w-0 flex flex-col gap-0.5">
              <Link
                href="/products/detail"
                className="text-[14px] font-semibold text-ink leading-snug line-clamp-2 hover:underline"
              >
                {item.title}
              </Link>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[12px] text-gray-600">{displayPrice(item.price)}</span>
                <button
                  type="button"
                  onClick={() => {
                    addToCart({ id: item.id, title: item.title, price: item.price, image: item.image });
                    toast.success("Added to cart");
                  }}
                  className="text-[12px] text-action hover:underline cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { YouMayLike };
