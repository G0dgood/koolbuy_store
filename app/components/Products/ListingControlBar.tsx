"use client";

import React from "react";
import { Icon } from "../Icon";
import type { StorefrontOrdering } from "@/lib/store/api/storefront-api";

export interface ActiveFilterTag {
  id: string;
  label: string;
  onRemove: () => void;
}

const SORT_OPTIONS: { value: StorefrontOrdering; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
];

interface ListingControlBarProps {
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  /** Total matching products across all pages (null while loading) */
  count: number | null;
  sort: StorefrontOrdering;
  onSortChange: (sort: StorefrontOrdering) => void;
  tags: ActiveFilterTag[];
  onClearAll: () => void;
  onFilterClick?: () => void;
  /** Display name for the active category */
  categoryLabel?: string | null;
}

/** Native select styled as a pill; the arrow is drawn on top */
function SortSelect({
  sort,
  onSortChange,
  className,
  prefix = "",
}: {
  sort: StorefrontOrdering;
  onSortChange: (sort: StorefrontOrdering) => void;
  className: string;
  prefix?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <select
        aria-label="Sort products"
        value={sort}
        onChange={(e) => onSortChange(e.target.value as StorefrontOrdering)}
        className="appearance-none w-full h-10 rounded-full pl-4 pr-9 bg-inherit text-[13px] text-brand-charcoal font-medium cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/50"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {prefix}
            {o.label}
          </option>
        ))}
      </select>
      <Icon
        name="expand_more"
        size="xs"
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-faint"
      />
    </div>
  );
}

const ListingControlBar: React.FC<ListingControlBarProps> = ({
  viewMode,
  onViewModeChange,
  count,
  sort,
  onSortChange,
  tags,
  onClearAll,
  onFilterClick,
  categoryLabel,
}) => {
  return (
    <div className="w-full flex flex-col gap-4">
      {/* Top Bar Desktop */}
      <div className="hidden md:flex w-full bg-white rounded-tile h-16 items-center justify-between pl-6 pr-3">
        <div className="flex items-center gap-4">
          {count === null ? (
            <span aria-hidden="true" className="h-4 w-40 rounded-full bg-black/[0.04] animate-pulse" />
          ) : (
            <span className="text-[14px] text-subtle">
              <span className="font-semibold text-brand-charcoal tabular-nums">{count.toLocaleString()}</span>{" "}
              {count === 1 ? "product" : "products"} found
              {categoryLabel && (
                <span>
                  {" "}in <span className="font-semibold text-brand-charcoal">{categoryLabel}</span>
                </span>
              )}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <SortSelect
            sort={sort}
            onSortChange={onSortChange}
            className="bg-black/[0.04] hover:bg-black/[0.08] rounded-full transition-colors"
          />

          {/* View Switcher */}
          <div className="flex items-center gap-0.5 p-1 rounded-full bg-black/[0.04]">
            <button
              type="button"
              aria-label="Grid view"
              aria-pressed={viewMode === "grid"}
              onClick={() => onViewModeChange("grid")}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${viewMode === "grid" ? "bg-white text-brand-orange-text shadow-[0_1px_3px_rgba(0,0,0,0.1)]" : "text-faint hover:text-brand-charcoal"}`}
            >
              <Icon name="grid_view" size="sm" />
            </button>
            <button
              type="button"
              aria-label="List view"
              aria-pressed={viewMode === "list"}
              onClick={() => onViewModeChange("list")}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${viewMode === "list" ? "bg-white text-brand-orange-text shadow-[0_1px_3px_rgba(0,0,0,0.1)]" : "text-faint hover:text-brand-charcoal"}`}
            >
              <Icon name="list" size="sm" />
            </button>
          </div>
        </div>
      </div>

      {/* Top Bar Mobile */}
      <div className="flex md:hidden items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <SortSelect
            sort={sort}
            onSortChange={onSortChange}
            prefix="Sort: "
            className="flex-1 min-w-0 bg-white rounded-full"
          />

          {/* Filter Button */}
          {onFilterClick && (
            <button
              type="button"
              onClick={onFilterClick}
              className="flex-1 flex items-center justify-between h-10 px-4 bg-white rounded-full text-[13px] font-medium text-brand-charcoal"
            >
              <div className="flex items-center gap-2">
                <span>Filter</span>
                {tags.length > 0 && (
                  <span className="bg-brand-charcoal text-white text-[11px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center tabular-nums">
                    {tags.length}
                  </span>
                )}
              </div>
              <Icon name="filter_alt" size="xs" className="text-faint" />
            </button>
          )}
        </div>

        {/* Mobile View Toggles */}
        <div className="flex items-center gap-0.5 p-1 bg-white rounded-full">
          <button
            type="button"
            aria-label="Grid view"
            aria-pressed={viewMode === "grid"}
            onClick={() => onViewModeChange("grid")}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${viewMode === "grid" ? "bg-brand-charcoal text-white" : "text-faint"}`}
          >
            <Icon name="grid_view" size="sm" />
          </button>
          <button
            type="button"
            aria-label="List view"
            aria-pressed={viewMode === "list"}
            onClick={() => onViewModeChange("list")}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${viewMode === "list" ? "bg-brand-charcoal text-white" : "text-faint"}`}
          >
            <Icon name="list" size="sm" />
          </button>
        </div>
      </div>

      {/* Active Filter Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {tags.map((tag) => (
            <button
              type="button"
              key={tag.id}
              onClick={tag.onRemove}
              aria-label={`Remove filter ${tag.label}`}
              className="flex items-center gap-1.5 pl-3.5 pr-2.5 h-8 rounded-full bg-white cursor-pointer hover:bg-black/[0.04] transition-colors group"
            >
              <span className="text-[13px] text-brand-charcoal">{tag.label}</span>
              <Icon name="clear" size="xs" className="text-faint group-hover:text-brand-charcoal transition-colors" />
            </button>
          ))}
          <button
            type="button"
            onClick={onClearAll}
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
