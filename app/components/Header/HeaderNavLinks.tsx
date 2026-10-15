"use client";

import React from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  return (
    <div className="hidden lg:flex items-center h-full">
      {/* Navigation Buttons Row */}
      <div className="flex items-center gap-5 xl:gap-7 text-[13px] font-medium text-gray-800 h-full">
        {/* All Categories Trigger */}
        <div
          className="relative h-full flex items-center"
          onMouseEnter={() => onMouseEnterDropdown("categories")}
        >
          <button
            type="button"
            onClick={() => {
              if (activeDropdown === "categories") {
                // If already open, clicking navigates to /products catalog
                router.push("/products");
              } else {
                onToggleDropdown("categories");
              }
            }}
            className={`flex items-center gap-1.5 h-full py-2 transition-colors cursor-pointer outline-none whitespace-nowrap ${
              activeDropdown === "categories"
                ? "text-brand-orange-text font-semibold"
                : "text-gray-600 hover:text-brand-charcoal"
            }`}
          >
            <span>All categories</span>
            <FiChevronDown
              className={`text-xs transition-transform duration-200 ${
                activeDropdown === "categories"
                  ? "rotate-180 text-brand-orange-text"
                  : "text-gray-400"
              }`}
            />
          </button>
        </div>

        {/* Marketplace */}
        <div className="relative flex items-center">
          {/* <Button className="font-bold text-xs xl:text-sm ">
            Marketplace
          </Button> */}
          <Button
            href="https://kool-konnect-frontend.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            shape="pill"
            className="bg-brand-charcoal text-white hover:bg-brand-charcoal/85 w-full md:w-fit"
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
                ? "text-brand-orange-text"
                : "text-gray-600 hover:text-brand-charcoal"
            }`}
          >
            <span>Quick Links</span>
            <FiChevronDown
              className={`text-xs transition-transform duration-200 ${
                activeDropdown === "quickLinks"
                  ? "rotate-180 text-brand-orange-text"
                  : "text-gray-400"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
