"use client";

import React, { useState, useCallback } from "react";
import { Icon } from "../Icon";
import { Radio } from "@/app/components/Form";
import Checkbox from "@/app/components/Checkbox";
import { RangeSlider } from "../Form/RangeSlider";
import { Rating } from "../Other/Rating";
import { BRANDS, CATEGORIES, POWER_TYPES, PRICE_MAX, PRICE_MIN } from "@/app/data/catalog";

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
    <div className="border-t border-hairline py-5 first:border-t-0 first:pt-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between mb-4 group"
      >
        <h4 className="font-semibold text-ink text-[14px]">
          {title}
        </h4>
        <Icon
          name="expand_more"
          size="xs"
          className={`text-gray-400 transform transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && <div className="flex flex-col gap-2">{children}</div>}
    </div>
  );
};

interface FilterSidebarProps {
  filters: {
    category: string | null;
    brands: string[];
    priceRange: [number, number];
    condition: string;
    ratings: number[];
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      category: string | null;
      brands: string[];
      priceRange: [number, number];
      condition: string;
      ratings: number[];
    }>
  >;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  setFilters,
}) => {
  const handleCategoryClick = useCallback(
    (category: string) => {
      setFilters((prev) => ({
        ...prev,
        category: prev.category === category ? null : category,
      }));
    },
    [setFilters],
  );

  const handleBrandToggle = useCallback(
    (brand: string) => {
      setFilters((prev) => ({
        ...prev,
        brands: prev.brands.includes(brand)
          ? prev.brands.filter((b) => b !== brand)
          : [...prev.brands, brand],
      }));
    },
    [setFilters],
  );

  const handleConditionChange = useCallback(
    (condition: string) => {
      setFilters((prev) => ({ ...prev, condition }));
    },
    [setFilters],
  );

  const handleRatingToggle = useCallback(
    (val: number) => {
      setFilters((prev) => ({
        ...prev,
        ratings: prev.ratings.includes(val)
          ? prev.ratings.filter((r) => r !== val)
          : [...prev.ratings, val],
      }));
    },
    [setFilters],
  );

  const handlePriceRangeChange = useCallback(
    (val: [number, number]) => {
      setFilters((prev) => ({ ...prev, priceRange: val }));
    },
    [setFilters],
  );

  const handleMinPriceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilters((prev) => ({
        ...prev,
        priceRange: [Number(e.target.value), prev.priceRange[1]],
      }));
    },
    [setFilters],
  );

  const handleMaxPriceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilters((prev) => ({
        ...prev,
        priceRange: [prev.priceRange[0], Number(e.target.value)],
      }));
    },
    [setFilters],
  );

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col gap-4">
      {/* Categories */}
      <FilterSection title="Category">
        <ul className="flex flex-col gap-2 text-sm">
          {CATEGORIES.map((cat) => (
            <li
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`cursor-pointer transition-colors ${filters.category === cat ? "text-ink font-semibold" : "text-gray-600 hover:text-ink"}`}
            >
              {cat}
            </li>
          ))}
        </ul>
      </FilterSection>

      {/* Brands */}
      <FilterSection title="Brand">
        {BRANDS.map((brand) => (
          <Checkbox
            key={brand}
            label={brand}
            checked={filters.brands.includes(brand)}
            onChange={() => handleBrandToggle(brand)}
            size="lg"
          />
        ))}
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price range">
        <div className="px-1 pt-2 pb-6">
          <RangeSlider
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={50000}
            value={filters.priceRange}
            onChange={handlePriceRangeChange}
          />
        </div>
        <div className="flex gap-2">
          <div className="flex flex-col gap-1 flex-1">
            <span className="text-xs text-gray-500">Min (₦)</span>
            <input
              type="number"
              value={filters.priceRange[0]}
              onChange={handleMinPriceChange}
              className="w-full border border-[#d2d2d7] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <span className="text-xs text-gray-500">Max (₦)</span>
            <input
              type="number"
              value={filters.priceRange[1]}
              onChange={handleMaxPriceChange}
              className="w-full border border-[#d2d2d7] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20"
            />
          </div>
        </div>
      </FilterSection>

      {/* Collection */}
      <FilterSection title="Power type">
        {POWER_TYPES.map(
          (cond) => (
            <Radio
              key={cond}
              name="condition"
              label={cond}
              checked={filters.condition === cond}
              onChange={() => handleConditionChange(cond)}
            />
          ),
        )}
      </FilterSection>

      {/* Ratings */}
      <FilterSection title="Ratings">
        {[5, 4, 3, 2].map((val) => (
          <div
            key={val}
            className="flex items-center gap-2 group cursor-pointer"
            onClick={() => handleRatingToggle(val)}
          >
            <Checkbox
              checked={filters.ratings.includes(val)}
              onChange={() => handleRatingToggle(val)}
              size="lg"
            />
            <Rating value={val} />
          </div>
        ))}
      </FilterSection>
    </aside>
  );
};

export { FilterSidebar };
