"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion } from "framer-motion";

interface Partner {
  id: string;
  name: string;
  image: string;
  link: string;
}

const partners: Partner[] = [
  {
    id: "p1",
    name: "Skyrun",
    image: "/images/koolboks/partners/12.webp",
    link: "/products?search=Skyrun",
  },
  {
    id: "p2",
    name: "Scanfrost",
    image: "/images/koolboks/partners/2.webp",
    link: "/products?search=Scanfrost",
  },
  {
    id: "p3",
    name: "Samsung",
    image: "/images/koolboks/partners/7.webp",
    link: "/products?search=Samsung",
  },
  {
    id: "p4",
    name: "Restpoint",
    image: "/images/koolboks/partners/11.webp",
    link: "/products?search=Restpoint",
  },
  {
    id: "p5",
    name: "Nexus",
    image: "/images/koolboks/partners/6.webp",
    link: "/products?search=Nexus",
  },
  {
    id: "p6",
    name: "Haier Thermocool",
    image: "/images/koolboks/partners/5.webp",
    link: "/products?search=Thermocool",
  },
  {
    id: "p7",
    name: "Hisense",
    image: "/images/koolboks/partners/14.webp",
    link: "/products?search=Hisense",
  },
  {
    id: "p8",
    name: "Bruhm",
    image: "/images/koolboks/partners/3.webp",
    link: "/products?search=Bruhm",
  },
  {
    id: "p9",
    name: "Midea",
    image: "/images/koolboks/partners/13.webp",
    link: "/products?search=Midea",
  },
  {
    id: "p10",
    name: "LG",
    image: "/images/koolboks/partners/10.webp",
    link: "/products?search=LG",
  },
  {
    id: "p11",
    name: "Koolboks",
    image: "/images/koolboks/partners/9.webp",
    link: "/products?search=Koolboks",
  },
  {
    id: "p12",
    name: "Aucma",
    image: "/images/koolboks/partners/4.webp",
    link: "/products?search=Aucma",
  },
  {
    id: "p13",
    name: "Aeon",
    image: "/images/koolboks/partners/1.webp",
    link: "/products?search=Aeon",
  },
  {
    id: "p14",
    name: "Kenstar",
    image: "/images/koolboks/partners/8.webp",
    link: "/products?search=Kenstar",
  },
];

export const PartnersCarousel: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const scrollNext = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 15) {
        scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollRef.current.scrollBy({ left: 240, behavior: "smooth" });
      }
    }
  }, []);

  const scrollPrev = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth } = scrollRef.current;
      if (scrollLeft <= 15) {
        scrollRef.current.scrollTo({ left: scrollWidth, behavior: "smooth" });
      } else {
        scrollRef.current.scrollBy({ left: -240, behavior: "smooth" });
      }
    }
  }, []);

  // Auto-scroll interval
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      scrollNext();
    }, 2800);

    return () => clearInterval(interval);
  }, [isPaused, scrollNext]);

  return (
    <section
      className="w-full flex flex-col gap-4 md:gap-5 relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg md:text-xl font-bold tracking-wider text-gray-900">
          Meet Our Partners
        </h3>

        <Link
          href="/brands"
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
          aria-label="Previous partners"
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
        >
          <FiChevronLeft size={18} />
        </button>

        {/* Carousel Container */}
        <div
          ref={scrollRef}
          className="flex items-center gap-4 md:gap-6 overflow-x-auto scrollbar-none scroll-smooth py-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {partners.map((partner) => (
            <Link
              key={partner.id}
              href={partner.link}
              className="shrink-0 w-40 sm:w-48 md:w-56 h-20 sm:h-24 flex items-center justify-cente hover:border-gray-300 transition-all group"
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={partner.image}
                  alt={partner.name}
                  fill
                  className="object-contain filter grayscale-0 group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>
          ))}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={scrollNext}
          aria-label="Next partners"
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
        >
          <FiChevronRight size={18} />
        </button>
      </div>
    </section>
  );
};
