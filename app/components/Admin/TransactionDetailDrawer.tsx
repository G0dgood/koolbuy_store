"use client";

import React from "react";
import Drawer from "../Drawer/Drawer";
import { Button } from "../Button";
import { EmptyState } from "@/app/components/EmptyState";
import {
  apiErrorMessage,
  formatMoney,
  humanize,
  useGetAdminTransactionQuery,
  type AdminTransaction,
  type AdminTransactionDetail,
} from "@/lib/store";

interface TransactionDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  /** The id to load the full record for (defaults to `transaction.id`). */
  transactionId?: string | null;
  /** The list row, shown straight away while the full record loads. */
  transaction?: AdminTransaction | null;
}

type Tone = "success" | "warning" | "error";

/** paid → success, initiated/pending → warning, failed/amount_mismatch → error. */
export function transactionTone(status: string): Tone {
  if (status === "paid") return "success";
  if (status === "failed" || status === "amount_mismatch") return "error";
  return "warning";
}

/** Label for a transaction status, e.g. paid → Complete. */
export function transactionStatusLabel(status: string): string {
  if (status === "paid") return "Complete";
  if (status === "amount_mismatch") return "Amount mismatch";
  return humanize(status);
}

export const toneStyles: Record<Tone, { text: string; dot: string; soft: string }> = {
  success: { text: "text-success", dot: "bg-success", soft: "bg-success-soft" },
  warning: { text: "text-warning", dot: "bg-warning", soft: "bg-warning/10" },
  error: { text: "text-error", dot: "bg-error", soft: "bg-error-soft" },
};

/** e.g. 11 Oct 2026, 21:57 */
function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface TimelineEntry {
  key: string;
  label: string;
  detail?: string;
  at: string;
}

/** Created, gateway events, admin adjustments, refunds and payment, oldest first. */
function buildTimeline(tx: AdminTransaction, detail?: AdminTransactionDetail): TimelineEntry[] {
  const entries: TimelineEntry[] = [{ key: "created", label: "Transaction created", at: tx.created_at }];
  for (const ev of detail?.events ?? []) {
    entries.push({
      key: `ev-${ev.id}`,
      label: humanize(ev.event_type),
      detail: [ev.status && humanize(ev.status), ev.amount_kobo != null ? formatMoney(ev.amount_kobo / 100, tx.currency) : null]
        .filter(Boolean)
        .join(" · "),
      at: ev.created_at,
    });
  }
  for (const adj of detail?.adjustments ?? []) {
    entries.push({
      key: `adj-${adj.id}`,
      label: humanize(adj.action),
      detail: [adj.actor_name, adj.reason].filter(Boolean).join(" · "),
      at: adj.created_at,
    });
  }
  for (const r of detail?.refunds ?? []) {
    entries.push({
      key: `ref-${r.id}`,
      label: `Refund ${humanize(r.status).toLowerCase()}`,
      detail: [formatMoney(r.amount, r.currency), r.reason].filter(Boolean).join(" · "),
      at: r.created_at,
    });
  }
  if (tx.paid_at) entries.push({ key: "paid", label: "Payment received", at: tx.paid_at });
  return entries
    .filter((e) => !Number.isNaN(new Date(e.at).getTime()))
    .sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-light-gray last:border-b-0">
      <span className="text-[12px] text-faint shrink-0">{label}</span>
      <span className="text-[13px] font-medium text-brand-charcoal text-right break-all">{children}</span>
    </div>
  );
}

export function TransactionDetailDrawer({ isOpen, onClose, transactionId: idProp, transaction }: TransactionDetailDrawerProps) {
  const transactionId = idProp ?? transaction?.id ?? null;
  const { data, isFetching, isError, error, refetch } = useGetAdminTransactionQuery(transactionId ?? "", {
    skip: !transactionId,
  });
  const detail = data?.transaction && data.transaction.id === transactionId ? data.transaction : undefined;
  const tx: AdminTransaction | undefined = detail ?? (transaction?.id === transactionId ? transaction ?? undefined : undefined);

  const tone = toneStyles[transactionTone(tx?.status ?? "")];
  const timeline = tx ? buildTimeline(tx, detail) : [];
  const method = tx ? humanize(tx.method || tx.channel) : "—";

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Transaction details" width="max-w-md">
      {!tx ? (
        isError ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <p className="text-[13px] text-error">{apiErrorMessage(error, "Couldn't load this transaction.")}</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try again
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3 animate-pulse" aria-busy>
            <div className="h-28 rounded-lg bg-black/[0.06]" />
            <div className="h-48 rounded-lg bg-black/[0.04]" />
          </div>
        )
      ) : (
        <div className="flex flex-col gap-6">
          {/* Summary */}
          <div className={`p-5 rounded-lg ${tone.soft} flex flex-col gap-3`}>
            <div className="flex justify-between items-start gap-3">
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-[12px] text-faint">Reference</span>
                <span className="text-[13px] font-semibold text-brand-charcoal break-all">{tx.reference || "—"}</span>
              </div>
              <span className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white text-[12px] font-semibold ${tone.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${tone.dot}`} />
                {transactionStatusLabel(tx.status)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] text-faint">Amount</span>
              <span className="text-[26px] font-semibold text-brand-charcoal tabular-nums">
                {formatMoney(tx.amount, tx.currency)}
              </span>
            </div>
          </div>

          {/* Payment */}
          <section className="flex flex-col gap-2">
            <h4 className="text-[13px] font-semibold text-brand-charcoal">Payment</h4>
            <div className="bg-white border border-light-gray rounded-lg px-4">
              <Row label="Purpose">{humanize(tx.purpose)}</Row>
              <Row label="Method">{method}</Row>
              <Row label="Source">{humanize(tx.source)}</Row>
              <Row label="Currency">{tx.currency}</Row>
              <Row label="Fees">{tx.fees == null ? "—" : formatMoney(tx.fees, tx.currency)}</Row>
              <Row label="Refunded">{formatMoney(tx.refunded_amount, tx.currency)}</Row>
              <Row label="Created">{formatDateTime(tx.created_at)}</Row>
              <Row label="Paid">{formatDateTime(tx.paid_at)}</Row>
            </div>
          </section>

          {/* Customer and order */}
          <section className="flex flex-col gap-2">
            <h4 className="text-[13px] font-semibold text-brand-charcoal">Customer and order</h4>
            <div className="bg-white border border-light-gray rounded-lg px-4">
              <Row label="Customer">{tx.buyer?.name || "—"}</Row>
              <Row label="Email">{tx.buyer?.email || "—"}</Row>
              <Row label="Order">{tx.order?.order_number || "—"}</Row>
              {tx.order && <Row label="Order status">{humanize(tx.order.status)}</Row>}
            </div>
          </section>

          {/* Timeline */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h4 className="text-[13px] font-semibold text-brand-charcoal">Timeline</h4>
              {isFetching && <span className="text-[11px] text-faint">Updating…</span>}
            </div>
            {isError && !detail && (
              <p className="text-[12px] text-error">
                {apiErrorMessage(error, "Couldn't load the full history.")}{" "}
                <button type="button" className="underline cursor-pointer" onClick={() => refetch()}>
                  Retry
                </button>
              </p>
            )}
            {timeline.length === 0 ? (
              <EmptyState
                illustration="payments"
                size="sm"
                title="No activity yet"
                description="Payment events will appear here once the gateway reports them."
              />
            ) : (
              <ol className="flex flex-col gap-5 relative pl-6 before:absolute before:left-[5px] before:top-1.5 before:bottom-1.5 before:w-px before:bg-light-gray">
                {timeline.map((entry, i) => (
                  <li key={entry.key} className="relative flex flex-col gap-0.5">
                    <span
                      className={`absolute -left-6 top-1 w-[11px] h-[11px] rounded-full border-2 border-white ${
                        i === timeline.length - 1 ? tone.dot : "bg-medium-gray"
                      }`}
                    />
                    <span className="text-[13px] font-medium text-brand-charcoal">{entry.label}</span>
                    {entry.detail && <span className="text-[12px] text-subtle">{entry.detail}</span>}
                    <span className="text-[11px] text-faint">{formatDateTime(entry.at)}</span>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>
      )}
    </Drawer>
  );
}
