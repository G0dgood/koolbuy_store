"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { HiOutlinePhoto } from "react-icons/hi2";
import { Button } from "@/app/components/Button";
import { Icon } from "@/app/components/Icon";
import { Input } from "@/app/components/Form/Inputs";
import { TabFilter } from "@/app/components/Admin/TabFilter";
import { Pagination } from "@/app/components/Admin/Pagination";
import { RowsPerPage } from "@/app/components/rows-per-page";
import { EmptyTableRow } from "@/app/components/EmptyState";
import { apiErrorMessage } from "@/lib/store/base-api";
import { formatDate, formatMoney } from "@/lib/store/api/accounting-api";
import { useGetAdminCatalogueProductsQuery, type AdminCatalogueProduct } from "@/lib/store/api/catalogue-admin-api";

/* Products (staff view). The backend has no general admin product list or
   admin create / edit / delete: sellers list their own products. This page
   reads the procurement pricing list (every active product with its vendor
   price, markup and the price each buyer type pays). Prices are changed on
   the Pricing pages, products by their seller. */

const PAGE_SIZES = [10, 20, 50, 100];
const MARKETS = ["All", "NG", "KE"] as const;
type Market = (typeof MARKETS)[number];
const COLS = 7;

function SkeletonRows({ rows }: { rows: number }) {
  return (
    <>
      {Array.from({ length: Math.min(rows, 8) }, (_, i) => (
        <tr key={i} aria-hidden>
          {Array.from({ length: COLS }, (_, j) => (
            <td key={j}>
              <span className="block h-3 w-20 rounded bg-black/[0.06] animate-pulse" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function ProductCell({ p }: { p: AdminCatalogueProduct }) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <div className="w-10 h-10 rounded-lg bg-off-white border border-light-gray overflow-hidden shrink-0 flex items-center justify-center">
        {p.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.image_url} alt="" className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <HiOutlinePhoto size={16} className="text-faint" aria-hidden />
        )}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-xs font-semibold text-brand-charcoal truncate max-w-64" title={p.name}>
          {p.name}
        </span>
        <span className="text-[11px] text-faint">{p.unit || "—"}</span>
      </div>
    </div>
  );
}

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [market, setMarket] = useState<Market>("All");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {
    const id = setTimeout(() => setQuery(search.trim()), 300);
    return () => clearTimeout(id);
  }, [search]);

  const { data, isLoading, isFetching, isError, error, refetch } = useGetAdminCatalogueProductsQuery({
    q: query || undefined,
    market: market === "All" ? undefined : market,
    page,
    page_size: pageSize,
  });
  const items = data?.items ?? [];
  const total = data?.pagination.total ?? 0;
  const totalPages = total ? Math.max(1, Math.ceil(total / pageSize)) : 1;
  const filtered = !!query || market !== "All";

  const clearFilters = () => {
    setSearch("");
    setQuery("");
    setMarket("All");
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-brand-charcoal">Products</h1>
          <p className="text-xs text-subtle mt-0.5">
            Every active product on the marketplace, with the vendor price and what each buyer type pays.
            Sellers add and edit their own products.
          </p>
        </div>
        <Link
          href="/admin/products/media"
          className="text-xs font-semibold text-brand-orange-text hover:underline whitespace-nowrap"
        >
          Media library
        </Link>
      </div>

      <div className="bg-white border border-light-gray rounded-lg flex flex-col overflow-hidden">
        <div className="p-4 sm:px-6 flex flex-col lg:flex-row gap-3 lg:items-center justify-between border-b border-light-gray">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <TabFilter
              tabs={[...MARKETS]}
              activeTab={market}
              onChange={(t) => {
                setMarket(t as Market);
                setPage(1);
              }}
            />
            <Input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search product or store"
              aria-label="Search products"
              containerClassName="w-full sm:w-72"
              className="bg-white border-light-gray placeholder:text-faint text-xs font-medium"
              suffixElement={<Icon name="search-01" folder="dashboardIcon" size="sm" className="text-faint" />}
            />
          </div>
          <div className="flex items-center gap-4">
            {!isLoading && !isError && (
              <span className="text-[12px] text-subtle whitespace-nowrap">
                {total.toLocaleString()} product{total === 1 ? "" : "s"}
              </span>
            )}
            <RowsPerPage
              value={pageSize}
              options={PAGE_SIZES}
              onChange={(n) => {
                setPageSize(n);
                setPage(1);
              }}
            />
          </div>
        </div>

        <div className={`admin-table-container transition-opacity ${isFetching && !isLoading ? "opacity-60" : ""}`}>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Store</th>
                <th title="What the vendor charges Koolboks">Vendor price</th>
                <th title="Standard buyer price (vendor price plus the Koolboks markup)">Selling price</th>
                <th>Availability</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <SkeletonRows rows={pageSize} />
              ) : isError ? (
                <tr>
                  <td colSpan={COLS} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-1 max-w-md mx-auto">
                      <p className="text-[13px] text-error">{apiErrorMessage(error, "Couldn't load products.")}</p>
                      <Button variant="outline" size="sm" className="mt-2" onClick={() => refetch()}>
                        Try again
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                filtered ? (
                  <EmptyTableRow
                    colSpan={COLS}
                    illustration="search"
                    title="No matches"
                    description="No products match these filters. Try a different search or market."
                    action={{ label: "Clear filters", onClick: clearFilters }}
                  />
                ) : (
                  <EmptyTableRow
                    colSpan={COLS}
                    illustration="products"
                    title="No products yet"
                    description="Products will appear here once sellers list them."
                  />
                )
              ) : (
                items.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <ProductCell p={p} />
                    </td>
                    <td className="text-xs text-subtle whitespace-nowrap">{p.category?.name || "—"}</td>
                    <td className="text-xs text-subtle whitespace-nowrap">
                      <div className="flex flex-col">
                        <span>{p.store?.name || "—"}</span>
                        <span className="text-[11px] text-faint">{p.market}</span>
                      </div>
                    </td>
                    <td className="text-xs text-subtle tabular-nums whitespace-nowrap">
                      {formatMoney(p.vendor_price, p.currency)}
                    </td>
                    <td className="whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-brand-charcoal tabular-nums">
                          {formatMoney(p.standard_price, p.currency)}
                        </span>
                        <span className="text-[11px] text-faint">
                          {p.standard_markup_pct ? `+${p.standard_markup_pct}% markup` : "No markup"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          p.in_stock ? "bg-success-soft text-success" : "bg-error-soft text-error"
                        }`}
                      >
                        {p.in_stock ? "In stock" : "Out of stock"}
                      </span>
                    </td>
                    <td className="text-xs text-subtle whitespace-nowrap">{formatDate(p.updated_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
