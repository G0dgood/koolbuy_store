"use client";

import React, { useState, useMemo } from "react";
import { useGetPublicCategoriesQuery } from "@/lib/store/api/categories-api";
import { TabFilter } from "@/app/components/Tabs";

export interface CategoryTab {
  id: string;
  name: string;
  link: string;
}

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

  // Category chips come from the API; with none there is nothing to switch between
  const dynamicCategories: CategoryTab[] = useMemo(() => {
    const items = data?.items ?? [];
    if (items.length === 0) return [];
    return [
      { id: "all", name: "All", link: "/products" },
      ...items.map((cat) => ({
        id: cat.value,
        name: cat.label,
        link: `/products?category=${encodeURIComponent(cat.value)}`,
      })),
    ];
  }, [data]);

  const handleSelectTab = (id: string) => {
    setInternalActiveTab(id);
    onTabChange?.(id);
  };

  return (
    <section className="w-full flex flex-col items-center gap-6 pt-6 md:pt-10">
      {/* Large, tight headline with a short line under it */}
      <div className="text-center max-w-2xl px-4">
        <h2 className="text-[26px] sm:text-[36px] md:text-[42px] font-semibold text-brand-charcoal tracking-[-0.03em] leading-[1.05]">
          Introducing our products.
        </h2>
        <p className="mt-3 text-[17px] md:text-[19px] text-subtle leading-snug">
          Solar freezers, inverters and cold-chain essentials, built for Nigerian businesses.
        </p>
      </div>

      {/* Category tabs */}
      {(isLoading || dynamicCategories.length > 0) && (
        <div className="w-full flex justify-center px-4">
          {isLoading && !data ? (
            <div className="h-9 w-full max-w-120 rounded-lg bg-black/[0.04] animate-pulse" aria-hidden />
          ) : (
            <TabFilter
              ariaLabel="Product categories"
              options={dynamicCategories.map((cat) => ({ value: cat.id, label: cat.name.replace(/\n/g, " ") }))}
              activeTab={activeTab}
              onChange={handleSelectTab}
            />
          )}
        </div>
      )}
    </section>
  );
};

export default IntroducingProducts;
