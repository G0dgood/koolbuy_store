/**
 * Storefront listing endpoints for the home page and the /products catalogue.
 *
 * - GET /koolbuy/products/  (public catalogue: category label, search, vendor_id, ordering, paging)
 * - GET /hero-banners/      (public home hero slides)
 */
import { baseApi } from "../base-api";

export interface StorefrontProduct {
  id: string;
  name: string;
  price: number;
  shipping_fee: number;
  description: string;
  category: string;
  category_slug: string;
  image: string | null;
  rating: number;
  in_stock: boolean;
  vendor: { id: string; name: string } | null;
  created_at: string;
}

export interface StorefrontPagination {
  total: number;
  page: number;
  page_size: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface StorefrontProductsResponse {
  success?: boolean;
  items: StorefrontProduct[];
  pagination: StorefrontPagination;
}

export type StorefrontOrdering = "newest" | "price_asc" | "price_desc";

export interface StorefrontProductsParams {
  /** Category label; the backend matches it with "contains" */
  category?: string;
  search?: string;
  vendor_id?: string;
  ordering?: StorefrontOrdering;
  page?: number;
  page_size?: number;
}

export interface HeroBanner {
  id: string;
  title: string;
  subtitle: string;
  link_url: string;
  image_url: string;
  sort_order: number;
  duration: number;
  animation: string;
  is_active: boolean;
}

export const storefrontApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStorefrontProducts: builder.query<StorefrontProductsResponse, StorefrontProductsParams | void>({
      query: (params) => {
        const qs = new URLSearchParams();
        if (params?.category) qs.set("category", params.category);
        if (params?.search) qs.set("search", params.search);
        if (params?.vendor_id) qs.set("vendor_id", params.vendor_id);
        // The backend sorts newest first unless asked for a price order
        if (params?.ordering && params.ordering !== "newest") qs.set("ordering", params.ordering);
        if (params?.page) qs.set("page", String(params.page));
        if (params?.page_size) qs.set("page_size", String(params.page_size));
        const s = qs.toString();
        return `/koolbuy/products/${s ? `?${s}` : ""}`;
      },
      providesTags: (result) => [
        ...(result?.items ?? []).map(({ id }) => ({ type: "Product" as const, id })),
        { type: "Product" as const, id: "LIST" },
      ],
    }),

    getHeroBanners: builder.query<HeroBanner[], void>({
      query: () => `/hero-banners/`,
      transformResponse: (res: { items?: HeroBanner[] } | HeroBanner[]) =>
        (Array.isArray(res) ? res : res.items ?? [])
          .filter((b) => b.is_active !== false && !!b.image_url)
          .sort((a, b) => a.sort_order - b.sort_order),
      providesTags: [{ type: "Store", id: "HERO_BANNERS" }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetStorefrontProductsQuery, useGetHeroBannersQuery } = storefrontApi;

/** "₦1,406,000.00" */
export function formatNaira(amount: number | string | null | undefined): string {
  const n = typeof amount === "string" ? Number(amount) : amount ?? 0;
  return `₦${(Number.isFinite(n) ? n : 0).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Storefront link for a product's detail page */
export const productHref = (id: string) => `/products/detail?id=${encodeURIComponent(id)}`;
