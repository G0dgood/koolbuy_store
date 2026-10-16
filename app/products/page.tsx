"use client";

import React, { useState, useEffect, useMemo, useRef, Suspense } from "react";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { Icon } from "@/app/components/Icon";
import { FilterSidebar } from "@/app/components/Products/FilterSidebar";
import { EmptyProductsIllustration } from "@/app/components/Products/EmptyProductsIllustration";
import { ListingControlBar } from "@/app/components/Products/ListingControlBar";
import {
  ProductGridItem,
  ProductListItem,
} from "@/app/components/Products/ProductItems";
import { ProductMobileHeader } from "@/app/components/Products/ProductMobileHeader";
import { CategoryChips } from "@/app/components/Products/CategoryChips";
import { RecommendedProducts } from "@/app/components/Products/RecommendedProducts";
import { Pagination } from "@/app/components/Navigation/Pagination";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useGetProductsQuery, type ApiProduct } from "@/lib/store/api/products-api";
import { useGetPublicCategoriesQuery } from "@/lib/store/api/categories-api";

interface FilterState {
  category: string | null;
  brands: string[];
  priceRange: [number, number];
  condition: string;
  ratings: number[];
}

interface DisplayProduct {
  id: string;
  title: string;
  price: string;
  originalPrice?: string;
  rating: number;
  orders: number;
  shipping: string;
  description: string;
  image: string;
  category: string;
  brand: string;
  condition: string;
}

const BASE_PRODUCTS: DisplayProduct[] = [
  {
    id: "1",
    title: "Kool - Scanfrost 600L Inverter Solar Freezer",
    price: "₦1,406,000.00",
    originalPrice: "₦1,550,000.00",
    rating: 4.9,
    orders: 342,
    shipping: "Nationwide Delivery",
    description:
      "High-capacity 600-litre commercial solar freezer with integrated inverter compressor, ice-bank refrigeration, and 72-hour power-outage thermal autonomy for food and drinks.",
    image: "/images/koolboks/items/5.webp",
    category: "Single Door Chest Freezers",
    brand: "Scanfrost",
    condition: "Brand New",
  },
  {
    id: "2",
    title: "Kool Scanfrost 60ah Pedestal Inverter System",
    price: "₦1,287,600.00",
    rating: 4.8,
    orders: 810,
    shipping: "Free Installation",
    description:
      "Dedicated plug-and-play pedestal solar power kit with 24V 60Ah lithium iron phosphate battery and intelligent PWM controller for continuous cooling appliances.",
    image: "/images/koolboks/items/1.webp",
    category: "Solar Batteries & Kits",
    brand: "Scanfrost",
    condition: "Brand New",
  },
  {
    id: "3",
    title: "200L AC/DC Hybrid Inverter Chest Freezer",
    price: "₦2,420,000.00",
    originalPrice: "₦2,650,000.00",
    rating: 4.7,
    orders: 540,
    shipping: "Fast Shipping",
    description:
      "Dual-powered hybrid solar chest freezer with smart energy switching between rooftop solar PV and backup battery storage. Thick cyclopentane insulation keeps perishables fresh.",
    image: "/images/koolboks/items/3.webp",
    category: "Single Door Chest Freezers",
    brand: "Koolboks",
    condition: "Brand New",
  },
  {
    id: "4",
    title: "Kool Bruhm 60ah Pedestal Solar Battery Unit",
    price: "₦1,287,600.00",
    rating: 4.6,
    orders: 450,
    shipping: "Nationwide Delivery",
    description:
      "Compact floor-standing energy storage solution designed specifically for retail store freezers, beverage coolers, and small business cooling systems.",
    image: "/images/koolboks/items/4.webp",
    category: "Solar Batteries & Kits",
    brand: "Bruhm",
    condition: "Brand New",
  },
  {
    id: "5",
    title: "Koolboks 600L AC Inverter Commercial Double Door Freezer",
    price: "₦1,468,000.00",
    originalPrice: "₦1,620,000.00",
    rating: 4.8,
    orders: 210,
    shipping: "Verified Logistics",
    description:
      "Commercial double-door chest freezer engineered for high-volume cold storage, fish and poultry retailers, and supermarkets. Low energy consumption with heavy-duty compressor.",
    image: "/images/koolboks/items/6.webp",
    category: "Double Door Chest Freezers",
    brand: "Koolboks",
    condition: "Brand New",
  },
  {
    id: "6",
    title: "Koolboks 538L Refurbished Certified Double Door Solar Freezer",
    price: "₦1,538,000.00",
    rating: 4.7,
    orders: 190,
    shipping: "Nationwide Delivery",
    description:
      "Factory-certified refurbished 538-litre solar deep freezer with full manufacturer warranty, overhauled compressor components, and factory-tested LiFePO4 battery pack.",
    image: "/images/koolboks/items/2.webp",
    category: "Double Door Chest Freezers",
    brand: "Koolboks",
    condition: "Refurbished",
  },
  {
    id: "7",
    title: "Commercial Heavy Duty Cold Room Deep Freezer 1000L",
    price: "₦3,850,000.00",
    rating: 4.9,
    orders: 95,
    shipping: "Nationwide Delivery",
    description:
      "Industrial grade cold-room deep freezer engineered for meat, seafood, and pharmaceutical cold chain storage with temperature ranges down to -25°C.",
    image: "/images/koolboks/items/5.webp",
    category: "Cold Room Freezers",
    brand: "Koolboks",
    condition: "Brand New",
  },
  {
    id: "8",
    title: "Kool Display Single Door Beverage Chiller 300L",
    price: "₦850,000.00",
    originalPrice: "₦920,000.00",
    rating: 4.8,
    orders: 310,
    shipping: "Nationwide Delivery",
    description:
      "Upright glass door beverage chiller with bright internal LED illumination, dynamic air circulation cooling, and low noise inverter compressor.",
    image: "/images/koolboks/items/3.webp",
    category: "Chiller",
    brand: "Scanfrost",
    condition: "Brand New",
  },
  {
    id: "9",
    title: "Upright Double Glass Door Display Cooler 650L",
    price: "₦1,450,000.00",
    rating: 4.7,
    orders: 145,
    shipping: "Fast Shipping",
    description:
      "High-visibility supermarket beverage cooler with double-glazed tempered glass and self-closing doors for optimum thermal efficiency.",
    image: "/images/koolboks/items/6.webp",
    category: "Chiller",
    brand: "Thermocool",
    condition: "Brand New",
  },
  {
    id: "10",
    title: "Commercial Upright Stainless Steel Deep Freezer 500L",
    price: "₦1,820,000.00",
    rating: 4.8,
    orders: 88,
    shipping: "Nationwide Delivery",
    description:
      "Vertical gastronorm upright commercial freezer made of 304 food-grade stainless steel with digital temperature controller.",
    image: "/images/koolboks/items/1.webp",
    category: "Upright Freezer",
    brand: "Bruhm",
    condition: "Brand New",
  },
  {
    id: "11",
    title: "Kool Pure Sine Wave Hybrid Solar Power Station 2.5kVA",
    price: "₦1,650,000.00",
    originalPrice: "₦1,800,000.00",
    rating: 4.9,
    orders: 260,
    shipping: "Free Installation",
    description:
      "High performance off-grid solar energy station with integrated MPPT charge controller and high-rate lithium storage for continuous business power.",
    image: "/images/koolboks/items/4.webp",
    category: "Power station",
    brand: "Koolboks",
    condition: "Brand New",
  },
  {
    id: "12",
    title: "Inverter Split Solar Hybrid Air Conditioner 1.5HP",
    price: "₦820,000.00",
    rating: 4.7,
    orders: 175,
    shipping: "Nationwide Delivery",
    description:
      "High-efficiency solar split inverter air conditioner capable of running directly from rooftop solar arrays with seamless grid backup.",
    image: "/images/koolboks/items/3.webp",
    category: "Air Conditioners",
    brand: "Scanfrost",
    condition: "Brand New",
  },
  {
    id: "13",
    title: "Standing Commercial Inverter Floor AC 2.0HP",
    price: "₦1,250,000.00",
    rating: 4.8,
    orders: 110,
    shipping: "Fast Shipping",
    description:
      "Floor-standing commercial column air conditioner designed for conference halls, shops, and large retail showrooms.",
    image: "/images/koolboks/items/2.webp",
    category: "Air Conditioners",
    brand: "Hisense",
    condition: "Brand New",
  },
  {
    id: "14",
    title: "Commercial Automatic Cube Ice Maker Machine (50kg/day)",
    price: "₦650,000.00",
    originalPrice: "₦720,000.00",
    rating: 4.8,
    orders: 220,
    shipping: "Nationwide Delivery",
    description:
      "Compact commercial ice machine with rapid crystal ice cycle, stainless steel finish, and automatic water inlet filtration.",
    image: "/images/koolboks/items/1.webp",
    category: "Ice Makers",
    brand: "Koolboks",
    condition: "Brand New",
  },
];

/** Matches a product's category to the active filter with resilient alias matching */
function matchCategory(productCategory: string, filterCategory: string): boolean {
  if (!filterCategory || filterCategory === "All" || filterCategory === "All Categories") {
    return true;
  }

  const p = productCategory.toLowerCase().trim();
  const f = filterCategory.toLowerCase().trim();

  // API category values are slugs ("fish_seafood"); compare letters and digits only
  // so they match labels like "Fish & Seafood".
  const norm = (v: string) => v.replace(/[^a-z0-9]/g, "");
  if (norm(p) && norm(p) === norm(f)) {
    return true;
  }

  // Exact or direct inclusion match
  if (p === f || p.includes(f) || f.includes(p)) {
    return true;
  }

  // Chest Freezers Family
  const isFreezerFilter =
    f.includes("freezer") || f.includes("chest") || f.includes("single-door");
  const isFreezerProduct =
    p.includes("freezer") || p.includes("chest");

  if (isFreezerFilter && isFreezerProduct) {
    if (f.includes("single") && (p.includes("single") || p.includes("solar"))) return true;
    if (f.includes("double") && p.includes("double")) return true;
    if (f.includes("cold room") || f.includes("commercial")) {
      return p.includes("cold room") || p.includes("commercial");
    }
    if (f === "chest freezers" || f === "all chest freezers" || f === "solar freezers") {
      return true;
    }
  }

  // Chillers & Coolers
  if (
    (f.includes("chiller") || f.includes("cooler") || f.includes("beverage")) &&
    (p.includes("chiller") || p.includes("cooler") || p.includes("beverage") || p.includes("upright"))
  ) {
    return true;
  }

  // Solar & Power Stations
  if (
    (f.includes("power") || f.includes("batter") || f.includes("station") || f.includes("solar")) &&
    (p.includes("power") || p.includes("batter") || p.includes("station") || p.includes("solar batteries"))
  ) {
    return true;
  }

  // Air Conditioners
  if (
    (f.includes("air") || f.includes("conditioner") || f.includes("ac")) &&
    (p.includes("air") || p.includes("conditioner") || p.includes("ac"))
  ) {
    return true;
  }

  // Ice Makers & Ice
  if (f.includes("ice") && p.includes("ice")) {
    return true;
  }

  // Fish & Seafood
  if (
    (f.includes("fish") || f.includes("seafood") || f.includes("tilapia") || f.includes("salmon")) &&
    (p.includes("fish") || p.includes("seafood") || p.includes("tilapia") || p.includes("salmon"))
  ) {
    return true;
  }

  // Inverter Refrigerators
  if (
    f.includes("refrigerator") &&
    (p.includes("refrigerator") || p.includes("freezer") || p.includes("chiller"))
  ) {
    return true;
  }

  return false;
}

const CHIPS_CATEGORIES = [
  "All",
  "Single Door Chest Freezers",
  "Double Door Chest Freezers",
  "Chillers & Coolers",
  "Solar & Power",
  "Air Conditioners",
  "Ice Makers",
  "Fish & Seafood",
  "Ice Blocks",
];

const ProductsContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("search");
  const sortParam = searchParams.get("sort");
  const vendorParam = searchParams.get("vendor");

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Sticky sidebar without its own scrollbar: pin it under the header when it
  // fits; when it's taller than the screen, let it scroll with the page and pin
  // once its last filter is in view.
  const HEADER_OFFSET = 116;
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [sidebarTop, setSidebarTop] = useState(HEADER_OFFSET);
  useEffect(() => {
    const el = sidebarRef.current;
    if (!el) return;
    const update = () =>
      setSidebarTop(Math.min(HEADER_OFFSET, window.innerHeight - el.offsetHeight - 16));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    category: categoryParam || null,
    brands: [],
    priceRange: [0, 5000000],
    condition: "Any",
    ratings: [],
  });

  // Sync state with URL category parameter
  useEffect(() => {
    if (categoryParam) {
      setFilters((prev) => ({ ...prev, category: categoryParam }));
    } else {
      setFilters((prev) => ({ ...prev, category: null }));
    }
  }, [categoryParam]);

  // Fetch live storefront products from backend
  // Show the category's label (from the API), not its slug, in titles
  const { data: categoriesData } = useGetPublicCategoriesQuery();
  const categoryLabel =
    categoriesData?.items?.find((c) => c.value === filters.category)?.label ?? filters.category;

  // The products endpoint filters by category label ("Fish & Seafood"), not slug
  const { data: apiData } = useGetProductsQuery({
    category: categoryLabel || undefined,
    search: searchParam || undefined,
  });

  // Merge live API products with showcase catalog
  const allProducts = useMemo<DisplayProduct[]>(() => {
    const liveItems: DisplayProduct[] = [];
    const rawItems: ApiProduct[] = Array.isArray(apiData)
      ? apiData
      : apiData?.items || apiData?.results || [];

    if (rawItems && rawItems.length > 0) {
      for (const item of rawItems) {
        liveItems.push({
          id: item.id,
          title: item.name || item.title || "Storefront Product",
          price:
            typeof item.price === "number"
              ? `₦${item.price.toLocaleString()}`
              : String(item.price || "₦0.00"),
          rating: Number(item.rating) || 4.8,
          orders: Number(item.orders) || 85,
          shipping:
            Number(item.shipping_fee) === 0
              ? "Free Shipping"
              : "Nationwide Delivery",
          description:
            item.description ||
            "Authentic verified equipment from registered merchant.",
          image: item.image || "/images/koolboks/items/1.webp",
          category: item.category || "General",
          brand:
            typeof item.vendor === "object" && item.vendor && "name" in item.vendor
              ? String((item.vendor as { name: string }).name)
              : String(item.brand || "Koolbuy Merchant"),
          condition: item.condition || "Brand New",
        });
      }
    }

    return [...liveItems, ...BASE_PRODUCTS];
  }, [apiData]);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // Category filter
      if (
        filters.category &&
        !matchCategory(product.category, filters.category)
      ) {
        return false;
      }

      // Search query filter
      if (searchParam && searchParam.trim()) {
        const q = searchParam.toLowerCase().trim();
        const matchesTitle = product.title.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        const matchesCat = product.category.toLowerCase().includes(q);
        const matchesBrand = product.brand.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesCat && !matchesBrand) {
          return false;
        }
      }

      // Brand filter
      if (
        filters.brands.length > 0 &&
        !filters.brands.some((b) =>
          product.brand.toLowerCase().includes(b.toLowerCase())
        )
      ) {
        return false;
      }

      // Price filter
      const price = parseFloat(product.price.replace(/[₦$,]/g, ""));
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
        return false;
      }

      // Condition filter
      if (
        filters.condition !== "Any" &&
        product.condition.toLowerCase() !== filters.condition.toLowerCase()
      ) {
        return false;
      }

      // Rating filter
      if (filters.ratings.length > 0) {
        const minRating = Math.min(...filters.ratings);
        if (product.rating < minRating) return false;
      }

      // Sort modifier if provided in URL
      if (sortParam === "refurbished" && product.condition !== "Refurbished") {
        return false;
      }

      return true;
    });
  }, [filters, allProducts, searchParam, sortParam]);

  const handleSelectCategory = (cat: string) => {
    if (!cat || cat === "All" || cat === "All Categories") {
      setFilters((prev) => ({ ...prev, category: null }));
      router.push("/products");
    } else {
      setFilters((prev) => ({ ...prev, category: cat }));
      router.push(`/products?category=${encodeURIComponent(cat)}`);
    }
  };

  return (
    <div className="min-h-screen bg-off-white flex flex-col font-sans text-black">
      {/* Desktop Header */}
      <Header className="hidden md:block" />

      {/* Mobile Header */}
      <ProductMobileHeader
        title={categoryLabel || (searchParam ? `Search: "${searchParam}"` : "All Categories")}
      />

      <div className="flex-1 w-full max-w-360 mx-auto px-0 md:px-8 lg:px-10 xl:px-14 py-0 md:py-6 flex flex-col gap-0 md:gap-6">
        {/* Category Chips (Mobile & Tablet horizontal scroll) */}
        <CategoryChips
          categories={CHIPS_CATEGORIES}
          selectedCategory={filters.category || "All"}
          onSelect={handleSelectCategory}
          className="md:hidden"
        />

        {/* Clean Breadcrumbs */}
        <div className="hidden md:flex items-center gap-1.5 text-[12px] text-faint overflow-x-auto whitespace-nowrap scrollbar-none px-4 sm:px-6 md:px-0">
          <Link
            href="/"
            className="hover:text-brand-charcoal transition-colors font-medium"
          >
            Home
          </Link>
          <span aria-hidden="true" className="text-gray-300">
            ›
          </span>
          <Link
            href="/products"
            onClick={() => handleSelectCategory("All")}
            className="hover:text-brand-charcoal transition-colors font-medium"
          >
            Catalog
          </Link>
          <span aria-hidden="true" className="text-gray-300">
            ›
          </span>
          <span className="text-brand-orange-text font-semibold">
            {categoryLabel || (searchParam ? `"${searchParam}"` : "All Categories")}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start px-4 sm:px-6 md:px-0 mt-3 md:mt-0">
          {/* Sidebar (Desktop) */}
          <div ref={sidebarRef} style={{ top: sidebarTop }} className="hidden lg:block w-full lg:w-64 shrink-0 lg:sticky self-start">
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
            />
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
              categoryLabel={categoryLabel}
            />

            {/* Active Category Header Banner if filtered */}
            {filters.category && (
              <div className="bg-white rounded-2xl border border-black/[0.06] p-4 md:p-5 flex items-center justify-between gap-4 shadow-xs">
                <div>
                  <h1 className="text-lg md:text-xl font-bold text-brand-charcoal tracking-[-0.02em]">
                    {categoryLabel}
                  </h1>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Showing verified products matching &ldquo;{categoryLabel}&rdquo;
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectCategory("All")}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full bg-black/[0.04] hover:bg-black/[0.08] text-gray-700 transition-colors"
                >
                  Clear Category
                </button>
              </div>
            )}

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-black/[0.06] p-12 text-center flex flex-col items-center justify-center gap-3">
                <EmptyProductsIllustration className="w-44 h-36 sm:w-52 sm:h-44" />
                <h3 className="text-base font-semibold text-gray-800">
                  No products found
                </h3>
                <p className="text-xs text-gray-500 max-w-sm">
                  We couldn&rsquo;t find any products in &ldquo;{categoryLabel || "this selection"}&rdquo;. Try browsing all categories or adjusting your filters.
                </p>
                <button
                  type="button"
                  onClick={() => handleSelectCategory("All")}
                  className="mt-2 text-xs font-medium px-4 py-2 rounded-full bg-brand-charcoal text-white hover:bg-brand-charcoal/85 transition-colors"
                >
                  View All Products
                </button>
              </div>
            ) : (
              <div
                className={`
                  ${viewMode === "grid"
                    ? "grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5"
                    : "flex flex-col gap-3 md:gap-4"
                  }
                `}
              >
                {filteredProducts.map((product) =>
                  viewMode === "grid" ? (
                    <ProductGridItem key={product.id} product={product} />
                  ) : (
                    <ProductListItem key={product.id} product={product} />
                  )
                )}
              </div>
            )}

            {/* Bottom Pagination */}
            <div className="mt-4 flex justify-end px-4 sm:px-6 md:px-0">
              <Pagination
                totalPages={Math.max(1, Math.ceil(filteredProducts.length / 10))}
                currentPage={1}
                onPageChange={() => { }}
              />
            </div>

            {/* Recommended Products */}
            <RecommendedProducts
              products={[
                {
                  id: "r1",
                  title: "Kool - Scanfrost 600L Inverter Solar Freezer",
                  price: "₦1,406,000.00",
                  image: "/images/koolboks/items/5.webp",
                },
                {
                  id: "r2",
                  title: "Kool Scanfrost 60ah Pedestal Inverter System",
                  price: "₦1,287,600.00",
                  image: "/images/koolboks/items/1.webp",
                },
                {
                  id: "r3",
                  title: "200L AC/DC Hybrid Inverter Chest Freezer",
                  price: "₦2,420,000.00",
                  image: "/images/koolboks/items/3.webp",
                },
                {
                  id: "r4",
                  title: "Commercial Automatic Cube Ice Maker Machine (50kg/day)",
                  price: "₦650,000.00",
                  image: "/images/koolboks/items/1.webp",
                },
              ]}
            />
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
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-100 lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-off-white z-110 lg:hidden flex flex-col rounded-l-[22px] overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-black/[0.06]">
                <h2 className="text-[16px] font-semibold text-brand-charcoal tracking-[-0.02em]">
                  Filters
                </h2>
                <button
                  type="button"
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="w-9 h-9 flex items-center justify-center bg-black/[0.04] hover:bg-black/[0.08] text-brand-charcoal rounded-full transition-colors"
                >
                  <Icon name="close" size="md" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-3">
                <FilterSidebar filters={filters} setFilters={setFilters} />
              </div>
              <div className="p-4 bg-white border-t border-black/[0.06] flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="flex-1 py-3 bg-brand-charcoal text-white text-[15px] font-medium rounded-full hover:bg-brand-charcoal/90 transition-colors"
                >
                  Show results ({filteredProducts.length})
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-off-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange-text" />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
