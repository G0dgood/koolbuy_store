"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Breadcrumbs } from "@/app/components/Breadcrumbs";
import { Button } from "@/app/components/Button";
import { EmptyState, EmptyTableRow } from "@/app/components/EmptyState";
import { Textarea } from "@/app/components/Form/Inputs";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";
import { StatusBadge, statusLabel } from "@/app/components/Admin/Orders/StatusBadge";
import {
  apiErrorMessage,
  formatDate,
  formatMoney,
  humanize,
  useCancelAdminOrderMutation,
  useGetAdminOrderQuery,
  type AdminOrderDetail,
} from "@/lib/store";

/** Statuses the backend refuses to cancel (409) */
const NOT_CANCELLABLE = ["cancelled", "delivered", "expired", "refund_due", "pending_credit_review"];

interface OrderIssue {
  id: string;
  status: string;
  issue_type: string;
  item: { id: string; name: string };
  requested_qty: number | null;
  available_qty: number | null;
  note: string | null;
  resolution_note: string | null;
  created_at: string;
}

interface OrderFulfillment {
  type: string | null;
  driver_name: string | null;
  driver_phone: string | null;
  vehicle_type: string | null;
  eta_minutes: number | null;
  ready_at: string | null;
  dispatched_at: string | null;
}

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
      <span className="text-gray-900 text-right break-words">{value || "—"}</span>
    </div>
  );
}

function Card({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="bg-white rounded-lg border border-light-gray p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-8 pb-12 animate-pulse" aria-busy>
      <div className="h-4 w-48 rounded bg-off-white" />
      <div className="h-8 w-72 rounded bg-off-white" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 h-80 rounded-lg bg-white border border-light-gray" />
        <div className="h-80 rounded-lg bg-white border border-light-gray" />
      </div>
    </div>
  );
}

export default function OrderDetails() {
  const params = useParams<{ id: string }>();
  const orderId = typeof params.id === "string" ? decodeURIComponent(params.id) : "";

  const { data, isLoading, error, refetch } = useGetAdminOrderQuery(orderId, { skip: !orderId });
  const [cancelOrder, { isLoading: isCancelling }] = useCancelAdminOrderMutation();
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  if (isLoading) return <DetailSkeleton />;

  const order: AdminOrderDetail | undefined = data?.order;
  if (!order) {
    const notFound = !!error && typeof error === "object" && "status" in error && error.status === 404;
    return (
      <div className="flex flex-col gap-6 pb-12">
        <Breadcrumbs items={[{ label: "Orders", href: "/admin/orders" }, { label: orderId || "Order" }]} />
        {notFound ? (
          <EmptyState
            variant="card"
            illustration="search"
            title="Order not found"
            description={`No order matches "${orderId}". It may have been removed, or the link is wrong.`}
            action={{ label: "Back to orders", href: "/admin/orders" }}
          />
        ) : (
          <div className="bg-white rounded-lg border border-light-gray p-10 flex flex-col items-center gap-3 text-center">
            <p className="text-base font-semibold text-gray-900">Couldn&apos;t load this order</p>
            <p className="text-xs text-subtle max-w-sm">
              {apiErrorMessage(error, "Something went wrong loading the order.")}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={refetch}>
                Try again
              </Button>
              <Link href="/admin/orders" className="brand-link text-xs self-center">
                Back to orders
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  const issues = (Array.isArray(order.issues) ? order.issues : []) as OrderIssue[];
  const fulfillment = (order.fulfillment ?? null) as OrderFulfillment | null;
  const itemsSubtotal = order.items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);
  const canCancel = !NOT_CANCELLABLE.includes(order.status);

  const handleCancel = async () => {
    try {
      const res = await cancelOrder({ orderId: order.id, reason: cancelReason.trim() || undefined }).unwrap();
      toast.success(
        res.refund_due
          ? `Order ${order.order_number} cancelled. The buyer has paid, so a refund is now due.`
          : `Order ${order.order_number} cancelled.`,
      );
      setIsCancelOpen(false);
      setCancelReason("");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Couldn't cancel the order."));
    }
  };

  return (
    <div className="flex flex-col gap-8 mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Breadcrumbs items={[{ label: "Orders", href: "/admin/orders" }, { label: order.order_number }]} />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-mono text-2xl font-semibold text-gray-900 tracking-tight">{order.order_number}</h1>
            <StatusBadge status={order.status} />
            {order.on_hold && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-error-soft text-error">On hold</span>
            )}
          </div>
          {canCancel && (
            <Button variant="danger" size="md" onClick={() => setIsCancelOpen(true)}>
              Cancel order
            </Button>
          )}
        </div>
        <p className="text-xs text-faint">Placed {formatDateTime(order.created_at)}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <section className="bg-white rounded-lg border border-light-gray overflow-hidden">
            <div className="p-6 border-b border-light-gray flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">Items</h3>
              <span className="text-xs text-faint">
                {order.items.length} {order.items.length === 1 ? "item" : "items"}
              </span>
            </div>
            <div className="admin-table-container">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Unit price</th>
                    <th>Vendor price</th>
                    <th>Qty</th>
                    <th className="text-right">Line total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.length === 0 ? (
                    <EmptyTableRow
                      colSpan={5}
                      size="sm"
                      illustration="orders"
                      title="No items on this order"
                      description="Products will appear here once they're added to the order."
                    />
                  ) : (
                    order.items.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-900">{item.product_name}</span>
                            {item.unit && <span className="text-[11px] text-faint">{item.unit}</span>}
                          </div>
                        </td>
                        <td className="font-mono text-sm text-gray-700 whitespace-nowrap">{formatMoney(item.unit_price)}</td>
                        <td className="font-mono text-sm text-subtle whitespace-nowrap">
                          {item.vendor_unit_price != null ? formatMoney(item.vendor_unit_price) : "—"}
                          {item.markup_percent ? (
                            <span className="block text-[11px] text-faint">+{item.markup_percent}% markup</span>
                          ) : null}
                        </td>
                        <td className="text-sm text-gray-700">{item.quantity}</td>
                        <td className="font-mono text-sm text-gray-900 text-right whitespace-nowrap">
                          {formatMoney(item.unit_price * item.quantity)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-off-white/50 flex justify-end">
              <div className="w-64 flex flex-col gap-3">
                <div className="flex justify-between text-sm text-subtle">
                  <span>Items subtotal</span>
                  <span className="font-mono">{formatMoney(itemsSubtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-subtle">
                  <span>Delivery fee</span>
                  <span className="font-mono">{formatMoney(order.delivery_fee ?? 0)}</span>
                </div>
                <div className="h-px bg-light-gray" />
                <div className="flex justify-between text-base font-semibold text-gray-900">
                  <span>Order total</span>
                  <span className="font-mono">{formatMoney(order.total_amount)}</span>
                </div>
              </div>
            </div>
          </section>

          {issues.length > 0 && (
            <Card title="Item issues">
              <ul className="flex flex-col divide-y divide-light-gray">
                {issues.map((issue) => (
                  <li key={issue.id} className="py-3 first:pt-0 last:pb-0 flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-gray-900">
                        {issue.item?.name ?? "Item"} · {humanize(issue.issue_type)}
                      </span>
                      <StatusBadge status={issue.status} />
                    </div>
                    {(issue.requested_qty != null || issue.available_qty != null) && (
                      <span className="text-xs text-subtle">
                        Requested {issue.requested_qty ?? "—"}, available {issue.available_qty ?? "—"}
                      </span>
                    )}
                    {issue.note && <span className="text-xs text-subtle">{issue.note}</span>}
                    {issue.resolution_note && <span className="text-xs text-faint">Resolution: {issue.resolution_note}</span>}
                    <span className="text-[11px] text-faint">{formatDateTime(issue.created_at)}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-8">
          <Card title="Order">
            <div className="flex flex-col gap-3">
              <InfoRow label="Status" value={statusLabel(order.status)} />
              <InfoRow label="Order type" value={humanize(order.order_type)} />
              <InfoRow label="Payment method" value={humanize(order.payment_method)} />
              {order.payment_due_at && <InfoRow label="Payment due" value={formatDateTime(order.payment_due_at)} />}
              <InfoRow label="Procurement" value={humanize(order.procurement_status)} />
              {order.on_hold && <InfoRow label="Hold reason" value={order.hold_reason} />}
            </div>
          </Card>

          <Card title="Buyer">
            <div className="flex flex-col gap-3">
              <InfoRow label="Name" value={order.buyer_name} />
              <InfoRow label="Email" value={order.buyer_email} />
              <InfoRow label="Phone" value={order.buyer_phone} />
            </div>
          </Card>

          <Card title="Seller">
            <div className="flex flex-col gap-3">
              <InfoRow label="Name" value={order.seller_name} />
              <InfoRow label="Phone" value={order.seller_phone} />
            </div>
          </Card>

          <Card title="Delivery">
            <div className="flex flex-col gap-3">
              <InfoRow label="Address" value={order.delivery_address} />
              {fulfillment ? (
                <>
                  <InfoRow label="Fulfilment" value={humanize(fulfillment.type)} />
                  <InfoRow label="Driver" value={fulfillment.driver_name} />
                  <InfoRow label="Driver phone" value={fulfillment.driver_phone} />
                  <InfoRow label="Vehicle" value={humanize(fulfillment.vehicle_type)} />
                  {fulfillment.eta_minutes != null && <InfoRow label="ETA" value={`${fulfillment.eta_minutes} min`} />}
                  <InfoRow label="Ready" value={formatDateTime(fulfillment.ready_at)} />
                  <InfoRow label="Dispatched" value={formatDateTime(fulfillment.dispatched_at)} />
                </>
              ) : (
                <EmptyState
                  size="sm"
                  illustration="delivery"
                  title="No fulfilment yet"
                  description="Driver and dispatch details will appear here once fulfilment is assigned."
                />
              )}
            </div>
          </Card>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isCancelOpen}
        onClose={() => {
          setIsCancelOpen(false);
          setCancelReason("");
        }}
        onConfirm={handleCancel}
        isLoading={isCancelling}
        title={`Cancel order ${order.order_number}?`}
        message={
          <div className="flex flex-col gap-3">
            <p>
              The order is cancelled and its reserved stock released. If the buyer has already paid, a refund request
              is opened for Finance. This can&apos;t be undone.
            </p>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-gray-700">Reason (optional)</span>
              <Textarea
                rows={3}
                maxLength={500}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Buyer asked to cancel"
                className="text-xs"
              />
            </label>
          </div>
        }
        confirmText="Yes, cancel order"
        cancelText="Keep order"
        type="danger"
      />
    </div>
  );
}
