"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";

const cards = [
  {
    id: "serve-it-cold",
    eyebrow: "SERVE IT COLD",
    title: "Koolboks cooling for ice-cold refreshment",
    image: "/images/koolboks/cold/yellow-cold-bg.png",
    textColor: "text-gray-900",
    eyebrowColor: "text-gray-800",
    buttonTextColor: "text-brand-orange",
    href: "/products?category=Single+Door+Chest+Freezers",
  },
  {
    id: "freeze-more",
    eyebrow: "FREEZE MORE",
    title: "Sell More Ice With Ice Maker Machine",
    image: "/images/koolboks/cold/black-cold-bg.png",
    textColor: "text-white",
    eyebrowColor: "text-gray-300",
    buttonTextColor: "text-brand-orange",
    href: "/products?category=Ice+Makers",
  },
  {
    id: "keep-it-fresh",
    eyebrow: "KEEP IT FRESH",
    title: "100% Meat Preservation with Koolbuy Product",
    image: "/images/koolboks/cold/blue-cold-bg.png",
    textColor: "text-white",
    eyebrowColor: "text-blue-100",
    buttonTextColor: "text-brand-orange",
    href: "/products?category=Cold+Room+Freezers",
  },
];

export const ColdFeaturesSection: React.FC = () => {
  return (
    <section className="w-full flex flex-col gap-6 md:gap-8">
      {/* Centered Heading */}
      <div className="text-center max-w-2xl mx-auto px-4">
        <span className="kb-sticker mb-3">
          Start With Koolboks Now!
        </span>
        <p className="kb-title text-2xl md:text-[2rem] mt-1">
          Own A Refrigerator And Grow Your Business
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
        {cards.map((card, idx) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: idx * 0.15 }}
            className="group relative rounded-[1.75rem] md:rounded-[2rem] overflow-hidden shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-lift)] hover:-translate-y-1 transition-all duration-300 min-h-105 sm:min-h-115 flex flex-col justify-between"
          >
            {/* Background Image */}
            <Image
              src={card.image}
              alt={card.title}
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              sizes="(max-width: 768px) 100vw, 33vw"
              priority={false}
            />

            {/* Top Text Content Overlay */}
            <div className="relative z-10 pt-8 sm:pt-10 px-6 sm:px-8 text-center flex flex-col items-center">
              <span
                className={`kb-sticker mb-3 ${idx === 0 ? "kb-sticker-ink" : idx === 1 ? "" : "kb-sticker-orange"}`}
              >
                {card.eyebrow}
              </span>
              <h3
                className={`text-xl sm:text-2xl font-extrabold tracking-tight leading-[1.15] max-w-72 mb-5 sm:mb-6 ${card.textColor}`}
              >
                {card.title}
              </h3>

              <Link
                href={card.href}
                className="inline-flex items-center gap-2 bg-white px-6 py-2.5 rounded-full shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-lift)] active:scale-95 transition-all text-xs font-extrabold uppercase tracking-wider group-hover:gap-3"
              >
                <span className="text-ink">Shop now</span>
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
