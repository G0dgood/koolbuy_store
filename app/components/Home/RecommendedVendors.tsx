"use client";

import { StoreSectionHeader } from "./StoreUi";
import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion } from "framer-motion";

interface Vendor {
  id: string;
  name: string;
  image: string;
  link: string;
}

const vendors: Vendor[] = [
  {
    id: "v1",
    name: "Koolbuy - Lighthouse Electronics",
    image: "/images/koolboks/vendors/12.webp",
    link: "/products?vendor=lighthouse",
  },
  {
    id: "v2",
    name: "Koolbuy - Adobe Electronics",
    image: "/images/koolboks/vendors/13.webp",
    link: "/products?vendor=biizinilah",
  },
  {
    id: "v3",
    name: "Koolbuy - Modus Ideal Electronics",
    image: "/images/koolboks/vendors/14.webp",
    link: "/products?vendor=modus",
  },
  {
    id: "v4",
    name: "Koolbuy - Don Vic LTD",
    image: "/images/koolboks/vendors/17.webp",
    link: "/products?vendor=donvic",
  },
  {
    id: "v5",
    name: "Koolbuy - Cash N Carry (Allen)",
    image: "/images/koolboks/vendors/11.webp",
    link: "/products?vendor=cashncarry",
  },
  {
    id: "v6",
    name: "Koolbuy - Ajah Store",
    image: "/images/koolboks/vendors/15.webp",
    link: "/products?vendor=ajah",
  },
  {
    id: "v7",
    name: "Koolbuy - Albertina Nig LTD",
    image: "/images/koolboks/vendors/16.webp",
    link: "/products?vendor=albertina",
  },
];

export const RecommendedVendors: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const scrollNext = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      // If reached near the end, loop back to the start
      if (scrollLeft + clientWidth >= scrollWidth - 15) {
        scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollRef.current.scrollBy({ left: 280, behavior: "smooth" });
      }
    }
  }, []);

  const scrollPrev = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth } = scrollRef.current;
      if (scrollLeft <= 15) {
        scrollRef.current.scrollTo({ left: scrollWidth, behavior: "smooth" });
      } else {
        scrollRef.current.scrollBy({ left: -280, behavior: "smooth" });
      }
    }
  }, []);

  // Auto-movement interval timer
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      scrollNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused, scrollNext]);

  return (
    <section
      className="w-full flex flex-col gap-5 relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <StoreSectionHeader title="Recommended vendors" subtitle="Verified sellers with great service." href="/products" />

      {/* Relative container with arrows */}
      <div className="relative group/carousel">
        {/* Left Arrow Button */}
        <button
          onClick={scrollPrev}
          aria-label="Previous vendors"
          className="absolute -left-2 md:-left-4 top-[40%] -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/85 backdrop-blur-xl shadow-[0_4px_16px_rgba(0,0,0,0.12)] flex items-center justify-center text-brand-charcoal hover:bg-white transition-all cursor-pointer opacity-0 group-hover/carousel:opacity-100 focus-visible:opacity-100"
        >
          <FiChevronLeft size={18} />
        </button>

        {/* Carousel Container */}
        <div
          ref={scrollRef}
          className="flex items-stretch gap-3 md:gap-4 overflow-x-auto scrollbar-none scroll-smooth py-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {vendors.map((vendor) => (
            <div
              key={vendor.id}
              className="w-60 sm:w-65 md:w-[calc(25%-12px)] shrink-0 flex flex-col"
            >
              <Link href={vendor.link} className="flex-1 flex flex-col">
                <motion.div
                  className="bg-white rounded-[22px] overflow-hidden flex flex-col h-full transition-shadow duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] group cursor-pointer"
                >
                  {/* Vendor Image Banner */}
                  <div className="w-full aspect-square relative overflow-hidden bg-off-white">
                    <Image
                      src={vendor.image}
                      alt={vendor.name}
                      fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  </div>

                  {/* Bottom Info */}
                  <div className="px-4 pt-3 pb-4 flex flex-col gap-0.5">
                    <h4 className="text-[14px] font-semibold text-brand-charcoal line-clamp-1">
                      {vendor.name}
                    </h4>
                    <span className="text-[13px] font-medium text-brand-orange-text group-hover:underline">
                      Shop now ›
                    </span>
                  </div>
                </motion.div>
              </Link>
            </div>
          ))}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={scrollNext}
          aria-label="Next vendors"
          className="absolute -right-2 md:-right-4 top-[40%] -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/85 backdrop-blur-xl shadow-[0_4px_16px_rgba(0,0,0,0.12)] flex items-center justify-center text-brand-charcoal hover:bg-white transition-all cursor-pointer opacity-0 group-hover/carousel:opacity-100 focus-visible:opacity-100"
        >
          <FiChevronRight size={18} />
        </button>
      </div>
    </section>
  );
};
