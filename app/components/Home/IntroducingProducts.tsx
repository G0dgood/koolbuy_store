"use client";

import React, { useState, useMemo } from "react";
import { useGetPublicCategoriesQuery } from "@/lib/store/api/categories-api";

export interface CategoryTab {
  id: string;
  name: string;
  link: string;
}

export const defaultCategories: CategoryTab[] = [
  { id: "all", name: "All", link: "/products" },
  {
    id: "single-door",
    name: "Single Door Chest Freezers",
    link: "/products?category=single-door",
  },
  {
    id: "chiller",
    name: "Chiller",
    link: "/products?category=chiller",
  },
  {
    id: "upright",
    name: "Upright Freezer",
    link: "/products?category=upright",
  },
  {
    id: "cold-room",
    name: "Cold Room Freezers",
    link: "/products?category=cold-room",
  },
  {
    id: "power-station",
    name: "Power station",
    link: "/products?category=power-station",
  },
  {
    id: "pedestal",
    name: "Pedestal Batteries",
    link: "/products?category=pedestal",
  },
  {
    id: "ac",
    name: "Air Conditioners",
    link: "/products?category=ac",
  },
  {
    id: "double-door",
    name: "Double Door Chest Freezers",
    link: "/products?category=double-door",
  },
  {
    id: "ice-makers",
    name: "Ice Makers",
    link: "/products?category=ice-makers",
  },
];

// For backwards compatibility with other components importing `categories`
export const categories = defaultCategories;

interface IntroducingProductsProps {
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

export const IntroducingProducts: React.FC<IntroducingProductsProps> = ({
  activeTab: controlledActiveTab,
  onTabChange,
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState("all");
  const activeTab =
    controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;

  // Fetch real-time categories from the backend API
  const { data, isLoading } = useGetPublicCategoriesQuery();

  const dynamicCategories: CategoryTab[] = useMemo(() => {
    if (data?.items && data.items.length > 0) {
      const apiCategories = data.items.map((cat) => ({
        id: cat.value,
        name: cat.label,
        link: `/products?category=${encodeURIComponent(cat.value)}`,
      }));

      // Ensure "All" is always first
      return [
        { id: "all", name: "All", link: "/products" },
        ...apiCategories,
      ];
    }
    return defaultCategories;
  }, [data]);

  const handleSelectTab = (id: string) => {
    setInternalActiveTab(id);
    onTabChange?.(id);
  };

  return (
    <section className="w-full flex flex-col items-center gap-6 pt-6 md:pt-10">
      {/* Large, tight headline with a short line under it */}
      <div className="text-center max-w-2xl px-4">
        <h2 className="text-[32px] sm:text-[44px] md:text-[52px] font-semibold text-brand-charcoal tracking-[-0.03em] leading-[1.05]">
          Introducing our products.
        </h2>
        <p className="mt-3 text-[17px] md:text-[19px] text-subtle leading-snug">
          Solar freezers, inverters and cold-chain essentials, built for Nigerian businesses.
        </p>
      </div>

      {/* Category chips */}
      <div className="w-full max-w-full overflow-x-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-1">
        <div className="flex items-center justify-start md:justify-center min-w-max mx-auto px-4 gap-2">
          {isLoading && !data ? (
            // Subtle loading skeleton chips
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-8 w-24 rounded-full bg-black/[0.04] animate-pulse"
              />
            ))
          ) : (
            dynamicCategories.map((cat) => {
              const isActive = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleSelectTab(cat.id)}
                  aria-pressed={isActive}
                  className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors duration-200 cursor-pointer ${
                    isActive
                      ? "bg-brand-charcoal text-white shadow-2xs"
                      : "bg-black/[0.04] text-gray-700 hover:bg-black/[0.08] hover:text-brand-charcoal"
                  }`}
                >
                  {cat.name.replace(/\n/g, " ")}
                </button>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default IntroducingProducts;
