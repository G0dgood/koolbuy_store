"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { CheckoutForm } from "@/app/components/Checkout/CheckoutForm";
import { OrderSummary } from "@/app/components/Checkout/OrderSummary";
import { Breadcrumbs } from "@/app/components/Breadcrumbs";
import { Icon } from "@/app/components/Icon";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans relative overflow-hidden bg-off-white">
      {/* Custom Background Image (kept very faint so the page reads as plain off-white) */}
      <div className="absolute inset-0 w-full h-full -z-10">
        <Image
          src="/web_images/twocolor_background.png"
          alt="Background"
          fill sizes="100vw"
          className="object-cover opacity-0"
        />
      </div>

      <Header />

      <div className="flex-1 max-w-[1440px] w-full mx-auto px-6 md:px-10 lg:px-16 py-8 md:py-12">
        {/* Breadcrumbs */}
        <div className="mb-6 hidden md:block">
          <Breadcrumbs
            items={[{ label: "Shopping Cart", href: "/cart" }, { label: "Checkout" }]}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-8 md:gap-10"
        >
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-[20px] md:text-[22px] font-semibold text-brand-charcoal tracking-[-0.025em] leading-tight">Finalize order</h1>
              <p className="text-[14px] md:text-[15px] text-subtle">Complete your purchase safely and securely.</p>
            </div>
            <div className="flex items-center gap-2 text-[13px] text-subtle">
              <Icon name="lock" size="sm" className="text-faint" />
              Secure 256-bit checkout
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start">
            {/* Responsive Form Column */}
            <div className="flex-1 w-full order-2 lg:order-1">
              <CheckoutForm />
            </div>

            {/* Sticky Summary Column */}
            <div className="w-full lg:w-auto order-1 lg:order-2">
              <OrderSummary />
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}

