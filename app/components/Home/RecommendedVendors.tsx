"use client";

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg md:text-xl font-bold tracking-wider text-gray-900">
          Recommended Vendors
        </h3>

        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs md:text-sm font-semibold text-gray-600 hover:text-brand-orange group transition-colors"
        >
          <span>See All</span>
          <span className="w-5 h-5 rounded-full bg-[#FF7A00] text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
            <FiChevronRight size={14} />
          </span>
        </Link>
      </div>

      {/* Relative container with arrows */}
      <div className="relative group/carousel">
        {/* Left Arrow Button */}
        <button
          onClick={scrollPrev}
          aria-label="Previous vendors"
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
        >
          <FiChevronLeft size={18} />
        </button>

        {/* Carousel Container */}
        <div
          ref={scrollRef}
          className="flex items-stretch gap-4 md:gap-5 overflow-x-auto scrollbar-none scroll-smooth py-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {vendors.map((vendor) => (
            <div
              key={vendor.id}
              className="w-60 sm:w-65 md:w-[calc(25%-15px)] shrink-0 flex flex-col"
            >
              <Link href={vendor.link} className="flex-1 flex flex-col">
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="bg-white border border-[#1C1C1C1A] rounded-xl overflow-hidden flex flex-col h-full hover:shadow-md transition-all group cursor-pointer"
                >
                  {/* Vendor Image Banner */}
                  <div className="w-full aspect-square relative overflow-hidden bg-[#FF7A00]">
                    <Image
                      src={vendor.image}
                      alt={vendor.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Bottom Info */}
                  <div className="p-4 flex flex-col items-center text-center gap-1.5 bg-white border-t border-gray-100">
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-brand-orange transition-colors">
                      {vendor.name}
                    </h4>
                    <span className="text-[11px] sm:text-xs font-extrabold text-[#E91E63] tracking-wider uppercase hover:underline inline-flex items-center gap-1">
                      SHOP NOW
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
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
        >
          <FiChevronRight size={18} />
        </button>
      </div>
    </section>
  );
};
