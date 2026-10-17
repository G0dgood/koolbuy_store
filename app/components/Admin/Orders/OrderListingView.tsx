"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { Button } from "@/app/components/Button";
import Search from "@/app/components/ui/Search";
import { StatCard } from "@/app/components/Admin/StatCard";
import { TabFilter } from "@/app/components/Admin/TabFilter";
import { Pagination } from "@/app/components/Admin/Pagination";
import { RowsPerPage } from "@/app/components/rows-per-page";
import { EmptyTableRow, type IllustrationName } from "@/app/components/EmptyState";

/* Server-driven listing shared by Accounting → Orders and BNPL Orders.
   The page owns the query (tab → status, search, page, page size); this view
   renders the stat tiles, filters, table, and loading / error / empty states.
   Columns come from the page so each listing shows only the fields its
   endpoint returns. */

export interface StatItem {
  title: string;
  value: React.ReactNode;
  /** Short hint under the value */
  hint?: string;
}

export interface ListingColumn<T> {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => React.ReactNode;
}

export interface OrderListingViewProps<T> {
  stats: StatItem[];
  statsLoading?: boolean;
  /** Shown in place of the stat tiles when they failed to load */
  statsError?: string | null;
  onStatsRetry?: () => void;

  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;

  /** Committed search term; the view debounces typing before calling onSearchChange */
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;

  columns: ListingColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  getRowHref: (row: T) => string;
  /** Used for the View link's accessible label, e.g. the order number */
  getRowLabel: (row: T) => string;

  total: number;
  page: number;
  pageSize: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;

  isLoading: boolean;
  /** A refetch is running while rows are already shown */
  isRefreshing?: boolean;
  error?: string | null;
  onRetry?: () => void;
  /** Empty state when no search is active (pages pass tab-aware copy). Defaults to orders. */
  emptyIllustration?: IllustrationName;
  emptyTitle?: string;
  emptyHint?: React.ReactNode;
  /** What the search box matches, shown under "No matches" when a search finds nothing */
  emptySearchHint?: string;
}

const SEARCH_DEBOUNCE_MS = 300;
const SKELETON_ROWS = 6;

export function OrderListingView<T>({
  stats,
  statsLoading = false,
  statsError,
  onStatsRetry,
  tabs,
  activeTab,
  onTabChange,
  search,
  onSearchChange,
  searchPlaceholder = "Search",
  columns,
  rows,
  getRowId,
  getRowHref,
  getRowLabel,
  total,
  page,
  pageSize,
  pageSizeOptions = [10, 20, 50, 100],
  onPageChange,
  onPageSizeChange,
  isLoading,
  isRefreshing = false,
  error,
  onRetry,
  emptyIllustration = "orders",
  emptyTitle = "No orders yet",
  emptyHint = "Orders will appear here once customers place them.",
  emptySearchHint,
}: OrderListingViewProps<T>) {
  const [searchInput, setSearchInput] = useState(search);

  // Commit the search term once typing pauses
  useEffect(() => {
    const term = searchInput.trim();
    if (term === search) return;
    const t = setTimeout(() => onSearchChange(term), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [searchInput, search, onSearchChange]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const colSpan = columns.length + 1;
  const statCols =
    stats.length >= 5 ? "lg:grid-cols-5" : stats.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4";

  return (
    <div className="flex flex-col gap-6 mx-auto pb-12">
      {/* Stats */}
      {statsError ? (
        <div className="bg-white rounded-lg border border-light-gray p-4 flex items-center justify-between gap-3">
          <p className="text-xs text-error">{statsError}</p>
          {onStatsRetry && (
            <Button variant="outline" size="sm" onClick={onStatsRetry}>
              Retry
            </Button>
          )}
        </div>
      ) : (
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${statCols} gap-4`}>
          {stats.map((stat) => (
            <StatCard
              key={stat.title}
              size="sm"
              title={stat.title}
              value={
                statsLoading ? (
                  <span className="inline-block h-6 w-24 rounded bg-off-white animate-pulse" aria-label="Loading" />
                ) : (
                  stat.value
                )
              }
              periodLabel={statsLoading ? undefined : stat.hint}
            />
          ))}
        </div>
      )}

      {/* Filters & table */}
      <div className="bg-white rounded-lg border border-light-gray overflow-hidden flex flex-col">
        <div className="p-4 sm:p-6 flex flex-col lg:flex-row gap-4 lg:gap-6 items-center justify-between border-b border-light-gray">
          <TabFilter tabs={tabs} activeTab={activeTab} onChange={onTabChange} />

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <Search
              value={searchInput}
              onChange={(val) => setSearchInput(typeof val === "string" ? val : (val as any).target?.value ?? "")}
              placeholder={searchPlaceholder}
              className="w-full lg:!w-72 xl:!w-80"
              maxWidth="max-w-none"
            />
            <RowsPerPage value={pageSize} onChange={onPageSizeChange} options={pageSizeOptions} />
          </div>
        </div>

        <div className={`admin-table-container transition-opacity ${isRefreshing ? "opacity-60" : ""}`}>
          <table aria-busy={isLoading || isRefreshing}>
            <thead>
              <tr>
                {columns.map((c) => (
                  <th key={c.key} className={c.className}>
                    {c.header}
                  </th>
                ))}
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: SKELETON_ROWS }, (_, i) => (
                  <tr key={`skel-${i}`} className="animate-pulse">
                    {Array.from({ length: colSpan }, (_, j) => (
                      <td key={j}>
                        <span className="block h-3.5 rounded bg-off-white" style={{ width: `${50 + ((i + j) % 4) * 12}%` }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td colSpan={colSpan} className="py-14 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <p className="text-sm text-error">{error}</p>
                      {onRetry && (
                        <Button variant="outline" size="sm" onClick={onRetry}>
                          Try again
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                search ? (
                  <EmptyTableRow
                    colSpan={colSpan}
                    illustration="search"
                    title="No matches"
                    description={`Nothing matches "${search}".${emptySearchHint ? ` ${emptySearchHint}` : ""}`}
                    action={{
                      label: "Clear search",
                      onClick: () => {
                        setSearchInput("");
                        onSearchChange("");
                      },
                    }}
                  />
                ) : (
                  <EmptyTableRow
                    colSpan={colSpan}
                    illustration={emptyIllustration}
                    title={emptyTitle}
                    description={emptyHint}
                    action={activeTab !== tabs[0] ? { label: `Show ${tabs[0].toLowerCase()}`, onClick: () => onTabChange(tabs[0]) } : undefined}
                  />
                )
              ) : (
                rows.map((row) => (
                  <tr key={getRowId(row)} className="group transition-colors">
                    {columns.map((c) => (
                      <td key={c.key} className={c.className}>
                        {c.render(row)}
                      </td>
                    ))}
                    <td className="text-right">
                      <Link
                        href={getRowHref(row)}
                        aria-label={`View ${getRowLabel(row)}`}
                        title="View details"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-light-gray text-faint hover:text-brand-orange-text hover:bg-brand-orange-soft transition-colors"
                      >
                        <ArrowRightIcon className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="border-t border-light-gray flex items-center justify-end">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={onPageChange} />
          </div>
        )}
      </div>
    </div>
  );
}
