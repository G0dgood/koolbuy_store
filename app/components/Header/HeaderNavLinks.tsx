"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiChevronDown } from "react-icons/fi";
import { Button } from "../Button";

interface HeaderNavLinksProps {
  activeDropdown: string | null;
  onMouseEnterDropdown: (key: string) => void;
  onToggleDropdown: (key: string) => void;
}

export const HeaderNavLinks: React.FC<HeaderNavLinksProps> = ({
  activeDropdown,
  onMouseEnterDropdown,
  onToggleDropdown,
}) => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <div className="hidden lg:flex items-center h-full">
      {/* Navigation Buttons Row */}
      <div className="flex items-center gap-4 xl:gap-6 text-xs xl:text-sm font-semibold text-gray-800 h-full">
        {/* Home */}
        <Link
          href="/"
          className={`transition-colors py-2 whitespace-nowrap ${
            isActive("/")
              ? "text-[#FF7A00] font-bold"
              : "text-gray-800 hover:text-[#FF7A00]"
          }`}
        >
          Home
        </Link>

        {/* All Categories Trigger */}
        <div
          className="relative h-full flex items-center"
          onMouseEnter={() => onMouseEnterDropdown("categories")}
        >
          <button
            type="button"
            onClick={() => onToggleDropdown("categories")}
            className={`flex items-center gap-1.5 h-full py-2 transition-colors cursor-pointer outline-none whitespace-nowrap ${
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

        {/* Marketplace */}
        <div className="relative flex items-center">
          {/* <Button className="font-bold hover:shadow-sm text-xs xl:text-sm ">
            Marketplace
          </Button> */}
          <Button
            href="https://kool-konnect-frontend.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="h-10 bg-brand-blue text-white px-8 hover:bg-brand-blue/90 shadow-md active:scale-95 transition-all w-full md:w-fit font-bold"
          >
            Marketplace
          </Button>
        </div>

        {/* Quick Links */}
        <div
          className="relative h-full flex items-center"
          onMouseEnter={() => onMouseEnterDropdown("quickLinks")}
        >
          <button
            type="button"
            onClick={() => onToggleDropdown("quickLinks")}
            className={`flex items-center gap-1 transition-colors cursor-pointer py-2 outline-none whitespace-nowrap ${
              activeDropdown === "quickLinks"
                ? "text-[#FF7A00] font-bold"
                : "text-gray-800 hover:text-[#FF7A00]"
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
  );
};
