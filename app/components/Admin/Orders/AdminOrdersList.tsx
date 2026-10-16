"use client";

import React, { useCallback, useMemo, useState } from "react";
import { OrderListingView, type ListingColumn, type StatItem } from "./OrderListingView";
import { StatusBadge } from "./StatusBadge";
import {
  apiErrorMessage,
  formatDate,
  formatMoney,
  useGetAdminOrdersQuery,
  type AdminOrderListItem,
} from "@/lib/store";

/** Tab label → exact orders_order.status (undefined = all) */
const TAB_STATUS: Record<string, string | undefined> = {
  All: undefined,
  "Awaiting payment": "pending_payment",
  New: "new",
  Confirmed: "confirmed",
  "In transit": "in_transit",
  Delivered: "delivered",
  Cancelled: "cancelled",
  "Refund due": "refund_due",
};
const TABS = Object.keys(TAB_STATUS);

/* The list endpoint has no summary, so each tile is the pagination total of a
   one-row query for that status: real counts, no invented money figures. */
function useStatusCount(status?: string) {
  const q = useGetAdminOrdersQuery({ status, page: 1, page_size: 1 });
  return { count: q.data?.pagination.total, isLoading: q.isLoading, isError: q.isError, refetch: q.refetch };
}

const columns: ListingColumn<AdminOrderListItem>[] = [
  {
    key: "order",
    header: "Order #",
    render: (o) => <span className="font-mono text-sm text-gray-900 whitespace-nowrap">{o.order_number}</span>,
  },
  { key: "buyer", header: "Buyer", render: (o) => <span className="text-sm text-gray-700">{o.buyer_name || "—"}</span> },
  { key: "seller", header: "Seller", render: (o) => <span className="text-sm text-gray-700">{o.seller_name || "—"}</span> },
  {
    key: "date",
    header: "Date",
    render: (o) => <span className="text-sm text-subtle whitespace-nowrap">{formatDate(o.created_at)}</span>,
  },
  {
    key: "total",
    header: "Total",
    render: (o) => <span className="font-mono text-sm text-gray-900 whitespace-nowrap">{formatMoney(o.total_amount)}</span>,
  },
  { key: "status", header: "Status", render: (o) => <StatusBadge status={o.status} /> },
];

/** Server-driven admin orders list (GET /admin/orders/) with status-count tiles */
export function AdminOrdersList({ searchPlaceholder = "Search by order number" }: { searchPlaceholder?: string }) {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, currentData, isFetching, error, refetch } = useGetAdminOrdersQuery({
    status: TAB_STATUS[activeTab],
    q: search || undefined,
    page,
    page_size: pageSize,
  });

  const all = useStatusCount();
  const awaiting = useStatusCount("pending_payment");
  const delivered = useStatusCount("delivered");
  const cancelled = useStatusCount("cancelled");
  const statsParts = [all, awaiting, delivered, cancelled];

  const stats: StatItem[] = useMemo(
    () => [
      { title: "Total orders", value: (all.count ?? 0).toLocaleString(), hint: "All statuses" },
      { title: "Awaiting payment", value: (awaiting.count ?? 0).toLocaleString(), hint: "Not paid yet" },
      { title: "Delivered", value: (delivered.count ?? 0).toLocaleString(), hint: "Completed orders" },
      { title: "Cancelled", value: (cancelled.count ?? 0).toLocaleString(), hint: "Cancelled by buyer or staff" },
    ],
    [all.count, awaiting.count, delivered.count, cancelled.count],
  );

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const showSkeleton = isFetching && !currentData;
  const listError = !currentData && !isFetching && error ? apiErrorMessage(error, "Couldn't load orders.") : null;

  return (
    <OrderListingView
      stats={stats}
      statsLoading={statsParts.some((p) => p.isLoading)}
      statsError={statsParts.some((p) => p.isError) ? "Couldn't load order counts." : null}
      onStatsRetry={() => statsParts.forEach((p) => p.refetch())}
      tabs={TABS}
      activeTab={activeTab}
      onTabChange={(tab) => {
        setActiveTab(tab);
        setPage(1);
      }}
      search={search}
      onSearchChange={handleSearch}
      searchPlaceholder={searchPlaceholder}
      columns={columns}
      rows={currentData?.items ?? []}
      getRowId={(o) => o.id}
      getRowHref={(o) => `/admin/orders/${o.id}`}
      getRowLabel={(o) => `order ${o.order_number}`}
      total={(currentData ?? data)?.pagination.total ?? 0}
      page={page}
      pageSize={pageSize}
      pageSizeOptions={[10, 20, 50, 100]}
      onPageChange={setPage}
      onPageSizeChange={(size) => {
        setPageSize(size);
        setPage(1);
      }}
      isLoading={showSkeleton}
      isRefreshing={isFetching && !!currentData}
      error={listError}
      onRetry={refetch}
      emptyIllustration="orders"
      emptyTitle={activeTab === TABS[0] ? "No orders yet" : `No ${activeTab.toLowerCase()} orders`}
      emptyHint={
        activeTab === TABS[0]
          ? "Orders will appear here once customers place them."
          : "Orders with this status will appear here."
      }
      emptySearchHint="Search matches the order number."
    />
  );
}
