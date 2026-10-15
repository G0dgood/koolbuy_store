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
    { id: "yml1", name: "Men's T-shirt", price: "₦99.50", image: "/web_detail_images/Image copy.png" },
    { id: "yml2", name: "Mens T-shirt Base Layer", price: "₦85.00", image: "/web_detail_images/Image copy 2.png" },
    { id: "yml3", name: "Mens T-shirt Base Layer", price: "₦75.00", image: "/web_detail_images/Image copy 3.png" },
    { id: "yml4", name: "Mens T-shirt Base Layer", price: "₦90.00", image: "/web_detail_images/Image copy 4.png" },
    { id: "yml5", name: "Mens T-shirt Base Layer", price: "₦95.00", image: "/web_detail_images/Image copy 5.png" },
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
    <div className="w-full lg:w-80 flex-shrink-0 bg-white rounded-[22px] md:rounded-[32px] p-6 flex flex-col gap-5">
      <StoreSectionHeader title="You may like" />
      <div className="flex flex-col gap-2">
         {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 group relative cursor-pointer rounded-[16px] p-2 -mx-2 hover:bg-off-white transition-colors">
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
