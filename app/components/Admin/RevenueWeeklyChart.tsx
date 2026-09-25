"use client";

import React from "react";
import { AdminChart } from "./AdminChart";
import {
  HiMagnifyingGlassPlus,
  HiMagnifyingGlassMinus,
  HiArrowPath,
  HiHome,
  HiBars3,
} from "react-icons/hi2";

export const RevenueWeeklyChart: React.FC = () => {
  const weeklyLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Exact data progression from target screenshot
  const previousWeekData = [300000, 5500000, 1500000, 0, 0, 0, 0];
  const currentWeekData = [300000, 2700000, 4500000, 0, 0, 0, 0];

  const chartData = {
    labels: weeklyLabels,
    datasets: [
      {
        label: "Previous Week",
        data: previousWeekData,
        borderColor: "#10B981", // Emerald green from screenshot
        backgroundColor: "rgba(16, 185, 129, 0.06)",
        borderWidth: 2.5,
        fill: true,
        tension: 0.45,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointBackgroundColor: "#10B981",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      },
      {
        label: "Current Week",
        data: currentWeekData,
        borderColor: "#00BCD4", // Primary color #00BCD4
        backgroundColor: "rgba(0, 188, 212, 0.08)",
        borderWidth: 2.5,
        fill: true,
        tension: 0.45,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointBackgroundColor: "#00BCD4",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#1D3557",
        titleFont: { size: 12, weight: "bold" as const, family: "Inter" },
        bodyFont: { size: 11, family: "Inter" },
        padding: 10,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: (context: any) =>
            `${context.dataset.label}: ₦${context.raw.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "#94A3B8",
          font: { size: 10, weight: "bold" as const },
        },
        border: { display: false },
      },
      y: {
        min: 0,
        max: 6000000,
        ticks: {
          stepSize: 1000000,
          color: "#94A3B8",
          font: { size: 9, weight: "bold" as const },
          callback: (value: any) => {
            if (value === 0) return "₦0";
            return `₦${value.toLocaleString()}`;
          },
        },
        grid: {
          color: "#F8FAFC",
        },
        border: { display: false },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-xs flex flex-col justify-between">
      {/* Top Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
        <div>
          <h3 className="text-base font-bold text-[#1D3557]">Revenue Weekly</h3>
        </div>

        {/* Legend stats */}
        <div className="flex items-center gap-6 text-xs">
          <div className="flex flex-col">
            <span className="text-gray-400 text-[11px]">Current Week</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-blue shrink-0"></span>
              <span className="font-bold text-gray-800 text-sm">₦0</span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-400 text-[11px]">Previous Week</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
              <span className="font-bold text-gray-800 text-sm">₦5,226,600</span>
            </div>
          </div>
        </div>

        {/* Chart Actions Toolbar */}
        <div className="flex items-center gap-1 text-gray-400">
          <button
            className="p-1 hover:text-brand-blue hover:bg-gray-50 rounded transition-colors"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <HiMagnifyingGlassPlus size={15} />
          </button>
          <button
            className="p-1 hover:text-brand-blue hover:bg-gray-50 rounded transition-colors"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <HiMagnifyingGlassMinus size={15} />
          </button>
          <button
            className="p-1 hover:text-brand-blue hover:bg-gray-50 rounded transition-colors"
            title="Reset"
            aria-label="Reset"
          >
            <HiArrowPath size={15} />
          </button>
          <button
            className="p-1 hover:text-brand-blue hover:bg-gray-50 rounded transition-colors"
            title="Overview"
            aria-label="Overview"
          >
            <HiHome size={15} />
          </button>
          <button
            className="p-1 hover:text-brand-blue hover:bg-gray-50 rounded transition-colors"
            title="Menu"
            aria-label="Menu"
          >
            <HiBars3 size={15} />
          </button>
        </div>
      </div>

      {/* Line Chart */}
      <div className="h-64 sm:h-72 w-full mt-2">
        <AdminChart
          type="line"
          data={chartData}
          options={chartOptions}
          height="100%"
        />
      </div>
    </div>
  );
};
