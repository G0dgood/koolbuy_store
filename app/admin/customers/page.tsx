"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
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

const padZero = (n: number) => (n < 10 ? `0${n}` : `${n}`);

const formatDate = (d: Date) =>
  `${padZero(d.getDate())}.${padZero(d.getMonth() + 1)}.${d.getFullYear()}`;

const parseRegistrationDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  if (dateStr.includes(".")) {
    const parts = dateStr.split(".");
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
  }
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? null : parsed;
};

// Generate relative customer data so presets always find matching rows
const generateCustomersData = () => {
  const now = new Date();
  const daysAgo = (days: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - days);
    return d;
  };
  const monthsAgo = (months: number, dayOfMonth: number = 14) => {
    const d = new Date(now.getFullYear(), now.getMonth() - months, dayOfMonth);
    return d;
  };
  const yearsAgo = (years: number, month: number = 4, dayOfMonth: number = 10) => {
    const d = new Date(now.getFullYear() - years, month, dayOfMonth);
    return d;
  };

  return [
    {
      id: "#CUST001",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1234567890",
      address: "123 Main St, NY",
      orderCount: 25,
      totalSpend: "3,450.00",
      status: "Active",
      registration: formatDate(now), // Today
      lastPurchase: formatDate(now),
    },
    {
      id: "#CUST002",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+1234567891",
      address: "456 Oak Ave, CA",
      orderCount: 5,
      totalSpend: "250.00",
      status: "InActive",
      registration: formatDate(daysAgo(2)), // Last 7 days
      lastPurchase: formatDate(daysAgo(3)),
    },
    {
      id: "#CUST003",
      name: "Michael Chang",
      email: "michael.chang@example.com",
      phone: "+1234567892",
      address: "88 Market St, SF",
      orderCount: 12,
      totalSpend: "1,850.00",
      status: "Deleted",
      registration: formatDate(daysAgo(4)), // Last 7 days
      lastPurchase: formatDate(daysAgo(6)),
    },
    {
      id: "#CUST004",
      name: "Sarah Jenkins",
      email: "sarah.j@example.com",
      phone: "+1234567893",
      address: "789 Pine Rd, TX",
      orderCount: 18,
      totalSpend: "2,980.00",
      status: "Active",
      registration: formatDate(daysAgo(10)), // Last 30 days
      lastPurchase: formatDate(daysAgo(4)),
    },
    {
      id: "#CUST005",
      name: "David Kim",
      email: "david.kim@example.com",
      phone: "+1234567894",
      address: "101 Cedar Ln, WA",
      orderCount: 4,
      totalSpend: "420.00",
      status: "InActive",
      registration: formatDate(daysAgo(18)), // Last 30 days
      lastPurchase: formatDate(daysAgo(15)),
    },
    {
      id: "#CUST006",
      name: "Emily Watson",
      email: "emily.w@example.com",
      phone: "+1234567895",
      address: "55 Elm St, IL",
      orderCount: 2,
      totalSpend: "180.00",
      status: "Deleted",
      registration: formatDate(daysAgo(22)), // Last 30 days
      lastPurchase: formatDate(daysAgo(20)),
    },
    {
      id: "#CUST007",
      name: "Robert Taylor",
      email: "robert.t@example.com",
      phone: "+1234567896",
      address: "32 Maple Ave, FL",
      orderCount: 33,
      totalSpend: "5,120.00",
      status: "Active",
      registration: formatDate(monthsAgo(1, 10)), // Last month
      lastPurchase: formatDate(daysAgo(10)),
    },
    {
      id: "#CUST008",
      name: "Amanda Martinez",
      email: "amanda.m@example.com",
      phone: "+1234567897",
      address: "410 Birch Blvd, CO",
      orderCount: 7,
      totalSpend: "890.00",
      status: "InActive",
      registration: formatDate(monthsAgo(1, 16)), // Last month
      lastPurchase: formatDate(monthsAgo(1, 12)),
    },
    {
      id: "#CUST009",
      name: "Brian Wilson",
      email: "brian.w@example.com",
      phone: "+1234567898",
      address: "92 High St, Boston",
      orderCount: 1,
      totalSpend: "65.00",
      status: "Deleted",
      registration: formatDate(monthsAgo(1, 24)), // Last month
      lastPurchase: formatDate(monthsAgo(1, 20)),
    },
    {
      id: "#CUST010",
      name: "Jessica Brown",
      email: "jessica.b@example.com",
      phone: "+1234567899",
      address: "67 Sunset Blvd, CA",
      orderCount: 42,
      totalSpend: "6,740.00",
      status: "Active",
      registration: formatDate(monthsAgo(3, 14)), // This year
      lastPurchase: formatDate(daysAgo(2)),
    },
    {
      id: "#CUST011",
      name: "Daniel White",
      email: "daniel.w@example.com",
      phone: "+1234567800",
      address: "14 Spruce St, OR",
      orderCount: 9,
      totalSpend: "1,150.00",
      status: "InActive",
      registration: formatDate(monthsAgo(5, 5)), // This year
      lastPurchase: formatDate(monthsAgo(2, 1)),
    },
    {
      id: "#CUST012",
      name: "Lucas Garcia",
      email: "lucas.g@example.com",
      phone: "+1234567801",
      address: "23 Lake Dr, MI",
      orderCount: 15,
      totalSpend: "2,300.00",
      status: "Active",
      registration: formatDate(yearsAgo(1, 4, 12)), // Last year
      lastPurchase: formatDate(daysAgo(30)),
    },
    {
      id: "#CUST013",
      name: "Olivia Miller",
      email: "olivia.m@example.com",
      phone: "+1234567802",
      address: "76 Forest Rd, GA",
      orderCount: 8,
      totalSpend: "920.00",
      status: "InActive",
      registration: formatDate(yearsAgo(1, 8, 20)), // Last year
      lastPurchase: formatDate(monthsAgo(8, 1)),
    },
    {
      id: "#CUST014",
      name: "Ethan Davis",
      email: "ethan.d@example.com",
      phone: "+1234567803",
      address: "88 Valley Way, AZ",
      orderCount: 3,
      totalSpend: "310.00",
      status: "Deleted",
      registration: formatDate(yearsAgo(1, 10, 5)), // Last year
      lastPurchase: formatDate(yearsAgo(1, 10, 15)),
    },
  ];
};

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
  const [customersData] = useState(generateCustomersData);
  const [activeMetric, setActiveMetric] = useState<MetricType>("active");
  const [chartTab, setChartTab] = useState("This week");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState("Active");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [customerToDelete, setCustomerToDelete] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMessageDrawerOpen, setIsMessageDrawerOpen] = useState(false);
  const [customerToMessage, setCustomerToMessage] = useState<any>(null);
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

  // Filter logic
  const filteredCustomers = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999
    );

    return customersData.filter((customer) => {
      // Status filter: Active, InActive, Deleted
      if (
        customer.status.toLowerCase() !== statusFilter.toLowerCase()
      ) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          customer.name.toLowerCase().includes(q) ||
          customer.email.toLowerCase().includes(q) ||
          customer.phone.toLowerCase().includes(q) ||
          customer.id.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      // Signup Date filter
      if (selectedDatePreset !== "all") {
        const date = parseRegistrationDate(customer.registration);
        if (!date) return false;

        switch (selectedDatePreset) {
          case "today": {
            if (
              date.getFullYear() !== now.getFullYear() ||
              date.getMonth() !== now.getMonth() ||
              date.getDate() !== now.getDate()
            ) {
              return false;
            }
            break;
          }
          case "last_7_days": {
            const sevenDaysAgo = new Date(startOfToday);
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
            if (date < sevenDaysAgo || date > endOfToday) return false;
            break;
          }
          case "last_30_days": {
            const thirtyDaysAgo = new Date(startOfToday);
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
            if (date < thirtyDaysAgo || date > endOfToday) return false;
            break;
          }
          case "this_month": {
            if (
              date.getFullYear() !== now.getFullYear() ||
              date.getMonth() !== now.getMonth()
            ) {
              return false;
            }
            break;
          }
          case "last_month": {
            const targetYear =
              now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
            const targetMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
            if (
              date.getFullYear() !== targetYear ||
              date.getMonth() !== targetMonth
            ) {
              return false;
            }
            break;
          }
          case "this_year": {
            if (date.getFullYear() !== now.getFullYear()) return false;
            break;
          }
          case "last_year": {
            if (date.getFullYear() !== now.getFullYear() - 1) return false;
            break;
          }
          case "date_range": {
            if (customStartDate) {
              const start = new Date(customStartDate);
              start.setHours(0, 0, 0, 0);
              if (date < start) return false;
            }
            if (customEndDate) {
              const end = new Date(customEndDate);
              end.setHours(23, 59, 59, 999);
              if (date > end) return false;
            }
            break;
          }
        }
      }

      return true;
    });
  }, [
    customersData,
    statusFilter,
    searchQuery,
    selectedDatePreset,
    customStartDate,
    customEndDate,
  ]);

  const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage) || 1;
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredCustomers.slice(start, start + rowsPerPage);
  }, [filteredCustomers, currentPage, rowsPerPage]);

  const toggleAll = () => {
    if (selectedIds.length === filteredCustomers.length && filteredCustomers.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCustomers.map((c) => c.id));
    }
  };

  const toggleItem = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const chartDataMap: Record<MetricType, number[]> = {
    active: [18, 18.5, 17, 16, 11, 12, 11],
    repeat: [5.2, 6.8, 8.5, 7.2, 5.6, 9.1, 10.4],
    visitor: [120, 150, 180, 250, 210, 230, 250],
    conversion: [2.5, 3.8, 4.2, 5.5, 4.8, 5.2, 5.8],
  };

  const chartLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const currentChartDataset = chartDataMap[activeMetric];

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

  return (
    <div className="flex flex-col gap-6 mx-auto pb-12 overflow-hidden">
      {/* Top Section: Sidebar Stats & Overview Chart */}
      <div className="flex flex-col xl:flex-row gap-4">
        <div className="flex flex-col gap-3 w-full xl:w-70">
          <StatCard
            title="Total Customers"
            value="11,040"
            trendValue="14.4%"
            trendIsUp={true}
          />
          <StatCard
            title="Visitor"
            value="250k"
            trendValue="20%"
            trendIsUp={true}
          />
        </div>

        <div className="flex-1 bg-white rounded-lg border border-[#1C1C1C1A] p-6 flex flex-col gap-5">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-[#1D3557]">
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
                    borderColor: "#00BCD4",
                    borderWidth: 3,
                    fill: true,
                    backgroundColor: "rgba(33, 150, 243, 0.05)",
                    tension: 0.4,
                    pointRadius: (context: any) =>
                      context.dataIndex === 4 ? 6 : 0,
                    pointBackgroundColor: "#00BCD4",
                    pointBorderColor: "#fff",
                    pointBorderWidth: 2,
                  },
                ],
              }}
              options={{
                scales: {
                  y: {
                    min: 0,
                    max:
                      activeMetric === "visitor"
                        ? 300
                        : activeMetric === "conversion"
                          ? 10
                          : 50,
                    ticks: {
                      stepSize:
                        activeMetric === "visitor"
                          ? 50
                          : activeMetric === "conversion"
                            ? 2
                            : 10,
                      callback: (value: string | number) =>
                        activeMetric === "conversion"
                          ? `${value}%`
                          : activeMetric === "visitor"
                            ? `${value}k`
                            : `${value}k`,
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
          className={`bg-white overflow-hidden flex flex-col ${selectedCustomer ? "flex-1" : "w-full"}`}
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
                        ? "bg-[#00BCD4]/10 border-[#00BCD4] text-[#008ba3]"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <HiOutlineCalendar
                      className={`w-4 h-4 ${
                        selectedDatePreset !== "all"
                          ? "text-[#00BCD4]"
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
                    <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-100 p-3 z-50 flex flex-col gap-2.5">
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
                            className="text-[11px] font-semibold text-[#00BCD4] hover:underline"
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
                                  ? "bg-[#00BCD4]/10 text-[#008ba3] font-bold"
                                  : "text-gray-700 hover:bg-gray-50 font-medium"
                              }`}
                            >
                              <span>{preset.label}</span>
                              {isSelected && (
                                <HiCheck className="w-4 h-4 text-[#00BCD4]" />
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
                              <label className="block text-[10px] font-semibold text-gray-400 mb-1">
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
                                className="w-full text-xs px-2 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:border-[#00BCD4]"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-semibold text-gray-400 mb-1">
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
                                className="w-full text-xs px-2 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:border-[#00BCD4]"
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
                              className="px-3 py-1 bg-[#00BCD4] text-white text-xs font-semibold rounded-md hover:bg-[#00acc1] transition-colors cursor-pointer"
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
                        selectedIds.length === paginatedCustomers.length &&
                        paginatedCustomers.length > 0
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
                {paginatedCustomers.length > 0 ? (
                  paginatedCustomers.map((customer) => (
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
                          {customer.id}
                        </span>
                      </td>
                      <td className="whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-700">
                          {customer.name}
                        </span>
                      </td>
                      <td>{customer.phone}</td>
                      <td>
                        <span className="text-xs font-medium text-gray-600">
                          {customer.registration}
                        </span>
                      </td>
                      <td className="text-center">{customer.orderCount}</td>
                      <td>{customer.totalSpend}</td>
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
                            className="p-1.5! text-gray-400 hover:text-blue-500 hover:bg-brand-blue-light transition-all"
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
                              setIsDeleteModalOpen(true);
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
                          No {statusFilter} customers found matching the selected date or search filter.
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDatePreset("all");
                            setCustomStartDate("");
                            setCustomEndDate("");
                            setSearchQuery("");
                          }}
                          className="text-xs font-semibold text-[#00BCD4] hover:underline cursor-pointer"
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

      <ConfirmationModal
        isOpen={!!customerToDelete}
        onClose={() => setCustomerToDelete(null)}
        onConfirm={() => {
          console.log(`Deleting customer ${customerToDelete?.name}...`);
          setCustomerToDelete(null);
        }}
        title="Delete Customer"
        message={`Are you sure you want to delete ${customerToDelete?.name}? This will remove all their data from the platform permanently.`}
        confirmText="Yes, delete customer"
        type="danger"
      />

      <BulkActionsDrawer
        isOpen={selectedIds.length > 0}
        onClose={() => setSelectedIds([])}
        selectedIds={selectedIds}
        items={customersData}
        onClearSelection={() => setSelectedIds([])}
        title="Customers Selected"
        actions={[
          {
            id: "message",
            title: "Message Selected",
            icon: "tabler_message",
            folder: "dashboardIcon",
            onClick: () => {
              console.log("Messaging selected customers...");
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
