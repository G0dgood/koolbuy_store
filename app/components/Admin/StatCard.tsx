"use client";

import React from "react";

/* A number tile in the Koolboks Sales CRM style (DESIGN.md §7a): label, change
   pill, value, hint and a small trend line. No icons or menus. */

interface StatCardProps {
  title: string;
  value: React.ReactNode;
  /** Short hint under the value, e.g. "Last 30 days". */
  periodLabel?: string;
  /** Change against the previous period, e.g. "12.5%". */
  trendValue?: string;
  trendIsUp?: boolean;
  /** What the change is compared with; shown as the pill's tooltip. */
  subtitle?: string;
  /** Makes the tile a button (e.g. to open a details drawer). */
  onViewDetails?: () => void;
  chartData?: number[];
  hideMiniChart?: boolean;
  /** "sm" tiles skip the trend line unless hideMiniChart is false. */
  size?: "default" | "sm";
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  periodLabel,
  trendValue,
  trendIsUp = true,
  subtitle,
  onViewDetails,
  chartData,
  hideMiniChart,
  size = "default",
  className = "",
}) => {
  const isSm = size === "sm";
  const showSpark = (hideMiniChart !== undefined ? !hideMiniChart : !isSm) && !!chartData?.some((v) => v > 0);
  // Without a trend, the subtitle is the hint.
  const hint = periodLabel ?? (trendValue ? undefined : subtitle);

  const body = (
    <>
      <div className="flex items-start justify-between gap-2">
        <p className="text-[12px] md:text-[13px] text-faint text-left">{title}</p>
        {trendValue && (
          <span
            className={`shrink-0 px-1.5 py-0.5 rounded-full text-[11px] font-semibold tabular-nums ${
              trendIsUp ? "bg-success-soft text-success" : "bg-error-soft text-error"
            }`}
            title={subtitle ?? "Compared with the previous period"}
          >
            {trendIsUp ? "▲" : "▼"} {trendValue.replace(/^[+-]/, "")}
          </span>
        )}
      </div>
      <p
        className={`mt-1 font-semibold tabular-nums text-brand-charcoal text-left ${
          isSm ? "text-[20px] md:text-[22px]" : "text-[22px] md:text-[26px]"
        }`}
      >
        {value}
      </p>
      {hint && <p className="text-[12px] text-faint text-left">{hint}</p>}
      {showSpark && <Sparkline values={chartData!} />}
    </>
  );

  const frame = `p-4 bg-white border border-light-gray rounded-lg flex flex-col ${className}`;

  return onViewDetails ? (
    <button
      type="button"
      onClick={onViewDetails}
      className={`${frame} w-full transition-colors hover:border-brand-orange/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange cursor-pointer`}
    >
      {body}
    </button>
  ) : (
    <div className={frame}>{body}</div>
  );
};

/** A tiny trend line under a stat. */
function Sparkline({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);
  const w = 100;
  const h = 24;
  const step = values.length > 1 ? w / (values.length - 1) : w;
  const pts = values.map((v, i) => `${(i * step).toFixed(1)},${(h - 2 - (v / max) * (h - 4)).toFixed(1)}`);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="mt-auto pt-2 w-full h-8" aria-hidden>
      <polygon points={`0,${h} ${pts.join(" ")} ${w},${h}`} fill="rgba(245,126,22,0.12)" />
      <polyline points={pts.join(" ")} fill="none" stroke="#F57E16" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
