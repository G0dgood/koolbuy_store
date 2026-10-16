/**
 * Accounting RTK Query endpoints for the KoolBuy admin.
 *
 * Connects to the KoolConnect backend finance routes:
 * - /admin/transactions/  (orders_payment rows: one payment per order)
 * - /admin/orders/        (orders_order: same table the storefront writes to)
 * - /admin/financing/     (BNPL: financing invoices, repayments, dashboard)
 *
 * Money values are numbers (2dp) in the row's currency. Totals are grouped per
 * currency by the backend and must never be summed across currencies.
 */
import { baseApi } from "../base-api";

export interface Pagination {
  total: number;
  page: number;
  page_size: number;
  has_next: boolean;
  has_prev: boolean;
}

/* ───────────────────────── Transactions ───────────────────────── */

export type TransactionStatus = "initiated" | "pending" | "paid" | "failed" | "amount_mismatch";
export type TransactionPurpose =
  | "order_purchase"
  | "financing_repayment"
  | "financing_fee"
  | "freezer_contribution"
  | "logistics_charge"
  | "account_deposit"
  | "refund";

export interface AdminTransaction {
  id: string;
  reference: string;
  purpose: TransactionPurpose | string;
  status: TransactionStatus | string;
  source: "paystack" | "dedicated_account" | "manual" | string;
  channel: string;
  method: string;
  amount: number;
  currency: string;
  /** Paystack fee, when known */
  fees: number | null;
  refunded_amount: number;
  buyer: { id: string; name: string; email: string } | null;
  order: { id: string; order_number: string; status: string } | null;
  mismatch: Record<string, unknown> | null;
  created_at: string;
  paid_at: string | null;
}

export interface AdminTransactionsResponse {
  success: boolean;
  items: AdminTransaction[];
  pagination: Pagination;
}

export interface AdminTransactionsParams {
  status?: TransactionStatus | "all" | string;
  purpose?: TransactionPurpose | string;
  source?: string;
  q?: string;
  /** YYYY-MM-DD, applied to created_at */
  from?: string;
  to?: string;
  page?: number;
  page_size?: number;
}

export interface TransactionsSummaryRow {
  currency: string;
  paid_total: number;
  paid_count: number;
  /** initiated + pending */
  pending_count: number;
  failed_count: number;
  mismatch_count: number;
  refunded_total: number;
  fees_total: number;
}

export interface TransactionsSummaryResponse {
  success: boolean;
  by_currency: TransactionsSummaryRow[];
}

export interface AdminTransactionDetail extends AdminTransaction {
  metadata?: Record<string, unknown> | null;
  events: { id: string; event_type: string; status: string; amount_kobo: number | null; created_at: string }[];
  refunds: { id: string; status: string; amount: number; currency: string; reason: string; created_at: string }[];
  adjustments: { id: string; action: string; reason: string; actor_name: string | null; created_at: string }[];
}

/* ───────────────────────── Orders ───────────────────────── */

export interface AdminOrderListItem {
  id: string;
  order_number: string;
  buyer_name: string | null;
  seller_name: string | null;
  status: string;
  total_amount: number;
  created_at: string;
}

export interface AdminOrdersResponse {
  success: boolean;
  items: AdminOrderListItem[];
  pagination: Pagination;
}

export interface AdminOrdersParams {
  /** Exact order status, e.g. new, confirmed, delivered, cancelled */
  status?: string;
  /** Matches order_number */
  q?: string;
  page?: number;
  page_size?: number;
}

export interface AdminOrderDetail {
  id: string;
  order_number: string;
  buyer_name: string | null;
  buyer_email: string | null;
  buyer_phone: string | null;
  seller_name: string | null;
  seller_phone: string | null;
  status: string;
  delivery_address: string | null;
  total_amount: number;
  delivery_fee: number | null;
  created_at: string;
  items: {
    id: string;
    product_name: string;
    quantity: number;
    unit_price: number;
    vendor_unit_price?: number | null;
    markup_percent?: number | null;
    unit?: string | null;
  }[];
  order_type?: string | null;
  payment_method?: string | null;
  payment_due_at?: string | null;
  on_hold?: boolean;
  hold_reason?: string | null;
  procurement_status?: string | null;
  [key: string]: unknown;
}

/* ───────────────────────── BNPL / financing ───────────────────────── */

export type FinancingInvoiceStatus =
  | "pending_approval"
  | "unpaid"
  | "partially_paid"
  | "overdue"
  | "paid"
  | "declined"
  | "cancelled";

export interface FinancingInvoice {
  id: string;
  invoice_number: string;
  status: FinancingInvoiceStatus | string;
  payment_term: string;
  principal: number;
  subtotal: number;
  delivery_fee: number;
  /** Fraction, e.g. 0.02 = 2% */
  fee_rate: number;
  fee_amount: number;
  vat_amount: number;
  total_payable: number;
  amount_paid: number;
  balance: number;
  currency: string;
  tenor_days: number;
  issued_at: string | null;
  approved_at: string | null;
  due_date: string | null;
  paid_at: string | null;
  central_order_number: string | null;
  order_numbers: string[];
  application_id: string | null;
  application_status: string | null;
  retailer: { id: string; business_name: string | null; name: string | null; email: string | null; phone: string | null } | null;
}

export interface FinancingInvoicesResponse {
  success: boolean;
  items: FinancingInvoice[];
  pagination: Pagination;
}

export interface FinancingInvoicesParams {
  /** all | outstanding | active | pending | one of FinancingInvoiceStatus */
  status?: string;
  search?: string;
  from?: string;
  to?: string;
  page?: number;
  page_size?: number;
}

export interface FinancingRepayment {
  id: string;
  amount: number;
  source: string;
  reference: string;
  received_at: string;
  fee_portion: number;
  principal_portion: number;
}

/** Invoice detail: the invoice fields are flattened at the top level */
export interface FinancingInvoiceDetailResponse extends FinancingInvoice {
  success: boolean;
  items: {
    id: string;
    product_name: string;
    product_reference?: string | null;
    quantity: number;
    unit?: string | null;
    unit_price: number;
    line_total: number;
    order_number: string | null;
    order_id: string | null;
  }[];
  repayments: FinancingRepayment[];
}

export interface FinancingDashboardRow {
  currency: string;
  pending_count: number;
  needs_info_count: number;
  approved_count: number;
  declined_count: number;
  outstanding_total: number;
  overdue_count: number;
  overdue_total: number;
  due_next_7_days_count: number;
  due_next_7_days_total: number;
  paid_this_month_total: number;
}

export interface RecordRepaymentPayload {
  invoiceId: string;
  amount: number;
  source: "bank_transfer" | "cash" | "pos";
  reference: string;
  /** At least 5 characters */
  reason: string;
}

/* ───────────────────────── Helpers ───────────────────────── */

function toQuery(params: Record<string, string | number | boolean | undefined | null> | void): string {
  if (!params) return "";
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "" || value === "all") continue;
    qs.set(key, String(value));
  }
  const s = qs.toString();
  return s ? `?${s}` : "";
}

export const accountingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* Transactions */
    getAdminTransactions: builder.query<AdminTransactionsResponse, AdminTransactionsParams | void>({
      query: (params) => `/admin/transactions/${toQuery(params ? { ...params } : undefined)}`,
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map(({ id }) => ({ type: "Transaction" as const, id })),
              { type: "Transaction", id: "LIST" },
            ]
          : [{ type: "Transaction", id: "LIST" }],
    }),
    getTransactionsSummary: builder.query<TransactionsSummaryResponse, { from?: string; to?: string } | void>({
      query: (params) => `/admin/transactions/summary/${toQuery(params ? { ...params } : undefined)}`,
      providesTags: [{ type: "Transaction", id: "SUMMARY" }],
    }),
    getAdminTransaction: builder.query<{ success: boolean; transaction: AdminTransactionDetail }, string>({
      query: (id) => `/admin/transactions/${encodeURIComponent(id)}/`,
      providesTags: (_r, _e, id) => [{ type: "Transaction", id }],
    }),

    /* Orders */
    getAdminOrders: builder.query<AdminOrdersResponse, AdminOrdersParams | void>({
      query: (params) => `/admin/orders/${toQuery(params ? { ...params } : undefined)}`,
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map(({ id }) => ({ type: "Order" as const, id })),
              { type: "Order", id: "ADMIN_LIST" },
            ]
          : [{ type: "Order", id: "ADMIN_LIST" }],
    }),
    getAdminOrder: builder.query<{ success: boolean; order: AdminOrderDetail }, string>({
      query: (orderId) => `/admin/orders/${encodeURIComponent(orderId)}/`,
      providesTags: (_r, _e, id) => [{ type: "Order", id }],
    }),
    cancelAdminOrder: builder.mutation<
      { success: boolean; status: string; refund_due: boolean },
      { orderId: string; reason?: string }
    >({
      query: ({ orderId, ...body }) => ({
        url: `/admin/orders/${encodeURIComponent(orderId)}/cancel/`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_r, _e, { orderId }) => [
        { type: "Order", id: orderId },
        { type: "Order", id: "ADMIN_LIST" },
        { type: "Transaction", id: "LIST" },
        { type: "Transaction", id: "SUMMARY" },
      ],
    }),

    /* BNPL / financing */
    getFinancingInvoices: builder.query<FinancingInvoicesResponse, FinancingInvoicesParams | void>({
      query: (params) => `/admin/financing/invoices/${toQuery(params ? { ...params } : undefined)}`,
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map(({ id }) => ({ type: "Financing" as const, id })),
              { type: "Financing", id: "LIST" },
            ]
          : [{ type: "Financing", id: "LIST" }],
    }),
    getFinancingInvoice: builder.query<FinancingInvoiceDetailResponse, string>({
      query: (id) => `/admin/financing/invoices/${encodeURIComponent(id)}/`,
      providesTags: (_r, _e, id) => [{ type: "Financing", id }],
    }),
    getFinancingDashboard: builder.query<{ success: boolean; by_currency: FinancingDashboardRow[] }, void>({
      query: () => `/admin/financing/dashboard/`,
      providesTags: [{ type: "Financing", id: "DASHBOARD" }],
    }),
    recordFinancingRepayment: builder.mutation<
      {
        success: boolean;
        repayment: { id: string; amount: number; fee_portion: number; principal_portion: number };
        invoice: { id: string; invoice_number: string; status: string; balance: number };
      },
      RecordRepaymentPayload
    >({
      query: ({ invoiceId, ...body }) => ({
        url: `/admin/financing/invoices/${encodeURIComponent(invoiceId)}/repayments/`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_r, _e, { invoiceId }) => [
        { type: "Financing", id: invoiceId },
        { type: "Financing", id: "LIST" },
        { type: "Financing", id: "DASHBOARD" },
        { type: "Transaction", id: "LIST" },
        { type: "Transaction", id: "SUMMARY" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAdminTransactionsQuery,
  useGetTransactionsSummaryQuery,
  useGetAdminTransactionQuery,
  useGetAdminOrdersQuery,
  useGetAdminOrderQuery,
  useCancelAdminOrderMutation,
  useGetFinancingInvoicesQuery,
  useGetFinancingInvoiceQuery,
  useGetFinancingDashboardQuery,
  useRecordFinancingRepaymentMutation,
} = accountingApi;

/* ───────────────────────── Formatting ───────────────────────── */

/** Format an amount in its currency, e.g. ₦85,000 */
export function formatMoney(amount: number | null | undefined, currency = "NGN"): string {
  if (amount === null || amount === undefined || Number.isNaN(amount)) return "—";
  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

/** Format an ISO date as e.g. 12 Oct 2026 */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

/** Turn snake_case API values into labels, e.g. pending_payment → Pending payment */
export function humanize(value: string | null | undefined): string {
  if (!value) return "—";
  const s = value.replace(/_/g, " ");
  return s.charAt(0).toUpperCase() + s.slice(1);
}
