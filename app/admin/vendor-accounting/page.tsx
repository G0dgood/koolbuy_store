"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { HiOutlineArrowDownTray, HiOutlineBuildingStorefront, HiOutlineDocumentText } from "react-icons/hi2";
import { StatCard } from "@/app/components/Admin/StatCard";
import { Pagination } from "@/app/components/Admin/Pagination";
import { StatusBadge } from "@/app/components/Admin/Orders/StatusBadge";
import { RowsPerPage } from "@/app/components/rows-per-page";
import { DatePicker } from "@/app/components/Form/DatePicker";
import { Button } from "@/app/components/Button";
import { TabFilter } from "@/app/components/Tabs";
import { EmptyTableRow } from "@/app/components/EmptyState";
import Search from "@/app/components/ui/Search";
import Drawer from "@/app/components/Drawer/Drawer";
import {
  apiErrorMessage,
  formatDate,
  formatMoney,
  humanize,
  useGetVendorSettlementOrdersQuery,
  useGetVendorSettlementsQuery,
  type VendorSettlementRow,
} from "@/lib/store";

/* Vendor settlements, one row per (seller, currency), from
   GET /admin/accounting/vendors/. Orders awaiting payment or credit review,
   cancelled, expired, declined or refund-due orders are left out by the
   backend. Cost, margin, deduction and earning figures need the
   procurement.margins permission; without it they come back null. */

const HINTS = {
  orders: "Orders that count toward settlement: excludes ones awaiting payment or credit review, cancelled, expired, declined and refund due.",
  orderValue: "Goods subtotal at customer prices (order total_amount), delivery excluded.",
  paid: "Amount of the order's payment when that payment is paid; 0 otherwise.",
  delivery: "Delivery fees charged on these orders.",
  vendorCost: "What the platform owes the vendor for the goods: sum of recorded vendor line costs (lines without a cost count as 0).",
  margin: "Selling price minus vendor cost, on lines that have a vendor cost.",
  deductions: "Active procurement deductions recorded against these orders (removed ones excluded).",
  gateway: "Payment provider fees on paid payments.",
} as const;

const COLUMNS = 9;
const MARGINS_HIDDEN_NOTE = "Margins hidden: needs margin permission";

const Skel = ({ className = "w-20" }: { className?: string }) => (
  <span className={`inline-block h-3 rounded bg-black/[0.06] animate-pulse align-middle ${className}`} />
);

function Th({ children, hint, className = "" }: { children: React.ReactNode; hint?: string; className?: string }) {
  return (
    <th className={className} title={hint}>
      <span className={hint ? "underline decoration-dotted decoration-faint underline-offset-4 cursor-help" : undefined}>
        {children}
      </span>
    </th>
  );
}

const csvCell = (v: string | number | null | undefined) => {
  const s = v === null || v === undefined ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export default function VendorAccountingPage() {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [currencyPick, setCurrencyPick] = useState<string | null>(null);
  const [selected, setSelected] = useState<VendorSettlementRow | null>(null);

  // Debounce the search box into the query sent to the server.
  useEffect(() => {
    const id = setTimeout(() => setQuery(search.trim()), 300);
    return () => clearTimeout(id);
  }, [search]);

  const range = { from: from || undefined, to: to || undefined };
  const { data, isLoading, isFetching, isError, error, refetch } = useGetVendorSettlementsQuery({
    ...range,
    q: query || undefined,
    page: currentPage,
    page_size: rowsPerPage,
  });

  const items = data?.items ?? [];
  const totals = data?.totals ?? [];
  const marginsVisible = data?.margins_visible ?? true;
  const total = data?.pagination?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));
  const summary = totals.find((t) => t.currency === currencyPick) ?? totals[0];
  const currency = summary?.currency ?? "NGN";
  const filtered = !!(query || from || to);

  const statValue = (v: number | null | undefined) =>
    isLoading ? <Skel className="h-7 w-24" /> : isError ? "—" : formatMoney(v ?? 0, currency);
  const marginValue = (v: number | null | undefined) =>
    isLoading ? <Skel className="h-7 w-24" /> : isError || v === null ? "—" : formatMoney(v ?? 0, currency);

  const resetPage = () => setCurrentPage(1);

  const exportPage = () => {
    const header = [
      "Vendor",
      "Currency",
      "Orders",
      "Order value",
      "Paid",
      "Delivery fees",
      "Vendor cost / earning",
      "Admin margin",
      "Deductions",
      "Gateway fees",
    ];
    const lines = items.map((r) =>
      [
        r.name,
        r.currency,
        r.orders_count,
        r.order_value,
        r.paid_value,
        r.delivery_fees,
        r.vendor_earning,
        r.admin_margin,
        r.deductions_total,
        r.gateway_fees,
      ]
        .map(csvCell)
        .join(","),
    );
    const blob = new Blob([[header.join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vendor-settlements-page-${currentPage}-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Currency switch (totals are never summed across currencies) */}
      {totals.length > 1 && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-faint">Totals in</span>
          <TabFilter
            ariaLabel="Totals currency"
            tabs={totals.map((t) => t.currency)}
            activeTab={currency}
            onChange={setCurrencyPick}
          />
        </div>
      )}

      {/* Totals for the current filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatCard
          size="sm"
          title="Order value"
          value={statValue(summary?.order_value)}
          periodLabel={
            summary ? `${summary.vendors_count.toLocaleString()} vendor${summary.vendors_count === 1 ? "" : "s"} · goods subtotal, delivery excluded` : HINTS.orderValue
          }
        />
        <StatCard size="sm" title="Paid value" value={statValue(summary?.paid_value)} periodLabel="Collected on paid payments" />
        <StatCard
          size="sm"
          title="Vendor earnings"
          value={marginValue(summary?.vendor_earning)}
          periodLabel={marginsVisible ? "Owed to vendors (their recorded cost)" : MARGINS_HIDDEN_NOTE}
        />
        <StatCard
          size="sm"
          title="Admin margin"
          value={marginValue(summary?.admin_margin)}
          periodLabel={marginsVisible ? "Selling price minus vendor cost" : MARGINS_HIDDEN_NOTE}
        />
        <StatCard
          size="sm"
          title="Delivery fees"
          value={statValue(summary?.delivery_fees)}
          periodLabel="Charged on these orders"
        />
        <StatCard
          size="sm"
          title="Gateway fees · Deductions"
          value={
            isLoading ? (
              <Skel className="h-7 w-24" />
            ) : (
              <>
                {isError ? "—" : formatMoney(summary?.gateway_fees ?? 0, currency)}
                <span className="text-faint font-normal"> · </span>
                {isError || summary?.deductions_total === null ? "—" : formatMoney(summary?.deductions_total ?? 0, currency)}
              </>
            )
          }
          periodLabel={marginsVisible ? "Provider fees · active procurement deductions" : `Provider fees · ${MARGINS_HIDDEN_NOTE.toLowerCase()}`}
        />
      </div>

      {/* Settlements table */}
      <div className="bg-white rounded-lg border border-light-gray overflow-hidden flex flex-col">
        <div className="p-4 sm:p-6 flex flex-col xl:flex-row gap-4 xl:items-end justify-between border-b border-light-gray">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full xl:w-auto xl:min-w-[360px]">
            <DatePicker
              label="From"
              hideLabel
              placeholder="From date"
              value={from}
              max={to || undefined}
              onChange={(v: string) => {
                setFrom(v);
                resetPage();
              }}
              align="left"
              clearable
            />
            <DatePicker
              label="To"
              hideLabel
              placeholder="To date"
              value={to}
              min={from || undefined}
              onChange={(v: string) => {
                setTo(v);
                resetPage();
              }}
              align="left"
              clearable
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full xl:w-auto">
            <Search
              value={search}
              onChange={(val) => {
                setSearch(typeof val === "string" ? val : (val as any).target?.value ?? "");
                resetPage();
              }}
              placeholder="Search vendor name"
              className="w-full sm:!w-72"
              maxWidth="max-w-none"
            />
            <div className="flex items-center gap-3">
              <RowsPerPage
                value={rowsPerPage}
                options={[10, 20, 50, 100]}
                onChange={(n) => {
                  setRowsPerPage(n);
                  resetPage();
                }}
              />
              <Button
                variant="outline"
                shape="rounded-sm"
                className="ml-auto sm:ml-0 whitespace-nowrap"
                onClick={exportPage}
                disabled={items.length === 0}
                iconLeft={<HiOutlineArrowDownTray size={14} />}
                title="Download the rows shown on this page as CSV (not every page)"
              >
                Export this page
              </Button>
            </div>
          </div>
        </div>

        {!marginsVisible && <p className="px-4 sm:px-6 pt-3 text-[12px] text-faint">{MARGINS_HIDDEN_NOTE}.</p>}

        <div className={`admin-table-container transition-opacity ${isFetching && !isLoading ? "opacity-60" : ""}`}>
          <table>
            <thead>
              <tr>
                <Th hint={HINTS.orders}>Vendor</Th>
                <Th hint={HINTS.orderValue}>Order value</Th>
                <Th hint={HINTS.paid}>Paid</Th>
                <Th hint={HINTS.delivery}>Delivery fees</Th>
                <Th hint={HINTS.vendorCost}>Vendor cost / earning</Th>
                <Th hint={HINTS.margin}>Admin margin</Th>
                <Th hint={HINTS.deductions}>Deductions</Th>
                <Th hint={HINTS.gateway}>Gateway fees</Th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: Math.min(rowsPerPage, 6) }, (_, i) => (
                  <tr key={`sk-${i}`} aria-hidden>
                    {Array.from({ length: COLUMNS }, (_, j) => (
                      <td key={j}>
                        <Skel className={j === 0 ? "w-32" : "w-16"} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={COLUMNS} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <p className="text-[13px] text-error">{apiErrorMessage(error, "Couldn't load vendor settlements.")}</p>
                      <Button variant="outline" size="sm" onClick={() => refetch()}>
                        Try again
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                filtered ? (
                  <EmptyTableRow
                    colSpan={COLUMNS}
                    illustration="search"
                    title="No matches"
                    description="No vendor settlements match this search or date range."
                    action={{
                      label: "Clear filters",
                      onClick: () => {
                        setSearch("");
                        setQuery("");
                        setFrom("");
                        setTo("");
                        resetPage();
                      },
                    }}
                  />
                ) : (
                  <EmptyTableRow
                    colSpan={COLUMNS}
                    illustration="vendors"
                    title="No vendor settlements yet"
                    description="Vendor settlements will appear here once vendors receive orders that are paid or in fulfilment."
                  />
                )
              ) : (
                items.map((row) => {
                  const money = (v: number | null) => formatMoney(v, row.currency);
                  return (
                    <tr
                      key={`${row.id}-${row.currency}`}
                      onClick={() => row.id && setSelected(row)}
                      className={row.id ? "cursor-pointer" : undefined}
                    >
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-md bg-brand-orange-soft text-brand-orange-text flex items-center justify-center shrink-0">
                            <HiOutlineBuildingStorefront size={14} />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-xs text-brand-charcoal whitespace-nowrap">{row.name}</span>
                            <span className="text-[11px] text-faint">
                              {row.orders_count.toLocaleString()} order{row.orders_count === 1 ? "" : "s"}
                              {totals.length > 1 ? ` · ${row.currency}` : ""}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="text-xs font-semibold text-brand-charcoal tabular-nums whitespace-nowrap">
                        {money(row.order_value)}
                      </td>
                      <td className="text-xs text-subtle tabular-nums whitespace-nowrap">{money(row.paid_value)}</td>
                      <td className="text-xs text-subtle tabular-nums whitespace-nowrap">{money(row.delivery_fees)}</td>
                      <td className="text-xs font-semibold text-success tabular-nums whitespace-nowrap">
                        {money(row.vendor_earning)}
                      </td>
                      <td className="text-xs font-semibold text-brand-orange-text tabular-nums whitespace-nowrap">
                        {money(row.admin_margin)}
                      </td>
                      <td className="text-xs text-subtle tabular-nums whitespace-nowrap">{money(row.deductions_total)}</td>
                      <td className="text-xs text-subtle tabular-nums whitespace-nowrap">{money(row.gateway_fees)}</td>
                      <td className="text-right">
                        <div className="flex justify-end pr-4">
                          <Button
                            variant="outline"
                            shape="rounded-sm"
                            aria-label={`View orders for ${row.name}`}
                            title={row.id ? "View orders" : "This vendor has no public id"}
                            disabled={!row.id}
                            className="p-1.5! text-faint hover:text-brand-orange-text hover:bg-brand-orange-soft transition-all"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelected(row);
                            }}
                          >
                            <HiOutlineDocumentText size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {total > 0 && totalPages > 1 && (
          <div className="admin-pagination-footer">
            <p className="text-xs text-faint">
              Showing{" "}
              <span className="font-semibold text-brand-charcoal">{(currentPage - 1) * rowsPerPage + 1}</span> to{" "}
              <span className="font-semibold text-brand-charcoal">{Math.min(currentPage * rowsPerPage, total)}</span>{" "}
              of <span className="font-semibold text-brand-charcoal">{total}</span> entries
            </p>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        )}
      </div>

      <VendorOrdersDrawer vendor={selected} from={range.from} to={range.to} onClose={() => setSelected(null)} />
    </div>
  );
}

/* ───────────── One vendor's orders (GET /admin/accounting/vendors/:id/orders/) ───────────── */

const ORDER_COLUMNS = 8;

function VendorOrdersDrawer({
  vendor,
  from,
  to,
  onClose,
}: {
  vendor: VendorSettlementRow | null;
  from?: string;
  to?: string;
  onClose: () => void;
}) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [seenId, setSeenId] = useState<string | null>(null);

  // Start from page 1 whenever a different vendor is opened.
  const vendorId = vendor?.id ?? null;
  if (vendorId !== seenId) {
    setSeenId(vendorId);
    setPage(1);
  }

  const { data, isLoading, isFetching, isError, error, refetch } = useGetVendorSettlementOrdersQuery(
    { sellerId: vendorId ?? "", from, to, page, page_size: pageSize },
    { skip: !vendorId },
  );

  const orders = data?.items ?? [];
  const total = data?.pagination?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const marginsVisible = data?.margins_visible ?? true;
  const rangeLabel =
    from || to ? `${from ? formatDate(from) : "Start"} – ${to ? formatDate(to) : "today"}` : "All time";

  return (
    <Drawer isOpen={!!vendor} onClose={onClose} title={vendor?.name ?? "Vendor orders"} width="max-w-4xl">
      {vendor && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-subtle">
            <span>{rangeLabel}</span>
            <span>
              {vendor.orders_count.toLocaleString()} order{vendor.orders_count === 1 ? "" : "s"} · order value{" "}
              <span className="font-semibold text-brand-charcoal">{formatMoney(vendor.order_value, vendor.currency)}</span>
            </span>
            {vendor.vendor_earning !== null && (
              <span>
                Owed to vendor{" "}
                <span className="font-semibold text-success">{formatMoney(vendor.vendor_earning, vendor.currency)}</span>
              </span>
            )}
          </div>
          {!marginsVisible && <p className="text-[12px] text-faint">{MARGINS_HIDDEN_NOTE}.</p>}

          {/* The drawer renders outside #page-wrapper, so the admin table styles are applied here. */}
          <div
            className={`overflow-x-auto border border-light-gray rounded-lg transition-opacity ${
              isFetching && !isLoading ? "opacity-60" : ""
            }`}
          >
            <table className="w-full text-left border-collapse [&_th]:px-3 [&_th]:py-2.5 [&_th]:text-[12px] [&_th]:font-semibold [&_th]:text-faint [&_th]:bg-off-white [&_th]:whitespace-nowrap [&_td]:px-3 [&_td]:py-3 [&_tbody_tr]:border-t [&_tbody_tr]:border-light-gray">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Status</th>
                  <Th hint={HINTS.orderValue}>Order value</Th>
                  <Th hint={HINTS.delivery}>Delivery</Th>
                  <Th hint={HINTS.paid}>Paid</Th>
                  <Th hint={HINTS.vendorCost}>Vendor cost</Th>
                  <Th hint={HINTS.margin}>Margin</Th>
                  <Th hint={HINTS.deductions}>Deductions</Th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 4 }, (_, i) => (
                    <tr key={`sk-${i}`} aria-hidden>
                      {Array.from({ length: ORDER_COLUMNS }, (_, j) => (
                        <td key={j}>
                          <Skel className={j === 0 ? "w-28" : "w-14"} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : isError ? (
                  <tr>
                    <td colSpan={ORDER_COLUMNS} className="py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <p className="text-[13px] text-error">{apiErrorMessage(error, "Couldn't load this vendor's orders.")}</p>
                        <Button variant="outline" size="sm" onClick={() => refetch()}>
                          Try again
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <EmptyTableRow
                    colSpan={ORDER_COLUMNS}
                    size="sm"
                    illustration="orders"
                    title="No orders in this range"
                    description="This vendor's orders will appear here once they're paid or in fulfilment."
                  />
                ) : (
                  orders.map((o) => {
                    const money = (v: number | null) => formatMoney(v, o.currency);
                    return (
                      <tr key={o.order_id}>
                        <td>
                          <div className="flex flex-col">
                            <Link
                              href={`/admin/orders/${o.order_id}`}
                              className="text-xs font-semibold text-brand-orange-text hover:underline whitespace-nowrap"
                            >
                              {o.order_number}
                            </Link>
                            <span className="text-[11px] text-faint whitespace-nowrap">{formatDate(o.created_at)}</span>
                          </div>
                        </td>
                        <td>
                          <div className="flex flex-col items-start gap-1">
                            <StatusBadge status={o.status} />
                            <span className="text-[11px] text-faint whitespace-nowrap">
                              Payment: {o.payment_status ? humanize(o.payment_status) : "none"}
                            </span>
                          </div>
                        </td>
                        <td className="text-xs font-semibold text-brand-charcoal tabular-nums whitespace-nowrap">
                          {money(o.order_value)}
                        </td>
                        <td className="text-xs text-subtle tabular-nums whitespace-nowrap">{money(o.delivery_fee)}</td>
                        <td className="text-xs text-subtle tabular-nums whitespace-nowrap">{money(o.paid_value)}</td>
                        <td className="text-xs font-semibold text-success tabular-nums whitespace-nowrap">
                          {money(o.vendor_cost_total)}
                        </td>
                        <td className="text-xs text-brand-orange-text tabular-nums whitespace-nowrap">
                          {money(o.admin_margin)}
                        </td>
                        <td className="text-xs text-subtle tabular-nums whitespace-nowrap">{money(o.deductions_total)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <RowsPerPage
                value={pageSize}
                options={[10, 20, 50, 100]}
                onChange={(n) => {
                  setPageSize(n);
                  setPage(1);
                }}
              />
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
        </div>
      )}
    </Drawer>
  );
}
