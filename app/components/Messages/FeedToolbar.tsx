"use client";

import React from "react";
import { motion } from "framer-motion";
import { Icon } from "../Icon";

interface FeedToolbarProps {
  activeTab: "all" | "unread";
  onTabChange: (tab: "all" | "unread") => void;
}

export const FeedToolbar: React.FC<FeedToolbarProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="px-5 py-4 md:px-6 border-b border-black/[0.06] flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
      <div className="flex gap-1 p-1 bg-black/[0.04] rounded-full relative">
        {(["all", "unread"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`
              relative h-8 px-4 text-[14px] font-medium rounded-full transition-colors duration-200 z-10 cursor-pointer
              ${activeTab === tab ? "text-white" : "text-brand-charcoal hover:text-subtle"}
            `}
          >
            {activeTab === tab && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-brand-orange rounded-full z-[-1]"
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              />
            )}
            <span className="relative">
              {tab === "all" ? "All messages" : "Unread"}
            </span>
          </button>
        ))}
      </div>

      <div className="relative w-full sm:w-64">
        <Icon name="search" size="sm" className="absolute left-4 top-1/2 -translate-y-1/2 text-faint z-10" />
        <input
          type="text"
          placeholder="Search messages..."
          className="w-full h-10 pl-11 pr-4 rounded-full bg-black/[0.04] border border-transparent outline-none transition-colors text-[14px] text-brand-charcoal placeholder:text-faint focus:bg-white focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/15 relative z-0"
        />
      </div>
    </div>
  );
};
