"use client";

import React from "react";
import { Icon } from "../Icon";

interface ListingControlBarProps {
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  count: number;
  filters: {
    category: string | null;
    brands: string[];
    priceRange: [number, number];
    condition: string;
    ratings: number[];
  };
  onFiltersChange: (filters: any) => void;
  onFilterClick?: () => void;
  /** Display name for the active category (the filter holds the API slug) */
  categoryLabel?: string | null;
}

const ListingControlBar: React.FC<ListingControlBarProps> = ({
  viewMode,
  onViewModeChange,
  count,
  filters,
  onFiltersChange,
  onFilterClick,
  categoryLabel,
}) => {
  const activeFilterTags = React.useMemo(() => {
    const tags: { id: string; label: string; type: string; value: any }[] = [];

    if (filters.category) {
      tags.push({ id: `cat-${filters.category}`, label: categoryLabel || filters.category, type: 'category', value: filters.category });
    }

    filters.brands.forEach(brand => {
      tags.push({ id: `brand-${brand}`, label: brand, type: 'brand', value: brand });
    });

    filters.ratings.forEach(rating => {
      tags.push({ id: `rating-${rating}`, label: `${rating} Stars`, type: 'rating', value: rating });
    });

    return tags;
  }, [filters]);

  const handleRemoveTag = (tag: { type: string; value: any }) => {
    const nextFilters = { ...filters };
    if (tag.type === 'category') nextFilters.category = null;
    if (tag.type === 'brand') nextFilters.brands = nextFilters.brands.filter(b => b !== tag.value);
    if (tag.type === 'rating') nextFilters.ratings = nextFilters.ratings.filter(r => r !== tag.value);
    onFiltersChange(nextFilters);
  };

  const handleClearAll = () => {
    onFiltersChange({
      category: null,
      brands: [],
      priceRange: [0, 2000],
      condition: "Any",
      ratings: [],
    });
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Top Bar Desktop */}
      <div className="hidden md:flex w-full bg-white rounded-tile h-16 items-center justify-between pl-6 pr-3">
        <div className="flex items-center gap-4">
          <span className="text-[14px] text-subtle">
            <span className="font-semibold text-brand-charcoal tabular-nums">{count.toLocaleString()}</span> products found
            {filters.category && <span> in <span className="font-semibold text-brand-charcoal">{categoryLabel || filters.category}</span></span>}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Sort Dropdown */}
          <div className="flex items-center h-10 rounded-full pl-4 pr-3 bg-black/[0.04] cursor-pointer hover:bg-black/[0.08] transition-colors">
            <span className="text-[13px] text-brand-charcoal font-medium">Featured</span>
            <Icon name="expand_more" size="xs" className="text-faint ml-6" />
          </div>

          {/* View Switcher */}
          <div className="flex items-center gap-0.5 p-1 rounded-full bg-black/[0.04]">
            <button
              onClick={() => onViewModeChange("grid")}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${viewMode === "grid" ? "bg-white text-brand-orange-text shadow-[0_1px_3px_rgba(0,0,0,0.1)]" : "text-faint hover:text-brand-charcoal"}`}
            >
              <Icon name="grid_view" size="sm" />
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${viewMode === "list" ? "bg-white text-brand-orange-text shadow-[0_1px_3px_rgba(0,0,0,0.1)]" : "text-faint hover:text-brand-charcoal"}`}
            >
              <Icon name="list" size="sm" />
            </button>
          </div>
        </div>
      </div>

      {/* Top Bar Mobile (as per design image) */}
      <div className="flex md:hidden items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1">
          {/* Sort Button */}
          <button className="flex-1 flex items-center justify-between h-10 px-4 bg-white rounded-full text-[13px] font-medium text-brand-charcoal">
            <span>Sort: Newest</span>
            <Icon name="sort" size="xs" className="text-faint ml-2" />
          </button>

          {/* Filter Button */}
          <button
            onClick={onFilterClick}
            className="flex-1 flex items-center justify-between h-10 px-4 bg-white rounded-full text-[13px] font-medium text-brand-charcoal"
          >
            <div className="flex items-center gap-2">
              <span>Filter</span>
              {activeFilterTags.length > 0 && (
                <span className="bg-brand-charcoal text-white text-[11px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center tabular-nums">
                  {activeFilterTags.length}
                </span>
              )}
            </div>
            <Icon name="filter_alt" size="xs" className="text-faint" />
          </button>
        </div>

        {/* Mobile View Toggles */}
        <div className="flex items-center gap-0.5 p-1 bg-white rounded-full">
          <button
            onClick={() => onViewModeChange("grid")}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${viewMode === "grid" ? "bg-brand-charcoal text-white" : "text-faint"}`}
          >
            <Icon name="grid_view" size="sm" />
          </button>
          <button
            onClick={() => onViewModeChange("list")}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${viewMode === "list" ? "bg-brand-charcoal text-white" : "text-faint"}`}
          >
            <Icon name="list" size="sm" />
          </button>
        </div>
      </div>

      {/* Active Filter Tags */}
      {activeFilterTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {activeFilterTags.map((tag) => (
            <div
              key={tag.id}
              onClick={() => handleRemoveTag(tag)}
              className="flex items-center gap-1.5 pl-3.5 pr-2.5 h-8 rounded-full bg-white cursor-pointer hover:bg-black/[0.04] transition-colors group"
            >
              <span className="text-[13px] text-brand-charcoal">{tag.label}</span>
              <Icon name="clear" size="xs" className="text-faint group-hover:text-brand-charcoal transition-colors" />
            </div>
          ))}
          <button
            onClick={handleClearAll}
            className="text-brand-orange-text text-[13px] font-medium ml-2 hover:underline cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export { ListingControlBar };
