"use client";

import React from "react";
import Link from "next/link";
import { FiBox, FiExternalLink, FiNavigation } from "react-icons/fi";

export const VendorshipSection = () => {
  return (
    <section className="w-full flex flex-col items-center gap-8 md:gap-10">
      {/* Centered Heading */}
      <div className="text-center max-w-2xl px-4">
        <h2 className="text-[24px] md:text-[36px] font-semibold text-brand-charcoal tracking-[-0.03em] leading-[1.08]">
          Sell with KoolBuy.
        </h2>
        <p className="mt-2 text-[17px] md:text-[19px] text-subtle">
          Verified freezer vendors customers trust for quality, performance and service.
        </p>
      </div>

      {/* Two-Column Grid */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4 items-stretch">
        {/* Left Card: Become Our Verified Vendor */}
        <div className="lg:col-span-5 bg-white rounded-tile md:rounded-hero p-8 sm:p-10 md:p-12 flex flex-col justify-center gap-4">
          <div className="inline-flex items-center gap-2 text-brand-orange-text text-[13px] font-semibold">
            <FiBox className="text-base" />
            <span>Vendorship</span>
          </div>

          <h3 className="text-[28px] sm:text-[36px] font-semibold text-brand-charcoal tracking-[-0.025em] leading-[1.1]">
            Become a verified vendor.
          </h3>

          <p className="text-subtle text-[16px] sm:text-[17px] leading-relaxed">
            Partner with a clean-energy brand delivering reliable solar-powered
            cold storage.
          </p>

          <div className="pt-2">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-6 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-white text-[14px] font-medium rounded-full transition-colors"
            >
              Become a vendor
            </Link>
          </div>
        </div>

        {/* Right Card: Location Map */}
        <div className="lg:col-span-7 bg-white rounded-tile md:rounded-hero overflow-hidden relative min-h-80 sm:min-h-85">
          {/* Google Maps Embed. Pulled up 140px so Google's built-in address card
              (top-left of the embed) is clipped off and only our card shows. */}
          <iframe
            title="Koolbuy Vendor Location"
            src="https://maps.google.com/maps?q=28a+Adeola+Raji+Ave,+Gbagada,+Lagos,+Nigeria&t=&z=15&ie=UTF8&iwloc=&output=embed"
            className="absolute inset-x-0 bottom-0 w-full h-[calc(100%+140px)] border-0"
            loading="lazy"
            allowFullScreen
          />

          {/* Floating Location Card Overlay */}
          <div className="absolute top-4 left-4 bg-white/85 backdrop-blur-xl rounded-tile p-3 sm:p-4 shadow-float max-w-70 sm:max-w-xs z-10">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-[13px] sm:text-sm font-semibold text-brand-charcoal">
                  28a Adeola Raji Ave
                </h4>
                <p className="text-[11px] text-faint mt-0.5 leading-tight">
                  28a Adeola Raji Ave, Araromi, Lagos 105102, Lagos
                </p>
              </div>
              <div className="flex items-center gap-1 text-brand-orange-text shrink-0">
                <a
                  href="https://maps.google.com/?q=28a+Adeola+Raji+Ave,+Gbagada,+Lagos"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open in Google Maps"
                  className="p-1.5 hover:bg-black/[0.06] rounded-full transition-colors text-subtle"
                >
                  <FiExternalLink className="text-sm" />
                </a>
                <a
                  href="https://maps.google.com/?daddr=28a+Adeola+Raji+Ave,+Gbagada,+Lagos"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Get Directions"
                  className="p-1.5 bg-brand-charcoal text-white rounded-full hover:bg-brand-charcoal/90 transition-colors"
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
