"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronDown, FiArrowRight } from "react-icons/fi";

interface MegaMenuColumn {
  title: string;
  items: {
    label: string;
    href: string;
    badge?: string;
  }[];
}

interface MegaMenuData {
  [key: string]: {
    columns: MegaMenuColumn[];
    bottomBanner?: {
      title: string;
      desc: string;
      cta: string;
      href: string;
    };
  };
}

const megaMenuContent: MegaMenuData = {
  categories: {
    columns: [
      {
        title: "CHEST FREEZERS",
        items: [
          {
            label: "All Chest Freezers",
            href: "/products?category=Single+Door+Chest+Freezers",
          },
          {
            label: "Single Door Chest Freezers",
            href: "/products?category=Single+Door+Chest+Freezers",
          },
          {
            label: "Double Door Chest Freezers",
            href: "/products?category=Double+Door+Chest+Freezers",
          },
          {
            label: "Commercial Deep Freezers",
            href: "/products?category=Cold+Room+Freezers",
          },
          {
            label: "Hybrid Solar Freezers",
            href: "/products?category=single-door",
          },
          {
            label: "Refurbished Freezers",
            href: "/products?sort=refurbished",
            badge: "HOT",
          },
        ],
      },
      {
        title: "CHILLERS & COOLERS",
        items: [
          { label: "All Chillers", href: "/products?category=Chiller" },
          { label: "Single Door Chillers", href: "/products?category=Chiller" },
          {
            label: "Display Beverage Chillers",
            href: "/products?category=Chiller",
          },
          {
            label: "Upright Freezers",
            href: "/products?category=Upright+Freezer",
          },
          {
            label: "Cold Room Freezers",
            href: "/products?category=Cold+Room+Freezers",
          },
          {
            label: "Ice Cream Freezers",
            href: "/products?category=ice-makers",
          },
        ],
      },
      {
        title: "SOLAR & POWER",
        items: [
          {
            label: "All Power Units",
            href: "/products?category=Power+station",
          },
          {
            label: "AC/DC Power Stations",
            href: "/products?category=Power+station",
          },
          {
            label: "Pedestal Batteries (60Ah)",
            href: "/products?category=Pedestal+Batteries",
          },
          {
            label: "Pedestal Batteries (100Ah)",
            href: "/products?category=Pedestal+Batteries",
          },
          {
            label: "Solar Lithium Battery Kits",
            href: "/products?category=Pedestal+Batteries",
          },
          {
            label: "Solar Hybrid Controllers",
            href: "/products?category=Power+station",
          },
        ],
      },
      {
        title: "AIR CONDITIONERS",
        items: [
          {
            label: "All Air Conditioners",
            href: "/products?category=Air+Conditioners",
          },
          {
            label: "Inverter Split ACs",
            href: "/products?category=Air+Conditioners",
          },
          {
            label: "Solar Hybrid AC Units",
            href: "/products?category=Air+Conditioners",
          },
          {
            label: "Standing Floor ACs",
            href: "/products?category=Air+Conditioners",
          },
          {
            label: "Commercial Cooling AC",
            href: "/products?category=Air+Conditioners",
          },
        ],
      },
      {
        title: "APPLIANCES & MORE",
        items: [
          {
            label: "Commercial Ice Makers",
            href: "/products?category=Ice+Makers",
          },
          {
            label: "DC Solar Chest Freezers",
            href: "/products?category=Single+Door+Chest+Freezers",
          },
          {
            label: "Pure Sine Wave Inverters",
            href: "/products?category=Power+station",
          },
          {
            label: "Solar Generator Kits",
            href: "/products?category=Power+station",
          },
          { label: "Koolboks Spare Parts & Kits", href: "/products" },
        ],
      },
      {
        title: "POPULAR COLLECTIONS",
        items: [
          {
            label: "On Sale Freezers",
            href: "/products?sort=sale",
            badge: "SALE",
          },
          { label: "New Arrivals 2026", href: "/products?sort=newest" },
          { label: "Best Selling Units", href: "/products?sort=bestsellers" },
          { label: "Verified Vendor Deals", href: "/products?vendor=all" },
          {
            label: "Commercial Heavy Duty",
            href: "/products?category=Cold+Room+Freezers",
          },
        ],
      },
    ],
  },
  marketplace: {
    columns: [
      {
        title: "MARKETPLACE DIRECTORY",
        items: [
          { label: "All Marketplace Products", href: "/products" },
          {
            label: "Chest Freezers & Chillers",
            href: "/products?category=Single+Door+Chest+Freezers",
          },
          {
            label: "Solar Energy & Inverters",
            href: "/products?category=Power+station",
          },
          {
            label: "Commercial Cold Storage",
            href: "/products?category=Cold+Room+Freezers",
          },
          {
            label: "Ice Makers & Accessories",
            href: "/products?category=Ice+Makers",
          },
          {
            label: "Refurbished Certified Stock",
            href: "/products?sort=refurbished",
          },
        ],
      },
      {
        title: "VERIFIED VENDORS",
        items: [
          {
            label: "Lighthouse Electronics",
            href: "/products?vendor=lighthouse",
          },
          { label: "Adobe Electronics", href: "/products?vendor=biizinilah" },
          { label: "Modus Ideal Electronics", href: "/products?vendor=modus" },
          { label: "Don Vic LTD", href: "/products?vendor=donvic" },
          {
            label: "Cash N Carry (Allen)",
            href: "/products?vendor=cashncarry",
          },
          { label: "Ajah Store & Appliances", href: "/products?vendor=ajah" },
          { label: "Albertina Nig LTD", href: "/products?vendor=albertina" },
        ],
      },
      {
        title: "TOP BRANDS",
        items: [
          { label: "Koolboks Official", href: "/products?search=Koolboks" },
          { label: "Scanfrost Nigeria", href: "/products?search=Scanfrost" },
          { label: "Haier Thermocool", href: "/products?search=Thermocool" },
          { label: "Hisense Appliances", href: "/products?search=Hisense" },
          { label: "Bruhm Electronics", href: "/products?search=Bruhm" },
          { label: "Samsung & LG Cooling", href: "/brands" },
          { label: "View All 20+ Brands", href: "/brands", badge: "ALL" },
        ],
      },
      {
        title: "DEALS & FINANCING",
        items: [
          {
            label: "Flash Sale Discounts",
            href: "/products?sort=sale",
            badge: "SAVE",
          },
          { label: "Pay As Low As ₦20,000/mo", href: "/help/payment" },
          { label: "Wholesale & Bulk Enquiries", href: "/help" },
          { label: "Vendor Clearance Stock", href: "/products" },
          { label: "Free Installation Offers", href: "/help" },
        ],
      },
    ],
  },
  quickLinks: {
    columns: [
      {
        title: "POPULAR DESTINATIONS",
        items: [
          { label: "Hot Deals & Offers", href: "/products", badge: "HOT" },
          { label: "New Arrivals 2026", href: "/products?sort=newest" },
          { label: "Brands Directory", href: "/brands" },
          { label: "Gift Boxes & Bundles", href: "/gift-boxes" },
          { label: "Top Rated Products", href: "/products?sort=rating" },
        ],
      },
      {
        title: "CUSTOMER SUPPORT",
        items: [
          { label: "Help & Support Center", href: "/help" },
          { label: "Place & Track An Order", href: "/help/tracking" },
          { label: "Payment Options & Plans", href: "/help/payment" },
          { label: "Returns & Refund Policy", href: "/refund" },
          { label: "Warranty & Repair Terms", href: "/help" },
        ],
      },
      {
        title: "VENDOR PROGRAM",
        items: [
          {
            label: "Become A Verified Vendor",
            href: "/register",
            badge: "JOIN",
          },
          { label: "Vendor Benefits & Perks", href: "/register" },
          { label: "Store Locations in Lagos", href: "/#vendor" },
          { label: "Vendor Verification Portal", href: "/login" },
          { label: "Commercial Partnership", href: "/help" },
        ],
      },
      {
        title: "ABOUT KOOLBUY",
        items: [
          { label: "About Koolbuy Clean Tech", href: "/help" },
          { label: "Meet Our Partners", href: "/brands" },
          { label: "Solar Energy Mission", href: "/help" },
          { label: "Contact Us (WhatsApp & Chat)", href: "/help" },
          { label: "Terms & Privacy Policy", href: "/help" },
        ],
      },
    ],
  },
};

export const SecondaryNavbar: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  const handleMouseEnter = (menuKey: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveDropdown(menuKey);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  return (
    <div
      className="w-full bg-white border-t border-gray-100 hidden lg:block relative z-70"
      onMouseLeave={handleMouseLeave}
    >
      <div className="max-w-360 mx-auto px-6 md:px-10 lg:px-16 h-11 flex items-center justify-between">
        <div className="flex items-center gap-6 h-full">
          {/* All Categories Trigger */}
          <div
            className="relative h-full flex items-center"
            onMouseEnter={() => handleMouseEnter("categories")}
          >
            <button
              type="button"
              onClick={() =>
                setActiveDropdown((prev) =>
                  prev === "categories" ? null : "categories",
                )
              }
              className={`flex items-center gap-2 h-full font-bold text-sm border-r border-gray-200 pr-6 transition-colors cursor-pointer outline-none ${
                activeDropdown === "categories"
                  ? "text-[#FF7A00]"
                  : "text-gray-900 hover:text-[#FF7A00]"
              }`}
            >
              <span>All categories</span>
              <FiChevronDown
                className={`text-xs transition-transform duration-200 ${
                  activeDropdown === "categories"
                    ? "rotate-180 text-[#FF7A00]"
                    : "text-gray-400"
                }`}
              />
            </button>
          </div>

          {/* Navigation Links with Hover Mega Menus */}
          <div className="flex items-center gap-7 text-sm font-medium text-gray-900 h-full">
            {/* Home */}
            <Link
              href="/"
              className={`transition-colors py-2 ${
                isActive("/")
                  ? "text-[#FF7A00] font-bold"
                  : "text-gray-900 hover:text-[#FF7A00]"
              }`}
            >
              Home
            </Link>

            {/* Marketplace */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => handleMouseEnter("marketplace")}
            >
              <Link
                href="/products"
                className={`flex items-center gap-1.5 transition-colors py-2 ${
                  isActive("/products") || activeDropdown === "marketplace"
                    ? "text-[#FF7A00] font-bold"
                    : "text-gray-900 hover:text-[#FF7A00]"
                }`}
              >
                <span>Marketplace</span>
                <FiChevronDown
                  className={`text-xs transition-transform duration-200 ${
                    activeDropdown === "marketplace"
                      ? "rotate-180 text-[#FF7A00]"
                      : "text-gray-400"
                  }`}
                />
              </Link>
            </div>

            {/* Quick Links */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => handleMouseEnter("quickLinks")}
            >
              <button
                type="button"
                onClick={() =>
                  setActiveDropdown((prev) =>
                    prev === "quickLinks" ? null : "quickLinks",
                  )
                }
                className={`flex items-center gap-1.5 transition-colors cursor-pointer py-2 outline-none ${
                  activeDropdown === "quickLinks"
                    ? "text-[#FF7A00] font-bold"
                    : "text-gray-900 hover:text-[#FF7A00]"
                }`}
              >
                <span>Quick Links</span>
                <FiChevronDown
                  className={`text-xs transition-transform duration-200 ${
                    activeDropdown === "quickLinks"
                      ? "rotate-180 text-[#FF7A00]"
                      : "text-gray-400"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Full-Width Mega Dropdown Overlay */}
      <AnimatePresence>
        {activeDropdown && megaMenuContent[activeDropdown] && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onMouseEnter={() => {
              if (timeoutRef.current) clearTimeout(timeoutRef.current);
            }}
            onMouseLeave={handleMouseLeave}
            className="absolute top-full left-0 w-full bg-white border-t border-b border-gray-100 shadow-2xl z-100"
          >
            <div className="max-w-360 mx-auto px-6 md:px-10 lg:px-16 py-8 md:py-10">
              {/* Columns Grid */}
              <div
                className={`grid gap-8 ${
                  megaMenuContent[activeDropdown].columns.length === 6
                    ? "grid-cols-6"
                    : megaMenuContent[activeDropdown].columns.length === 5
                      ? "grid-cols-5"
                      : "grid-cols-4"
                }`}
              >
                {megaMenuContent[activeDropdown].columns.map((col, colIdx) => (
                  <div key={colIdx} className="flex flex-col gap-3">
                    {/* Column Header */}
                    <h4 className="text-[12px] font-extrabold text-gray-900 tracking-wider uppercase pb-2 border-b border-gray-100 flex items-center justify-between">
                      <span>{col.title}</span>
                    </h4>

                    {/* Column Links */}
                    <ul className="flex flex-col gap-2 pt-1">
                      {col.items.map((item, itemIdx) => (
                        <li key={itemIdx}>
                          <Link
                            href={item.href}
                            onClick={() => setActiveDropdown(null)}
                            className="group inline-flex items-center gap-2 text-[13px] text-gray-600 hover:text-[#FF7A00] transition-colors py-0.5 leading-snug"
                          >
                            <span className="group-hover:translate-x-0.5 transition-transform duration-150">
                              {item.label}
                            </span>
                            {item.badge && (
                              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-orange-100 text-[#FF7A00] uppercase tracking-wide">
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Bottom Quick Bar */}
              <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-6">
                  {/* <span className="text-gray-400 font-medium">
                    ⚡ 24/7 Clean Solar Energy • Verified Warranties • Fast
                    Delivery
                  </span> */}
                </div>

                <Link
                  href="/products"
                  onClick={() => setActiveDropdown(null)}
                  className="inline-flex items-center gap-1.5 font-bold text-[#FF7A00] hover:underline"
                >
                  <span>Browse All Products in Catalog</span>
                  <FiArrowRight size={13} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
