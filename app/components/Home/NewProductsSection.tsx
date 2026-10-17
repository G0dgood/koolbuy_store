"use client";

import React, { useMemo } from "react";
import {
  StoreProductGrid,
  StoreProductGridSkeleton,
  StoreSectionHeader,
  toStoreProduct,
} from "./StoreUi";
import { useGetPublicCategoriesQuery } from "@/lib/store/api/categories-api";
import { useGetStorefrontProductsQuery } from "@/lib/store/api/storefront-api";
import { apiErrorMessage } from "@/lib/store/base-api";
import { EmptyState } from "@/app/components/EmptyState";

/**
 * Newest products from the catalogue. `category` is a chip id from
 * IntroducingProducts: "all" or a category slug from /products/categories/.
 */
export const NewProductsSection: React.FC<{ category?: string }> = ({ category = "all" }) => {
  const isAll = category === "all";
  const { data: categoriesData, isLoading: isLoadingCategories } = useGetPublicCategoriesQuery(
    undefined,
    { skip: isAll },
  );

  // The products endpoint filters by category label ("Fish & Seafood"), not slug
  const activeCategory = isAll ? undefined : categoriesData?.items?.find((c) => c.value === category);
  const categoryLabel = activeCategory?.label ?? (isAll ? undefined : category);

  const { data, isLoading, isFetching, isError, error, refetch } = useGetStorefrontProductsQuery(
    { category: categoryLabel, ordering: "newest", page_size: 12 },
    // wait for the slug→label lookup so we don't fetch with the slug first
    { skip: !isAll && isLoadingCategories },
  );

  const products = useMemo(() => (data?.items ?? []).map(toStoreProduct), [data]);

  const title = isAll ? "New products" : categoryLabel ?? "New products";
  const link = isAll ? "/products" : `/products?category=${encodeURIComponent(category)}`;
  const loading = isLoading || (isFetching && !data) || (!isAll && isLoadingCategories);

  return (
    <section className="w-full flex flex-col gap-6">
      <StoreSectionHeader
        title={title}
        subtitle={isAll ? "Just arrived on KoolBuy." : "Fresh picks in this category."}
        href={products.length > 0 ? link : undefined}
      />
      {loading ? (
        <StoreProductGridSkeleton count={12} />
      ) : isError ? (
        <div role="alert" className="bg-white rounded-tile border border-light-gray py-10 px-6 flex flex-col items-center gap-3 text-center">
          <p className="text-[14px] text-subtle">{apiErrorMessage(error, "We couldn't load products.")}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center justify-center h-9 px-4 rounded-full bg-black/[0.04] text-brand-charcoal text-[13px] font-medium hover:bg-black/[0.08] transition-colors"
          >
            Try again
          </button>
        </div>
      ) : products.length > 0 ? (
        // key restarts the ease-in each time the category changes
        <StoreProductGrid key={category} products={products} twoRows />
      ) : isAll ? (
        <EmptyState
          variant="card"
          illustration="products"
          title="No products yet"
          description="Products will appear here once vendors list them."
        />
      ) : (
        <EmptyState
          variant="card"
          illustration="search"
          title="No matches"
          description={`Products in ${title} will appear here once vendors list them.`}
          action={{ label: "Browse all products", href: "/products" }}
        />
      )}
    </section>
  );
};
