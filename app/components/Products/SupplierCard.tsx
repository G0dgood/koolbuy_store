"use client";

import React from "react";
import Image from "next/image";
import { Icon } from "../Icon";
import { Button } from "../Button";
import { FavoriteButton } from "../Other";
import { useCart } from "@/app/context/CartContext";
import { toast } from "sonner";

const SupplierCard = () => {
   const { addToCart } = useCart();

   const handleAddToCart = () => {
      addToCart({
         id: "detail-1",
         title: "Mens Long Sleeve T-shirt Cotton Base Layer Slim Muscle",
         price: "₦98.00",
         image: "/images/shirt.jpg",
      });
      toast.success("Added to cart");
   };

   return (
      <div className="w-72 flex-shrink-0 flex flex-col gap-3">
         <div className="bg-white rounded-[22px] p-6 flex flex-col gap-5">
            {/* Vendor Header */}
            <div className="flex gap-3 pb-5 border-b border-black/[0.06] items-center">
               <div className="w-12 h-12 bg-brand-orange-soft rounded-full flex items-center justify-center text-brand-orange-text font-semibold text-[18px]">
                  R
               </div>
               <div className="flex flex-col">
                  <span className="text-[14px] font-semibold text-brand-charcoal">Supplier</span>
                  <span className="text-[13px] text-subtle">Guanjoi Trading Co., Ltd.</span>
               </div>
            </div>

            {/* Vendor Details */}
            <div className="flex flex-col gap-2">
               <div className="flex items-center gap-3">
                  {/* <div className="w-5 h-4 relative">
                     <Image src="/country/Property 1=DE.png" alt="Germany" fill sizes="20px" className="object-cover" />
                  </div> */}
                  {/* <span className="text-sm text-gray-400">Germany, Berlin</span> */}
               </div>
               <div className="flex items-center gap-3">
                  <Icon name="verified_user" size="sm" className="text-success" />
                  <span className="text-[14px] text-subtle">Verified Seller</span>
               </div>
               {/* <div className="flex items-center gap-3">
                  <Icon name="public" size="sm" className="text-gray-400" />
                  <span className="text-sm text-gray-400">Worldwide shipping</span>
               </div> */}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
               <Button
                  onClick={handleAddToCart}
                  variant="accent"
                  shape="pill"
                  size="lg"
                  className="w-full h-11 text-[15px] cursor-pointer"
               >
                  Add to cart
               </Button>
               {/* <Button variant="ghost" className="w-full bg-white text-brand-orange-text border border-gray-200 h-10 hover:bg-gray-50 cursor-pointer">Seller's profile</Button> */}
            </div>
         </div>

         {/* Favorite Button Overlay (Design-specific placement) */}
         <FavoriteButton
            item={{
               id: "detail-1",
               title: "Mens Long Sleeve T-shirt Cotton Base Layer Slim Muscle",
               price: "₦98.00",
               image: "/images/shirt.jpg",
            }}
            variant="none"
            className="flex items-center justify-center gap-2 py-3 text-brand-orange-text text-[14px] font-medium hover:underline cursor-pointer"
         >
            Save for later
         </FavoriteButton>
      </div>
   );
};

export { SupplierCard };
