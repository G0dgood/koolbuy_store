"use client";

import React from "react";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import {
  HiQuestionMarkCircle,
  HiTruck,
  HiCreditCard,
  HiArrowPath,
  HiShieldCheck,
  HiChevronRight,
} from "react-icons/hi2";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { HiSearch } from "react-icons/hi";

const HelpCenterPage = () => {
  const categories = [
    {
      title: "Getting started",
      icon: <HiQuestionMarkCircle size={22} />,
      links: ["Set up your account", "First-time shopping", "Member benefits"],
    },
    {
      title: "Shipping & delivery",
      icon: <HiTruck size={22} />,
      links: [
        "Delivery timelines",
        "Free shipping policy",
        "International rates",
      ],
      href: "/shipping",
    },
    {
      title: "Payments & pricing",
      icon: <HiCreditCard size={22} />,
      links: ["Accepted methods", "Currency options", "Voucher codes"],
    },
    {
      title: "Returns & refunds",
      icon: <HiArrowPath size={22} />,
      links: ["Return policy", "Refund timelines", "Exchanges"],
      href: "/refund",
    },
  ];

  const popularFaqs = [
    "How do I track my atmospheric fragrance delivery?",
    "What is the Koolbuy Store 'Sourced with Soul' guarantee?",
    "Can I cancel my artisanal gift set order?",
    "How to manage my cookie and privacy preferences?",
  ];

  return (
    <div className="min-h-screen bg-off-white flex flex-col font-sans text-brand-charcoal">
      <Header />

      <main className="flex-1 w-full bg-off-white">
        {/* Help Center Hero */}
        <section className="max-w-360 mx-auto px-4 sm:px-6 md:px-10 lg:px-16 pt-14 md:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center text-center gap-3"
          >
            <span className="text-[13px] font-semibold text-brand-orange-text">
              Support concierge
            </span>
            <h1 className="text-[34px] md:text-[52px] font-semibold text-brand-charcoal tracking-[-0.03em] leading-[1.05]">
              How can we help you?
            </h1>

            {/* Search Bar Component */}
            <div className="mt-6 w-full max-w-2xl relative group">
              <HiSearch
                className="absolute left-5 top-1/2 -translate-y-1/2 text-faint group-focus-within:text-brand-orange-text transition-colors"
                size={20}
              />
              <input
                type="text"
                placeholder="Search for articles, tracking, or policies..."
                className="w-full h-12 md:h-14 rounded-full bg-white border border-light-gray pl-13 pr-6 text-[16px] text-brand-charcoal placeholder:text-faint outline-none focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/15 transition-all"
              />
            </div>
          </motion.div>

          <div className="relative mt-12 md:mt-16 w-full aspect-[16/9] md:aspect-[1440/644] rounded-tile md:rounded-hero overflow-hidden">
            <Image
              src="/brandImage/brand_banner.png"
              alt="Support Banner"
              fill
              sizes="(max-width: 1440px) 100vw, 1312px"
              className="object-cover object-right"
              priority
            />
          </div>
        </section>

        {/* Category Grid */}
        <section className="max-w-360 mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-12 md:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white p-6 md:p-7 rounded-tile hover:shadow-lift transition-shadow duration-300 ease-apple group flex flex-col justify-between"
              >
                <div>
                  <div className="w-11 h-11 bg-brand-orange-soft text-brand-orange-text rounded-stage flex items-center justify-center mb-5">
                    {cat.icon}
                  </div>
                  <h3 className="text-[19px] font-semibold text-brand-charcoal tracking-[-0.01em] mb-3">
                    {cat.title}
                  </h3>
                  <div className="flex flex-col gap-2">
                    {cat.links.map((link, j) => (
                      <span
                        key={j}
                        className="text-[15px] text-subtle hover:text-brand-charcoal cursor-pointer transition-colors"
                      >
                        {link}
                      </span>
                    ))}
                  </div>
                </div>
                <Link
                  href={cat.href || "#"}
                  className="mt-6 inline-flex items-center gap-0.5 text-[14px] font-medium text-brand-orange-text hover:underline"
                >
                  View more <HiChevronRight size={14} />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Popular FAQs Section */}
          <div className="mt-16 md:mt-28 grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 items-stretch">
            <div className="bg-white rounded-tile md:rounded-hero p-6 md:p-10 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-[13px] font-semibold text-brand-orange-text">
                  Discovery
                </span>
                <h2 className="text-[26px] md:text-[34px] font-semibold text-brand-charcoal tracking-[-0.025em] leading-tight">
                  Trending questions.
                </h2>
              </div>
              <div className="flex flex-col border-t border-black/[0.06]">
                {popularFaqs.map((faq, i) => (
                  <div
                    key={i}
                    className="py-4 border-b border-black/[0.06] cursor-pointer flex items-center justify-between gap-4 group"
                  >
                    <span className="text-[16px] text-brand-charcoal group-hover:text-brand-orange-text transition-colors">
                      {faq}
                    </span>
                    <HiChevronRight className="shrink-0 text-faint group-hover:text-brand-orange-text group-hover:translate-x-0.5 transition-all" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-brand-charcoal rounded-tile md:rounded-hero p-8 md:p-12 flex flex-col justify-center gap-5">
              <div className="w-11 h-11 bg-white/10 rounded-stage flex items-center justify-center text-brand-orange">
                <HiShieldCheck size={22} />
              </div>
              <h3 className="text-[28px] md:text-[34px] font-semibold text-white tracking-[-0.025em] leading-[1.1]">
                Can&apos;t find the <br />
                <span className="text-white/60">answer?</span>
              </h3>
              <p className="text-white/60 text-[17px] leading-relaxed max-w-md">
                Our artisanal support curators are available from 9am to 6pm for
                a personalized consultation.
              </p>
              <div className="pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center h-11 px-6 rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white text-[15px] font-semibold transition-colors duration-200"
                >
                  Talk to a human
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HelpCenterPage;
