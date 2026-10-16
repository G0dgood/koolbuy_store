"use client";

import React from "react";
import Link from "next/link";

/* Announcement strip under the header: a light grey line with several
   different messages scrolling past (pauses on hover; still for people who
   prefer reduced motion). Each message has an orange "… ›" link. */

const MESSAGES = [
  {
    text: "Join the verified buyer-to-vendor marketplace for Africa.",
    cta: "Join now",
    href: "https://kool-konnect-frontend.vercel.app/",
    external: true,
  },
  { text: "Get a freezer for as low as ₦20,000 per month.", cta: "Shop now", href: "/products" },
  { text: "Verified warranties on solar freezers and batteries.", cta: "Learn more", href: "/help" },
  { text: "Flexible payment plans: pay small small.", cta: "See plans", href: "/help/payment" },
  { text: "Become a verified vendor and sell across Africa.", cta: "Start selling", href: "/register" },
];

function Message({ m }: { m: (typeof MESSAGES)[number] }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-8 md:px-12 text-[12px] text-subtle whitespace-nowrap">
      {m.text}
      <Link
        href={m.href}
        {...(m.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="text-brand-orange-text font-medium hover:underline"
      >
        {m.cta} ›
      </Link>
      <span aria-hidden className="ml-8 md:ml-12 w-1 h-1 rounded-full bg-black/20" />
    </span>
  );
}

export const AdvertBanner: React.FC = () => (
  <div className="w-full bg-black/[0.03] border-t border-black/[0.04] relative z-10 overflow-hidden advert-banner-container">
    {/* Two identical runs side by side; the strip slides by one run and loops seamlessly. */}
    <div className="advert-marquee py-2" role="marquee" aria-label="Announcements">
      {[0, 1].map((run) => (
        <div key={run} className="flex items-center shrink-0" aria-hidden={run === 1}>
          {MESSAGES.map((m) => (
            <Message key={`${run}-${m.cta}`} m={m} />
          ))}
        </div>
      ))}
    </div>
  </div>
);
