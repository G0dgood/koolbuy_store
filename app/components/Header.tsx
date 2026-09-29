"use client";

import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Icon } from "./Icon";
import { useMobileMenu } from "@/app/context/MobileMenuContext";
import { SearchAutocomplete } from "./Header/SearchAutocomplete";
import { ActionIcons } from "./Header/ActionIcons";
import { HeaderNavMenu } from "./Header/HeaderNavMenu";
import { HeaderNavLinks } from "./Header/HeaderNavLinks";
import { AdvertBanner } from "./Header/AdvertBanner";
import { megaMenuContent } from "./Header/megaMenuData";
import { FiMapPin, FiSearch, FiChevronDown, FiArrowRight } from "react-icons/fi";

export const Header: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  const { toggleMenu } = useMobileMenu();
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("62 Opebi Rd, O...");
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  // Mega dropdown state
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const locationRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleMouseEnterDropdown = (menuKey: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(menuKey);
  };

  const handleMouseLeaveDropdown = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 250);
  };

  useEffect(() => {
    // Close dropdown on route change
    setActiveDropdown(null);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (locationRef.current && !locationRef.current.contains(target)) {
        setIsLocationOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/products");
    }
  };

  const deliveryLocations = [
    { short: "62 Opebi Rd, O...", full: "62 Opebi Rd, Opebi, Ikeja, Lagos" },
    {
      short: "15 Admiralty, L...",
      full: "15 Admiralty Way, Lekki Phase 1, Lagos",
    },
    { short: "42 Ahman Pategi...", full: "42 Ahman Pategi St, Garki 2, Abuja" },
    {
      short: "Plot 8 Commerci...",
      full: "Plot 8 Commercial Ave, Port Harcourt",
    },
  ];

  return (
    <header
      className={`w-full bg-white/80 backdrop-blur-xl backdrop-saturate-[1.8] border-b border-black/[0.08] sticky top-0 z-80 ${className}`}
      onMouseLeave={handleMouseLeaveDropdown}
    >
      {/* Top Main Header */}
      <div className="max-w-360 mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-14 h-14 md:h-16 flex items-center justify-between gap-3 md:gap-4 lg:gap-6 xl:gap-8">
        {/* Mobile: Hamburger & Logo Group */}
        <div className="flex items-center gap-3 lg:hidden">
          <button onClick={toggleMenu} className="text-gray-900 p-1">
            <Icon name="menu" size="md" />
          </button>
          <Link href="/" className="shrink-0 flex items-center">
            <div className="h-8 overflow-hidden flex items-center">
              <img
                src="/images/koolboks/koolbuy_logo.webp"
                alt="Koolbuy Store"
                className="h-full w-auto object-contain"
              />
            </div>
          </Link>
        </div>

        {/* Desktop Logo */}
        <Link href="/" className="shrink-0 hidden lg:flex items-center">
          <div className="h-8 xl:h-9 overflow-hidden flex items-center">
            <img
              src="/images/koolboks/koolbuy_logo.webp"
              alt="Koolbuy Store"
              className="h-full w-auto object-contain"
            />
          </div>
        </Link>

        {/* Search Bar (Desktop) */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 max-w-85 xl:max-w-115 h-10 xl:h-11 p-0.5 bg-cream border border-transparent hover:border-black/[0.08] focus-within:bg-white focus-within:border-black/15 rounded-full hidden md:flex items-stretch relative z-50 transition-colors"
        >
          {/* Location Dropdown */}
          <div
            className="relative flex items-stretch shrink-0"
            ref={locationRef}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsLocationOpen((prev) => !prev);
              }}
              className="h-full flex items-center gap-1.5 pl-3.5 pr-2.5 hover:bg-white rounded-l-full transition-colors cursor-pointer border-r border-gray-200 text-left outline-none"
            >
              <FiMapPin className="text-gray-500 text-sm shrink-0" />
              <span className="text-xs font-normal text-ink max-w-20 xl:max-w-26 truncate">
                {selectedLocation}
              </span>
              <FiChevronDown
                className={`text-gray-400 text-xs shrink-0 transition-transform duration-200 ${
                  isLocationOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Location Selector Menu */}
            <AnimatePresence>
              {isLocationOpen && (
                <div
                  className="absolute top-full left-0 pt-2 w-72 z-100"
                  onClick={() => setIsLocationOpen(false)}
                >
                  <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-[var(--shadow-lift)] p-2 flex flex-col gap-1 text-sm">
                    <div className="px-3 py-1.5 text-[11px] font-bold text-gray-400">
                      Delivery Location
                    </div>
                    {deliveryLocations.map((loc) => (
                      <button
                        key={loc.full}
                        type="button"
                        onClick={() => setSelectedLocation(loc.short)}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-gray-700 hover:bg-cream hover:text-ink transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <FiMapPin className="text-gray-500 text-xs shrink-0" />
                        <span className="truncate">{loc.full}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Search Input Section */}
          <div
            className="flex-1 flex items-center px-3 relative min-w-0"
            ref={searchRef}
          >
            <FiSearch className="text-gray-500 text-base shrink-0 mr-2" />
            <input
              type="text"
              placeholder="Search freezers, solar kits, ice makers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              className="w-full text-xs xl:text-sm text-ink placeholder-gray-500 bg-transparent outline-none focus:outline-none"
            />

            {/* Search Autocomplete Dropdown */}
            <SearchAutocomplete
              searchQuery={searchQuery}
              isVisible={isSearchFocused}
            />
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="bg-action hover:bg-action-hover active:scale-95 text-white font-normal text-xs xl:text-sm px-4 xl:px-5 flex items-center justify-center rounded-full transition-colors cursor-pointer shrink-0"
          >
            Search
          </button>
        </form>

        {/* Desktop Navigation Links (Home, All categories, Marketplace, Quick Links) with Mega Menus */}
        <HeaderNavLinks
          activeDropdown={activeDropdown}
          onMouseEnterDropdown={handleMouseEnterDropdown}
          onToggleDropdown={(key) =>
            setActiveDropdown((prev) => (prev === key ? null : key))
          }
        />

        {/* Right Actions: Language, Help, Currency, Profile, Cart */}
        <div className="flex items-center gap-2.5 sm:gap-3 md:gap-4 xl:gap-5 shrink-0">
          <div className="hidden 2xl:flex items-center">
            <HeaderNavMenu />
          </div>

          <div className="hidden 2xl:block w-px h-6 bg-gray-200 shrink-0" />

          {/* Action Icons */}
          <ActionIcons />
        </div>
      </div>

      {/* Mobile Search Input */}
      <div className="md:hidden px-4 pb-3">
        <form
          onSubmit={handleSearchSubmit}
          className="w-full h-11 bg-cream rounded-full flex items-center px-4 gap-2.5 border border-transparent focus-within:bg-white focus-within:border-black/15"
        >
          <FiSearch className="text-gray-500 text-base shrink-0" />
          <input
            type="text"
            placeholder="Search Koolbuy..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm w-full outline-none text-gray-800 placeholder-gray-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="text-gray-400 hover:text-gray-600 text-xs"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Advert Banner (In place of subheader) */}
      <AdvertBanner />

      {/* Full-Width Mega Dropdown Overlay (Pinned directly to bottom of sticky header) */}
      <AnimatePresence>
        {activeDropdown && megaMenuContent[activeDropdown] && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onMouseEnter={() => {
              if (dropdownTimeoutRef.current)
                clearTimeout(dropdownTimeoutRef.current);
            }}
            onMouseLeave={handleMouseLeaveDropdown}
            className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl backdrop-saturate-[1.8] border-b border-black/[0.08] z-100"
          >
            <div className="max-w-360 mx-auto px-6 md:px-10 lg:px-16 py-8 md:py-10 max-h-[calc(100vh-140px)] overflow-y-auto">
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
                    <h4 className="text-[12px] font-normal text-gray-500 pb-1 flex items-center justify-between">
                      <span>{col.title}</span>
                    </h4>

                    {/* Column Links */}
                    <ul className="flex flex-col gap-2 pt-1">
                      {col.items.map((item, itemIdx) => (
                        <li key={itemIdx}>
                          <Link
                            href={item.href}
                            onClick={() => setActiveDropdown(null)}
                            className="group inline-flex items-center gap-2 text-[15px] font-semibold text-ink hover:text-action transition-colors py-0.5 leading-snug"
                          >
                            <span className="group-hover:translate-x-0.5 transition-transform duration-150">
                              {item.label}
                            </span>
                            {item.badge && (
                              <span className="text-[11px] font-semibold px-1.5 py-0.5 text-eyebrow normal-case">
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
              <div className="mt-8 pt-4 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-6">
                  {/* <span className="text-gray-400 font-medium">
                    ⚡ 24/7 Clean Solar Energy • Verified Warranties • Fast
                    Delivery
                  </span> */}
                </div>

                <Link
                  href="/products"
                  onClick={() => setActiveDropdown(null)}
                  className="inline-flex items-center gap-1.5 text-sm text-action hover:underline"
                >
                  <span>Browse All Products in Catalog</span>
                  <FiArrowRight size={13} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Breadcrumb-like nav */}
      <div className="w-full overflow-x-auto bg-transparent md:hidden flex items-center gap-2 px-4 h-12 scrollbar-none whitespace-nowrap">
        {[
          "Solar Freezers",
          "AC/DC Hybrid",
          "Commercial Coolers",
          "Solar Kits",
          "Ice Makers",
        ].map((item, idx) => (
          <span
            key={idx}
            className={`${idx === 0 ? "bg-ink text-white" : "bg-cream text-ink"} text-[13px] px-3.5 py-1.5 rounded-full shrink-0`}
          >
            {item}
          </span>
        ))}
      </div>
    </header>
  );
};

export default Header;
