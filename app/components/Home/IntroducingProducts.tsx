"use client";

import React, { useState } from "react";

export interface CategoryTab {
  id: string;
  name: string;
  link: string;
}

export const categories: CategoryTab[] = [
  { id: "all", name: "All", link: "/products" },
  {
    id: "single-door",
    name: "Single Door\nChest Freezers",
    link: "/products?category=Single+Door+Chest+Freezers",
  },
  {
    id: "chiller",
    name: "Chiller",
    link: "/products?category=Chiller",
  },
  {
    id: "upright",
    name: "Upright Freezer",
    link: "/products?category=Upright+Freezer",
  },
  {
    id: "cold-room",
    name: "Cold Room\nFreezers",
    link: "/products?category=Cold+Room+Freezers",
  },
  {
    id: "power-station",
    name: "Power station",
    link: "/products?category=Power+station",
  },
  {
    id: "pedestal",
    name: "Pedestal\nBatteries",
    link: "/products?category=Pedestal+Batteries",
  },
  {
    id: "ac",
    name: "Air\nConditioners",
    link: "/products?category=Air+Conditioners",
  },
  {
    id: "double-door",
    name: "Double Door\nChest Freezers",
    link: "/products?category=Double+Door+Chest+Freezers",
  },
  {
    id: "ice-makers",
    name: "Ice Makers",
    link: "/products?category=Ice+Makers",
  },
];

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
          Solar freezers, inverters and batteries, built for Nigerian businesses.
        </p>
      </div>

      {/* Category chips */}
      <div className="w-full max-w-full overflow-x-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-1">
        <div className="flex items-center justify-start md:justify-center min-w-max mx-auto px-4 gap-2">
          {categories.map((cat) => {
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleSelectTab(cat.id)}
                aria-pressed={isActive}
                className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors duration-200 ${
                  isActive
                    ? "bg-brand-charcoal text-white"
                    : "bg-black/[0.04] text-gray-700 hover:bg-black/[0.08] hover:text-brand-charcoal"
                }`}
              >
                {cat.name.replace(/\n/g, " ")}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
