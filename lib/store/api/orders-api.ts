/**
 * Orders RTK Query endpoints for KoolBuy storefront.
 */
import { baseApi } from "../base-api";

export interface OrderItem {
  id?: string;
  product_id?: string;
  title?: string;
  name?: string;
  price: number | string;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  order_number?: string;
  status: string;
  total_amount?: number | string;
  items?: OrderItem[];
  created_at?: string;
  shipping_address?: Record<string, unknown> | string;
  payment_method?: string;
  [key: string]: unknown;
}

export interface CreateOrderPayload {
  items: Array<{
    product_id: string;
    quantity: number;
    price?: number | string;
  }>;
  shipping_address?: Record<string, unknown> | string;
  payment_method?: string;
  coupon_code?: string;
  notes?: string;
}

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<Order[], { status?: string; page?: number } | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.status) queryParams.set("status", params.status);
        if (params?.page) queryParams.set("page", String(params.page));
        const qs = queryParams.toString();
        return `/orders/${qs ? `?${qs}` : ""}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Order" as const, id })),
              { type: "Order", id: "LIST" },
            ]
          : [{ type: "Order", id: "LIST" }],
    }),

    getOrderById: builder.query<Order, string>({
      query: (id) => `/orders/${id}/`,
      providesTags: (_result, _error, id) => [{ type: "Order", id }],
    }),

    createOrder: builder.mutation<Order, CreateOrderPayload>({
      query: (body) => ({
        url: `/orders/`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Order", id: "LIST" }, { type: "Cart", id: "CURRENT" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
} = ordersApi;
