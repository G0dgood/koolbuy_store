/* Shared bits for the admin dashboard: the period switch, order-status chart
   colours and money formatting. The numbers come from the API
   (lib/store/api/dashboard-api.ts). */

import type { AnalyticsPeriod } from "@/lib/store/api/dashboard-api";

export type Range = AnalyticsPeriod;

export const RANGES: { value: Range; label: string; days: number }[] = [
  { value: "7d", label: "7 days", days: 7 },
  { value: "30d", label: "30 days", days: 30 },
  { value: "90d", label: "90 days", days: 90 },
];

export const RANGE_TEXT: Record<Range, { now: string; before: string }> = {
  "7d": { now: "the last 7 days", before: "the 7 days before" },
  "30d": { now: "the last 30 days", before: "the 30 days before" },
  "90d": { now: "the last 90 days", before: "the 90 days before" },
};

const ymd = (d: Date) => d.toISOString().slice(0, 10);

/** The period as YYYY-MM-DD (UTC, inclusive), the same days /admin/analytics/ uses. */
export function rangeDates(range: Range): { from: string; to: string } {
  const days = RANGES.find((r) => r.value === range)?.days ?? 30;
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const from = new Date(today.getTime() - (days - 1) * 86_400_000);
  return { from: ymd(from), to: ymd(today) };
}

/** Status colours (chart canvas needs values, not classes): done green, on the way blue,
    in progress amber, waiting grey, stopped red. */
const STATUS_COLOR: Record<string, string> = {
  delivered: "#1baf7a",
  completed: "#1baf7a",
  in_transit: "#2a78d6",
  shipped: "#2a78d6",
  out_for_delivery: "#2a78d6",
  confirmed: "#eda100",
  processing: "#eda100",
  new: "#94a3b8",
  pending: "#94a3b8",
  pending_payment: "#94a3b8",
  pending_credit_review: "#94a3b8",
  cancelled: "#e34948",
  expired: "#e34948",
  declined: "#e34948",
  refund_due: "#e34948",
};

export const statusColor = (status: string) => STATUS_COLOR[status] ?? "#94a3b8";

export const MARKET_NAMES: Record<string, string> = { NG: "Nigeria", KE: "Kenya", UG: "Uganda" };

/** An amount in its currency, e.g. ₦85,000, or short (₦1.2M) for axes and tiles. */
export function money(v: number, currency = "NGN", short = false): string {
  try {
    const locale = currency === "KES" ? "en-KE" : currency === "UGX" ? "en-UG" : "en-NG";
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      notation: short && Math.abs(v) >= 1_000 ? "compact" : "standard",
      maximumFractionDigits: short ? 1 : v % 1 === 0 ? 0 : 2,
    }).format(v);
  } catch {
    return `${currency} ${v.toLocaleString("en-NG")}`;
  }
}

/** Change against the previous period in percent, or null when there was nothing before. */
export function change(value: number, previous: number): number | null {
  if (!previous) return null;
  return ((value - previous) / previous) * 100;
}

/** "2026-10-14" → "14 Oct" */
export const dayLabel = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

/** "3 min ago", "5 h ago", or a date. */
export function timeAgo(iso: string): string {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "";
  const mins = Math.round((Date.now() - t) / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days} d ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
