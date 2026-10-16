"use client";

import React from "react";
import { humanize } from "@/lib/store";

/* Status pill for orders and financing invoices (DESIGN.md §1 Status):
   finished states are success, failed/stopped states are error, anything still
   moving is orange ("in progress / act here"). */

type Tone = "success" | "error" | "progress" | "neutral";

const TONES: Record<string, Tone> = {
  // orders
  delivered: "success",
  new: "progress",
  confirmed: "progress",
  in_transit: "progress",
  pending_payment: "progress",
  pending_credit_review: "progress",
  cancelled: "error",
  expired: "error",
  refund_due: "error",
  // financing invoices / applications
  paid: "success",
  approved: "success",
  unpaid: "progress",
  partially_paid: "progress",
  pending_approval: "progress",
  pending: "progress",
  needs_info: "progress",
  overdue: "error",
  declined: "error",
  auto_declined: "error",
  rejected: "error",
};

const TONE_CLASSES: Record<Tone, string> = {
  success: "bg-success-soft text-success",
  error: "bg-error-soft text-error",
  progress: "bg-brand-orange-soft text-brand-orange-text",
  neutral: "bg-off-white text-subtle",
};

/** Friendlier labels where humanize() reads awkwardly */
const LABELS: Record<string, string> = {
  pending_payment: "Awaiting payment",
  pending_credit_review: "Credit review",
  in_transit: "In transit",
  new: "New",
};

export function statusLabel(status: string | null | undefined): string {
  if (!status) return "—";
  return LABELS[status] ?? humanize(status);
}

export function StatusBadge({ status, className = "" }: { status: string | null | undefined; className?: string }) {
  const tone = (status && TONES[status]) || "neutral";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${TONE_CLASSES[tone]} ${className}`}
    >
      {statusLabel(status)}
    </span>
  );
}
