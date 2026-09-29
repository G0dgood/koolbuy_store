"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../Button";
import { Icon } from "../Icon";

import { useCart } from "@/app/context/CartContext";

const CartSummary = () => {
   const { cartItems } = useCart();

   const parsePrice = (price: string) => {
      return parseFloat(price.replace(/[₦$,]/g, ""));
   };

   const subtotal = cartItems.reduce((acc, item) => {
      return acc + parsePrice(item.price) * item.quantity;
   }, 0);

   const discount = subtotal > 0 ? 6000 : 0; // Updated example discount in Naira
   const tax = subtotal > 0 ? 1400 : 0; // Updated example tax in Naira
   const total = Math.max(0, subtotal - discount + tax);

   return (
      <div className="w-full lg:w-[350px] flex flex-col gap-4">
         {/* Coupon Section */}
         <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-4">
            <span className="text-sm text-gray-400">Have a coupon?</span>
            <div className="flex">
               <input
                  type="text"
                  placeholder="Add coupon"
                  className="flex-1 h-11 px-4 border-[1.5px] border-gray-200 bg-cream rounded-l-full outline-none focus:border-action focus:bg-white transition-colors text-sm text-gray-900 placeholder-gray-400"
               />
               <Button variant="primary" className="h-11 px-5 border border-l-0 border-ink bg-ink text-white font-bold rounded-l-none rounded-r-full hover:bg-brand-blue/90 transition-colors text-sm shadow-none cursor-pointer">
                  Apply
               </Button>
            </div>
         </div>

         {/* Summary Section */}
         <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex flex-col gap-2 pb-4 border-b border-gray-100">
               <div className="flex justify-between text-gray-400 text-sm">
                  <span>Subtotal:</span>
                  <span className="text-gray-600 font-medium">₦{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
               </div>
               <div className="flex justify-between text-gray-400 text-sm">
                  <span>Discount:</span>
                  <span className="text-tomato font-medium">- ₦{discount.toFixed(2)}</span>
               </div>
               <div className="flex justify-between text-gray-400 text-sm">
                  <span>Tax:</span>
                  <span className="text-blue-600 font-medium">+ ₦{tax.toFixed(2)}</span>
               </div>
            </div>

            <div className="flex justify-between items-center py-2">
               <span className="font-bold text-gray-900">Total:</span>
               <span className="font-semibold text-2xl text-ink tracking-tight">₦{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>

            <div className="w-full">
               <Button
                  variant="ghost"
                  disabled={cartItems.length === 0}
                  className={`w-full text-white font-bold h-12 text-base transition-all ${cartItems.length === 0 ? "opacity-50 cursor-not-allowed bg-gray-400" : "hover:opacity-90 cursor-pointer"}`}
                  style={{ backgroundColor: cartItems.length > 0 ? "#248a3d" : undefined }}
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

            <div className="flex items-center justify-center gap-3 pt-2">
               {["amex", "mastercard", "applepay", "visa", "pp"].map((pay, idx) => (
                  <div key={idx} className="w-9 h-6 relative grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
                     <Image src={`/payment/${pay}.png`} alt={pay} fill className="object-contain" />
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};

export { CartSummary };
