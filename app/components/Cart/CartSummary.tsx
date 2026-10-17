"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../Button";
import { Icon } from "../Icon";

import { useCart } from "@/app/context/CartContext";

const CartSummary = () => {
   const { cartItems } = useCart();
   const [couponCode, setCouponCode] = React.useState("");
   const [appliedCoupon, setAppliedCoupon] = React.useState<{ code: string; percent: number } | null>(null);
   const [couponError, setCouponError] = React.useState<string | null>(null);

   const parsePrice = (price: string) => {
      const cleaned = price.replace(/[^\d.]/g, "");
      const val = parseFloat(cleaned);
      return isNaN(val) ? 0 : val;
   };

   const subtotal = cartItems.reduce((acc, item) => {
      return acc + parsePrice(item.price) * item.quantity;
   }, 0);

   const handleApplyCoupon = (e: React.FormEvent) => {
      e.preventDefault();
      setCouponError(null);
      const code = couponCode.trim().toUpperCase();
      if (!code) {
         setCouponError("Please enter a coupon code");
         return;
      }
      if (code === "KOOL10" || code === "KOOLBUY" || code === "WELCOME10") {
         setAppliedCoupon({ code, percent: 10 });
         setCouponCode("");
      } else {
         setCouponError("Invalid or expired coupon code");
      }
   };

   const handleRemoveCoupon = () => {
      setAppliedCoupon(null);
      setCouponError(null);
   };

   const discount = appliedCoupon && subtotal > 0 ? (subtotal * appliedCoupon.percent) / 100 : 0;
   const tax = 0; // Tax included or 0 for standard orders
   const total = Math.max(0, subtotal - discount + tax);

   return (
      <div className="w-full lg:w-[360px] flex flex-col gap-4 lg:sticky lg:top-24">
         {/* Coupon Section */}
         <div className="bg-white rounded-tile border border-light-gray p-6 flex flex-col gap-3">
            <span className="text-[13px] font-medium text-brand-charcoal">Have a coupon?</span>
            {appliedCoupon ? (
               <div className="flex items-center justify-between p-2.5 px-3 bg-brand-orange-soft rounded-xl text-xs font-semibold text-brand-orange-text">
                  <div className="flex items-center gap-1.5">
                     <span>Coupon &ldquo;{appliedCoupon.code}&rdquo; applied ({appliedCoupon.percent}% off)</span>
                  </div>
                  <button
                     type="button"
                     onClick={handleRemoveCoupon}
                     className="text-faint hover:text-error transition-colors cursor-pointer text-[11px]"
                  >
                     Remove
                  </button>
               </div>
            ) : (
               <form onSubmit={handleApplyCoupon} className="flex flex-col gap-1.5">
                  <div className="flex gap-2">
                     <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="e.g. KOOL10"
                        className="flex-1 min-w-0 h-10 px-4 rounded-full bg-black/[0.04] border border-transparent outline-none transition-colors text-[14px] text-brand-charcoal placeholder:text-faint focus:bg-white focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/15 uppercase"
                     />
                     <Button type="submit" variant="primary" shape="pill" className="h-9 px-5 text-[13px]">
                        Apply
                     </Button>
                  </div>
                  {couponError && (
                     <span className="text-[12px] text-error px-2">{couponError}</span>
                  )}
               </form>
            )}
         </div>

         {/* Summary Section */}
         <div className="bg-white rounded-tile border border-light-gray p-6 flex flex-col gap-5">
            <div className="flex flex-col gap-2.5 text-[14px]">
               <div className="flex justify-between">
                  <span className="text-subtle">Subtotal</span>
                  <span className="text-brand-charcoal tabular-nums">₦{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
               </div>
               {discount > 0 && (
                  <div className="flex justify-between text-brand-orange-text">
                     <span>Discount ({appliedCoupon?.percent}%)</span>
                     <span className="tabular-nums">- ₦{discount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
               )}
               <div className="flex justify-between">
                  <span className="text-subtle">Estimated Tax</span>
                  <span className="text-brand-charcoal tabular-nums">₦{tax.toFixed(2)}</span>
               </div>
            </div>

            <div className="flex justify-between items-baseline pt-4 border-t border-black/[0.06]">
               <span className="text-[17px] font-semibold text-brand-charcoal">Total</span>
               <span className="text-[22px] font-semibold text-brand-charcoal tabular-nums tracking-[-0.01em]">₦{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>

            <div className="w-full">
               <Button
                  variant="accent"
                  shape="pill"
                  size="lg"
                  fullWidth
                  disabled={cartItems.length === 0}
                  className="text-[13px]!"
               >
                  {cartItems.length > 0 ? (
                    <Link href="/checkout" className="w-full h-full flex items-center justify-center">
                      Checkout
                    </Link>
                  ) : (
                    <span>Checkout</span>
                  )}
               </Button>
            </div>

            <div className="flex items-center justify-center gap-3">
               {["amex", "mastercard", "applepay", "visa", "pp"].map((pay, idx) => (
                  <div key={idx} className="w-9 h-6 relative grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
                     <Image src={`/payment/${pay}.png`} alt={pay} fill sizes="36px" className="object-contain" />
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};

export { CartSummary };
