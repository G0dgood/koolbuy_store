"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { HeroSection } from "@/app/components/Home/HeroSection";
import { HeroUserCard } from "@/app/components/Home/HeroUserCard";
import { DealsSection } from "@/app/components/Home/DealsSection";
import { CategorySection } from "@/app/components/Home/CategorySection";
import { InquiryForm } from "@/app/components/Home/InquiryForm";
import { ExtraServices } from "@/app/components/Home/ExtraServices";
import { RegionSuppliers } from "@/app/components/Home/RegionSuppliers";
import RecommendedItems from "./components/Home/RecommendedItems";
import { RecommendedVendors } from "@/app/components/Home/RecommendedVendors";
import { VendorshipSection } from "@/app/components/Home/VendorshipSection";
import { PartnersCarousel } from "@/app/components/Home/PartnersCarousel";
import { NewProductsSection } from "@/app/components/Home/NewProductsSection";
import { IntroducingProducts } from "@/app/components/Home/IntroducingProducts";
import { ColdFeaturesSection } from "@/app/components/Home/ColdFeaturesSection";

const newProducts = [
  {
    name: "Kool - Scanfrost 600L Inverter",
    price: "1,406,000",
    image: "/images/koolboks/items/5.webp",
  },
  {
    name: "Kool Scanfrost 60ah Pedestal",
    price: "1,287,600",
    image: "/images/koolboks/items/1.webp",
  },
  {
    name: "Kool Bruhm 60ah Pedestal",
    price: "1,287,600",
    image: "/images/koolboks/items/4.webp",
  },
  {
    name: "200L AC Inverter Freezers",
    price: "2,420,000",
    image: "/images/koolboks/items/3.webp",
  },
  {
    name: "Koolboks 600L AC Inverter",
    price: "1,468,000",
    image: "/images/koolboks/items/6.webp",
  },
  {
    name: "Koolboks 538L Refurbished",
    price: "1,538,000",
    image: "/images/koolboks/items/2.webp",
  },
  {
    name: "Koolboks 208L DC Freezer",
    price: "1,950,000",
    image: "/images/koolboks/items/3.webp",
  },
  {
    name: "Koolboks 100Ah AC Battery",
    price: "1,662,370",
    image: "/images/koolboks/items/1.webp",
  },
];

const onSaleProducts = [
  {
    name: "Koolboks 208L DC Freezer",
    price: "1,950,000",
    image: "/images/koolboks/items/3.webp",
  },
  {
    name: "Koolboks 195L DC Ice Maker",
    price: "3,235,000",
    image: "/images/koolboks/items/6.webp",
  },
  {
    name: "Koolboks 60Ah AC Battery",
    price: "1,287,600",
    image: "/images/koolboks/items/1.webp",
  },
  {
    name: "Koolboks 100Ah AC Battery",
    price: "1,662,370",
    image: "/images/koolboks/items/4.webp",
  },
  {
    name: "Koolboks 538L Maxi Freezer",
    price: "3,607,000",
    image: "/images/koolboks/items/6.webp",
  },
  {
    name: "Hisense Deep Freezers 200L",
    price: "370,000",
    image: "/images/koolboks/items/5.webp",
  },
  {
    name: "Kool - Scanfrost 600L Inverter",
    price: "1,406,000",
    image: "/images/koolboks/items/5.webp",
  },
  {
    name: "Koolboks 538L Refurbished",
    price: "1,538,000",
    image: "/images/koolboks/items/2.webp",
  },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-[#F7FAFC] flex flex-col font-sans text-black">
      <Header />

      {/* Full-width Hero Carousel */}
      <HeroSection />

      <main className="flex-1 w-full max-w-360 mx-auto px-6 md:px-10 lg:px-16 py-8 md:py-12 flex flex-col gap-8 md:gap-24">
        {/* Introducing Our Products & Category Tabs */}
        <div className="flex flex-col gap-8">
          <IntroducingProducts />
          <NewProductsSection />
        </div>

        {/* Promotional Banner */}
        <div className="w-full relative rounded-lg overflow-hidden border border-[#1C1C1C1A] shadow-xs group bg-white">
          <Link href="/products" className="block w-full">
            <div className="relative w-full aspect-[3.3/1] min-h-35 sm:min-h-45 md:min-h-55">
              <Image
                src="/images/koolboks/banner-2.jpg"
                alt="Koolbuy - Get a freezer for as low as ₦20,000 per month"
                fill
                className="object-cover group-hover:scale-[1.01] transition-transform duration-500"
              />
            </div>
          </Link>
        </div>
        <DealsSection />
        <ColdFeaturesSection />

        {/* Become a Verified Vendor Section with Map */}
        <VendorshipSection />

        {/* Recommended Vendors Section */}
        <RecommendedVendors />

        {/* Meet Our Partners Carousel */}
        <PartnersCarousel />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
