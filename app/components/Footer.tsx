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

const Footer = () => {
  return (
    <>
      <Newsletter />
      <footer className="w-full bg-white border-t border-gray-200 pt-16">
        <div className="max-w-360 mx-auto px-6 md:px-10 lg:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center mb-4">
                <div className="h-10 overflow-hidden flex items-center">
                  <img
                    src="/images/koolboks/koolbuy_logo.webp"
                    alt="Koolbuy Store"
                    className="h-full w-auto object-contain"
                  />
                </div>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed max-w-70">
                Nigeria&apos;s leading solar refrigeration and clean-tech
                marketplace. 24/7 power, verified warranties, and flexible
                payment plans.
              </p>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <div className="w-8 h-8 rounded-full bg-[#BDC1C7] flex items-center justify-center text-white cursor-pointer hover:bg-[#FF7A00] transition-colors">
                <Icon name="social/facebook" size="sm" />
              </div>
              <div className="w-8 h-8 rounded-full bg-[#BDC1C7] flex items-center justify-center text-white cursor-pointer hover:bg-[#FF7A00] transition-colors">
                <Icon name="social/twitter" size="sm" />
              </div>
              <div className="w-8 h-8 rounded-full bg-[#BDC1C7] flex items-center justify-center text-white cursor-pointer hover:bg-[#FF7A00] transition-colors">
                <Icon name="social/linkedin" size="sm" />
              </div>
              <div className="w-8 h-8 rounded-full bg-[#BDC1C7] flex items-center justify-center text-white cursor-pointer hover:bg-[#FF7A00] transition-colors">
                <Icon name="social/instagram" size="sm" />
              </div>
              <div className="w-8 h-8 rounded-full bg-[#BDC1C7] flex items-center justify-center text-white cursor-pointer hover:bg-[#FF7A00] transition-colors">
                <Icon name="social/youtube" size="sm" />
              </div>
            </div>
          </div>

          {/* Contact Us Column */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h4 className="font-bold text-gray-900 text-sm tracking-wider uppercase">
              CONTACT US
            </h4>
            <div className="flex flex-col gap-3 text-sm text-gray-600 mt-1">
              <div className="flex items-start gap-2.5">
                <FiMapPin className="text-[#FF7A00] text-base shrink-0 mt-0.5" />
                <span className="leading-snug">
                  28A Adeola Raji Avenue, Gbagada, Lagos, Nigeria
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <FiPhone className="text-[#FF7A00] text-base shrink-0" />
                <a
                  href="tel:+2349128413025"
                  className="hover:text-[#FF7A00] transition-colors"
                >
                  +2349128413025
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <FiMail className="text-[#FF7A00] text-base shrink-0" />
                <a
                  href="mailto:info@koolbuystore.com"
                  className="hover:text-[#FF7A00] transition-colors"
                >
                  info@koolbuystore.com
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h4 className="font-bold text-gray-900 text-sm tracking-wider uppercase">
              QUICK LINKS
            </h4>
            <div className="flex flex-col gap-2.5 text-sm text-gray-600 mt-1">
              <Link
                href="/register"
                className="hover:text-[#FF7A00] transition-colors"
              >
                Vendor Registration
              </Link>
              <Link
                href="/help"
                className="hover:text-[#FF7A00] transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/help/payment"
                className="hover:text-[#FF7A00] transition-colors"
              >
                Term & Conditons BNPL
              </Link>
            </div>
          </div>

          {/* Payment Methods Column */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h4 className="font-bold text-gray-900 text-sm tracking-wider uppercase">
              PAYMENT METHODS
            </h4>
            <div className="flex flex-col gap-2 text-xs font-semibold text-gray-700 mt-1 uppercase tracking-wide">
              <span>VISA DISCOVER</span>
              <span>AMERICAN EXPRESS</span>
              <span>MASTER CARD</span>
            </div>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Image
                src="/payment/Payment=payment, Pay-type=visa.png"
                alt="Visa"
                width={32}
                height={20}
                className="h-5 w-auto object-contain"
              />
              <Image
                src="/payment/Payment=payment, Pay-type=mastercard.png"
                alt="Mastercard"
                width={32}
                height={20}
                className="h-5 w-auto object-contain"
              />
              <Image
                src="/payment/Payment=payment, Pay-type=amex.png"
                alt="Amex"
                width={32}
                height={20}
                className="h-5 w-auto object-contain"
              />
            </div>
          </div>

          {/* Find Our App On Mobile Column */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h4 className="font-bold text-gray-900 text-sm tracking-wider uppercase">
              FIND OUR APP ON MOBILE
            </h4>
            {/* <div className="flex items-center gap-3 mt-1">
              <QrCodeBox label="iOS App" />
              <QrCodeBox label="Android" />
            </div> */}
            <div className="mt-2">
              <StoreButtons orientation="vertical" />
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="w-full bg-gray-100 py-6 border-t border-gray-200">
          <div className="max-w-360 mx-auto px-6 md:px-10 lg:px-16 flex items-center justify-between text-sm text-gray-500">
            <p>
              © {new Date().getFullYear()} Koolbuy Store. All rights reserved.
            </p>
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-5 h-4 bg-gray-200 rounded-sm"></div>
              <span>English</span>
              <Icon name="expand_less" size="xs" />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export { Footer };
