"use client";

import React from "react";
import { motion } from "framer-motion";

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number | string;
}

export interface TabsProps {
  tabs: (string | TabItem)[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: "underline" | "segmented";
  size?: "sm" | "md";
  label?: string;
  activeColor?: string;
  className?: string;
  layoutId?: string;
}

/**
 * Tabs component ported directly from koolboks_sales_crm_web.
 * Supports:
 * - variant="underline": animated bottom underline with framer-motion (CRM Tabs.tsx)
 * - variant="segmented": joined pill buttons with light-gray borders and orange active inset (CRM ActivityUi.tsx Segmented)
 */
const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  variant = "segmented",
  size = "md",
  label,
  activeColor = "var(--brand-orange)",
  className = "",
  layoutId = "activeTabUnderline",
}) => {
  if (variant === "segmented") {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        {label && <span className="input-label block">{label}</span>}
        <div className="max-w-full overflow-x-auto no-scrollbar">
          <div
            role="tablist"
            aria-label={label || "Tabs"}
            className="inline-flex rounded-[var(--radius)] border overflow-hidden bg-white dark:bg-gray-800"
            style={{ borderColor: "var(--light-gray, #E2E8F0)" }}
          >
            {tabs.map((tab) => {
              const tabId = typeof tab === "string" ? tab : tab.id;
              const tabLabel = typeof tab === "string" ? tab : tab.label;
              const tabIcon = typeof tab === "object" ? tab.icon : null;
              const tabCount = typeof tab === "object" ? tab.count : undefined;
              const isActive = activeTab === tabId;

              return (
                <button
                  key={tabId}
                  role="tab"
                  aria-selected={isActive}
                  type="button"
                  onClick={() => onTabChange(tabId)}
                  className={`
                    ${size === "sm" ? "min-h-9 px-3.5 text-xs" : "min-h-11 px-5 text-xs sm:text-[13px]"}
                    min-w-16 shrink-0 !rounded-none border-r last:border-r-0 cursor-pointer font-semibold
                    transition-all duration-150 flex items-center justify-center gap-2 select-none
                  `}
                  style={{
                    borderColor: "var(--light-gray, #E2E8F0)",
                    backgroundColor: isActive
                      ? "var(--brand-orange-soft, #FEF1E6)"
                      : "var(--accent-white, #FFFFFF)",
                    color: isActive
                      ? "var(--text-primary, #0F172A)"
                      : "var(--text-secondary, #64748B)",
                    boxShadow: isActive
                      ? "inset 0 -3px 0 var(--brand-orange, #F57E16)"
                      : undefined,
                  }}
                >
                  {tabIcon && <span className="shrink-0">{tabIcon}</span>}
                  <span className={isActive ? "font-bold" : "font-semibold"}>
                    {tabLabel}
                  </span>
                  {tabCount !== undefined && tabCount !== null && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-colors ${
                        isActive
                          ? "bg-brand-orange text-white"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {tabCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`border-b dark:border-gray-700 flex items-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar relative ${className}`}
      style={{ borderColor: "var(--light-gray)" }}
      role="tablist"
      aria-label={label}
    >
      {tabs.map((tab) => {
        const tabId = typeof tab === "string" ? tab : tab.id;
        const tabLabel = typeof tab === "string" ? tab : tab.label;
        const tabIcon = typeof tab === "object" ? tab.icon : null;
        const tabCount = typeof tab === "object" ? tab.count : undefined;
        const isActive = activeTab === tabId;

        return (
          <button
            key={tabId}
            role="tab"
            aria-selected={isActive}
            type="button"
            onClick={() => onTabChange(tabId)}
            className={`pb-3.5 pt-1 px-1 font-semibold text-xs sm:text-[13px] transition-colors duration-200 relative min-w-fit focus:outline-none cursor-pointer flex items-center gap-2 ${
              isActive
                ? "text-brand-orange-text font-bold"
                : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
            }`}
            style={{
              color: isActive ? activeColor : undefined,
            }}
          >
            <div className="flex items-center gap-2 relative z-10">
              {tabIcon}
              <span>{tabLabel}</span>
              {tabCount !== undefined && tabCount !== null && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-colors ${
                    isActive
                      ? "bg-brand-orange-soft text-brand-orange-text"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                  }`}
                >
                  {tabCount}
                </span>
              )}
            </div>
            {isActive && (
              <motion.div
                layoutId={layoutId}
                className="absolute bottom-0 left-0 right-0 h-0.5 z-20"
                style={{ backgroundColor: activeColor }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export { Tabs };
export default Tabs;
