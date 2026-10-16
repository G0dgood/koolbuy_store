/**
 * RTK Query base API for KoolBuy storefront.
 *
 * Feature files add their endpoints with `baseApi.injectEndpoints(...)`
 * so the store only ever holds one API slice.
 */
import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { Mutex } from "./mutex";
import {
  clearStoredTokens,
  normalizeApiBase,
  readStoredTokens,
  writeStoredTokens,
} from "@/lib/api";

const baseUrl = normalizeApiBase(
  process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL
);

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  timeout: 20000,
  prepareHeaders: (headers) => {
    if (!headers.has("Authorization")) {
      const access = readStoredTokens()?.access;
      if (access && access !== "undefined" && access !== "null") {
        headers.set("Authorization", `Bearer ${access}`);
      }
    }
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    return headers;
  },
});

const refreshLock = new Mutex();

interface ErrorBody {
  error?: { code?: string; message?: string } | string;
  code?: string;
  detail?: string;
  message?: string;
}

function errorCode(error: FetchBaseQueryError | undefined): string | undefined {
  if (!error || typeof error.status !== "number") return undefined;
  const body = (error.data ?? {}) as ErrorBody;
  if (typeof body.error === "object" && body.error?.code) return body.error.code;
  return body.code;
}

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await refreshLock.waitForUnlock();
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401 && errorCode(result.error) === "token_not_valid") {
    if (!refreshLock.isLocked()) {
      const release = await refreshLock.acquire();
      try {
        const refresh = readStoredTokens()?.refresh;
        const refreshed = refresh
          ? await rawBaseQuery(
              { url: "/auth/token/refresh/", method: "POST", body: { refresh } },
              api,
              extraOptions
            )
          : null;
        const data = refreshed?.data as { access?: string; refresh?: string } | undefined;
        if (data?.access) {
          writeStoredTokens({ access: data.access, refresh: data.refresh ?? refresh });
          result = await rawBaseQuery(args, api, extraOptions);
        } else {
          clearStoredTokens();
          api.dispatch(baseApi.util.resetApiState());
        }
      } finally {
        release();
      }
    } else {
      await refreshLock.waitForUnlock();
      result = await rawBaseQuery(args, api, extraOptions);
    }
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Product",
    "Category",
    "Cart",
    "Order",
    "User",
    "Wishlist",
    "KoolBuy",
    "Store",
    "Vendor",
    "AuditLog",
    "Transaction",
    "Financing",
    "Refund",
    "Accounting",
    "Customer",
  ],
  endpoints: () => ({}),
});

/** A readable error message from any RTK Query error */
export function apiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again."
): string {
  if (!error || typeof error !== "object") return fallback;
  if ("status" in error) {
    const e = error as FetchBaseQueryError;
    if (e.status === "FETCH_ERROR")
      return "We couldn't reach the server. Check your connection and try again.";
    if (e.status === "TIMEOUT_ERROR")
      return "The server took too long to respond. Please try again.";
    const body = (e.data ?? {}) as ErrorBody;
    if (typeof body.error === "object" && body.error?.message) return body.error.message;
    if (typeof body.error === "string" && body.error) return body.message || body.error;
    return body.message || body.detail || fallback;
  }
  if ("message" in error && typeof (error as { message?: unknown }).message === "string") {
    return (error as { message: string }).message || fallback;
  }
  return fallback;
}
