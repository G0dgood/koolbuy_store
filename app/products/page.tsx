"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback, Suspense } from "react";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { Icon } from "@/app/components/Icon";
import { FilterSidebar } from "@/app/components/Products/FilterSidebar";
import { ListingControlBar, type ActiveFilterTag } from "@/app/components/Products/ListingControlBar";
import {
  ProductGridItem,
  ProductListItem,
} from "@/app/components/Products/ProductItems";
import { ProductMobileHeader } from "@/app/components/Products/ProductMobileHeader";
import { TabFilter } from "@/app/components/Tabs";
import { RecommendedProducts } from "@/app/components/Products/RecommendedProducts";
import { Pagination } from "@/app/components/Navigation/Pagination";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useGetPublicCategoriesQuery } from "@/lib/store/api/categories-api";
import {
  formatNaira,
  useGetStorefrontProductsQuery,
  type StorefrontOrdering,
  type StorefrontProduct,
} from "@/lib/store/api/storefront-api";
import { apiErrorMessage } from "@/lib/store/base-api";
import { EmptyState } from "@/app/components/EmptyState";

const PAGE_SIZE = 12;

const SORTS: StorefrontOrdering[] = ["newest", "price_asc", "price_desc"];

interface DisplayProduct {
  id: string;
  title: string;
  price: string;
  rating: number;
  shipping: string;
  description: string;
  image: string | null;
}

function toDisplayProduct(p: StorefrontProduct): DisplayProduct {
  return {
    id: p.id,
    title: p.name,
    price: formatNaira(p.price),
    rating: Number(p.rating) || 0,
    shipping: Number(p.shipping_fee) > 0 ? `Shipping ${formatNaira(p.shipping_fee)}` : "Free shipping",
    description: p.description,
    image: p.image,
  };
}

const ProductsContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("search")?.trim() || null;
  const vendorParam = searchParams.get("vendor")?.trim() || null;
  const sortParam = searchParams.get("sort");
  const sort: StorefrontOrdering = SORTS.includes(sortParam as StorefrontOrdering)
    ? (sortParam as StorefrontOrdering)
    : "newest";
  const page = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1);

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

  /** Updates the URL query; any filter change goes back to page 1 */
  const updateParams = useCallback(
    (patch: Record<string, string | null>, keepPage = false) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [k, v] of Object.entries(patch)) {
        if (v) next.set(k, v);
        else next.delete(k);
      }
      if (!keepPage) next.delete("page");
      const qs = next.toString();
      router.push(qs ? `/products?${qs}` : "/products");
    },
    [router, searchParams],
  );

  // The URL may hold a category slug ("fish_seafood") or a label; the products
  // endpoint filters by label ("Fish & Seafood")
  const { data: categoriesData, isLoading: isLoadingCategories } = useGetPublicCategoriesQuery();
  const categories = useMemo(() => categoriesData?.items ?? [], [categoriesData]);
  const activeCategory = categoryParam
    ? categories.find((c) => c.value === categoryParam || c.label === categoryParam)
    : undefined;
  const categoryLabel = activeCategory?.label ?? categoryParam;

  const { data, isLoading, isFetching, isError, error, refetch } = useGetStorefrontProductsQuery(
    {
      category: categoryLabel || undefined,
      search: searchParam || undefined,
      vendor_id: vendorParam || undefined,
      ordering: sort,
      page,
      page_size: PAGE_SIZE,
    },
    // wait for the slug→label lookup so the first request uses the label
    { skip: !!categoryParam && isLoadingCategories },
  );

  const products = useMemo(() => (data?.items ?? []).map(toDisplayProduct), [data]);
  const total = data?.pagination?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const isLoadingList = isLoading || (isFetching && !data) || (!!categoryParam && isLoadingCategories);

  // "You may also like": newest products not already on this page
  const { data: newestData } = useGetStorefrontProductsQuery({ ordering: "newest", page_size: 8 });
  const recommended = useMemo(() => {
    const shown = new Set(products.map((p) => p.id));
    return (newestData?.items ?? [])
      .filter((p) => !shown.has(p.id))
      .slice(0, 4)
      .map((p) => ({ id: p.id, title: p.name, price: formatNaira(p.price), image: p.image }));
  }, [newestData, products]);

  const vendorName =
    (vendorParam && data?.items?.find((p) => p.vendor?.id === vendorParam)?.vendor?.name) || "Selected vendor";
  const hasFilters = !!(categoryParam || searchParam || vendorParam);

  const handleSelectCategory = (value: string | null) => updateParams({ category: value });

  const tags: ActiveFilterTag[] = [
    ...(categoryParam
      ? [{ id: "category", label: categoryLabel || categoryParam, onRemove: () => updateParams({ category: null }) }]
      : []),
    ...(searchParam
      ? [{ id: "search", label: `"${searchParam}"`, onRemove: () => updateParams({ search: null }) }]
      : []),
    ...(vendorParam
      ? [{ id: "vendor", label: vendorName, onRemove: () => updateParams({ vendor: null }) }]
      : []),
  ];
  const clearAll = () => updateParams({ category: null, search: null, vendor: null });

  const title = categoryLabel || (searchParam ? `Search: "${searchParam}"` : "All Categories");

  return (
    <div className="min-h-screen bg-off-white flex flex-col font-sans text-black">
      {/* Desktop Header */}
      <Header className="hidden md:block" />

      {/* Mobile Header */}
      <ProductMobileHeader title={title} />

      <div className="flex-1 w-full max-w-360 mx-auto px-0 md:px-8 lg:px-10 xl:px-14 py-0 md:py-6 flex flex-col gap-0 md:gap-6">
        {/* Category tabs (mobile & tablet; scroll sideways) */}
        {categories.length > 0 && (
          <div className="md:hidden px-4 py-3 bg-white">
            <TabFilter
              ariaLabel="Product categories"
              options={[{ value: "", label: "All" }, ...categories.map((c) => ({ value: c.value, label: c.label }))]}
              activeTab={activeCategory?.value ?? (categoryParam ? categoryParam : "")}
              onChange={(value) => handleSelectCategory(value || null)}
            />
          </div>
        )}

        {/* Clean Breadcrumbs */}
        <div className="hidden md:flex items-center gap-1.5 text-[12px] text-faint overflow-x-auto whitespace-nowrap scrollbar-none px-4 sm:px-6 md:px-0">
          <Link
            href="/"
            className="hover:text-brand-charcoal transition-colors font-medium"
          >
            Home
          </Link>
          <span aria-hidden="true" className="text-medium-gray">
            ›
          </span>
          <Link
            href="/products"
            className="hover:text-brand-charcoal transition-colors font-medium"
          >
            Catalog
          </Link>
          <span aria-hidden="true" className="text-medium-gray">
            ›
          </span>
          <span className="text-brand-orange-text font-semibold">
            {categoryLabel || (searchParam ? `"${searchParam}"` : "All Categories")}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start px-4 sm:px-6 md:px-0 mt-3 md:mt-0">
          {/* Sidebar (Desktop) */}
          <div ref={sidebarRef} style={{ top: sidebarTop }} className="hidden lg:block w-full lg:w-64 shrink-0 lg:sticky self-start">
            <FilterSidebar selectedCategory={categoryParam} onSelectCategory={handleSelectCategory} />
          </div>

          {/* Listing Area */}
          <div className="flex-1 flex flex-col gap-4 w-full">
            <ListingControlBar
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              count={isLoadingList || isError ? null : total}
              sort={sort}
              onSortChange={(next) => updateParams({ sort: next === "newest" ? null : next })}
              tags={tags}
              onClearAll={clearAll}
              onFilterClick={() => setIsFilterDrawerOpen(true)}
              categoryLabel={categoryLabel}
            />

            {/* Active Category Header Banner if filtered */}
            {categoryParam && (
              <div className="bg-white rounded-tile border border-light-gray p-4 md:p-5 flex items-center justify-between gap-4">
                <div>
                  <h1 className="text-lg md:text-xl font-semibold text-brand-charcoal tracking-[-0.02em]">
                    {categoryLabel}
                  </h1>
                  <p className="text-xs text-faint mt-0.5">
                    Showing verified products matching &ldquo;{categoryLabel}&rdquo;
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectCategory(null)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full bg-black/[0.04] hover:bg-black/[0.08] text-subtle transition-colors"
                >
                  Clear Category
                </button>
              </div>
            )}

            {isLoadingList ? (
              <div
                aria-hidden="true"
                className={viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5" : "flex flex-col gap-3 md:gap-4"}
              >
                {Array.from({ length: 6 }).map((_, i) =>
                  viewMode === "grid" ? (
                    <div key={i} className="bg-white rounded-tile border border-light-gray overflow-hidden">
                      <div className="w-full aspect-[4/3] bg-black/[0.04] animate-pulse" />
                      <div className="p-4 flex flex-col gap-2">
                        <div className="h-4 w-4/5 rounded-full bg-black/[0.04] animate-pulse" />
                        <div className="h-4 w-2/5 rounded-full bg-black/[0.04] animate-pulse" />
                      </div>
                    </div>
                  ) : (
                    <div key={i} className="bg-white rounded-tile border border-light-gray overflow-hidden flex gap-4">
                      <div className="w-32 md:w-48 min-h-32 md:min-h-48 bg-black/[0.04] animate-pulse" />
                      <div className="flex-1 py-4 pr-4 flex flex-col gap-2">
                        <div className="h-4 w-3/5 rounded-full bg-black/[0.04] animate-pulse" />
                        <div className="h-4 w-1/4 rounded-full bg-black/[0.04] animate-pulse" />
                      </div>
                    </div>
                  ),
                )}
              </div>
            ) : isError ? (
              <EmptyState
                variant="card"
                illustration="server"
                title="Couldn't load products"
                description={apiErrorMessage(error, "We couldn't load products.")}
                action={{ label: "Try again", onClick: () => refetch() }}
              />
            ) : products.length === 0 ? (
              hasFilters ? (
                <EmptyState
                  variant="card"
                  illustration="search"
                  title="No matches"
                  description="No products match these filters yet. Try another category or search."
                  action={{ label: "View all products", onClick: clearAll }}
                />
              ) : (
                <EmptyState
                  variant="card"
                  illustration="products"
                  title="No products yet"
                  description="Products will appear here once vendors list them."
                />
              )
            ) : (
              <div
                className={`
                  ${viewMode === "grid"
                    ? "grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5"
                    : "flex flex-col gap-3 md:gap-4"
                  }
                  ${isFetching ? "opacity-60 transition-opacity" : ""}
                `}
              >
                {products.map((product) =>
                  viewMode === "grid" ? (
                    <ProductGridItem key={product.id} product={product} />
                  ) : (
                    <ProductListItem key={product.id} product={product} />
                  )
                )}
              </div>
            )}

            {/* Bottom Pagination (server pages) */}
            {!isLoadingList && !isError && totalPages > 1 && (
              <div className="mt-4 flex justify-end px-4 sm:px-6 md:px-0">
                <Pagination
                  totalPages={totalPages}
                  currentPage={Math.min(page, totalPages)}
                  onPageChange={(next) => updateParams({ page: next > 1 ? String(next) : null }, true)}
                />
              </div>
            )}

            {/* Recommended Products (mobile) */}
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
                <FilterSidebar
                  selectedCategory={categoryParam}
                  onSelectCategory={(value) => {
                    handleSelectCategory(value);
                    setIsFilterDrawerOpen(false);
                  }}
                />
              </div>
              <div className="p-4 bg-white border-t border-black/[0.06] flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="flex-1 py-3 bg-brand-charcoal text-white text-[15px] font-medium rounded-full hover:bg-brand-charcoal/90 transition-colors"
                >
                  {isLoadingList ? "Show results" : `Show results (${total})`}
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
