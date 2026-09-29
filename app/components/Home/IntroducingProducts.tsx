"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface CategoryTab {
  id: string;
  name: string;
  link: string;
}

const categories: CategoryTab[] = [
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
    <section className="w-full flex flex-col items-center gap-6 pt-2">
      {/* Section Title */}
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="kb-title text-[34px] sm:text-[48px] leading-[1.07] tracking-[-0.025em]">
          Introducing our products.
        </h2>
        <p className="text-[19px] sm:text-[24px] text-gray-600 font-normal leading-snug tracking-[-0.01em]">
          Solar cold storage, built for Nigerian business.
        </p>
      </div>

      {/* Categories Tabs Bar */}
      <div className="w-full max-w-full overflow-x-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-1">
        <div className="flex items-center justify-start md:justify-center min-w-max mx-auto px-4 gap-2">
          {categories.map((cat, idx) => {
            const isActive = activeTab === cat.id;

            return (
              <React.Fragment key={cat.id}>
                <Link
                  href={cat.link}
                  onClick={() => handleSelectTab(cat.id)}
                  className="group relative"
                >
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 350, damping: 22 }}
                    className={`relative px-4 py-3 min-h-11 rounded-full bg-white flex flex-col items-center justify-center text-center cursor-pointer transition-colors duration-200 outline-none ${
                      isActive
                        ? "border-2 border-[#0071e3] px-[15px]"
                        : "border border-[#d2d2d7] hover:border-[#86868b]"
                    }`}
                  >
                    <span
                      className={`text-[13px] sm:text-sm whitespace-pre-line leading-tight transition-colors duration-200 ${
                        isActive
                          ? "text-ink font-semibold"
                          : "text-ink"
                      }`}
                    >
                      {cat.name}
                    </span>


                  </motion.div>
                </Link>

                {/* Vertical Divider between items */}
                {/* spacing handled by gap */}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
};
