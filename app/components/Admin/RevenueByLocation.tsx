"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ChartCard, naira } from "./DashboardUi";
import { hasMapbox, type RevenuePoint } from "./RevenueMap";

// Mapbox needs the browser, so it loads on the client only.
const RevenueMap = dynamic(() => import("./RevenueMap"), {
  ssr: false,
  loading: () => <div className="h-[260px] rounded-lg bg-off-white animate-pulse" aria-hidden />,
});

const locations: RevenuePoint[] = [
  { name: "Alimosho", value: 11075500, lat: 6.6018, lng: 3.256 },
  { name: "Ifo", value: 172000, lat: 6.815, lng: 3.195 },
];

export const RevenueByLocation: React.FC<{ className?: string }> = ({ className }) => {
  const total = locations.reduce((a, l) => a + l.value, 0);
  const max = Math.max(...locations.map((l) => l.value), 1);
  // Static map when there's no Mapbox token or Mapbox fails to load.
  const [mapFailed, setMapFailed] = useState(false);
  const showMapbox = hasMapbox() && !mapFailed;

  return (
    <ChartCard title="Revenue by location" subtitle={`${naira(total)} across ${locations.length} areas`} className={className}>
      {showMapbox ? (
        <RevenueMap points={locations} onFail={() => setMapFailed(true)} />
      ) : (
      <div className="relative w-full flex items-center justify-center overflow-hidden group">
        <img src="/images/world-map.svg" alt="" aria-hidden className="w-full h-auto object-contain select-none opacity-80" />
        {/* Where the revenue comes from: Nigeria */}
        <div className="absolute top-[58.5%] left-[50.2%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-brand-orange opacity-30" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-brand-orange border-2 border-white shadow-sm" />
          <span className="absolute -top-8 px-2 py-1 bg-brand-charcoal text-white text-[11px] font-medium rounded-md whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            Nigeria · {naira(total, true)}
          </span>
        </div>
      </div>
      )}

      <ul className="mt-4 pt-4 border-t border-light-gray space-y-4">
        {locations.map((loc) => (
          <li key={loc.name} className="space-y-1.5">
            <div className="flex items-center justify-between text-[13px]">
              <span className="font-medium text-brand-charcoal">{loc.name}</span>
              <span className="text-subtle tabular-nums">{naira(loc.value)}</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden bg-off-white">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(2, (loc.value / max) * 100)}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full bg-brand-orange"
              />
            </div>
          </li>
        ))}
      </ul>
    </ChartCard>
  );
};
