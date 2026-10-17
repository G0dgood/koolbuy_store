"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { HiOutlineArrowDownTray, HiOutlineDocumentText } from "react-icons/hi2";
import { Button } from "../../components/Button";
import Search from "@/app/components/ui/Search";
import { StatCard } from "../../components/Admin/StatCard";
import { TabFilter } from "../../components/Admin/TabFilter";
import { Pagination } from "../../components/Admin/Pagination";
import {
  TransactionDetailDrawer,
  toneStyles,
  transactionStatusLabel,
  transactionTone,
} from "../../components/Admin/TransactionDetailDrawer";
import { RowsPerPage } from "@/app/components/rows-per-page";
import Checkbox from "@/app/components/Checkbox";
import { EmptyTableRow } from "@/app/components/EmptyState";
import { normalizeApiBase, readStoredTokens } from "@/lib/api";
import {
  apiErrorMessage,
  formatDate,
  formatMoney,
  humanize,
  useGetAdminTransactionsQuery,
  useGetTransactionsSummaryQuery,
  type AdminTransaction,
} from "@/lib/store";

/* Tab label → backend `status` filter. The backend filters on one exact status,
   so "initiated" (checkout started, never paid) and "pending" (awaiting
   confirmation) are separate tabs; amount_mismatch rows show under "All". */
const TABS = [
  { label: "All transactions", slug: "all", status: undefined },
  { label: "Completed", slug: "completed", status: "paid" },
  { label: "Pending", slug: "pending", status: "pending" },
  { label: "Initiated", slug: "initiated", status: "initiated" },
  { label: "Failed", slug: "failed", status: "failed" },
] as const;

const tabFromSlug = (slug: string | null) => TABS.find((t) => t.slug === slug)?.label ?? TABS[0].label;

const COLUMNS = 9;

export default function TransactionsPage() {
  return (
    <Suspense fallback={null}>
      <TransactionsView />
    </Suspense>
  );
}

function TransactionsView() {
  // ?tab=completed|pending|initiated|failed preselects a tab; anything else
  // (e.g. the sidebar's ?tab=vendors-payment) shows all transactions.
  const urlTab = useSearchParams().get("tab");
  const [seenUrlTab, setSeenUrlTab] = useState(urlTab);
  const [activeTab, setActiveTab] = useState<string>(() => tabFromSlug(urlTab));
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [drawerTx, setDrawerTx] = useState<AdminTransaction | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  if (urlTab !== seenUrlTab) {
    setSeenUrlTab(urlTab);
    setActiveTab(tabFromSlug(urlTab));
    setCurrentPage(1);
  }

  // Debounce the search box into the query sent to the server.
  useEffect(() => {
    const id = setTimeout(() => setQuery(search.trim()), 300);
    return () => clearTimeout(id);
  }, [search]);

  const status = TABS.find((t) => t.label === activeTab)?.status;
  const filters = { status, q: query || undefined };

  const {
    data: list,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetAdminTransactionsQuery({ ...filters, page: currentPage, page_size: rowsPerPage });
  const { data: summaryData, isLoading: isSummaryLoading } = useGetTransactionsSummaryQuery();

  const items = list?.items ?? [];
  const totalPages = list?.pagination ? Math.max(1, Math.ceil(list.pagination.total / rowsPerPage)) : 1;

  const summary = summaryData?.by_currency?.[0];
  const currency = summary?.currency ?? "NGN";
  const statValue = (v: React.ReactNode) =>
    isSummaryLoading ? <span className="inline-block h-7 w-20 rounded bg-black/[0.06] animate-pulse align-middle" /> : v;

  const pageIds = items.map((t) => t.id);
  const allSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));

  const toggleAll = () => {
    setSelectedIds((prev) =>
      allSelected ? prev.filter((id) => !pageIds.includes(id)) : Array.from(new Set([...prev, ...pageIds])),
    );
  };

  const toggleItem = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const qs = new URLSearchParams();
      if (filters.status) qs.set("status", filters.status);
      if (filters.q) qs.set("q", filters.q);
      const base = normalizeApiBase(process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL);
      const headers: Record<string, string> = {};
      const access = readStoredTokens()?.access;
      if (access && access !== "undefined" && access !== "null") headers.Authorization = `Bearer ${access}`;
      const res = await fetch(`${base}/admin/transactions/export/${qs.size ? `?${qs}` : ""}`, { headers });
      if (!res.ok) throw new Error(`Export failed (${res.status})`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `transactions-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Couldn't export transactions. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Stats (all time, primary currency) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total revenue"
          value={statValue(formatMoney(summary?.paid_total ?? 0, currency))}
          periodLabel="Paid, all time"
        />
        <StatCard
          title="Completed transactions"
          value={statValue((summary?.paid_count ?? 0).toLocaleString())}
          periodLabel="Paid"
        />
        <StatCard
          title="Pending transactions"
          value={statValue((summary?.pending_count ?? 0).toLocaleString())}
          periodLabel="Initiated or pending"
        />
        <StatCard
          title="Failed transactions"
          value={statValue((summary?.failed_count ?? 0).toLocaleString())}
          periodLabel={
            summary?.mismatch_count ? `Plus ${summary.mismatch_count.toLocaleString()} amount mismatch` : "Failed"
          }
        />
      </div>

      {/* Transaction history */}
      <div className="bg-white rounded-lg overflow-hidden flex flex-col border border-light-gray">
        {/* Controls */}
        <div className="p-4 sm:p-6 flex flex-col lg:flex-row gap-6 items-center justify-between border-b border-light-gray">
          <TabFilter
            tabs={TABS.map((t) => t.label)}
            activeTab={activeTab}
            onChange={(tab) => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
          />

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <Search
              value={search}
              onChange={(val) => {
                setSearch(typeof val === "string" ? val : (val as any).target?.value ?? "");
                setCurrentPage(1);
              }}
              placeholder="Search reference, order or customer"
              className="w-full lg:!w-80 xl:!w-96"
              maxWidth="max-w-none"
            />

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <RowsPerPage
                value={rowsPerPage}
                options={[10, 20, 50, 100]}
                onChange={(n) => {
                  setRowsPerPage(n);
                  setCurrentPage(1);
                }}
              />
              <Button
                variant="outline"
                shape="rounded-sm"
                className="ml-auto sm:ml-0"
                onClick={handleExport}
                isLoading={isExporting}
                iconLeft={<HiOutlineArrowDownTray size={14} />}
                title="Download the filtered transactions as CSV"
              >
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className={`admin-table-container transition-opacity ${isFetching && !isLoading ? "opacity-60" : ""}`}>
          <table>
            <thead>
              <tr>
                <th className="w-10 pl-8">
                  <Checkbox checked={allSelected} onChange={toggleAll} />
                </th>
                <th>Reference</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Purpose</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: Math.min(rowsPerPage, 8) }, (_, i) => (
                  <tr key={`sk-${i}`} aria-hidden>
                    {Array.from({ length: COLUMNS }, (_, j) => (
                      <td key={j} className={j === 0 ? "w-10 pl-8" : undefined}>
                        <span className={`block h-3 rounded bg-black/[0.06] animate-pulse ${j === 0 ? "w-4" : "w-20"}`} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={COLUMNS} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <p className="text-[13px] text-error">
                        {apiErrorMessage(error, "Couldn't load transactions.")}
                      </p>
                      <Button variant="outline" size="sm" onClick={() => refetch()}>
                        Try again
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                query ? (
                  <EmptyTableRow
                    colSpan={COLUMNS}
                    illustration="search"
                    title="No matches"
                    description={`No payments match "${query}". Try a reference, order number or customer name.`}
                    action={{
                      label: "Clear search",
                      onClick: () => {
                        setSearch("");
                        setQuery("");
                        setCurrentPage(1);
                      },
                    }}
                  />
                ) : status ? (
                  <EmptyTableRow
                    colSpan={COLUMNS}
                    illustration="payments"
                    title={`No ${activeTab.toLowerCase()} payments`}
                    description="Payments with this status will appear here."
                    action={{
                      label: "Show all transactions",
                      onClick: () => {
                        setActiveTab(TABS[0].label);
                        setCurrentPage(1);
                      },
                    }}
                  />
                ) : (
                  <EmptyTableRow
                    colSpan={COLUMNS}
                    illustration="payments"
                    title="No payments yet"
                    description="Payments will appear here once they're made."
                  />
                )
              ) : (
                items.map((tx) => {
                  const tone = toneStyles[transactionTone(tx.status)];
                  return (
                    <tr key={tx.id} className="group">
                      <td className="w-10 pl-8">
                        <Checkbox checked={selectedIds.includes(tx.id)} onChange={() => toggleItem(tx.id)} />
                      </td>
                      <td>
                        <div className="flex flex-col max-w-56">
                          <span className="text-xs font-semibold text-brand-charcoal">
                            {tx.order?.order_number || "—"}
                          </span>
                          <span className="text-[11px] text-faint truncate" title={tx.reference}>
                            {tx.reference}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-brand-charcoal">{tx.buyer?.name || "—"}</span>
                          {tx.buyer?.email && <span className="text-[11px] text-faint">{tx.buyer.email}</span>}
                        </div>
                      </td>
                      <td className="text-xs text-subtle whitespace-nowrap">{formatDate(tx.created_at)}</td>
                      <td className="text-xs font-semibold text-brand-charcoal tabular-nums whitespace-nowrap">
                        {formatMoney(tx.amount, tx.currency)}
                      </td>
                      <td className="text-xs text-subtle">{humanize(tx.method || tx.channel)}</td>
                      <td className="text-xs text-subtle">{humanize(tx.purpose)}</td>
                      <td>
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <span className={`w-1.5 h-1.5 rounded-full ${tone.dot}`} />
                          <span className={`text-xs font-semibold ${tone.text}`}>
                            {transactionStatusLabel(tx.status)}
                          </span>
                        </div>
                      </td>
                      <td className="text-right">
                        <div className="flex justify-end gap-2 pr-4">
                          <Button
                            variant="outline"
                            shape="rounded-sm"
                            aria-label={`View transaction ${tx.reference}`}
                            title="View details"
                            className="p-1.5! text-faint hover:text-brand-orange-text hover:bg-brand-orange-soft transition-all"
                            onClick={() => {
                              setDrawerTx(tx);
                              setIsDrawerOpen(true);
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

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>

      <TransactionDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        transactionId={drawerTx?.id ?? null}
        transaction={drawerTx}
      />
    </div>
  );
}
