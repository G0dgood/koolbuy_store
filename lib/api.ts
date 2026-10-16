/**
 * API base URL + token storage for the KoolBuy storefront.
 * All requests go through RTK Query (lib/store/base-api.ts).
 */

export const normalizeApiBase = (baseUrl?: string): string => {
  const envUrl =
    typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL
      : undefined;
  const raw = (baseUrl || envUrl || "").trim().replace(/\/$/, "");
  if (!raw) {
    return "http://127.0.0.1:8001/api/v1";
  }
  return raw.endsWith("/api/v1") ? raw : `${raw}/api/v1`;
};

const TOKEN_KEY = "kb_auth_tokens";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export interface StoredTokens {
  access?: string;
  refresh?: string;
  [k: string]: unknown;
}

export const readStoredTokens = (): StoredTokens | null => {
  if (typeof document !== "undefined") {
    for (const cookie of document.cookie.split(";")) {
      const [name, ...rest] = cookie.trim().split("=");
      if (name === TOKEN_KEY && rest.length > 0) {
        try {
          return JSON.parse(decodeURIComponent(rest.join("="))) as StoredTokens;
        } catch {
          /* fall through */
        }
      }
    }
  }
  if (typeof localStorage !== "undefined") {
    try {
      const raw =
        localStorage.getItem(TOKEN_KEY) || localStorage.getItem("kl_auth_tokens");
      if (raw) return JSON.parse(raw) as StoredTokens;
    } catch {
      /* ignore */
    }
  }
  return null;
};

/** Fired on window whenever stored tokens or the stored user change (login, logout, refresh). */
export const AUTH_CHANGED_EVENT = "kb-auth-changed";

const notifyAuthChanged = (): void => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
  }
};

export const writeStoredTokens = (tokens: StoredTokens): void => {
  const serialized = encodeURIComponent(JSON.stringify(tokens));
  if (typeof document !== "undefined") {
    document.cookie = `${TOKEN_KEY}=${serialized}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  }
  if (typeof localStorage !== "undefined") {
    try {
      localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
    } catch {
      /* ignore */
    }
  }
  notifyAuthChanged();
};

const USER_KEY = "kb_user";

export const readStoredUser = <T = unknown>(): T | null => {
  if (typeof localStorage !== "undefined") {
    try {
      const raw = localStorage.getItem(USER_KEY);
      if (raw) return JSON.parse(raw) as T;
    } catch {
      /* ignore */
    }
  }
  return null;
};

export const writeStoredUser = (user: unknown): void => {
  if (typeof localStorage !== "undefined") {
    try {
      if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(USER_KEY);
      }
    } catch {
      /* ignore */
    }
  }
  notifyAuthChanged();
};

export const clearStoredTokens = (): void => {
  if (typeof document !== "undefined") {
    document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
  }
  if (typeof localStorage !== "undefined") {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem("kl_auth_tokens");
      localStorage.removeItem(USER_KEY);
    } catch {
      /* ignore */
    }
  }
  notifyAuthChanged();
};
