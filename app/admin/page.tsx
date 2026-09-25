"use client";

import React, { useState } from "react";
import { StatCard } from "../components/Admin/StatCard";
import { RevenueMonthlyChart } from "../components/Admin/RevenueMonthlyChart";
import { RevenueWeeklyChart } from "../components/Admin/RevenueWeeklyChart";
import { RevenueByLocation } from "../components/Admin/RevenueByLocation";
import { DashboardInsightsDrawer } from "../components/Admin/DashboardInsightsDrawer";
import {
  HiOutlineUsers,
  HiOutlineShoppingCart,
  HiOutlineBuildingStorefront,
  HiOutlineCube,
  HiOutlineShieldCheck,
} from "react-icons/hi2";

export default function AdminDashboard() {
  const [activeInsightSection, setActiveInsightSection] = useState<
    "revenue" | "funnel" | "traffic" | null
  >(null);

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Insights Drawer */}
      <DashboardInsightsDrawer
        isOpen={activeInsightSection !== null}
        onClose={() => setActiveInsightSection(null)}
        activeSection={activeInsightSection}
      />

      {/* ============================================================
          TOP SECTION: 6 Key Stat Cards
          Customer, Orders, Vendors, Total Revenue, Products, Managers
          ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* 1. Customer */}
        <StatCard
          title="Customer"
          value="3,842"
          trendValue="12.5%"
          trendIsUp={true}
          subtitle="Since last month"
          periodLabel="Active accounts"
          badgeIcon={<HiOutlineUsers className="w-5 h-5" />}
          chartData={[30, 35, 32, 45, 42, 50, 58]}
          onViewDetails={() => setActiveInsightSection("traffic")}
        />

        {/* 2. Orders */}
        <StatCard
          title="Orders"
          value="1,248"
          trendValue="8.2%"
          trendIsUp={true}
          subtitle="Since last month"
          periodLabel="Monthly volume"
          badgeIcon={<HiOutlineShoppingCart className="w-5 h-5" />}
          chartData={[25, 30, 28, 40, 35, 42, 46]}
          onViewDetails={() => setActiveInsightSection("funnel")}
        />

        {/* 3. Vendors */}
        <StatCard
          title="Vendors"
          value="84"
          trendValue="5.0%"
          trendIsUp={true}
          subtitle="Since last month"
          periodLabel="Verified suppliers"
          badgeIcon={<HiOutlineBuildingStorefront className="w-5 h-5" />}
          chartData={[12, 14, 15, 18, 20, 22, 24]}
          onViewDetails={() => setActiveInsightSection("revenue")}
        />

        {/* 4. Total Revenue */}
        <StatCard
          title="Total Revenue"
          value="₦28,450,000"
          trendValue="14.8%"
          trendIsUp={true}
          subtitle="Since last month"
          periodLabel="Last 30 days"
          badgeIcon={<span className="font-black text-sm">₦</span>}
          chartData={[45, 55, 60, 75, 70, 85, 95]}
          onViewDetails={() => setActiveInsightSection("revenue")}
        />

        {/* 5. Products */}
        <StatCard
          title="Products"
          value="342"
          trendValue="9.55%"
          trendIsUp={true}
          subtitle="Since last month"
          periodLabel="Catalog inventory"
          badgeIcon={<HiOutlineCube className="w-5 h-5" />}
          chartData={[40, 42, 44, 45, 48, 49, 50]}
          onViewDetails={() => setActiveInsightSection("traffic")}
        />

        {/* 6. Managers */}
        <StatCard
          title="Managers"
          value="12"
          trendValue="100%"
          trendIsUp={true}
          subtitle="Active on duty"
          periodLabel="Admin staff"
          badgeIcon={<HiOutlineShieldCheck className="w-5 h-5" />}
          chartData={[8, 8, 9, 10, 10, 11, 12]}
          onViewDetails={() => setActiveInsightSection("traffic")}
        />
      </div>

      {/* ============================================================
          MIDDLE SECTION: Monthly Revenue & Revenue By Location (Map)
          ============================================================ */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        {/* Left: Monthly Revenue Bar Chart */}
        <div className="xl:col-span-8 flex flex-col">
          <RevenueMonthlyChart />
        </div>

        {/* Right: Revenue By Location Map & Progress Bars */}
        <div className="xl:col-span-4 flex flex-col">
          <RevenueByLocation />
        </div>
      </div>

      {/* ============================================================
          BOTTOM SECTION: Revenue Weekly Spline Chart
          ============================================================ */}
      <div className="grid grid-cols-1 gap-6">
        <RevenueWeeklyChart />
      </div>
    </div>
  );
}
