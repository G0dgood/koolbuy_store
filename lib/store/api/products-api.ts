/**
 * Products RTK Query endpoints for KoolBuy storefront.
 */
import { baseApi } from "../base-api";

export interface ApiProduct {
  id: string;
  name?: string;
  title?: string;
  price: string | number;
  originalPrice?: string | number;
  rating?: number;
  orders?: number;
  shipping?: string;
  description?: string;
  image?: string;
  category?: string;
  brand?: string;
  condition?: string;
  [key: string]: unknown;
}

export interface ProductsQueryParams {
  category?: string;
  brand?: string;
  search?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
}

export interface PaginatedProductsResponse {
  success?: boolean;
  count?: number;
  total?: number;
  next?: string | null;
  previous?: string | null;
  results?: ApiProduct[];
  items?: ApiProduct[];
  pagination?: {
    total: number;
    page: number;
    page_size: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<
      PaginatedProductsResponse | ApiProduct[],
      ProductsQueryParams | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.category) queryParams.set("category", params.category);
        if (params?.brand) queryParams.set("brand", params.brand);
        if (params?.search) queryParams.set("search", params.search);
        if (params?.page) queryParams.set("page", String(params.page));
        if (params?.page_size) queryParams.set("page_size", String(params.page_size));
        if (params?.ordering) queryParams.set("ordering", params.ordering);

        const qs = queryParams.toString();
        return `/koolbuy/products/${qs ? `?${qs}` : ""}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...(Array.isArray(result)
                ? result.map(({ id }) => ({ type: "Product" as const, id }))
                : "items" in result && Array.isArray(result.items)
                ? result.items.map(({ id }) => ({ type: "Product" as const, id }))
                : "results" in result && Array.isArray(result.results)
                ? result.results.map(({ id }) => ({ type: "Product" as const, id }))
                : []),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),

    getProductById: builder.query<ApiProduct, string>({
      query: (id) => `/koolbuy/products/${id}/`,
      providesTags: (_result, _error, id) => [{ type: "Product", id }],
    }),

    getCategories: builder.query<
      { success: boolean; items: { value: string; label: string; slug?: string }[] },
      void
    >({
      query: () => `/koolbuy/categories/`,
      providesTags: [{ type: "Category", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProductsQuery,
  useLazyGetProductsQuery,
  useGetProductByIdQuery,
  useGetCategoriesQuery,
} = productsApi;
