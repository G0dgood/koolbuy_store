"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { Icon } from "@/app/components/Icon";
import { ProductGallery } from "@/app/components/Products/ProductGallery";
import { ProductDetailsInfo } from "@/app/components/Products/ProductDetailsInfo";
import { ProductFeatureGallery } from "@/app/components/Products/ProductFeatureGallery";
import { ProductTabs } from "@/app/components/Products/ProductTabs";
import { YouMayLike } from "@/app/components/Products/YouMayLike";
import { DiscountBanner } from "@/app/components/Products/DiscountBanner";
import { RelatedProducts } from "@/app/components/Products/RelatedProducts";

export default function ProductDetailPage() {
  const relatedProducts = [
    {
      name: "Kool - Scanfrost 600L Inverter",
      price: "₦1,406,000",
      image: "/images/koolboks/items/5.webp",
    },
    {
      name: "Kool Scanfrost 60ah Pedestal",
      price: "₦1,287,600",
      image: "/images/koolboks/items/1.webp",
    },
    {
      name: "Kool Bruhm 60ah Pedestal",
      price: "₦1,287,600",
      image: "/images/koolboks/items/4.webp",
    },
    {
      name: "200L AC Inverter Freezers",
      price: "₦2,420,000",
      image: "/images/koolboks/items/3.webp",
    },
    {
      name: "Koolboks 600L AC Inverter",
      price: "₦1,468,000",
      image: "/images/koolboks/items/6.webp",
    },
    {
      name: "Koolboks 538L Refurbished",
      price: "₦1,538,000",
      image: "/images/koolboks/items/2.webp",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <div className="flex-1 max-w-360 mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-4 md:py-8 flex flex-col gap-8 md:gap-16 w-full">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-[12px] text-gray-500 overflow-x-auto whitespace-nowrap scrollbar-none pb-1">
          <Link href="/" className="hover:text-ink hover:underline">
            Home
          </Link>
          <Icon name="chevron_right" size="xs" />
          <Link
            href="/products"
            className="hover:text-ink hover:underline"
          >
            Products
          </Link>
          <Icon name="chevron_right" size="xs" />
          <Link
            href="/products?category=Single+Door+Chest+Freezers"
            className="hover:text-ink hover:underline"
          >
            Single Door Chest Freezers
          </Link>
          <Icon name="chevron_right" size="xs" />
          <span className="text-ink truncate max-w-60 sm:max-w-md">
            219L Thermocool Inverter Solar Freezer
          </span>
        </div>

        {/* Top Product Section (2-column layout matching reference) */}
        <div className="bg-white flex flex-col lg:flex-row gap-8 lg:gap-16">
          <ProductGallery />
          <ProductDetailsInfo />
        </div>

        {/* Second Card: 5 Medium-Sized Feature Views */}
        <ProductFeatureGallery />

        {/* Mid Section: Tabs + You May Like */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <ProductTabs />
          <YouMayLike />
        </div>

        <RelatedProducts products={relatedProducts} />

        {/* Bottom Banner */}
        <DiscountBanner />
      </div>

      <Footer />
    </div>
  );
}
