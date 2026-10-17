"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGetPublicCategoriesQuery } from "@/lib/store/api/categories-api";
import { categoryHref } from "@/lib/store/api/catalogue-api";

export interface CategoryItemDef {
  id: string;
  name: string;
  link: string;
}

// Default canonical product categories matching koolbuystore.com
const DEFAULT_CATEGORIES: CategoryItemDef[] = [
  { id: "all", name: "All Products", link: "/products" },
  { id: "upright-freezers", name: "Upright Freezers", link: "/category/upright-freezers" },
  { id: "chillers", name: "Chillers & Coolers", link: "/category/chillers" },
  { id: "single-door-chest", name: "Single Door Chest", link: "/category/single-door-chest" },
  { id: "double-door-chest", name: "Double Door Chest", link: "/category/double-door-chest" },
  { id: "coldroom", name: "Coldroom Systems", link: "/category/coldroom" },
  { id: "refurbished", name: "Refurbished Freezers", link: "/category/refurbished" },
  { id: "ice-makers", name: "Ice Makers", link: "/category/ice-makers" },
  { id: "solar-kits", name: "Solar Freezer Kits", link: "/category/solar-kits" },
];

interface IntroducingProductsProps {
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

export const IntroducingProducts: React.FC<IntroducingProductsProps> = ({
  activeTab = "all",
  onTabChange,
}) => {
  const pathname = usePathname();

  // Fetch real-time categories from the backend API
  const { data, isLoading } = useGetPublicCategoriesQuery();

  // Merge live API categories with canonical categories
  const categories: CategoryItemDef[] = useMemo(() => {
    const apiItems = data?.items ?? [];
    if (apiItems.length === 0) return DEFAULT_CATEGORIES;

    const seen = new Set<string>();
    const list: CategoryItemDef[] = [{ id: "all", name: "All Products", link: "/products" }];
    seen.add("all");

    for (const item of apiItems) {
      if (!seen.has(item.value)) {
        seen.add(item.value);
        list.push({
          id: item.value,
          name: item.label.replace(/\n/g, " "),
          link: categoryHref(item.value),
        });
      }
    }

    return list;
  }, [data]);

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

      {/* Product category row: navigating directly to dedicated category pages with banner & brand sidebar */}
      <div className="w-full flex justify-center px-4 overflow-x-auto no-scrollbar py-2">
        {isLoading && !data ? (
          <div className="h-10 w-full max-w-xl rounded-full bg-black/[0.04] animate-pulse" aria-hidden />
        ) : (
          <nav
            aria-label="Product categories"
            className="inline-flex items-center gap-1.5 p-1.5 rounded-full bg-white border border-light-gray shadow-xs"
          >
            {categories.map((cat) => {
              const isSelected =
                activeTab === cat.id ||
                (cat.id !== "all" && pathname === cat.link) ||
                (cat.id === "all" && pathname === "/products");

              return (
                <Link
                  key={cat.id}
                  href={cat.link}
                  onClick={() => onTabChange?.(cat.id)}
                  className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-all duration-150 ${
                    isSelected
                      ? "bg-brand-orange text-white shadow-xs"
                      : "text-subtle hover:text-brand-charcoal hover:bg-off-white"
                  }`}
                  aria-current={isSelected ? "page" : undefined}
                >
                  {cat.name}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </section>
  );
};

export default IntroducingProducts;
