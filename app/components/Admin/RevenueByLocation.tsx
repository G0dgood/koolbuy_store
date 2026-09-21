"use client";

import React from "react";
import { motion } from "framer-motion";

interface LocationData {
  name: string;
  value: number;
  percentage: number;
}

const locations: LocationData[] = [
  { name: "Others", value: 2100, percentage: 4 },
  { name: "Alimosho", value: 7357500, percentage: 82 },
  { name: "Ifo", value: 172000, percentage: 18 },
];

export const RevenueByLocation: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-bold text-[#1D3557]">Revenue By Location</h3>
      </div>

      {/* World Map Illustration with Pinpoint */}
      <div className="relative w-full h-44 flex items-center justify-center overflow-hidden my-2">
        <svg
          viewBox="0 0 800 400"
          className="w-full h-full object-contain opacity-70"
          fill="#CBD5E1"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Simplified World Continents Silhouette */}
          {/* North America */}
          <path d="M120,70 Q140,50 180,60 T240,90 Q220,130 190,150 T160,180 Q130,160 110,120 Z" />
          <path d="M170,180 Q190,190 200,220 T180,240 Q160,230 160,200 Z" />
          {/* South America */}
          <path d="M220,240 Q260,250 280,290 T260,360 Q230,370 210,330 T210,260 Z" />
          {/* Europe */}
          <path d="M400,70 Q450,60 470,90 T450,130 Q420,140 400,120 T380,90 Z" />
          <path d="M370,110 Q390,100 400,130 T370,140 Z" />
          {/* Africa */}
          <path d="M390,150 Q460,140 480,190 T470,260 Q440,310 420,330 T380,270 Q370,210 390,150 Z" />
          {/* Asia */}
          <path d="M480,70 Q580,50 670,80 T700,160 Q660,200 610,190 T540,160 Q500,130 480,100 Z" />
          <path d="M560,190 Q590,190 600,230 T570,250 Q540,240 550,200 Z" />
          {/* Australia */}
          <path d="M660,260 Q720,250 740,290 T710,340 Q660,340 640,300 Z" />
        </svg>

        {/* Highlighted Glowing Pulse Pin on Nigeria / West Africa (~ x=415, y=215 in this projection) */}
        <div className="absolute top-[48%] left-[51%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-brand-blue opacity-50"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-brand-blue border-2 border-white shadow-md"></span>
          {/* Tooltip badge */}
          <div className="absolute -top-7 px-2 py-0.5 bg-[#1D3557] text-white text-[9px] font-bold rounded-md whitespace-nowrap shadow-xs pointer-events-none">
            Nigeria
          </div>
        </div>
      </div>

      {/* Progress Bars Breakdown */}
      <div className="flex flex-col gap-3 mt-3 pt-3 border-t border-gray-50 text-xs">
        {locations.map((loc) => (
          <div key={loc.name} className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-gray-700">{loc.name}</span>
              <span className="font-bold text-gray-900 tabular-nums">
                {loc.value.toLocaleString()}
              </span>
            </div>
            {/* Progress track */}
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${loc.percentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="bg-brand-blue h-full rounded-full"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
