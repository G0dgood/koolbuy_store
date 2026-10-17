/**
 * Product detail page endpoints (/products/detail?id=<uuid>).
 *
 * - GET /koolbuy/products/:id/        public storefront product (always used)
 * - GET /products/detail/:id/         richer KoolConnect detail, role-gated (optional extras)
 * - GET /products/:id/reviews/        public, paged
 * - GET /koolbuy/vendors/:id/         public vendor profile
 * - GET /financing/options/           pay-later quotes (signed-in buyers only)
 */
import { baseApi } from "../base-api";

export interface StoreProductDetail {
  id: string;
  name: string;
  price: number | string;
  shipping_fee?: number | string | null;
  description?: string | null;
  category?: string | null;
  category_slug?: string | null;
  image?: string | null;
  rating?: number | null;
  in_stock?: boolean;
  unit?: string | null;
  vendor?: { id: string; name: string; phone?: string | null } | null;
  created_at?: string;
}

export interface RichProductDetail {
  id: string;
  name: string;
  images?: string[];
  price: number | string;
  shipping_fee?: number | string | null;
  rating?: number | null;
  review_count?: number | null;
  vendor_image_url?: string | null;
  vendor?: { id: string; name: string } | null;
  description?: string | null;
  category?: { value: string; label: string } | null;
  tags?: string[];
  in_stock?: boolean;
  stock_quantity?: number | null;
  attributes?: Record<string, unknown> | null;
  unit?: string | null;
  product_type?: { value: string; label: string } | null;
  market?: string | null;
}

export interface ProductReview {
  id: string;
  rating: number;
  comment?: string | null;
  user_name?: string | null;
  created_at: string;
}

export interface Pagination {
  total: number;
  page: number;
  page_size: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface ProductReviewsResponse {
  success: boolean;
  items: ProductReview[];
  pagination: Pagination;
}

export interface ProductVendorProfile {
  id: string;
  name: string;
  business_type?: string | null;
  description?: string | null;
  image_url?: string | null;
  rating?: number | null;
  review_count?: number | null;
  address?: string | null;
  phone_number?: string | null;
  whatsapp_number?: string | null;
  joined_year?: number | null;
  products_count?: number | null;
  is_verified?: boolean;
  is_open?: boolean;
}

export interface FinancingQuote {
  tenor_days: number;
  fee_rate: number;
  fee_amount: number;
  total_payable: number;
  within_limit: boolean;
}

export interface FinancingOptionsResponse {
  success: boolean;
  eligible: boolean;
  reasons: string[];
  credit_limit: number;
  available_credit?: number;
  currency?: string;
  min_days?: number;
  max_days?: number;
  quotes: FinancingQuote[];
}

export const productDetailApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductPage: builder.query<StoreProductDetail, string>({
      query: (id) => `/koolbuy/products/${encodeURIComponent(id)}/`,
      transformResponse: (res: { product: StoreProductDetail }) => res.product,
      providesTags: (_r, _e, id) => [{ type: "Product", id }],
    }),

    getProductRichDetail: builder.query<RichProductDetail, string>({
      query: (id) => `/products/detail/${encodeURIComponent(id)}/`,
      transformResponse: (res: { product: RichProductDetail }) => res.product,
      providesTags: (_r, _e, id) => [{ type: "Product", id }],
    }),

    getProductReviewsPage: builder.query<
      ProductReviewsResponse,
      { productId: string; page?: number; page_size?: number }
    >({
      query: ({ productId, page = 1, page_size = 10 }) =>
        `/products/${encodeURIComponent(productId)}/reviews/?page=${page}&page_size=${page_size}`,
      providesTags: (_r, _e, { productId }) => [{ type: "Product", id: `reviews-${productId}` }],
    }),

    getProductVendorProfile: builder.query<ProductVendorProfile, string>({
      query: (vendorId) => `/koolbuy/vendors/${encodeURIComponent(vendorId)}/`,
      transformResponse: (res: { vendor: ProductVendorProfile }) => res.vendor,
      providesTags: (_r, _e, id) => [{ type: "Vendor", id }],
    }),

    getProductFinancingOptions: builder.query<
      FinancingOptionsResponse,
      { amount: number; market?: string }
    >({
      query: ({ amount, market }) => {
        const qs = new URLSearchParams({ amount: String(amount) });
        if (market) qs.set("market", market);
        return `/financing/options/?${qs.toString()}`;
      },
      providesTags: [{ type: "Financing", id: "OPTIONS" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProductPageQuery,
  useGetProductRichDetailQuery,
  useGetProductReviewsPageQuery,
  useGetProductVendorProfileQuery,
  useGetProductFinancingOptionsQuery,
} = productDetailApi;
