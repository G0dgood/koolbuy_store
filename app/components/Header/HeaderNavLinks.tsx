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
      <div className="flex items-center gap-5 xl:gap-7 text-[13px] font-medium text-brand-charcoal h-full">
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
                : "text-subtle hover:text-brand-charcoal"
            }`}
          >
            <span>All categories</span>
            <FiChevronDown
              className={`text-xs transition-transform duration-200 ${
                activeDropdown === "categories"
                  ? "rotate-180 text-brand-orange-text"
                  : "text-faint"
              }`}
            />
          </button>
        </div>

        {/* Marketplace */}
        <div className="relative flex items-center">
          {/* <Button className="font-semibold text-xs xl:text-sm ">
            Marketplace
          </Button> */}
          <Button
            href="https://kool-konnect-frontend.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            shape="pill"
            size="sm"
            className="bg-brand-charcoal text-white hover:bg-brand-charcoal/85 w-full md:w-fit h-8 px-4! py-0! text-[12px]!"
          >
            Marketplace
          </Button>
        </div>
      </div>
    </div>
  );
};
