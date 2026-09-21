"use client";

import React, { useState, useMemo } from "react";
import { Icon } from "@/app/components/Icon";
import { Button } from "@/app/components/Button";
import { Input } from "@/app/components/Form/Inputs";
import { Select } from "@/app/components/Form/Select";
import { Pagination } from "@/app/components/Admin/Pagination";
import { RowsPerPage } from "@/app/components/rows-per-page";
import Drawer from "@/app/components/Drawer/Drawer";
import { StatCard } from "@/app/components/Admin/StatCard";

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  relativeTime: string;
  table: string;
  action: "INSERT" | "UPDATE" | "DELETE" | "STATUS_CHANGE";
  recordId: string;
  actor: {
    name: string;
    email: string;
    role: "Super Admin" | "Admin" | "System Cron" | "Vendor" | "API Worker";
    avatar?: string;
  };
  ipAddress: string;
  location: string;
  changedFields: string[];
  severity: "INFO" | "WARN" | "CRITICAL";
  oldData: Record<string, any> | null;
  newData: Record<string, any> | null;
  transactionId: string;
  executionTimeMs: number;
}

const mockAuditLogs: AuditLogEntry[] = [
  {
    id: "LOG-98421",
    timestamp: "2026-09-20 18:54:12",
    relativeTime: "4 mins ago",
    table: "orders",
    action: "STATUS_CHANGE",
    recordId: "ORD-2026-8942",
    actor: {
      name: "Tunde Bakare",
      email: "tunde@koolbuy.com",
      role: "Admin",
    },
    ipAddress: "197.210.54.12",
    location: "Lagos, NG",
    changedFields: ["delivery_status", "updated_at", "dispatched_by"],
    severity: "INFO",
    oldData: {
      id: "ORD-2026-8942",
      delivery_status: "Processing",
      dispatched_by: null,
      notes: "Awaiting fulfillment",
      total_amount: 450000,
    },
    newData: {
      id: "ORD-2026-8942",
      delivery_status: "Dispatched",
      dispatched_by: "Kool Logistics Hub 01",
      notes: "Handed over to carrier dispatcher",
      total_amount: 450000,
    },
    transactionId: "TXN-DB-8812904",
    executionTimeMs: 4.8,
  },
  {
    id: "LOG-98420",
    timestamp: "2026-09-20 18:47:05",
    relativeTime: "11 mins ago",
    table: "bnpl_plans",
    action: "UPDATE",
    recordId: "BNPL-PLN-552",
    actor: {
      name: "Automated Repayment Cron",
      email: "cron@system.internal",
      role: "System Cron",
    },
    ipAddress: "10.0.4.82",
    location: "Internal VPC",
    changedFields: [
      "installment_status",
      "paid_installments",
      "remaining_balance",
    ],
    severity: "INFO",
    oldData: {
      plan_id: "BNPL-PLN-552",
      user_id: "USR-8819",
      paid_installments: 1,
      total_installments: 3,
      installment_status: "Pending Due",
      remaining_balance: 180000,
    },
    newData: {
      plan_id: "BNPL-PLN-552",
      user_id: "USR-8819",
      paid_installments: 2,
      total_installments: 3,
      installment_status: "Active Current",
      remaining_balance: 90000,
    },
    transactionId: "TXN-DB-8812900",
    executionTimeMs: 3.2,
  },
  {
    id: "LOG-98419",
    timestamp: "2026-09-20 18:32:40",
    relativeTime: "25 mins ago",
    table: "users",
    action: "UPDATE",
    recordId: "USR-4019",
    actor: {
      name: "Chioma Okonjo",
      email: "chioma.o@koolbuy.com",
      role: "Super Admin",
    },
    ipAddress: "102.89.22.45",
    location: "Abuja, NG",
    changedFields: ["is_verified", "credit_limit", "tier_level"],
    severity: "WARN",
    oldData: {
      user_id: "USR-4019",
      email: "emeka.nwosu@example.com",
      is_verified: false,
      credit_limit: 150000,
      tier_level: "Tier 1",
    },
    newData: {
      user_id: "USR-4019",
      email: "emeka.nwosu@example.com",
      is_verified: true,
      credit_limit: 500000,
      tier_level: "Tier 3",
    },
    transactionId: "TXN-DB-8812879",
    executionTimeMs: 5.1,
  },
  {
    id: "LOG-98418",
    timestamp: "2026-09-20 18:15:18",
    relativeTime: "42 mins ago",
    table: "products",
    action: "UPDATE",
    recordId: "PROD-9102",
    actor: {
      name: "SolarTech Ltd",
      email: "vendor@solartech.ng",
      role: "Vendor",
    },
    ipAddress: "197.211.30.9",
    location: "Lagos, NG",
    changedFields: ["unit_price", "stock_quantity", "discount_percentage"],
    severity: "INFO",
    oldData: {
      sku: "KB-FRIDGE-500L",
      unit_price: 680000,
      stock_quantity: 14,
      discount_percentage: 5,
    },
    newData: {
      sku: "KB-FRIDGE-500L",
      unit_price: 640000,
      stock_quantity: 20,
      discount_percentage: 10,
    },
    transactionId: "TXN-DB-8812854",
    executionTimeMs: 6.4,
  },
  {
    id: "LOG-98417",
    timestamp: "2026-09-20 17:58:33",
    relativeTime: "1 hour ago",
    table: "coupons",
    action: "DELETE",
    recordId: "CPN-FLASH-99",
    actor: {
      name: "Chioma Okonjo",
      email: "chioma.o@koolbuy.com",
      role: "Super Admin",
    },
    ipAddress: "102.89.22.45",
    location: "Abuja, NG",
    changedFields: ["deleted_at", "is_active", "status"],
    severity: "CRITICAL",
    oldData: {
      code: "FLASH99",
      discount_value: 15,
      type: "Percentage",
      status: "Expired",
      is_active: false,
    },
    newData: null,
    transactionId: "TXN-DB-8812820",
    executionTimeMs: 7.9,
  },
  {
    id: "LOG-98416",
    timestamp: "2026-09-20 17:41:09",
    relativeTime: "1.2 hours ago",
    table: "transactions",
    action: "INSERT",
    recordId: "TXN-REC-77194",
    actor: {
      name: "Paystack Webhook Worker",
      email: "webhook@payment.koolbuy.com",
      role: "API Worker",
    },
    ipAddress: "52.88.21.100",
    location: "AWS us-east-1",
    changedFields: ["amount", "reference", "gateway_status", "channel"],
    severity: "INFO",
    oldData: null,
    newData: {
      transaction_id: "TXN-REC-77194",
      amount: 125000,
      gateway: "Paystack",
      reference: "PSTK_REF_99182310",
      gateway_status: "success",
      channel: "card",
      currency: "NGN",
    },
    transactionId: "TXN-DB-8812791",
    executionTimeMs: 2.9,
  },
  {
    id: "LOG-98415",
    timestamp: "2026-09-20 17:12:44",
    relativeTime: "1.7 hours ago",
    table: "service_areas",
    action: "UPDATE",
    recordId: "SA-01",
    actor: {
      name: "Tunde Bakare",
      email: "tunde@koolbuy.com",
      role: "Admin",
    },
    ipAddress: "197.210.54.12",
    location: "Lagos, NG",
    changedFields: ["delivery_fee", "estimated_transit"],
    severity: "INFO",
    oldData: {
      id: "SA-01",
      zone_name: "Lagos Island Zone",
      delivery_fee: 4500,
      estimated_transit: "48 Hours",
    },
    newData: {
      id: "SA-01",
      zone_name: "Lagos Island Zone",
      delivery_fee: 5000,
      estimated_transit: "24 Hours",
    },
    transactionId: "TXN-DB-8812740",
    executionTimeMs: 3.8,
  },
  {
    id: "LOG-98414",
    timestamp: "2026-09-20 16:30:10",
    relativeTime: "2.4 hours ago",
    table: "admin_roles",
    action: "UPDATE",
    recordId: "ROLE-INV-MGR",
    actor: {
      name: "Chioma Okonjo",
      email: "chioma.o@koolbuy.com",
      role: "Super Admin",
    },
    ipAddress: "102.89.22.45",
    location: "Abuja, NG",
    changedFields: ["permissions", "updated_at"],
    severity: "CRITICAL",
    oldData: {
      role_name: "Inventory Manager",
      permissions: ["products:read", "inventory:update"],
    },
    newData: {
      role_name: "Inventory Manager",
      permissions: [
        "products:read",
        "inventory:update",
        "warehouses:manage",
        "prices:override",
      ],
    },
    transactionId: "TXN-DB-8812680",
    executionTimeMs: 5.5,
  },
];

export default function DBAuditLogsPage() {
  // State
  const [logs, setLogs] = useState<AuditLogEntry[]>(mockAuditLogs);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTable, setSelectedTable] = useState("all");
  const [selectedAction, setSelectedAction] = useState("all");
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Inspector Drawer
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [drawerTab, setDrawerTab] = useState<"diff" | "raw">("diff");
  const [isCopied, setIsCopied] = useState(false);

  // Filtering
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Table filter
      if (selectedTable !== "all" && log.table !== selectedTable) return false;
      // Action filter
      if (selectedAction !== "all" && log.action !== selectedAction)
        return false;
      // Severity filter
      if (selectedSeverity !== "all" && log.severity !== selectedSeverity)
        return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = log.id.toLowerCase().includes(q);
        const matchesRecord = log.recordId.toLowerCase().includes(q);
        const matchesTable = log.table.toLowerCase().includes(q);
        const matchesActor =
          log.actor.name.toLowerCase().includes(q) ||
          log.actor.email.toLowerCase().includes(q);
        const matchesIP = log.ipAddress.includes(q);
        const matchesField = log.changedFields.some((f) =>
          f.toLowerCase().includes(q),
        );

        if (
          !matchesId &&
          !matchesRecord &&
          !matchesTable &&
          !matchesActor &&
          !matchesIP &&
          !matchesField
        ) {
          return false;
        }
      }

      return true;
    });
  }, [logs, selectedTable, selectedAction, selectedSeverity, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / pageSize) || 1;
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLogs.slice(start, start + pageSize);
  }, [filteredLogs, currentPage, pageSize]);

  // Copy to clipboard
  const handleCopyJSON = (data: any) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };



  return (
    <div className="space-y-6">
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Logged Events"
          value="148,920"
          trendValue="+1,240 today"
          trendIsUp={true}
          periodLabel="All tables"
          chartData={[30, 45, 55, 60, 50, 75, 90]}
        />
        <StatCard
          title="Monitored DB Tables"
          value="18 Tables"
          trendValue="100% Active"
          trendIsUp={true}
          periodLabel="Active triggers"
          chartData={[15, 16, 16, 17, 17, 18, 18]}
        />
        <StatCard
          title="Deletions & Critical"
          value="34 Flagged"
          trendValue="Last 30 days"
          trendIsUp={false}
          periodLabel="Security flags"
          chartData={[12, 10, 8, 15, 9, 6, 4]}
        />
        <StatCard
          title="Audit Storage Size"
          value="1.24 GB"
          trendValue="90-day retention"
          trendIsUp={true}
          periodLabel="Indexed storage"
          chartData={[30, 40, 50, 60, 65, 75, 80]}
        />
      </div>

      {/* Main Filter & Search Bar */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="lg:col-span-2">
            <Input
              type="text"
              placeholder="Search by Log ID, Record ID, Actor, IP, or Field..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs"
            />
          </div>

          {/* Table filter */}
          <div>
            <Select
              options={[
                { label: "All Tables", value: "all" },
                { label: "public.orders", value: "orders" },
                { label: "public.bnpl_plans", value: "bnpl_plans" },
                { label: "public.users", value: "users" },
                { label: "public.products", value: "products" },
                { label: "public.coupons", value: "coupons" },
                { label: "public.transactions", value: "transactions" },
                { label: "public.service_areas", value: "service_areas" },
                { label: "public.admin_roles", value: "admin_roles" },
              ]}
              value={selectedTable}
              onChange={(val) => setSelectedTable(val)}
              className="text-xs"
            />
          </div>

          {/* Action filter */}
          <div>
            <Select
              options={[
                { label: "All Actions", value: "all" },
                { label: "INSERT", value: "INSERT" },
                { label: "UPDATE", value: "UPDATE" },
                { label: "STATUS_CHANGE", value: "STATUS_CHANGE" },
                { label: "DELETE", value: "DELETE" },
              ]}
              value={selectedAction}
              onChange={(val) => setSelectedAction(val)}
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
        </div>

        {/* Active Filter Tags & Reset */}
        {(selectedTable !== "all" ||
          selectedAction !== "all" ||
          selectedSeverity !== "all" ||
          searchQuery.trim() !== "") && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 text-xs">
            <span className="text-gray-500 font-medium">Active Filters:</span>
            {searchQuery.trim() && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-semibold">
                Query: "{searchQuery}"
                <button
                  onClick={() => setSearchQuery("")}
                  className="hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            )}
            {selectedTable !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-semibold">
                Table: {selectedTable}
                <button
                  onClick={() => setSelectedTable("all")}
                  className="hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            )}
            {selectedAction !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-semibold">
                Action: {selectedAction}
                <button
                  onClick={() => setSelectedAction("all")}
                  className="hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            )}
            {selectedSeverity !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-semibold">
                Severity: {selectedSeverity}
                <button
                  onClick={() => setSelectedSeverity("all")}
                  className="hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            )}
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedTable("all");
                setSelectedAction("all");
                setSelectedSeverity("all");
              }}
              className="text-gray-500 hover:text-gray-800 underline ml-2 font-medium"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Main Audit Logs Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900 text-sm">
              Audit Trail Stream
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-bold">
              {filteredLogs.length} events
            </span>
          </div>

          <div className="flex items-center gap-3">
            <RowsPerPage
              value={pageSize}
              onChange={(val) => {
                setPageSize(val);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="bg-gray-50/75 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Log ID & Time</th>
                <th className="py-3.5 px-4">Table</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Record Identifier</th>
                <th className="py-3.5 px-4">Actor / Origin</th>
                <th className="py-3.5 px-4">IP & Location</th>
                <th className="py-3.5 px-4">Changed Fields</th>
                <th className="py-3.5 px-4">Severity</th>
                <th className="py-3.5 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-gray-400">
                    <div className="max-w-xs mx-auto space-y-2">
                      <div className="w-12 h-12 rounded-full bg-gray-100 mx-auto flex items-center justify-center text-gray-400">
                        <Icon name="search" className="w-6 h-6" />
                      </div>
                      <p className="font-bold text-gray-700 text-sm">
                        No audit logs found
                      </p>
                      <p className="text-xs text-gray-400">
                        Try clearing your search query or selecting a different
                        table filter.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log) => {
                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-blue-50/30 transition-colors group cursor-pointer"
                      onClick={() => setSelectedLog(log)}
                    >
                      {/* Log ID & Time */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {log.id}
                        </div>
                        <div className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                          <span>{log.relativeTime}</span>
                          <span>•</span>
                          <span>{log.timestamp.split(" ")[1]}</span>
                        </div>
                      </td>

                      {/* Table */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[11px] font-semibold bg-gray-100 text-gray-800 border border-gray-200">
                          <span className="text-gray-400">db.</span>
                          {log.table}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4">
                        {log.action === "INSERT" && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                            INSERT
                          </span>
                        )}
                        {log.action === "UPDATE" && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 border border-blue-200">
                            UPDATE
                          </span>
                        )}
                        {log.action === "STATUS_CHANGE" && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-200">
                            STATUS CHANGE
                          </span>
                        )}
                        {log.action === "DELETE" && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-200">
                            DELETE
                          </span>
                        )}
                      </td>

                      {/* Record ID */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-gray-800 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                          {log.recordId}
                        </span>
                      </td>

                      {/* Actor */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-gray-900">
                          {log.actor.name}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-gray-100 text-gray-600">
                            {log.actor.role}
                          </span>
                        </div>
                      </td>

                      {/* IP & Location */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono text-gray-700">
                          {log.ipAddress}
                        </div>
                        <div className="text-[11px] text-gray-400">
                          {log.location}
                        </div>
                      </td>

                      {/* Changed Fields */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {log.changedFields.map((field) => (
                            <span
                              key={field}
                              className="font-mono text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded"
                            >
                              {field}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Severity */}
                      <td className="py-3.5 px-4">
                        {log.severity === "INFO" && (
                          <span className="text-[10px] font-bold text-gray-500">
                            INFO
                          </span>
                        )}
                        {log.severity === "WARN" && (
                          <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                            WARN
                          </span>
                        )}
                        {log.severity === "CRITICAL" && (
                          <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
                            CRITICAL
                          </span>
                        )}
                      </td>

                      {/* Details button */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLog(log);
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors"
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
              {filteredLogs.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="font-bold text-gray-800">
              {Math.min(currentPage * pageSize, filteredLogs.length)}
            </span>{" "}
            of{" "}
            <span className="font-bold text-gray-800">
              {filteredLogs.length}
            </span>{" "}
            events
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>

      {/* Side Drawer: Diff & Log Payload Inspector */}
      {selectedLog && (
        <Drawer
          isOpen={!!selectedLog}
          onClose={() => setSelectedLog(null)}
          title={`Audit Event Details: ${selectedLog.id}`}
          width="max-w-3xl"
        >
          <div className="space-y-6">
            {/* Header Meta Overview */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-black text-gray-900 bg-white px-2.5 py-1 rounded border border-gray-200">
                    {selectedLog.id}
                  </span>
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    table: {selectedLog.table}
                  </span>
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                    id: {selectedLog.recordId}
                  </span>
                </div>
                <div className="text-xs text-gray-500 font-medium">
                  Execution:{" "}
                  <span className="font-bold text-gray-800">
                    {selectedLog.executionTimeMs}ms
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-gray-200 text-xs">
                <div>
                  <span className="text-gray-400 block">Actor</span>
                  <span className="font-bold text-gray-900">
                    {selectedLog.actor.name}
                  </span>
                  <span className="text-[10px] text-gray-500 block">
                    ({selectedLog.actor.role})
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block">IP Address</span>
                  <span className="font-mono font-bold text-gray-800">
                    {selectedLog.ipAddress}
                  </span>
                  <span className="text-[10px] text-gray-500 block">
                    {selectedLog.location}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block">Timestamp</span>
                  <span className="font-bold text-gray-800">
                    {selectedLog.timestamp}
                  </span>
                  <span className="text-[10px] text-gray-500 block">
                    {selectedLog.relativeTime}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block">Txn Reference</span>
                  <span
                    className="font-mono text-[11px] text-gray-700 block truncate"
                    title={selectedLog.transactionId}
                  >
                    {selectedLog.transactionId}
                  </span>
                </div>
              </div>
            </div>

            {/* Changed Fields Summary */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-2">
                Modified Columns ({selectedLog.changedFields.length})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedLog.changedFields.map((f) => (
                  <span
                    key={f}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>

            {/* Tabs: Visual Diff vs Raw JSON */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDrawerTab("diff")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    drawerTab === "diff"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Visual Diff Comparison
                </button>
                <button
                  onClick={() => setDrawerTab("raw")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    drawerTab === "raw"
                      ? "bg-blue-600 text-white shadow-sm"
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
                      ? { old: selectedLog.oldData, new: selectedLog.newData }
                      : selectedLog,
                  )
                }
                className="text-xs font-bold text-gray-600 hover:text-gray-900 flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-gray-100"
              >
                <Icon name="copy" className="w-3.5 h-3.5" />
                <span>{isCopied ? "Copied!" : "Copy JSON"}</span>
              </button>
            </div>

            {/* Diff View */}
            {drawerTab === "diff" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Before / Old State */}
                <div className="bg-rose-50/40 rounded-xl p-4 border border-rose-200/80">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-rose-200">
                    <span className="text-xs font-black text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                      Before (Old State)
                    </span>
                    {selectedLog.oldData === null && (
                      <span className="text-[10px] font-bold text-rose-600">
                        (None - New Record)
                      </span>
                    )}
                  </div>
                  {selectedLog.oldData ? (
                    <pre className="font-mono text-xs text-rose-950 overflow-x-auto whitespace-pre-wrap bg-white/75 p-3 rounded-lg border border-rose-200">
                      {JSON.stringify(selectedLog.oldData, null, 2)}
                    </pre>
                  ) : (
                    <div className="py-8 text-center text-xs text-rose-400 italic">
                      No preceding state (Record created by INSERT action)
                    </div>
                  )}
                </div>

                {/* After / New State */}
                <div className="bg-emerald-50/40 rounded-xl p-4 border border-emerald-200/80">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-emerald-200">
                    <span className="text-xs font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      After (New State)
                    </span>
                    {selectedLog.newData === null && (
                      <span className="text-[10px] font-bold text-rose-600">
                        (None - Record Deleted)
                      </span>
                    )}
                  </div>
                  {selectedLog.newData ? (
                    <pre className="font-mono text-xs text-emerald-950 overflow-x-auto whitespace-pre-wrap bg-white/75 p-3 rounded-lg border border-emerald-200">
                      {JSON.stringify(selectedLog.newData, null, 2)}
                    </pre>
                  ) : (
                    <div className="py-8 text-center text-xs text-rose-500 font-semibold italic">
                      Record was permanently removed (DELETE action)
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Raw JSON Payload */
              <div className="bg-slate-900 rounded-xl p-4 text-emerald-400 font-mono text-xs overflow-x-auto">
                <pre>{JSON.stringify(selectedLog, null, 2)}</pre>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedTable(selectedLog.table);
                  setSelectedLog(null);
                }}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <span>Filter stream by {selectedLog.table} →</span>
              </button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedLog(null)}
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
