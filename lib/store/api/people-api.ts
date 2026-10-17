/**
 * Admin people endpoints: customers, staff (team members), roles and the
 * permission modules behind them.
 *
 * - GET    /admin/customers/                 customers (individual + buyer), counts, metrics, paging
 * - GET    /admin/customers/:id/             a customer with addresses and recent orders
 * - PATCH  /admin/customers/:id/             { is_active } (activate / deactivate)
 * - POST   /admin/customers/bulk-delete/     { ids } (deactivate several)
 * - GET    /admin/staff/                     staff accounts and their role (≤ 500, not paged)
 * - POST   /admin/staff/                     create a team member
 * - PATCH  /admin/staff/:id/                 edit a team member
 * - DELETE /admin/staff/:id/                 remove access and deactivate
 * - GET    /admin/permission-modules/        modules and their actions
 * - GET    /admin/roles/                     roles with member counts and grants
 * - POST   /admin/roles/                     { name, description?, copy_from? }
 * - PATCH  /admin/roles/:id/                 { name?, description? }
 * - DELETE /admin/roles/:id/                 only when nobody holds it
 * - PUT    /admin/roles/:id/permissions/     { grants }
 */
import { baseApi } from "../base-api";

/* ── Customers ─────────────────────────────────────────────────────────── */

export interface PeopleCustomer {
  id: string;
  numeric_id: number;
  customer_code: string;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
  status: "Active" | "InActive" | string;
  is_active: boolean;
  registration: string;
  date_joined: string;
  last_purchase: string;
  last_purchase_raw: string | null;
  order_count: number;
  total_spend: number;
  formatted_total_spend: string;
  orders_summary: { total: number; completed: number; cancelled: number };
}

export interface PeopleCustomersResponse {
  success: boolean;
  items: PeopleCustomer[];
  counts: { all: number; active: number; inactive: number };
  metrics: {
    total_customers: number;
    active_customers: number;
    inactive_customers: number;
    /** Customers with at least one order. */
    repeat_customers: number;
  };
  pagination: { total: number; page: number; page_size: number; has_next: boolean; has_prev: boolean };
}

export interface PeopleCustomersParams {
  search?: string;
  status?: "all" | "active" | "inactive";
  date_preset?: string;
  from?: string;
  to?: string;
  page?: number;
  page_size?: number;
}

export interface PeopleCustomerDetail extends PeopleCustomer {
  addresses: { id: string; address: string; city: string; state: string; country: string; is_default: boolean }[];
  orders: {
    id: string;
    order_number: string;
    status: string;
    total_amount: number;
    created_at: string;
    delivered_at: string | null;
  }[];
}

/* ── Staff ─────────────────────────────────────────────────────────────── */

export interface StaffMember {
  id: string;
  name: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone_number: string | null;
  is_active: boolean;
  is_super_admin: boolean;
  role: { id: string; name: string } | null;
  role_assigned_at: string | null;
  last_login: string | null;
}

export interface CreateStaffBody {
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string | null;
  role_id: string;
  password: string;
}

export interface UpdateStaffBody {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string | null;
  role_id?: string;
  password?: string;
}

/* ── Roles and permissions ─────────────────────────────────────────────── */

export type ModuleAction = "view" | "create" | "edit" | "delete";

export interface PermissionModule {
  key: string;
  name: string;
  section: string;
  about: string;
  actions: ModuleAction[];
}

export interface RoleGrant {
  module: string;
  access: boolean;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

export interface AdminRole {
  id: string;
  name: string;
  description: string;
  is_system: boolean;
  member_count: number;
  created_at: string;
  updated_at: string;
  grants: RoleGrant[];
}

const CUSTOMERS = { type: "User" as const, id: "CUSTOMERS" };
const STAFF = { type: "User" as const, id: "STAFF" };
const ROLES = { type: "User" as const, id: "ROLES" };

export const peopleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPeopleCustomers: builder.query<PeopleCustomersResponse, PeopleCustomersParams>({
      query: (p) => {
        const qs = new URLSearchParams();
        if (p.search) qs.set("search", p.search);
        if (p.status && p.status !== "all") qs.set("status", p.status);
        if (p.date_preset) qs.set("date_preset", p.date_preset);
        if (p.from) qs.set("from", p.from);
        if (p.to) qs.set("to", p.to);
        if (p.page) qs.set("page", String(p.page));
        if (p.page_size) qs.set("page_size", String(p.page_size));
        const s = qs.toString();
        return `/admin/customers/${s ? `?${s}` : ""}`;
      },
      providesTags: [CUSTOMERS],
    }),

    getPeopleCustomer: builder.query<PeopleCustomerDetail, string>({
      query: (id) => `/admin/customers/${encodeURIComponent(id)}/`,
      transformResponse: (r: { customer: PeopleCustomerDetail }) => r.customer,
      providesTags: (_r, _e, id) => [{ type: "User", id: `CUSTOMER-${id}` }],
    }),

    setPeopleCustomerActive: builder.mutation<{ success: boolean }, { id: string; is_active: boolean }>({
      query: ({ id, is_active }) => ({
        url: `/admin/customers/${encodeURIComponent(id)}/`,
        method: "PATCH",
        body: { is_active },
      }),
      invalidatesTags: (_r, _e, { id }) => [CUSTOMERS, { type: "User", id: `CUSTOMER-${id}` }],
    }),

    deactivatePeopleCustomers: builder.mutation<{ success: boolean; count: number; message: string }, string[]>({
      query: (ids) => ({ url: "/admin/customers/bulk-delete/", method: "POST", body: { ids } }),
      invalidatesTags: [CUSTOMERS],
    }),

    getStaffMembers: builder.query<StaffMember[], { q?: string; role?: string } | void>({
      query: (p) => {
        const qs = new URLSearchParams();
        if (p?.q) qs.set("q", p.q);
        if (p?.role) qs.set("role", p.role);
        const s = qs.toString();
        return `/admin/staff/${s ? `?${s}` : ""}`;
      },
      transformResponse: (r: { items: StaffMember[] }) => r.items ?? [],
      providesTags: [STAFF],
    }),

    createStaffMember: builder.mutation<{ success: boolean }, CreateStaffBody>({
      query: (body) => ({ url: "/admin/staff/", method: "POST", body }),
      invalidatesTags: [STAFF, ROLES],
    }),

    updateStaffMember: builder.mutation<{ success: boolean }, UpdateStaffBody>({
      query: ({ id, ...body }) => ({ url: `/admin/staff/${encodeURIComponent(id)}/`, method: "PATCH", body }),
      invalidatesTags: [STAFF, ROLES],
    }),

    deleteStaffMember: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `/admin/staff/${encodeURIComponent(id)}/`, method: "DELETE" }),
      invalidatesTags: [STAFF, ROLES],
    }),

    getPermissionModules: builder.query<{ actions: ModuleAction[]; items: PermissionModule[] }, void>({
      query: () => "/admin/permission-modules/",
    }),

    getAdminRoles: builder.query<AdminRole[], void>({
      query: () => "/admin/roles/",
      transformResponse: (r: { items: AdminRole[] }) => r.items ?? [],
      providesTags: [ROLES],
    }),

    createAdminRole: builder.mutation<
      { success: boolean; role: { id: string; name: string } },
      { name: string; description?: string; copy_from?: string }
    >({
      query: (body) => ({ url: "/admin/roles/", method: "POST", body }),
      invalidatesTags: [ROLES],
    }),

    updateAdminRole: builder.mutation<{ success: boolean }, { id: string; name?: string; description?: string }>({
      query: ({ id, ...body }) => ({ url: `/admin/roles/${encodeURIComponent(id)}/`, method: "PATCH", body }),
      invalidatesTags: [ROLES, STAFF],
    }),

    deleteAdminRole: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `/admin/roles/${encodeURIComponent(id)}/`, method: "DELETE" }),
      invalidatesTags: [ROLES],
    }),

    setAdminRolePermissions: builder.mutation<
      { success: boolean; gained: string[]; lost: string[] },
      { id: string; grants: RoleGrant[] }
    >({
      query: ({ id, grants }) => ({
        url: `/admin/roles/${encodeURIComponent(id)}/permissions/`,
        method: "PUT",
        body: { grants },
      }),
      invalidatesTags: [ROLES],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPeopleCustomersQuery,
  useGetPeopleCustomerQuery,
  useSetPeopleCustomerActiveMutation,
  useDeactivatePeopleCustomersMutation,
  useGetStaffMembersQuery,
  useCreateStaffMemberMutation,
  useUpdateStaffMemberMutation,
  useDeleteStaffMemberMutation,
  useGetPermissionModulesQuery,
  useGetAdminRolesQuery,
  useCreateAdminRoleMutation,
  useUpdateAdminRoleMutation,
  useDeleteAdminRoleMutation,
  useSetAdminRolePermissionsMutation,
} = peopleApi;
