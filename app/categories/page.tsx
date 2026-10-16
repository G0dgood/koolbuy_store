"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import {
  HiChevronRight,
  HiDevicePhoneMobile,
  HiHome,
  HiSparkles,
  HiShoppingBag,
  HiHeart,
  HiBeaker,
  HiStar,
} from "react-icons/hi2";
import { motion } from "framer-motion";

const CategoriesPage = () => {
  const collections = [
    {
      title: "Signature fragrance",
      count: "320 items",
      image: "/brandImage/signature_oud.webp",
      icon: <HiSparkles className="text-brand-orange-text" size={22} />,
      link: "/products?category=fragrance",
    },
    {
      title: "Advanced skincare",
      count: "150 items",
      image: "/brandImage/cat_skincare.png",
      icon: <HiBeaker className="text-brand-orange-text" size={22} />,
      link: "/products?category=skincare",
    },
    {
      title: "Artisanal gift sets",
      count: "85 items",
      image: "/brandImage/cat_gifts.png",
      icon: <HiShoppingBag className="text-brand-orange-text" size={22} />,
      link: "/products?category=gifts",
    },
    {
      title: "Body & bath",
      count: "120 items",
      image: "/brandImage/cat_body.png",
      icon: <HiHeart className="text-brand-orange-text" size={22} />,
      link: "/products?category=body",
    },
    {
      title: "Men's grooming",
      count: "95 items",
      image: "/brandImage/cat_grooming.png",
      icon: <HiStar className="text-brand-orange-text" size={22} />,
      link: "/products?category=grooming",
    },
    {
      title: "Home fragrance",
      count: "60 items",
      image: "/brandImage/cat_home_scent.png",
      icon: <HiHome className="text-brand-orange-text" size={22} />,
      link: "/products?category=home-scent",
    },
  ];

  const subCategories = [
    "Kitchenware",
    "Smartphones",
    "Outerwear",
    "Yoga mats",
    "Organic oils",
    "Office supplies",
    "Smart watches",
    "Garden tools",
    "Denim",
    "Hiking gear",
    "Skincare",
    "Power tools",
  ];

  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <div className="min-h-screen bg-off-white flex flex-col font-sans text-brand-charcoal">
      <Header />

      <main className="flex-1 w-full max-w-360 mx-auto px-4 sm:px-6 md:px-10 lg:px-16 pt-10 md:pt-16 pb-16 md:pb-24 flex flex-col gap-12 md:gap-20">
        {/* Collections headline */}
        <section className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="flex flex-col items-center gap-3 max-w-3xl mx-auto"
          >
            <span className="text-[13px] font-semibold text-brand-orange-text">
              Koolbuy Store catalogs
            </span>
            <h1 className="text-[28px] sm:text-[36px] md:text-[44px] font-semibold text-brand-charcoal tracking-[-0.03em] leading-[1.05]">
              The <span className="text-faint">collections.</span>
            </h1>
            <p className="text-subtle max-w-xl mx-auto text-[17px] md:text-[19px] mt-1 leading-snug">
              Explore a universe of high-fidelity products curated across six
              primary categories, designed to bring excellence into every
              facet of your life.
            </p>
          </motion.div>
        </section>

        {/* Collections grid: photo edge to edge, text below */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {collections.map((col, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease }}
              className="bg-white rounded-tile overflow-hidden flex flex-col cursor-pointer group transition-shadow duration-300 hover:shadow-lift"
            >
              <div className="relative aspect-4/3 bg-off-white overflow-hidden">
                <Image
                  src={col.image}
                  alt={col.title}
                  fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 ease-apple group-hover:scale-[1.04]"
                />
              </div>

              <div className="flex flex-col gap-4 px-5 pt-4 pb-5 md:px-6 md:pt-5 md:pb-6 flex-1">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 bg-brand-orange-soft rounded-stage flex items-center justify-center">
                    {col.icon}
                  </div>
                  <span className="text-[13px] text-faint">
                    Verified collection
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-[22px] font-semibold text-brand-charcoal tracking-[-0.02em] leading-tight">
                    {col.title}
                  </h3>
                  <span className="text-[13px] text-faint tabular-nums">
                    {col.count}
                  </span>
                </div>
                <Link
                  href={col.link}
                  className="mt-auto inline-flex items-center gap-0.5 w-fit text-[15px] font-medium text-brand-orange-text hover:underline"
                >
                  Explore catalog{" "}
                  <HiChevronRight
                    size={16}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Sub-category exploration */}
        <section className="flex flex-col gap-6 md:gap-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 md:gap-6">
            <div className="flex flex-col gap-1.5">
              <span className="text-[13px] font-semibold text-brand-orange-text">
                Deeper discovery
              </span>
              <h2 className="text-[20px] md:text-[28px] font-semibold text-brand-charcoal tracking-[-0.025em] leading-tight">
                Popular verticals.
              </h2>
            </div>
            <p className="text-subtle max-w-md text-[15px] md:text-[17px] leading-normal">
              Quickly jump into our most-searched niches and trending
              collections within the Koolbuy Store ecosystem.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {subCategories.map((sub, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.03, ease }}
                className="px-5 py-2.5 bg-black/[0.04] rounded-full hover:bg-black/[0.08] transition-colors duration-200 text-[14px] font-medium text-brand-charcoal cursor-pointer"
              >
                {sub}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Featured promotion: a charcoal band tile (dark band rules) */}
        <section className="bg-brand-charcoal rounded-tile md:rounded-hero py-16 md:py-20">
          <div className="px-6 md:px-10 flex flex-col items-center text-center gap-4">
            <h2 className="text-[24px] md:text-[38px] font-semibold text-white tracking-[-0.03em] leading-[1.05]">
              Can&apos;t find your <span className="text-white/60">bloom?</span>
            </h2>
            <p className="text-white/60 text-[17px] md:text-[19px] max-w-xl leading-snug">
              Our concierge sourcing team is always adding new collections to
              the catalog. Connect with our curators if you&apos;re looking for
              something specific.
            </p>
            <Link
              href="/contact"
              className="mt-3 inline-flex items-center justify-center px-7 py-3 bg-brand-orange hover:bg-brand-orange-hover text-white rounded-full font-semibold text-[15px] transition-colors duration-200"
            >
              Request curator support
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CategoriesPage;
