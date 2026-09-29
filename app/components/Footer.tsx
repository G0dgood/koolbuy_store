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
//     <div className="w-16 h-16 bg-white border border-gray-100 rounded-3xl shadow-sm p-1 shadow-xs flex items-center justify-center">
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

const footerHeading = "text-[12px] font-semibold text-ink mb-2";
const footerLink = "text-[12px] text-gray-600 hover:text-ink hover:underline leading-[2.2]";

// Apple-style footer: parchment, dense 12px link columns, hairline dividers.
const Footer = () => {
  return (
    <>
      <Newsletter />
      <footer className="w-full bg-cream border-t border-hairline pt-10 md:pt-12">
        <div className="max-w-245 mx-auto px-6 md:px-8">
          {/* Brand + tagline */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-hairline">
            <div className="flex items-center gap-4">
              <img
                src="/images/koolboks/koolbuy_logo.webp"
                alt="Koolbuy Store"
                className="h-8 w-auto object-contain"
              />
              <p className="text-[12px] text-gray-600 max-w-md leading-[1.5]">
                Nigeria&apos;s solar refrigeration and clean-tech marketplace.
                24/7 power, verified warranties and flexible payment plans.
              </p>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              {["facebook", "twitter", "linkedin", "instagram", "youtube"].map((n) => (
                <span
                  key={n}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:text-ink hover:bg-black/5 cursor-pointer transition-colors"
                >
                  <Icon name={`social/${n}`} size="sm" />
                </span>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 py-8">
            <div className="flex flex-col">
              <h4 className={footerHeading}>Contact Us</h4>
              <span className="text-[12px] text-gray-600 leading-[1.6] mb-1 flex items-start gap-1.5">
                <FiMapPin className="shrink-0 mt-0.5" />
                28A Adeola Raji Avenue, Gbagada, Lagos, Nigeria
              </span>
              <a href="tel:+2349128413025" className={`${footerLink} flex items-center gap-1.5`}>
                <FiPhone className="shrink-0" /> +234 912 841 3025
              </a>
              <a href="mailto:info@koolbuystore.com" className={`${footerLink} flex items-center gap-1.5`}>
                <FiMail className="shrink-0" /> info@koolbuystore.com
              </a>
            </div>

            <div className="flex flex-col">
              <h4 className={footerHeading}>Quick Links</h4>
              <Link href="/register" className={footerLink}>Vendor Registration</Link>
              <Link href="/help" className={footerLink}>Privacy Policy</Link>
              <Link href="/help/payment" className={footerLink}>Terms &amp; Conditions (BNPL)</Link>
            </div>

            <div className="flex flex-col">
              <h4 className={footerHeading}>Payment Methods</h4>
              <span className="text-[12px] text-gray-600 leading-[2.2]">Visa, Discover</span>
              <span className="text-[12px] text-gray-600 leading-[2.2]">American Express</span>
              <span className="text-[12px] text-gray-600 leading-[2.2]">Mastercard</span>
              <div className="flex items-center gap-2 mt-2">
                <Image src="/payment/visa.png" alt="Visa" width={32} height={20} className="h-5 w-auto object-contain" />
                <Image src="/payment/mastercard.png" alt="Mastercard" width={32} height={20} className="h-5 w-auto object-contain" />
                <Image src="/payment/amex.png" alt="Amex" width={32} height={20} className="h-5 w-auto object-contain" />
              </div>
            </div>

            <div className="flex flex-col">
              <h4 className={footerHeading}>Get the App</h4>
              <div className="mt-1">
                <StoreButtons orientation="vertical" />
              </div>
            </div>
          </div>

          {/* Legal row */}
          <div className="py-5 border-t border-hairline flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-[12px] text-gray-500">
            <p>Copyright © {new Date().getFullYear()} Koolbuy Store. All rights reserved.</p>
            <div className="flex items-center gap-1.5 text-ink cursor-pointer hover:underline">
              <span>Nigeria</span>
              <span className="text-gray-400">·</span>
              <span>English</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export { Footer };
