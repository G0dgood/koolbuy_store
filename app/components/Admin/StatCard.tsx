"use client";

import React from "react";
import { Icon } from "../Icon";
import { Button } from "../Button";
import { MiniChart } from "./MiniChart";
import { DropdownMenu, DropdownItem } from "../Dropdown/DropdownMenu";
import { useState, useRef, useEffect } from "react";
import { MdRefresh, MdDownload, MdContentCopy, MdPushPin } from "react-icons/md";

interface StatCardProps {
  title: string;
  value: string | number;
  periodLabel?: string;
  trendLabel?: string;
  trendValue?: string;
  trendIsUp?: boolean;
  previousLabel?: string;
  previousValue?: string;
  onViewDetails?: () => void;
  chartData?: number[];
  badgeIcon?: React.ReactNode;
  subtitle?: string;
  hideMiniChart?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  periodLabel = "Last 7 days",
  trendValue,
  trendIsUp = true,
  chartData = [30, 45, 35, 60, 40, 70, 55], // Fallback trend
  onViewDetails,
  badgeIcon,
  subtitle,
  hideMiniChart = false,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  const actions = [
    {
      label: "Refresh metric",
      subtext: "Poll latest data from the server",
      icon: <MdRefresh />,
      onClick: () => console.log("Refresh", title)
    },
    {
      label: "Export Trend",
      subtext: "Download CSV of current period",
      icon: <MdDownload />,
      onClick: () => console.log("Export", title)
    },
    {
      label: "Copy Analytics ID",
      subtext: "Useful for deep-link debugging",
      icon: <MdContentCopy />,
      onClick: () => console.log("Copy ID", title)
    },
    {
      label: "Pin to Home",
      subtext: "Keep this metric on login",
      icon: <MdPushPin />,
      onClick: () => console.log("Pin", title)
    }
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col justify-between gap-3 relative group transition-all hover:shadow-md hover:border-brand-blue/20">
      <div className="flex justify-between items-start">
        <h3 className="text-xs font-bold text-gray-500 tracking-wide leading-none">{title}</h3>
        <div className="flex items-center gap-2">
          {badgeIcon && (
            <div className="w-9 h-9 rounded-lg bg-brand-blue-light/80 text-brand-blue flex items-center justify-center shrink-0 shadow-2xs">
              {badgeIcon}
            </div>
          )}
          <div className="relative" ref={dropdownRef}>
            <button
              className={`transition-colors p-1 rounded-md ${isDropdownOpen ? "bg-brand-blue-light text-brand-blue" : "text-gray-300 hover:text-gray-600"}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-label="Options"
            >
              <Icon name="DotsHorizontal" folder="dashboardIcon" size="sm" />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-1 z-50">
                <DropdownMenu width={220} className="shadow-2xl border-gray-100">
                  {actions.map((action, i) => (
                    <DropdownItem
                      key={i}
                      label={action.label}
                      subtext={action.subtext}
                      icon={action.icon}
                      onSelect={() => {
                        action.onClick();
                        setIsDropdownOpen(false);
                      }}
                    />
                  ))}
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black text-[#1D3557] tracking-tight leading-none">{value}</h2>
        
        {trendValue ? (
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <span className={`inline-flex items-center gap-0.5 ${trendIsUp ? "text-emerald-600" : "text-rose-500"}`}>
              <span>{trendIsUp ? "↑" : "↓"}</span>
              <span>{trendValue}</span>
            </span>
            {subtitle && (
              <span className="text-gray-400 text-[11px] font-normal">{subtitle}</span>
            )}
          </div>
        ) : subtitle ? (
          <span className="text-gray-400 text-[11px] font-normal">{subtitle}</span>
        ) : null}

        {!hideMiniChart && (
          <div className="h-8 w-full opacity-50 group-hover:opacity-100 transition-opacity mt-1">
            <MiniChart
              type="area"
              data={chartData}
              color={trendIsUp ? "#2196F3" : "#F43F5E"}
              height={32}
            />
          </div>
        )}
      </div>

      <div className="mt-1 pt-2 border-t border-gray-50 flex justify-between items-center group/btn">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{periodLabel}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails?.();
          }}
          className="flex items-center gap-1 text-[10px] font-black text-brand-blue uppercase hover:underline opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          Details
          <Icon name="chevron_right" size="xs" className="transition-transform group-hover/btn:translate-x-1" />
        </button>
      </div>
    </div>
  );
};
