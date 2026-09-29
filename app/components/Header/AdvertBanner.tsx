"use client";

import React from "react";
import Link from "next/link";

export const AdvertBanner: React.FC = () => {
  const bannerItem = (
    <div className="inline-flex items-center gap-3 text-xs md:text-sm text-white/85 font-medium">
      <span className="text-mustard text-base leading-none">✦</span>
      <span>Join the Verified Buyer to Vendor AI-powered Marketplace for Africa.</span>
      <span className="bg-mustard text-ink text-[10px] md:text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full -rotate-2 group-hover:rotate-0 transition-transform">
        JOIN NOW
      </span>
    </div>
  );

  return (
    <div className="w-full bg-ink overflow-hidden py-2 select-none relative z-60 advert-banner-container">
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

