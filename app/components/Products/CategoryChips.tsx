"use client";

import React from "react";

interface CategoryChipsProps {
  categories: string[];
  selectedCategory: string | null;
  onSelect: (category: string) => void;
  className?: string;
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  categories,
  selectedCategory,
  onSelect,
  className = "",
}) => {
  return (
    <div className={`w-full overflow-x-auto scrollbar-none flex items-center gap-2 px-4 py-3 bg-white ${className}`}>
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`
              px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors
              ${isSelected 
                ? "bg-brand-charcoal text-white"
                : "bg-black/[0.04] text-gray-700 hover:bg-black/[0.08]"}
            `}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
};
