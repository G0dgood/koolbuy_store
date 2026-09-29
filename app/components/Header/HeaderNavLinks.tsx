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
      <div className="flex items-center gap-1 xl:gap-2 text-xs xl:text-sm font-bold text-ink h-full">
        {/* Home */}
        <Link
          href="/"
          className={`transition-colors px-3.5 py-2 rounded-full whitespace-nowrap ${
            isActive("/")
              ? "bg-brand-orange-light text-brand-orange-hover"
              : "text-ink hover:bg-cream hover:text-brand-orange"
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
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full transition-colors cursor-pointer outline-none whitespace-nowrap ${
              activeDropdown === "categories"
                ? "bg-brand-orange-light text-brand-orange-hover"
                : "text-ink hover:bg-cream hover:text-brand-orange"
            }`}
          >
            <span>All categories</span>
            <FiChevronDown
              className={`text-xs transition-transform duration-200 ${
                activeDropdown === "categories"
                  ? "rotate-180 text-brand-orange"
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
            className="h-10 bg-ink text-white px-6 mx-1 rounded-full hover:bg-ink-soft hover:-translate-y-px shadow-[0_8px_20px_-10px_rgba(15,61,46,0.7)] active:scale-95 transition-all w-full md:w-fit font-bold"
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
            className={`flex items-center gap-1 px-3.5 py-2 rounded-full transition-colors cursor-pointer outline-none whitespace-nowrap ${
              activeDropdown === "quickLinks"
                ? "bg-brand-orange-light text-brand-orange-hover"
                : "text-ink hover:bg-cream hover:text-brand-orange"
            }`}
          >
            <span>Quick Links</span>
            <FiChevronDown
              className={`text-xs transition-transform duration-200 ${
                activeDropdown === "quickLinks"
                  ? "rotate-180 text-brand-orange"
                  : "text-gray-400"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
