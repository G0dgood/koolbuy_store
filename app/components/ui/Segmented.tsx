"use client";

import React from "react";

export interface SegmentedOption<T extends string = string> {
  value: T;
  label: string;
  count?: number | string;
  icon?: React.ReactNode;
}

export interface SegmentedProps<T extends string = string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
  size?: "sm" | "md";
  className?: string;
}

/**
 * Segmented component ported directly from koolboks_sales_crm_web
 * (components/features/activity/ActivityUi.tsx:161-208 and app/dashboard/page.tsx:121).
 *
 * Renders a row of joined toggle buttons in a pill container with
 * light-gray borders, soft brand orange active background, and inset bottom indicator.
 */
export function Segmented<T extends string = string>({
  options,
  value,
  onChange,
  label,
  size = "md",
  className = "",
}: SegmentedProps<T>) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <span className="input-label block">{label}</span>}
      <div className="max-w-full overflow-x-auto no-scrollbar">
        <div
          role="tablist"
          aria-label={label || "Tabs"}
          className="inline-flex rounded-[var(--radius)] border overflow-hidden bg-white dark:bg-gray-800"
          style={{ borderColor: "var(--light-gray, #E2E8F0)" }}
        >
          {options.map((o) => {
            const selected = o.value === value;
            return (
              <button
                key={o.value}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => onChange(o.value)}
                className={`
                  ${size === "sm" ? "min-h-9 px-3.5 text-xs" : "min-h-11 px-5 text-xs sm:text-[13px]"}
                  min-w-16 shrink-0 !rounded-none border-r last:border-r-0 cursor-pointer font-semibold
                  transition-all duration-150 flex items-center justify-center gap-2 select-none
                `}
                style={{
                  borderColor: "var(--light-gray, #E2E8F0)",
                  backgroundColor: selected
                    ? "var(--brand-orange-soft, #FEF1E6)"
                    : "var(--accent-white, #FFFFFF)",
                  color: selected
                    ? "var(--text-primary, #0F172A)"
                    : "var(--text-secondary, #64748B)",
                  boxShadow: selected
                    ? "inset 0 -3px 0 var(--brand-orange, #F57E16)"
                    : undefined,
                }}
              >
                {o.icon && <span className="shrink-0">{o.icon}</span>}
                <span className={selected ? "font-bold" : "font-semibold"}>
                  {o.label}
                </span>
                {o.count !== undefined && o.count !== null && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-colors ${
                      selected
                        ? "bg-brand-orange text-white"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {o.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Segmented;
