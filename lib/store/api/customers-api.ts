/**
 * Admin Customers RTK Query endpoints for KoolBuy Store Admin.
 *
 * Provides:
 * - GET    /admin/customers/             (List, filters, counts, chart metrics, pagination)
 * - GET    /admin/customers/:customerId/ (Detailed profile with addresses and orders)
 * - PATCH  /admin/customers/:customerId/ (Update info or activate/deactivate)
 * - DELETE /admin/customers/:customerId/ (Deactivate customer)
 * - POST   /admin/customers/bulk-delete/ (Bulk deactivate customers)
 */
import { baseApi } from "../base-api";

export interface AdminCustomerItem {
  id: string;
  numeric_id: number;
  customer_code: string;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
  status: "Active" | "InActive" | "Deleted" | string;
  is_active: boolean;
  registration: string;
  date_joined: string;
  last_purchase: string;
  last_purchase_raw: string | null;
  order_count: number;
  total_spend: number;
  formatted_total_spend: string;
  orders_summary: {
    total: number;
    completed: number;
    cancelled: number;
  };
}

export interface AdminCustomersMetrics {
  total_customers: number;
  active_customers: number;
  inactive_customers: number;
  deleted_customers: number;
  repeat_customers: number;
  visitors_estimate: number;
  conversion_rate: number;
  chart: {
    labels: string[];
    active: number[];
    repeat: number[];
    visitor: number[];
    conversion: number[];
  };
}

export interface AdminCustomersResponse {
  success: boolean;
  items: AdminCustomerItem[];
  counts: {
    all: number;
    active: number;
    inactive: number;
    deleted: number;
  };
  metrics: AdminCustomersMetrics;
  pagination: {
    total: number;
    page: number;
    page_size: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface AdminCustomersQueryParams {
  search?: string;
  status?: string;
  date_preset?: string;
  from?: string;
  to?: string;
  page?: number;
  page_size?: number;
}

export interface AdminCustomerDetailResponse {
  success: boolean;
  customer: AdminCustomerItem & {
    delivery_addresses?: Array<{
      id: string;
      full_name: string;
      phone_number: string;
      street_address: string;
      city: string;
      state: string;
      is_default: boolean;
    }>;
    recent_orders?: Array<{
      id: string;
      order_number: string;
      status: string;
      total_amount: number;
      created_at: string;
    }>;
  };
}

export interface UpdateAdminCustomerRequest {
  customerId: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  is_active?: boolean;
}

export interface BulkDeleteCustomersRequest {
  customer_ids: string[];
}

export const customersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminCustomers: builder.query<AdminCustomersResponse, AdminCustomersQueryParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.search) queryParams.set("search", params.search);
        if (params?.status && params.status !== "all") queryParams.set("status", params.status);
        if (params?.date_preset && params.date_preset !== "all") queryParams.set("date_preset", params.date_preset);
        if (params?.from) queryParams.set("from", params.from);
        if (params?.to) queryParams.set("to", params.to);
        if (params?.page) queryParams.set("page", String(params.page));
        if (params?.page_size) queryParams.set("page_size", String(params.page_size));

        const qs = queryParams.toString();
        return {
          url: `/admin/customers/${qs ? `?${qs}` : ""}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: "Customer" as const, id })),
              { type: "Customer", id: "LIST" },
            ]
          : [{ type: "Customer", id: "LIST" }],
    }),

    getAdminCustomerDetail: builder.query<AdminCustomerDetailResponse, string>({
      query: (customerId) => ({
        url: `/admin/customers/${customerId}/`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Customer", id }],
    }),

    updateAdminCustomer: builder.mutation<
      { success: boolean; customer: AdminCustomerItem },
      UpdateAdminCustomerRequest
    >({
      query: ({ customerId, ...body }) => ({
        url: `/admin/customers/${customerId}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { customerId }) => [
        { type: "Customer", id: customerId },
        { type: "Customer", id: "LIST" },
      ],
    }),

    deleteAdminCustomer: builder.mutation<
      { success: boolean; message: string; customerId: string },
      string
    >({
      query: (customerId) => ({
        url: `/admin/customers/${customerId}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Customer", id },
        { type: "Customer", id: "LIST" },
      ],
    }),

    bulkDeleteAdminCustomers: builder.mutation<
      { success: boolean; deactivated_count: number; message: string },
      BulkDeleteCustomersRequest
    >({
      query: (body) => ({
        url: `/admin/customers/bulk-delete/`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Customer", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAdminCustomersQuery,
  useGetAdminCustomerDetailQuery,
  useUpdateAdminCustomerMutation,
  useDeleteAdminCustomerMutation,
  useBulkDeleteAdminCustomersMutation,
} = customersApi;
