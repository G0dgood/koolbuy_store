"use client";

import React from "react";
import { Icon } from "../Icon";
import { MiniChart } from "./MiniChart";
import { motion } from "framer-motion";
import {
  HiOutlineLightningBolt,
  HiOutlineCube,
  HiOutlineSun,
} from "react-icons/hi";

interface Category {
  name: string;
  data: number[];
  color: string;
  bgColor: string;
  icon: React.ReactNode;
}

interface Product {
  name: string;
  price: string;
  data: number[];
  color: string;
}

interface QuickAddProductProps {
  onAddNew?: () => void;
  onSeeMoreCategories?: () => void;
  onSeeMoreProducts?: () => void;
  onAddProduct?: (productName: string) => void;
}

const defaultCategories: Category[] = [
  {
    name: "Chest Freezers",
    data: [40, 60, 45, 80, 50, 95, 60],
    color: "#F57E16",
    bgColor: "bg-brand-orange-soft/50",
    icon: <HiOutlineCube className="w-5 h-5 text-brand-orange-text" />,
  },
  {
    name: "Solar Freezers",
    data: [30, 45, 35, 60, 40, 70, 55],
    color: "#F43F5E",
    bgColor: "bg-rose-50/50",
    icon: <HiOutlineSun className="w-5 h-5 text-rose-500" />,
  },
  {
    name: "Inverter Freezers",
    data: [20, 35, 30, 45, 50, 40, 60],
    color: "#F59E0B",
    bgColor: "bg-amber-50/50",
    icon: <HiOutlineLightningBolt className="w-5 h-5 text-amber-600" />,
  },
];

const defaultProducts: Product[] = [
  {
    name: "Kool Bruhm 60Ah Solar Freezer",
    price: "₦1,287,600",
    data: [30, 45, 35, 60, 45, 75, 80],
    color: "#F57E16",
  },
  {
    name: "Scanfrost 200L Inverter Freezer",
    price: "₦850,000",
    data: [20, 30, 40, 35, 50, 45, 60],
    color: "#F43F5E",
  },
  {
    name: "Koolboks 538L Double Door",
    price: "₦2,420,000",
    data: [40, 55, 45, 80, 60, 90, 85],
    color: "#F59E0B",
  },
];

export const QuickAddProduct: React.FC<QuickAddProductProps> = ({
  onAddNew,
  onSeeMoreCategories,
  onSeeMoreProducts,
  onAddProduct,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-8 rounded-lg border border-light-gray flex flex-col gap-6 relative overflow-hidden group/card"
    >
      {/* Instrumentation Backdrop Grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#050711 1px, transparent 1px)`,
          backgroundSize: "16px 16px",
        }}
      />

      <div className="flex justify-between items-center relative z-10">
        <h3 className="text-[14px] font-semibold text-brand-charcoal opacity-80">
          Inventory Actions
        </h3>
        <button
          onClick={onAddNew}
          className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success-soft text-success text-[12px] font-semibold hover:bg-success hover:text-white transition-all duration-300"
        >
          <Icon
            name="circle-plus"
            folder="dashboardIcon"
            size="sm"
            className="group-hover:rotate-90 transition-transform duration-300"
          />
          Add New
        </button>
      </div>

      <div className="flex flex-col gap-3 relative z-10">
        <p className="text-[12px] font-medium text-subtle pl-1 mb-1 opacity-70">
          Top Categories
        </p>
        <div className="grid grid-cols-1 gap-3">
          {defaultCategories.map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className={`flex items-center justify-between p-4 rounded-lg border border-light-gray hover:border-transparent ${cat.bgColor} hover:shadow-lift transition-all duration-300 cursor-pointer group`}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-10 h-10 rounded-lg bg-white border border-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  {cat.icon}
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[13px] font-semibold text-brand-charcoal">
                    {cat.name}
                  </span>
                  <div className="w-16 h-4 opacity-40 group-hover:opacity-100 transition-opacity">
                    <MiniChart
                      type="bar"
                      data={cat.data}
                      color={cat.color}
                      height={16}
                    />
                  </div>
                </div>
              </div>
              <Icon
                name="chevron_right"
                size="xs"
                className="text-faint group-hover:text-brand-charcoal group-hover:translate-x-1 transition-all"
              />
            </motion.div>
          ))}
        </div>
        <button
          onClick={onSeeMoreCategories}
          className="text-[11px] font-semibold text-brand-orange-text/40 mt-2 self-center hover:text-brand-orange-text transition-colors"
        >
          Explore Categories
        </button>
      </div>

      <div className="flex flex-col gap-6 pt-6 border-t border-light-gray mt-2 relative z-10">
        <p className="text-[12px] font-medium text-subtle pl-1 opacity-70">
          Frequent Drafts
        </p>
        <div className="flex flex-col gap-4">
          {defaultProducts.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-center justify-between group/row"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="relative">
                  <div className="w-12 h-10 bg-off-white rounded-lg border border-light-gray overflow-hidden group-hover/row:border-brand-charcoal/20 transition-colors">
                    <MiniChart
                      type="sparkline"
                      data={p.data}
                      color={p.color}
                      height={40}
                    />
                  </div>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[12px] font-semibold text-brand-charcoal leading-tight truncate max-w-35 group-hover/row:text-brand-orange-text transition-all">
                    {p.name}
                  </span>
                  <span
                    className={`text-[11px] font-semibold w-fit px-1.5 py-0.5 rounded mt-1 bg-opacity-10`}
                    style={{ color: p.color, backgroundColor: `${p.color}15` }}
                  >
                    {p.price}
                  </span>
                </div>
              </div>
              <button
                onClick={() => onAddProduct?.(p.name)}
                className="flex items-center gap-1.5 px-4 h-9 rounded-lg bg-brand-charcoal text-white text-[12px] font-semibold hover:bg-brand-charcoal/90 transition-all active:scale-95"
              >
                <Icon name="circle-plus" folder="dashboardIcon" size="xs" /> Add
              </button>
            </motion.div>
          ))}
        </div>
        <button
          onClick={onSeeMoreProducts}
          className="text-[11px] font-semibold text-brand-orange-text/40 mt-1 self-center hover:text-brand-orange-text transition-colors"
        >
          View More Items
        </button>
      </div>
    </motion.div>
  );
};
