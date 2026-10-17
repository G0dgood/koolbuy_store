"use client";

import React from "react";
import Link from "next/link";
import { Rating, FavoriteButton } from "../Other";
import { Button } from "../Button/Button";
import { useCart } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishlistContext";
import { toast } from "sonner";
import { StoreImage } from "../Home/StoreUi";
import { productHref } from "@/lib/store/api/storefront-api";

interface ProductProps {
   id: string;
   title: string;
   price: string;
   originalPrice?: string;
   /** Shown only when above 0 (0 means no reviews yet) */
   rating?: number;
   shipping?: string;
   description?: string;
   image?: string | null;
}

const hasRating = (r?: number): r is number => typeof r === "number" && r > 0;

/* The wishlist stores a plain image string */
const toWishlistItem = (p: ProductProps) => ({ ...p, image: p.image ?? "" });

export const ProductGridItem: React.FC<{ product: ProductProps }> = ({ product }) => {
   const { addToCart } = useCart();
   const { isInWishlist } = useWishlist();
   const saved = isInWishlist(product.id);
   const href = productHref(product.id);

   const handleAddToCart = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      addToCart({
         id: product.id,
         title: product.title,
         price: product.price,
         image: product.image ?? "",
      });
      toast.success("Added to cart");
   };

   return (
      <div className="bg-white rounded-tile border border-light-gray overflow-hidden transition-all duration-300 hover:shadow-lift group flex flex-col h-full relative">
         <Link href={href} className="flex flex-col flex-1">
            <div className="relative w-full aspect-[4/3] bg-off-white overflow-hidden">
               <StoreImage
                  src={product.image}
                  alt={product.title}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 30vw"
                  className="object-contain mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-[1.04]"
               />
               {/* Heart Icon (Overlay) */}
               {/* Shown on hover; a saved heart stays visible */}
               <div className={`absolute top-3 right-3 z-10 transition-opacity duration-200 ease-apple ${saved ? "opacity-100" : "opacity-0 group-hover:opacity-100 focus-within:opacity-100"}`}>
                  <FavoriteButton item={toWishlistItem(product)} variant="outline" size="sm" />
               </div>
            </div>
            <div className="p-4 flex flex-col gap-1.5 flex-1 justify-between">
               <div className="flex flex-col gap-1">
                  <span className="text-[15px] font-semibold text-brand-charcoal leading-snug line-clamp-2">
                     {product.title}
                  </span>
                  {hasRating(product.rating) && (
                     <div className="flex items-center gap-1.5 mt-0.5">
                        <Rating value={product.rating} />
                        <span className="text-faint text-[13px] tabular-nums">{product.rating}</span>
                     </div>
                  )}
               </div>
               <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-[16px] font-semibold text-brand-charcoal tabular-nums">{product.price}</span>
                  {product.originalPrice && (
                     <span className="text-faint line-through text-[13px] tabular-nums">{product.originalPrice}</span>
                  )}
               </div>
            </div>
         </Link>

         {/* Actions Footer (Hover Overlay) */}
         <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-white via-white/95 to-transparent pt-8 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
            <Link href={href} className="flex-1">
               <Button variant="outline" size="sm" shape="pill" className="w-full text-[13px]! font-medium h-9!">
                  Details
               </Button>
            </Link>
            <Button 
               onClick={handleAddToCart}
               variant="accent" 
               size="sm" 
               shape="pill"
               className="flex-1 text-[13px]! font-medium h-9!"
            >
               Add to cart
            </Button>
         </div>
      </div>
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
   const href = productHref(product.id);

   const handleAddToCart = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      addToCart({
         id: product.id,
         title: product.title,
         price: product.price,
         image: product.image ?? "",
      });
      toast.success("Added to cart");
   };

   return (
      <div className="bg-white rounded-tile border border-light-gray overflow-hidden flex gap-3 md:gap-6 transition-all duration-300 hover:shadow-lift relative group">
         {/* Product Image */}
         <Link href={href} className="relative w-32 md:w-48 self-stretch min-h-32 md:min-h-48 flex-shrink-0 bg-off-white cursor-pointer overflow-hidden">
            <StoreImage
               src={product.image}
               alt={product.title}
               sizes="(max-width: 768px) 128px, 192px"
               className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            />
         </Link>

         {/* Product Content */}
         <div className="flex-1 min-w-0 flex flex-col gap-1.5 py-4 pr-4 md:pr-0">
            <div className="flex items-start justify-between">
               <Link href={href} className="text-[15px] md:text-[17px] font-semibold text-brand-charcoal leading-snug tracking-[-0.01em] hover:underline cursor-pointer line-clamp-2 md:line-clamp-none">
                  {product.title}
               </Link>
            </div>

            <div className="flex flex-col gap-1">
               <div className="flex items-baseline gap-2">
                  <span className="text-[15px] md:text-[17px] font-semibold text-brand-charcoal tabular-nums">{product.price}</span>
                  {product.originalPrice && (
                     <span className="text-faint line-through text-[12px] md:text-[13px] tabular-nums">{product.originalPrice}</span>
                  )}
               </div>

               {/* Rating & Shipping */}
               {(hasRating(product.rating) || product.shipping) && (
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] md:text-[13px]">
                     {hasRating(product.rating) && (
                        <div className="flex items-center gap-1">
                           <Rating value={product.rating} />
                           <span className="text-faint ml-0.5 tabular-nums">{product.rating}</span>
                        </div>
                     )}
                     {product.shipping && (
                        <div className="flex items-center gap-2 text-success">
                           {hasRating(product.rating) && (
                              <span aria-hidden="true" className="w-[3px] h-[3px] rounded-full bg-medium-gray" />
                           )}
                           <span className="font-medium">{product.shipping}</span>
                        </div>
                     )}
                  </div>
               )}
            </div>

            {/* Desktop-only description */}
            {product.description && (
               <p className="hidden md:block text-subtle text-[14px] leading-relaxed line-clamp-2">
                  {product.description}
               </p>
            )}

            <div className="flex items-center gap-4 mt-auto pt-1">
               <Link href={href} className="text-brand-orange-text font-medium text-[13px] md:text-[14px] hover:underline cursor-pointer flex items-center gap-1">
                  View details ›
               </Link>
               <button 
                  onClick={handleAddToCart}
                  className="md:hidden text-brand-orange-text font-medium text-[13px] hover:underline cursor-pointer"
               >
                  Add to cart
               </button>
            </div>
         </div>

         {/* Actions Section (Right Side): favourite at the top, Add to cart at the bottom */}
         <div className="hidden md:flex flex-col items-end justify-between gap-3 py-4 pr-5 min-w-[150px]">
            {showFavorite ? (
               <FavoriteButton item={toWishlistItem(product)} className="flex-shrink-0" />
            ) : (
               <span aria-hidden="true" />
            )}

            <div className="flex flex-col gap-2 items-end w-full">
               <Button 
                  onClick={handleAddToCart}
                  variant="accent" 
                  size="sm" 
                  shape="pill"
                  className="w-full font-medium text-[13px]!"
               >
                  Add to cart
               </Button>

               {onRemove && (
                  <button 
                     onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                     }}
                     className="text-error font-medium text-[13px] hover:underline cursor-pointer transition-all"
                  >
                     Remove
                  </button>
               )}
            </div>
         </div>

         {/* Heart Icon (Mobile) */}
         {showFavorite && (
            <FavoriteButton item={toWishlistItem(product)} variant="ghost" className="md:hidden absolute top-3 right-3" />
         )}
      </div>
   );
};
