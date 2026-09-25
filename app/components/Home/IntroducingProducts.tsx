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
      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] text-center tracking-tight">
        Introducing Our Products
      </h2>

      {/* Categories Tabs Bar */}
      <div className="w-full max-w-full overflow-x-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-1">
        <div className="flex items-center justify-start md:justify-center min-w-max mx-auto px-4 gap-1 sm:gap-2">
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
                    whileHover={{ y: -2, scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 350, damping: 22 }}
                    className={`relative px-3.5 sm:px-4 py-2.5 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 outline-none ${
                      isActive ? "bg-orange-50/7" : "hover:bg-orange-50/50"
                    }`}
                  >
                    <span
                      className={`text-xs sm:text-sm whitespace-pre-line leading-tight transition-colors duration-200 ${
                        isActive
                          ? "text-[#FF7A00] font-bold"
                          : "text-gray-600 font-medium group-hover:text-[#FF7A00]"
                      }`}
                    >
                      {cat.name}
                    </span>

                    {/* Active Orange Underline */}
                    {isActive && (
                      <motion.div
                        layoutId="activeTabUnderline"
                        className="absolute -bottom-0.5 w-8 sm:w-10 h-0.75 bg-[#FF7A00] rounded-full"
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
                {idx < categories.length - 1 && (
                  <div className="h-6 w-px bg-gray-200 mx-0.5 shrink-0 self-center opacity-60" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
};
