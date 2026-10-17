"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { HiChevronRight, HiSquares2X2 } from "react-icons/hi2";
import { EmptyState } from "@/app/components/EmptyState";
import { apiErrorMessage } from "@/lib/store/base-api";
import { useGetPublicCategoriesQuery } from "@/lib/store/api/categories-api";
import { useGetStorefrontPopularCategoriesQuery } from "@/lib/store/api/storefront-pages-api";
import { motion } from "framer-motion";

type CategoryTile = {
  key: string;
  title: string;
  description?: string | null;
  image?: string | null;
  href: string;
};

const productsHref = (label: string) =>
  `/products?category=${encodeURIComponent(label)}`;

const CategoriesPage = () => {
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    isError: categoriesFailed,
    error: categoriesError,
    refetch: refetchCategories,
  } = useGetPublicCategoriesQuery();
  const {
    data: popularData,
    isLoading: popularLoading,
    isError: popularFailed,
    refetch: refetchPopular,
  } = useGetStorefrontPopularCategoriesQuery();

  const categories = categoriesData?.items ?? [];
  const labelBySlug = new Map(categories.map((c) => [c.value, c.label]));

  // Curated tiles first (they carry a photo and description), then any live
  // category without a curated tile.
  const popular = [...(popularData?.items ?? [])].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
  );
  const tiles: CategoryTile[] = popular.map((p) => ({
    key: p.id,
    title: p.title,
    description: p.description,
    image: p.image_url,
    href: productsHref(labelBySlug.get(p.category_slug) ?? p.title),
  }));
  const curatedSlugs = new Set(popular.map((p) => p.category_slug));
  for (const c of categories) {
    if (!curatedSlugs.has(c.value)) {
      tiles.push({ key: c.value, title: c.label, href: productsHref(c.label) });
    }
  }

  const isLoading = categoriesLoading || popularLoading;
  // Only treat it as an error when neither source loaded anything
  const isError = categoriesFailed && popularFailed;
  const retry = () => {
    refetchCategories();
    refetchPopular();
  };

  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <div className="min-h-screen bg-off-white flex flex-col font-sans text-brand-charcoal">
      <Header />

      <main className="flex-1 w-full max-w-360 mx-auto px-4 sm:px-6 md:px-10 lg:px-16 pt-10 md:pt-16 pb-16 md:pb-24 flex flex-col gap-12 md:gap-20">
        {/* Collections headline */}
        <section className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="flex flex-col items-center gap-3 max-w-3xl mx-auto"
          >
            <span className="text-[13px] font-semibold text-brand-orange-text">
              Koolbuy Store catalogs
            </span>
            <h1 className="text-[28px] sm:text-[36px] md:text-[44px] font-semibold text-brand-charcoal tracking-[-0.03em] leading-[1.05]">
              The <span className="text-faint">collections.</span>
            </h1>
            <p className="text-subtle max-w-xl mx-auto text-[17px] md:text-[19px] mt-1 leading-snug">
              Explore a universe of high-fidelity products curated across our
              categories, designed to bring excellence into every facet of
              your life.
            </p>
          </motion.div>
        </section>

        {/* Collections grid: photo edge to edge, text below */}
        {isLoading ? (
          <section
            aria-label="Loading categories"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 animate-pulse"
          >
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-tile overflow-hidden flex flex-col">
                <div className="aspect-4/3 bg-black/[0.04]" />
                <div className="flex flex-col gap-3 px-5 pt-4 pb-5 md:px-6 md:pt-5 md:pb-6">
                  <div className="h-6 w-2/3 rounded-full bg-black/[0.06]" />
                  <div className="h-4 w-full rounded-full bg-black/[0.04]" />
                  <div className="h-4 w-1/3 rounded-full bg-black/[0.04]" />
                </div>
              </div>
            ))}
          </section>
        ) : isError ? (
          <EmptyState
            variant="card"
            illustration="server"
            title="Couldn't load categories"
            description={apiErrorMessage(categoriesError)}
            action={{ label: "Try again", onClick: retry }}
          />
        ) : tiles.length === 0 ? (
          <EmptyState
            variant="card"
            illustration="products"
            title="No categories yet"
            description="Categories will appear here once products are added to the store."
          />
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {tiles.map((col, i) => (
              <motion.div
                key={col.key}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease }}
              >
                <Link
                  href={col.href}
                  className="h-full bg-white rounded-tile overflow-hidden flex flex-col group transition-shadow duration-300 hover:shadow-lift focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/50"
                >
                  <div className="relative aspect-4/3 bg-off-white overflow-hidden">
                    {col.image ? (
                      <Image
                        src={col.image}
                        alt={col.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        unoptimized={/^https?:\/\//.test(col.image)}
                        className="object-cover transition-transform duration-500 ease-apple group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 bg-brand-orange-soft rounded-stage flex items-center justify-center">
                          <HiSquares2X2 className="text-brand-orange-text" size={26} />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-4 px-5 pt-4 pb-5 md:px-6 md:pt-5 md:pb-6 flex-1">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-[22px] font-semibold text-brand-charcoal tracking-[-0.02em] leading-tight">
                        {col.title}
                      </h3>
                      {col.description && (
                        <p className="text-[14px] text-subtle leading-normal line-clamp-2">
                          {col.description}
                        </p>
                      )}
                    </div>
                    <span className="mt-auto inline-flex items-center gap-0.5 w-fit text-[15px] font-medium text-brand-orange-text group-hover:underline">
                      Explore catalog{" "}
                      <HiChevronRight
                        size={16}
                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                      />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </section>
        )}

        {/* All categories as quick links */}
        {categories.length > 0 && (
          <section className="flex flex-col gap-6 md:gap-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 md:gap-6">
              <div className="flex flex-col gap-1.5">
                <span className="text-[13px] font-semibold text-brand-orange-text">
                  Deeper discovery
                </span>
                <h2 className="text-[20px] md:text-[28px] font-semibold text-brand-charcoal tracking-[-0.025em] leading-tight">
                  All categories.
                </h2>
              </div>
              <p className="text-subtle max-w-md text-[15px] md:text-[17px] leading-normal">
                Jump straight into any category in the Koolbuy Store catalog.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.value}
                  href={productsHref(cat.label)}
                  className="px-5 py-2.5 bg-black/[0.04] rounded-full hover:bg-black/[0.08] transition-colors duration-200 text-[14px] font-medium text-brand-charcoal"
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Featured promotion: a charcoal band tile (dark band rules) */}
        <section className="bg-brand-charcoal rounded-tile md:rounded-hero py-16 md:py-20">
          <div className="px-6 md:px-10 flex flex-col items-center text-center gap-4">
            <h2 className="text-[24px] md:text-[38px] font-semibold text-white tracking-[-0.03em] leading-[1.05]">
              Can&apos;t find your <span className="text-white/60">bloom?</span>
            </h2>
            <p className="text-white/60 text-[17px] md:text-[19px] max-w-xl leading-snug">
              Our concierge sourcing team is always adding new collections to
              the catalog. Connect with our curators if you&apos;re looking for
              something specific.
            </p>
            <Link
              href="/contact"
              className="mt-3 inline-flex items-center justify-center px-7 py-3 bg-brand-orange hover:bg-brand-orange-hover text-white rounded-full font-semibold text-[15px] transition-colors duration-200"
            >
              Request curator support
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CategoriesPage;
