import React from "react";
import { Icon } from "../Icon";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showSizeChanger?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showSizeChanger = false,
  pageSize = 10,
  pageSizeOptions = [10, 15, 20, 50],
  onPageSizeChange,
  className = "",
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="Pagination" className={`flex items-center gap-4 ${className}`}>
      {/* Storefront style (DESIGN.md §8): round page buttons, current page orange. */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className="w-9 h-9 rounded-full flex items-center justify-center text-subtle hover:bg-black/[0.05] transition-colors disabled:opacity-30 disabled:pointer-events-none"
        >
          <Icon name="chevron_left" size="sm" />
        </button>

        {pages.map((page) => {
          const isActive = page === currentPage;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              aria-current={isActive ? "page" : undefined}
              className={`min-w-9 h-9 px-2 rounded-full text-[14px] font-medium tabular-nums transition-colors ${
                isActive
                  ? "bg-brand-orange text-white"
                  : "text-subtle hover:bg-black/[0.05] hover:text-brand-charcoal"
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className="w-9 h-9 rounded-full flex items-center justify-center text-subtle hover:bg-black/[0.05] transition-colors disabled:opacity-30 disabled:pointer-events-none"
        >
          <Icon name="chevron_right" size="sm" />
        </button>
      </div>

      {showSizeChanger && (
        <div className="relative">
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
            className="appearance-none h-9 bg-black/[0.04] border border-transparent rounded-full pl-4 pr-10 text-[14px] font-medium text-subtle hover:bg-black/[0.06] focus:outline-none focus:bg-white focus:border-light-gray focus:ring-4 focus:ring-brand-orange/15"
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                Show {option}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Icon name="expand_more" size="xs" className="text-faint" />
          </div>
        </div>
      )}
    </nav>
  );
};

export { Pagination };
