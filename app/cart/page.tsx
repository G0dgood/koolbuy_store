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

import { EmptyCartIllustration } from "@/app/components/Cart/EmptyCartIllustration";

export default function CartPage() {
  const { cartItems, clearCart } = useCart();
  const [isClearModalOpen, setIsClearModalOpen] = React.useState(false);

  const hasItems = cartItems.length > 0;

  return (
    <div className="flex flex-col min-h-screen bg-off-white">
      <Header />

      <div className="flex-1 max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-8 md:py-12 flex flex-col gap-8 md:gap-10 w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-[20px] md:text-[22px] font-semibold text-brand-charcoal tracking-[-0.025em] leading-tight">
            My cart <span className="text-faint tabular-nums font-normal">({cartItems.length})</span>
          </h1>
          {hasItems && (
            <Link href="/products" className="text-sm font-medium text-brand-orange-text hover:underline hidden sm:block">
              Continue shopping →
            </Link>
          )}
        </div>

        {hasItems ? (
          <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start">
            {/* Cart List Container */}
            <div className="flex-1 bg-white rounded-tile border border-light-gray px-5 py-2 md:px-8 md:py-4 flex flex-col w-full">
              {cartItems.map((item) => (
                <CartItem key={item.id} {...item} />
              ))}

              <div className="flex flex-col md:flex-row justify-between items-center gap-3 pt-6 pb-4 border-t border-light-gray mt-2">
                <Link href="/products" className="w-full md:w-auto">
                  <Button
                    variant="outline"
                    shape="pill"
                    className="w-full md:w-fit px-6 h-9 text-[13px]"
                    iconLeft={<Icon name="arrow_back" size="xs" />}
                  >
                    Back to shop
                  </Button>
                </Link>
                <Button
                  onClick={() => setIsClearModalOpen(true)}
                  variant="ghost"
                  shape="pill"
                  className="w-full md:w-auto px-5 h-9 text-[13px] font-medium text-brand-orange-text hover:bg-brand-orange-soft"
                >
                  Remove all
                </Button>
              </div>
            </div>

            {/* Summary Sidebar */}
            <CartSummary />
          </div>
        ) : (
          /* Empty State with Custom SVG */
          <div className="bg-white rounded-tile border border-light-gray px-6 py-12 md:py-16 flex flex-col items-center justify-center text-center gap-6">
            <EmptyCartIllustration className="w-44 h-36 sm:w-52 sm:h-44" />

            <div className="flex flex-col items-center gap-2 max-w-md">
              <h2 className="text-[18px] md:text-[20px] font-bold text-brand-charcoal tracking-[-0.02em]">
                Your cart is empty
              </h2>
              <p className="text-[15px] text-subtle leading-relaxed">
                Looks like you haven&apos;t added anything to your cart yet. Discover energy-efficient solar freezers, appliances, and marketplace essentials.
              </p>
            </div>

            <Link href="/products" className="mt-2">
              <Button
                variant="accent"
                shape="pill"
                size="lg"
                className="px-6 h-10 text-[13px]! font-semibold!"
              >
                Start shopping
              </Button>
            </Link>
          </div>
        )}

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
