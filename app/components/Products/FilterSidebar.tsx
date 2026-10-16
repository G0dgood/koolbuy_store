"use client";

import React, { useState, useCallback } from "react";
import { Icon } from "../Icon";
import { Radio } from "@/app/components/Form";
import Checkbox from "@/app/components/Checkbox";
import { RangeSlider } from "../Form/RangeSlider";
import { Rating } from "../Other/Rating";
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
  const { data: categoriesData, isLoading: isLoadingCategories } = useGetPublicCategoriesQuery();
  const handleCategoryClick = useCallback(
    (category: string) => {
      setFilters((prev) => ({
        ...prev,
        category: !category || prev.category === category ? null : category,
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
    <aside className="w-full lg:w-64 flex-shrink-0 flex flex-col bg-white rounded-tile border border-light-gray px-5 py-1">
      {/* Categories */}
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
                ? !filters.category
                : filters.category === cat.value || filters.category === cat.label;
              return (
                <li
                  key={cat.value || "all"}
                  onClick={() => handleCategoryClick(cat.value)}
                  className={`cursor-pointer transition-colors flex items-center justify-between ${
                    isActive
                      ? "text-brand-orange-text font-semibold"
                      : "text-subtle hover:text-brand-charcoal"
                  }`}
                >
                  <span>{cat.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-orange-text" />
                  )}
                </li>
              );
            })}
        </ul>
      </FilterSection>

      {/* Brands */}
      <FilterSection title="Brands">
        {["Koolboks", "Scanfrost", "Thermocool", "Bruhm", "Hisense"].map((brand) => (
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
      <FilterSection title="Price range (₦)">
        <div className="pt-1 pb-3">
          <RangeSlider
            min={0}
            max={5000000}
            step={50000}
            value={filters.priceRange}
            onChange={handlePriceRangeChange}
          />
        </div>
        <div className="flex gap-2">
          <div className="flex flex-col gap-1 flex-1">
            <span className="text-[12px] text-faint">Min (₦)</span>
            <input
              type="number"
              value={filters.priceRange[0]}
              onChange={handleMinPriceChange}
              className="w-full h-9 bg-black/[0.04] border border-transparent rounded-xl px-3 text-[14px] text-brand-charcoal tabular-nums outline-none transition-colors focus:bg-white focus:border-light-gray"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <span className="text-[12px] text-faint">Max (₦)</span>
            <input
              type="number"
              value={filters.priceRange[1]}
              onChange={handleMaxPriceChange}
              className="w-full h-9 bg-black/[0.04] border border-transparent rounded-xl px-3 text-[14px] text-brand-charcoal tabular-nums outline-none transition-colors focus:bg-white focus:border-light-gray"
            />
          </div>
        </div>
      </FilterSection>

      {/* Collection */}
      <FilterSection title="Collection type">
        {["Any", "Intense", "Discovery", "Essential", "Seasonal"].map(
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
