"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ArrowRightIcon, MagnifyingGlassIcon, ReloadIcon } from "@radix-ui/react-icons";
import { HiOutlineCalendar, HiChevronDown, HiXMark, HiCheck } from "react-icons/hi2";
import { StatCard } from "../../components/Admin/StatCard";
import { TabFilter } from "../../components/Admin/TabFilter";
import { Pagination } from "../../components/Admin/Pagination";
import { Input } from "../../components/Form/Inputs";
import { CustomerSideCard } from "../../components/Admin/CustomerSideCard";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";
import { BulkActionsDrawer } from "../../components/Admin/BulkActionsDrawer";
import { RowsPerPage } from "@/app/components/rows-per-page";
import Checkbox from "@/app/components/Checkbox";
import { Button } from "../../components/Button";
import { EmptyState, EmptyTableRow } from "@/app/components/EmptyState";
import { apiErrorMessage } from "@/lib/store/base-api";
import { formatNaira } from "@/lib/store/api/storefront-api";
import {
  useGetPeopleCustomersQuery,
  useSetPeopleCustomerActiveMutation,
  useDeactivatePeopleCustomersMutation,
  type PeopleCustomer,
} from "@/lib/store/api/people-api";

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
  { id: "date_range", label: "Custom range" },
];

const STATUS_TABS = ["All", "Active", "Inactive"] as const;
type StatusTab = (typeof STATUS_TABS)[number];

const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export default function CustomersListing() {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusTab>("All");
  const [selectedCustomer, setSelectedCustomer] = useState<PeopleCustomer | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [toToggle, setToToggle] = useState<PeopleCustomer | null>(null);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [selectedDatePreset, setSelectedDatePreset] = useState<DatePreset>("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const dateDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(event.target as Node)) {
        setIsDateDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search after a short pause in typing
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setCurrentPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const { data, isLoading, isFetching, isError, error, refetch } = useGetPeopleCustomersQuery({
    search: search || undefined,
    status: statusFilter === "All" ? "all" : statusFilter === "Active" ? "active" : "inactive",
    date_preset:
      selectedDatePreset !== "all" && selectedDatePreset !== "date_range" ? selectedDatePreset : undefined,
    from: selectedDatePreset === "date_range" && customStartDate ? customStartDate : undefined,
    to: selectedDatePreset === "date_range" && customEndDate ? customEndDate : undefined,
    page: currentPage,
    page_size: rowsPerPage,
  });

  const [setCustomerActive, { isLoading: isToggling }] = useSetPeopleCustomerActiveMutation();
  const [deactivateCustomers, { isLoading: isBulkDeactivating }] = useDeactivatePeopleCustomersMutation();

  const customers = data?.items ?? [];
  const totalCount = data?.pagination?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / rowsPerPage));
  const metrics = data?.metrics;
  const hasFilters = !!search || selectedDatePreset !== "all" || statusFilter !== "All";

  const toggleAll = () => {
    if (selectedIds.length === customers.length && customers.length > 0) setSelectedIds([]);
    else setSelectedIds(customers.map((c) => c.id));
  };

  const toggleItem = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const clearDateFilter = () => {
    setSelectedDatePreset("all");
    setCustomStartDate("");
    setCustomEndDate("");
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    clearDateFilter();
    setSearchInput("");
    setSearch("");
    setStatusFilter("All");
  };

  const dateButtonLabel = () => {
    if (selectedDatePreset === "all") return "Signup date";
    if (selectedDatePreset === "date_range") {
      if (customStartDate && customEndDate) return `${customStartDate} → ${customEndDate}`;
      if (customStartDate) return `From ${customStartDate}`;
      if (customEndDate) return `To ${customEndDate}`;
      return "Custom range";
    }
    return DATE_PRESETS.find((p) => p.id === selectedDatePreset)?.label ?? "Signup date";
  };

  const confirmToggle = async () => {
    if (!toToggle) return;
    const activate = !toToggle.is_active;
    try {
      await setCustomerActive({ id: toToggle.id, is_active: activate }).unwrap();
      toast.success(`${toToggle.name} ${activate ? "reactivated" : "deactivated"}.`);
      if (selectedCustomer?.id === toToggle.id) {
        setSelectedCustomer({ ...selectedCustomer, is_active: activate, status: activate ? "Active" : "InActive" });
      }
      setToToggle(null);
    } catch (err) {
      toast.error(apiErrorMessage(err, `Couldn't ${activate ? "reactivate" : "deactivate"} this customer.`));
    }
  };

  const confirmBulkDeactivate = async () => {
    try {
      const res = await deactivateCustomers(selectedIds).unwrap();
      toast.success(res.message || `Deactivated ${res.count} customers.`);
      setSelectedIds([]);
      setIsBulkModalOpen(false);
    } catch (err) {
      toast.error(apiErrorMessage(err, "Couldn't deactivate the selected customers."));
    }
  };

  const statValue = (n: number | undefined) => (n === undefined ? (isLoading ? "…" : "—") : n.toLocaleString());

  return (
    <div className="flex flex-col gap-6 mx-auto pb-12 w-full">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard title="Total customers" value={statValue(metrics?.total_customers)} hideMiniChart />
        <StatCard title="Active" value={statValue(metrics?.active_customers)} hideMiniChart />
        <StatCard title="Inactive" value={statValue(metrics?.inactive_customers)} hideMiniChart />
        <StatCard
          title="Have ordered"
          value={statValue(metrics?.repeat_customers)}
          subtitle="Customers with at least one order"
          hideMiniChart
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-start">
        <div className="bg-white rounded-lg border border-light-gray overflow-hidden flex flex-col flex-1 min-w-0 w-full">
          <div className="p-4 sm:p-5 border-b border-light-gray flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
            <TabFilter
              tabs={[...STATUS_TABS]}
              activeTab={statusFilter}
              onChange={(tab) => {
                setStatusFilter(tab as StatusTab);
                setCurrentPage(1);
                setSelectedIds([]);
              }}
            />

            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-start lg:justify-end">
              <div className="relative" ref={dateDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
                  aria-expanded={isDateDropdownOpen}
                  className={`flex items-center gap-2 px-3 py-2 text-[12px] font-medium rounded-lg border transition-colors cursor-pointer ${
                    selectedDatePreset !== "all"
                      ? "bg-brand-orange-soft border-brand-orange text-brand-charcoal"
                      : "bg-white border-light-gray text-brand-charcoal hover:bg-off-white"
                  }`}
                >
                  <HiOutlineCalendar className="w-4 h-4 text-faint" />
                  <span>{dateButtonLabel()}</span>
                  <HiChevronDown
                    className={`w-3.5 h-3.5 text-faint transition-transform ${isDateDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {selectedDatePreset !== "all" && (
                  <button
                    type="button"
                    onClick={clearDateFilter}
                    aria-label="Clear date filter"
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white border border-light-gray flex items-center justify-center text-faint hover:text-brand-charcoal"
                  >
                    <HiXMark className="w-3 h-3" />
                  </button>
                )}

                {isDateDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-lg shadow-float border border-light-gray p-3 z-50 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between border-b border-light-gray pb-2">
                      <span className="text-[12px] font-semibold text-brand-charcoal">Filter by signup date</span>
                      {selectedDatePreset !== "all" && (
                        <button
                          type="button"
                          onClick={clearDateFilter}
                          className="text-[12px] font-medium text-brand-orange-text hover:underline"
                        >
                          Reset
                        </button>
                      )}
                    </div>

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
                              if (preset.id !== "date_range") setIsDateDropdownOpen(false);
                            }}
                            className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-[12px] transition-colors text-left cursor-pointer ${
                              isSelected
                                ? "bg-brand-orange-soft text-brand-charcoal font-semibold"
                                : "text-brand-charcoal hover:bg-off-white"
                            }`}
                          >
                            <span>{preset.label}</span>
                            {isSelected && <HiCheck className="w-4 h-4 text-brand-orange-text" />}
                          </button>
                        );
                      })}
                    </div>

                    {selectedDatePreset === "date_range" && (
                      <div className="border-t border-light-gray pt-2.5 grid grid-cols-2 gap-2">
                        <label className="flex flex-col gap-1 text-[11px] text-faint">
                          From
                          <input
                            type="date"
                            value={customStartDate}
                            onChange={(e) => {
                              setCustomStartDate(e.target.value);
                              setCurrentPage(1);
                            }}
                            className="w-full text-[12px] text-brand-charcoal px-2 py-1.5 border border-light-gray rounded-lg bg-white focus:outline-none focus:border-brand-orange"
                          />
                        </label>
                        <label className="flex flex-col gap-1 text-[11px] text-faint">
                          To
                          <input
                            type="date"
                            value={customEndDate}
                            onChange={(e) => {
                              setCustomEndDate(e.target.value);
                              setCurrentPage(1);
                            }}
                            className="w-full text-[12px] text-brand-charcoal px-2 py-1.5 border border-light-gray rounded-lg bg-white focus:outline-none focus:border-brand-orange"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Input
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search name, email or phone"
                aria-label="Search customers"
                containerClassName="flex-1 min-w-[200px] lg:w-64"
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
              <button
                type="button"
                onClick={() => refetch()}
                aria-label="Refresh customers"
                title="Refresh"
                className="w-8 h-8 rounded-lg border border-light-gray flex items-center justify-center text-faint hover:text-brand-charcoal hover:bg-brand-orange-soft transition-colors"
              >
                <ReloadIcon className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          {isError ? (
            <div className="p-6">
              <EmptyState
                illustration="customers"
                title="Couldn't load customers"
                description={apiErrorMessage(error)}
                action={{ label: "Try again", onClick: () => refetch() }}
              />
            </div>
          ) : (
            <div className="admin-table-container">
              <table>
                <thead>
                  <tr>
                    <th className="w-10 pl-6">
                      <Checkbox
                        checked={selectedIds.length === customers.length && customers.length > 0}
                        onChange={toggleAll}
                        ariaLabel="Select all customers on this page"
                      />
                    </th>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Signed up</th>
                    <th className="text-center">Orders</th>
                    <th>Total spend</th>
                    <th>Status</th>
                    <th className="text-right pr-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <tr key={`skeleton-${i}`} className="animate-pulse">
                        <td className="w-10 pl-6">
                          <div className="w-4 h-4 bg-light-gray rounded" />
                        </td>
                        <td>
                          <div className="h-4 bg-light-gray rounded w-36 mb-1.5" />
                          <div className="h-3 bg-light-gray rounded w-24" />
                        </td>
                        <td>
                          <div className="h-4 bg-light-gray rounded w-24" />
                        </td>
                        <td>
                          <div className="h-4 bg-light-gray rounded w-20" />
                        </td>
                        <td>
                          <div className="h-4 bg-light-gray rounded w-8 mx-auto" />
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
                  ) : customers.length > 0 ? (
                    customers.map((customer) => (
                      <tr
                        key={customer.id}
                        onClick={() => setSelectedCustomer(customer)}
                        className={`cursor-pointer ${selectedCustomer?.id === customer.id ? "bg-off-white" : ""}`}
                      >
                        <td className="w-10 pl-6" onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={selectedIds.includes(customer.id)}
                            onChange={() => toggleItem(customer.id)}
                            ariaLabel={`Select ${customer.name}`}
                          />
                        </td>
                        <td>
                          <div className="flex flex-col min-w-0">
                            <span className="font-medium text-brand-charcoal truncate">{customer.name}</span>
                            <span className="text-[12px] text-faint truncate">
                              {customer.email || customer.customer_code}
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap">{customer.phone || "—"}</td>
                        <td className="whitespace-nowrap">{shortDate(customer.date_joined)}</td>
                        <td className="text-center tabular-nums">{customer.order_count}</td>
                        <td className="whitespace-nowrap tabular-nums">{formatNaira(customer.total_spend)}</td>
                        <td>
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[12px] ${
                              customer.is_active ? "bg-success-soft text-success" : "bg-error-soft text-error"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${customer.is_active ? "bg-success" : "bg-error"}`}
                            />
                            {customer.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="text-right pr-6" onClick={(e) => e.stopPropagation()}>
                          <div className="flex justify-end items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="border border-light-gray"
                              onClick={() => setToToggle(customer)}
                            >
                              {customer.is_active ? "Deactivate" : "Reactivate"}
                            </Button>
                            <button
                              type="button"
                              onClick={() => setSelectedCustomer(customer)}
                              aria-label={`Open ${customer.name}`}
                              className="w-8 h-8 rounded-lg border border-light-gray flex items-center justify-center text-faint hover:text-brand-charcoal hover:bg-brand-orange-soft transition-colors"
                            >
                              <ArrowRightIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : hasFilters ? (
                    <EmptyTableRow
                      colSpan={8}
                      illustration="search"
                      title="No matching customers"
                      description="Try a different search, status or signup date."
                      action={{ label: "Clear filters", onClick: handleResetFilters }}
                    />
                  ) : (
                    <EmptyTableRow
                      colSpan={8}
                      illustration="customers"
                      title="No customers yet"
                      description="Customers will appear here once they sign up."
                    />
                  )}
                </tbody>
              </table>
            </div>
          )}

          {!isError && totalCount > rowsPerPage && (
            <div className="border-t border-light-gray">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          )}
        </div>

        <AnimatePresence mode="popLayout">
          {selectedCustomer && (
            <CustomerSideCard
              key={selectedCustomer.id}
              customer={selectedCustomer}
              onClose={() => setSelectedCustomer(null)}
              onToggleActive={(c) => setToToggle(c)}
            />
          )}
        </AnimatePresence>
      </div>

      <ConfirmationModal
        isOpen={!!toToggle}
        onClose={() => setToToggle(null)}
        onConfirm={confirmToggle}
        isLoading={isToggling}
        title={toToggle?.is_active ? "Deactivate customer" : "Reactivate customer"}
        message={
          toToggle?.is_active
            ? `${toToggle?.name} won't be able to sign in or place orders until you reactivate them.`
            : `${toToggle?.name} will be able to sign in and place orders again.`
        }
        confirmText={toToggle?.is_active ? "Deactivate" : "Reactivate"}
        type={toToggle?.is_active ? "danger" : "success"}
      />

      <ConfirmationModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onConfirm={confirmBulkDeactivate}
        isLoading={isBulkDeactivating}
        title="Deactivate selected customers"
        message={`${selectedIds.length} customer${selectedIds.length === 1 ? "" : "s"} won't be able to sign in or place orders until reactivated.`}
        confirmText="Deactivate"
        type="danger"
      />

      <BulkActionsDrawer
        isOpen={selectedIds.length > 0}
        onClose={() => setSelectedIds([])}
        selectedIds={selectedIds}
        items={customers}
        onClearSelection={() => setSelectedIds([])}
        title="Customers selected"
        actions={[
          {
            id: "deactivate",
            title: "Deactivate selected",
            icon: "Delete",
            folder: "dashboardIcon",
            variant: "danger",
            onClick: () => setIsBulkModalOpen(true),
          },
        ]}
      />
    </div>
  );
}
