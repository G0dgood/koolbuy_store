/**
 * Audit Logs RTK Query endpoints for KoolBuy Admin.
 */
import { baseApi } from "../base-api";

export interface AuditLogActor {
  id: string | null;
  label: string;
  email: string | null;
}

export interface AuditLogEntry {
  id: string;
  created_at: string;
  action: string;
  category: string;
  actor: AuditLogActor;
  entity_type: string;
  entity_id: string;
  entity_label: string;
  summary: string;
  changes: Record<string, any>;
  metadata: Record<string, any>;
  ip_address: string;
  redacted: boolean;
}

export interface AuditCategory {
  key: string;
  label: string;
}

export interface AuditLogsQueryParams {
  page?: number;
  page_size?: number;
  category?: string;
  action?: string;
  entity_type?: string;
  entity_id?: string;
  actor?: string;
  date_from?: string;
  date_to?: string;
  q?: string;
}

export interface AuditLogsResponse {
  success: boolean;
  items: AuditLogEntry[];
  pagination: {
    total: number;
    page: number;
    page_size: number;
    has_next: boolean;
    has_prev: boolean;
  };
  categories?: AuditCategory[];
}

export interface AuditLogStats {
  total: number;
  todayCount: number;
  flaggedCount: number;
  monitoredEntitiesCount: number;
  retentionDays: number;
}

export interface AuditLogStatsResponse {
  success: boolean;
  stats: AuditLogStats;
}

export interface AuditLogDetailResponse {
  success: boolean;
  item: AuditLogEntry;
}

export const auditLogsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAuditLogs: builder.query<AuditLogsResponse, AuditLogsQueryParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.set("page", String(params.page));
        if (params?.page_size) queryParams.set("page_size", String(params.page_size));
        if (params?.category && params.category !== "all") queryParams.set("category", params.category);
        if (params?.action && params.action !== "all") queryParams.set("action", params.action);
        if (params?.entity_type && params.entity_type !== "all") queryParams.set("entity_type", params.entity_type);
        if (params?.entity_id) queryParams.set("entity_id", params.entity_id);
        if (params?.actor) queryParams.set("actor", params.actor);
        if (params?.date_from) queryParams.set("date_from", params.date_from);
        if (params?.date_to) queryParams.set("date_to", params.date_to);
        if (params?.q?.trim()) queryParams.set("q", params.q.trim());

        const qs = queryParams.toString();
        return `/admin/audit-log/${qs ? `?${qs}` : ""}`;
      },
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map(({ id }) => ({ type: "AuditLog" as const, id })),
              { type: "AuditLog", id: "LIST" },
            ]
          : [{ type: "AuditLog", id: "LIST" }],
    }),

    getAuditLogStats: builder.query<AuditLogStatsResponse, void>({
      query: () => `/admin/audit-log/stats/`,
      providesTags: [{ type: "AuditLog", id: "STATS" }],
    }),

    getAuditLogById: builder.query<AuditLogDetailResponse, string>({
      query: (id) => `/admin/audit-log/${id}/`,
      providesTags: (_result, _error, id) => [{ type: "AuditLog", id }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAuditLogsQuery,
  useGetAuditLogStatsQuery,
  useGetAuditLogByIdQuery,
} = auditLogsApi;
