"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { HeroSection } from "@/app/components/Home/HeroSection";
import { RecommendedVendors } from "@/app/components/Home/RecommendedVendors";
import { VendorshipSection } from "@/app/components/Home/VendorshipSection";
import { PartnersCarousel } from "@/app/components/Home/PartnersCarousel";
import { NewProductsSection } from "@/app/components/Home/NewProductsSection";
import { IntroducingProducts } from "@/app/components/Home/IntroducingProducts";
import { ColdFeaturesSection } from "@/app/components/Home/ColdFeaturesSection";

const Home = () => {
  const [activeCategory, setActiveCategory] = React.useState("all");

  return (
    <div className="min-h-screen bg-off-white flex flex-col font-sans text-black">
      <Header />

      {/* Full-width Hero Carousel */}
      <HeroSection />

      <main className="flex-1 w-full max-w-360 mx-auto px-4 sm:px-6 md:px-10 lg:px-16 pt-8 md:pt-14 pb-16 md:pb-24 flex flex-col gap-16 md:gap-28">
        {/* Introducing Our Products & Category Tabs */}
        <div className="flex flex-col gap-12 md:gap-16">
          <IntroducingProducts activeTab={activeCategory} onTabChange={setActiveCategory} />
          <NewProductsSection category={activeCategory} />
        </div>

        {/* Promotional Banner */}
        <div className="w-full relative rounded-md md:rounded-lg overflow-hidden group bg-off-white">
          <Link href="/products" className="block w-full">
            <div className="relative w-full aspect-[3.3/1] min-h-35 sm:min-h-45 md:min-h-55">
              <Image
                src="/images/koolboks/banner-2.jpg"
                alt="Koolbuy - Get a freezer for as low as ₦20,000 per month"
                fill sizes="100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.015]"
              />
            </div>
          </Link>
        </div>
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
