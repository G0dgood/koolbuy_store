"use client";

import React from "react";
import { Icon } from "../Icon";

interface CartItemControlProps {
  id: string;
  price: string;
  quantity: number;
}

import { useCart } from "@/app/context/CartContext";

const CartItemControl: React.FC<CartItemControlProps> = ({ id, price, quantity }) => {
  const { updateQuantity } = useCart();

  return (
    <div className="flex flex-row-reverse md:flex-col items-center md:items-end justify-between md:justify-start gap-3 min-w-[120px]">
      <span className="text-[15px] font-semibold text-brand-charcoal tabular-nums">{price}</span>
      <div className="relative w-28">
        <select 
          value={quantity}
          onChange={(e) => updateQuantity(id, parseInt(e.target.value))}
          className="w-full h-9 pl-4 pr-9 rounded-full bg-black/[0.04] border border-transparent text-[13px] text-brand-charcoal appearance-none outline-none transition-colors hover:bg-black/[0.06] focus:bg-white focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/15 cursor-pointer"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
            <option key={num} value={num}>Qty: {num}</option>
          ))}
        </select>
        <Icon name="expand_more" size="xs" className="absolute right-3 top-1/2 -translate-y-1/2 text-faint pointer-events-none" />
      </div>
    </div>
  );
};

export { CartItemControl };
