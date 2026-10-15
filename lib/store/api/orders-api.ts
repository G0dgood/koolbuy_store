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

export interface OrderVendor {
  id?: string;
  name?: string;
  phone?: string;
}

export interface Order {
  id: string;
  order_number?: string;
  status: string;
  total_amount?: number | string;
  items?: OrderItem[];
  created_at?: string;
  shipping_address?: Record<string, unknown> | string;
  delivery_address?: Record<string, unknown> | string;
  payment_method?: string;
  vendor?: OrderVendor | null;
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

export interface OrdersResponse {
  success?: boolean;
  items?: Order[];
  results?: Order[];
  pagination?: {
    total: number;
    page: number;
    page_size: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<
      OrdersResponse | Order[],
      { status?: string; page?: number } | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.status) queryParams.set("status", params.status);
        if (params?.page) queryParams.set("page", String(params.page));
        const qs = queryParams.toString();
        return `/koolbuy/orders/${qs ? `?${qs}` : ""}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...(Array.isArray(result)
                ? result.map(({ id }) => ({ type: "Order" as const, id }))
                : "items" in result && Array.isArray(result.items)
                ? result.items.map(({ id }) => ({ type: "Order" as const, id }))
                : []),
              { type: "Order", id: "LIST" },
            ]
          : [{ type: "Order", id: "LIST" }],
    }),

    getOrderById: builder.query<{ success: boolean; order?: Order; item?: Order } | Order, string>({
      query: (id) => `/koolbuy/orders/${id}/`,
      providesTags: (_result, _error, id) => [{ type: "Order", id }],
    }),

    createOrder: builder.mutation<{ success: boolean; order?: Order; id?: string } | Order, CreateOrderPayload>({
      query: (body) => ({
        url: `/koolbuy/orders/`,
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
