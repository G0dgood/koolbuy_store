"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { EmptyState } from "@/app/components/EmptyState";
import { motion } from "framer-motion";

const BrandsPage = () => {
  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <div className="min-h-screen bg-off-white flex flex-col font-sans text-brand-charcoal">
      <Header />

      <main className="flex-1 w-full max-w-360 mx-auto px-4 sm:px-6 md:px-10 lg:px-16 pt-10 md:pt-16 pb-16 md:pb-24 flex flex-col gap-12 md:gap-20">
        {/* Brands headline */}
        <section className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="flex flex-col items-center gap-3 max-w-3xl mx-auto"
          >
            <span className="text-[13px] font-semibold text-brand-orange-text">
              Artisanal houses
            </span>
            <h1 className="text-[28px] sm:text-[36px] md:text-[44px] font-semibold text-brand-charcoal tracking-[-0.03em] leading-[1.05]">
              The <span className="text-faint">brands.</span>
            </h1>
            <p className="text-subtle max-w-xl mx-auto text-[17px] md:text-[19px] mt-1 leading-snug">
              Explore our curated selection of luxury perfume houses and
              skincare curators, each bringing a unique signature to the
              Koolbuy Store ecosystem.
            </p>
          </motion.div>
        </section>

        {/* Brands: no brand catalogue in the backend yet */}
        <EmptyState
          variant="card"
          illustration="vendors"
          title="No brands yet"
          description="Brands will appear here once they're added to the store."
          action={{ label: "Browse products", href: "/products" }}
        />

        {/* Brands concierge: a charcoal band tile (dark band rules) */}
        <section className="bg-brand-charcoal rounded-tile md:rounded-hero py-16 md:py-24 relative overflow-hidden">
          <Image
            src="/brandImage/brand_banner.png"
            alt="Background"
            fill sizes="(max-width: 1440px) 100vw, 1440px"
            className="object-cover opacity-10 grayscale"
          />
          <div className="px-6 md:px-10 flex flex-col items-center text-center gap-5 relative z-10">
            <div className="flex flex-col gap-3">
              <span className="text-[13px] font-semibold text-brand-orange">
                Custom procurement
              </span>
              <h2 className="text-[24px] md:text-[38px] font-semibold text-white tracking-[-0.03em] leading-[1.05]">
                Looking for a specific{" "}
                <span className="text-white/60">creator?</span>
              </h2>
            </div>
            <p className="text-white/60 text-[17px] md:text-[19px] max-w-2xl leading-snug">
              Our artisans maintain connections with luxury houses globally. If
              you need a specific brand or collector&apos;s edition not shown here,
              our concierge sourcing team is at your disposal.
            </p>
            <Link
              href="/contact"
              className="mt-3 inline-flex items-center justify-center px-7 py-3 bg-brand-orange hover:bg-brand-orange-hover text-white rounded-full font-semibold text-[15px] transition-colors duration-200"
            >
              Consult a brand curator
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BrandsPage;
