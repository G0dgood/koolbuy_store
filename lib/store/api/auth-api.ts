/**
 * Authentication and User Profile RTK Query endpoints for KoolBuy storefront.
 */
import { baseApi } from "../base-api";
import { writeStoredTokens, clearStoredTokens, writeStoredUser } from "@/lib/api";

export interface UserProfile {
  id: string;
  email?: string;
  phone_number?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  profile_image_url?: string;
  role?: string;
  is_staff?: boolean;
  is_superuser?: boolean;
  staff?: {
    is_super_admin?: boolean;
    role?: string | null;
    roles?: string[];
    permissions?: string[];
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface LoginPayload {
  phone_number?: string;
  email?: string;
  identifier?: string;
  password?: string;
  otp?: string;
}

export interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
}

export interface AuthResponse {
  access?: string;
  refresh?: string;
  user?: UserProfile;
  [key: string]: unknown;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginPayload>({
      query: (credentials) => ({
        url: `/auth/login/`,
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.access) {
            writeStoredTokens({
              access: data.access,
              refresh: data.refresh,
            });
            if (data.user) {
              writeStoredUser(data.user);
            }
            dispatch(authApi.util.invalidateTags([{ type: "User", id: "CURRENT" }]));
          }
        } catch {
          /* ignore error here */
        }
      },
      invalidatesTags: [{ type: "User", id: "CURRENT" }],
    }),

    register: builder.mutation<AuthResponse, RegisterPayload>({
      query: (payload) => ({
        url: `/koolbuy/register/`,
        method: "POST",
        body: payload,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.access) {
            writeStoredTokens({
              access: data.access,
              refresh: data.refresh,
            });
            if (data.user) {
              writeStoredUser(data.user);
            }
            dispatch(authApi.util.invalidateTags([{ type: "User", id: "CURRENT" }]));
          }
        } catch {
          /* ignore error here */
        }
      },
      invalidatesTags: [{ type: "User", id: "CURRENT" }],
    }),

    getProfile: builder.query<UserProfile, void>({
      query: () => `/users/me/`,
      providesTags: [{ type: "User", id: "CURRENT" }],
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            writeStoredUser(data);
          }
        } catch {
          /* ignore */
        }
      },
    }),

    updateProfile: builder.mutation<UserProfile, Partial<UserProfile>>({
      query: (body) => ({
        url: `/users/me/profile/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "User", id: "CURRENT" }],
    }),

    logout: builder.mutation<void, void>({
      queryFn: async (_arg, api) => {
        clearStoredTokens();
        writeStoredUser(null);
        api.dispatch(baseApi.util.resetApiState());
        return { data: undefined };
      },
      invalidatesTags: [{ type: "User", id: "CURRENT" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useLogoutMutation,
} = authApi;
