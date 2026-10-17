"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { MagnifyingGlassIcon, Pencil1Icon, PlusIcon, ReloadIcon, TrashIcon } from "@radix-ui/react-icons";
import { Button } from "../../components/Button";
import { Input } from "../../components/Form/Inputs";
import { Select } from "../../components/Form/Select";
import { Pagination } from "../../components/Admin/Pagination";
import { RowsPerPage } from "@/app/components/rows-per-page";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";
import { AddUserModal } from "../../components/Admin/AddUserModal";
import { EditUserModal } from "../../components/Admin/EditUserModal";
import { EmptyState, EmptyTableRow } from "@/app/components/EmptyState";
import { apiErrorMessage } from "@/lib/store/base-api";
import {
  useDeleteStaffMemberMutation,
  useGetAdminRolesQuery,
  useGetStaffMembersQuery,
  type StaffMember,
} from "@/lib/store/api/people-api";

const ALL_ROLES = "__all__";

function lastSeen(iso: string | null): string {
  if (!iso) return "Never";
  const d = new Date(iso);
  const mins = Math.round((Date.now() - d.getTime()) / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

const iconBtn =
  "w-8 h-8 rounded-lg border border-light-gray flex items-center justify-center text-faint hover:text-brand-charcoal hover:bg-brand-orange-soft transition-colors disabled:opacity-40 disabled:pointer-events-none";

export default function UsersManagement() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState(ALL_ROLES);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [toEdit, setToEdit] = useState<StaffMember | null>(null);
  const [toRemove, setToRemove] = useState<StaffMember | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setCurrentPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const { data: staff = [], isLoading, isFetching, isError, error, refetch } = useGetStaffMembersQuery({
    q: search || undefined,
    role: roleFilter === ALL_ROLES ? undefined : roleFilter,
  });
  const { data: roles = [] } = useGetAdminRolesQuery();
  const [deleteStaff, { isLoading: isRemoving }] = useDeleteStaffMemberMutation();

  const totalPages = Math.max(1, Math.ceil(staff.length / rowsPerPage));
  const page = Math.min(currentPage, totalPages);
  const pageRows = useMemo(
    () => staff.slice((page - 1) * rowsPerPage, page * rowsPerPage),
    [staff, page, rowsPerPage]
  );
  const hasFilters = !!search || roleFilter !== ALL_ROLES;

  const confirmRemove = async () => {
    if (!toRemove) return;
    try {
      await deleteStaff(toRemove.id).unwrap();
      toast.success(`${toRemove.name || "Team member"} no longer has access.`);
      setToRemove(null);
    } catch (err) {
      toast.error(apiErrorMessage(err, "Couldn't remove this team member."));
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-400 mx-auto pb-12 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-[13px] text-faint">
          Staff who can sign in to the admin, and the role each one holds.{" "}
          <Link href="/admin/roles" className="text-brand-orange-text font-medium hover:underline">
            Manage roles
          </Link>
        </p>
        <Button
          variant="primary"
          iconLeft={<PlusIcon className="w-4 h-4" />}
          onClick={() => setIsAddOpen(true)}
          disabled={!roles.length}
          title={roles.length ? undefined : "Create a role first"}
        >
          Add team member
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-light-gray overflow-hidden flex flex-col">
        <div className="p-4 sm:p-5 flex flex-col lg:flex-row gap-3 lg:items-center justify-between border-b border-light-gray">
          <div className="w-full lg:w-56">
            <Select
              options={[{ value: ALL_ROLES, label: "All roles" }, ...roles.map((r) => ({ value: r.id, label: r.name }))]}
              value={roleFilter}
              onChange={(v) => {
                setRoleFilter(v || ALL_ROLES);
                setCurrentPage(1);
              }}
              searchable={false}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <Input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search name, email or phone"
              aria-label="Search team members"
              containerClassName="flex-1 lg:w-72"
              className="text-[13px]"
              suffixElement={<MagnifyingGlassIcon className="w-4 h-4 text-faint" />}
            />
            <RowsPerPage
              value={rowsPerPage}
              onChange={(v) => {
                setRowsPerPage(v);
                setCurrentPage(1);
              }}
              options={[10, 20, 50, 100]}
            />
            <button type="button" onClick={() => refetch()} aria-label="Refresh team members" title="Refresh" className={iconBtn}>
              <ReloadIcon className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {isError ? (
          <div className="p-6">
            <EmptyState
              illustration="customers"
              title="Couldn't load the team"
              description={apiErrorMessage(error)}
              action={{ label: "Try again", onClick: () => refetch() }}
            />
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="pl-6">Team member</th>
                  <th>Role</th>
                  <th>Phone</th>
                  <th>Last sign-in</th>
                  <th>Status</th>
                  <th className="text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="pl-6">
                        <div className="h-4 bg-light-gray rounded w-36 mb-1.5" />
                        <div className="h-3 bg-light-gray rounded w-44" />
                      </td>
                      <td>
                        <div className="h-5 bg-light-gray rounded-full w-24" />
                      </td>
                      <td>
                        <div className="h-4 bg-light-gray rounded w-24" />
                      </td>
                      <td>
                        <div className="h-4 bg-light-gray rounded w-20" />
                      </td>
                      <td>
                        <div className="h-4 bg-light-gray rounded w-14" />
                      </td>
                      <td>
                        <div className="h-8 bg-light-gray rounded w-20 ml-auto" />
                      </td>
                    </tr>
                  ))
                ) : pageRows.length > 0 ? (
                  pageRows.map((user) => (
                    <tr key={user.id}>
                      <td className="pl-6">
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium text-brand-charcoal truncate">{user.name || "Unnamed"}</span>
                          <span className="text-[12px] text-faint truncate">{user.email || "No email"}</span>
                        </div>
                      </td>
                      <td>
                        {user.is_super_admin ? (
                          <span className="px-2 py-0.5 rounded-full text-[12px] bg-brand-charcoal text-white">Super Admin</span>
                        ) : user.role ? (
                          <span className="px-2 py-0.5 rounded-full text-[12px] bg-brand-orange-soft text-brand-charcoal">
                            {user.role.name}
                          </span>
                        ) : (
                          <span className="text-faint">No role</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap">{user.phone_number || "—"}</td>
                      <td className="whitespace-nowrap" title={user.last_login ?? undefined}>
                        {lastSeen(user.last_login)}
                      </td>
                      <td>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[12px] ${
                            user.is_active ? "bg-success-soft text-success" : "bg-error-soft text-error"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${user.is_active ? "bg-success" : "bg-error"}`} />
                          {user.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="text-right pr-6">
                        <div className="flex justify-end gap-2">
                          <button type="button" className={iconBtn} onClick={() => setToEdit(user)} aria-label={`Edit ${user.name}`} title="Edit">
                            <Pencil1Icon className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            className={`${iconBtn} hover:text-error hover:bg-error-soft`}
                            onClick={() => setToRemove(user)}
                            disabled={user.is_super_admin}
                            aria-label={`Remove ${user.name}`}
                            title={user.is_super_admin ? "A Super Admin can't be removed here" : "Remove access"}
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : hasFilters ? (
                  <EmptyTableRow
                    colSpan={6}
                    illustration="search"
                    title="No matching team members"
                    description="Try a different name, email or role."
                    action={{
                      label: "Clear filters",
                      onClick: () => {
                        setSearchInput("");
                        setSearch("");
                        setRoleFilter(ALL_ROLES);
                      },
                    }}
                  />
                ) : (
                  <EmptyTableRow
                    colSpan={6}
                    illustration="customers"
                    title="No team members yet"
                    description="Staff will appear here once you add them."
                  />
                )}
              </tbody>
            </table>
          </div>
        )}

        {!isError && staff.length > rowsPerPage && (
          <div className="border-t border-light-gray">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={!!toRemove}
        onClose={() => setToRemove(null)}
        onConfirm={confirmRemove}
        isLoading={isRemoving}
        title="Remove team member"
        message={`${toRemove?.name || "This person"} loses their role and their account is deactivated, so they can no longer sign in. Their history stays.`}
        confirmText="Remove access"
        type="danger"
      />

      <AddUserModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} roles={roles} />
      <EditUserModal staff={toEdit} onClose={() => setToEdit(null)} roles={roles} />
    </div>
  );
}
