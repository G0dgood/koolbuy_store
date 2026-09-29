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
      <div className="flex flex-col md:flex-row gap-6 py-8 border-b border-hairline last:border-0">
         {/* Item Image */}
         <div className="w-28 h-28 flex-shrink-0 rounded-xl p-3 flex items-center justify-center bg-cream">
            <div className="relative w-full h-full">
               <Image src={image} alt={title} fill className="object-contain kb-product-img" />
            </div>
         </div>

         {/* Item Details */}
         <div className="flex-1 flex flex-col gap-1.5">
            <h3 className="text-ink font-semibold text-[17px] md:text-[21px] leading-tight tracking-[-0.01em] cursor-pointer max-w-md">
               {title}
            </h3>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
               {meta.size && <span>Size: {meta.size}</span>}
               {meta.color && <span>Color: {meta.color}</span>}
               {meta.material && <span>Material: {meta.material}</span>}
               {meta.seller && <span>Seller: {meta.seller}</span>}
            </div>
            <div className="flex items-center gap-4 mt-2">
               <Button
                  onClick={() => removeFromCart(id)}
                  variant="ghost"
                  className="!text-action !bg-transparent !border-0 text-[14px] px-0 py-0 hover:underline h-auto"
               >
                  Remove
               </Button>
               <Button
                  onClick={handleSaveForLater}
                  variant="ghost"
                  className="!text-action !bg-transparent !border-0 text-[14px] px-0 py-0 hover:underline h-auto"
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
