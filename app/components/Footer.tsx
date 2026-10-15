"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiMapPin, FiPhone, FiMail } from "react-icons/fi";
import { Icon } from "./Icon";
import { StoreButtons } from "./Other/Misc";
import { Newsletter } from "./Home/Newsletter";

// const QrCodeBox = ({ label }: { label: string }) => (
//   <div className="flex flex-col items-center gap-1.5">
//     <div className="w-16 h-16 bg-white border border-gray-200 rounded-lg p-1 shadow-xs flex items-center justify-center">
//       <svg
//         viewBox="0 0 100 100"
//         className="w-full h-full text-gray-900 fill-current"
//         xmlns="http://www.w3.org/2000/svg"
//       >
//         {/* Top-Left Corner Box */}
//         <rect x="5" y="5" width="30" height="30" rx="3" fill="currentColor" />
//         <rect x="10" y="10" width="20" height="20" rx="2" fill="white" />
//         <rect x="15" y="15" width="10" height="10" rx="1" fill="currentColor" />

//         {/* Top-Right Corner Box */}
//         <rect x="65" y="5" width="30" height="30" rx="3" fill="currentColor" />
//         <rect x="70" y="10" width="20" height="20" rx="2" fill="white" />
//         <rect x="75" y="15" width="10" height="10" rx="1" fill="currentColor" />

//         {/* Bottom-Left Corner Box */}
//         <rect x="5" y="65" width="30" height="30" rx="3" fill="currentColor" />
//         <rect x="10" y="70" width="20" height="20" rx="2" fill="white" />
//         <rect x="15" y="75" width="10" height="10" rx="1" fill="currentColor" />

//         {/* Data points */}
//         <rect x="42" y="10" width="6" height="6" fill="currentColor" />
//         <rect x="52" y="10" width="6" height="6" fill="currentColor" />
//         <rect x="42" y="22" width="6" height="6" fill="currentColor" />
//         <rect x="52" y="28" width="6" height="6" fill="currentColor" />
//         <rect x="10" y="42" width="6" height="6" fill="currentColor" />
//         <rect x="22" y="42" width="6" height="6" fill="currentColor" />
//         <rect x="28" y="52" width="6" height="6" fill="currentColor" />
//         <rect x="42" y="42" width="8" height="8" fill="currentColor" />
//         <rect x="54" y="42" width="6" height="6" fill="currentColor" />
//         <rect x="42" y="54" width="6" height="6" fill="currentColor" />
//         <rect x="54" y="54" width="8" height="8" fill="currentColor" />
//         <rect x="68" y="42" width="6" height="6" fill="currentColor" />
//         <rect x="80" y="42" width="8" height="8" fill="currentColor" />
//         <rect x="68" y="54" width="8" height="8" fill="currentColor" />
//         <rect x="82" y="54" width="6" height="6" fill="currentColor" />
//         <rect x="42" y="68" width="6" height="6" fill="currentColor" />
//         <rect x="52" y="68" width="8" height="8" fill="currentColor" />
//         <rect x="42" y="80" width="8" height="8" fill="currentColor" />
//         <rect x="54" y="80" width="6" height="6" fill="currentColor" />
//         <rect x="68" y="68" width="6" height="6" fill="currentColor" />
//         <rect x="80" y="72" width="8" height="8" fill="currentColor" />
//         <rect x="72" y="84" width="6" height="6" fill="currentColor" />
//         <rect x="84" y="84" width="6" height="6" fill="currentColor" />
//       </svg>
//     </div>
//     <span className="text-[10px] text-gray-500 font-medium">{label}</span>
//   </div>
// );

const SOCIALS = ["facebook", "twitter", "linkedin", "instagram", "youtube"];

/* Footer in an Apple-store style: light grey, small 12px text, sentence-case
   column titles, hairline separators and a quiet bottom row. */
const Footer = () => {
  return (
    <>
      <Newsletter />
      <footer className="w-full bg-off-white text-[12px] text-subtle">
        <div className="max-w-360 mx-auto px-6 md:px-10 lg:px-16 pt-10 pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-8 border-b border-black/[0.08]">
            {/* Brand */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <img src="/images/koolboks/koolbuy_logo.webp" alt="KoolBuy" className="h-9 w-auto object-contain self-start" />
              <p className="leading-relaxed max-w-80">
                Nigeria&apos;s solar refrigeration and clean-tech marketplace: power around the clock, verified
                warranties and flexible payment plans.
              </p>
              <div className="flex items-center gap-2">
                {SOCIALS.map((name) => (
                  <span
                    key={name}
                    aria-label={name}
                    className="w-8 h-8 rounded-full bg-black/[0.05] flex items-center justify-center text-gray-600 hover:bg-brand-charcoal hover:text-white transition-colors cursor-pointer"
                  >
                    <Icon name={`social/${name}`} size="sm" />
                  </span>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="lg:col-span-3 flex flex-col gap-2.5">
              <h4 className="text-[12px] font-semibold text-brand-charcoal">Contact us</h4>
              <p className="flex items-start gap-2 leading-snug">
                <FiMapPin className="shrink-0 mt-0.5" />
                28A Adeola Raji Avenue, Gbagada, Lagos, Nigeria
              </p>
              <a href="tel:+2349128413025" className="flex items-center gap-2 hover:text-brand-charcoal hover:underline">
                <FiPhone className="shrink-0" />
                +234 912 841 3025
              </a>
              <a href="mailto:info@koolbuystore.com" className="flex items-center gap-2 hover:text-brand-charcoal hover:underline">
                <FiMail className="shrink-0" />
                info@koolbuystore.com
              </a>
            </div>

            {/* Links */}
            <div className="lg:col-span-2 flex flex-col gap-2.5">
              <h4 className="text-[12px] font-semibold text-brand-charcoal">Quick links</h4>
              <Link href="/register" className="hover:text-brand-charcoal hover:underline">Vendor registration</Link>
              <Link href="/help" className="hover:text-brand-charcoal hover:underline">Privacy policy</Link>
              <Link href="/help/payment" className="hover:text-brand-charcoal hover:underline">BNPL terms &amp; conditions</Link>
            </div>

            {/* Payments + app */}
            <div className="lg:col-span-3 flex flex-col gap-2.5">
              <h4 className="text-[12px] font-semibold text-brand-charcoal">We accept</h4>
              <div className="flex items-center gap-2">
                {[
                  ["visa", "Visa"],
                  ["mastercard", "Mastercard"],
                  ["amex", "American Express"],
                ].map(([key, label]) => (
                  <Image
                    key={key}
                    src={`/payment/${key}.png`}
                    alt={label}
                    width={31}
                    height={20}
                    className="object-contain"
                  />
                ))}
              </div>
              <h4 className="mt-3 text-[12px] font-semibold text-brand-charcoal">Get the app</h4>
              <StoreButtons orientation="vertical" />
            </div>
          </div>

          {/* Bottom row */}
          <div className="pt-5 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
            <p>Copyright © {new Date().getFullYear()} KoolBuy Store. All rights reserved.</p>
            <p>Nigeria · English</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export { Footer };
