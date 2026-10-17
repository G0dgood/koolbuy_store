"use client";

import { StoreSectionHeader } from "./StoreUi";
import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion } from "framer-motion";
import { useGetVendorsQuery } from "@/lib/store";
import { apiErrorMessage } from "@/lib/store/base-api";
import { EmptyState } from "@/app/components/EmptyState";

interface VendorDisplay {
  id: string;
  name: string;
  image: string | null;
  link: string;
}

export const RecommendedVendors: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const { data: vendorsData, isLoading, isError, error, refetch } = useGetVendorsQuery({ page_size: 10 });

  const vendors: VendorDisplay[] = (vendorsData?.items ?? []).map((item) => ({
    id: item.id,
    name: item.name,
    image: item.cover_image_url || item.image_url || null,
    link: `/products?vendor=${encodeURIComponent(item.id)}`,
  }));
  const hasVendors = vendors.length > 0;

  const scrollNext = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
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
    if (isPaused || !hasVendors) return;

    const interval = setInterval(() => {
      scrollNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused, hasVendors, scrollNext]);

  return (
    <section
      className="w-full flex flex-col gap-5 relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <StoreSectionHeader
        title="Recommended vendors"
        subtitle="Verified sellers with great cooling service."
        href={hasVendors ? "/products" : undefined}
      />

      {isLoading ? (
        <div aria-hidden="true" className="flex gap-3 md:gap-4 overflow-hidden py-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-60 sm:w-65 md:w-[calc(25%-12px)] shrink-0 rounded-tile bg-white border border-light-gray overflow-hidden">
              <div className="w-full aspect-square bg-black/[0.04] animate-pulse" />
              <div className="px-4 pt-3 pb-4 flex flex-col gap-2">
                <div className="h-3.5 w-3/4 rounded-full bg-black/[0.04] animate-pulse" />
                <div className="h-3 w-1/3 rounded-full bg-black/[0.04] animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div role="alert" className="bg-white rounded-tile border border-light-gray py-10 px-6 flex flex-col items-center gap-3 text-center">
          <p className="text-[14px] text-subtle">{apiErrorMessage(error, "We couldn't load vendors.")}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center justify-center h-9 px-4 rounded-full bg-black/[0.04] text-brand-charcoal text-[13px] font-medium hover:bg-black/[0.08] transition-colors"
          >
            Try again
          </button>
        </div>
      ) : !hasVendors ? (
        <EmptyState
          variant="card"
          illustration="vendors"
          title="No vendors yet"
          description="Vendors will appear here once they're verified."
        />
      ) : (
      /* Relative container with arrows */
      <div className="relative group/carousel">
        {/* Left Arrow Button */}
        <button
          onClick={scrollPrev}
          aria-label="Previous vendors"
          className="absolute -left-2 md:-left-4 top-[40%] -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/85 backdrop-blur-xl shadow-float flex items-center justify-center text-brand-charcoal hover:bg-white transition-all cursor-pointer opacity-0 group-hover/carousel:opacity-100 focus-visible:opacity-100"
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
                  className="bg-white rounded-tile border border-light-gray overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-lift group cursor-pointer"
                >
                  {/* Vendor Image Banner */}
                  <div className="w-full aspect-square relative overflow-hidden bg-off-white">
                    {vendor.image ? (
                      <Image
                        src={vendor.image}
                        alt={vendor.name}
                        fill
                        unoptimized={vendor.image.startsWith("http")}
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      />
                    ) : (
                      // No store photo yet: show the vendor's initial
                      <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
                        <span className="w-20 h-20 rounded-full bg-white border border-light-gray flex items-center justify-center text-[28px] font-semibold text-brand-charcoal">
                          {vendor.name.trim().charAt(0).toUpperCase() || "?"}
                        </span>
                      </div>
                    )}
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
          className="absolute -right-2 md:-right-4 top-[40%] -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/85 backdrop-blur-xl shadow-float flex items-center justify-center text-brand-charcoal hover:bg-white transition-all cursor-pointer opacity-0 group-hover/carousel:opacity-100 focus-visible:opacity-100"
        >
          <FiChevronRight size={18} />
        </button>
      </div>
      )}
    </section>
  );
};
