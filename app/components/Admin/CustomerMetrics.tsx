"use client";

import React from "react";

export type MetricType = "active" | "repeat" | "visitor" | "conversion";

export interface CustomerMetricsData {
  active?: string | number;
  repeat?: string | number;
  visitor?: string | number;
  conversion?: string | number;
}

interface MetricItem {
  id: MetricType;
  value: string;
  label: string;
  hasDivider?: boolean;
}

interface CustomerMetricsProps {
  activeMetric: MetricType;
  onMetricClick: (metric: MetricType) => void;
  data?: CustomerMetricsData;
}

function formatMetricVal(val: string | number | undefined, fallback: string): string {
  if (val === undefined || val === null) return fallback;
  if (typeof val === "string") return val;
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `${(val / 1_000).toFixed(1)}k`;
  return String(val);
}

export function CustomerMetrics({ activeMetric, onMetricClick, data }: CustomerMetricsProps) {
  const metrics: MetricItem[] = [
    {
      id: "active",
      value: data?.active !== undefined ? formatMetricVal(data.active, "0") : "0",
      label: "Active Customers",
      hasDivider: true,
    },
    {
      id: "repeat",
      value: data?.repeat !== undefined ? formatMetricVal(data.repeat, "0") : "0",
      label: "Repeat Customers",
      hasDivider: true,
    },
    {
      id: "visitor",
      value: data?.visitor !== undefined ? formatMetricVal(data.visitor, "0") : "0",
      label: "Shop Visitor",
      hasDivider: true,
    },
    {
      id: "conversion",
      value: data?.conversion !== undefined ? `${data.conversion}%` : "0%",
      label: "Conversion Rate",
    },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 items-start border-b border-gray-50 pb-6 md:pb-4">
      {metrics.map((metric) => (
        <button
          key={metric.id}
          onClick={() => onMetricClick(metric.id)}
          className="flex flex-col gap-1 items-start text-left transition-all group relative pr-4 md:border-r md:border-gray-100 last:border-r-0"
        >
          <span className={`text-2xl font-bold transition-colors ${
            activeMetric === metric.id ? "text-brand-orange-text" : "text-brand-charcoal group-hover:text-brand-orange-text"
          }`}>
            {metric.value}
          </span>
          <span className={`text-[11px] font-medium uppercase tracking-wider transition-colors ${
            activeMetric === metric.id ? "text-brand-orange-text" : "text-gray-400"
          }`}>
            {metric.label}
          </span>
          
          {/* Active Indicator Bar */}
          <div className={`h-0.5 w-full mt-2 rounded-full transition-all duration-300 ${
            activeMetric === metric.id 
              ? "bg-brand-orange opacity-100 translate-y-0" 
              : "bg-brand-orange-soft opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0"
          }`}></div>
        </button>
      ))}
    </div>
  );
}
