"use client";

import React, { useCallback, useMemo, useState } from "react";
import {
  OrderListingView,
  type ListingColumn,
  type StatItem,
} from "../../components/Admin/Orders/OrderListingView";
import { StatusBadge } from "../../components/Admin/Orders/StatusBadge";
import {
  apiErrorMessage,
  formatDate,
  formatMoney,
  useGetFinancingDashboardQuery,
  useGetFinancingInvoicesQuery,
  type FinancingDashboardRow,
  type FinancingInvoice,
} from "@/lib/store";

/** Tab label → /admin/financing/invoices/?status= */
const TAB_STATUS: Record<string, string> = {
  All: "all",
  Outstanding: "outstanding",
  "Pending approval": "pending_approval",
  Overdue: "overdue",
  Paid: "paid",
  Declined: "declined",
  Cancelled: "cancelled",
};
const TABS = Object.keys(TAB_STATUS);

/** Money per currency, never summed across currencies, e.g. "₦85,850 · $120" */
function perCurrency(rows: FinancingDashboardRow[], pick: (r: FinancingDashboardRow) => number): string {
  if (rows.length === 0) return formatMoney(0);
  return rows.map((r) => formatMoney(pick(r), r.currency)).join(" · ");
}

function sumCount(rows: FinancingDashboardRow[], pick: (r: FinancingDashboardRow) => number): number {
  return rows.reduce((n, r) => n + pick(r), 0);
}

const plural = (n: number, word: string) => `${n.toLocaleString()} ${word}${n === 1 ? "" : "s"}`;

const columns: ListingColumn<FinancingInvoice>[] = [
  {
    key: "invoice",
    header: "Invoice #",
    render: (inv) => (
      <div className="flex flex-col">
        <span className="font-mono text-sm text-brand-charcoal whitespace-nowrap">{inv.invoice_number}</span>
        {inv.central_order_number && (
          <span className="text-[11px] text-faint whitespace-nowrap">{inv.central_order_number}</span>
        )}
      </div>
    ),
  },
  {
    key: "retailer",
    header: "Retailer",
    render: (inv) => (
      <div className="flex flex-col min-w-40">
        <span className="text-sm text-brand-charcoal">{inv.retailer?.business_name || inv.retailer?.name || "—"}</span>
        {inv.retailer?.business_name && inv.retailer.name && (
          <span className="text-[11px] text-faint">{inv.retailer.name}</span>
        )}
      </div>
    ),
  },
  {
    key: "dates",
    header: "Issued / Due",
    render: (inv) => (
      <div className="flex flex-col whitespace-nowrap">
        <span className="text-sm text-subtle">{formatDate(inv.issued_at)}</span>
        <span className="text-[11px] text-faint">Due {formatDate(inv.due_date)}</span>
      </div>
    ),
  },
  {
    key: "payable",
    header: "Total payable",
    render: (inv) => (
      <div className="flex flex-col whitespace-nowrap">
        <span className="font-mono text-sm text-brand-charcoal">{formatMoney(inv.total_payable, inv.currency)}</span>
        <span className={`text-[11px] ${inv.balance > 0 ? "text-brand-orange-text" : "text-faint"}`}>
          Balance {formatMoney(inv.balance, inv.currency)}
        </span>
      </div>
    ),
  },
  {
    key: "paid",
    header: "Paid so far",
    render: (inv) => (
      <span className="font-mono text-sm text-subtle whitespace-nowrap">{formatMoney(inv.amount_paid, inv.currency)}</span>
    ),
  },
  { key: "status", header: "Status", render: (inv) => <StatusBadge status={inv.status} /> },
];

export default function BnplOrderListing() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, currentData, isFetching, error, refetch } = useGetFinancingInvoicesQuery({
    status: TAB_STATUS[activeTab],
    search: search || undefined,
    page,
    page_size: pageSize,
  });

  const dashboard = useGetFinancingDashboardQuery();
  const byCurrency = dashboard.data?.by_currency;

  const stats: StatItem[] = useMemo(() => {
    const rows = byCurrency ?? [];
    const overdue = sumCount(rows, (r) => r.overdue_count);
    const dueSoon = sumCount(rows, (r) => r.due_next_7_days_count);
    const pending = sumCount(rows, (r) => r.pending_count);
    return [
      { title: "Outstanding", value: perCurrency(rows, (r) => r.outstanding_total), hint: "Unpaid balance on open invoices" },
      { title: "Overdue", value: perCurrency(rows, (r) => r.overdue_total), hint: plural(overdue, "invoice") },
      { title: "Due next 7 days", value: perCurrency(rows, (r) => r.due_next_7_days_total), hint: plural(dueSoon, "invoice") },
      { title: "Paid this month", value: perCurrency(rows, (r) => r.paid_this_month_total), hint: "Repayments received" },
      {
        title: "Approved applications",
        value: sumCount(rows, (r) => r.approved_count).toLocaleString(),
        hint: `${pending.toLocaleString()} pending review`,
      },
    ];
  }, [byCurrency]);

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const listError = !currentData && !isFetching && error ? apiErrorMessage(error, "Couldn't load BNPL invoices.") : null;

  return (
    <OrderListingView
      stats={stats}
      statsLoading={dashboard.isLoading}
      statsError={dashboard.isError ? apiErrorMessage(dashboard.error, "Couldn't load the BNPL summary.") : null}
      onStatsRetry={dashboard.refetch}
      tabs={TABS}
      activeTab={activeTab}
      onTabChange={(tab) => {
        setActiveTab(tab);
        setPage(1);
      }}
      search={search}
      onSearchChange={handleSearch}
      searchPlaceholder="Search invoice, order or retailer"
      columns={columns}
      rows={currentData?.items ?? []}
      getRowId={(inv) => inv.id}
      getRowHref={(inv) => `/admin/bnpl-orders/${inv.id}`}
      getRowLabel={(inv) => `invoice ${inv.invoice_number}`}
      total={(currentData ?? data)?.pagination.total ?? 0}
      page={page}
      pageSize={pageSize}
      pageSizeOptions={[10, 20, 50]}
      onPageChange={setPage}
      onPageSizeChange={(size) => {
        setPageSize(size);
        setPage(1);
      }}
      isLoading={isFetching && !currentData}
      isRefreshing={isFetching && !!currentData}
      error={listError}
      onRetry={refetch}
      emptyIllustration="invoices"
      emptyTitle={activeTab === TABS[0] ? "No BNPL invoices yet" : `No ${activeTab.toLowerCase()} invoices`}
      emptyHint={
        activeTab === TABS[0]
          ? "BNPL invoices will appear here once a financing request is approved."
          : "Invoices with this status will appear here."
      }
      emptySearchHint="Search matches invoice number, group order number or retailer."
    />
  );
}
