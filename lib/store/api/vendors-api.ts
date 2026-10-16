/**
 * Vendors & Sellers RTK Query endpoints for KoolBuy Store & Admin.
 *
 * Provides:
 * - Public storefront vendor queries (/stores/vendors/)
 * - Admin seller management queries & mutations (/admin/sellers/)
 */
import { baseApi } from "../base-api";

export interface PublicVendor {
  id: string;
  image_url?: string | null;
  cover_image_url?: string | null;
  cover_image_position?: number;
  name: string;
  rating: number;
  review_count: number;
  address?: string | null;
  phone_number?: string | null;
  joined_year?: number;
  business_type?: string;
  products_count?: number;
}

export interface PublicVendorsResponse {
  success: boolean;
  items: PublicVendor[];
  pagination: {
    total: number;
    page: number;
    page_size: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface PublicVendorsQueryParams {
  name?: string;
  business_type?: string;
  sort?: "newest" | "rating" | "popular";
  page?: number;
  page_size?: number;
}

export interface BusinessTypeItem {
  value: string;
  label: string;
}

export interface BusinessTypesResponse {
  success: boolean;
  items: BusinessTypeItem[];
}

export interface AdminSellerItem {
  id: string;
  business_name: string;
  business_type: string;
  role: "retailer" | "wholesaler" | string;
  email: string;
  phone: string;
  is_verified: boolean;
  is_active: boolean;
  is_open: boolean;
  suspended_at: string | null;
  rating: number;
  product_count: number;
  order_count: number;
  created_at: string;
}

export interface AdminSellersResponse {
  success: boolean;
  items: AdminSellerItem[];
  counts: {
    all: number;
    active?: number;
    unverified?: number;
    suspended?: number;
    retailer: number;
    wholesaler: number;
  };
  pagination: {
    total: number;
    page: number;
    page_size: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface AdminSellersQueryParams {
  role?: "retailer" | "wholesaler" | string;
  is_verified?: boolean | string;
  is_active?: boolean | string;
  status?: "active" | "unverified" | "suspended" | string;
  q?: string;
  page?: number;
  page_size?: number;
}

export interface AdminSellerDetail extends AdminSellerItem {
  address?: string | null;
  description?: string | null;
  whatsapp_number?: string | null;
  logo_url?: string | null;
  cac_image_url?: string | null;
  suspension_reason?: string | null;
  status_history?: Array<{
    id: string;
    action: string;
    reason?: string | null;
    created_at: string;
  }>;
}

export interface AdminSellerDetailResponse {
  success: boolean;
  seller: AdminSellerDetail;
}

export interface UpdateAdminSellerPayload {
  sellerId: string;
  is_verified?: boolean;
  is_active?: boolean;
  role?: "retailer" | "wholesaler";
  business_type?: string;
  reason?: string;
}

export interface SuspendSellerPayload {
  sellerId: string;
  reason: string;
}

export interface ReactivateSellerPayload {
  sellerId: string;
  note?: string;
}

export interface InviteSellerPayload {
  business_name: string;
  phone: string;
  email?: string;
  role?: "retailer" | "wholesaler";
  business_type?: string;
}

export const vendorsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── Public Storefront Endpoints ──────────────────────────────────────────
    getVendors: builder.query<PublicVendorsResponse, PublicVendorsQueryParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.name) queryParams.set("name", params.name);
        if (params?.business_type) queryParams.set("business_type", params.business_type);
        if (params?.sort) queryParams.set("sort", params.sort);
        if (params?.page) queryParams.set("page", String(params.page));
        if (params?.page_size) queryParams.set("page_size", String(params.page_size));
        const qs = queryParams.toString();
        return `/koolbuy/vendors/${qs ? `?${qs}` : ""}`;
      },
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map(({ id }) => ({ type: "Vendor" as const, id })),
              { type: "Vendor", id: "LIST" },
            ]
          : [{ type: "Vendor", id: "LIST" }],
    }),

    getVendorById: builder.query<{ success: boolean; vendor: PublicVendor }, string>({
      query: (vendorId) => `/koolbuy/vendors/${vendorId}/`,
      providesTags: (_result, _error, id) => [{ type: "Vendor", id }],
    }),

    getBusinessTypes: builder.query<BusinessTypesResponse, void>({
      query: () => `/koolbuy/vendors/business-types/`,
    }),

    // ── Admin Endpoints ──────────────────────────────────────────────────────
    getAdminSellers: builder.query<AdminSellersResponse, AdminSellersQueryParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.role) queryParams.set("role", params.role);
        if (params?.is_verified !== undefined) queryParams.set("is_verified", String(params.is_verified));
        if (params?.is_active !== undefined) queryParams.set("is_active", String(params.is_active));
        if (params?.status) queryParams.set("status", params.status);
        if (params?.q) queryParams.set("q", params.q);
        if (params?.page) queryParams.set("page", String(params.page));
        if (params?.page_size) queryParams.set("page_size", String(params.page_size));
        const qs = queryParams.toString();
        return `/koolbuy/admin/vendors/${qs ? `?${qs}` : ""}`;
      },
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map(({ id }) => ({ type: "Vendor" as const, id })),
              { type: "Vendor", id: "ADMIN_LIST" },
            ]
          : [{ type: "Vendor", id: "ADMIN_LIST" }],
    }),

    getAdminSellerById: builder.query<AdminSellerDetailResponse, string>({
      query: (sellerId) => `/koolbuy/admin/vendors/${sellerId}/`,
      providesTags: (_result, _error, id) => [{ type: "Vendor", id }],
    }),

    updateAdminSeller: builder.mutation<AdminSellerDetailResponse, UpdateAdminSellerPayload>({
      query: ({ sellerId, ...body }) => ({
        url: `/koolbuy/admin/vendors/${sellerId}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { sellerId }) => [
        { type: "Vendor", id: sellerId },
        { type: "Vendor", id: "ADMIN_LIST" },
        { type: "Vendor", id: "LIST" },
      ],
    }),

    suspendSeller: builder.mutation<{ success: boolean }, SuspendSellerPayload>({
      query: ({ sellerId, reason }) => ({
        url: `/koolbuy/admin/vendors/${sellerId}/suspend/`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: (_result, _error, { sellerId }) => [
        { type: "Vendor", id: sellerId },
        { type: "Vendor", id: "ADMIN_LIST" },
        { type: "Vendor", id: "LIST" },
      ],
    }),

    reactivateSeller: builder.mutation<{ success: boolean }, ReactivateSellerPayload>({
      query: ({ sellerId, note }) => ({
        url: `/koolbuy/admin/vendors/${sellerId}/reactivate/`,
        method: "POST",
        body: { note: note ?? "" },
      }),
      invalidatesTags: (_result, _error, { sellerId }) => [
        { type: "Vendor", id: sellerId },
        { type: "Vendor", id: "ADMIN_LIST" },
        { type: "Vendor", id: "LIST" },
      ],
    }),

    inviteSeller: builder.mutation<{ success: boolean; user?: unknown }, InviteSellerPayload>({
      query: (body) => ({
        url: `/koolbuy/admin/vendors/invite/`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Vendor", id: "ADMIN_LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetVendorsQuery,
  useGetVendorByIdQuery,
  useGetBusinessTypesQuery,
  useGetAdminSellersQuery,
  useGetAdminSellerByIdQuery,
  useUpdateAdminSellerMutation,
  useSuspendSellerMutation,
  useReactivateSellerMutation,
  useInviteSellerMutation,
} = vendorsApi;
