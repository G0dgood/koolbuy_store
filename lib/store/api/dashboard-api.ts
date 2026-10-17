/**
 * Admin dashboard and admin header RTK Query endpoints.
 *
 * KoolConnect backend:
 * - GET  /admin/analytics/             KPIs (with previous period), daily series, breakdowns
 * - GET  /admin/overview/              recent orders (the other overview numbers are not used)
 * - GET  /admin/reports/sales/         sales by product (top products, sales by category)
 * - GET  /admin/users/?q               header search: people
 * - GET  /koolbuy/products/?search     header search: products
 * - GET  /users/notifications/         header bell (paged + unread_count)
 * - POST /users/notifications/:id/read/, /users/notifications/read-all/
 *
 * Money values are numbers in the response's currency; never add amounts of
 * different currencies together.
 */
import { baseApi } from "../base-api";

function toQuery(params: Record<string, string | number | boolean | undefined | null> | void): string {
  if (!params) return "";
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    qs.set(key, String(value));
  }
  const s = qs.toString();
  return s ? `?${s}` : "";
}

interface Paging {
  total: number;
  page: number;
  page_size: number;
  has_next: boolean;
  has_prev: boolean;
}

/* ───────────────────────── Analytics ───────────────────────── */

export type AnalyticsPeriod = "7d" | "30d" | "90d";

export interface Kpi {
  value: number;
  previous: number;
}

export interface AdminAnalytics {
  success: boolean;
  period: AnalyticsPeriod | "custom";
  market: string;
  currency: string;
  /** ISO, inclusive */
  from: string;
  /** ISO, exclusive */
  to: string;
  kpis: {
    gmv: Kpi;
    orders: Kpi;
    avg_order_value: Kpi;
    new_users: Kpi;
    new_sellers: Kpi;
    active_buyers: Kpi;
  };
  series: { date: string; gmv: number; orders: number; new_users: number; new_sellers: number }[];
  orders_by_status: { status: string; count: number }[];
  users_by_role: { role: string; count: number }[];
  sellers_by_type: { type: string; verified: number; unverified: number }[];
  top_sellers: { id: string; name: string; revenue: number; orders: number }[];
  revenue_by_market: { market: string; currency: string; total: number }[];
}

export interface AdminAnalyticsParams {
  period?: AnalyticsPeriod;
  /** YYYY-MM-DD; with `to`, wins over `period` */
  from?: string;
  to?: string;
  market?: string;
}

/* ───────────────────────── Overview ───────────────────────── */

export interface RecentOrder {
  id: string;
  order_number: string;
  buyer_name: string;
  seller_name: string;
  status: string;
  total_amount: number;
  created_at: string;
}

export interface AdminOverview {
  success: boolean;
  recent_orders: RecentOrder[];
}

/* ───────────────────────── Sales report ───────────────────────── */

export interface SalesReportRow {
  product: string;
  category: string | null;
  store: string;
  market: string;
  orders: number;
  quantity: number;
  avg_price: number;
  revenue: number;
  currency: string;
}

export interface SalesReport {
  success: boolean;
  range: { from: string; to: string; market: string | null };
  rows: SalesReportRow[];
  /** More than 200 rows matched; only the first 200 are returned */
  truncated: boolean;
}

export interface SalesReportParams {
  /** YYYY-MM-DD */
  date_from?: string;
  date_to?: string;
  market?: string;
}

/* ───────────────────────── Header search ───────────────────────── */

export interface SearchUser {
  id: string;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role: string;
  is_staff: boolean;
}

export interface SearchProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string | null;
  vendor: { id: string; name: string } | null;
}

/* ───────────────────────── Notifications ───────────────────────── */

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  read_at: string | null;
  kind: string;
  link: string | null;
  priority: string;
  created_at: string;
}

export interface NotificationsResponse {
  success: boolean;
  items: AppNotification[];
  pagination: Paging;
  unread_count: number;
}

const NOTIFICATIONS = { type: "User" as const, id: "NOTIFICATIONS" };

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardAnalytics: builder.query<AdminAnalytics, AdminAnalyticsParams | void>({
      query: (params) => `/admin/analytics/${toQuery(params ? { ...params } : undefined)}`,
      providesTags: [{ type: "Accounting", id: "DASHBOARD" }],
    }),
    getDashboardOverview: builder.query<AdminOverview, void>({
      query: () => `/admin/overview/`,
      providesTags: [{ type: "Order", id: "DASHBOARD_RECENT" }],
    }),
    getDashboardSalesReport: builder.query<SalesReport, SalesReportParams | void>({
      query: (params) => `/admin/reports/sales/${toQuery(params ? { ...params } : undefined)}`,
      providesTags: [{ type: "Order", id: "DASHBOARD_SALES" }],
    }),

    searchAdminUsers: builder.query<{ success: boolean; items: SearchUser[]; pagination: Paging }, { q: string; page_size?: number }>({
      query: (params) => `/admin/users/${toQuery(params)}`,
    }),
    searchCatalogProducts: builder.query<{ success: boolean; items: SearchProduct[]; pagination: Paging }, { search: string; page_size?: number }>({
      query: (params) => `/koolbuy/products/${toQuery(params)}`,
    }),

    getHeaderNotifications: builder.query<NotificationsResponse, { page_size?: number } | void>({
      query: (params) => `/users/notifications/${toQuery(params ? { ...params } : undefined)}`,
      providesTags: [NOTIFICATIONS],
    }),
    markHeaderNotificationRead: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `/users/notifications/${encodeURIComponent(id)}/read/`, method: "POST", body: {} }),
      invalidatesTags: [NOTIFICATIONS],
    }),
    markAllHeaderNotificationsRead: builder.mutation<{ success: boolean; updated: number; unread_count: number }, void>({
      query: () => ({ url: `/users/notifications/read-all/`, method: "POST", body: {} }),
      invalidatesTags: [NOTIFICATIONS],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetDashboardAnalyticsQuery,
  useGetDashboardOverviewQuery,
  useGetDashboardSalesReportQuery,
  useSearchAdminUsersQuery,
  useSearchCatalogProductsQuery,
  useGetHeaderNotificationsQuery,
  useMarkHeaderNotificationReadMutation,
  useMarkAllHeaderNotificationsReadMutation,
} = dashboardApi;
