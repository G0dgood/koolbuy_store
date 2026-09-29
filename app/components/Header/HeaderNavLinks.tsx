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
      <div className="flex items-center gap-5 xl:gap-7 text-xs xl:text-[13px] text-ink/80 h-full">
        {/* Home */}
        <Link
          href="/"
          className={`transition-colors py-2 whitespace-nowrap ${
            isActive("/")
              ? "text-ink"
              : "text-ink/80 hover:text-ink"
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
            className={`flex items-center gap-1 py-2 transition-colors cursor-pointer outline-none whitespace-nowrap ${
              activeDropdown === "categories"
                ? "text-ink"
                : "text-ink/80 hover:text-ink"
            }`}
          >
            <span>All categories</span>
            <FiChevronDown
              className={`text-xs transition-transform duration-200 ${
                activeDropdown === "categories"
                  ? "rotate-180 text-ink"
                  : "text-gray-400"
              }`}
            />
          </button>
        </div>

        {/* Marketplace */}
        <div className="relative flex items-center">
          {/* <Button className="font-bold hover:shadow-sm text-xs xl:text-sm">
            Marketplace
          </Button> */}
          <Button
            href="https://kool-konnect-frontend.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="h-8 bg-action text-white px-4 rounded-full hover:bg-action-hover active:scale-95 transition-colors w-full md:w-fit text-xs xl:text-[13px] font-normal"
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
            className={`flex items-center gap-1 py-2 transition-colors cursor-pointer outline-none whitespace-nowrap ${
              activeDropdown === "quickLinks"
                ? "text-ink"
                : "text-ink/80 hover:text-ink"
            }`}
          >
            <span>Quick Links</span>
            <FiChevronDown
              className={`text-xs transition-transform duration-200 ${
                activeDropdown === "quickLinks"
                  ? "rotate-180 text-ink"
                  : "text-gray-400"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
