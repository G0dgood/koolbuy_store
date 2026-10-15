"use client";

import React, { useState, useCallback } from "react";
import { Icon } from "../Icon";
import { Radio } from "@/app/components/Form";
import Checkbox from "@/app/components/Checkbox";
import { RangeSlider } from "../Form/RangeSlider";
import { Rating } from "../Other/Rating";

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
    <aside className="w-full lg:w-64 flex-shrink-0 flex flex-col bg-white rounded-[22px] px-5 py-1">
      {/* Categories */}
      <FilterSection title="Category">
        <ul className="flex flex-col gap-2.5 text-[14px]">
          {[
            "Signature Fragrance",
            "Luxury Skincare",
            "Boutique Gift Sets",
            "Body & Bath",
            "Home Fragrance",
          ].map((cat) => (
            <li
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`cursor-pointer transition-colors ${filters.category === cat ? "text-brand-orange-text font-semibold" : "text-subtle hover:text-brand-charcoal"}`}
            >
              {cat}
            </li>
          ))}
          <li className="text-[13px] text-brand-orange-text font-medium mt-1 cursor-pointer hover:underline">
            View all boutique
          </li>
        </ul>
      </FilterSection>

      {/* Brands */}
      <FilterSection title="Artisanal houses">
        {["Koolbuy Store", "Prada", "Versace", "Gucci", "Dior"].map((brand) => (
          <Checkbox
            key={brand}
            label={brand}
            checked={filters.brands.includes(brand)}
            onChange={() => handleBrandToggle(brand)}
            size="lg"
          />
        ))}
        <span className="text-brand-orange-text text-[13px] font-medium mt-1 cursor-pointer hover:underline">
          View all houses
        </span>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price range">
        <div className="px-1 pt-2 pb-6">
          <RangeSlider
            min={0}
            max={2000}
            step={10}
            value={filters.priceRange}
            onChange={handlePriceRangeChange}
          />
        </div>
        <div className="flex gap-2">
          <div className="flex flex-col gap-1 flex-1">
            <span className="text-[12px] text-faint">Min</span>
            <input
              type="number"
              value={filters.priceRange[0]}
              onChange={handleMinPriceChange}
              className="w-full h-9 bg-black/[0.04] border border-transparent rounded-xl px-3 text-[14px] text-brand-charcoal tabular-nums outline-none transition-colors focus:bg-white focus:border-light-gray"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <span className="text-[12px] text-faint">Max</span>
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
