/**
 * KoolBuy engine RTK Query endpoints for the KoolBuy backend.
 */
import { baseApi } from "../base-api";

export interface KoolBuyHealthResponse {
  success: boolean;
  engine: string;
  version: string;
}

export interface CustomerHandoffPayload {
  phone_number: string;
  name: string;
  email?: string;
  address?: string;
}

export interface CustomerHandoffResponse {
  success: boolean;
  message?: string;
  vendor_id?: string;
  setup_link?: string;
}

export const koolbuyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getKoolBuyHealth: builder.query<KoolBuyHealthResponse, void>({
      query: () => `/koolbuy/health/`,
      providesTags: [{ type: "KoolBuy", id: "HEALTH" }],
    }),

    createCustomerHandoff: builder.mutation<
      CustomerHandoffResponse,
      CustomerHandoffPayload
    >({
      query: (body) => ({
        url: `/integrations/koolbuy/customers/`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "User", id: "CURRENT" }],
    }),

    confirmPasswordSetup: builder.mutation<
      { success: boolean; message?: string },
      { token: string; password: string }
    >({
      query: (body) => ({
        url: `/integrations/koolbuy/password-setup/confirm/`,
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetKoolBuyHealthQuery,
  useCreateCustomerHandoffMutation,
  useConfirmPasswordSetupMutation,
} = koolbuyApi;
