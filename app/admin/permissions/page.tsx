"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { CheckIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Input } from "../../components/Form/Inputs";
import { Select } from "../../components/Form/Select";
import { EmptyState, EmptyTableRow } from "@/app/components/EmptyState";
import { apiErrorMessage } from "@/lib/store/base-api";
import {
  useGetAdminRolesQuery,
  useGetPermissionModulesQuery,
  type ModuleAction,
  type PermissionModule,
  type RoleGrant,
} from "@/lib/store/api/people-api";

const ALL_SECTIONS = "__all__";
const ACTION_LABEL: Record<ModuleAction, string> = { view: "view", create: "create", edit: "edit", delete: "delete" };

/** "Full", "View", "View, edit" or null when the role has no access. */
function describe(module: PermissionModule, grant: RoleGrant | undefined): { label: string; full: boolean } | null {
  if (!grant || !(grant.access || grant.view)) return null;
  const held = module.actions.filter((a) => (a === "view" ? true : grant[a]));
  if (held.length === module.actions.length && module.actions.length > 1) return { label: "Full", full: true };
  const text = held.map((a) => ACTION_LABEL[a]).join(", ");
  return { label: text.charAt(0).toUpperCase() + text.slice(1), full: held.length === module.actions.length };
}

export default function PermissionsOverview() {
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

  const [section, setSection] = useState(ALL_SECTIONS);
  const [search, setSearch] = useState("");

  const sectionNames = useMemo(() => [...new Set(modules.map((m) => m.section))], [modules]);

  const grouped = useMemo(() => {
    const q = search.trim().toLowerCase();
    const out: { section: string; items: PermissionModule[] }[] = [];
    for (const m of modules) {
      if (section !== ALL_SECTIONS && m.section !== section) continue;
      if (q && !m.name.toLowerCase().includes(q) && !m.about.toLowerCase().includes(q)) continue;
      const g = out.find((x) => x.section === m.section);
      if (g) g.items.push(m);
      else out.push({ section: m.section, items: [m] });
    }
    return out;
  }, [modules, section, search]);

  const grantsByRole = useMemo(() => {
    const out: Record<string, Record<string, RoleGrant>> = {};
    for (const r of roles) out[r.id] = Object.fromEntries(r.grants.map((g) => [g.module, g]));
    return out;
  }, [roles]);

  if (rolesError || modulesError) {
    return (
      <EmptyState
        variant="card"
        illustration="settings"
        title="Couldn't load permissions"
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
  const colSpan = roles.length + 1;

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-12 w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-[20px] font-semibold text-brand-charcoal">Permissions</h2>
          <p className="text-[13px] text-faint">
            What each role can see and do, module by module. To change a role, open it on{" "}
            <Link href="/admin/roles" className="text-brand-orange-text font-medium hover:underline">
              Roles
            </Link>
            .
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-light-gray overflow-hidden flex flex-col">
        <div className="p-4 sm:p-5 border-b border-light-gray flex flex-col lg:flex-row gap-3 lg:items-center justify-between">
          <div className="w-full lg:w-64">
            <Select
              options={[{ value: ALL_SECTIONS, label: "All sections" }, ...sectionNames.map((s) => ({ value: s, label: s }))]}
              value={section}
              onChange={(v) => setSection(v || ALL_SECTIONS)}
              searchable={false}
            />
          </div>
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search modules"
            aria-label="Search modules"
            containerClassName="lg:w-72"
            className="text-[13px]"
            suffixElement={<MagnifyingGlassIcon className="w-4 h-4 text-faint" />}
          />
        </div>

        <div className="admin-table-container">
          <table className="w-full">
            <thead>
              <tr>
                <th className="pl-6 min-w-60 sticky left-0 bg-off-white z-1">Module</th>
                {loading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <th key={i}>
                        <div className="h-3 w-20 bg-light-gray rounded animate-pulse" />
                      </th>
                    ))
                  : roles.map((r) => (
                      <th key={r.id} className="text-center whitespace-nowrap">
                        <Link href={`/admin/roles?role=${encodeURIComponent(r.id)}`} className="hover:text-brand-orange-text hover:underline">
                          {r.name}
                        </Link>
                      </th>
                    ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="pl-6">
                      <div className="h-4 w-36 bg-light-gray rounded mb-1.5" />
                      <div className="h-3 w-56 bg-light-gray rounded" />
                    </td>
                    {Array.from({ length: 4 }).map((__, j) => (
                      <td key={j}>
                        <div className="h-4 w-12 bg-light-gray rounded mx-auto" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : roles.length === 0 ? (
                <EmptyTableRow
                  colSpan={colSpan}
                  illustration="settings"
                  title="No roles yet"
                  description="Roles and their permissions will appear here once you create one."
                  action={{ label: "Create a role", href: "/admin/roles" }}
                />
              ) : grouped.length === 0 ? (
                <EmptyTableRow
                  colSpan={colSpan}
                  illustration="search"
                  title="No matching modules"
                  description="Try a different name or section."
                  action={{
                    label: "Clear filters",
                    onClick: () => {
                      setSearch("");
                      setSection(ALL_SECTIONS);
                    },
                  }}
                />
              ) : (
                grouped.map(({ section: name, items }) => (
                  <React.Fragment key={name}>
                    <tr>
                      <td colSpan={colSpan} className="pl-6 bg-off-white text-[12px] font-semibold text-faint">
                        {name}
                      </td>
                    </tr>
                    {items.map((m) => (
                      <tr key={m.key}>
                        <td className="pl-6 sticky left-0 bg-white">
                          <div className="flex flex-col max-w-sm">
                            <span className="font-medium text-brand-charcoal">{m.name}</span>
                            <span className="text-[12px] text-faint leading-relaxed">{m.about}</span>
                          </div>
                        </td>
                        {roles.map((r) => {
                          const d = describe(m, grantsByRole[r.id]?.[m.key]);
                          return (
                            <td key={r.id} className="text-center whitespace-nowrap">
                              {d ? (
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[12px] ${
                                    d.full ? "bg-success-soft text-success" : "bg-brand-orange-soft text-brand-charcoal"
                                  }`}
                                >
                                  {d.full && <CheckIcon className="w-3.5 h-3.5" />}
                                  {d.label}
                                </span>
                              ) : (
                                <span className="text-faint" aria-label="No access">
                                  —
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
