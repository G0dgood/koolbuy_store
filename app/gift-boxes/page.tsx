"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { HiSparkles, HiGift } from "react-icons/hi2";
import { motion } from "framer-motion";
import { EmptyState } from "@/app/components/EmptyState";

const GiftBoxesPage = () => {
  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <div className="min-h-screen bg-off-white flex flex-col font-sans text-brand-charcoal">
      <Header />

      <main className="flex-1 w-full max-w-360 mx-auto px-4 sm:px-6 md:px-10 lg:px-16 pt-4 md:pt-8 pb-16 md:pb-24 flex flex-col gap-16 md:gap-28">
        {/* Hero: a large photo tile with a dark overlay (dark band rules) */}
        <section className="relative w-full h-115 md:h-140 rounded-tile md:rounded-hero overflow-hidden">
          <Image
            src="/brandImage/cat_gifts.png"
            alt="Gift Boxes Collection"
            fill sizes="(max-width: 1440px) 100vw, 1440px"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-r from-brand-charcoal/90 via-brand-charcoal/60 to-brand-charcoal/10 flex items-center">
            <div className="px-6 sm:px-10 md:px-16 w-full">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease }}
                className="flex flex-col gap-3 md:gap-4 max-w-2xl"
              >
                <span className="text-[13px] font-semibold text-brand-orange">
                  Boutique curations
                </span>
                <h1 className="text-[32px] sm:text-[42px] md:text-[52px] font-semibold text-white tracking-[-0.03em] leading-[1.02]">
                  Artisanal <br />
                  <span className="text-white/60">gifts.</span>
                </h1>
                <p className="text-white/70 text-[17px] md:text-[19px] leading-snug mt-1 max-w-xl">
                  Elevate the art of giving with our meticulously curated
                  sensory experiences. Each set is hand-wrapped in our signature
                  Koolbuy Store packaging.
                </p>
                <div className="pt-3 flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center h-12 px-7 bg-brand-orange hover:bg-brand-orange-hover text-white rounded-full font-semibold text-[15px] transition-colors duration-200"
                  >
                    Shop all products
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center h-12 px-7 bg-white/10 hover:bg-white/20 text-white rounded-full font-medium text-[15px] transition-colors duration-200"
                  >
                    Custom curation
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-8 md:gap-10">
          {/* Gift collection heading */}
          <div className="flex flex-col gap-2">
            <span className="text-[13px] font-semibold text-brand-orange-text">
              The seasonal edit
            </span>
            <h2 className="text-[24px] md:text-[36px] font-semibold text-brand-charcoal tracking-[-0.03em] leading-[1.08]">
              Hand-wrapped <br />
              excellence.
            </h2>
          </div>

          {/* Gift sets: no gift-box catalogue in the backend yet */}
          <EmptyState
            variant="card"
            illustration="promotions"
            title="No gift boxes yet"
            description="Gift boxes will appear here once we put sets together."
            action={{ label: "Browse products", href: "/products" }}
          />
        </section>

        {/* Bespoke concierge CTA */}
        <section className="bg-white rounded-tile md:rounded-hero p-6 sm:p-10 md:p-16 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="flex flex-col gap-6 md:gap-8">
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 bg-brand-orange-soft rounded-stage flex items-center justify-center text-brand-orange-text">
                  <HiSparkles size={24} />
                </div>
                <h2 className="text-[24px] md:text-[36px] font-semibold text-brand-charcoal tracking-[-0.03em] leading-[1.08]">
                  The bespoke <br />
                  <span className="text-faint">choice.</span>
                </h2>
              </div>
              <p className="text-subtle text-[17px] md:text-[19px] leading-snug">
                Seeking a personalized touch? Our concierge team specializes
                in corporate gifting and custom sensory curation for life&apos;s
                most momentous occasions.
              </p>
              <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[15px] font-semibold text-brand-charcoal">
                    Corporate gifting
                  </span>
                  <p className="text-[14px] text-subtle">
                    Premium sets for your valued partners.
                  </p>
                </div>
                <div className="w-px h-12 bg-light-gray hidden md:block" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[15px] font-semibold text-brand-charcoal">
                    Wedding suites
                  </span>
                  <p className="text-[14px] text-subtle">
                    Bespoke scents for your special day.
                  </p>
                </div>
              </div>
              <Link
                href="/contact"
                className="w-full md:w-fit inline-flex items-center justify-center px-7 py-3 bg-brand-orange hover:bg-brand-orange-hover text-white rounded-full font-semibold text-[15px] transition-colors duration-200"
              >
                Consult a curator
              </Link>
            </div>
            <div className="relative aspect-square rounded-tile overflow-hidden bg-off-white group">
              <Image
                src="/brandImage/cat_gifts.png"
                alt="Bespoke Curation"
                fill sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-apple group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 material-frosted rounded-full flex items-center justify-center text-brand-charcoal">
                  <HiGift size={36} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default GiftBoxesPage;
