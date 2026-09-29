"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { Icon } from "@/app/components/Icon";
import { Button } from "@/app/components/Button";
import { CartItem } from "@/app/components/Cart/CartItem";
import { CartSummary } from "@/app/components/Cart/CartSummary";
import { SavedForLater } from "@/app/components/Cart/SavedForLater";
import { ServiceBadges } from "@/app/components/Cart/ServiceBadges";
import { ClearCartModal } from "@/app/components/Modal";

import { useCart } from "@/app/context/CartContext";

export default function CartPage() {
  const { cartItems, clearCart } = useCart();
  const [isClearModalOpen, setIsClearModalOpen] = React.useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <div className="flex-1 max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-8 md:py-14 flex flex-col gap-8 md:gap-10 w-full">
        <div className="flex flex-col gap-2 md:items-center md:text-center">
          <h1 className="kb-title text-[32px] md:text-[48px] leading-[1.07] tracking-[-0.025em]">
            {cartItems.length > 0 ? "Review your cart." : "Your cart is empty."}
          </h1>
          <p className="text-[17px] text-gray-600">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"}.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start">
          {/* Cart List Container */}
          <div className="flex-1 bg-white md:border-t md:border-hairline flex flex-col w-full">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <CartItem key={item.id} {...item} />
              ))
            ) : (
              <div className="py-12 flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                  <Icon name="shopping_cart" size="md" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-gray-900 font-bold">Your cart is empty</p>
                  <p className="text-gray-500 text-sm">Looks like you haven't added anything to your cart yet.</p>
                </div>
              </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8">
              <Link href="/products" className="w-full md:w-auto">
                <Button
                  className="w-full md:w-fit px-[22px] h-11"
                  iconLeft={<Icon name="arrow_back white" size="xs" />}
                >
                  Back to shop
                </Button>
              </Link>
              {cartItems.length > 0 && (
                <Button
                  onClick={() => setIsClearModalOpen(true)}
                  variant="secondary"
                  className="w-full md:w-auto px-[22px] h-11"
                >
                  Remove all
                </Button>
              )}
            </div>
          </div>

          {/* Summary Sidebar */}
          <CartSummary />
        </div>

        {/* Footer info and Saved for Later */}
        <div className="flex flex-col gap-8">
          <ServiceBadges />
          <SavedForLater />
        </div>
      </div>

      <ClearCartModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onClear={clearCart}
      />

      <Footer />
    </div>
  );
}
