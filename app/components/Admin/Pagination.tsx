"use client";

import React from "react";

/* Pagination in the Koolboks Sales CRM style (components/ui/Pagination.tsx in
   koolboks_sales_crm_web): text "Previous" / "Next", small grey page buttons,
   the current page as a charcoal button. No border of its own (as in the
   CRM): the page's footer draws the separator, so it is never doubled. */

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/** First, last and the pages around the current one, with "…" for the gaps. */
const visiblePages = (current: number, total: number): (number | "...")[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
  if (current >= total - 3) return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
};

const step =
  "px-3 py-2 text-[11px] md:text-[12px] font-medium text-faint hover:text-subtle rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange, className = "" }) => {
  if (!totalPages || totalPages <= 1) return null;
  const total = totalPages;

  return (
    <nav aria-label="Pagination" className={`k-pagination flex items-center justify-between gap-3 px-4 sm:px-6 py-4 ${className}`}>
      <button type="button" onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage <= 1} className={step}>
        Previous
      </button>

      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
        {visiblePages(currentPage, total).map((page, i) =>
          page === "..." ? (
            <span key={`gap-${i}`} className="px-2 text-faint" aria-hidden>
              …
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? "page" : undefined}
              className={`px-3 py-1 min-w-8 leading-[150%] text-[11px] md:text-[12px] font-medium rounded-lg transition-colors cursor-pointer ${
                page === currentPage
                  ? "bg-brand-charcoal text-white "
                  : "text-faint hover:text-subtle hover:bg-off-white"
              }`}
            >
              {page}
            </button>
          ),
        )}
      </div>

      <button type="button" onClick={() => onPageChange(Math.min(total, currentPage + 1))} disabled={currentPage >= total} className={step}>
        Next
      </button>
    </nav>
  );
};
