"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { StatCard } from "../components/Admin/StatCard";
import { RevenueByLocation } from "../components/Admin/RevenueByLocation";
import { DashboardInsightsDrawer } from "../components/Admin/DashboardInsightsDrawer";
import { Button } from "../components/Button";
import {
  AnimatedNumber,
  BRAND,
  ChartCard,
  ChartKind,
  SERIES,
  Segmented,
  SmartChart,
  naira,
} from "../components/Admin/DashboardUi";
import {
  DASHBOARD,
  FEED_POOL,
  STATUS_COLORS,
  TOP_PRODUCTS,
  type FeedItem,
  type Range,
} from "../components/Admin/dashboardData";

type InsightSection = "revenue" | "funnel" | "traffic";

const RANGES: { value: Range; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
];
const RANGE_TEXT: Record<Range, { now: string; before: string }> = {
  today: { now: "today", before: "yesterday" },
  week: { now: "this week", before: "last week" },
  month: { now: "this month", before: "last month" },
};

const pct = (n: number) => `${Math.abs(n).toLocaleString("en-NG", { maximumFractionDigits: 1 })}%`;

/* Admin dashboard, laid out like the Koolboks Sales CRM dashboard (DESIGN.md §7a):
   period switch, number tiles, then chart cards and panels. The numbers
   are sample data (dashboardData.ts) until the API is connected. */
export default function AdminDashboard() {
  const [range, setRange] = useState<Range>("week");
  const [insight, setInsight] = useState<InsightSection | null>(null);
  const d = DASHBOARD[range];
  const t = RANGE_TEXT[range];
  const open = (s: InsightSection) => () => setInsight(s);


  const [trendKind, setTrendKind] = useState<ChartKind>("area");
  const [measure, setMeasure] = useState<"revenue" | "orders">("revenue");
  const [statusKind, setStatusKind] = useState<ChartKind>("donut");
  const [categoryKind, setCategoryKind] = useState<ChartKind>("donut");
  const [paymentKind, setPaymentKind] = useState<ChartKind>("donut");
  const [vendorKind, setVendorKind] = useState<ChartKind>("bar");

  const totalOrders = d.ordersByStatus.reduce((a, s) => a + s.value, 0);
  const totalPayments = d.paymentMethods.reduce((a, s) => a + s.value, 0);
  const categoryTotal = d.salesByCategory.reduce((a, s) => a + s.value, 0);

  return (
    <div className="space-y-6 pb-12">
      <DashboardInsightsDrawer isOpen={insight !== null} onClose={() => setInsight(null)} activeSection={insight} />

      {/* Intro and the period switch */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="text-[14px] text-subtle">
            Your store {t.now}, compared with {t.before}.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="px-2.5 py-1 rounded-full bg-off-white border border-light-gray text-[12px] text-faint"
              title="These numbers are placeholders until the store API is connected."
            >
              Sample data
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Segmented label="Show numbers for" value={range} onChange={setRange} options={RANGES} />
          <Button variant="outline" onClick={open("revenue")}>
            View insights
          </Button>
        </div>
      </div>

      {/* Number tiles */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
        <StatCard
          title="Revenue"
          value={<AnimatedNumber value={d.totals.revenue} format={(v) => naira(v)} />}
          trendValue={pct(d.change.revenue)}
          trendIsUp={d.change.revenue >= 0}
          subtitle={`Compared with ${t.before}`}
          periodLabel={`${d.totals.orders.toLocaleString("en-NG")} orders`}
          chartData={d.revenue}
          onViewDetails={open("revenue")}
        />
        <StatCard
          title="Orders"
          value={<AnimatedNumber value={d.totals.orders} />}
          trendValue={pct(d.change.orders)}
          trendIsUp={d.change.orders >= 0}
          subtitle={`Compared with ${t.before}`}
          periodLabel={`${d.ordersByStatus[0].value.toLocaleString("en-NG")} delivered`}
          chartData={d.orders}
          onViewDetails={open("funnel")}
        />
        <StatCard
          title="Average order"
          value={<AnimatedNumber value={d.totals.avgOrder} format={(v) => naira(v)} />}
          trendValue={pct(d.change.avgOrder)}
          trendIsUp={d.change.avgOrder >= 0}
          subtitle={`Compared with ${t.before}`}
          periodLabel="Per paid order"
          chartData={d.revenue.map((r, i) => r / Math.max(1, d.orders[i]))}
          onViewDetails={open("revenue")}
        />
        <StatCard
          title="New customers"
          value={<AnimatedNumber value={d.totals.newCustomers} />}
          trendValue={pct(d.change.customers)}
          trendIsUp={d.change.customers >= 0}
          subtitle={`Compared with ${t.before}`}
          periodLabel={`${d.totals.customers.toLocaleString("en-NG")} in total`}
          chartData={d.orders.map((o) => Math.round(o * 0.4))}
          onViewDetails={open("traffic")}
        />
        <StatCard
          title="Conversion rate"
          value={<AnimatedNumber value={d.totals.conversion * 10} format={(v) => `${(v / 10).toFixed(1)}%`} />}
          trendValue={pct(d.change.conversion)}
          trendIsUp={d.change.conversion >= 0}
          subtitle={`Percentage points, compared with ${t.before}`}
          periodLabel="Visits that became orders"
          onViewDetails={open("funnel")}
        />
        <StatCard
          title="Active vendors"
          value={<AnimatedNumber value={d.totals.vendors} />}
          trendValue={d.change.vendors ? pct(d.change.vendors) : undefined}
          trendIsUp={d.change.vendors >= 0}
          subtitle={`Compared with ${t.before}`}
          periodLabel="Verified suppliers selling"
          onViewDetails={open("revenue")}
        />
      </div>

      {/* Trend + order status */}
      <div className="grid gap-6 lg:grid-cols-3">
        <ChartCard
          className="lg:col-span-2"
          title={measure === "revenue" ? "Revenue over time" : "Orders over time"}
          subtitle={`${t.now[0].toUpperCase()}${t.now.slice(1)} against ${t.before}`}
          kinds={["area", "line", "bar"]}
          kind={trendKind}
          onKind={setTrendKind}
          controls={
            <Segmented
              label="Measure"
              value={measure}
              onChange={setMeasure}
              options={[
                { value: "revenue", label: "Revenue" },
                { value: "orders", label: "Orders" },
              ]}
            />
          }
        >
          <SmartChart
            kind={trendKind}
            height={290}
            labels={d.labels}
            series={
              measure === "revenue"
                ? [
                    { label: `Revenue ${t.now}`, values: d.revenue, color: BRAND },
                    { label: t.before[0].toUpperCase() + t.before.slice(1), values: d.previousRevenue, color: SERIES[0] },
                  ]
                : [
                    { label: `Orders ${t.now}`, values: d.orders, color: BRAND },
                    {
                      label: t.before[0].toUpperCase() + t.before.slice(1),
                      values: d.orders.map((o, i) => Math.round(o * (d.previousRevenue[i] / Math.max(1, d.revenue[i])))),
                      color: SERIES[0],
                    },
                  ]
            }
            format={measure === "revenue" ? (v) => naira(v, true) : undefined}
          />
        </ChartCard>

        <ChartCard title="Orders by status" subtitle={`${totalOrders.toLocaleString("en-NG")} orders ${t.now}`} kinds={["donut", "pie", "bar"]} kind={statusKind} onKind={setStatusKind}>
          <SmartChart
            kind={statusKind}
            height={290}
            labels={d.ordersByStatus.map((s) => s.label)}
            series={[{ label: "Orders", values: d.ordersByStatus.map((s) => s.value) }]}
            sliceColors={STATUS_COLORS}
            horizontal={statusKind === "bar"}
            centerLabel={{ value: totalOrders.toLocaleString("en-NG"), caption: "orders" }}
          />
        </ChartCard>
      </div>

      {/* Category, payments, shoppers */}
      <div className="grid gap-6 lg:grid-cols-3">
        <ChartCard title="Sales by category" subtitle={`${naira(categoryTotal, true)} ${t.now}`} kinds={["donut", "pie", "bar"]} kind={categoryKind} onKind={setCategoryKind}>
          <SmartChart
            kind={categoryKind}
            labels={d.salesByCategory.map((s) => s.label)}
            series={[{ label: "Sales", values: d.salesByCategory.map((s) => s.value) }]}
            sliceColors={categoryKind === "bar" ? SERIES : undefined}
            horizontal={categoryKind === "bar"}
            format={(v) => naira(v, true)}
            centerLabel={{ value: naira(categoryTotal, true), caption: "in sales" }}
          />
        </ChartCard>

        <ChartCard title="How customers pay" subtitle={`${totalPayments.toLocaleString("en-NG")} paid orders`} kinds={["donut", "pie", "bar"]} kind={paymentKind} onKind={setPaymentKind}>
          <SmartChart
            kind={paymentKind}
            labels={d.paymentMethods.map((s) => s.label)}
            series={[{ label: "Orders", values: d.paymentMethods.map((s) => s.value) }]}
            sliceColors={[SERIES[0], SERIES[2], SERIES[1], SERIES[3], SERIES[6]]}
            horizontal={paymentKind === "bar"}
            centerLabel={{ value: `${Math.round((d.paymentMethods[2].value / Math.max(1, totalPayments)) * 100)}%`, caption: "pay small small" }}
          />
        </ChartCard>

        <ShoppersCard />
      </div>

      {/* Location, vendors, recent orders */}
      <div className="grid gap-6 lg:grid-cols-3">
        <RevenueByLocation />

        <ChartCard title="Top vendors" subtitle={`By sales ${t.now}`} kinds={["bar", "donut"]} kind={vendorKind} onKind={setVendorKind}>
          <SmartChart
            kind={vendorKind}
            height={330}
            labels={d.topVendors.map((v) => v.label)}
            series={[{ label: "Sales", values: d.topVendors.map((v) => v.value) }]}
            sliceColors={SERIES}
            horizontal
            format={(v) => naira(v, true)}
            centerLabel={{ value: naira(d.topVendors.reduce((a, v) => a + v.value, 0), true), caption: "top 6" }}
          />
        </ChartCard>

        <RecentOrders />
      </div>

      <TopProductsTable />
    </div>
  );
}

/* ---------------------------------------------------------------- panels */

/** Shoppers on the site (sample numbers): the count, its trail over the last hour, and devices. */
const SHOPPER_READINGS = [112, 118, 121, 117, 126, 131, 128, 135, 129, 138, 142, 136];

function ShoppersCard() {
  const now = SHOPPER_READINGS[SHOPPER_READINGS.length - 1];
  const devices = [
    { label: "Mobile", share: 0.68, color: SERIES[0] },
    { label: "Desktop", share: 0.24, color: SERIES[1] },
    { label: "Tablet", share: 0.08, color: SERIES[2] },
  ];

  return (
    <ChartCard title="Shoppers online" subtitle="Over the last hour">
      <p className="text-[34px] font-semibold text-brand-charcoal tabular-nums leading-none">{now}</p>
      <div className="mt-3">
        <SmartChart
          kind="area"
          compact
          height={110}
          labels={SHOPPER_READINGS.map((_, i) => String(i))}
          series={[{ label: "Shoppers", values: SHOPPER_READINGS, color: SERIES[0] }]}
        />
      </div>
      <div className="mt-4 space-y-2.5">
        <div className="flex h-2 rounded-full overflow-hidden">
          {devices.map((dv) => (
            <span key={dv.label} style={{ width: `${dv.share * 100}%`, backgroundColor: dv.color }} />
          ))}
        </div>
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-subtle">
          {devices.map((dv) => (
            <li key={dv.label} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dv.color }} aria-hidden />
              {dv.label} <span className="tabular-nums text-faint">{Math.round(now * dv.share)}</span>
            </li>
          ))}
        </ul>
      </div>
    </ChartCard>
  );
}

const FEED_TONE: Record<FeedItem["status"], string> = {
  Paid: "bg-success-soft text-success",
  Delivered: "bg-success-soft text-success",
  Shipped: "bg-[#EAF2FC] text-[#2a78d6]",
  "BNPL approved": "bg-brand-orange-soft text-brand-orange-text",
};

/** The latest orders (sample data), newest first. */
const RECENT_TIMES = ["2 min ago", "9 min ago", "18 min ago", "34 min ago", "52 min ago"];

function RecentOrders() {
  return (
    <ChartCard title="Recent orders" subtitle="The latest orders, newest first">
      <ul className="-mx-4 md:-mx-5 divide-y divide-light-gray">
        {FEED_POOL.slice(0, RECENT_TIMES.length).map((o, i) => (
          <li key={o.item} className="px-4 md:px-5 py-3 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-brand-charcoal truncate">{o.item}</p>
              <p className="text-[12px] text-faint truncate">
                {o.customer} · {o.area} · {RECENT_TIMES[i]}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[13px] font-semibold text-brand-charcoal tabular-nums">{naira(o.amount)}</p>
              <span className={`inline-block mt-0.5 px-1.5 py-0.5 rounded text-[11px] font-semibold ${FEED_TONE[o.status]}`}>{o.status}</span>
            </div>
          </li>
        ))}
      </ul>
    </ChartCard>
  );
}

/** Best sellers, in the CRM table style (admin.css), with a stock bar. */
function TopProductsTable() {
  const maxSold = useMemo(() => Math.max(...TOP_PRODUCTS.map((p) => p.sold)), []);
  return (
    <section aria-label="Top products" className="bg-white border border-light-gray rounded-lg overflow-hidden">
      <header className="flex items-center justify-between gap-3 px-6 py-4">
        <div>
          <h3 className="text-[15px] font-semibold text-brand-charcoal">Top products</h3>
          <p className="text-[12px] text-faint">Best sellers this month</p>
        </div>
        <Button variant="link" href="/admin/product-performance">
          Product performance
        </Button>
      </header>
      <div className="admin-table-container">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th className="w-56">Sold</th>
              <th className="text-right">Revenue</th>
              <th className="text-right">Stock</th>
            </tr>
          </thead>
          <tbody>
            {TOP_PRODUCTS.map((p, i) => (
              <tr key={p.name}>
                <td>
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-[11px] font-semibold text-white" style={{ backgroundColor: SERIES[i % SERIES.length] }}>
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{p.name}</p>
                      <p className="text-[12px] text-faint">{p.category}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-off-white overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: SERIES[i % SERIES.length] }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(p.sold / maxSold) * 100}%` }}
                        transition={{ duration: 0.8, delay: i * 0.08 }}
                      />
                    </div>
                    <span className="tabular-nums text-[13px] w-10 text-right">{p.sold}</span>
                  </div>
                </td>
                <td className="text-right tabular-nums">{naira(p.revenue, true)}</td>
                <td className="text-right">
                  {p.stock === 0 ? (
                    <span className="px-1.5 py-0.5 rounded text-[11px] font-semibold bg-error-soft text-error">Out of stock</span>
                  ) : p.stock < 10 ? (
                    <span className="px-1.5 py-0.5 rounded text-[11px] font-semibold bg-brand-orange-soft text-brand-orange-text">{p.stock} left</span>
                  ) : (
                    <span className="tabular-nums text-subtle">{p.stock}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
