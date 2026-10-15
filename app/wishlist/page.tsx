"use client";

import React, { useState } from "react";
import { Header } from "@/app/components/Header";
import Image from "next/image";
import { Footer } from "@/app/components/Footer";
import { Icon } from "@/app/components/Icon";
import { ProductListItem } from "@/app/components/Products/ProductItems";
import { ClearWishlistModal, RemoveItemModal } from "@/app/components/Modal";
import Link from "next/link";
import { useWishlist } from "@/app/context/WishlistContext";

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();

  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isRemoveOneModalOpen, setIsRemoveOneModalOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<any>(null);

  const handleClearWishlist = () => {
    clearWishlist();
    setIsClearModalOpen(false);
  };

  const handleRemoveOneRequest = (product: any) => {
    setItemToRemove(product);
    setIsRemoveOneModalOpen(true);
  };

  const confirmRemoveOne = () => {
    if (itemToRemove) {
      removeFromWishlist(itemToRemove.id);
      setItemToRemove(null);
      setIsRemoveOneModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-off-white flex flex-col font-sans text-brand-charcoal">
      <Header />

      <div className="flex-1 max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-8 md:py-12 flex flex-col gap-8 md:gap-10 w-full">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-[12px] md:text-[13px] text-faint overflow-x-auto whitespace-nowrap scrollbar-none -mb-4 md:-mb-6">
          <Link href="/" className="hover:text-brand-charcoal transition-colors duration-200">
            Home
          </Link>
          <span aria-hidden="true" className="text-gray-300">›</span>
          <span className="text-subtle">Wishlist</span>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-[24px] md:text-[28px] font-semibold text-brand-charcoal tracking-[-0.025em] leading-tight">
                My wishlist
              </h1>
              <p className="text-[14px] md:text-[15px] text-subtle tabular-nums">{wishlistItems.length} items saved</p>
            </div>
            {wishlistItems.length > 0 && (
              <button
                onClick={() => setIsClearModalOpen(true)}
                className="self-start md:self-auto h-10 px-4 -mx-4 md:mx-0 rounded-full text-[14px] font-medium text-error hover:bg-error-soft transition-colors duration-200 flex items-center gap-2 cursor-pointer"
              >
                <Icon name="delete_outline" size="sm" />
                Clear wishlist
              </button>
            )}
          </div>

          {wishlistItems.length > 0 ? (
            <div className="flex flex-col gap-3 md:gap-4">
              {wishlistItems.map((product) => (
                <ProductListItem
                  key={product.id}
                  product={product as any}
                  onRemove={() => handleRemoveOneRequest(product)}
                  showFavorite={false}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[22px] px-6 py-16 md:py-20 flex flex-col items-center text-center gap-5">
              <div className="w-16 h-16 bg-brand-orange-soft rounded-full flex items-center justify-center text-brand-orange-text">
                <Icon name="favorite" size="md" />
              </div>
              <div className="flex flex-col gap-1.5 max-w-sm">
                <h3 className="text-[22px] md:text-[24px] font-semibold text-brand-charcoal tracking-[-0.02em] leading-tight">
                  Your wishlist is empty
                </h3>
                <p className="text-subtle leading-relaxed text-[15px]">
                  Save items that you like to your wishlist and they will appear
                  here, making it easy to find them again later.
                </p>
              </div>
              <Link
                href="/products"
                className="mt-1 h-11 bg-brand-orange text-white px-7 rounded-full text-[15px] font-semibold hover:bg-brand-orange-hover transition-colors duration-200 flex items-center gap-2"
              >
                <Icon name="shopping_basket" size="sm" />
                Start shopping
              </Link>
            </div>
          )}
        </div>

        {/* Recently Viewed */}
        <div className="mt-8 md:mt-16 pb-4">
          <h2 className="text-[26px] md:text-[34px] font-semibold text-brand-charcoal tracking-[-0.025em] leading-tight mb-5 md:mb-6">
            Recently viewed
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {[
              {
                id: "rv1",
                title: "Men's fashion blue jeans",
                price: "₦12.50",
                image: "/images/shirt.jpg",
              },
              {
                id: "rv2",
                title: "Leather brown wallet",
                price: "₦34.00",
                image: "/images/wallet.jpg",
              },
              {
                id: "rv3",
                title: "Smart watch silver edition",
                price: "₦19.00",
                image: "/images/watch.jpg",
              },
              {
                id: "rv4",
                title: "Blue backpack collection",
                price: "₦10.00",
                image: "/images/bag.jpg",
              },
              {
                id: "rv5",
                title: "Tech accessories bundle",
                price: "₦99.00",
                image: "/images/camera.jpg",
              },
              {
                id: "rv6",
                title: "Wireless headphones gray",
                price: "₦89.00",
                image: "/images/headphone.jpg",
              },
            ].map((item) => (
              <Link
                href="/products/detail"
                key={item.id}
                className="bg-white rounded-[22px] overflow-hidden flex flex-col transition-shadow duration-300 hover:shadow-lift group"
              >
                <div className="aspect-square relative bg-off-white overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-contain mix-blend-multiply transition-transform duration-500 ease-apple group-hover:scale-[1.04]"
                  />
                </div>
                <div className="flex flex-col gap-1 px-4 pt-3 pb-4">
                  <p className="text-[14px] font-semibold text-brand-charcoal line-clamp-2 leading-snug">
                    {item.title}
                  </p>
                  <span className="text-[14px] text-brand-charcoal tabular-nums">
                    {item.price}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <ClearWishlistModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onClear={handleClearWishlist}
      />

      <RemoveItemModal
        isOpen={isRemoveOneModalOpen}
        onClose={() => setIsRemoveOneModalOpen(false)}
        onConfirm={confirmRemoveOne}
        productTitle={itemToRemove?.title}
      />

      <Footer />
    </div>
  );
};

export default WishlistPage;
