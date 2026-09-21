"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@/app/components/Icon";
import { FiBox, FiExternalLink, FiNavigation } from "react-icons/fi";

export const VendorshipSection = () => {
  return (
    <section className="w-full flex flex-col items-center gap-8 md:gap-10">
      {/* Centered Heading */}
      <div className="text-center max-w-2xl px-4">
        <span className="text-[#FF7A00] font-bold text-[16px] md:text-[18px] tracking-wider  block">
          Recommended Vendors{" "}
        </span>
        <p className="text-gray-800 text-sm md:text-base font-semibold mt-1.5">
          Verified Freezer Vendors You Can Trust For Consistent Quality,
          Performance, And Service
        </p>
      </div>

      {/* Two-Column Grid */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Card: Become Our Verified Vendor */}
        <div className="lg:col-span-5 bg-white border border-[#1C1C1C1A] rounded-2xl p-6 sm:p-8 md:p-10 flex flex-col justify-center gap-5 shadow-xs">
          <div className="inline-flex items-center gap-2 text-[#FF7A00] text-xs font-bold tracking-wider">
            <FiBox className="text-base" />
            <span>Vendorship</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
            Become Our Verified Vendor
          </h3>

          <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
            Partner with a clean-energy brand delivering reliable solar-powered
            cold storage.
          </p>

          <div className="pt-2">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-7 py-3 bg-[#FF7A00] hover:bg-[#E66E00] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md hover:shadow-lg active:scale-95 transition-all duration-200"
            >
              BECOME A VENDOR
            </Link>
          </div>
        </div>

        {/* Right Card: Location Map */}
        <div className="lg:col-span-7 bg-white border border-[#1C1C1C1A] rounded-2xl overflow-hidden shadow-xs relative min-h-75 sm:min-h-85">
          {/* Google Maps Embed */}
          <iframe
            title="Koolbuy Vendor Location"
            src="https://maps.google.com/maps?q=28a+Adeola+Raji+Ave,+Gbagada,+Lagos,+Nigeria&t=&z=15&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full min-h-80 lg:min-h-full border-0"
            loading="lazy"
            allowFullScreen
          />

          {/* Floating Location Card Overlay */}
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-xl p-3 sm:p-4 shadow-lg border border-gray-100 max-w-70 sm:max-w-xs z-10">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                  28a Adeola Raji Ave
                </h4>
                <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">
                  28a Adeola Raji Ave, Araromi, Lagos 105102, Lagos
                </p>
              </div>
              <div className="flex items-center gap-1 text-brand-blue shrink-0">
                <a
                  href="https://maps.google.com/?q=28a+Adeola+Raji+Ave,+Gbagada,+Lagos"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open in Google Maps"
                  className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                >
                  <FiExternalLink className="text-sm" />
                </a>
                <a
                  href="https://maps.google.com/?daddr=28a+Adeola+Raji+Ave,+Gbagada,+Lagos"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Get Directions"
                  className="p-1.5 bg-brand-blue text-white rounded-full hover:bg-brand-blue/90 shadow-sm transition-colors"
                >
                  <FiNavigation className="text-xs" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
