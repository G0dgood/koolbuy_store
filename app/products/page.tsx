"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { Icon } from "@/app/components/Icon";
import { FilterSidebar } from "@/app/components/Products/FilterSidebar";
import { ListingControlBar } from "@/app/components/Products/ListingControlBar";
import {
  ProductGridItem,
  ProductListItem,
} from "@/app/components/Products/ProductItems";
import { ProductMobileHeader } from "@/app/components/Products/ProductMobileHeader";
import { CategoryChips } from "@/app/components/Products/CategoryChips";
import { RecommendedProducts } from "@/app/components/Products/RecommendedProducts";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  CATEGORIES,
  PRICE_MAX,
  PRICE_MIN,
  PRODUCTS,
  getVendor,
  parsePrice,
} from "@/app/data/catalog";

interface FilterState {
  category: string | null;
  brands: string[]; // manufacturers (Koolboks, Scanfrost, ...)
  priceRange: [number, number];
  condition: string; // power type
  ratings: number[];
}

const ProductsPageContent = () => {
  const searchParams = useSearchParams();
  const vendorSlug = searchParams.get("vendor");
  const categoryParam = searchParams.get("category");
  const searchQuery = (searchParams.get("search") || "").trim().toLowerCase();
  const vendor = getVendor(vendorSlug);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    category: categoryParam,
    brands: [],
    priceRange: [PRICE_MIN, PRICE_MAX],
    condition: "Any",
    ratings: [],
  });

  // Keep the category filter in sync when the URL changes (e.g. clicking a home-page category tab)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilters((prev) => ({ ...prev, category: categoryParam }));
  }, [categoryParam]);

  const categories = CATEGORIES;

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      if (vendorSlug && vendor && product.vendor !== vendorSlug) return false;
      if (searchQuery && !product.title.toLowerCase().includes(searchQuery)) return false;
      if (filters.category && product.category !== filters.category) return false;
      if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) return false;

      const price = parsePrice(product.price);
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) return false;

      if (filters.condition !== "Any" && product.power !== filters.condition) return false;

      if (filters.ratings.length > 0) {
        const minRating = Math.min(...filters.ratings);
        if (product.rating < minRating) return false;
      }
      return true;
    });
  }, [filters, vendorSlug, vendor, searchQuery]);

  const recommended = useMemo(
    () =>
      PRODUCTS.filter((p) => !filteredProducts.includes(p))
        .slice(0, 4)
        .map(({ id, title, price, image }) => ({ id, title, price, image })),
    [filteredProducts],
  );

  const pageTitle = vendor?.name || filters.category || (searchQuery ? `Results for “${searchParams.get("search")}”` : "Shop");
  const unknownVendor = Boolean(vendorSlug && !vendor);

  return (
    <div className="min-h-screen bg-cream flex flex-col font-sans text-ink">
      {/* Desktop Header */}
      <Header className="hidden md:block" />

      {/* Mobile Header */}
      <ProductMobileHeader title={vendor?.name || filters.category || "All products"} />

      <div className="flex-1 max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-0 md:py-8 flex flex-col gap-0 md:gap-8 w-full">
        {/* Category Chips (Mobile only) */}
        <CategoryChips
          categories={categories}
          selectedCategory={filters.category}
          onSelect={(cat) => setFilters((prev) => ({ ...prev, category: cat }))}
          className="md:hidden"
        />

        {/* Breadcrumbs */}
        <div className="hidden md:flex items-center gap-1.5 text-[12px] text-gray-500 overflow-x-auto whitespace-nowrap scrollbar-none pt-2 px-4 md:px-0">
          <Link href="/" className="hover:text-ink hover:underline">
            Home
          </Link>
          <Icon name="chevron_right" size="xs" />
          <Link href="/products" className="hover:text-ink hover:underline">
            Products
          </Link>
          {vendor && (
            <>
              <Icon name="chevron_right" size="xs" />
              <span className="text-ink">{vendor.name}</span>
            </>
          )}
          {!vendor && filters.category && (
            <>
              <Icon name="chevron_right" size="xs" />
              <span className="text-ink">{filters.category}</span>
            </>
          )}
        </div>

        {/* Apple store-style page headline */}
        {vendor ? (
          /* Vendor storefront header */
          <div className="flex items-center gap-5 md:gap-6 px-4 md:px-0 pt-4 md:pt-0">
            <div className="relative w-16 h-16 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-cream shrink-0">
              <Image src={vendor.image} alt={vendor.name} fill className="object-cover" />
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <span className="text-[12px] md:text-[14px] font-semibold text-eyebrow">Verified vendor</span>
              <h1 className="text-[28px] md:text-[48px] font-semibold text-ink tracking-[-0.025em] leading-[1.07] truncate">
                {vendor.name}.
              </h1>
              <p className="text-[15px] md:text-[19px] text-gray-600">
                {vendor.location} · {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
              </p>
            </div>
          </div>
        ) : (
          <h1 className="hidden md:block text-[40px] lg:text-[48px] font-semibold tracking-[-0.025em] leading-[1.07] px-4 md:px-0">
            <span className="text-ink">{pageTitle}.</span>{" "}
            <span className="text-gray-500">The best way to buy cold storage.</span>
          </h1>
        )}

        {unknownVendor && (
          <p className="mx-4 md:mx-0 rounded-xl bg-cream px-4 py-3 text-[14px] text-gray-600">
            We couldn&apos;t find that vendor, so we&apos;re showing all products instead.
          </p>
        )}

        <div className="flex flex-col lg:flex-row gap-6 items-start px-4 md:px-0 mt-3 md:mt-0">
          {/* Sidebar (Desktop only) */}
          <div className="hidden lg:block w-full lg:w-64">
            <FilterSidebar filters={filters} setFilters={setFilters} />
          </div>

          {/* Listing Area */}
          <div className="flex-1 flex flex-col gap-4 w-full">
            <ListingControlBar
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              count={filteredProducts.length}
              filters={filters}
              onFiltersChange={setFilters}
              onFilterClick={() => setIsFilterDrawerOpen(true)}
            />

            <div
              className={`
                ${
                  viewMode === "grid"
                    ? "grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
                    : "flex flex-col gap-3 md:gap-4"
                }
              `}
            >
              {filteredProducts.map((product) =>
                viewMode === "grid" ? (
                  <ProductGridItem key={product.id} product={product} />
                ) : (
                  <ProductListItem key={product.id} product={product} />
                ),
              )}
            </div>

            {filteredProducts.length === 0 && (
              <div className="py-16 flex flex-col items-center text-center gap-3">
                <h2 className="text-[24px] font-semibold text-ink tracking-[-0.02em]">No products match.</h2>
                <p className="text-[17px] text-gray-600 max-w-md">
                  Try removing a filter or widening the price range.
                </p>
                <Link href="/products" className="kb-link text-[17px]">
                  See all products ›
                </Link>
              </div>
            )}

            {/* Recommended Products */}
            <RecommendedProducts products={recommended} />
          </div>
        </div>
      </div>

      <Footer />

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isFilterDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterDrawerOpen(false)}
              className="fixed inset-0 bg-black/50 z-[100] lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white z-[110] lg:hidden flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h2 className="text-lg font-bold">Filters</h2>
                <button
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Icon name="close" size="md" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <FilterSidebar filters={filters} setFilters={setFilters} />
              </div>
              <div className="p-4 border-t border-gray-100 flex gap-3">
                <button
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="flex-1 py-3 bg-action text-white rounded-full hover:bg-action-hover"
                >
                  Show Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProductsPage = () => (
  <Suspense fallback={<div className="min-h-screen bg-cream" />}>
    <ProductsPageContent />
  </Suspense>
);

export default ProductsPage;
