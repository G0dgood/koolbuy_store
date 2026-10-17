"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { StatCard } from "../components/Admin/StatCard";
import { RevenueByMarket } from "../components/Admin/RevenueByLocation";
import { StatusBadge, statusLabel } from "../components/Admin/Orders/StatusBadge";
import { Button } from "../components/Button";
import { EmptyState, EmptyTableRow, type IllustrationName } from "../components/EmptyState";
import { AnimatedNumber, BRAND, ChartCard, ChartKind, SERIES, SmartChart } from "../components/Admin/DashboardUi";
import { TabFilter } from "../components/Tabs";
import {
  MARKET_NAMES,
  RANGES,
  RANGE_TEXT,
  change,
  dayLabel,
  money,
  rangeDates,
  statusColor,
  timeAgo,
  type Range,
} from "../components/Admin/dashboardData";
import { apiErrorMessage } from "@/lib/store/base-api";
import { formatMoney, humanize, useGetAdminTransactionsQuery } from "@/lib/store/api/accounting-api";
import {
  useGetDashboardAnalyticsQuery,
  useGetDashboardOverviewQuery,
  useGetDashboardSalesReportQuery,
  type AdminOverview,
  type Kpi,
  type SalesReport,
} from "@/lib/store/api/dashboard-api";

const pct = (n: number) => `${Math.abs(n).toLocaleString("en-NG", { maximumFractionDigits: 1 })}%`;
const count = (n: number) => n.toLocaleString("en-NG");

const USER_ROLE_LABEL: Record<string, string> = {
  individual: "Individuals",
  retailer: "Retailers",
  wholesaler: "Wholesalers",
  admin: "Staff",
};

/** Paid payments read for "How customers pay" (the API has no breakdown, so we count a page). */
const PAYMENT_SAMPLE = 100;

/* Admin dashboard, laid out like the Koolboks Sales CRM dashboard (DESIGN.md §7a):
   period and market switch, number tiles, then chart cards and panels.
   Data: /admin/analytics/ (tiles, trend, statuses, vendors, markets, users),
   /admin/overview/ (recent orders), /admin/reports/sales/ (products, categories)
   and /admin/transactions/ (payment methods). */
export default function AdminDashboard() {
  const router = useRouter();
  const [range, setRange] = useState<Range>("30d");
  const [market, setMarket] = useState<string | undefined>(undefined);
  const t = RANGE_TEXT[range];
  const dates = useMemo(() => rangeDates(range), [range]);

  const analytics = useGetDashboardAnalyticsQuery({ period: range, market });
  const a = analytics.data;
  // The market the numbers are for: the one picked, else the admin's home market.
  const activeMarket = market ?? a?.market;
  const currency = a?.currency ?? "NGN";

  const sales = useGetDashboardSalesReportQuery(
    { date_from: dates.from, date_to: dates.to, market: activeMarket },
    { skip: !activeMarket },
  );
  const overview = useGetDashboardOverviewQuery();
  const payments = useGetAdminTransactionsQuery({
    status: "paid",
    purpose: "order_purchase",
    from: dates.from,
    to: dates.to,
    page_size: PAYMENT_SAMPLE,
  });

  const [trendKind, setTrendKind] = useState<ChartKind>("area");
  const [measure, setMeasure] = useState<"revenue" | "orders">("revenue");
  const [statusKind, setStatusKind] = useState<ChartKind>("donut");
  const [categoryKind, setCategoryKind] = useState<ChartKind>("donut");
  const [paymentKind, setPaymentKind] = useState<ChartKind>("donut");
  const [vendorKind, setVendorKind] = useState<ChartKind>("bar");
  const [usersKind, setUsersKind] = useState<ChartKind>("donut");

  const series = a?.series ?? [];
  const statuses = a?.orders_by_status ?? [];
  const totalOrdersByStatus = statuses.reduce((s, r) => s + r.count, 0);
  const topSellers = a?.top_sellers ?? [];
  const users = (a?.users_by_role ?? []).filter((u) => u.count > 0);
  const totalUsers = users.reduce((s, u) => s + u.count, 0);
  const verifiedVendors = (a?.sellers_by_type ?? []).reduce((s, v) => s + v.verified, 0);

  // Sales by category: the sales report's rows (one per product and store) added up per category.
  const salesRows = useMemo(() => sales.data?.rows ?? [], [sales.data]);
  const categories = useMemo(() => {
    const by = new Map<string, number>();
    for (const r of salesRows) {
      const key = r.category || "Uncategorised";
      by.set(key, (by.get(key) ?? 0) + Number(r.revenue || 0));
    }
    const sorted = [...by.entries()].sort((x, y) => y[1] - x[1]);
    // Six slices at most; the rest are grouped.
    if (sorted.length <= 6) return sorted;
    const rest = sorted.slice(5).reduce((s, [, v]) => s + v, 0);
    return [...sorted.slice(0, 5), ["Other", rest] as [string, number]];
  }, [salesRows]);
  const categoryTotal = categories.reduce((s, [, v]) => s + v, 0);

  // How customers pay: paid order payments in the period, counted by method.
  const paymentItems = useMemo(() => payments.data?.items ?? [], [payments.data]);
  const methods = useMemo(() => {
    const by = new Map<string, number>();
    for (const p of paymentItems) {
      const key = humanize(p.method || p.channel || "other");
      by.set(key, (by.get(key) ?? 0) + 1);
    }
    return [...by.entries()].sort((x, y) => y[1] - x[1]);
  }, [paymentItems]);
  const paymentsTotal = payments.data?.pagination.total ?? paymentItems.length;

  const marketOptions = (a?.revenue_by_market ?? []).map((m) => ({ value: m.market, label: MARKET_NAMES[m.market] ?? m.market }));

  const tile = (k: Kpi | undefined) => {
    const c = k ? change(k.value, k.previous) : null;
    return {
      trendValue: c === null ? undefined : pct(c),
      trendIsUp: (c ?? 0) >= 0,
      subtitle: `Compared with ${t.before}`,
    };
  };
  const prevHint = (k: Kpi | undefined, fmt: (v: number) => string = count) =>
    k ? `${fmt(k.previous)} in ${t.before}` : undefined;

  return (
    <div className="space-y-6 pb-12">
      {/* Intro and the period / market switch */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <p className="text-[14px] text-subtle">
          {activeMarket ? `${MARKET_NAMES[activeMarket] ?? activeMarket}, ` : ""}
          {t.now}, compared with {t.before}.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          {marketOptions.length > 1 && activeMarket && (
            <TabFilter ariaLabel="Market" activeTab={activeMarket} onChange={setMarket} options={marketOptions} />
          )}
          <TabFilter ariaLabel="Show numbers for" activeTab={range} onChange={setRange} options={RANGES} />
        </div>
      </div>

      {analytics.isError && !a ? (
        <ErrorPanel error={analytics.error} onRetry={analytics.refetch} />
      ) : (
        <>
          {/* Number tiles */}
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
            {!a ? (
              Array.from({ length: 6 }, (_, i) => <div key={i} className="h-[132px] rounded-lg border border-light-gray bg-white animate-pulse" aria-hidden />)
            ) : (
              <>
                <StatCard
                  title="Revenue"
                  value={<AnimatedNumber value={a.kpis.gmv.value} format={(v) => money(v, currency, true)} />}
                  {...tile(a.kpis.gmv)}
                  periodLabel={prevHint(a.kpis.gmv, (v) => money(v, currency, true))}
                  chartData={series.map((s) => s.gmv)}
                  onViewDetails={() => router.push("/admin/transactions")}
                />
                <StatCard
                  title="Orders"
                  value={<AnimatedNumber value={a.kpis.orders.value} />}
                  {...tile(a.kpis.orders)}
                  periodLabel={prevHint(a.kpis.orders)}
                  chartData={series.map((s) => s.orders)}
                  onViewDetails={() => router.push("/admin/orders")}
                />
                <StatCard
                  title="Average order"
                  value={<AnimatedNumber value={a.kpis.avg_order_value.value} format={(v) => money(v, currency, true)} />}
                  {...tile(a.kpis.avg_order_value)}
                  periodLabel="Per paid order"
                />
                <StatCard
                  title="Active buyers"
                  value={<AnimatedNumber value={a.kpis.active_buyers.value} />}
                  {...tile(a.kpis.active_buyers)}
                  periodLabel="Placed at least one order"
                  onViewDetails={() => router.push("/admin/customers")}
                />
                <StatCard
                  title="New users"
                  value={<AnimatedNumber value={a.kpis.new_users.value} />}
                  {...tile(a.kpis.new_users)}
                  periodLabel={prevHint(a.kpis.new_users)}
                  chartData={series.map((s) => s.new_users)}
                  onViewDetails={() => router.push("/admin/customers")}
                />
                <StatCard
                  title="New vendors"
                  value={<AnimatedNumber value={a.kpis.new_sellers.value} />}
                  {...tile(a.kpis.new_sellers)}
                  periodLabel={`${count(verifiedVendors)} verified in total`}
                  chartData={series.map((s) => s.new_sellers)}
                  onViewDetails={() => router.push("/admin/vendors")}
                />
              </>
            )}
          </div>

          {/* Trend + order status */}
          <div className="grid gap-6 lg:grid-cols-3">
            <ChartCard
              className="lg:col-span-2"
              title={measure === "revenue" ? "Revenue over time" : "Orders over time"}
              subtitle={`Per day, ${t.now}`}
              kinds={["area", "line", "bar"]}
              kind={trendKind}
              onKind={setTrendKind}
              controls={
                <TabFilter
                  ariaLabel="Measure"
                  activeTab={measure}
                  onChange={setMeasure}
                  options={[
                    { value: "revenue", label: "Revenue" },
                    { value: "orders", label: "Orders" },
                  ]}
                />
              }
            >
              {!a ? (
                <Skeleton height={290} />
              ) : !series.some((s) => (measure === "revenue" ? s.gmv : s.orders) > 0) ? (
                <Empty height={290} illustration="chart" title={measure === "revenue" ? "No sales yet" : "No orders yet"} description={measure === "revenue" ? "Sales will appear here once orders are paid." : "Orders will appear here once customers check out."} />
              ) : (
                <SmartChart
                  kind={trendKind}
                  height={290}
                  labels={series.map((s) => dayLabel(s.date))}
                  series={[
                    measure === "revenue"
                      ? { label: "Revenue", values: series.map((s) => s.gmv), color: BRAND }
                      : { label: "Orders", values: series.map((s) => s.orders), color: BRAND },
                  ]}
                  format={measure === "revenue" ? (v) => money(v, currency, true) : undefined}
                />
              )}
            </ChartCard>

            <ChartCard
              title="Orders by status"
              subtitle={a ? `${count(totalOrdersByStatus)} orders placed ${t.now}` : undefined}
              kinds={["donut", "pie", "bar"]}
              kind={statusKind}
              onKind={setStatusKind}
            >
              {!a ? (
                <Skeleton height={290} />
              ) : !totalOrdersByStatus ? (
                <Empty height={290} illustration="orders" title="No orders yet" description="Orders will appear here once customers check out." />
              ) : (
                <SmartChart
                  kind={statusKind}
                  height={290}
                  labels={statuses.map((s) => statusLabel(s.status))}
                  series={[{ label: "Orders", values: statuses.map((s) => s.count) }]}
                  sliceColors={statuses.map((s) => statusColor(s.status))}
                  horizontal={statusKind === "bar"}
                  centerLabel={{ value: count(totalOrdersByStatus), caption: "orders" }}
                />
              )}
            </ChartCard>
          </div>

          {/* Category, payments, users */}
          <div className="grid gap-6 lg:grid-cols-3">
            <ChartCard
              title="Sales by category"
              subtitle={sales.data ? `${money(categoryTotal, currency, true)} ${t.now}${sales.data.truncated ? " (top 200 products)" : ""}` : undefined}
              kinds={["donut", "pie", "bar"]}
              kind={categoryKind}
              onKind={setCategoryKind}
            >
              {sales.isError ? (
                <ErrorInline error={sales.error} onRetry={sales.refetch} />
              ) : !sales.data ? (
                <Skeleton height={260} />
              ) : !categoryTotal ? (
                <Empty height={260} illustration="chart" title="No sales yet" description="Sales will appear here once orders are paid." />
              ) : (
                <SmartChart
                  kind={categoryKind}
                  labels={categories.map(([l]) => l)}
                  series={[{ label: "Sales", values: categories.map(([, v]) => v) }]}
                  sliceColors={categoryKind === "bar" ? SERIES : undefined}
                  horizontal={categoryKind === "bar"}
                  format={(v) => money(v, currency, true)}
                  centerLabel={{ value: money(categoryTotal, currency, true), caption: "in sales" }}
                />
              )}
            </ChartCard>

            <ChartCard
              title="How customers pay"
              subtitle={
                payments.data
                  ? paymentsTotal > paymentItems.length
                    ? `Latest ${count(paymentItems.length)} of ${count(paymentsTotal)} paid orders, all markets`
                    : `${count(paymentsTotal)} paid orders ${t.now}, all markets`
                  : undefined
              }
              kinds={["donut", "pie", "bar"]}
              kind={paymentKind}
              onKind={setPaymentKind}
            >
              {payments.isError ? (
                <ErrorInline error={payments.error} onRetry={payments.refetch} />
              ) : !payments.data ? (
                <Skeleton height={260} />
              ) : !methods.length ? (
                <Empty height={260} illustration="chart" title="No payments yet" description="Payment methods will appear here once orders are paid." />
              ) : (
                <SmartChart
                  kind={paymentKind}
                  labels={methods.map(([l]) => l)}
                  series={[{ label: "Paid orders", values: methods.map(([, v]) => v) }]}
                  sliceColors={paymentKind === "bar" ? SERIES : undefined}
                  horizontal={paymentKind === "bar"}
                  centerLabel={{ value: count(paymentItems.length), caption: "paid orders" }}
                />
              )}
            </ChartCard>

            <ChartCard
              title="Users by type"
              subtitle={a ? `${count(totalUsers)} accounts in total` : undefined}
              kinds={["donut", "pie", "bar"]}
              kind={usersKind}
              onKind={setUsersKind}
            >
              {!a ? (
                <Skeleton height={260} />
              ) : !totalUsers ? (
                <Empty height={260} illustration="customers" title="No users yet" description="Accounts will appear here once people sign up." />
              ) : (
                <SmartChart
                  kind={usersKind}
                  labels={users.map((u) => USER_ROLE_LABEL[u.role] ?? humanize(u.role))}
                  series={[{ label: "Accounts", values: users.map((u) => u.count) }]}
                  sliceColors={usersKind === "bar" ? SERIES : undefined}
                  horizontal={usersKind === "bar"}
                  centerLabel={{ value: count(totalUsers), caption: "accounts" }}
                />
              )}
            </ChartCard>
          </div>

          {/* Markets, vendors, recent orders */}
          <div className="grid gap-6 lg:grid-cols-3">
            <ChartCard title="Revenue by market" subtitle={`Paid orders ${t.now}`}>
              {!a ? <Skeleton height={140} /> : <RevenueByMarket rows={a.revenue_by_market} selected={activeMarket} />}
            </ChartCard>

            <ChartCard title="Top vendors" subtitle={`By paid sales ${t.now}`} kinds={["bar", "donut"]} kind={vendorKind} onKind={setVendorKind}>
              {!a ? (
                <Skeleton height={330} />
              ) : !topSellers.length ? (
                <Empty height={330} illustration="chart" title="No sales yet" description="Your best-selling vendors will appear here once orders are paid." />
              ) : (
                <SmartChart
                  kind={vendorKind}
                  height={330}
                  labels={topSellers.map((v) => v.name)}
                  series={[{ label: "Sales", values: topSellers.map((v) => v.revenue) }]}
                  sliceColors={SERIES}
                  horizontal
                  format={(v) => money(v, currency, true)}
                  centerLabel={{ value: money(topSellers.reduce((s, v) => s + v.revenue, 0), currency, true), caption: `top ${topSellers.length}` }}
                />
              )}
            </ChartCard>

            <RecentOrders query={overview} />
          </div>

          <TopProductsTable query={sales} currency={currency} periodText={t.now} />
        </>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- states */

interface QueryState<T> {
  data?: T;
  isError: boolean;
  error?: unknown;
  refetch: () => unknown;
}

function Skeleton({ height }: { height: number }) {
  return <div className="rounded-lg bg-off-white animate-pulse" style={{ height }} aria-hidden />;
}

function Empty({ height, ...props }: { height: number; illustration: IllustrationName; title: string; description: string }) {
  return (
    <div className="flex items-center justify-center" style={{ minHeight: height }}>
      <EmptyState size="sm" {...props} />
    </div>
  );
}

function ErrorInline({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center justify-center gap-3 py-8 text-center">
      <p className="text-[13px] text-subtle max-w-xs">{apiErrorMessage(error, "We couldn't load this.")}</p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}

function ErrorPanel({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  return (
    <div className="bg-white border border-light-gray rounded-lg">
      <ErrorInline error={error} onRetry={onRetry} />
    </div>
  );
}

/* ---------------------------------------------------------------- panels */

/** The five newest orders across the store (/admin/overview/). */
function RecentOrders({ query }: { query: QueryState<AdminOverview> }) {
  const orders = query.data?.recent_orders ?? [];
  return (
    <ChartCard title="Recent orders" subtitle="The latest orders, newest first">
      {query.isError ? (
        <ErrorInline error={query.error} onRetry={query.refetch} />
      ) : !query.data ? (
        <Skeleton height={280} />
      ) : !orders.length ? (
        <EmptyState illustration="orders" size="sm" title="No orders yet" description="Orders will appear here once customers check out." />
      ) : (
        <ul className="-mx-4 md:-mx-5 divide-y divide-light-gray">
          {orders.map((o) => (
            <li key={o.id}>
              <Link
                href={`/admin/orders/${encodeURIComponent(o.id)}`}
                className="px-4 md:px-5 py-3 flex items-start justify-between gap-3 hover:bg-off-white transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-brand-charcoal truncate">
                    {o.order_number} · {o.buyer_name}
                  </p>
                  <p className="text-[12px] text-faint truncate">
                    {o.seller_name} · {timeAgo(o.created_at)}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[13px] font-semibold text-brand-charcoal tabular-nums">{formatMoney(o.total_amount)}</p>
                  <StatusBadge status={o.status} className="mt-0.5 !px-1.5 !py-0.5" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </ChartCard>
  );
}

/** Best sellers by revenue (/admin/reports/sales/: one row per product and store). */
function TopProductsTable({
  query,
  currency,
  periodText,
}: {
  query: QueryState<SalesReport>;
  currency: string;
  periodText: string;
}) {
  const rows = useMemo(() => (query.data?.rows ?? []).slice(0, 5), [query.data]);
  const maxSold = Math.max(...rows.map((p) => Number(p.quantity) || 0), 1);
  return (
    <section aria-label="Top products" className="bg-white border border-light-gray rounded-lg overflow-hidden">
      <header className="flex items-center justify-between gap-3 px-6 py-4">
        <div>
          <h3 className="text-[15px] font-semibold text-brand-charcoal">Top products</h3>
          <p className="text-[12px] text-faint">Best sellers by revenue, {periodText}</p>
        </div>
        <Button variant="link" href="/admin/product-performance">
          Product performance
        </Button>
      </header>
      {query.isError ? (
        <ErrorInline error={query.error} onRetry={query.refetch} />
      ) : (
        <div className="admin-table-container">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Store</th>
                <th className="w-56">Sold</th>
                <th className="text-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {!query.data ? (
                Array.from({ length: 3 }, (_, i) => (
                  <tr key={i}>
                    <td colSpan={4}>
                      <div className="h-6 rounded bg-off-white animate-pulse" aria-hidden />
                    </td>
                  </tr>
                ))
              ) : !rows.length ? (
                <EmptyTableRow colSpan={4} illustration="products" size="sm" title="No sales yet" description="Your best sellers will appear here once orders are paid." />
              ) : (
                rows.map((p, i) => (
                  <tr key={`${p.product}-${p.store}`}>
                    <td>
                      <div className="flex items-center gap-3">
                        <span
                          className="w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-[11px] font-semibold text-white"
                          style={{ backgroundColor: SERIES[i % SERIES.length] }}
                        >
                          {i + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{p.product}</p>
                          <p className="text-[12px] text-faint">{p.category || "Uncategorised"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-subtle">{p.store}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-off-white overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: SERIES[i % SERIES.length] }}
                            initial={{ width: 0 }}
                            animate={{ width: `${((Number(p.quantity) || 0) / maxSold) * 100}%` }}
                            transition={{ duration: 0.8, delay: i * 0.08 }}
                          />
                        </div>
                        <span className="tabular-nums text-[13px] w-10 text-right">{count(Number(p.quantity) || 0)}</span>
                      </div>
                    </td>
                    <td className="text-right tabular-nums">{money(Number(p.revenue) || 0, p.currency || currency, true)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
