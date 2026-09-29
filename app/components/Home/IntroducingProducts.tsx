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
      <div className="flex flex-col items-center gap-3">
        <span className="kb-sticker">Keep it kool</span>
        <h2 className="kb-title kb-squiggle text-3xl sm:text-4xl text-center [&::after]:left-1/2 [&::after]:-translate-x-1/2">
          Introducing Our Products
        </h2>
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
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 350, damping: 22 }}
                    className={`relative px-4 sm:px-5 py-2.5 min-h-12 rounded-full border-[1.5px] flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 outline-none ${
                      isActive
                        ? "bg-ink border-ink shadow-[0_8px_20px_-10px_rgba(15,61,46,0.7)]"
                        : "bg-white border-gray-200 hover:border-brand-orange/40 hover:bg-brand-orange-light"
                    }`}
                  >
                    <span
                      className={`text-xs sm:text-sm whitespace-pre-line leading-tight transition-colors duration-200 ${
                        isActive
                          ? "text-white font-bold"
                          : "text-ink font-semibold group-hover:text-brand-orange-hover"
                      }`}
                    >
                      {cat.name}
                    </span>

                    {/* Active dot */}
                    {isActive && (
                      <motion.div
                        layoutId="activeTabUnderline"
                        className="absolute -top-1 -right-0.5 w-3 h-3 bg-mustard border-2 border-white rounded-full"
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 30,
                        }}
                      />
                    )}
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
