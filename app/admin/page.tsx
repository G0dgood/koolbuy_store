"use client";

import React, { useState } from "react";
import { StatCard } from "../components/Admin/StatCard";
import { RevenueMonthlyChart } from "../components/Admin/RevenueMonthlyChart";
import { RevenueWeeklyChart } from "../components/Admin/RevenueWeeklyChart";
import { RevenueByLocation } from "../components/Admin/RevenueByLocation";
import { TransactionTable } from "../components/Admin/TransactionTable";
import { BestSellingProductTable } from "../components/Admin/BestSellingProductTable";
import { DashboardInsightsDrawer } from "../components/Admin/DashboardInsightsDrawer";
import { RealtimeUsers } from "../components/Admin/RealtimeUsers";
import { TopProducts } from "../components/Admin/TopProducts";
import { QuickAddProduct } from "../components/Admin/QuickAddProduct";
import {
  HiOutlineShoppingCart,
  HiOutlineTag,
  HiOutlineCube,
} from "react-icons/hi2";

export default function AdminDashboard() {
  const [activeInsightSection, setActiveInsightSection] = useState<
    "revenue" | "funnel" | "traffic" | null
  >(null);

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Drawers */}
      <DashboardInsightsDrawer
        isOpen={activeInsightSection !== null}
        onClose={() => setActiveInsightSection(null)}
        activeSection={activeInsightSection}
      />

      {/* ============================================================
          TOP SECTION: Stat Cards & Revenue Monthly (from user spec)
          ============================================================ */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Stat Cards Grid */}
        <div className="xl:col-span-7 flex flex-col justify-between gap-6">
          {/* Card 1: Orders (Large Card) */}
          <StatCard
            title="Orders"
            value="1"
            trendValue="50%"
            trendIsUp={false}
            subtitle="Since last month"
            periodLabel="Monthly comparison"
            badgeIcon={<HiOutlineShoppingCart className="w-5 h-5" />}
            chartData={[4, 3, 5, 2, 3, 2, 1]}
            onViewDetails={() => setActiveInsightSection("funnel")}
          />

          {/* 3 Metrics Row: Total Revenue, Total Sold Products, Products */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard
              title="Total Revenue"
              value="₦2100"
              trendValue="74.08%"
              trendIsUp={false}
              subtitle="Since last month"
              periodLabel="Last 30 days"
              badgeIcon={<span className="font-black text-sm">₦</span>}
              chartData={[15, 20, 18, 25, 22, 14, 10]}
              onViewDetails={() => setActiveInsightSection("revenue")}
            />

            <StatCard
              title="Total Sold Products"
              value="0"
              periodLabel="All time"
              badgeIcon={<HiOutlineTag className="w-5 h-5" />}
              chartData={[0, 0, 0, 0, 0, 0, 0]}
              onViewDetails={() => setActiveInsightSection("revenue")}
            />

            <StatCard
              title="Products"
              value="+ 50"
              trendValue="9.55%"
              trendIsUp={true}
              subtitle="Since last month"
              periodLabel="Inventory count"
              badgeIcon={<HiOutlineCube className="w-5 h-5" />}
              chartData={[40, 42, 44, 45, 48, 49, 50]}
              onViewDetails={() => setActiveInsightSection("traffic")}
            />
          </div>
        </div>

        {/* Right Column: Monthly Revenue Bar Chart */}
        <div className="xl:col-span-5 flex flex-col">
          <RevenueMonthlyChart />
        </div>
      </div>

      {/* ============================================================
          MIDDLE SECTION: Revenue Weekly & Revenue By Location
          ============================================================ */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        {/* Left: Revenue Weekly Spline Chart */}
        <div className="xl:col-span-8 flex flex-col">
          <RevenueWeeklyChart />
        </div>

        {/* Right: Revenue By Location Map & Progress Bars */}
        <div className="xl:col-span-4 flex flex-col">
          <RevenueByLocation />
        </div>
      </div>
    </div>
  );
}
