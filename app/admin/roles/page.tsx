"use client";

import React, { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { LockClosedIcon, MagnifyingGlassIcon, Pencil1Icon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import Checkbox from "@/app/components/Checkbox";
import { Button } from "@/app/components/Button";
import { Input } from "@/app/components/Form/Inputs";
import { Select } from "@/app/components/Form/Select";
import { TabFilter } from "@/app/components/Admin/TabFilter";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";
import Modal from "@/app/components/Modal/Modal";
import ModalBody from "@/app/components/Modal/ModalBody";
import ModalFooter from "@/app/components/Modal/ModalFooter";
import { EmptyState, EmptyTableRow } from "@/app/components/EmptyState";
import { apiErrorMessage } from "@/lib/store/base-api";
import {
  useCreateAdminRoleMutation,
  useDeleteAdminRoleMutation,
  useGetAdminRolesQuery,
  useGetPermissionModulesQuery,
  useGetStaffMembersQuery,
  useSetAdminRolePermissionsMutation,
  useUpdateAdminRoleMutation,
  type AdminRole,
  type ModuleAction,
  type PermissionModule,
  type RoleGrant,
} from "@/lib/store/api/people-api";

const ACTIONS: ModuleAction[] = ["view", "create", "edit", "delete"];
const ACTION_LABEL: Record<ModuleAction, string> = { view: "View", create: "Create", edit: "Edit", delete: "Delete" };
const TABS = ["Permissions", "Members"] as const;
type Tab = (typeof TABS)[number];

const iconBtn =
  "w-8 h-8 rounded-lg border border-light-gray flex items-center justify-center text-faint hover:text-brand-charcoal hover:bg-brand-orange-soft transition-colors disabled:opacity-40 disabled:pointer-events-none";

const blankGrant = (module: string): RoleGrant => ({ module, access: false, view: false, create: false, edit: false, delete: false });

/** Grants keyed by module, covering every module (missing ones are off). */
function grantMap(modules: PermissionModule[], grants: RoleGrant[]): Record<string, RoleGrant> {
  const out: Record<string, RoleGrant> = {};
  for (const m of modules) out[m.key] = { ...(grants.find((g) => g.module === m.key) ?? blankGrant(m.key)) };
  return out;
}

/** Same rules as the API: View is Access; Create / Edit / Delete need it. */
function toggleGrant(g: RoleGrant, action: ModuleAction, on: boolean): RoleGrant {
  if (action === "view") return on ? { ...g, access: true, view: true } : blankGrant(g.module);
  return on ? { ...g, access: true, view: true, [action]: true } : { ...g, [action]: false };
}

const sameGrant = (a: RoleGrant, b: RoleGrant) => ACTIONS.every((k) => a[k] === b[k]) && a.access === b.access;

export default function RolesPage() {
  return (
    <Suspense fallback={null}>
      <RolesManagement />
    </Suspense>
  );
}

function RolesManagement() {
  const searchParams = useSearchParams();
  const { data: roles = [], isLoading: rolesLoading, isError: rolesError, error: rolesErr, refetch: refetchRoles } =
    useGetAdminRolesQuery();
  const {
    data: modulesData,
    isLoading: modulesLoading,
    isError: modulesError,
    error: modulesErr,
    refetch: refetchModules,
  } = useGetPermissionModulesQuery();
  const modules = useMemo(() => modulesData?.items ?? [], [modulesData]);

  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(searchParams.get("role"));
  const [roleSearch, setRoleSearch] = useState("");
  const [tab, setTab] = useState<Tab>("Permissions");
  const [drafts, setDrafts] = useState<Record<string, Record<string, RoleGrant>>>({});
  const [roleModal, setRoleModal] = useState<{ mode: "create" } | { mode: "edit"; role: AdminRole } | null>(null);
  const [toDelete, setToDelete] = useState<AdminRole | null>(null);

  const [savePermissions, { isLoading: isSaving }] = useSetAdminRolePermissionsMutation();
  const [deleteRole, { isLoading: isDeleting }] = useDeleteAdminRoleMutation();

  const selectedRole = roles.find((r) => r.id === selectedRoleId) ?? roles[0] ?? null;

  const filteredRoles = useMemo(() => {
    const q = roleSearch.trim().toLowerCase();
    if (!q) return roles;
    return roles.filter((r) => r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q));
  }, [roles, roleSearch]);

  const saved = useMemo(
    () => (selectedRole ? grantMap(modules, selectedRole.grants) : {}),
    [modules, selectedRole]
  );
  const current = (selectedRole && drafts[selectedRole.id]) || saved;
  const isDirty = !!selectedRole && !!drafts[selectedRole.id] && modules.some((m) => !sameGrant(current[m.key], saved[m.key]));

  const sections = useMemo(() => {
    const out: { section: string; items: PermissionModule[] }[] = [];
    for (const m of modules) {
      const s = out.find((x) => x.section === m.section);
      if (s) s.items.push(m);
      else out.push({ section: m.section, items: [m] });
    }
    return out;
  }, [modules]);

  const onToggle = (moduleKey: string, action: ModuleAction, on: boolean) => {
    if (!selectedRole) return;
    setDrafts((d) => {
      const base = d[selectedRole.id] ?? saved;
      return { ...d, [selectedRole.id]: { ...base, [moduleKey]: toggleGrant(base[moduleKey], action, on) } };
    });
  };

  const discard = () => {
    if (!selectedRole) return;
    setDrafts((d) => {
      const next = { ...d };
      delete next[selectedRole.id];
      return next;
    });
  };

  const save = async () => {
    if (!selectedRole) return;
    try {
      const res = await savePermissions({ id: selectedRole.id, grants: modules.map((m) => current[m.key]) }).unwrap();
      discard();
      const changes = (res.gained?.length ?? 0) + (res.lost?.length ?? 0);
      toast.success(changes ? `Saved permissions for ${selectedRole.name}.` : "No permission changes to save.");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Couldn't save these permissions."));
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteRole(toDelete.id).unwrap();
      toast.success(`Deleted the role "${toDelete.name}".`);
      if (selectedRoleId === toDelete.id) setSelectedRoleId(null);
      setToDelete(null);
    } catch (err) {
      toast.error(apiErrorMessage(err, "Couldn't delete this role."));
    }
  };

  if (rolesError || modulesError) {
    return (
      <EmptyState
        variant="card"
        illustration="settings"
        title="Couldn't load roles"
        description={apiErrorMessage(rolesErr ?? modulesErr)}
        action={{
          label: "Try again",
          onClick: () => {
            refetchRoles();
            refetchModules();
          },
        }}
      />
    );
  }

  const loading = rolesLoading || modulesLoading;
  const deleteBlocked = selectedRole
    ? selectedRole.is_system
      ? "The Administrator role can't be deleted"
      : selectedRole.member_count > 0
        ? "Move its members to another role first"
        : null
    : null;

  return (
    <div className="flex flex-col gap-6 mx-auto pb-16 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Roles list */}
        <div className="lg:col-span-4 bg-white rounded-lg border border-light-gray overflow-hidden flex flex-col">
          <div className="p-4 border-b border-light-gray flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-[15px] font-semibold text-brand-charcoal">Roles</h2>
                <p className="text-[12px] text-faint">
                  {loading ? "Loading…" : `${roles.length} role${roles.length === 1 ? "" : "s"}`}
                </p>
              </div>
              <Button variant="primary" size="sm" iconLeft={<PlusIcon className="w-3.5 h-3.5" />} onClick={() => setRoleModal({ mode: "create" })}>
                New role
              </Button>
            </div>
            <Input
              type="search"
              placeholder="Search roles"
              aria-label="Search roles"
              value={roleSearch}
              onChange={(e) => setRoleSearch(e.target.value)}
              className="text-[13px]"
              suffixElement={<MagnifyingGlassIcon className="w-4 h-4 text-faint" />}
            />
          </div>

          <div className="flex flex-col divide-y divide-light-gray max-h-160 overflow-y-auto">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="p-3.5 animate-pulse">
                  <div className="h-4 w-32 bg-light-gray rounded mb-1.5" />
                  <div className="h-3 w-48 bg-light-gray rounded" />
                </div>
              ))
            ) : filteredRoles.length === 0 ? (
              roles.length === 0 ? (
                <EmptyState
                  size="sm"
                  illustration="settings"
                  title="No roles yet"
                  description="Create a role to decide what staff can see and do."
                />
              ) : (
                <EmptyState size="sm" illustration="search" title="No matching roles" description="Try a different name." />
              )
            ) : (
              filteredRoles.map((role) => {
                const isSelected = role.id === selectedRole?.id;
                return (
                  <button
                    type="button"
                    key={role.id}
                    onClick={() => setSelectedRoleId(role.id)}
                    aria-current={isSelected}
                    className={`p-3.5 text-left transition-colors flex items-center justify-between gap-3 border-l-2 ${
                      isSelected ? "bg-brand-orange-soft border-l-brand-orange" : "border-l-transparent hover:bg-off-white"
                    }`}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5">
                        <span className="text-[13px] font-medium text-brand-charcoal truncate">{role.name}</span>
                        {role.is_system && <LockClosedIcon className="w-3.5 h-3.5 text-faint shrink-0" aria-label="System role" />}
                        {drafts[role.id] && <span className="w-1.5 h-1.5 rounded-full bg-brand-orange shrink-0" title="Unsaved changes" />}
                      </span>
                      <span className="text-[12px] text-faint block truncate mt-0.5">{role.description || "No description"}</span>
                    </span>
                    <span className="text-[12px] px-2 py-0.5 rounded-full bg-off-white text-subtle shrink-0 tabular-nums">
                      {role.member_count} {role.member_count === 1 ? "member" : "members"}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Selected role */}
        <div className="lg:col-span-8 bg-white rounded-lg border border-light-gray overflow-hidden flex flex-col">
          {loading ? (
            <div className="p-5 flex flex-col gap-3 animate-pulse">
              <div className="h-5 w-48 bg-light-gray rounded" />
              <div className="h-3 w-80 bg-light-gray rounded" />
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-10 bg-light-gray rounded" />
              ))}
            </div>
          ) : !selectedRole ? (
            <EmptyState illustration="settings" title="No role selected" description="Create a role to set its permissions." />
          ) : (
            <>
              <div className="p-4 sm:p-5 border-b border-light-gray flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="text-[15px] font-semibold text-brand-charcoal">{selectedRole.name}</h2>
                      {selectedRole.is_system && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-off-white text-subtle">System role</span>
                      )}
                    </div>
                    <p className="text-[13px] text-faint mt-0.5">{selectedRole.description || "No description"}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      className={iconBtn}
                      onClick={() => setRoleModal({ mode: "edit", role: selectedRole })}
                      aria-label="Edit role details"
                      title="Edit details"
                    >
                      <Pencil1Icon className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className={`${iconBtn} hover:text-error hover:bg-error-soft`}
                      onClick={() => setToDelete(selectedRole)}
                      disabled={!!deleteBlocked}
                      aria-label="Delete role"
                      title={deleteBlocked ?? "Delete role"}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <TabFilter
                  tabs={[...TABS]}
                  activeTab={tab}
                  onChange={(t) => setTab(t as Tab)}
                />
              </div>

              {tab === "Permissions" ? (
                <div className="flex flex-col">
                  <div className="admin-table-container">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="pl-6">Module</th>
                          {ACTIONS.map((a) => (
                            <th key={a} className="text-center w-20">
                              {ACTION_LABEL[a]}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sections.length === 0 ? (
                          <EmptyTableRow
                            colSpan={5}
                            illustration="settings"
                            title="No permission modules"
                            description="Modules will appear here once the server lists them."
                          />
                        ) : (
                          sections.map(({ section, items }) => (
                            <React.Fragment key={section}>
                              <tr>
                                <td colSpan={5} className="pl-6 bg-off-white text-[12px] font-semibold text-faint">
                                  {section}
                                </td>
                              </tr>
                              {items.map((m) => {
                                const g = current[m.key] ?? blankGrant(m.key);
                                return (
                                  <tr key={m.key}>
                                    <td className="pl-6">
                                      <div className="flex flex-col max-w-md">
                                        <span className="font-medium text-brand-charcoal">{m.name}</span>
                                        <span className="text-[12px] text-faint leading-relaxed">{m.about}</span>
                                      </div>
                                    </td>
                                    {ACTIONS.map((a) => (
                                      <td key={a} className="text-center">
                                        {m.actions.includes(a) ? (
                                          <div className="flex justify-center">
                                            <Checkbox
                                              checked={a === "view" ? g.access || g.view : g[a]}
                                              onChange={(on) => onToggle(m.key, a, on)}
                                              ariaLabel={`${ACTION_LABEL[a]} ${m.name}`}
                                            />
                                          </div>
                                        ) : (
                                          <span className="text-faint" aria-hidden>
                                            —
                                          </span>
                                        )}
                                      </td>
                                    ))}
                                  </tr>
                                );
                              })}
                            </React.Fragment>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="sticky bottom-0 bg-white border-t border-light-gray p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <p className="text-[12px] text-faint">
                      View turns a module on. Create, edit and delete need view. You can only grant what you hold yourself.
                    </p>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button variant="outline" onClick={discard} disabled={!isDirty || isSaving}>
                        Discard
                      </Button>
                      <Button variant="primary" onClick={save} disabled={!isDirty || isSaving} isLoading={isSaving}>
                        Save permissions
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <RoleMembers role={selectedRole} />
              )}
            </>
          )}
        </div>
      </div>

      <RoleModal state={roleModal} roles={roles} onClose={() => setRoleModal(null)} onCreated={(id) => setSelectedRoleId(id)} />

      <ConfirmationModal
        isOpen={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
        title="Delete role"
        message={`Delete "${toDelete?.name}"? Nobody holds it, so no one loses access.`}
        confirmText="Delete role"
        type="danger"
      />
    </div>
  );
}

function RoleMembers({ role }: { role: AdminRole }) {
  const { data: members = [], isLoading, isError, error, refetch } = useGetStaffMembersQuery({ role: role.id });

  if (isError) {
    return (
      <EmptyState
        illustration="customers"
        title="Couldn't load members"
        description={apiErrorMessage(error)}
        action={{ label: "Try again", onClick: () => refetch() }}
      />
    );
  }

  return (
    <div className="flex flex-col">
      <div className="admin-table-container">
        <table className="w-full">
          <thead>
            <tr>
              <th className="pl-6">Member</th>
              <th>Phone</th>
              <th>Assigned</th>
              <th className="pr-6">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="pl-6">
                    <div className="h-4 w-36 bg-light-gray rounded mb-1.5" />
                    <div className="h-3 w-44 bg-light-gray rounded" />
                  </td>
                  <td>
                    <div className="h-4 w-24 bg-light-gray rounded" />
                  </td>
                  <td>
                    <div className="h-4 w-20 bg-light-gray rounded" />
                  </td>
                  <td className="pr-6">
                    <div className="h-4 w-14 bg-light-gray rounded" />
                  </td>
                </tr>
              ))
            ) : members.length === 0 ? (
              <EmptyTableRow
                colSpan={4}
                illustration="customers"
                title="No members yet"
                description="Staff given this role will appear here."
                action={{ label: "Go to team", href: "/admin/users" }}
              />
            ) : (
              members.map((m) => (
                <tr key={m.id}>
                  <td className="pl-6">
                    <div className="flex flex-col min-w-0">
                      <span className="font-medium text-brand-charcoal truncate">{m.name || "Unnamed"}</span>
                      <span className="text-[12px] text-faint truncate">{m.email || "No email"}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap">{m.phone_number || "—"}</td>
                  <td className="whitespace-nowrap">
                    {m.role_assigned_at
                      ? new Date(m.role_assigned_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                      : "—"}
                  </td>
                  <td className="pr-6">
                    <span className={m.is_active ? "text-success" : "text-error"}>{m.is_active ? "Active" : "Inactive"}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {members.length > 0 && (
        <p className="p-4 border-t border-light-gray text-[12px] text-faint">
          To change someone&apos;s role, edit them on the{" "}
          <Link href="/admin/users" className="text-brand-orange-text font-medium hover:underline">
            team page
          </Link>
          .
        </p>
      )}
    </div>
  );
}

const NO_COPY = "__none__";

function RoleModal({
  state,
  roles,
  onClose,
  onCreated,
}: {
  state: { mode: "create" } | { mode: "edit"; role: AdminRole } | null;
  roles: AdminRole[];
  onClose: () => void;
  onCreated: (id: string) => void;
}) {
  const key = state ? (state.mode === "edit" ? state.role.id : "create") : "closed";
  return (
    <Modal isOpen={!!state} onClose={onClose} title={state?.mode === "edit" ? "Edit role" : "New role"} size="md">
      {state && <RoleForm key={key} state={state} roles={roles} onClose={onClose} onCreated={onCreated} />}
    </Modal>
  );
}

function RoleForm({
  state,
  roles,
  onClose,
  onCreated,
}: {
  state: { mode: "create" } | { mode: "edit"; role: AdminRole };
  roles: AdminRole[];
  onClose: () => void;
  onCreated: (id: string) => void;
}) {
  const editing = state.mode === "edit" ? state.role : null;
  const [name, setName] = useState(editing?.name ?? "");
  const [description, setDescription] = useState(editing?.description ?? "");
  const [copyFrom, setCopyFrom] = useState(NO_COPY);
  const [nameError, setNameError] = useState<string | null>(null);
  const [createRole, { isLoading: creating }] = useCreateAdminRoleMutation();
  const [updateRole, { isLoading: updating }] = useUpdateAdminRoleMutation();
  const busy = creating || updating;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const n = name.trim();
    if (n.length < 2) return setNameError("Give the role a name (at least 2 characters).");
    if (n.length > 80) return setNameError("Keep the name under 80 characters.");
    const clash = roles.find((r) => r.name.toLowerCase() === n.toLowerCase() && r.id !== editing?.id);
    if (clash) return setNameError(`A role called "${clash.name}" already exists.`);
    try {
      if (editing) {
        await updateRole({
          id: editing.id,
          ...(n !== editing.name && !editing.is_system ? { name: n } : {}),
          description: description.trim(),
        }).unwrap();
        toast.success(`Updated "${n}".`);
      } else {
        const res = await createRole({
          name: n,
          description: description.trim(),
          ...(copyFrom !== NO_COPY ? { copy_from: copyFrom } : {}),
        }).unwrap();
        toast.success(`Created "${n}". Now choose what it can do.`);
        onCreated(res.role.id);
      }
      onClose();
    } catch (err) {
      toast.error(apiErrorMessage(err, editing ? "Couldn't update this role." : "Couldn't create this role."));
    }
  };

  return (
    <form onSubmit={submit} noValidate>
      <ModalBody className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-[12px] font-medium text-brand-charcoal">Name</span>
          <Input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setNameError(null);
            }}
            maxLength={80}
            disabled={!!editing?.is_system}
            error={!!nameError}
            placeholder="e.g. Customer Support"
          />
          {editing?.is_system && <span className="text-[12px] text-faint">The Administrator role can&apos;t be renamed.</span>}
          {nameError && <span className="text-[12px] text-error">{nameError}</span>}
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[12px] font-medium text-brand-charcoal">
            Description <span className="text-faint font-normal">(optional)</span>
          </span>
          <textarea
            rows={3}
            maxLength={500}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What this role is for"
            className="w-full text-[13px] p-3 bg-white border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange text-brand-charcoal leading-relaxed"
          />
        </label>
        {!editing && roles.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <span className="text-[12px] font-medium text-brand-charcoal">Start with permissions from</span>
            <Select
              options={[{ value: NO_COPY, label: "Nothing (start empty)" }, ...roles.map((r) => ({ value: r.id, label: r.name }))]}
              value={copyFrom}
              onChange={(v) => setCopyFrom(v || NO_COPY)}
            />
          </div>
        )}
      </ModalBody>
      <ModalFooter className="py-4">
        <Button type="button" variant="outline" onClick={onClose} disabled={busy}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={busy} isLoading={busy}>
          {editing ? "Save" : "Create role"}
        </Button>
      </ModalFooter>
    </form>
  );
}
