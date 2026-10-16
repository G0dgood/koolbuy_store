"use client";

import React, { useState, useRef, useEffect } from "react";
import { Icon } from "../../components/Icon";
import { StatCard } from "../../components/Admin/StatCard";
import { TabFilter } from "../../components/Admin/TabFilter";
import { Pagination } from "../../components/Admin/Pagination";
import { Input } from "../../components/Form/Inputs";
import { motion, AnimatePresence } from "framer-motion";
import { CustomerSideCard } from "../../components/Admin/CustomerSideCard";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";
import { CustomerMessageDrawer } from "../../components/Admin/CustomerMessageDrawer";
import { AdminChart } from "../../components/Admin/AdminChart";
import { RowsPerPage } from "@/app/components/rows-per-page";
import Checkbox from "@/app/components/Checkbox";
import { Button } from "../../components/Button";
import { BulkActionsDrawer } from "../../components/Admin/BulkActionsDrawer";
import {
  CustomerMetrics,
  MetricType,
} from "../../components/Admin/CustomerMetrics";
import {
  HiOutlineCalendar,
  HiChevronDown,
  HiXMark,
  HiCheck,
} from "react-icons/hi2";
import {
  useGetAdminCustomersQuery,
  useDeleteAdminCustomerMutation,
  useBulkDeleteAdminCustomersMutation,
  type AdminCustomerItem,
} from "@/lib/store";

const statusStyles: Record<string, string> = {
  Active: "text-emerald-600",
  InActive: "text-amber-500",
  Deleted: "text-rose-500",
};

const statusDots: Record<string, string> = {
  Active: "bg-emerald-500",
  InActive: "bg-amber-500",
  Deleted: "bg-rose-500",
};

type DatePreset =
  | "all"
  | "today"
  | "last_7_days"
  | "last_30_days"
  | "this_month"
  | "last_month"
  | "this_year"
  | "last_year"
  | "date_range";

const DATE_PRESETS: { id: DatePreset; label: string }[] = [
  { id: "all", label: "All time" },
  { id: "today", label: "Today" },
  { id: "last_7_days", label: "Last 7 days" },
  { id: "last_30_days", label: "Last 30 days" },
  { id: "this_month", label: "This month" },
  { id: "last_month", label: "Last month" },
  { id: "this_year", label: "This year" },
  { id: "last_year", label: "Last year" },
  { id: "date_range", label: "Date range selector" },
];

export default function CustomersListing() {
  const [activeMetric, setActiveMetric] = useState<MetricType>("active");
  const [chartTab, setChartTab] = useState("This week");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState("Active");
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomerItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [customerToDelete, setCustomerToDelete] = useState<AdminCustomerItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMessageDrawerOpen, setIsMessageDrawerOpen] = useState(false);
  const [customerToMessage, setCustomerToMessage] = useState<AdminCustomerItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Signup Date Filter State
  const [selectedDatePreset, setSelectedDatePreset] = useState<DatePreset>("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const dateDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dateDropdownRef.current &&
        !dateDropdownRef.current.contains(event.target as Node)
      ) {
        setIsDateDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch real customer data from backend
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetAdminCustomersQuery({
    search: searchQuery.trim() || undefined,
    status: statusFilter.toLowerCase(),
    date_preset:
      selectedDatePreset !== "all" && selectedDatePreset !== "date_range"
        ? selectedDatePreset
        : undefined,
    from:
      selectedDatePreset === "date_range" && customStartDate
        ? customStartDate
        : undefined,
    to:
      selectedDatePreset === "date_range" && customEndDate
        ? customEndDate
        : undefined,
    page: currentPage,
    page_size: rowsPerPage,
  });

  const [deleteCustomer, { isLoading: isDeleting }] = useDeleteAdminCustomerMutation();
  const [bulkDeleteCustomers, { isLoading: isBulkDeleting }] = useBulkDeleteAdminCustomersMutation();

  const customers = data?.items ?? [];
  const totalCount = data?.pagination?.total ?? 0;
  const totalPages = Math.ceil(totalCount / rowsPerPage) || 1;

  const toggleAll = () => {
    if (selectedIds.length === customers.length && customers.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(customers.map((c) => c.id));
    }
  };

  const toggleItem = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const chartLabels = data?.metrics?.chart?.labels ?? [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];

  const currentChartDataset = data?.metrics?.chart
    ? data.metrics.chart[activeMetric] || [0, 0, 0, 0, 0, 0, 0]
    : [0, 0, 0, 0, 0, 0, 0];

  const getDropdownButtonLabel = () => {
    if (selectedDatePreset === "all") return "Signup Date";
    if (selectedDatePreset === "date_range") {
      if (customStartDate && customEndDate) {
        return `${customStartDate} → ${customEndDate}`;
      }
      if (customStartDate) {
        return `From ${customStartDate}`;
      }
      if (customEndDate) {
        return `To ${customEndDate}`;
      }
      return "Date Range";
    }
    const item = DATE_PRESETS.find((p) => p.id === selectedDatePreset);
    return item ? item.label : "Signup Date";
  };

  const handleResetFilters = () => {
    setSelectedDatePreset("all");
    setCustomStartDate("");
    setCustomEndDate("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col gap-6 mx-auto pb-12 overflow-hidden">
      {/* Top Section: Sidebar Stats & Overview Chart */}
      <div className="flex flex-col xl:flex-row gap-4">
        <div className="flex flex-col gap-3 w-full xl:w-70">
          <StatCard
            title="Total Customers"
            value={
              data?.metrics?.total_customers !== undefined
                ? data.metrics.total_customers.toLocaleString()
                : isLoading
                ? "..."
                : "0"
            }
            trendValue="14.4%"
            trendIsUp={true}
          />
          <StatCard
            title="Visitor"
            value={
              data?.metrics?.visitors_estimate !== undefined
                ? `${Math.round(data.metrics.visitors_estimate / 1000)}k`
                : isLoading
                ? "..."
                : "0"
            }
            trendValue="20%"
            trendIsUp={true}
          />
        </div>

        <div className="flex-1 bg-white rounded-lg border border-[#1C1C1C1A] p-6 flex flex-col gap-5">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-brand-charcoal">
              Customer Overview
            </h3>
            <TabFilter
              tabs={["This week", "Last week"]}
              activeTab={chartTab}
              onChange={setChartTab}
            />
          </div>

          <CustomerMetrics
            activeMetric={activeMetric}
            onMetricClick={setActiveMetric}
            data={{
              active: data?.metrics?.active_customers,
              repeat: data?.metrics?.repeat_customers,
              visitor: data?.metrics?.visitors_estimate,
              conversion: data?.metrics?.conversion_rate,
            }}
          />

          <div className="h-64 w-full mt-2">
            <AdminChart
              type="line"
              data={{
                labels: chartLabels,
                datasets: [
                  {
                    label:
                      activeMetric.replace(/^\w/, (c) => c.toUpperCase()) +
                      (activeMetric === "conversion" ? "" : " Count"),
                    data: currentChartDataset,
                    borderColor: "#F57E16",
                    borderWidth: 3,
                    fill: true,
                    backgroundColor: "rgba(245, 126, 22, 0.05)",
                    tension: 0.4,
                    pointRadius: (context: any) =>
                      context.dataIndex === 4 ? 6 : 0,
                    pointBackgroundColor: "#F57E16",
                    pointBorderColor: "#fff",
                    pointBorderWidth: 2,
                  },
                ],
              }}
              options={{
                scales: {
                  y: {
                    min: 0,
                    ticks: {
                      callback: (value: string | number) =>
                        activeMetric === "conversion"
                          ? `${value}%`
                          : activeMetric === "visitor"
                          ? `${value}k`
                          : `${value}`,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start overflow-hidden border border-[#1C1C1C1A] rounded-lg">
        {/* Table Column */}
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`bg-white overflow-hidden flex flex-col ${
            selectedCustomer ? "flex-1" : "w-full"
          }`}
        >
          <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="w-full flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
              {/* Active, InActive, Deleted table filter buttons */}
              <TabFilter
                tabs={["Active", "InActive", "Deleted"]}
                activeTab={statusFilter}
                onChange={(tab) => {
                  setStatusFilter(tab);
                  setCurrentPage(1);
                  setSelectedIds([]);
                }}
              />

              <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-start lg:justify-end">
                {/* Signup Date Filter Dropdown */}
                <div className="relative" ref={dateDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
                    className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                      selectedDatePreset !== "all"
                        ? "bg-brand-orange/10 border-brand-orange text-[#008ba3]"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <HiOutlineCalendar
                      className={`w-4 h-4 ${
                        selectedDatePreset !== "all"
                          ? "text-brand-orange-text"
                          : "text-gray-400"
                      }`}
                    />
                    <span>{getDropdownButtonLabel()}</span>
                    {selectedDatePreset !== "all" && (
                      <span
                        role="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDatePreset("all");
                          setCustomStartDate("");
                          setCustomEndDate("");
                          setCurrentPage(1);
                        }}
                        className="p-0.5 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-700"
                        title="Clear date filter"
                      >
                        <HiXMark className="w-3.5 h-3.5" />
                      </span>
                    )}
                    <HiChevronDown
                      className={`w-3.5 h-3.5 text-gray-400 transition-transform ${
                        isDateDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Card */}
                  {isDateDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-lg shadow-md border border-gray-100 p-3 z-50 flex flex-col gap-2.5">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <span className="text-xs font-bold text-gray-700">
                          Filter by Signup Date
                        </span>
                        {selectedDatePreset !== "all" && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedDatePreset("all");
                              setCustomStartDate("");
                              setCustomEndDate("");
                              setCurrentPage(1);
                            }}
                            className="text-[11px] font-semibold text-brand-orange-text hover:underline"
                          >
                            Reset
                          </button>
                        )}
                      </div>

                      {/* Preset Options */}
                      <div className="flex flex-col gap-0.5 max-h-56 overflow-y-auto">
                        {DATE_PRESETS.map((preset) => {
                          const isSelected = selectedDatePreset === preset.id;
                          return (
                            <button
                              key={preset.id}
                              type="button"
                              onClick={() => {
                                setSelectedDatePreset(preset.id);
                                setCurrentPage(1);
                                if (preset.id !== "date_range") {
                                  setIsDateDropdownOpen(false);
                                }
                              }}
                              className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors text-left cursor-pointer ${
                                isSelected
                                  ? "bg-brand-orange/10 text-[#008ba3] font-bold"
                                  : "text-gray-700 hover:bg-gray-50 font-medium"
                              }`}
                            >
                              <span>{preset.label}</span>
                              {isSelected && (
                                <HiCheck className="w-4 h-4 text-brand-orange-text" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Custom Date Range Inputs */}
                      {(selectedDatePreset === "date_range" ||
                        customStartDate ||
                        customEndDate) && (
                        <div className="border-t border-gray-100 pt-2.5 flex flex-col gap-2">
                          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                            Date Range Selector
                          </span>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                                From
                              </label>
                              <input
                                type="date"
                                value={customStartDate}
                                onChange={(e) => {
                                  setCustomStartDate(e.target.value);
                                  setSelectedDatePreset("date_range");
                                  setCurrentPage(1);
                                }}
                                className="w-full text-xs px-2 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:border-brand-orange"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                                To
                              </label>
                              <input
                                type="date"
                                value={customEndDate}
                                onChange={(e) => {
                                  setCustomEndDate(e.target.value);
                                  setSelectedDatePreset("date_range");
                                  setCurrentPage(1);
                                }}
                                className="w-full text-xs px-2 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:border-brand-orange"
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedDatePreset("date_range");
                                setIsDateDropdownOpen(false);
                              }}
                              className="px-3 py-1 bg-brand-charcoal text-white text-xs font-semibold rounded-md hover:bg-brand-charcoal/90 transition-colors cursor-pointer"
                            >
                              Apply Range
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Search Customer */}
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search customer..."
                  containerClassName="flex-1 min-w-[200px] lg:w-64"
                  className="bg-white border-gray-100 placeholder:text-gray-400 text-xs font-medium"
                  suffixElement={
                    <Icon
                      name="search-01"
                      folder="dashboardIcon"
                      size="sm"
                      className="text-gray-400"
                    />
                  }
                />
                <RowsPerPage value={rowsPerPage} onChange={setRowsPerPage} />
                <Button
                  variant="outline"
                  shape="rounded-sm"
                  className="p-1.5! text-gray-300"
                  onClick={() => refetch()}
                  title="Refresh customer list"
                >
                  <Icon
                    name="DotsHorizontal"
                    folder="dashboardIcon"
                    size="sm"
                  />
                </Button>
              </div>
            </div>
          </div>

          <div className="admin-table-container">
            <table>
              <thead>
                <tr>
                  <th className="w-10 pl-6">
                    <Checkbox
                      checked={
                        selectedIds.length === customers.length &&
                        customers.length > 0
                      }
                      onChange={toggleAll}
                    />
                  </th>
                  <th>Customer Id</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Signup Date</th>
                  <th className="text-center">Order Count</th>
                  <th>Total Spend</th>
                  <th>Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={`skeleton-${i}`} className="animate-pulse">
                      <td className="w-10 pl-6">
                        <div className="w-4 h-4 bg-gray-200 rounded"></div>
                      </td>
                      <td>
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </td>
                      <td>
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                      </td>
                      <td>
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </td>
                      <td>
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </td>
                      <td className="text-center">
                        <div className="h-4 bg-gray-200 rounded w-8 mx-auto"></div>
                      </td>
                      <td>
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                      </td>
                      <td>
                        <div className="h-4 bg-gray-200 rounded w-14"></div>
                      </td>
                      <td className="text-right">
                        <div className="h-6 bg-gray-200 rounded w-16 ml-auto"></div>
                      </td>
                    </tr>
                  ))
                ) : customers.length > 0 ? (
                  customers.map((customer) => (
                    <tr
                      key={customer.id}
                      onClick={() => setSelectedCustomer(customer)}
                      className={`group cursor-pointer ${
                        selectedCustomer?.id === customer.id
                          ? "bg-gray-50/40"
                          : ""
                      }`}
                    >
                      <td
                        className="w-10 pl-6"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          checked={selectedIds.includes(customer.id)}
                          onChange={() => toggleItem(customer.id)}
                        />
                      </td>
                      <td>
                        <span className="text-sm font-semibold text-gray-900">
                          {customer.customer_code || customer.id}
                        </span>
                      </td>
                      <td className="whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-700">
                          {customer.name}
                        </span>
                      </td>
                      <td>{customer.phone || "—"}</td>
                      <td>
                        <span className="text-xs font-medium text-gray-600">
                          {customer.registration}
                        </span>
                      </td>
                      <td className="text-center">{customer.order_count}</td>
                      <td>{customer.formatted_total_spend}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              statusDots[customer.status] || "bg-gray-400"
                            }`}
                          ></span>
                          <span
                            className={`text-sm font-bold ${
                              statusStyles[customer.status] || "text-gray-700"
                            }`}
                          >
                            {customer.status}
                          </span>
                        </div>
                      </td>
                      <td className="text-right">
                        <div className="flex justify-end gap-2 px-2">
                          <Button
                            variant="outline"
                            shape="rounded-sm"
                            className="p-1.5! text-gray-400 hover:text-brand-orange-text hover:bg-brand-orange-soft transition-all"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCustomerToMessage(customer);
                              setIsMessageDrawerOpen(true);
                            }}
                          >
                            <Icon
                              name="tabler_message"
                              folder="dashboardIcon"
                              size="sm"
                            />
                          </Button>
                          <Button
                            variant="outline"
                            shape="rounded-sm"
                            className="p-1.5! text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCustomerToDelete(customer);
                            }}
                          >
                            <Icon
                              name="Delete"
                              folder="dashboardIcon"
                              size="sm"
                            />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="text-center py-12">
                      <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                        <span className="text-sm font-medium">
                          No {statusFilter.toLowerCase()} customers found matching the selected filter.
                        </span>
                        <button
                          type="button"
                          onClick={handleResetFilters}
                          className="text-xs font-semibold text-brand-orange-text hover:underline cursor-pointer"
                        >
                          Clear all filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </motion.div>

        {/* Customer Details Side Card */}
        <AnimatePresence mode="popLayout">
          {selectedCustomer && (
            <CustomerSideCard
              customer={selectedCustomer}
              onClose={() => setSelectedCustomer(null)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!customerToDelete}
        onClose={() => setCustomerToDelete(null)}
        onConfirm={async () => {
          if (customerToDelete) {
            try {
              await deleteCustomer(customerToDelete.id).unwrap();
            } catch (err) {
              console.error("Failed to delete customer:", err);
            }
            setCustomerToDelete(null);
          }
        }}
        title="Delete Customer"
        message={`Are you sure you want to delete ${customerToDelete?.name}? This will deactivate their account.`}
        confirmText={isDeleting ? "Deleting..." : "Yes, delete customer"}
        type="danger"
      />

      {/* Bulk Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={async () => {
          try {
            await bulkDeleteCustomers({ customer_ids: selectedIds }).unwrap();
            setSelectedIds([]);
          } catch (err) {
            console.error("Failed to bulk delete customers:", err);
          }
          setIsDeleteModalOpen(false);
        }}
        title="Delete Selected Customers"
        message={`Are you sure you want to deactivate ${selectedIds.length} selected customer accounts?`}
        confirmText={isBulkDeleting ? "Deleting..." : "Yes, delete selected"}
        type="danger"
      />

      <BulkActionsDrawer
        isOpen={selectedIds.length > 0}
        onClose={() => setSelectedIds([])}
        selectedIds={selectedIds}
        items={customers}
        onClearSelection={() => setSelectedIds([])}
        title="Customers Selected"
        actions={[
          {
            id: "message",
            title: "Message Selected",
            icon: "tabler_message",
            folder: "dashboardIcon",
            onClick: () => {
              setIsMessageDrawerOpen(true);
            },
          },
          {
            id: "delete",
            title: "Delete All Selected",
            icon: "Delete",
            folder: "dashboardIcon",
            variant: "danger",
            onClick: () => setIsDeleteModalOpen(true),
          },
        ]}
      />

      <CustomerMessageDrawer
        isOpen={isMessageDrawerOpen}
        onClose={() => setIsMessageDrawerOpen(false)}
        customer={customerToMessage}
      />
    </div>
  );
}
