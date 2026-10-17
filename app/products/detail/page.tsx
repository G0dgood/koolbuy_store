"use client";

import React, { Suspense, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { Icon } from "@/app/components/Icon";
import { EmptyState } from "@/app/components/EmptyState";
import { ProductGallery } from "@/app/components/Products/ProductGallery";
import { ProductDetailsInfo } from "@/app/components/Products/ProductDetailsInfo";
import { ProductFeatureGallery } from "@/app/components/Products/ProductFeatureGallery";
import { ProductTabs } from "@/app/components/Products/ProductTabs";
import { YouMayLike } from "@/app/components/Products/YouMayLike";
import { RelatedProducts } from "@/app/components/Products/RelatedProducts";
import { SupplierCard } from "@/app/components/Products/SupplierCard";
import {
  Bone,
  isUuid,
  toListedProducts,
  toProductView,
} from "@/app/components/Products/productDetailShared";
import { apiErrorMessage } from "@/lib/store/base-api";
import { useGetProductsQuery } from "@/lib/store/api/products-api";
import {
  useGetProductPageQuery,
  useGetProductRichDetailQuery,
} from "@/lib/store/api/product-detail-api";

const shell = "flex-1 max-w-360 mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-4 md:py-6 flex flex-col gap-10 md:gap-16 w-full";
const topPanel =
  "bg-white rounded-tile md:rounded-hero border border-light-gray p-4 sm:p-6 md:p-10 flex flex-col lg:flex-row gap-8 lg:gap-14";

const statusOf = (error: unknown) => (error as { status?: unknown } | undefined)?.status;

function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-3 md:gap-4" aria-busy aria-label="Loading product">
      <Bone className="h-4 w-72 max-w-full" />
      <div className={topPanel}>
        <Bone className="w-full lg:w-1/2 aspect-square rounded-tile" />
        <div className="flex-1 flex flex-col gap-5 lg:py-2">
          <Bone className="h-6 w-20 rounded-full" />
          <Bone className="h-7 w-full" />
          <Bone className="h-7 w-2/3" />
          <Bone className="h-4 w-48" />
          <Bone className="h-9 w-40" />
          <Bone className="h-14 w-full" />
          <Bone className="h-20 w-full" />
          <Bone className="h-12 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <EmptyState
      variant="card"
      illustration="search"
      title="We couldn't find that product"
      description="It may have been removed, or the link is incomplete. Browse the store to find something similar."
      action={{ label: "Browse products", href: "/products" }}
      className="rounded-tile md:rounded-hero py-16 md:py-20"
    />
  );
}

function ProductDetailContent() {
  const searchParams = useSearchParams();
  const rawId = searchParams.get("id")?.trim() ?? "";
  const id = isUuid(rawId) ? rawId : null;

  const storeQ = useGetProductPageQuery(id ?? "", { skip: !id });
  // Richer detail (photos, attributes, review count); role-gated, so it may be refused: that's fine.
  const richQ = useGetProductRichDetailQuery(id ?? "", { skip: !id });

  const product = useMemo(
    () => toProductView(storeQ.data, richQ.isSuccess ? richQ.data : undefined),
    [storeQ.data, richQ.isSuccess, richQ.data]
  );

  const relatedQ = useGetProductsQuery(
    { category: product?.category, page_size: 8 },
    { skip: !product?.category }
  );
  const newestQ = useGetProductsQuery({ page_size: 8 }, { skip: !product });

  const related = useMemo(
    () => (product ? toListedProducts(relatedQ.data, [product.id]).slice(0, 6) : []),
    [product, relatedQ.data]
  );
  const youMayLike = useMemo(() => {
    if (!product) return [];
    const fresh = toListedProducts(newestQ.data, [product.id, ...related.map((p) => p.id)]);
    return (fresh.length > 0 ? fresh : toListedProducts(newestQ.data, [product.id])).slice(0, 5);
  }, [product, related, newestQ.data]);

  useEffect(() => {
    if (product?.name) document.title = `${product.name} | KoolBuy`;
  }, [product?.name]);

  if (!id) return <NotFound />;

  if (storeQ.isLoading || (richQ.isLoading && !storeQ.isError)) return <DetailSkeleton />;

  if (!product) {
    // Both endpoints answered without a product
    const notFound =
      statusOf(storeQ.error) === 404 || (statusOf(storeQ.error) === undefined && !storeQ.isError);
    if (notFound) return <NotFound />;
    return (
      <EmptyState
        variant="card"
        illustration="products"
        title="This product didn't load"
        description={apiErrorMessage(storeQ.error, "We couldn't load this product. Please try again.")}
        action={{
          label: "Try again",
          onClick: () => {
            storeQ.refetch();
            richQ.refetch();
          },
        }}
        secondaryAction={{ label: "Browse products", href: "/products" }}
        className="rounded-tile md:rounded-hero py-16 md:py-20"
      />
    );
  }

  const categoryHref = product.category
    ? `/products?category=${encodeURIComponent(product.category)}`
    : undefined;

  return (
    <>
      <div className="flex flex-col gap-3 md:gap-4">
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-[13px] text-faint overflow-x-auto whitespace-nowrap scrollbar-none pb-1"
        >
          <Link href="/" className="hover:text-brand-charcoal transition-colors">
            Home
          </Link>
          <Icon name="chevron_right" size="xs" />
          <Link href="/products" className="hover:text-brand-charcoal transition-colors">
            Products
          </Link>
          {product.category && categoryHref && (
            <>
              <Icon name="chevron_right" size="xs" />
              <Link href={categoryHref} className="hover:text-brand-charcoal transition-colors">
                {product.category}
              </Link>
            </>
          )}
          <Icon name="chevron_right" size="xs" />
          <span className="text-brand-charcoal truncate max-w-60 sm:max-w-md" aria-current="page">
            {product.name}
          </span>
        </nav>

        {/* Top product section: gallery and buy box */}
        <div className={topPanel}>
          <ProductGallery key={product.id} images={product.images} name={product.name} />
          <ProductDetailsInfo key={`info-${product.id}`} product={product} />
        </div>
      </div>

      {/* Seller's attributes (hidden when there are none) */}
      <ProductFeatureGallery attributes={product.attributes} />

      {/* Tabs + seller and "You may like" */}
      <div className="flex flex-col lg:flex-row gap-4 md:gap-6 items-start">
        <ProductTabs key={`tabs-${product.id}`} product={product} />
        <div className="w-full lg:w-80 shrink-0 flex flex-col gap-4 md:gap-6">
          {product.vendor && (
            <SupplierCard
              vendorId={product.vendor.id}
              vendorName={product.vendor.name}
              vendorImage={product.vendorImage}
            />
          )}
          <YouMayLike
            products={youMayLike}
            isLoading={newestQ.isLoading}
            error={newestQ.isError ? newestQ.error : undefined}
            onRetry={() => newestQ.refetch()}
          />
        </div>
      </div>

      <RelatedProducts products={related} isLoading={relatedQ.isLoading} href={categoryHref} />
    </>
  );
}

export default function ProductDetailPage() {
  return (
    <div className="flex flex-col min-h-screen bg-off-white">
      <Header />

      <div className={shell}>
        {/* useSearchParams needs a Suspense boundary */}
        <Suspense fallback={<DetailSkeleton />}>
          <ProductDetailContent />
        </Suspense>
      </div>

      <Footer />
    </div>
  );
}
