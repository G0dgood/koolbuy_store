"use client";

import React, { useState } from "react";
import { Icon } from "../Icon";
import { useGetPublicCategoriesQuery } from "@/lib/store/api/categories-api";

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  children,
  defaultOpen = true,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-black/[0.06] py-4 first:border-t-0">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between group cursor-pointer"
      >
        <h4 className="text-[13px] font-semibold text-brand-charcoal">
          {title}
        </h4>
        <Icon
          name="expand_more"
          size="xs"
          className={`text-faint group-hover:text-brand-charcoal transform transition-all duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && <div className="flex flex-col gap-2.5 mt-3 text-[14px]">{children}</div>}
    </div>
  );
};

interface FilterSidebarProps {
  /** Active category from the URL: a slug ("fish_seafood") or a label */
  selectedCategory: string | null;
  /** null clears the category */
  onSelectCategory: (value: string | null) => void;
}

/* The catalogue API filters by category only (no brand, price, rating or
   condition filters), so that is the one filter offered here. */
const FilterSidebar: React.FC<FilterSidebarProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const { data: categoriesData, isLoading: isLoadingCategories } = useGetPublicCategoriesQuery();

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 flex flex-col bg-white rounded-tile border border-light-gray px-5 py-1">
      <FilterSection title="Category">
        <ul className="flex flex-col gap-2.5 text-[14px]">
          {isLoadingCategories &&
            Array.from({ length: 5 }).map((_, i) => (
              <li key={i} aria-hidden="true" className="h-4 w-3/4 rounded-full bg-black/[0.04] animate-pulse" />
            ))}
          {!isLoadingCategories &&
            [{ value: "", label: "All Categories" }, ...(categoriesData?.items ?? [])].map((cat) => {
              const isAll = cat.value === "";
              const isActive = isAll
                ? !selectedCategory
                : selectedCategory === cat.value || selectedCategory === cat.label;
              return (
                <li key={cat.value || "all"}>
                  <button
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => onSelectCategory(isAll || isActive ? null : cat.value)}
                    className={`w-full text-left cursor-pointer transition-colors flex items-center justify-between ${
                      isActive
                        ? "text-brand-orange-text font-semibold"
                        : "text-subtle hover:text-brand-charcoal"
                    }`}
                  >
                    <span>{cat.label}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-orange-text" />
                    )}
                  </button>
                </li>
              );
            })}
        </ul>
      </FilterSection>
    </aside>
  );
};

export { FilterSidebar };
