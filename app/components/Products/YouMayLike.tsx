"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { toast } from "sonner";
import { Icon } from "../Icon";
import { StoreSectionHeader } from "../Home/StoreUi";

const YouMayLike = () => {
  const { addToCart } = useCart();

  const items = [
    { id: "yml1", name: "Kool - Scanfrost 600L Inverter", price: "₦1,406,000", image: "/images/koolboks/items/5.webp" },
    { id: "yml2", name: "Kool Scanfrost 60ah Pedestal", price: "₦1,287,600", image: "/images/koolboks/items/1.webp" },
    { id: "yml3", name: "200L AC Inverter Freezers", price: "₦2,420,000", image: "/images/koolboks/items/3.webp" },
    { id: "yml4", name: "Koolboks 600L AC Inverter", price: "₦1,468,000", image: "/images/koolboks/items/6.webp" },
    { id: "yml5", name: "Koolboks 538L Refurbished", price: "₦1,538,000", image: "/images/koolboks/items/2.webp" },
  ];

  const handleAddToCart = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: item.id,
      title: item.name,
      price: item.price,
      image: item.image,
    });
    toast.success("Added to cart");
  };

  return (
    <div className="w-full lg:w-80 flex-shrink-0 bg-white rounded-tile border border-light-gray p-6 flex flex-col gap-5">
      <StoreSectionHeader title="You may like" />
      <div className="flex flex-col gap-2">
         {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 group relative cursor-pointer rounded-stage p-2 -mx-2 hover:bg-off-white transition-colors">
              <Link href="/products/detail" className="w-16 h-16 relative flex-shrink-0 rounded-[12px] p-1.5 overflow-hidden bg-off-white">
                 <Image src={item.image} alt={item.name} fill sizes="64px" className="object-contain p-1.5 mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-[1.04]" />
              </Link>
              <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                 <Link href="/products/detail" className="text-[14px] font-semibold text-brand-charcoal line-clamp-2 leading-snug">
                    {item.name}
                 </Link>
                 <div className="flex items-center justify-between">
                    <span className="text-[13px] text-brand-charcoal tabular-nums">{item.price}</span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                       <Link href="/products/detail" title="View details" className="w-7 h-7 rounded-full flex items-center justify-center text-subtle hover:text-brand-charcoal hover:bg-white transition-colors">
                          <Icon name="visibility" size="xs" />
                       </Link>
                       <button 
                         onClick={(e) => handleAddToCart(e, item)}
                         className="w-7 h-7 rounded-full flex items-center justify-center text-brand-orange-text hover:bg-white transition-colors cursor-pointer"
                         title="Add to cart"
                       >
                          <Icon name="shopping_cart" size="xs" />
                       </button>
                    </div>
                 </div>
              </div>
            </div>
         ))}
      </div>
    </div>
  );
};

export { YouMayLike };
