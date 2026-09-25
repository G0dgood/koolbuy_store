"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface LocationData {
  name: string;
  value: number;
  percentage: number;
}

const locations: LocationData[] = [
  { name: "Alimosho", value: 11075500, percentage: 78 },
  { name: "Ifo", value: 172000, percentage: 14 },
];

export const RevenueByLocation: React.FC = () => {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-semibold text-gray-800">
          Revenue By Location
        </h3>
      </div>

      {/* World Map Illustration with Precision Country Outlines */}
      <div className="relative w-full flex items-center justify-center overflow-hidden my-3 group">
        <img
          src="/images/world-map.svg"
          alt="Revenue by Location Map"
          className="w-full h-auto object-contain select-none"
        />

        {/* Pulsing Beacon Glow over Nigeria / West Africa */}
        <div
          className="absolute top-[58.5%] left-[50.2%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer"
          onMouseEnter={() => setHoveredLocation("Nigeria Hub")}
          onMouseLeave={() => setHoveredLocation(null)}
        >
          <span className="animate-ping absolute inline-flex h-9 w-9 rounded-full bg-cyan-400 opacity-40"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-[#00BCD4] border-2 border-white shadow-md"></span>

          {/* Interactive Tooltip Badge */}
          <div className="absolute -top-8 px-2.5 py-1 bg-[#1D3557] text-white text-[10px] font-bold rounded-lg whitespace-nowrap shadow-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Nigeria Hub • ₦11.25M
          </div>
        </div>
      </div>

      {/* Progress Bars Breakdown Matching User Spec */}
      <div className="flex flex-col gap-4 mt-2 pt-4 border-t border-gray-50 text-sm">
        {locations.map((loc) => (
          <div key={loc.name} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-700">{loc.name}</span>
              <span className="font-normal text-gray-700 tabular-nums">
                {loc.value}
              </span>
            </div>
            {/* Progress track */}
            <div className="w-full bg-[#E2E8F0]/70 h-1.5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${loc.percentage}%` }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className="bg-[#00BCD4] h-full rounded-full"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
