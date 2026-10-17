"use client";

import React from "react";
import Link from "next/link";
import { Button } from "../Button/Button";
import { useCart } from "@/app/context/CartContext";
import { toast } from "sonner";
import { StoreImage } from "../Home/StoreUi";
import { productHref } from "@/lib/store/api/storefront-api";

interface RecommendedProduct {
  id: string;
  title: string;
  price: string;
  image?: string | null;
}

interface RecommendedProductsProps {
  products: RecommendedProduct[];
}

export const RecommendedProducts: React.FC<RecommendedProductsProps> = ({ products }) => {
  const { addToCart } = useCart();
  if (products.length === 0) return null;

  const handleAddToCart = (e: React.MouseEvent, product: RecommendedProduct) => {
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
    <div className="flex flex-col gap-4 mt-8 px-4 md:px-0 md:hidden">
      <h2 className="text-[18px] font-semibold text-brand-charcoal tracking-[-0.025em] leading-tight">You may also like</h2>
      
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
        {products.map((product) => (
          <div 
            key={product.id}
            className="flex-shrink-0 w-[160px] bg-white rounded-tile overflow-hidden flex flex-col gap-2 transition-shadow duration-300 hover:shadow-lift relative group cursor-pointer active:scale-[0.98]"
          >
            <Link href={productHref(product.id)} className="flex flex-col flex-1">
              <div className="w-full aspect-square relative bg-off-white overflow-hidden">
                <StoreImage
                  src={product.image}
                  alt={product.title}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw" 
                  className="object-contain mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />
              </div>
              <div className="flex flex-col gap-0.5 px-3 pt-2.5 mb-2">
                <p className="text-[13px] font-semibold text-brand-charcoal line-clamp-2 leading-snug">
                  {product.title}
                </p>
                <span className="mt-0.5 text-[13px] text-brand-charcoal tabular-nums">{product.price}</span>
              </div>
            </Link>
            
            <div className="flex flex-col gap-1.5">
               <Link href={productHref(product.id)} className="w-full">
                  <Button variant="ghost" size="sm" shape="pill" className="w-full h-8 font-medium bg-black/[0.04] hover:bg-black/[0.08]">
                    View details
                  </Button>
               </Link>
               <Button 
                onClick={(e) => handleAddToCart(e, product)}
                variant="primary" 
                size="sm" 
                shape="pill"
                className="w-full h-8 font-medium"
               >
                 + Cart
               </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
