"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "../Icon";
import { Button } from "../Button";
import { CartItemControl } from "./CartItemControl";

interface CartItemProps {
   id: string;
   title: string;
   price: string;
   image: string;
   quantity: number;
   meta?: {
      size?: string;
      color?: string;
      material?: string;
      seller?: string;
   };
}

import { useCart } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishlistContext";

const CartItem: React.FC<CartItemProps> = ({ id, title, price, image, quantity, meta = {} }) => {
   const { removeFromCart } = useCart();
   const { addToWishlist } = useWishlist();

   const handleSaveForLater = () => {
      addToWishlist({
         id,
         title,
         price,
         image,
         description: meta.seller ? `Seller: ${meta.seller}` : "",
      });
      removeFromCart(id);
   };

   return (
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 py-6 border-b border-black/[0.06] last:border-0">
         {/* Item Image */}
         <div className="w-24 h-24 flex-shrink-0 rounded-[16px] bg-off-white p-3 flex items-center justify-center">
            <div className="relative w-full h-full">
               <Image src={image} alt={title} fill sizes="96px" className="object-contain mix-blend-multiply" />
            </div>
         </div>

         {/* Item Details */}
         <div className="flex-1 flex flex-col gap-1">
            <h3 className="text-[15px] font-semibold text-brand-charcoal leading-snug hover:text-brand-orange-text cursor-pointer transition-colors max-w-md">
               {title}
            </h3>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-subtle">
               {meta.size && <span>Size: {meta.size}</span>}
               {meta.color && <span>Color: {meta.color}</span>}
               {meta.material && <span>Material: {meta.material}</span>}
               {meta.seller && <span>Seller: {meta.seller}</span>}
            </div>
            <div className="flex items-center gap-5 mt-3">
               <Button
                  onClick={() => removeFromCart(id)}
                  variant="link"
                  className="text-[13px]! font-normal!"
               >
                  Remove
               </Button>
               <Button
                  onClick={handleSaveForLater}
                  variant="link"
                  className="text-[13px]! font-normal!"
               >
                  Save for later
               </Button>
            </div>
         </div>

         {/* Item Control & Price */}
         <CartItemControl id={id} price={price} quantity={quantity} />
      </div>
   );
};

export { CartItem };
