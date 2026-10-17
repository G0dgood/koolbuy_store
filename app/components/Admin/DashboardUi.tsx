"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  type ChartOptions,
  type Plugin,
  type TooltipItem,
} from "chart.js";
import { Bar, Doughnut, Line, Pie } from "react-chartjs-2";
import { BarChartIcon, ActivityLogIcon, PieChartIcon } from "@radix-ui/react-icons";
import { getAdminTheme, onAdminThemeChange } from "./adminTheme";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Filler, Tooltip, Legend);
// Every chart (axes, legends, tooltips) uses the app font, as in the CRM.
ChartJS.defaults.font.family = "'Work Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

/* Dashboard building blocks in the Koolboks Sales CRM style (DESIGN.md §7a):
   white bordered cards, 15px semibold titles, orange-soft selection. */

export type ChartKind = "bar" | "line" | "area" | "pie" | "donut";

const KIND_ICON: Record<ChartKind, React.ComponentType<{ className?: string }>> = {
  bar: BarChartIcon,
  line: ActivityLogIcon,
  area: ActivityLogIcon,
  pie: PieChartIcon,
  donut: PieChartIcon,
};
const KIND_LABEL: Record<ChartKind, string> = { bar: "Bar", line: "Line", area: "Area", pie: "Pie", donut: "Donut" };

/** Categorical colours in a fixed order: the Sales CRM's chart palette. */
export const SERIES = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#008300", "#4a3aa7", "#e34948"];
/** One measure over time is drawn in Koolboks orange. */
export const BRAND = "#F57E16";

/** Joined buttons to pick the chart type. */
export function ChartTypePicker({
  kinds,
  value,
  onChange,
}: {
  kinds: ChartKind[];
  value: ChartKind;
  onChange: (k: ChartKind) => void;
}) {
  return (
    <div role="radiogroup" aria-label="Chart type" className="inline-flex rounded-lg border border-light-gray overflow-hidden">
      {kinds.map((k) => {
        const Icon = KIND_ICON[k];
        const on = value === k;
        return (
          <button
            key={k}
            type="button"
            role="radio"
            aria-checked={on}
            aria-label={`${KIND_LABEL[k]} chart`}
            title={KIND_LABEL[k]}
            onClick={() => onChange(k)}
            className={`h-8 min-w-8 px-2 flex items-center justify-center border-r border-light-gray last:border-r-0 transition-colors cursor-pointer ${
              on ? "bg-brand-orange-soft text-brand-orange-text" : "bg-white text-faint hover:text-brand-charcoal"
            }`}
          >
            <Icon className="w-4 h-4" />
          </button>
        );
      })}
    </div>
  );
}

/** A titled card for a chart, with an optional chart-type picker and extra controls. */
export function ChartCard({
  title,
  subtitle,
  kinds,
  kind,
  onKind,
  controls,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  kinds?: ChartKind[];
  kind?: ChartKind;
  onKind?: (k: ChartKind) => void;
  controls?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section aria-label={title} className={`bg-white border border-light-gray rounded-lg p-4 md:p-5 flex flex-col ${className}`}>
      <header className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-[15px] font-semibold text-brand-charcoal">{title}</h3>
          {subtitle && <p className="text-[12px] text-faint">{subtitle}</p>}
        </div>
        {(controls || (kinds && kind && onKind)) && (
          <div className="flex flex-wrap items-center gap-2">
            {controls}
            {kinds && kind && onKind && <ChartTypePicker kinds={kinds} value={kind} onChange={onKind} />}
          </div>
        )}
      </header>
      {children}
    </section>
  );
}

/** Shared chart.js look: Work Sans, grey ticks, light grid, charcoal tooltip. */
export const chartBaseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: "index" as const, intersect: false },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "#050711",
      titleFont: { size: 12, weight: "bold" as const, family: "Work Sans" },
      bodyFont: { size: 12, family: "Work Sans" },
      padding: 10,
      cornerRadius: 8,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: { color: "#6C757D", font: { size: 11, family: "Work Sans" } },
    },
    y: {
      beginAtZero: true,
      grid: { color: "#E9ECEF" },
      border: { display: false },
      ticks: { color: "#6C757D", font: { size: 11, family: "Work Sans" } },
    },
  },
};

/** ₦ with thousands separators, or a short form (₦1.2M) for axis ticks. */
export const naira = (v: number, short = false) => {
  if (short && Math.abs(v) >= 1_000_000) return `₦${(v / 1_000_000).toLocaleString("en-NG", { maximumFractionDigits: 1 })}M`;
  if (short && Math.abs(v) >= 1_000) return `₦${(v / 1_000).toLocaleString("en-NG", { maximumFractionDigits: 1 })}k`;
  return `₦${v.toLocaleString("en-NG")}`;
};

const withAlpha = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

export interface Series {
  label: string;
  values: number[];
  color?: string;
}

const LIGHT_INK = { text: "#495057", grid: "rgba(15,23,42,0.06)", surface: "#ffffff", strong: "#050711", soft: "#6C757D" };
const DARK_INK = { text: "#CBD5E1", grid: "rgba(255,255,255,0.08)", surface: "#1E293B", strong: "#F1F5F9", soft: "#94A3B8" };

/** Chart colours for the current admin theme; charts redraw when it changes. */
function useInk() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(getAdminTheme() === "dark");
    return onAdminThemeChange((t) => setDark(t === "dark"));
  }, []);
  return dark ? DARK_INK : LIGHT_INK;
}
const tooltipLook = {
  backgroundColor: "#050711",
  padding: 10,
  cornerRadius: 6,
  titleFont: { size: 12, weight: 600 as const, family: "Work Sans" },
  bodyFont: { size: 12, family: "Work Sans" },
};

/**
 * Draws labels × series as the chosen kind (ported from the Sales CRM's
 * SmartChart). Pie and donut use the first series, one slice per label, in
 * palette order or `sliceColors`; the legend shows each slice's share and
 * clicking it hides the slice. A donut can show a total in its middle.
 */
export function SmartChart({
  kind,
  labels,
  series,
  format = (v) => v.toLocaleString("en-NG"),
  sliceColors,
  horizontal,
  height = 260,
  centerLabel,
  compact,
}: {
  kind: ChartKind;
  labels: string[];
  series: Series[];
  format?: (v: number) => string;
  sliceColors?: string[];
  horizontal?: boolean;
  height?: number;
  /** Text in the middle of a donut, e.g. the total. */
  centerLabel?: { value: string; caption: string };
  /** A bare sparkline: no axes, legend, points or tooltip. */
  compact?: boolean;
}) {
  const INK = useInk();
  const empty = series.every((s) => s.values.every((v) => !v));
  if (!labels.length || empty) {
    return (
      <div className="flex items-center justify-center text-[13px] text-faint" style={{ height }}>
        Nothing in this period yet.
      </div>
    );
  }

  if (kind === "pie" || kind === "donut") {
    const values = series[0].values;
    const total = values.reduce((a, b) => a + b, 0) || 1;
    const colors = sliceColors ?? labels.map((_, i) => SERIES[i % SERIES.length]);
    const data = {
      labels,
      datasets: [{ data: values, backgroundColor: colors, borderColor: INK.surface, borderWidth: 2, hoverOffset: 8 }],
    };
    const options: ChartOptions<"doughnut"> = {
      responsive: true,
      maintainAspectRatio: false,
      cutout: kind === "donut" ? "66%" : 0,
      animation: { animateRotate: true, duration: 900 },
      plugins: {
        legend: {
          position: "right",
          labels: {
            color: INK.text,
            boxWidth: 10,
            boxHeight: 10,
            usePointStyle: true,
            padding: 12,
            font: { size: 12, family: "Work Sans" },
            generateLabels: (chart) =>
              (chart.data.labels as string[]).map((l, i) => ({
                text: `${l}  ${Math.round((values[i] / total) * 100)}%`,
                fillStyle: colors[i],
                strokeStyle: colors[i],
                fontColor: INK.text,
                hidden: !chart.getDataVisibility(i),
                index: i,
                pointStyle: "circle" as const,
              })),
          },
          onClick: (_e, item, legend) => {
            legend.chart.toggleDataVisibility(item.index!);
            legend.chart.update();
          },
        },
        tooltip: {
          ...tooltipLook,
          callbacks: { label: (ctx: TooltipItem<"doughnut">) => ` ${ctx.label}: ${format(ctx.parsed)}` },
        },
      },
    };
    // The total in the donut's hole, drawn where Chart.js put the chart.
    const centerText: Plugin<"doughnut"> = {
      id: "centerText",
      afterDraw(chart) {
        if (kind !== "donut" || !centerLabel) return;
        const { ctx, chartArea } = chart;
        const x = (chartArea.left + chartArea.right) / 2;
        const y = (chartArea.top + chartArea.bottom) / 2;
        ctx.save();
        ctx.textAlign = "center";
        ctx.fillStyle = INK.strong;
        ctx.font = "600 18px 'Work Sans', sans-serif";
        ctx.fillText(centerLabel.value, x, y + 2);
        ctx.fillStyle = INK.soft;
        ctx.font = "400 11px 'Work Sans', sans-serif";
        ctx.fillText(centerLabel.caption, x, y + 18);
        ctx.restore();
      },
    };
    return (
      <div style={{ height }} key={INK.surface}>
        {kind === "pie" ? (
          <Pie data={data} options={options as ChartOptions<"pie">} />
        ) : (
          <Doughnut data={data} options={options} plugins={[centerText]} />
        )}
      </div>
    );
  }

  const many = series.length > 1;
  const perBar = kind === "bar" && !many && !!sliceColors;
  const datasets = series.map((s, i) => {
    const color = s.color ?? (many ? SERIES[i % SERIES.length] : BRAND);
    return {
      label: s.label,
      data: s.values,
      // One bar series can take a colour per bar (sliceColors).
      borderColor: perBar ? sliceColors : color,
      backgroundColor: kind === "area" ? withAlpha(color, 0.16) : perBar ? sliceColors : color,
      // Only the first series is filled, so a comparison line stays readable.
      fill: kind === "area" && i === 0 ? "origin" : false,
      tension: 0.35,
      cubicInterpolationMode: "monotone" as const,
      borderWidth: kind === "bar" ? 0 : 2,
      pointRadius: kind === "bar" || compact ? 0 : 3,
      pointHoverRadius: 6,
      pointBackgroundColor: color,
      pointBorderColor: INK.surface,
      borderRadius: 4,
      borderSkipped: false as const,
      maxBarThickness: 28,
      categoryPercentage: 0.7,
      barPercentage: 0.85,
    };
  });
  const ticks = { color: INK.text, font: { size: 11, family: "Work Sans" } };
  const scales = {
    x: { grid: { display: false }, ticks: { ...ticks, maxRotation: 0, autoSkip: labels.length > 12 }, border: { color: INK.grid } },
    y: {
      beginAtZero: true,
      grid: { color: INK.grid },
      border: { display: false },
      ticks: { ...ticks, precision: 0, callback: (v: number | string) => format(Number(v)) },
    },
  };
  if (compact) {
    const bare = {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 400 },
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      scales: { x: { display: false }, y: { display: false, beginAtZero: false } },
      elements: { point: { radius: 0 } },
    };
    return (
      <div style={{ height }}>
        <Line data={{ labels, datasets }} options={bare as ChartOptions<"line">} />
      </div>
    );
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: horizontal ? ("y" as const) : ("x" as const),
    interaction: { mode: "index" as const, intersect: false },
    plugins: {
      legend: {
        display: many,
        position: "top" as const,
        align: "end" as const,
        labels: { color: INK.text, boxWidth: 10, boxHeight: 10, usePointStyle: true, font: { size: 12, family: "Work Sans" } },
      },
      tooltip: {
        ...tooltipLook,
        callbacks: {
          label: (ctx: TooltipItem<"bar" | "line">) =>
            ` ${ctx.dataset.label}: ${format((horizontal ? ctx.parsed.x : ctx.parsed.y) ?? 0)}`,
        },
      },
    },
    scales: horizontal ? { x: scales.y, y: { ...scales.x, ticks: { ...scales.x.ticks, autoSkip: false } } } : scales,
  };
  return (
    <div style={{ height }} key={INK.surface}>
      {kind === "bar" ? (
        <Bar data={{ labels, datasets }} options={options as ChartOptions<"bar">} />
      ) : (
        <Line data={{ labels, datasets }} options={options as ChartOptions<"line">} />
      )}
    </div>
  );
}

/** Counts up (or down) to `value` whenever it changes. */
export function AnimatedNumber({ value, format = (v) => v.toLocaleString("en-NG") }: { value: number; format?: (v: number) => string }) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    const start = from.current;
    if (start === value) return;
    const t0 = performance.now();
    const dur = 700;
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      setShown(start + (value - start) * eased);
      if (k < 1) raf = requestAnimationFrame(tick);
      else from.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      from.current = value;
    };
  }, [value]);
  return <>{format(Math.round(shown))}</>;
}
