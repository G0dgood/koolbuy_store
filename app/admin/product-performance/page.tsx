"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { StatCard } from "@/app/components/Admin/StatCard";
import { TabFilter } from "@/app/components/Admin/TabFilter";
import { Pagination } from "@/app/components/Admin/Pagination";
import { StatusBadge } from "@/app/components/Admin/Orders/StatusBadge";
import { RowsPerPage } from "@/app/components/rows-per-page";
import { Input } from "@/app/components/Form/Inputs";
import { Button } from "@/app/components/Button";
import { Icon } from "@/app/components/Icon";
import { EmptyTableRow } from "@/app/components/EmptyState";
import { apiErrorMessage } from "@/lib/store/base-api";
import { formatDate, formatMoney, useGetAdminRefundsQuery } from "@/lib/store/api/accounting-api";
import { useGetSalesReportQuery } from "@/lib/store/api/catalogue-admin-api";

/* Product performance.
   - Top performing: the backend "Sales by product" report (quantity and
     revenue per product and store; cancelled and unpaid orders left out).
     The report returns up to 200 rows, sorted by revenue.
   - Refunds: refunds are recorded per order, not per product, so this lists
     the refunded orders.
   There is no wishlist report in the admin API, so that section was removed. */

const PAGE_SIZES = [10, 20, 50];
const TABS = ["Top performing", "Refunded orders"] as const;
type Tab = (typeof TABS)[number];
const MARKETS = ["All", "NG", "KE"] as const;
type Market = (typeof MARKETS)[number];
const RANGES = [
  { label: "Last 7 days", days: 7 },
  { label: "Last 30 days", days: 30 },
  { label: "Last 90 days", days: 90 },
  { label: "Last 12 months", days: 365 },
] as const;

const ymd = (d: Date) => d.toISOString().slice(0, 10);
const daysAgo = (n: number) => ymd(new Date(Date.now() - n * 86_400_000));

function SkeletonRows({ rows, cols }: { rows: number; cols: number }) {
  return (
    <>
      {Array.from({ length: Math.min(rows, 8) }, (_, i) => (
        <tr key={i} aria-hidden>
          {Array.from({ length: cols }, (_, j) => (
            <td key={j}>
              <span className="block h-3 w-20 rounded bg-black/[0.06] animate-pulse" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function ErrorRow({ cols, error, fallback, onRetry }: { cols: number; error: unknown; fallback: string; onRetry: () => void }) {
  return (
    <tr>
      <td colSpan={cols} className="py-16 text-center">
        <div className="flex flex-col items-center gap-1 max-w-md mx-auto">
          <p className="text-[13px] text-error">{apiErrorMessage(error, fallback)}</p>
          <Button variant="outline" size="sm" className="mt-2" onClick={onRetry}>
            Try again
          </Button>
        </div>
      </td>
    </tr>
  );
}

export default function ProductPerformancePage() {
  const [tab, setTab] = useState<Tab>("Top performing");

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div>
        <h1 className="text-xl font-semibold text-brand-charcoal">Product performance</h1>
        <p className="text-xs text-subtle mt-0.5">What sold best in a period, and which orders were refunded.</p>
      </div>

      <div className="bg-white border border-light-gray rounded-lg flex flex-col overflow-hidden">
        <div className="p-4 sm:px-6 border-b border-light-gray">
          <TabFilter tabs={[...TABS]} activeTab={tab} onChange={(t) => setTab(t as Tab)} />
        </div>
        {tab === "Top performing" ? <TopPerforming /> : <RefundedOrders />}
      </div>
    </div>
  );
}

/* ───────────────────────── Top performing ───────────────────────── */

function TopPerforming() {
  const [from, setFrom] = useState(() => daysAgo(30));
  const [to, setTo] = useState(() => ymd(new Date()));
  const [market, setMarket] = useState<Market>("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const badRange = !!from && !!to && from > to;
  const { data, isLoading, isFetching, isError, error, refetch } = useGetSalesReportQuery(
    { date_from: from || undefined, date_to: to || undefined, market: market === "All" ? undefined : market },
    { skip: badRange },
  );

  const rows = useMemo(() => {
    const all = badRange ? [] : (data?.rows ?? []);
    const term = search.trim().toLowerCase();
    if (!term) return all;
    return all.filter((r) =>
      [r.product, r.category, r.store].some((v) => (v ?? "").toLowerCase().includes(term)),
    );
  }, [data, search, badRange]);
  const shown = rows.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const totals = data?.totals ?? [];
  const COLS = 7;

  const stat = (v: React.ReactNode) =>
    isLoading ? <span className="inline-block h-7 w-20 rounded bg-black/[0.06] animate-pulse align-middle" /> : isError ? "—" : v;

  const setRange = (days: number) => {
    setFrom(daysAgo(days));
    setTo(ymd(new Date()));
    setPage(1);
  };
  const activeRange = RANGES.find((r) => from === daysAgo(r.days) && to === ymd(new Date()));

  const dateInput = (label: string, value: string, set: (v: string) => void) => (
    <label className="flex items-center gap-2 text-[12px] text-subtle">
      {label}
      <Input
        type="date"
        value={value}
        onChange={(e) => {
          set(e.target.value);
          setPage(1);
        }}
        aria-label={`Orders placed ${label.toLowerCase()}`}
        containerClassName="w-40"
        className="bg-white border-light-gray text-xs font-medium"
      />
    </label>
  );

  return (
    <>
      <div className="p-4 sm:px-6 flex flex-col gap-3 border-b border-light-gray">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <TabFilter
            ariaLabel="Date range"
            options={RANGES.map((r) => ({ value: String(r.days), label: r.label }))}
            activeTab={activeRange ? String(activeRange.days) : ""}
            onChange={(days) => setRange(Number(days))}
          />
          <TabFilter
            tabs={[...MARKETS]}
            activeTab={market}
            onChange={(t) => {
              setMarket(t as Market);
              setPage(1);
            }}
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {dateInput("From", from, setFrom)}
          {dateInput("To", to, setTo)}
        </div>
        {badRange && <p className="text-[12px] text-error">The start date is after the end date.</p>}
      </div>

      <div className="p-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 border-b border-light-gray">
        <StatCard
          size="sm"
          title="Products sold"
          value={stat((data?.rows.length ?? 0).toLocaleString() + (data?.truncated ? "+" : ""))}
          periodLabel="Product and store pairs with sales"
        />
        {totals.length === 0 ? (
          <StatCard size="sm" title="Revenue" value={stat(formatMoney(0))} periodLabel="At the customer price" />
        ) : (
          totals.map((t) => (
            <React.Fragment key={t.currency ?? "none"}>
              <StatCard
                size="sm"
                title={`Revenue${totals.length > 1 && t.currency ? ` (${t.currency})` : ""}`}
                value={stat(formatMoney(t.values.revenue ?? 0, t.currency || "NGN"))}
                periodLabel="At the customer price"
              />
              <StatCard
                size="sm"
                title={`Units sold${totals.length > 1 && t.currency ? ` (${t.currency})` : ""}`}
                value={stat((t.values.quantity ?? 0).toLocaleString())}
                periodLabel="Across all products"
              />
            </React.Fragment>
          ))
        )}
        {data?.truncated && (
          <p className="sm:col-span-2 lg:col-span-4 text-[11px] text-faint">
            Showing the top 200 products by revenue. Totals are hidden because the list is cut short; narrow the dates
            to see them.
          </p>
        )}
      </div>

      <div className="p-4 sm:px-6 flex flex-col sm:flex-row gap-3 items-center justify-between border-b border-light-gray">
        <Input
          type="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search product, category or store"
          aria-label="Search products"
          containerClassName="w-full sm:w-80"
          className="bg-white border-light-gray placeholder:text-faint text-xs font-medium"
          suffixElement={<Icon name="search-01" folder="dashboardIcon" size="sm" className="text-faint" />}
        />
        <RowsPerPage
          value={pageSize}
          options={PAGE_SIZES}
          onChange={(n) => {
            setPageSize(n);
            setPage(1);
          }}
        />
      </div>

      <div className={`admin-table-container transition-opacity ${isFetching && !isLoading ? "opacity-60" : ""}`}>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Product</th>
              <th>Store</th>
              <th>Orders</th>
              <th>Units</th>
              <th>Average price</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && !badRange ? (
              <SkeletonRows rows={pageSize} cols={COLS} />
            ) : isError && !badRange ? (
              <ErrorRow cols={COLS} error={error} fallback="Couldn't load the sales report." onRetry={refetch} />
            ) : shown.length === 0 ? (
              search.trim() ? (
                <EmptyTableRow
                  colSpan={COLS}
                  illustration="search"
                  title="No matches"
                  description={`No products match "${search.trim()}".`}
                  action={{ label: "Clear search", onClick: () => setSearch("") }}
                />
              ) : (
                <EmptyTableRow
                  colSpan={COLS}
                  illustration="chart"
                  title="No sales in this period"
                  description="Products will appear here once paid orders come in. Try a longer date range."
                />
              )
            ) : (
              shown.map((r, i) => (
                <tr key={`${r.product}-${r.store}-${r.market}`}>
                  <td className="text-xs text-faint tabular-nums">{(page - 1) * pageSize + i + 1}</td>
                  <td>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-brand-charcoal">{r.product}</span>
                      <span className="text-[11px] text-faint">{r.category || "Uncategorised"}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col">
                      <span className="text-xs text-subtle">{r.store}</span>
                      <span className="text-[11px] text-faint">{r.market}</span>
                    </div>
                  </td>
                  <td className="text-xs text-subtle tabular-nums">{r.orders.toLocaleString()}</td>
                  <td className="text-xs text-subtle tabular-nums">{r.quantity.toLocaleString()}</td>
                  <td className="text-xs text-subtle tabular-nums whitespace-nowrap">{formatMoney(r.avg_price, r.currency)}</td>
                  <td className="text-xs font-semibold text-brand-charcoal tabular-nums whitespace-nowrap">
                    {formatMoney(r.revenue, r.currency)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </>
  );
}

/* ───────────────────────── Refunded orders ───────────────────────── */

function RefundedOrders() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { data, isLoading, isFetching, isError, error, refetch } = useGetAdminRefundsQuery({ page, page_size: pageSize });
  const items = data?.items ?? [];
  const total = data?.pagination.total ?? 0;
  const totalPages = total ? Math.max(1, Math.ceil(total / pageSize)) : 1;
  const COLS = 6;

  return (
    <>
      <div className="p-4 sm:px-6 flex flex-col sm:flex-row gap-3 sm:items-center justify-between border-b border-light-gray">
        <p className="text-[12px] text-subtle">
          Refunds are recorded per order. Approve or reject them on{" "}
          <Link href="/admin/refunds" className="font-semibold text-brand-orange-text hover:underline">
            Refunds
          </Link>
          .
        </p>
        <RowsPerPage
          value={pageSize}
          options={PAGE_SIZES}
          onChange={(n) => {
            setPageSize(n);
            setPage(1);
          }}
        />
      </div>

      <div className={`admin-table-container transition-opacity ${isFetching && !isLoading ? "opacity-60" : ""}`}>
        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Buyer</th>
              <th>Amount</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Requested</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <SkeletonRows rows={pageSize} cols={COLS} />
            ) : isError ? (
              <ErrorRow cols={COLS} error={error} fallback="Couldn't load refunds." onRetry={refetch} />
            ) : items.length === 0 ? (
              <EmptyTableRow
                colSpan={COLS}
                illustration="refunds"
                title="No refunds yet"
                description="Refunded orders will appear here."
              />
            ) : (
              items.map((r) => (
                <tr key={r.id}>
                  <td className="text-xs font-semibold whitespace-nowrap">
                    {r.order ? (
                      <Link href={`/admin/orders/${r.order.id}`} className="text-brand-orange-text hover:underline">
                        {r.order.order_number}
                      </Link>
                    ) : (
                      <span className="text-subtle">—</span>
                    )}
                  </td>
                  <td>
                    <div className="flex flex-col">
                      <span className="text-xs text-brand-charcoal">{r.buyer?.name || "—"}</span>
                      {r.buyer?.email && <span className="text-[11px] text-faint">{r.buyer.email}</span>}
                    </div>
                  </td>
                  <td className="text-xs font-semibold text-brand-charcoal tabular-nums whitespace-nowrap">
                    {formatMoney(r.amount, r.currency)}
                  </td>
                  <td className="text-xs text-subtle max-w-64 truncate" title={r.reason}>
                    {r.reason || "—"}
                  </td>
                  <td>
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="text-xs text-subtle whitespace-nowrap">{formatDate(r.created_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </>
  );
}
