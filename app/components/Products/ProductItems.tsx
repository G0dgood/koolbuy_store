"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Rating, FavoriteButton } from "../Other";
import { Button } from "../Button/Button";
import { useCart } from "@/app/context/CartContext";
import { toast } from "sonner";
import { ProductCard } from "./ProductCard";
import { getVendor, parsePrice } from "@/app/data/catalog";

interface ProductProps {
   id: string;
   title: string;
   price: string;
   originalPrice?: string;
   rating: number;
   orders: number;
   shipping: string;
   description: string;
   image: string;
}

export const ProductGridItem: React.FC<{ product: ProductProps & { vendor?: string } }> = ({ product }) => {
   const vendorName = getVendor(product.vendor)?.name;
   const savePct = product.originalPrice
      ? Math.round((1 - parsePrice(product.price) / parsePrice(product.originalPrice)) * 100)
      : 0;

   return (
      <ProductCard
         variant="grid"
         product={{
            id: product.id,
            title: product.title,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.image,
            vendor: vendorName,
            eyebrow: savePct > 0 ? `Save ${savePct}%` : undefined,
         }}
      />
   );
};

export const ProductListItem: React.FC<{ 
   product: ProductProps; 
   onRemove?: () => void;
   showFavorite?: boolean;
}> = ({ 
   product, 
   onRemove,
   showFavorite = true
}) => {
   const { addToCart } = useCart();

   const handleAddToCart = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      addToCart({
         id: product.id,
         title: product.title,
         price: product.price,
         image: product.image,
      });
      toast.success("Added to cart");
   };

   return (
      <div className="kb-card kb-card-hover p-4 md:p-6 flex gap-3 md:gap-6 relative group">
         {/* Product Image */}
         <Link href="/products/detail" className="w-24 h-24 md:w-48 md:h-48 flex-shrink-0 rounded-lg flex items-center justify-center p-2 md:p-4 bg-cream cursor-pointer overflow-hidden">
            <div className="relative w-full h-full transition-transform duration-300">
               <Image src={product.image} alt={product.title} fill className="object-contain" />
            </div>
         </Link>

         {/* Product Content */}
         <div className="flex-1 flex flex-col gap-1 md:gap-3 pr-8 md:pr-0">
            <div className="flex items-start justify-between">
               <Link href="/products/detail" className="text-[15px] md:text-[17px] font-semibold text-ink leading-snug hover:text-action cursor-pointer transition-colors line-clamp-2 md:line-clamp-none">
                  {product.title}
               </Link>
            </div>

            <div className="flex flex-col gap-0.5 md:gap-1">
               <div className="flex items-center gap-2 md:gap-3">
                  <span className="text-[17px] md:text-[21px] text-ink">{product.price}</span>
                  {product.originalPrice && (
                     <span className="text-gray-400 line-through text-xs md:text-sm font-medium">{product.originalPrice}</span>
                  )}
               </div>

               {/* Rating & Orders */}
               <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] md:text-sm font-normal">
                  <div className="flex items-center gap-1">
                     <Rating value={product.rating} />
                     <span className="text-orange-500 font-medium ml-0.5 md:ml-1">{product.rating}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400">
                     <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-gray-300" />
                     <span>{product.orders} orders</span>
                  </div>
                  {/* Shipping Info */}
                  <div className="flex items-center gap-1.5 text-brand-blue">
                     <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-brand-blue" />
                     <span className="font-medium">{product.shipping}</span>
                  </div>
               </div>
            </div>

            {/* Desktop-only description */}
            <p className="hidden md:block text-gray-500 text-sm leading-relaxed line-clamp-2 mt-1">
               {product.description}
            </p>

            <div className="flex items-center gap-4 mt-auto pt-2">
               <Link href="/products/detail" className="kb-link text-sm cursor-pointer flex items-center gap-1">
                  Learn more ›
               </Link>
               <button 
                  onClick={handleAddToCart}
                  className="md:hidden text-brand-blue font-bold text-sm hover:underline cursor-pointer"
               >
                  Add to cart
               </button>
            </div>
         </div>

         {/* Actions Section (Right Side) */}
         <div className="hidden md:flex flex-col items-end justify-between py-1 min-w-[140px]">
            <div className="flex flex-col gap-2 items-end w-full">
               {showFavorite && <FavoriteButton item={product as any} className="flex-shrink-0" />}
               <Button 
                  onClick={handleAddToCart}
                  variant="primary" 
                  size="sm" 
                  className="w-full font-bold mt-2 shadow-none"
               >
                  Add to cart
               </Button>
            </div>

            {onRemove && (
               <button 
                  onClick={(e) => {
                     e.stopPropagation();
                     onRemove();
                  }}
                  className="text-red-500 font-bold text-xs md:text-sm hover:underline cursor-pointer transition-all mt-auto"
               >
                  Remove
               </button>
            )}
         </div>

         {/* Heart Icon (Mobile) */}
         {showFavorite && (
            <FavoriteButton item={product as any} variant="ghost" className="md:hidden absolute top-3 right-3" />
         )}
      </div>
   );
};
