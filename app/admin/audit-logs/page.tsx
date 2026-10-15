"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Icon } from "@/app/components/Icon";
import { Button } from "@/app/components/Button";
import { Input } from "@/app/components/Form/Inputs";
import { DateRange, Search, Select } from "@/app/components/Form";
import { formatDisplayDate, longDate } from "@/app/components/Form/DatePicker";
import { Pagination } from "@/app/components/Admin/Pagination";
import { RowsPerPage } from "@/app/components/rows-per-page";
import Drawer from "@/app/components/Drawer/Drawer";
import { StatCard } from "@/app/components/Admin/StatCard";
import { EmptyAuditIllustration } from "@/app/components/Admin/EmptyAuditIllustration";
import {
  useGetAuditLogsQuery,
  useGetAuditLogStatsQuery,
  type AuditLogEntry,
} from "@/lib/store";
import { readStoredTokens, normalizeApiBase } from "@/lib/api";

function formatRelativeTime(dateStr: string): string {
  try {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    if (diffMs < 0) return "just now";
    const diffSecs = Math.floor(diffMs / 1000);
    if (diffSecs < 60) return `${Math.max(1, diffSecs)}s ago`;
    const diffMins = Math.floor(diffSecs / 60);
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  } catch {
    return dateStr;
  }
}

function formatDateTime(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toISOString().replace("T", " ").slice(0, 19);
  } catch {
    return dateStr;
  }
}

function getActionBadge(action: string) {
  const act = action.toLowerCase();
  if (
    act.includes("delete") ||
    act.includes("remove") ||
    act.includes("suspended") ||
    act.includes("cancel") ||
    act.includes("reject") ||
    act.includes("fail")
  ) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
        {action.toUpperCase()}
      </span>
    );
  }
  if (
    act.includes("create") ||
    act.includes("add") ||
    act.includes("approve") ||
    act.includes("confirm") ||
    act.includes("verified") ||
    act.includes("success")
  ) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
        {action.toUpperCase()}
      </span>
    );
  }
  if (
    act.includes("status") ||
    act.includes("update") ||
    act.includes("reset") ||
    act.includes("edit") ||
    act.includes("reassign")
  ) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-brand-orange-soft text-brand-charcoal border border-brand-orange/30">
        {action.toUpperCase()}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
      {action.toUpperCase()}
    </span>
  );
}

function getSeverity(action: string): "INFO" | "WARN" | "CRITICAL" {
  const act = action.toLowerCase();
  if (
    act.includes("delete") ||
    act.includes("remove") ||
    act.includes("suspended") ||
    act.includes("fail") ||
    act.includes("cancel")
  ) {
    return "CRITICAL";
  }
  if (
    act.includes("reset") ||
    act.includes("reject") ||
    act.includes("mismatch") ||
    act.includes("warn") ||
    act.includes("deduction")
  ) {
    return "WARN";
  }
  return "INFO";
}

interface FieldDiffItem {
  key: string;
  from: any;
  to: any;
  type: "MODIFIED" | "ADDED" | "REMOVED";
}

function computeFieldDiffs(log: AuditLogEntry | null): FieldDiffItem[] {
  if (!log) return [];
  const diffs: FieldDiffItem[] = [];

  // Check log.changes first
  if (log.changes && typeof log.changes === "object") {
    for (const [key, val] of Object.entries(log.changes)) {
      if (val && typeof val === "object" && ("from" in val || "to" in val)) {
        const from = (val as any).from;
        const to = (val as any).to;
        let type: "MODIFIED" | "ADDED" | "REMOVED" = "MODIFIED";
        if (from === undefined || from === null) type = "ADDED";
        else if (to === undefined || to === null) type = "REMOVED";
        diffs.push({ key, from, to, type });
      } else {
        diffs.push({ key, from: null, to: val, type: "MODIFIED" });
      }
    }
  }

  // If no diffs found in changes, check metadata.before and metadata.after
  if (diffs.length === 0 && log.metadata?.before && log.metadata?.after) {
    const before = log.metadata.before;
    const after = log.metadata.after;
    const allKeys = Array.from(new Set([...Object.keys(before), ...Object.keys(after)]));
    for (const key of allKeys) {
      const bVal = before[key];
      const aVal = after[key];
      if (JSON.stringify(bVal) !== JSON.stringify(aVal)) {
        let type: "MODIFIED" | "ADDED" | "REMOVED" = "MODIFIED";
        if (bVal === undefined || bVal === null) type = "ADDED";
        else if (aVal === undefined || aVal === null) type = "REMOVED";
        diffs.push({ key, from: bVal, to: aVal, type });
      }
    }
  }

  return diffs;
}

function renderValueBadge(val: any, isOld: boolean) {
  if (val === undefined || val === null || val === "") {
    return <span className="italic text-gray-400 font-mono text-[11px]">—</span>;
  }
  if (typeof val === "boolean") {
    return (
      <span
        className={`inline-flex px-1.5 py-0.5 rounded font-mono text-[11px] font-bold ${
          val ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
        }`}
      >
        {val ? "true" : "false"}
      </span>
    );
  }
  if (typeof val === "number") {
    return (
      <span
        className={`font-mono font-bold text-xs ${
          isOld ? "text-rose-700" : "text-emerald-700"
        }`}
      >
        {val.toLocaleString()}
      </span>
    );
  }
  if (typeof val === "object") {
    return (
      <code className="block max-w-xs truncate font-mono text-[11px] bg-white px-1.5 py-0.5 rounded border border-gray-200">
        {JSON.stringify(val)}
      </code>
    );
  }
  return (
    <span
      className={`font-mono text-xs break-all ${
        isOld ? "text-rose-950 font-medium" : "text-emerald-950 font-semibold"
      }`}
    >
      {String(val)}
    </span>
  );
}

export default function DBAuditLogsPage() {
  // Query Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedEntity, setSelectedEntity] = useState("all");
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Inspector Drawer State
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [drawerTab, setDrawerTab] = useState<"diff" | "metadata" | "raw">("diff");
  const [isCopied, setIsCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showRawStateDiff, setShowRawStateDiff] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // RTK Query: Audit Log Stream
  const { data, isLoading, isFetching, error, refetch } = useGetAuditLogsQuery({
    page: currentPage,
    page_size: pageSize,
    category: selectedCategory !== "all" ? selectedCategory : undefined,
    entity_type: selectedEntity !== "all" ? selectedEntity : undefined,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
    q: debouncedSearch || undefined,
  });

  // RTK Query: Summary Statistics
  const { data: statsData, isLoading: statsLoading } = useGetAuditLogStatsQuery();

  const logs = data?.items ?? [];
  const pagination = data?.pagination;
  const totalEvents = pagination?.total ?? 0;
  const totalPages = Math.ceil(totalEvents / pageSize) || 1;
  const categories = data?.categories ?? [
    { key: "approvals", label: "Approvals & rejections" },
    { key: "pricing", label: "Prices & margins" },
    { key: "permissions", label: "Permissions & accounts" },
    { key: "financial", label: "Financial adjustments" },
    { key: "operations", label: "Operations" },
    { key: "settings", label: "Settings" },
    { key: "notifications", label: "Notifications" },
  ];

  // Optional client-side severity filtering if selected
  const displayLogs = useMemo(() => {
    if (selectedSeverity === "all") return logs;
    return logs.filter((log) => getSeverity(log.action) === selectedSeverity);
  }, [logs, selectedSeverity]);

  // Copy to clipboard
  const handleCopyJSON = (val: any) => {
    const text = typeof val === "string" ? val : JSON.stringify(val, null, 2);
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // CSV Export Handler
  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== "all") params.set("category", selectedCategory);
      if (selectedEntity !== "all") params.set("entity_type", selectedEntity);
      if (debouncedSearch.trim()) params.set("q", debouncedSearch.trim());
      if (dateFrom) params.set("date_from", dateFrom);
      if (dateTo) params.set("date_to", dateTo);

      const baseUrl = normalizeApiBase();
      const token = readStoredTokens()?.access;
      const res = await fetch(
        `${baseUrl}/admin/audit-log/export/?${params.toString()}`,
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!res.ok) throw new Error("Failed to export audit logs");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  // Compute field diffs for the selected log
  const fieldDiffs = useMemo(() => computeFieldDiffs(selectedLog), [selectedLog]);

  // Compute raw old and new state objects
  const { oldStateObj, newStateObj } = useMemo(() => {
    if (!selectedLog) return { oldStateObj: null, newStateObj: null };
    const oldObj: Record<string, any> = {};
    const newObj: Record<string, any> = {};
    let hasKeys = false;

    if (fieldDiffs.length > 0) {
      for (const d of fieldDiffs) {
        if (d.from !== null && d.from !== undefined) oldObj[d.key] = d.from;
        if (d.to !== null && d.to !== undefined) newObj[d.key] = d.to;
        hasKeys = true;
      }
    }

    if (!hasKeys && selectedLog.metadata?.before && selectedLog.metadata?.after) {
      return {
        oldStateObj: selectedLog.metadata.before,
        newStateObj: selectedLog.metadata.after,
      };
    }

    return {
      oldStateObj: Object.keys(oldObj).length > 0 ? oldObj : null,
      newStateObj: Object.keys(newObj).length > 0 ? newObj : null,
    };
  }, [selectedLog, fieldDiffs]);

  // Metadata context properties
  const metaContext = useMemo(() => {
    if (!selectedLog?.metadata || typeof selectedLog.metadata !== "object") return {};
    const filtered: Record<string, any> = {};
    for (const [k, v] of Object.entries(selectedLog.metadata)) {
      if (k !== "before" && k !== "after") {
        filtered[k] = v;
      }
    }
    return filtered;
  }, [selectedLog]);

  return (
    <div className="space-y-6">
      {/* 4 Stat Cards with live data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Logged Events"
          value={
            statsLoading
              ? "..."
              : (statsData?.stats?.total ?? totalEvents).toLocaleString()
          }
          trendValue={
            statsData?.stats?.todayCount
              ? `+${statsData.stats.todayCount} today`
              : "Real-time sync"
          }
          trendIsUp={true}
          periodLabel="All audited actions"
          chartData={[30, 45, 55, 60, 50, 75, 90]}
        />
        <StatCard
          title="Monitored DB Entities"
          value={
            statsLoading
              ? "..."
              : `${statsData?.stats?.monitoredEntitiesCount ?? 10} Types`
          }
          trendValue="100% Active"
          trendIsUp={true}
          periodLabel="Active triggers"
          chartData={[15, 16, 16, 17, 17, 18, 18]}
        />
        <StatCard
          title="Deletions & Critical"
          value={
            statsLoading
              ? "..."
              : `${statsData?.stats?.flaggedCount ?? 0} Flagged`
          }
          trendValue="Last 30 days"
          trendIsUp={false}
          periodLabel="Security flags"
          chartData={[12, 10, 8, 15, 9, 6, 4]}
        />
        <StatCard
          title="Audit Storage & Retention"
          value={
            statsLoading
              ? "..."
              : `${statsData?.stats?.retentionDays ?? 90} Days`
          }
          trendValue="Automated rotation"
          trendIsUp={true}
          periodLabel="Encrypted storage"
          chartData={[30, 40, 50, 60, 65, 75, 80]}
        />
      </div>

      {/* Main Filter & Search Bar */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Search Query */}
          <div className="lg:col-span-2">
            <Search
              placeholder="Search by ID, action, summary, or actor..."
              value={searchQuery}
              onChange={setSearchQuery}
              maxWidth="100%"
              className="w-full"
              showClearButton
            />
          </div>

          {/* Category filter */}
          <div>
            <Select
              options={[
                { label: "All Categories", value: "all" },
                ...categories.map((c) => ({ label: c.label, value: c.key })),
              ]}
              value={selectedCategory}
              onChange={(val) => {
                setSelectedCategory(val);
                setCurrentPage(1);
              }}
              className="text-xs"
            />
          </div>

          {/* Entity Type / Table filter */}
          <div>
            <Select
              options={[
                { label: "All Entity Types", value: "all" },
                { label: "Invoices (invoicing.invoice)", value: "invoicing.invoice" },
                { label: "Procurement (procurement.order)", value: "procurement.order" },
                { label: "Riders & Logistics (rider)", value: "rider" },
                { label: "Deliveries (delivery)", value: "delivery" },
                { label: "Stores (store)", value: "store" },
                { label: "Users & Accounts (users_user)", value: "users_user" },
                { label: "Freezers (freezers)", value: "freezers" },
                { label: "Pricing & Margins (procurement.linecost)", value: "procurement.linecost" },
              ]}
              value={selectedEntity}
              onChange={(val) => {
                setSelectedEntity(val);
                setCurrentPage(1);
              }}
              className="text-xs"
            />
          </div>

          {/* Severity filter */}
          <div>
            <Select
              options={[
                { label: "All Severities", value: "all" },
                { label: "INFO", value: "INFO" },
                { label: "WARN", value: "WARN" },
                { label: "CRITICAL", value: "CRITICAL" },
              ]}
              value={selectedSeverity}
              onChange={(val) => setSelectedSeverity(val)}
              className="text-xs"
            />
          </div>

          {/* Export CSV Button */}
          <div className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              disabled={isExporting}
              className="w-full h-[38px] text-xs font-semibold flex items-center justify-center gap-1.5 border-gray-300 hover:border-brand-orange hover:text-brand-orange-text"
            >
              {isExporting ? (
                <span className="inline-block w-3.5 h-3.5 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
              ) : (
                <Icon name="copy" className="w-3.5 h-3.5" />
              )}
              <span>{isExporting ? "Exporting..." : "Export CSV"}</span>
            </Button>
          </div>
        </div>

        {/* Date Range with Custom DateRange (dd/mm/yyyy) Component from kool-konnect-frontend */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100 text-xs">
          <DateRange
            dateFrom={dateFrom}
            dateTo={dateTo}
            onChangeDateFrom={(v) => {
              setDateFrom(v);
              setCurrentPage(1);
            }}
            onChangeDateTo={(v) => {
              setDateTo(v);
              setCurrentPage(1);
            }}
          />

          {/* Active Filter Tags */}
          {(selectedCategory !== "all" ||
            selectedEntity !== "all" ||
            selectedSeverity !== "all" ||
            searchQuery.trim() !== "" ||
            dateFrom !== "" ||
            dateTo !== "") && (
            <div className="flex flex-wrap items-center gap-2 ml-auto">
              <span className="text-gray-500 font-medium">Active Filters:</span>
              {searchQuery.trim() && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-brand-orange-soft text-brand-orange-text font-semibold">
                  Query: "{searchQuery}"
                  <button
                    onClick={() => setSearchQuery("")}
                    className="hover:text-brand-charcoal"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedCategory !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-brand-orange-soft text-brand-orange-text font-semibold">
                  Category: {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className="hover:text-brand-charcoal"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedEntity !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-brand-orange-soft text-brand-orange-text font-semibold">
                  Entity: {selectedEntity}
                  <button
                    onClick={() => setSelectedEntity("all")}
                    className="hover:text-brand-charcoal"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedSeverity !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-brand-orange-soft text-brand-orange-text font-semibold">
                  Severity: {selectedSeverity}
                  <button
                    onClick={() => setSelectedSeverity("all")}
                    className="hover:text-brand-charcoal"
                  >
                    ×
                  </button>
                </span>
              )}
              {(dateFrom || dateTo) && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-brand-orange-soft text-brand-orange-text font-semibold">
                  Dates: {dateFrom ? longDate(dateFrom) : "Start"} →{" "}
                  {dateTo ? longDate(dateTo) : "End"}
                  <button
                    onClick={() => {
                      setDateFrom("");
                      setDateTo("");
                      setCurrentPage(1);
                    }}
                    className="hover:text-brand-charcoal"
                  >
                    ×
                  </button>
                </span>
              )}
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedEntity("all");
                  setSelectedSeverity("all");
                  setDateFrom("");
                  setDateTo("");
                  setCurrentPage(1);
                }}
                className="text-gray-500 hover:text-gray-800 underline ml-2 font-medium"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Audit Logs Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900 text-sm">
              Audit Trail Stream
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-bold">
              {totalEvents} events
            </span>
            {isFetching && (
              <span className="inline-block w-3.5 h-3.5 border-2 border-brand-orange border-t-transparent rounded-full animate-spin ml-1" />
            )}
          </div>

          <div className="flex items-center gap-3">
            <RowsPerPage
              value={pageSize}
              onChange={(val) => {
                setPageSize(val);
                setCurrentPage(1);
              }}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="text-xs py-1 px-2.5 h-[32px]"
            >
              Refresh
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="bg-gray-50/75 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Log ID & Time</th>
                <th className="py-3.5 px-4">Entity / Table</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Record Identifier</th>
                <th className="py-3.5 px-4">Actor / Origin</th>
                <th className="py-3.5 px-4">IP Address</th>
                <th className="py-3.5 px-4">Summary</th>
                <th className="py-3.5 px-4">Severity</th>
                <th className="py-3.5 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                /* Skeletons */
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={`skel-${i}`} className="animate-pulse">
                    <td className="py-3.5 px-4">
                      <div className="h-4 bg-gray-200 rounded w-28 mb-1" />
                      <div className="h-3 bg-gray-100 rounded w-16" />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="h-4 bg-gray-200 rounded w-24" />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="h-5 bg-gray-200 rounded-full w-20" />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="h-4 bg-gray-200 rounded w-24" />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="h-4 bg-gray-200 rounded w-28 mb-1" />
                      <div className="h-3 bg-gray-100 rounded w-20" />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="h-4 bg-gray-200 rounded w-20" />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="h-4 bg-gray-200 rounded w-44" />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="h-4 bg-gray-200 rounded w-12" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="h-6 bg-gray-200 rounded w-16 ml-auto" />
                    </td>
                  </tr>
                ))
              ) : displayLogs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-14 text-center">
                    <div className="max-w-sm mx-auto space-y-3">
                      <EmptyAuditIllustration className="w-52 h-40 mx-auto" />
                      <div className="space-y-1">
                        <p className="font-bold text-gray-800 text-sm">
                          No audit logs found
                        </p>
                        <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
                          {searchQuery || selectedCategory !== "all" || selectedEntity !== "all" || dateFrom || dateTo
                            ? "No matching audit entries found for the selected query and filters. Try adjusting your search or clearing date constraints."
                            : "There are currently no recorded events in this audit category."}
                        </p>
                      </div>
                      {(searchQuery || selectedCategory !== "all" || selectedEntity !== "all" || selectedSeverity !== "all" || dateFrom || dateTo) && (
                        <button
                          type="button"
                          onClick={() => {
                            setSearchQuery("");
                            setSelectedCategory("all");
                            setSelectedEntity("all");
                            setSelectedSeverity("all");
                            setDateFrom("");
                            setDateTo("");
                            setCurrentPage(1);
                          }}
                          className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 hover:bg-brand-orange-soft hover:text-brand-orange-text text-gray-700 transition-colors"
                        >
                          <span>Clear all filters</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                displayLogs.map((log) => {
                  const severity = getSeverity(log.action);
                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-brand-orange-soft/30 transition-colors group cursor-pointer"
                      onClick={() => setSelectedLog(log)}
                    >
                      {/* Log ID & Time */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-gray-900 group-hover:text-brand-orange-text transition-colors">
                          {log.id.slice(0, 18)}...
                        </div>
                        <div className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                          <span>{formatRelativeTime(log.created_at)}</span>
                          <span>•</span>
                          <span>{log.created_at.slice(11, 19)}</span>
                        </div>
                      </td>

                      {/* Entity / Table */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[11px] font-semibold bg-gray-100 text-gray-800 border border-gray-200">
                          {log.entity_type}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4">
                        {getActionBadge(log.action)}
                      </td>

                      {/* Record ID / Label */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-gray-800 bg-gray-50 px-2 py-1 rounded border border-gray-200 inline-block max-w-[140px] truncate">
                          {log.entity_label || log.entity_id}
                        </div>
                      </td>

                      {/* Actor */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-gray-900">
                          {log.actor.label || "System"}
                        </div>
                        {log.actor.email && (
                          <div className="text-[11px] text-gray-500 truncate max-w-[160px]">
                            {log.actor.email}
                          </div>
                        )}
                      </td>

                      {/* IP Address */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono text-gray-700">
                          {log.ip_address || "Internal"}
                        </div>
                      </td>

                      {/* Summary */}
                      <td className="py-3.5 px-4">
                        <div className="text-gray-700 max-w-xs truncate" title={log.summary}>
                          {log.summary || "—"}
                        </div>
                      </td>

                      {/* Severity */}
                      <td className="py-3.5 px-4">
                        {severity === "INFO" && (
                          <span className="text-[11px] font-bold text-gray-500">
                            INFO
                          </span>
                        )}
                        {severity === "WARN" && (
                          <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                            WARN
                          </span>
                        )}
                        {severity === "CRITICAL" && (
                          <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
                            CRITICAL
                          </span>
                        )}
                      </td>

                      {/* Details button */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLog(log);
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold text-brand-orange-text hover:text-brand-charcoal hover:bg-brand-orange-soft transition-colors whitespace-nowrap"
                        >
                          View Diff
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-gray-500 font-medium">
            Showing{" "}
            <span className="font-bold text-gray-800">
              {totalEvents === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="font-bold text-gray-800">
              {Math.min(currentPage * pageSize, totalEvents)}
            </span>{" "}
            of{" "}
            <span className="font-bold text-gray-800">{totalEvents}</span> events
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>

      {/* Improved Side Drawer: Audit Event Details & Diff Inspector */}
      {selectedLog && (
        <Drawer
          isOpen={!!selectedLog}
          onClose={() => setSelectedLog(null)}
          title="Audit Event Details"
          width="max-w-4xl"
        >
          <div className="space-y-6">
            {/* 1. Header Overview & Badges */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/80 rounded-2xl p-4 sm:p-5 border border-gray-200/90 shadow-xs">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm sm:text-base font-extrabold text-gray-900 tracking-tight">
                    {selectedLog.action}
                  </span>
                  {getActionBadge(selectedLog.action)}
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                      getSeverity(selectedLog.action) === "CRITICAL"
                        ? "bg-rose-50 text-rose-700 border-rose-200 animate-pulse"
                        : getSeverity(selectedLog.action) === "WARN"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    {getSeverity(selectedLog.action)}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                  <span className="font-medium">Event ID:</span>
                  <span className="font-mono text-[11px] font-bold text-gray-700 bg-white px-2 py-0.5 rounded border border-gray-200 select-all">
                    {selectedLog.id}
                  </span>
                  <button
                    onClick={() => handleCopyJSON(selectedLog.id)}
                    className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 rounded transition-colors"
                    title="Copy Event ID"
                  >
                    <Icon name="copy" size="xs" />
                  </button>
                </div>
              </div>

              <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Category
                </span>
                <span className="px-2.5 py-0.5 mt-0.5 rounded-full text-xs font-bold bg-brand-orange-soft text-brand-orange-text border border-brand-orange/30">
                  {selectedLog.category}
                </span>
              </div>
            </div>

            {/* 2. Executive Narrative Summary */}
            {selectedLog.summary && (
              <div className="bg-amber-50/40 border border-amber-200/80 rounded-xl p-3.5 flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="font-bold text-xs">i</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900/70 block">
                    Audit Description
                  </span>
                  <p className="text-xs font-semibold text-gray-900 mt-0.5 leading-relaxed">
                    {selectedLog.summary}
                  </p>
                </div>
              </div>
            )}

            {/* Redacted Banner if applicable */}
            {selectedLog.redacted && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2.5 text-xs text-amber-800">
                <span className="font-bold">Security Redaction:</span>
                Cost and margin figures are obscured because this role does not hold Costs &amp; Margins (margins.view) permission.
              </div>
            )}

            {/* 3. Dual-Card Intelligence: Actor vs Target Entity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Actor Card */}
              <div className="bg-white rounded-xl p-4 border border-gray-200 space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Origin Actor
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {selectedLog.actor.email ? "Staff Account" : "System Agent"}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-orange-soft to-brand-orange/20 border border-brand-orange/30 text-brand-orange-text font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                    {(selectedLog.actor.label || "S")[0].toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-gray-900 text-xs truncate">
                      {selectedLog.actor.label || "System Origin"}
                    </p>
                    {selectedLog.actor.email && (
                      <p className="text-[11px] text-gray-500 truncate">
                        {selectedLog.actor.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 text-[11px]">
                  <div>
                    <span className="text-gray-400 block">IP Address</span>
                    <span className="font-mono font-semibold text-gray-800">
                      {selectedLog.ip_address || "Internal loopback"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Actor Public ID</span>
                    <span className="font-mono text-[10px] text-gray-600 block truncate" title={selectedLog.actor.id || "None"}>
                      {selectedLog.actor.id || "—"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Target Entity Card */}
              <div className="bg-white rounded-xl p-4 border border-gray-200 space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Target Resource
                  </span>
                  <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-800 border border-gray-200">
                    {selectedLog.entity_type}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] text-gray-400 block">Record Label</span>
                  <p className="font-bold text-gray-900 text-sm mt-0.5 truncate">
                    {selectedLog.entity_label || selectedLog.entity_id}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 text-[11px]">
                  <div>
                    <span className="text-gray-400 block">Logged Timestamp</span>
                    <span className="font-semibold text-gray-800 block">
                      {formatDateTime(selectedLog.created_at)}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {formatRelativeTime(selectedLog.created_at)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Record UUID / PK</span>
                    <span className="font-mono text-[10px] text-gray-600 block truncate" title={selectedLog.entity_id}>
                      {selectedLog.entity_id}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Tabs: Visual Changes vs Operation Context vs Raw JSON */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDrawerTab("diff")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                      drawerTab === "diff"
                        ? "bg-brand-charcoal text-white shadow-xs"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <span>Field-by-Field Diff</span>
                    {fieldDiffs.length > 0 && (
                      <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-white/20 font-mono">
                        {fieldDiffs.length}
                      </span>
                    )}
                  </button>

                  {Object.keys(metaContext).length > 0 && (
                    <button
                      onClick={() => setDrawerTab("metadata")}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                        drawerTab === "metadata"
                          ? "bg-brand-charcoal text-white shadow-xs"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <span>Operation Context</span>
                      <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-white/20 font-mono">
                        {Object.keys(metaContext).length}
                      </span>
                    </button>
                  )}

                  <button
                    onClick={() => setDrawerTab("raw")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      drawerTab === "raw"
                        ? "bg-brand-charcoal text-white shadow-xs"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Raw JSON Payload
                  </button>
                </div>

                <button
                  onClick={() =>
                    handleCopyJSON(
                      drawerTab === "diff"
                        ? { changes: selectedLog.changes, fieldDiffs }
                        : drawerTab === "metadata"
                        ? metaContext
                        : selectedLog
                    )
                  }
                  className="text-xs font-bold text-gray-600 hover:text-gray-900 flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Icon name="copy" size="xs" />
                  <span>{isCopied ? "Copied!" : "Copy Section"}</span>
                </button>
              </div>

              {/* Tab 1: Visual Field-by-Field Diff Table */}
              {drawerTab === "diff" && (
                <div className="space-y-4">
                  {fieldDiffs.length === 0 ? (
                    <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-200">
                      <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-400 mx-auto flex items-center justify-center mb-2">
                        <Icon name="search" size="sm" />
                      </div>
                      <p className="text-xs font-bold text-gray-700">
                        No field changes recorded
                      </p>
                      <p className="text-[11px] text-gray-400 max-w-sm mx-auto mt-1">
                        This action was logged as a single status event without column-level value mutations.
                      </p>
                    </div>
                  ) : (
                    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-xs">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold text-[10px]">
                          <tr>
                            <th className="py-2.5 px-3.5">Modified Field</th>
                            <th className="py-2.5 px-3.5">Before (Previous State)</th>
                            <th className="py-2.5 px-2 text-center w-8">→</th>
                            <th className="py-2.5 px-3.5">After (New State)</th>
                            <th className="py-2.5 px-3 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                          {fieldDiffs.map((d) => (
                            <tr key={d.key} className="hover:bg-gray-50/60 transition-colors">
                              <td className="py-3 px-3.5 font-mono font-bold text-gray-900">
                                {d.key}
                              </td>
                              <td className="py-3 px-3.5 bg-rose-50/30">
                                <div className="flex items-center gap-1.5">
                                  <span className="w-3.5 h-3.5 rounded-full bg-rose-100 text-rose-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                                    -
                                  </span>
                                  {renderValueBadge(d.from, true)}
                                </div>
                              </td>
                              <td className="py-3 px-2 text-center text-gray-300 font-bold">
                                →
                              </td>
                              <td className="py-3 px-3.5 bg-emerald-50/30">
                                <div className="flex items-center gap-1.5">
                                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                                    +
                                  </span>
                                  {renderValueBadge(d.to, false)}
                                </div>
                              </td>
                              <td className="py-3 px-3 text-right">
                                <span
                                  className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                    d.type === "ADDED"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : d.type === "REMOVED"
                                      ? "bg-rose-100 text-rose-800"
                                      : "bg-amber-100 text-amber-800"
                                  }`}
                                >
                                  {d.type}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Toggle Side-by-Side Deep State Comparison */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setShowRawStateDiff(!showRawStateDiff)}
                      className="text-xs font-semibold text-brand-orange-text hover:text-brand-charcoal flex items-center gap-1"
                    >
                      <span>
                        {showRawStateDiff ? "Hide" : "Show"} Raw Side-by-Side State JSON
                      </span>
                      <span>{showRawStateDiff ? "▲" : "▼"}</span>
                    </button>

                    {showRawStateDiff && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                        <div className="bg-rose-50/40 rounded-xl p-3.5 border border-rose-200/70">
                          <span className="text-[11px] font-bold text-rose-800 block mb-2">
                            Before State (Snapshot)
                          </span>
                          <pre className="font-mono text-[11px] text-rose-950 bg-white/80 p-3 rounded-lg border border-rose-200 overflow-x-auto max-h-60">
                            {JSON.stringify(oldStateObj, null, 2)}
                          </pre>
                        </div>
                        <div className="bg-emerald-50/40 rounded-xl p-3.5 border border-emerald-200/70">
                          <span className="text-[11px] font-bold text-emerald-800 block mb-2">
                            After State (Snapshot)
                          </span>
                          <pre className="font-mono text-[11px] text-emerald-950 bg-white/80 p-3 rounded-lg border border-emerald-200 overflow-x-auto max-h-60">
                            {JSON.stringify(newStateObj, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: Operation Context & Structured Metadata */}
              {drawerTab === "metadata" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(metaContext).map(([k, v]) => {
                      if (Array.isArray(v)) return null; // handled below
                      if (typeof v === "object" && v !== null) {
                        return (
                          <div
                            key={k}
                            className="bg-gray-50 rounded-xl p-3 border border-gray-200"
                          >
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                              {k}
                            </span>
                            <pre className="font-mono text-[11px] text-gray-800 bg-white p-2 rounded border border-gray-200 overflow-x-auto">
                              {JSON.stringify(v, null, 2)}
                            </pre>
                          </div>
                        );
                      }
                      return (
                        <div
                          key={k}
                          className="bg-gray-50 rounded-xl p-3 border border-gray-200 flex flex-col justify-between"
                        >
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            {k}
                          </span>
                          <span className="font-mono font-semibold text-gray-900 text-xs mt-1 break-all">
                            {String(v)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* If removed_items or any array of objects exists */}
                  {Array.isArray(metaContext.removed_items) && (
                    <div className="border border-gray-200 rounded-xl overflow-hidden mt-3">
                      <div className="bg-gray-100 px-3.5 py-2 border-b border-gray-200 text-xs font-bold text-gray-800">
                        Affected / Removed Line Items ({metaContext.removed_items.length})
                      </div>
                      <table className="w-full text-left text-xs bg-white">
                        <thead className="bg-gray-50 border-b border-gray-200 text-[10px] uppercase text-gray-500 font-semibold">
                          <tr>
                            <th className="py-2 px-3">Product Name</th>
                            <th className="py-2 px-3">SKU / Ref</th>
                            <th className="py-2 px-3">Unit Price</th>
                            <th className="py-2 px-3">Qty</th>
                            <th className="py-2 px-3 text-right">Line Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {metaContext.removed_items.map((item: any, idx: number) => (
                            <tr key={idx}>
                              <td className="py-2 px-3 font-medium text-gray-900">
                                {item.product_name || "—"}
                              </td>
                              <td className="py-2 px-3 font-mono text-[11px] text-gray-600">
                                {item.product_reference || "—"}
                              </td>
                              <td className="py-2 px-3 font-mono">
                                ₦{(Number(item.unit_price) || 0).toLocaleString()}
                              </td>
                              <td className="py-2 px-3 font-bold text-gray-800">
                                {item.quantity}
                              </td>
                              <td className="py-2 px-3 text-right font-mono font-bold text-gray-900">
                                ₦{(Number(item.line_total) || 0).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Raw JSON Payload */}
              {drawerTab === "raw" && (
                <div className="bg-slate-950 rounded-xl p-4 text-emerald-400 font-mono text-xs overflow-x-auto shadow-inner relative max-h-[500px]">
                  <pre>{JSON.stringify(selectedLog, null, 2)}</pre>
                </div>
              )}
            </div>

            {/* 5. Bottom Navigation / Filter Actions */}
            <div className="pt-4 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedEntity(selectedLog.entity_type);
                    setSelectedLog(null);
                  }}
                  className="text-xs font-bold text-brand-orange-text hover:text-brand-charcoal flex items-center gap-1 bg-brand-orange-soft/40 px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  <span>Filter by {selectedLog.entity_type} →</span>
                </button>

                {selectedLog.actor.email && (
                  <button
                    onClick={() => {
                      setSearchQuery(selectedLog.actor.email!);
                      setSelectedLog(null);
                    }}
                    className="text-xs font-bold text-gray-600 hover:text-gray-900 flex items-center gap-1 bg-gray-100 px-2.5 py-1.5 rounded-lg transition-colors"
                  >
                    <span>Filter by Actor →</span>
                  </button>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedLog(null)}
                className="text-xs px-4"
              >
                Close Inspector
              </Button>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
}
