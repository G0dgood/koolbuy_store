"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { EmptyState } from "@/app/components/EmptyState";
import { apiErrorMessage } from "@/lib/store/base-api";
import { useGetProductReviewsPageQuery } from "@/lib/store/api/product-detail-api";
import { Bone, Stars } from "./productDetailShared";

const PAGE = 10;

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("") || "B";

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
};

const ProductReviews: React.FC<{ productId: string; rating: number }> = ({ productId, rating }) => {
  const [pageSize, setPageSize] = useState(PAGE);
  const { data, isLoading, isFetching, isError, error, refetch } = useGetProductReviewsPageQuery({
    productId,
    page: 1,
    page_size: pageSize,
  });

  // A product hidden from this account by role answers 404: there's nothing to show.
  const notVisible = isError && (error as { status?: unknown })?.status === 404;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4" aria-busy>
        <Bone className="h-32 w-full rounded-tile" />
        <Bone className="h-24 w-full" />
        <Bone className="h-24 w-full" />
      </div>
    );
  }

  if (isError && !notVisible) {
    return (
      <EmptyState
        illustration="reviews"
        title="Reviews didn't load"
        description={apiErrorMessage(error, "We couldn't load reviews for this product.")}
        action={{ label: "Try again", onClick: () => refetch() }}
      />
    );
  }

  const reviews = data?.items ?? [];
  const total = data?.pagination.total ?? reviews.length;

  if (notVisible || total === 0) {
    return (
      <EmptyState
        illustration="reviews"
        title="No reviews yet"
        description="Reviews will appear here once buyers rate this product."
      />
    );
  }

  const average =
    rating > 0 ? rating : reviews.reduce((s, r) => s + r.rating, 0) / Math.max(1, reviews.length);
  const allLoaded = reviews.length >= total;
  const counts = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => Math.round(r.rating) === stars).length,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-8"
    >
      {/* Rating summary */}
      <div className="flex flex-col md:flex-row gap-8 md:items-center bg-off-white rounded-tile p-6 md:p-8">
        <div className="flex flex-col items-center text-center md:border-r border-black/[0.06] md:pr-12">
          <span className="text-[48px] font-semibold text-brand-charcoal tracking-[-0.03em] leading-none tabular-nums">
            {average.toFixed(1)}
          </span>
          <div className="my-3">
            <Stars value={average} />
          </div>
          <p className="text-[13px] text-subtle tabular-nums">
            Based on {total.toLocaleString("en-NG")} review{total === 1 ? "" : "s"}
          </p>
        </div>

        {/* Breakdown, only when every review is loaded so the bars are exact */}
        {allLoaded && (
          <div className="flex-1 flex flex-col gap-3">
            {counts.map(({ stars, count }) => {
              const pct = Math.round((count / total) * 100);
              return (
                <div key={stars} className="flex items-center gap-4">
                  <span className="text-[13px] text-subtle w-14">
                    {stars} star{stars === 1 ? "" : "s"}
                  </span>
                  <div className="flex-1 h-1.5 bg-black/[0.06] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                      className="h-full rounded-full bg-brand-orange"
                    />
                  </div>
                  <span className="text-[13px] text-faint w-10 text-right tabular-nums">{pct}%</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Review list */}
      <div className="flex flex-col gap-6">
        <h3 className="text-[22px] md:text-[26px] font-semibold text-brand-charcoal tracking-[-0.02em]">
          Buyer reviews
        </h3>

        <div className="flex flex-col gap-3">
          {reviews.map((review) => {
            const name = review.user_name?.trim() || "KoolBuy buyer";
            return (
              <div key={review.id} className="bg-off-white rounded-stage p-5 md:p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-brand-orange-soft text-brand-orange-text flex items-center justify-center text-[14px] font-semibold shrink-0">
                    {initials(name)}
                  </div>
                  <div>
                    <h4 className="text-[14px] font-semibold text-brand-charcoal">{name}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Stars value={review.rating} size="xs" />
                      {formatDate(review.created_at) && (
                        <span className="text-[12px] text-faint">· {formatDate(review.created_at)}</span>
                      )}
                    </div>
                  </div>
                </div>
                {review.comment?.trim() && (
                  <p className="text-subtle text-[14px] leading-relaxed max-w-[900px] whitespace-pre-line">
                    {review.comment}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {!allLoaded && (
          <button
            type="button"
            onClick={() => setPageSize((n) => n + PAGE)}
            disabled={isFetching}
            className="self-center h-9 px-5 rounded-full bg-black/[0.04] text-brand-charcoal text-[13px] font-medium hover:bg-black/[0.08] disabled:opacity-50 transition-colors cursor-pointer"
          >
            {isFetching ? "Loading…" : "Show more reviews"}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export { ProductReviews };
