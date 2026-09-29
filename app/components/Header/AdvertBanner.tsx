"use client";

import React from "react";
import Link from "next/link";

export const AdvertBanner: React.FC = () => {
  const bannerItem = (
    <div className="inline-flex items-center gap-2 text-xs text-white/80">
      <span>Join the Verified Buyer to Vendor AI-powered Marketplace for Africa.</span>
      <span className="text-action-on-dark group-hover:underline">
        Join now ›
      </span>
    </div>
  );

  return (
    <div className="w-full bg-black overflow-hidden py-2.5 select-none relative z-60 advert-banner-container">
      <Link
        href="https://kool-konnect-frontend.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full group focus:outline-none cursor-pointer"
      >
        <div className="flex whitespace-nowrap overflow-hidden">
          <div className="advert-marquee flex items-center shrink-0 group-hover:[animation-play-state:paused]">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="flex items-center px-8 md:px-14 shrink-0">
                {bannerItem}
              </div>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
};

