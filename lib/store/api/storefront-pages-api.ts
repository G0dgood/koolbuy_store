/**
 * Read-only endpoints used by the storefront's secondary pages
 * (categories, profile overview).
 */
import { baseApi } from "../base-api";

/** GET /popular-categories/ — curated category tiles (public) */
export interface PopularCategory {
  id: string;
  title: string;
  description?: string | null;
  category_slug: string;
  icon?: string | null;
  accent?: string | null;
  image_url?: string | null;
  sort_order?: number;
}

export interface PopularCategoriesResponse {
  success?: boolean;
  items: PopularCategory[];
}

/** GET /points/me/ — loyalty balance, or `{ enabled: false }` when points are off */
export interface MyPointsResponse {
  success?: boolean;
  enabled: boolean;
  total_points?: string;
  points_redeemed?: string;
  available_points?: string;
}

/** GET /users/notifications/ — only the unread count is used here */
export interface NotificationSummaryResponse {
  success?: boolean;
  unread_count?: number;
}

export const storefrontPagesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStorefrontPopularCategories: builder.query<PopularCategoriesResponse, void>({
      query: () => `/popular-categories/`,
      providesTags: [{ type: "Category", id: "POPULAR" }],
    }),

    getMyLoyaltyPoints: builder.query<MyPointsResponse, void>({
      query: () => `/points/me/`,
      providesTags: [{ type: "User", id: "POINTS" }],
    }),

    getNotificationUnreadSummary: builder.query<NotificationSummaryResponse, void>({
      query: () => `/users/notifications/?page_size=1`,
      providesTags: [{ type: "User", id: "NOTIFICATIONS" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetStorefrontPopularCategoriesQuery,
  useGetMyLoyaltyPointsQuery,
  useGetNotificationUnreadSummaryQuery,
} = storefrontPagesApi;
