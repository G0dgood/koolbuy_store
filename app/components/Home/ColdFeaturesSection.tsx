"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";

const cards = [
  {
    id: "serve-it-cold",
    eyebrow: "serve it cold",
    title: "Koolboks cooling for ice-cold refreshment",
    image: "/images/koolboks/cold/yellow-cold-bg.png",
    textColor: "text-gray-900",
    eyebrowColor: "text-gray-800",
    buttonTextColor: "text-brand-orange-text",
    href: "/products?category=Single+Door+Chest+Freezers",
  },
  {
    id: "freeze-more",
    eyebrow: "freeze more",
    title: "Sell More Ice With Ice Maker Machine",
    image: "/images/koolboks/cold/black-cold-bg.png",
    textColor: "text-white",
    eyebrowColor: "text-gray-300",
    buttonTextColor: "text-brand-orange-text",
    href: "/products?category=Ice+Makers",
  },
  {
    id: "keep-it-fresh",
    eyebrow: "keep it fresh",
    title: "100% Meat Preservation with Koolbuy Product",
    image: "/images/koolboks/cold/blue-cold-bg.png",
    textColor: "text-white",
    eyebrowColor: "text-light-gray",
    buttonTextColor: "text-brand-orange-text",
    href: "/products?category=Cold+Room+Freezers",
  },
];

export const ColdFeaturesSection: React.FC = () => {
  return (
    <section className="w-full flex flex-col gap-6 md:gap-8">
      {/* Centered Heading */}
      <div className="text-center max-w-2xl mx-auto px-4">
        <h2 className="text-[24px] md:text-[36px] font-semibold text-brand-charcoal tracking-[-0.03em] leading-[1.08]">
          Start with Koolboks.
        </h2>
        <p className="mt-2 text-[17px] md:text-[19px] text-subtle">
          Own a refrigerator and grow your business.
        </p>
      </div>

      {/* Cards Grid */}
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
                href={card.href}
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
    </section>
  );
};
