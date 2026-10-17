"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";
import { categoryHref, useGetCatalogueFacetsQuery } from "@/lib/store/api/catalogue-api";
import { useGetStorefrontPopularCategoriesQuery } from "@/lib/store/api/storefront-pages-api";

/**
 * Where each card's "Shop now" goes: candidate category slugs, best match first.
 * The first candidate that has products (catalogue facets) wins; otherwise the
 * first that exists at all (facets or popular categories); otherwise /products.
 *  - Serve it cold → cold drinks / chillers (none live yet, so it lands on ice blocks & cooling)
 *  - Freeze more   → ice making (ice_blocks)
 *  - Keep it fresh → fresh meats, then fish & seafood
 */
const CARD_CATEGORIES: Record<string, string[]> = {
  "serve-it-cold": ["cold_drinks", "drinks_beverages", "beverages", "chillers", "ice_blocks"],
  "freeze-more": ["ice_blocks", "ice_makers"],
  "keep-it-fresh": ["fresh_meats", "fish_seafood", "frozen_foods"],
};

function useCardHrefs(): Record<string, string> {
  const { data: facets } = useGetCatalogueFacetsQuery();
  const { data: popular } = useGetStorefrontPopularCategoriesQuery();
  const withProducts = new Set((facets?.categories ?? []).filter((c) => c.count > 0).map((c) => c.slug));
  const known = new Set([
    ...(facets?.categories ?? []).map((c) => c.slug),
    ...(popular?.items ?? []).map((p) => p.category_slug),
  ]);
  const hrefs: Record<string, string> = {};
  for (const [id, slugs] of Object.entries(CARD_CATEGORIES)) {
    const slug = slugs.find((s) => withProducts.has(s)) ?? slugs.find((s) => known.has(s));
    hrefs[id] = slug ? categoryHref(slug) : "/products";
  }
  return hrefs;
}

const cards = [
  {
    id: "serve-it-cold",
    eyebrow: "serve it cold",
    title: "Koolboks cooling for ice-cold refreshment",
    image: "/images/koolboks/cold/yellow-cold-bg.png",
    textColor: "text-brand-charcoal",
    eyebrowColor: "text-brand-charcoal",
    buttonTextColor: "text-brand-orange-text",
  },
  {
    id: "freeze-more",
    eyebrow: "freeze more",
    title: "Sell More Ice With Ice Maker Machine",
    image: "/images/koolboks/cold/black-cold-bg.png",
    textColor: "text-white",
    eyebrowColor: "text-white/60",
    buttonTextColor: "text-brand-orange-text",
  },
  {
    id: "keep-it-fresh",
    eyebrow: "keep it fresh",
    title: "100% Meat Preservation with Koolbuy Product",
    image: "/images/koolboks/cold/blue-cold-bg.png",
    textColor: "text-white",
    eyebrowColor: "text-light-gray",
    buttonTextColor: "text-brand-orange-text",
  },
];

export const ColdFeaturesSection: React.FC = () => {
  const hrefs = useCardHrefs();
  return (
    <section className="w-full flex flex-col gap-6 md:gap-8">
      {/* Centered Heading */}
      <div className="text-center max-w-2xl mx-auto px-4">
        <h2 className="text-[24px] md:text-[36px] font-semibold text-brand-charcoal tracking-[-0.03em] leading-[1.08]">
          Start with Koolbuy Now.
        </h2>
        <p className="mt-2 text-[17px] md:text-[19px] text-subtle">
          Own certified commercial freezers, solar kits, and refurbished units to grow your business.
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {cards.map((card, idx) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: idx * 0.15 }}
            className="group relative rounded-tile md:rounded-hero overflow-hidden min-h-115 sm:min-h-125 flex flex-col justify-between"
          >
            {/* Background Image */}
            <Image
              src={card.image}
              alt={card.title}
              fill
              className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 33vw"
              priority={false}
            />

            {/* Top Text Content Overlay */}
            <div className="relative z-10 pt-10 sm:pt-12 px-6 sm:px-8 text-center flex flex-col items-center">
              <span
                className={`block text-[13px] font-semibold mb-1.5 first-letter:uppercase ${card.eyebrowColor}`}
              >
                {card.eyebrow}
              </span>
              <h3
                className={`text-[24px] sm:text-[28px] font-semibold tracking-[-0.02em] leading-[1.1] max-w-72 mb-5 sm:mb-6 ${card.textColor}`}
              >
                {card.title}
              </h3>

              <Link
                href={hrefs[card.id] ?? "/products"}
                className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur px-5 py-2 rounded-full hover:bg-white transition-colors text-[13px] font-medium"
              >
                <span className={card.buttonTextColor}>Shop now</span>
                <FiArrowRight
                  className={`${card.buttonTextColor} text-xs transition-transform duration-200`}
                />
              </Link>
            </div>

            {/* Bottom spacer */}
            <div className="relative z-0 h-48 sm:h-56" />
          </motion.div>
        ))}
      </div>

      {/* Category breakdown: Refurbished, Solar Kits, Coldrooms & Chillers */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-2">
        {[
          {
            title: "Refurbished Freezers",
            desc: "Tested & warranty certified",
            tag: "Up to 40% Off",
            link: "/category/refurbished",
            badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
          },
          {
            title: "Solar Freezer Kits",
            desc: "Zero generator power cost",
            tag: "Panel + Battery",
            link: "/category/solar-kits",
            badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
          },
          {
            title: "Commercial Coldroom",
            desc: "Walk-in temperature hubs",
            tag: "Bulk Capacity",
            link: "/category/coldroom",
            badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
          },
          {
            title: "Display Chillers",
            desc: "Supermarkets & stores",
            tag: "In Stock",
            link: "/category/chillers",
            badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
          },
        ].map((item) => (
          <Link
            key={item.title}
            href={item.link}
            className="p-4 rounded-xl border border-light-gray bg-white hover:border-brand-orange/40 hover:shadow-xs transition-all flex flex-col justify-between gap-3 group"
          >
            <div>
              <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border mb-2 ${item.badgeColor}`}>
                {item.tag}
              </span>
              <h4 className="text-sm font-semibold text-brand-charcoal group-hover:text-brand-orange transition-colors">
                {item.title}
              </h4>
              <p className="text-xs text-subtle mt-0.5">{item.desc}</p>
            </div>
            <div className="flex items-center text-xs font-semibold text-brand-orange-text gap-1 mt-1">
              <span>View inventory</span>
              <FiArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
