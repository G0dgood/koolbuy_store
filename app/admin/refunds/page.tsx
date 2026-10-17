"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  HiOutlineCheck,
  HiOutlineXMark,
  HiOutlinePlus,
} from "react-icons/hi2";
import { StatCard } from "@/app/components/Admin/StatCard";
import { TabFilter } from "@/app/components/Admin/TabFilter";
import { Pagination } from "@/app/components/Admin/Pagination";
import { RowsPerPage } from "@/app/components/rows-per-page";
import { Button } from "@/app/components/Button";
import { EmptyTableRow } from "@/app/components/EmptyState";
import { Modal, ModalBody } from "@/app/components/Modal";
import {
  useGetAdminRefundsQuery,
  useCreateAdminRefundMutation,
  useApproveAdminRefundMutation,
  useRejectAdminRefundMutation,
  apiErrorMessage,
  formatMoney,
  formatDate,
  humanize,
  type AdminRefund,
  type RefundStatus,
} from "@/lib/store";

/* Buyer refunds. Rows come from GET /admin/refunds/; approving one calls the
   Paystack Refund API on the backend. Refunds are raised automatically when an
   admin cancels a paid order, or manually with "New refund". */

type TabKey = RefundStatus | "all";

const TAB_DEFS: { key: TabKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "requested", label: "Requested" },
  { key: "approved", label: "Approved" },
  { key: "processing", label: "Processing" },
  { key: "processed", label: "Processed" },
  { key: "rejected", label: "Rejected" },
  { key: "failed", label: "Failed" },
];

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
const MIN_REASON = 5;

type Tone = "success" | "warning" | "error" | "neutral";

const TONE_CLASSES: Record<Tone, string> = {
  success: "bg-success-soft text-success",
  warning: "bg-warning/10 text-warning",
  error: "bg-error-soft text-error",
  neutral: "bg-off-white text-subtle",
};

function statusTone(status: string): Tone {
  switch (status) {
    case "processed":
      return "success";
    case "requested":
    case "approved":
    case "processing":
      return "warning";
    case "failed":
    case "rejected":
      return "error";
    default:
      return "neutral";
  }
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold whitespace-nowrap ${TONE_CLASSES[statusTone(status)]}`}
    >
      {humanize(status)}
    </span>
  );
}

function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return `${formatDate(iso)}, ${d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;
}

function requesterLabel(requestedBy: string | null | undefined): string {
  if (!requestedBy) return "—";
  return requestedBy === "system" ? "System" : requestedBy;
}

const inputClass =
  "w-full h-10 px-3 rounded-lg border border-light-gray text-xs focus:outline-none focus:border-brand-orange bg-white";
const textareaClass =
  "w-full min-h-20 px-3 py-2 rounded-lg border border-light-gray text-xs focus:outline-none focus:border-brand-orange bg-white resize-y";

export default function RefundsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const [selectedRefund, setSelectedRefund] = useState<AdminRefund | null>(null);
  const [pendingAction, setPendingAction] = useState<{
    refund: AdminRefund;
    action: "approve" | "reject";
  } | null>(null);
  const [actionText, setActionText] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createTarget, setCreateTarget] = useState<"order" | "payment">("order");
  const [createRef, setCreateRef] = useState("");
  const [createAmount, setCreateAmount] = useState("");
  const [createReason, setCreateReason] = useState("");
  const [createErrors, setCreateErrors] = useState<Record<string, string>>({});

  const { data, isLoading, isFetching, isError, error, refetch } = useGetAdminRefundsQuery({
    status: activeTab,
    page: currentPage,
    page_size: rowsPerPage,
  });
  const [createRefund, { isLoading: isCreating }] = useCreateAdminRefundMutation();
  const [approveRefund, { isLoading: isApproving }] = useApproveAdminRefundMutation();
  const [rejectRefund, { isLoading: isRejecting }] = useRejectAdminRefundMutation();
  const isMutating = isApproving || isRejecting;

  const refunds = data?.items ?? [];
  const counts = data?.counts;
  const total = data?.pagination.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));
  const count = (key: TabKey) => counts?.[key] ?? 0;

  // "Approved" is a short-lived state between the decision and Paystack's
  // answer, so its tab only appears when something is sitting there.
  const visibleTabs = TAB_DEFS.filter((t) => t.key !== "approved" || count("approved") > 0 || activeTab === "approved");
  const tabLabel = (t: { key: TabKey; label: string }) => (counts ? `${t.label} (${count(t.key)})` : t.label);
  const activeDef = TAB_DEFS.find((t) => t.key === activeTab) ?? TAB_DEFS[0];

  /* ── Approve / reject ── */

  const openAction = (refund: AdminRefund, action: "approve" | "reject") => {
    setPendingAction({ refund, action });
    setActionText("");
    setActionError(null);
  };

  const closeAction = () => {
    if (isMutating) return;
    setPendingAction(null);
  };

  const handleConfirmAction = async () => {
    if (!pendingAction) return;
    const { refund, action } = pendingAction;
    const text = actionText.trim();
    const label = refund.order?.order_number ? `order ${refund.order.order_number}` : "this payment";

    if (action === "reject") {
      if (text.length < MIN_REASON) {
        setActionError(`Give a reason (at least ${MIN_REASON} characters).`);
        return;
      }
      try {
        await rejectRefund({ refundId: refund.id, reason: text }).unwrap();
        toast.success(`Refund for ${label} rejected.`);
        setPendingAction(null);
        setSelectedRefund(null);
      } catch (e) {
        toast.error(apiErrorMessage(e, "Couldn't reject the refund."));
      }
      return;
    }

    try {
      const res = await approveRefund({ refundId: refund.id, note: text || undefined }).unwrap();
      const status = res.refund?.status;
      if (status === "failed") {
        toast.error(
          `Paystack refused the refund for ${label}${res.refund?.failure_reason ? `: ${res.refund.failure_reason}` : "."}`,
        );
      } else {
        toast.success(
          status === "processed"
            ? `Refund of ${formatMoney(refund.amount, refund.currency)} for ${label} processed.`
            : `Refund for ${label} approved and sent to Paystack.`,
        );
      }
      setPendingAction(null);
      setSelectedRefund(null);
    } catch (e) {
      toast.error(apiErrorMessage(e, "Couldn't approve the refund."));
    }
  };

  /* ── New refund ── */

  const openCreate = () => {
    setCreateTarget("order");
    setCreateRef("");
    setCreateAmount("");
    setCreateReason("");
    setCreateErrors({});
    setIsCreateOpen(true);
  };

  const handleCreate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const ref = createRef.trim();
    const reason = createReason.trim();
    const amount = Number(createAmount);
    const errors: Record<string, string> = {};
    if (!ref) {
      errors.ref = createTarget === "order" ? "Enter the order number or order ID." : "Enter the payment ID.";
    }
    if (!createAmount.trim() || !Number.isFinite(amount) || amount <= 0) {
      errors.amount = "Enter an amount greater than zero.";
    } else if (Math.round(amount * 100) !== amount * 100) {
      errors.amount = "Use at most two decimal places.";
    }
    if (reason.length < MIN_REASON) errors.reason = `Give a reason (at least ${MIN_REASON} characters).`;
    setCreateErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      await createRefund({
        ...(createTarget === "order" ? { order_id: ref } : { payment_id: ref }),
        amount,
        reason,
      }).unwrap();
      toast.success("Refund requested. Approve it to send the money back to the buyer.");
      setIsCreateOpen(false);
    } catch (err) {
      toast.error(apiErrorMessage(err, "Couldn't create the refund."));
    }
  };

  const changeTab = (label: string) => {
    const def = visibleTabs.find((t) => tabLabel(t) === label);
    if (!def) return;
    setActiveTab(def.key);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-semibold text-brand-charcoal">Refunds</h1>
          <p className="text-xs text-subtle mt-0.5">
            Review buyer refunds and send approved ones back through Paystack.
          </p>
        </div>
        <Button variant="accent" size="md" iconLeft={<HiOutlinePlus size={16} />} onClick={openCreate}>
          New refund
        </Button>
      </div>

      {/* Counts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          size="sm"
          title="Requested"
          value={counts ? count("requested") : "—"}
          subtitle="Awaiting a decision"
        />
        <StatCard
          size="sm"
          title="Processing"
          value={counts ? count("approved") + count("processing") : "—"}
          subtitle="Approved, waiting on Paystack"
        />
        <StatCard
          size="sm"
          title="Processed"
          value={counts ? count("processed") : "—"}
          subtitle="Money returned to the buyer"
        />
        <StatCard
          size="sm"
          title="Rejected / Failed"
          value={counts ? count("rejected") + count("failed") : "—"}
          subtitle={counts ? `${count("rejected")} rejected, ${count("failed")} failed` : "Not refunded"}
        />
      </div>

      {/* Table card */}
      <div className="bg-white border border-light-gray rounded-lg flex flex-col overflow-hidden">
        <div className="p-4 border-b border-light-gray flex flex-col md:flex-row md:items-center justify-between gap-4">
          <TabFilter tabs={visibleTabs.map(tabLabel)} activeTab={tabLabel(activeDef)} onChange={changeTab} />
          {isFetching && !isLoading && <span className="text-[11px] text-faint">Refreshing…</span>}
        </div>

        <div className="admin-table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Order #</th>
                <th>Buyer</th>
                <th>Amount</th>
                <th>Reason</th>
                <th>Requested by</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} aria-hidden="true">
                    {Array.from({ length: 8 }).map((__, j) => (
                      <td key={j}>
                        <div className="h-3 rounded bg-off-white animate-pulse" style={{ width: `${50 + ((i + j) % 4) * 12}%` }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <p className="text-xs font-semibold text-error">
                        {apiErrorMessage(error, "Couldn't load refunds.")}
                      </p>
                      <Button variant="outline" size="sm" onClick={() => refetch()}>
                        Try again
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : refunds.length === 0 ? (
                activeTab === "all" ? (
                  <EmptyTableRow
                    colSpan={8}
                    illustration="refunds"
                    title="No refunds yet"
                    description="Refunds will appear here when a paid order is cancelled or you raise one."
                    action={{ label: "New refund", onClick: openCreate }}
                  />
                ) : (
                  <EmptyTableRow
                    colSpan={8}
                    illustration="refunds"
                    title={`No ${activeDef.label.toLowerCase()} refunds`}
                    description="Refunds with this status will appear here."
                    action={{
                      label: "Show all refunds",
                      onClick: () => {
                        setActiveTab("all");
                        setCurrentPage(1);
                      },
                    }}
                  />
                )
              ) : (
                refunds.map((refund) => (
                  <tr
                    key={refund.id}
                    onClick={() => setSelectedRefund(refund)}
                    className="cursor-pointer hover:bg-off-white transition-colors"
                  >
                    <td className="text-xs text-subtle whitespace-nowrap">{formatDateTime(refund.created_at)}</td>
                    <td className="text-xs whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      {refund.order ? (
                        <Link
                          href={`/admin/orders/${refund.order.id}`}
                          className="font-semibold text-brand-orange-text hover:underline"
                        >
                          {refund.order.order_number}
                        </Link>
                      ) : (
                        <span className="text-faint">—</span>
                      )}
                    </td>
                    <td>
                      {refund.buyer ? (
                        <div className="flex flex-col">
                          <span className="font-semibold text-xs text-brand-charcoal whitespace-nowrap">
                            {refund.buyer.name || "—"}
                          </span>
                          <span className="text-[11px] text-faint">{refund.buyer.email}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-faint">—</span>
                      )}
                    </td>
                    <td className="font-semibold text-xs text-brand-charcoal whitespace-nowrap tabular-nums">
                      {formatMoney(refund.amount, refund.currency)}
                    </td>
                    <td className="text-xs text-subtle max-w-56">
                      <span className="line-clamp-2" title={refund.reason}>
                        {refund.reason || "—"}
                      </span>
                    </td>
                    <td className="text-xs text-subtle whitespace-nowrap">{requesterLabel(refund.requested_by)}</td>
                    <td>
                      <StatusBadge status={refund.status} />
                    </td>
                    <td className="text-right whitespace-nowrap">
                      {refund.status === "requested" ? (
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <Button
                            size="sm"
                            variant="primary"
                            iconLeft={<HiOutlineCheck size={14} />}
                            disabled={isMutating}
                            onClick={() => openAction(refund, "approve")}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="rose"
                            iconLeft={<HiOutlineXMark size={14} />}
                            disabled={isMutating}
                            onClick={() => openAction(refund, "reject")}
                          >
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-faint">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="admin-pagination-footer">
          <div className="flex items-center gap-4">
            <RowsPerPage
              value={rowsPerPage}
              options={PAGE_SIZE_OPTIONS}
              onChange={(val) => {
                setRowsPerPage(val);
                setCurrentPage(1);
              }}
            />
            <p className="text-xs text-faint">
              Showing{" "}
              <span className="font-semibold text-brand-charcoal">
                {total === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-brand-charcoal">{Math.min(currentPage * rowsPerPage, total)}</span>{" "}
              of <span className="font-semibold text-brand-charcoal">{total}</span>
            </p>
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>

      {/* Details */}
      <Modal isOpen={!!selectedRefund} onClose={() => setSelectedRefund(null)} title="Refund details">
        {selectedRefund && (
          <ModalBody className="!p-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3 border-b border-light-gray pb-3">
                <div>
                  <p className="text-lg font-semibold text-brand-charcoal tabular-nums">
                    {formatMoney(selectedRefund.amount, selectedRefund.currency)}
                  </p>
                  <p className="text-xs text-faint">Requested {formatDateTime(selectedRefund.created_at)}</p>
                </div>
                <StatusBadge status={selectedRefund.status} />
              </div>

              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <DetailItem label="Order">
                  {selectedRefund.order ? (
                    <Link
                      href={`/admin/orders/${selectedRefund.order.id}`}
                      className="font-semibold text-brand-orange-text hover:underline"
                    >
                      {selectedRefund.order.order_number}
                    </Link>
                  ) : (
                    "—"
                  )}
                </DetailItem>
                <DetailItem label="Buyer">
                  {selectedRefund.buyer ? (
                    <>
                      <span className="block">{selectedRefund.buyer.name || "—"}</span>
                      <span className="block text-[11px] font-normal text-faint">{selectedRefund.buyer.email}</span>
                    </>
                  ) : (
                    "—"
                  )}
                </DetailItem>
                <DetailItem label="Payment reference" mono>
                  {selectedRefund.payment?.reference || "—"}
                </DetailItem>
                <DetailItem label="Paystack refund ID" mono>
                  {selectedRefund.gateway_refund_id || "—"}
                </DetailItem>
                <DetailItem label="Requested by">{requesterLabel(selectedRefund.requested_by)}</DetailItem>
                <DetailItem label="Decided by">{selectedRefund.decided_by || "—"}</DetailItem>
                <DetailItem label="Decided at">{formatDateTime(selectedRefund.decided_at)}</DetailItem>
                <DetailItem label="Processed at">{formatDateTime(selectedRefund.processed_at)}</DetailItem>
                <DetailItem label="Reason" wide>
                  <span className="font-normal whitespace-pre-wrap">{selectedRefund.reason || "—"}</span>
                </DetailItem>
                {selectedRefund.decision_note && (
                  <DetailItem label="Decision note" wide>
                    <span className="font-normal whitespace-pre-wrap">{selectedRefund.decision_note}</span>
                  </DetailItem>
                )}
                {selectedRefund.failure_reason && (
                  <DetailItem label="Failure reason" wide tone="error">
                    <span className="font-normal whitespace-pre-wrap">{selectedRefund.failure_reason}</span>
                  </DetailItem>
                )}
              </dl>

              <div className="flex justify-end gap-2 pt-2">
                <Button size="sm" variant="outline" onClick={() => setSelectedRefund(null)}>
                  Close
                </Button>
                {selectedRefund.status === "requested" && (
                  <>
                    <Button
                      size="sm"
                      variant="rose"
                      disabled={isMutating}
                      onClick={() => openAction(selectedRefund, "reject")}
                    >
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      disabled={isMutating}
                      onClick={() => openAction(selectedRefund, "approve")}
                    >
                      Approve refund
                    </Button>
                  </>
                )}
              </div>
            </div>
          </ModalBody>
        )}
      </Modal>

      {/* Approve / reject confirmation */}
      <Modal isOpen={!!pendingAction} onClose={closeAction} size="sm">
        {pendingAction && (
          <ModalBody className="!p-0">
            <div className="space-y-4 text-center">
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto ${
                  pendingAction.action === "approve"
                    ? "bg-brand-orange-soft text-brand-orange-text"
                    : "bg-error-soft text-error"
                }`}
              >
                {pendingAction.action === "approve" ? <HiOutlineCheck size={24} /> : <HiOutlineXMark size={24} />}
              </div>

              <div>
                <h3 className="font-semibold text-brand-charcoal text-base">
                  {pendingAction.action === "approve" ? "Approve this refund?" : "Reject this refund?"}
                </h3>
                <p className="text-xs text-subtle mt-1">
                  {pendingAction.action === "approve"
                    ? `This sends ${formatMoney(pendingAction.refund.amount, pendingAction.refund.currency)} back to ${
                        pendingAction.refund.buyer?.name || "the buyer"
                      } through Paystack. It can't be undone.`
                    : `The buyer won't be refunded ${formatMoney(
                        pendingAction.refund.amount,
                        pendingAction.refund.currency,
                      )}${pendingAction.refund.order ? ` for order ${pendingAction.refund.order.order_number}` : ""}.`}
                </p>
              </div>

              <div className="text-left flex flex-col gap-1.5">
                <label htmlFor="refund-action-text" className="text-xs font-semibold text-brand-charcoal">
                  {pendingAction.action === "approve" ? "Note (optional)" : "Reason *"}
                </label>
                <textarea
                  id="refund-action-text"
                  value={actionText}
                  maxLength={2000}
                  onChange={(e) => {
                    setActionText(e.target.value);
                    if (actionError) setActionError(null);
                  }}
                  placeholder={
                    pendingAction.action === "approve"
                      ? "Anything the team should know"
                      : "Why is this refund being rejected?"
                  }
                  className={`${textareaClass} ${actionError ? "border-error" : ""}`}
                  aria-invalid={!!actionError}
                />
                {actionError && <p className="text-[11px] text-error">{actionError}</p>}
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <Button variant="outline" size="sm" onClick={closeAction} disabled={isMutating}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant={pendingAction.action === "approve" ? "primary" : "danger"}
                  onClick={handleConfirmAction}
                  disabled={isMutating}
                >
                  {pendingAction.action === "approve"
                    ? isApproving
                      ? "Approving…"
                      : "Approve and refund"
                    : isRejecting
                      ? "Rejecting…"
                      : "Reject refund"}
                </Button>
              </div>
            </div>
          </ModalBody>
        )}
      </Modal>

      {/* New refund */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => !isCreating && setIsCreateOpen(false)}
        title="New refund"
        footer={
          <div className="flex justify-end gap-3 w-full">
            <Button variant="outline" size="md" onClick={() => setIsCreateOpen(false)} disabled={isCreating}>
              Cancel
            </Button>
            <Button variant="accent" size="md" onClick={() => handleCreate()} disabled={isCreating}>
              {isCreating ? "Creating…" : "Create refund"}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleCreate} className="flex flex-col gap-4" noValidate>
          <p className="text-xs text-subtle">
            This records a refund request. Nothing is paid until someone approves it.
          </p>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-brand-charcoal">Refund against</span>
            <TabFilter
              tabs={["Order", "Payment"]}
              activeTab={createTarget === "order" ? "Order" : "Payment"}
              onChange={(t) => {
                setCreateTarget(t === "Order" ? "order" : "payment");
                setCreateErrors((prev) => ({ ...prev, ref: "" }));
              }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="refund-ref" className="text-xs font-semibold text-brand-charcoal">
              {createTarget === "order" ? "Order number or order ID *" : "Payment ID *"}
            </label>
            <input
              id="refund-ref"
              type="text"
              value={createRef}
              onChange={(e) => setCreateRef(e.target.value)}
              placeholder={createTarget === "order" ? "e.g. KB-10234 or the order UUID" : "Payment UUID"}
              className={`${inputClass} ${createErrors.ref ? "border-error" : ""}`}
              aria-invalid={!!createErrors.ref}
            />
            {createErrors.ref ? (
              <p className="text-[11px] text-error">{createErrors.ref}</p>
            ) : (
              <p className="text-[11px] text-faint">
                {createTarget === "order"
                  ? "The order must have a payment on record."
                  : "The payment's ID, not its Paystack reference."}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="refund-amount" className="text-xs font-semibold text-brand-charcoal">
              Amount (₦) *
            </label>
            <input
              id="refund-amount"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={createAmount}
              onChange={(e) => setCreateAmount(e.target.value)}
              placeholder="0.00"
              className={`${inputClass} ${createErrors.amount ? "border-error" : ""}`}
              aria-invalid={!!createErrors.amount}
            />
            {createErrors.amount && <p className="text-[11px] text-error">{createErrors.amount}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="refund-reason" className="text-xs font-semibold text-brand-charcoal">
              Reason *
            </label>
            <textarea
              id="refund-reason"
              value={createReason}
              maxLength={2000}
              onChange={(e) => setCreateReason(e.target.value)}
              placeholder="e.g. Item out of stock after payment"
              className={`${textareaClass} ${createErrors.reason ? "border-error" : ""}`}
              aria-invalid={!!createErrors.reason}
            />
            {createErrors.reason && <p className="text-[11px] text-error">{createErrors.reason}</p>}
          </div>
        </form>
      </Modal>
    </div>
  );
}

function DetailItem({
  label,
  children,
  wide,
  mono,
  tone,
}: {
  label: string;
  children: React.ReactNode;
  wide?: boolean;
  mono?: boolean;
  tone?: "error";
}) {
  return (
    <div
      className={`p-3 rounded-lg border ${
        tone === "error" ? "bg-error-soft border-error/20" : "bg-off-white border-light-gray"
      } ${wide ? "sm:col-span-2" : ""}`}
    >
      <dt className="text-faint">{label}</dt>
      <dd
        className={`mt-0.5 font-semibold break-words ${tone === "error" ? "text-error" : "text-brand-charcoal"} ${
          mono ? "font-mono" : ""
        }`}
      >
        {children}
      </dd>
    </div>
  );
}
