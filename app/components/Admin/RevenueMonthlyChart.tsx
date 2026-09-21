"use client";

import React, { useState } from "react";
import { AdminChart } from "./AdminChart";
import { HiBars3 } from "react-icons/hi2";

export const RevenueMonthlyChart: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState("2026");

  const monthlyLabels = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  // Data values corresponding to the target dashboard screenshot
  const monthlyData = [
    60000000,  // Jan
    90000000,  // Feb
    125000000, // Mar
    310000000, // Apr (peak)
    110000000, // May
    75000000,  // Jun
    195000000, // Jul
    82000000,  // Aug
    22000000,  // Sep
    0,         // Oct
    0,         // Nov
    0          // Dec
  ];

  const chartData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: "Revenue",
        data: monthlyData,
        backgroundColor: "#00BCD4",
        borderRadius: 4,
        barThickness: 8,
        hoverBackgroundColor: "#0097A7",
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
        displayColors: false,
        callbacks: {
          label: (context: any) => `Revenue: ₦${context.raw.toLocaleString()}`,
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
        max: 320000000,
        ticks: {
          stepSize: 80000000,
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
    <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-[#1D3557]">Revenue Monthly</h3>
        <button
          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          title="Chart Options"
          aria-label="Chart Options"
        >
          <HiBars3 size={18} />
        </button>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 sm:h-72 w-full">
        <AdminChart
          type="bar"
          data={chartData}
          options={chartOptions}
          height="100%"
        />
      </div>
    </div>
  );
};
