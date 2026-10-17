/**
 * Admin catalogue, marketing and settings endpoints (KoolConnect backend).
 *
 * - /admin/procurement/pricing/products/   staff product list (prices per buyer tier)
 * - /admin/media/                          media library (image index; files go through /storage/sas/upload/)
 * - /admin/reports/sales/                  "Sales by product" report (product performance)
 * - /admin/hero-banners/                   homepage hero slides
 * - /admin/store-banners/                  every store's banner
 * - /admin/payment-methods/                payment logos shown in the footer
 * - /admin/pricing/regions/                pricing regions (service areas); writes are Super Admin only
 * - /admin/notifications/                  notification delivery log + stats + retry
 * - /admin/site-settings/, /admin/business-rules/, /admin/checkout-minimums/
 */
import { useCallback } from "react";
import { baseApi } from "../base-api";

export interface Pagination {
  total: number;
  page: number;
  page_size: number;
  has_next: boolean;
  has_prev: boolean;
}

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

/* ───────────────────────── Products (staff pricing view) ───────────────────────── */

export interface AdminCatalogueProduct {
  id: string;
  name: string;
  unit: string;
  image_url: string | null;
  in_stock: boolean;
  market: string;
  currency: string;
  category: { id: string; name: string; slug: string } | null;
  store: { id: string; name: string } | null;
  vendor_price: number;
  standard_markup_pct: number;
  standard_price: number;
  retailer_price: number;
  restaurant_price: number;
  wholesaler_price: number;
  updated_at: string;
}

export interface AdminCatalogueProductsParams {
  q?: string;
  market?: string;
  page?: number;
  page_size?: number;
}

/* ───────────────────────── Media library ───────────────────────── */

export const MEDIA_CATEGORIES = ["hero_banner", "popular_category", "store_banner", "product", "freezer", "general"] as const;
export type MediaCategory = (typeof MEDIA_CATEGORIES)[number];

export interface MediaItem {
  id: string;
  url: string;
  filename: string;
  content_type: string;
  size_bytes: number;
  width: number | null;
  height: number | null;
  category: MediaCategory | string;
  created_at: string;
}

export interface MediaLibraryResponse {
  success: boolean;
  items: MediaItem[];
  categories: string[];
  counts: Record<string, number>;
  pagination: Pagination;
}

export interface NewMediaItem {
  url: string;
  filename: string;
  content_type: string;
  size_bytes: number;
  width?: number | null;
  height?: number | null;
  category: MediaCategory;
}

export interface UploadUrlResponse {
  success: boolean;
  upload_url: string;
  blob_url: string;
  content_type: string;
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

export interface SalesReportResponse {
  success: boolean;
  range: { from: string; to: string; market: string | null };
  rows: SalesReportRow[];
  truncated: boolean;
  totals: { currency: string | null; values: Record<string, number> }[] | null;
}

/* ───────────────────────── Banners ───────────────────────── */

export const HERO_ANIMATIONS = ["fade", "slide", "zoom", "slide-up"] as const;
export type HeroAnimation = (typeof HERO_ANIMATIONS)[number];

export interface HeroBanner {
  id: string;
  title: string;
  subtitle: string;
  link_url: string;
  image_url: string;
  sort_order: number;
  duration: number;
  animation: HeroAnimation | string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HeroBannerPayload {
  title?: string;
  subtitle?: string;
  link_url?: string;
  duration?: number;
  animation?: HeroAnimation;
  is_active?: boolean;
  /** data: URL or raw base64 (JPG, PNG, WebP or AVIF, under 3MB) */
  image_base64?: string;
  image_content_type?: string;
}

export interface StoreBanner {
  id: string;
  business_name: string;
  role: "retailer" | "wholesaler";
  logo_url: string;
  cover_image_url: string;
  cover_image_position: number;
  is_verified: boolean;
  is_active: boolean;
  updated_at: string;
}

export interface StoreBannersResponse {
  success: boolean;
  items: StoreBanner[];
  counts: { all: number; with: number; without: number; wholesaler: number; retailer: number };
  pagination: Pagination;
}

/* ───────────────────────── Payment methods ───────────────────────── */

export interface PaymentMethod {
  id: string;
  name: string;
  logo_url: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/* ───────────────────────── Pricing regions ───────────────────────── */

export interface PricingRegion {
  id: string;
  market: string;
  name: string;
  states: string[];
  cities: string[];
  is_active: boolean;
  updated_at: string;
  regional_prices?: number;
}

export interface PricingRegionPayload {
  market: "NG" | "KE" | "UG";
  name: string;
  states: string[];
  cities: string[];
  is_active: boolean;
}

/* ───────────────────────── Notifications log ───────────────────────── */

export const DELIVERY_STATUSES = [
  "pending",
  "processing",
  "sent",
  "failed",
  "skipped_unconfigured",
  "skipped_preference",
  "skipped_no_address",
  "simulated",
  "dead",
] as const;
export const DELIVERY_CHANNELS = ["in_app", "email", "sms", "push"] as const;

export interface NotificationDelivery {
  id: string;
  kind: string;
  kind_label: string;
  critical: boolean;
  channel: string;
  status: string;
  provider: string;
  recipient: string;
  subject: string;
  attempts: number;
  max_attempts: number;
  last_error: string;
  retryable: boolean;
  queued_at: string;
  next_attempt_at: string | null;
  sent_at: string | null;
  failed_at: string | null;
  created_at: string;
  user: { id: string | null; name: string; email: string | null; role: string } | null;
  notification: { id: string | null; title: string; link: string | null; is_read: boolean; read_at: string | null } | null;
}

export interface NotificationLogParams {
  /** a delivery status, or "problem" (failed / dead / not configured) or "pending" (pending / processing) */
  status?: string;
  channel?: string;
  kind?: string;
  date_from?: string;
  date_to?: string;
  q?: string;
  page?: number;
  page_size?: number;
}

export interface NotificationLogResponse {
  success: boolean;
  items: NotificationDelivery[];
  pagination: Pagination;
  kinds: { kind: string; label: string; category: string }[];
}

export interface NotificationStatsResponse {
  success: boolean;
  since: string;
  by_status: Record<string, number>;
  by_channel: Record<string, Record<string, number>>;
  problems: number;
}

/* ───────────────────────── Settings ───────────────────────── */

export interface SiteSettings {
  contact_email: string;
  contact_phone: string;
  nearby_radius_km: number;
  marketplace_markup_percent: number;
  dedicated_accounts_enabled: boolean;
}

export interface SiteSettingsPatch {
  contact_email?: string;
  contact_phone?: string;
  nearby_radius_km?: number;
  marketplace_markup_percent?: number;
  markup_reason?: string;
  dedicated_accounts_enabled?: boolean;
}

export interface BusinessRuleValue {
  label: string;
  value: string | number;
  unit?: string;
  default?: string | number;
}

export interface BusinessRuleSection {
  key: string;
  title: string;
  about: string;
  edit_path?: string;
  can_edit: boolean;
  limits?: string;
  values?: BusinessRuleValue[];
  policies?: {
    market: string;
    currency: string;
    enabled: boolean;
    version: number;
    min_days: number;
    max_days: number;
    bands: { min_days: number; max_days: number; fee_percent: number }[];
  }[];
  rules?: { name: string; metric: string; threshold: number | null; period: string; freezer: string }[];
  default_contribution_percent?: number;
  offer_expiry_days?: number;
  models?: {
    id: string;
    name: string;
    currency: string;
    unlock_price: number | null;
    contribution_percent: number | null;
    effective_contribution_percent: number | null;
  }[];
}

export type MinimumMetric = "kg" | "litre" | "ngn";
export type MinimumAudience = "retailer" | "wholesaler";

export interface CheckoutMinimum {
  id: string;
  market: string;
  audience: MinimumAudience | string;
  metric: MinimumMetric | string;
  threshold: number;
  is_active: boolean;
  note: string;
  updated_at: string;
}

export interface CheckoutMinimumPayload {
  market: "NG" | "KE" | "UG";
  audience: MinimumAudience;
  metric: MinimumMetric;
  threshold: number;
  is_active: boolean;
  note?: string;
  reason: string;
}

/* ───────────────────────── Endpoints ───────────────────────── */

const tag = (id: string) => ({ type: "Store" as const, id });

export const catalogueAdminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* Products */
    getAdminCatalogueProducts: builder.query<
      { success: boolean; items: AdminCatalogueProduct[]; pagination: Pagination },
      AdminCatalogueProductsParams | void
    >({
      query: (params) => `/admin/procurement/pricing/products/${toQuery(params ? { ...params } : undefined)}`,
      providesTags: [{ type: "Product", id: "ADMIN_CATALOGUE" }],
    }),

    /* Media library */
    getMediaLibrary: builder.query<
      MediaLibraryResponse,
      { category?: string; search?: string; page?: number; page_size?: number } | void
    >({
      query: (params) => `/admin/media/${toQuery(params ? { ...params } : undefined)}`,
      providesTags: [tag("MEDIA")],
    }),
    requestUploadUrl: builder.mutation<UploadUrlResponse, { filename: string; content_type: string; kind?: "image" | "generic" }>({
      query: (body) => ({ url: `/storage/sas/upload/`, method: "POST", body: { kind: "image", ...body } }),
    }),
    addMediaItems: builder.mutation<{ success: boolean; items: MediaItem[] }, NewMediaItem[]>({
      query: (items) => ({ url: `/admin/media/`, method: "POST", body: { items } }),
      invalidatesTags: [tag("MEDIA")],
    }),
    updateMediaItem: builder.mutation<{ success: boolean; item: MediaItem }, { id: string; category?: MediaCategory; filename?: string }>({
      query: ({ id, ...body }) => ({ url: `/admin/media/${id}/`, method: "PATCH", body }),
      invalidatesTags: [tag("MEDIA")],
    }),
    deleteMediaItem: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `/admin/media/${id}/`, method: "DELETE" }),
      invalidatesTags: [tag("MEDIA")],
    }),

    /* Product performance */
    getSalesReport: builder.query<SalesReportResponse, { date_from?: string; date_to?: string; market?: string } | void>({
      query: (params) => `/admin/reports/sales/${toQuery(params ? { ...params } : undefined)}`,
      providesTags: [{ type: "Order", id: "SALES_REPORT" }],
    }),

    /* Hero banners */
    getAdminHeroBanners: builder.query<{ success: boolean; items: HeroBanner[] }, void>({
      query: () => `/admin/hero-banners/`,
      providesTags: [tag("HERO_BANNERS")],
    }),
    createHeroBanner: builder.mutation<{ success: boolean; banner: HeroBanner }, HeroBannerPayload & { image_base64: string }>({
      query: (body) => ({ url: `/admin/hero-banners/`, method: "POST", body }),
      invalidatesTags: [tag("HERO_BANNERS")],
    }),
    updateHeroBanner: builder.mutation<{ success: boolean; banner: HeroBanner }, HeroBannerPayload & { id: string }>({
      query: ({ id, ...body }) => ({ url: `/admin/hero-banners/${id}/`, method: "PATCH", body }),
      invalidatesTags: [tag("HERO_BANNERS")],
    }),
    deleteHeroBanner: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `/admin/hero-banners/${id}/`, method: "DELETE" }),
      invalidatesTags: [tag("HERO_BANNERS")],
    }),
    reorderHeroBanners: builder.mutation<{ success: boolean }, { id: string; sort_order: number }[]>({
      query: (items) => ({ url: `/admin/hero-banners/reorder/`, method: "POST", body: { items } }),
      invalidatesTags: [tag("HERO_BANNERS")],
    }),

    /* Store banners */
    getStoreBanners: builder.query<
      StoreBannersResponse,
      { q?: string; banner?: "with" | "without"; role?: "retailer" | "wholesaler"; page?: number; page_size?: number } | void
    >({
      query: (params) => `/admin/store-banners/${toQuery(params ? { ...params } : undefined)}`,
      providesTags: [tag("STORE_BANNERS")],
    }),
    updateStoreBanner: builder.mutation<
      { success: boolean; item: StoreBanner },
      { id: string; cover_image_url?: string; cover_image_position?: number }
    >({
      query: ({ id, ...body }) => ({ url: `/admin/store-banners/${id}/`, method: "PATCH", body }),
      invalidatesTags: [tag("STORE_BANNERS")],
    }),

    /* Payment methods */
    getPaymentMethods: builder.query<{ success: boolean; items: PaymentMethod[] }, void>({
      query: () => `/admin/payment-methods/`,
      providesTags: [tag("PAYMENT_METHODS")],
    }),
    createPaymentMethod: builder.mutation<{ success: boolean; item: PaymentMethod }, { name: string; logo_url: string; is_active: boolean }>({
      query: (body) => ({ url: `/admin/payment-methods/`, method: "POST", body }),
      invalidatesTags: [tag("PAYMENT_METHODS")],
    }),
    updatePaymentMethod: builder.mutation<
      { success: boolean; item: PaymentMethod },
      { id: string; name?: string; logo_url?: string; is_active?: boolean }
    >({
      query: ({ id, ...body }) => ({ url: `/admin/payment-methods/${id}/`, method: "PATCH", body }),
      invalidatesTags: [tag("PAYMENT_METHODS")],
    }),
    deletePaymentMethod: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `/admin/payment-methods/${id}/`, method: "DELETE" }),
      invalidatesTags: [tag("PAYMENT_METHODS")],
    }),
    reorderPaymentMethods: builder.mutation<{ success: boolean }, string[]>({
      query: (ids) => ({ url: `/admin/payment-methods/reorder/`, method: "POST", body: { ids } }),
      invalidatesTags: [tag("PAYMENT_METHODS")],
    }),

    /* Pricing regions */
    getPricingRegions: builder.query<{ success: boolean; items: PricingRegion[] }, void>({
      query: () => `/admin/pricing/regions/`,
      providesTags: [tag("REGIONS")],
    }),
    createPricingRegion: builder.mutation<{ success: boolean; region: PricingRegion }, PricingRegionPayload>({
      query: (body) => ({ url: `/admin/pricing/regions/`, method: "POST", body }),
      invalidatesTags: [tag("REGIONS"), tag("BUSINESS_RULES")],
    }),
    updatePricingRegion: builder.mutation<
      { success: boolean; region: PricingRegion },
      { id: string } & Partial<Omit<PricingRegionPayload, "market">>
    >({
      query: ({ id, ...body }) => ({ url: `/admin/pricing/regions/${id}/`, method: "PATCH", body }),
      invalidatesTags: [tag("REGIONS"), tag("BUSINESS_RULES")],
    }),

    /* Notifications log */
    getNotificationLog: builder.query<NotificationLogResponse, NotificationLogParams | void>({
      query: (params) => `/admin/notifications/${toQuery(params ? { ...params } : undefined)}`,
      providesTags: [{ type: "User", id: "NOTIFICATION_LOG" }],
    }),
    getNotificationStats: builder.query<NotificationStatsResponse, void>({
      query: () => `/admin/notifications/stats/`,
      providesTags: [{ type: "User", id: "NOTIFICATION_STATS" }],
    }),
    retryNotification: builder.mutation<{ success: boolean; delivery: NotificationDelivery }, string>({
      query: (id) => ({ url: `/admin/notifications/${id}/retry/`, method: "POST" }),
      invalidatesTags: [
        { type: "User", id: "NOTIFICATION_LOG" },
        { type: "User", id: "NOTIFICATION_STATS" },
      ],
    }),

    /* Settings */
    getSiteSettings: builder.query<{ success: boolean; settings: SiteSettings }, void>({
      query: () => `/admin/site-settings/`,
      providesTags: [tag("SITE_SETTINGS")],
    }),
    updateSiteSettings: builder.mutation<{ success: boolean; settings: SiteSettings }, SiteSettingsPatch>({
      query: (body) => ({ url: `/admin/site-settings/`, method: "PATCH", body }),
      invalidatesTags: [tag("SITE_SETTINGS"), tag("BUSINESS_RULES")],
    }),
    getBusinessRules: builder.query<{ success: boolean; sections: BusinessRuleSection[] }, void>({
      query: () => `/admin/business-rules/`,
      providesTags: [tag("BUSINESS_RULES")],
    }),
    getCheckoutMinimums: builder.query<{ success: boolean; metrics: string[]; audiences: string[]; items: CheckoutMinimum[] }, void>({
      query: () => `/admin/checkout-minimums/`,
      providesTags: [tag("CHECKOUT_MINIMUMS")],
    }),
    saveCheckoutMinimum: builder.mutation<{ success: boolean; rule: CheckoutMinimum }, CheckoutMinimumPayload>({
      query: (body) => ({ url: `/admin/checkout-minimums/`, method: "PUT", body }),
      invalidatesTags: [tag("CHECKOUT_MINIMUMS"), tag("BUSINESS_RULES")],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAdminCatalogueProductsQuery,
  useGetMediaLibraryQuery,
  useRequestUploadUrlMutation,
  useAddMediaItemsMutation,
  useUpdateMediaItemMutation,
  useDeleteMediaItemMutation,
  useGetSalesReportQuery,
  useGetAdminHeroBannersQuery,
  useCreateHeroBannerMutation,
  useUpdateHeroBannerMutation,
  useDeleteHeroBannerMutation,
  useReorderHeroBannersMutation,
  useGetStoreBannersQuery,
  useUpdateStoreBannerMutation,
  useGetPaymentMethodsQuery,
  useCreatePaymentMethodMutation,
  useUpdatePaymentMethodMutation,
  useDeletePaymentMethodMutation,
  useReorderPaymentMethodsMutation,
  useGetPricingRegionsQuery,
  useCreatePricingRegionMutation,
  useUpdatePricingRegionMutation,
  useGetNotificationLogQuery,
  useGetNotificationStatsQuery,
  useRetryNotificationMutation,
  useGetSiteSettingsQuery,
  useUpdateSiteSettingsMutation,
  useGetBusinessRulesQuery,
  useGetCheckoutMinimumsQuery,
  useSaveCheckoutMinimumMutation,
} = catalogueAdminApi;

/** Alias for backwards compatibility */
export const useGetHeroBannersQuery = useGetAdminHeroBannersQuery;

/* ───────────────────────── Uploads ───────────────────────── */

/** JPG, PNG, WebP or AVIF: what the backend accepts as an image. */
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

/** Read an image's pixel size in the browser (null when it can't be decoded). */
export function imageSize(file: File): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      resolve(null);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

/** Read a file as a data: URL (for endpoints that take image_base64). */
export function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error(`Couldn't read ${file.name}.`));
    reader.readAsDataURL(file);
  });
}

/**
 * Upload a file through the storage flow (POST /storage/sas/upload/, then PUT
 * the bytes to the returned URL). Resolves to the file's stored URL.
 */
export function useUploadFile() {
  const [requestUrl] = useRequestUploadUrlMutation();
  return useCallback(
    async (file: File): Promise<string> => {
      const signed = await requestUrl({ filename: file.name, content_type: file.type || "application/octet-stream" }).unwrap();
      const put = await fetch(signed.upload_url, {
        method: "PUT",
        headers: { "Content-Type": signed.content_type || file.type },
        body: file,
      });
      if (!put.ok) throw new Error(`Couldn't upload ${file.name}. Please try again.`);
      return signed.blob_url;
    },
    [requestUrl],
  );
}
