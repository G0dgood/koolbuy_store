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
        <span className="kb-sticker mb-3">
          Recommended Vendors{" "}
        </span>
        <p className="kb-title text-[28px] md:text-[40px] leading-[1.1] tracking-[-0.02em]">
          Verified Freezer Vendors You Can Trust For Consistent Quality,
          Performance, And Service
        </p>
      </div>

      {/* Two-Column Grid */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Card: Become Our Verified Vendor */}
        <div className="lg:col-span-5 relative overflow-hidden bg-tile rounded-2xl p-8 sm:p-10 md:p-12 flex flex-col justify-center gap-4">
          <div className="inline-flex items-center gap-2 self-start text-[14px] font-semibold text-white/60">
            <FiBox className="text-base" />
            <span>Vendorship</span>
          </div>

          <h3 className="relative text-[32px] sm:text-[40px] font-semibold text-white tracking-[-0.02em] leading-[1.1]">
            Become Our Verified Vendor
          </h3>

          <p className="relative text-[#cccccc] text-[17px] sm:text-[19px] leading-[1.4] max-w-sm">
            Partner with a clean-energy brand delivering reliable solar-powered
            cold storage.
          </p>

          <div className="pt-2 relative">
            <Link
              href="/register"
              className="kb-btn kb-btn-primary px-[22px] py-[11px] text-[17px]"
            >
              Become a vendor
            </Link>
          </div>
        </div>

        {/* Right Card: Location Map */}
        <div className="lg:col-span-7 bg-white border border-hairline rounded-2xl overflow-hidden relative min-h-75 sm:min-h-85">
          {/* Google Maps Embed */}
          <iframe
            title="Koolbuy Vendor Location"
            src="https://maps.google.com/maps?q=28a+Adeola+Raji+Ave,+Gbagada,+Lagos,+Nigeria&t=&z=15&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full min-h-80 lg:min-h-full border-0"
            loading="lazy"
            allowFullScreen
          />

          {/* Floating Location Card Overlay */}
          <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-xl backdrop-saturate-[1.8] rounded-xl p-3 sm:p-4 shadow-lg border border-gray-100 max-w-70 sm:max-w-xs z-10">
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
                  className="p-1.5 bg-action text-white rounded-full hover:bg-action-hover transition-colors"
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
