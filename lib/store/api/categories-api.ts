/**
 * Categories RTK Query endpoints for KoolBuy Store & Admin.
 *
 * Connects to KoolConnect backend core_category and product category endpoints.
 */
import { baseApi } from "../base-api";

export type VatTreatment = "standard" | "exempt" | "zero_rated";

export interface CategoryItem {
  slug: string;
  label: string;
  is_active: boolean;
  is_catch_all: boolean;
  sort_order: number;
  vat_treatment?: VatTreatment | string;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface AdminCategoriesResponse {
  success: boolean;
  items: CategoryItem[];
  counts: {
    all: number;
    active: number;
    hidden: number;
  };
}

export interface PublicCategoryItem {
  value: string;
  label: string;
}

export interface PublicCategoriesResponse {
  success: boolean;
  items: PublicCategoryItem[];
}

export interface CreateCategoryPayload {
  label: string;
  slug?: string;
  sort_order?: number;
  is_active?: boolean;
  is_catch_all?: boolean;
  vat_treatment?: VatTreatment;
}

export interface UpdateCategoryPayload {
  slug: string;
  label?: string;
  sort_order?: number;
  is_active?: boolean;
  is_catch_all?: boolean;
  vat_treatment?: VatTreatment;
}

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminCategories: builder.query<
      AdminCategoriesResponse,
      { q?: string; status?: "active" | "hidden" | "all" } | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.q?.trim()) queryParams.set("q", params.q.trim());
        if (params?.status && params.status !== "all") queryParams.set("status", params.status);
        const qs = queryParams.toString();
        return `/admin/categories/${qs ? `?${qs}` : ""}`;
      },
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map(({ slug }) => ({ type: "Category" as const, id: slug })),
              { type: "Category", id: "LIST" },
            ]
          : [{ type: "Category", id: "LIST" }],
    }),

    getPublicCategories: builder.query<PublicCategoriesResponse, void>({
      query: () => `/products/categories/`,
      providesTags: [{ type: "Category", id: "PUBLIC_LIST" }],
    }),

    createCategory: builder.mutation<
      { success: boolean; item: CategoryItem },
      CreateCategoryPayload
    >({
      query: (body) => ({
        url: `/admin/categories/`,
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Category", id: "LIST" },
        { type: "Category", id: "PUBLIC_LIST" },
      ],
    }),

    updateCategory: builder.mutation<
      { success: boolean; item: CategoryItem },
      UpdateCategoryPayload
    >({
      query: ({ slug, ...body }) => ({
        url: `/admin/categories/${slug}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { slug }) => [
        { type: "Category", id: slug },
        { type: "Category", id: "LIST" },
        { type: "Category", id: "PUBLIC_LIST" },
      ],
    }),

    deleteCategory: builder.mutation<{ success: boolean }, string>({
      query: (slug) => ({
        url: `/admin/categories/${slug}/`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Category", id: "LIST" },
        { type: "Category", id: "PUBLIC_LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAdminCategoriesQuery,
  useGetPublicCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;
