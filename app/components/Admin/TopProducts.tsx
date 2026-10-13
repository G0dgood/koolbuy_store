"use client";

import React from "react";
import { Icon } from "../Icon";
import { MiniChart } from "./MiniChart";
import { SearchInput } from "../Form";
import { motion } from "framer-motion";

interface TopProduct {
  name: string;
  itemCode: string;
  price: string;
  data: number[];
  growth: string;
}

interface TopProductsProps {
  onViewAll?: () => void;
  products?: TopProduct[];
}

const defaultProducts: TopProduct[] = [
  {
    name: "Kool Scanfrost 600L Inverter",
    itemCode: "KB-SF600",
    price: "₦1,406,000",
    data: [40, 70, 45, 90, 65, 85, 90],
    growth: "+24% ^",
  },
  {
    name: "Kool Bruhm 100Ah Pedestal",
    itemCode: "KB-BR100",
    price: "₦1,662,370",
    data: [20, 40, 30, 60, 45, 75, 80],
    growth: "+18% ^",
  },
  {
    name: "Kool-242L Somotex Glass Door",
    itemCode: "KB-SM242",
    price: "₦2,100,000",
    data: [60, 50, 80, 55, 90, 65, 70],
    growth: "+12% ^",
  },
  {
    name: "230L Hisense Deep Freezer",
    itemCode: "KB-HS230",
    price: "₦430,000",
    data: [30, 45, 35, 60, 40, 70, 55],
    growth: "-5% v",
  },
];

export const TopProducts: React.FC<TopProductsProps> = ({
  onViewAll,
  products = defaultProducts,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-8 border border-[#1C1C1C1A] rounded-lg flex flex-col gap-6 relative overflow-hidden group/card"
    >
      {/* Instrumentation Backdrop Grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#050711 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      />

      <div className="flex justify-between items-center relative z-10">
        <h3 className="text-[14px] font-bold text-brand-charcoal uppercase tracking-wider opacity-80">
          Top Performers
        </h3>
        <button
          onClick={onViewAll}
          className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-charcoal/5 text-brand-orange-text text-[11px] font-bold uppercase tracking-wider hover:bg-brand-charcoal hover:text-white transition-all duration-300"
        >
          Inventory
          <Icon
            name="arrow_forward"
            size="xs"
            className="group-hover:translate-x-0.5 transition-transform"
          />
        </button>
      </div>

      {/* Glass Search Bar */}
      <div className="relative z-10">
        <SearchInput
          placeholder="Quick product lookup..."
          containerClassName="w-full"
        />
      </div>

      <div className="flex flex-col gap-5 relative z-10">
        {products.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * i }}
            className="flex items-center justify-between group cursor-pointer p-3 -mx-3 rounded-2xl hover:bg-gray-50/80 transition-all duration-300"
          >
            <div className="flex items-center gap-4 flex-1">
              {/* Rank & MiniChart Container */}
              <div className="relative">
                <div className="w-16 h-12 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden p-1 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                  <div className="absolute inset-0 bg-linear-to-br from-brand-charcoal/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <MiniChart
                    type="sparkline"
                    data={p.data}
                    color={i === 0 ? "#050711" : "#F57E16"}
                    height={32}
                  />
                </div>
                {/* Rank Badge */}
                <div
                  className={`absolute -top-2 -left-2 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold border shadow-sm z-10 ${
                    i === 0
                      ? "bg-brand-charcoal text-white border-brand-charcoal"
                      : "bg-white text-gray-400 border-gray-100"
                  }`}
                >
                  {i + 1}
                </div>
              </div>

              <div className="flex flex-col min-w-0">
                <span className="text-[12px] font-bold text-brand-charcoal truncate max-w-37.5 transition-colors leading-tight">
                  {p.name}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter tabular-nums">
                    ID: {p.itemCode}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
                      p.growth.includes("+")
                        ? "text-emerald-500 bg-emerald-50"
                        : "text-rose-500 bg-rose-50"
                    }`}
                  >
                    {p.growth}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-0.5">
              <span className="text-[13px] font-bold text-brand-charcoal tabular-nums">
                {p.price}
              </span>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider opacity-60">
                Revenue
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Decorative Glow */}
      <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-brand-charcoal/5 rounded-full blur-2xl group-hover/card:bg-brand-charcoal/10 transition-colors pointer-events-none" />
    </motion.div>
  );
};
