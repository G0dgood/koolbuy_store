"use client";

import React from "react";
import type { AdminAnalytics } from "@/lib/store/api/dashboard-api";
import { EmptyState } from "../EmptyState";
import { MARKET_NAMES, money } from "./dashboardData";

/* Paid revenue per market in the period (/admin/analytics/ revenue_by_market).
   Each market has its own currency, so amounts are listed side by side and
   never added together or drawn on one scale. */
export const RevenueByMarket: React.FC<{ rows: AdminAnalytics["revenue_by_market"]; selected?: string }> = ({ rows, selected }) => {
  if (!rows.some((r) => r.total > 0)) {
    return <EmptyState illustration="chart" size="sm" title="No sales yet" description="Revenue will appear here once orders are paid." />;
  }
  return (
    <ul className="-mx-4 md:-mx-5 divide-y divide-light-gray">
      {rows.map((r) => (
        <li key={r.market} className="px-4 md:px-5 py-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className={`text-[13px] text-brand-charcoal ${r.market === selected ? "font-semibold" : "font-medium"}`}>
              {MARKET_NAMES[r.market] ?? r.market}
            </p>
            <p className="text-[12px] text-faint">{r.currency}</p>
          </div>
          <p className="text-[15px] font-semibold text-brand-charcoal tabular-nums">{money(r.total, r.currency)}</p>
        </li>
      ))}
    </ul>
  );
};
