"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Breadcrumbs } from "@/app/components/Breadcrumbs";
import { Button } from "@/app/components/Button";
import { EmptyState, EmptyTableRow } from "@/app/components/EmptyState";
import { Input, Textarea } from "@/app/components/Form/Inputs";
import { Select } from "@/app/components/Form/Select";
import { Modal } from "@/app/components/ui/Modal";
import { StatusBadge, statusLabel } from "@/app/components/Admin/Orders/StatusBadge";
import {
  apiErrorMessage,
  formatDate,
  formatMoney,
  humanize,
  useGetFinancingInvoiceQuery,
  useRecordFinancingRepaymentMutation,
  type FinancingInvoiceDetailResponse,
  type RecordRepaymentPayload,
} from "@/lib/store";

/** Invoice statuses that accept repayments (backend ACTIVE_INVOICE_STATUSES) */
const PAYABLE = ["unpaid", "partially_paid", "overdue"];
/** Backend minimum per repayment, unless the balance is smaller */
const MIN_REPAYMENT = 100;

const SOURCE_OPTIONS: { value: RecordRepaymentPayload["source"]; label: string }[] = [
  { value: "bank_transfer", label: "Bank transfer" },
  { value: "cash", label: "Cash" },
  { value: "pos", label: "POS" },
];

function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return `${formatDate(iso)}, ${d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 text-xs">
      <span className="text-faint">{label}</span>
      <span className="text-brand-charcoal text-right break-words">{value || "—"}</span>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-lg border border-light-gray p-6 flex flex-col gap-4">
      <h3 className="text-base font-semibold text-brand-charcoal">{title}</h3>
      {children}
    </section>
  );
}

function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-8 pb-12 animate-pulse" aria-busy>
      <div className="h-4 w-48 rounded bg-off-white" />
      <div className="h-8 w-72 rounded bg-off-white" />
      <div className="h-32 rounded-lg bg-white border border-light-gray" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 h-72 rounded-lg bg-white border border-light-gray" />
        <div className="h-72 rounded-lg bg-white border border-light-gray" />
      </div>
    </div>
  );
}

interface RepaymentForm {
  amount: string;
  source: RecordRepaymentPayload["source"];
  reference: string;
  reason: string;
}

const EMPTY_FORM: RepaymentForm = { amount: "", source: "bank_transfer", reference: "", reason: "" };

function validate(form: RepaymentForm, balance: number, currency: string): Partial<Record<keyof RepaymentForm, string>> {
  const errors: Partial<Record<keyof RepaymentForm, string>> = {};
  const amount = Number(form.amount);
  const min = Math.min(MIN_REPAYMENT, balance);
  if (!form.amount.trim() || !Number.isFinite(amount) || amount <= 0) errors.amount = "Enter an amount above zero.";
  else if (amount > balance + 0.004) errors.amount = `The balance is ${formatMoney(balance, currency)}.`;
  else if (amount + 0.004 < min) errors.amount = `The minimum repayment is ${formatMoney(min, currency)} (or the full balance).`;
  if (!form.reference.trim()) errors.reference = "Enter the bank, POS or receipt reference.";
  if (form.reason.trim().length < 5) errors.reason = "Give a reason of at least 5 characters for the audit log.";
  return errors;
}

function RecordRepaymentModal({
  invoice,
  open,
  onClose,
}: {
  invoice: FinancingInvoiceDetailResponse;
  open: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState<RepaymentForm>(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [recordRepayment, { isLoading }] = useRecordFinancingRepaymentMutation();

  const errors = validate(form, invoice.balance, invoice.currency);
  const shown = submitted ? errors : {};

  const close = () => {
    if (isLoading) return;
    setForm(EMPTY_FORM);
    setSubmitted(false);
    onClose();
  };

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    try {
      const res = await recordRepayment({
        invoiceId: invoice.id,
        amount: Math.round(Number(form.amount) * 100) / 100,
        source: form.source,
        reference: form.reference.trim(),
        reason: form.reason.trim(),
      }).unwrap();
      toast.success(
        res.invoice.balance > 0
          ? `Repayment recorded. Balance now ${formatMoney(res.invoice.balance, invoice.currency)}.`
          : `Repayment recorded. ${res.invoice.invoice_number} is fully paid.`,
      );
      setForm(EMPTY_FORM);
      setSubmitted(false);
      onClose();
    } catch (err) {
      toast.error(apiErrorMessage(err, "Couldn't record the repayment."));
    }
  };

  const set = <K extends keyof RepaymentForm>(key: K, value: RepaymentForm[K]) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <Modal
      open={open}
      onClose={close}
      title="Record repayment"
      description={`Log a payment received outside Paystack for ${invoice.invoice_number}. Balance: ${formatMoney(invoice.balance, invoice.currency)}.`}
      size="md"
      footer={
        <div className="flex justify-end gap-3 w-full">
          <Button variant="outline" size="md" onClick={close} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={() => submit()} disabled={isLoading}>
            {isLoading ? "Recording..." : "Record repayment"}
          </Button>
        </div>
      }
    >
      <form onSubmit={submit} className="flex flex-col gap-4 py-2" noValidate>
        <label className="flex flex-col gap-1.5">
          <span className="flex items-center justify-between text-xs font-semibold text-subtle">
            Amount ({invoice.currency})
            <button
              type="button"
              className="brand-link text-[11px] font-medium"
              onClick={() => set("amount", String(invoice.balance))}
            >
              Use full balance
            </button>
          </span>
          <Input
            type="number"
            inputMode="decimal"
            min={0}
            step="0.01"
            value={form.amount}
            onChange={(e) => set("amount", e.target.value)}
            error={!!shown.amount}
            aria-invalid={!!shown.amount}
            placeholder="0.00"
          />
          {shown.amount && <span className="text-[11px] text-error">{shown.amount}</span>}
        </label>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-subtle">Source</span>
          <Select
            value={form.source}
            onChange={(v: string) => set("source", v as RepaymentForm["source"])}
            options={SOURCE_OPTIONS}
          />
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-subtle">Reference</span>
          <Input
            type="text"
            value={form.reference}
            onChange={(e) => set("reference", e.target.value)}
            error={!!shown.reference}
            aria-invalid={!!shown.reference}
            placeholder="Bank / POS / receipt reference"
          />
          {shown.reference && <span className="text-[11px] text-error">{shown.reference}</span>}
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-subtle">Reason</span>
          <Textarea
            rows={3}
            value={form.reason}
            onChange={(e) => set("reason", e.target.value)}
            error={!!shown.reason}
            aria-invalid={!!shown.reason}
            placeholder="e.g. Retailer paid at the branch, receipt filed"
            className="text-xs"
          />
          {shown.reason && <span className="text-[11px] text-error">{shown.reason}</span>}
        </label>
      </form>
    </Modal>
  );
}

export default function BnplOrderDetails() {
  const params = useParams<{ id: string }>();
  const invoiceId = typeof params.id === "string" ? decodeURIComponent(params.id) : "";

  const { data: invoice, isLoading, error, refetch } = useGetFinancingInvoiceQuery(invoiceId, { skip: !invoiceId });
  const [isRepayOpen, setIsRepayOpen] = useState(false);

  if (isLoading) return <DetailSkeleton />;

  if (!invoice) {
    const notFound = !!error && typeof error === "object" && "status" in error && error.status === 404;
    return (
      <div className="flex flex-col gap-6 pb-12">
        <Breadcrumbs hideHome items={[{ label: "BNPL Orders", href: "/admin/bnpl-orders" }, { label: invoiceId || "Invoice" }]} />
        {notFound ? (
          <EmptyState
            variant="card"
            illustration="search"
            title="Invoice not found"
            description={`No BNPL invoice matches "${invoiceId}". The link may be wrong.`}
            action={{ label: "Back to BNPL orders", href: "/admin/bnpl-orders" }}
          />
        ) : (
          <div className="bg-white rounded-lg border border-light-gray p-10 flex flex-col items-center gap-3 text-center">
            <p className="text-base font-semibold text-brand-charcoal">Couldn&apos;t load this invoice</p>
            <p className="text-xs text-subtle max-w-sm">
              {apiErrorMessage(error, "Something went wrong loading the invoice.")}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={refetch}>
                Try again
              </Button>
              <Link href="/admin/bnpl-orders" className="brand-link text-xs self-center">
                Back to BNPL orders
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  const cur = invoice.currency;
  const canRepay = PAYABLE.includes(invoice.status) && invoice.balance > 0;
  const retailer = invoice.retailer;

  return (
    <div className="flex flex-col gap-8 mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Breadcrumbs hideHome items={[{ label: "BNPL Orders", href: "/admin/bnpl-orders" }, { label: invoice.invoice_number }]} />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-mono text-2xl font-semibold text-brand-charcoal tracking-tight">{invoice.invoice_number}</h1>
            <StatusBadge status={invoice.status} />
            {invoice.application_status && (
              <span className="text-xs text-faint">Application: {statusLabel(invoice.application_status)}</span>
            )}
          </div>
          {canRepay && (
            <Button variant="accent" size="md" onClick={() => setIsRepayOpen(true)}>
              Record repayment
            </Button>
          )}
        </div>
        <p className="text-xs text-faint">Issued {formatDateTime(invoice.issued_at)}</p>
      </div>

      {/* Summary */}
      <section className="bg-white rounded-lg border border-light-gray p-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-faint">Total payable</span>
          <span className="font-mono text-lg font-semibold text-brand-charcoal">{formatMoney(invoice.total_payable, cur)}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-faint">Paid so far</span>
          <span className="font-mono text-lg font-semibold text-success">{formatMoney(invoice.amount_paid, cur)}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-faint">Balance</span>
          <span className={`font-mono text-lg font-semibold ${invoice.balance > 0 ? "text-brand-orange-text" : "text-brand-charcoal"}`}>
            {formatMoney(invoice.balance, cur)}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-faint">Due date</span>
          <span className={`text-lg font-semibold ${invoice.status === "overdue" ? "text-error" : "text-brand-charcoal"}`}>
            {formatDate(invoice.due_date)}
          </span>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Repayments */}
          <section className="bg-white rounded-lg border border-light-gray overflow-hidden">
            <div className="p-6 border-b border-light-gray flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-base font-semibold text-brand-charcoal">Repayments</h3>
              <span className="text-xs text-faint">
                Due {formatDate(invoice.due_date)} · {invoice.tenor_days}-day tenor ·{" "}
                {(invoice.fee_rate * 100).toLocaleString(undefined, { maximumFractionDigits: 2 })}% fee
              </span>
            </div>
            <div className="admin-table-container">
              <table>
                <thead>
                  <tr>
                    <th>Received</th>
                    <th>Amount</th>
                    <th>Fee / principal</th>
                    <th>Source</th>
                    <th>Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.repayments.length === 0 ? (
                    <EmptyTableRow
                      colSpan={5}
                      size="sm"
                      illustration="payments"
                      title="No repayments yet"
                      description="Repayments will appear here once they're recorded."
                    />
                  ) : (
                    invoice.repayments.map((r) => (
                      <tr key={r.id}>
                        <td className="text-sm text-subtle whitespace-nowrap">{formatDateTime(r.received_at)}</td>
                        <td className="font-mono text-sm text-brand-charcoal whitespace-nowrap">{formatMoney(r.amount, cur)}</td>
                        <td className="font-mono text-xs text-subtle whitespace-nowrap">
                          {formatMoney(r.fee_portion, cur)} / {formatMoney(r.principal_portion, cur)}
                        </td>
                        <td className="text-sm text-subtle">{humanize(r.source)}</td>
                        <td className="font-mono text-xs text-subtle">{r.reference || "—"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Items */}
          <section className="bg-white rounded-lg border border-light-gray overflow-hidden">
            <div className="p-6 border-b border-light-gray flex items-center justify-between">
              <h3 className="text-base font-semibold text-brand-charcoal">Financed items</h3>
              <span className="text-xs text-faint">
                {invoice.items.length} {invoice.items.length === 1 ? "item" : "items"}
              </span>
            </div>
            <div className="admin-table-container">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Order</th>
                    <th>Unit price</th>
                    <th>Qty</th>
                    <th className="text-right">Line total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.length === 0 ? (
                    <EmptyTableRow
                      colSpan={5}
                      size="sm"
                      illustration="invoices"
                      title="No items on this invoice"
                      description="Financed products will appear here once they're on the invoice."
                    />
                  ) : (
                    invoice.items.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="flex flex-col">
                            <span className="text-sm text-brand-charcoal">{item.product_name}</span>
                            {item.unit && <span className="text-[11px] text-faint">{item.unit}</span>}
                          </div>
                        </td>
                        <td className="font-mono text-xs whitespace-nowrap">
                          {item.order_id && item.order_number ? (
                            <Link href={`/admin/orders/${item.order_id}`} className="brand-link">
                              {item.order_number}
                            </Link>
                          ) : (
                            item.order_number || "—"
                          )}
                        </td>
                        <td className="font-mono text-sm text-subtle whitespace-nowrap">{formatMoney(item.unit_price, cur)}</td>
                        <td className="text-sm text-subtle">{item.quantity}</td>
                        <td className="font-mono text-sm text-brand-charcoal text-right whitespace-nowrap">
                          {formatMoney(item.line_total, cur)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-8">
          <Card title="Terms">
            <div className="flex flex-col gap-3">
              <InfoRow label="Principal" value={formatMoney(invoice.principal, cur)} />
              <InfoRow label="Delivery fee" value={formatMoney(invoice.delivery_fee, cur)} />
              <InfoRow
                label="Financing fee"
                value={`${formatMoney(invoice.fee_amount, cur)} (${(invoice.fee_rate * 100).toLocaleString(undefined, { maximumFractionDigits: 2 })}%)`}
              />
              <InfoRow label="VAT" value={formatMoney(invoice.vat_amount, cur)} />
              <InfoRow label="Total payable" value={formatMoney(invoice.total_payable, cur)} />
              <div className="h-px bg-light-gray" />
              <InfoRow label="Tenor" value={`${invoice.tenor_days} days`} />
              <InfoRow label="Approved" value={formatDateTime(invoice.approved_at)} />
              <InfoRow label="Due" value={formatDate(invoice.due_date)} />
              <InfoRow label="Paid in full" value={formatDateTime(invoice.paid_at)} />
            </div>
          </Card>

          <Card title="Retailer">
            <div className="flex flex-col gap-3">
              <InfoRow label="Business" value={retailer?.business_name} />
              <InfoRow label="Contact" value={retailer?.name} />
              <InfoRow label="Email" value={retailer?.email} />
              <InfoRow label="Phone" value={retailer?.phone} />
            </div>
          </Card>

          <Card title="Orders">
            <div className="flex flex-col gap-3">
              <InfoRow label="Group order" value={invoice.central_order_number} />
              <InfoRow
                label={invoice.order_numbers.length === 1 ? "Order" : "Orders"}
                value={invoice.order_numbers.length ? invoice.order_numbers.join(", ") : null}
              />
            </div>
          </Card>
        </div>
      </div>

      <RecordRepaymentModal invoice={invoice} open={isRepayOpen} onClose={() => setIsRepayOpen(false)} />
    </div>
  );
}
