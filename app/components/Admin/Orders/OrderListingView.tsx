"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Icon } from "@/app/components/Icon";
import { Button } from "@/app/components/Button";
import { Input } from "@/app/components/Form/Inputs";
import { StatCard } from "@/app/components/Admin/StatCard";
import { TabFilter } from "@/app/components/Admin/TabFilter";
import { Pagination } from "@/app/components/Admin/Pagination";
import { AddOrderModal } from "@/app/components/Admin/AddOrderModal";
import { OrdersMoreActionsDrawer } from "@/app/components/Admin/OrdersMoreActionsDrawer";
import { RowsPerPage } from "@/app/components/rows-per-page";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";
import { BulkActionsDrawer } from "@/app/components/Admin/BulkActionsDrawer";
import Checkbox from "@/app/components/Checkbox";

export interface StatItem {
  title: string;
  value: string;
  trendValue: string;
  trendIsUp: boolean;
}

export interface OrderItem {
  id: string;
  product: string;
  image: string;
  date: string;
  price: string;
  payment: string;
  status: string;
  plan?: string;
  deposit?: string;
  nextPayment?: string;
}

export interface OrderListingViewProps {
  pageType?: "standard" | "bnpl";
  title?: string;
  stats: StatItem[];
  tabs: string[];
  initialOrders: OrderItem[];
  searchPlaceholder?: string;
  addOrderButtonLabel?: string;
  baseDetailUrl: string;
}

const statusConfig: Record<string, { color: string; icon: any }> = {
  Delivered: { color: "text-blue-500", icon: "Delivered" },
  Shipped: { color: "text-gray-500", icon: "Shipped" },
  Pending: { color: "text-orange-400", icon: "Pending" },
  Cancelled: { color: "text-rose-500", icon: "Cancelled" },
  Active: { color: "text-emerald-500", icon: "Delivered" },
  Overdue: { color: "text-rose-600", icon: "Cancelled" },
  Processing: { color: "text-blue-400", icon: "Shipped" },
};

export function OrderListingView({
  pageType = "standard",
  title,
  stats,
  tabs,
  initialOrders,
  searchPlaceholder = "Search order report",
  addOrderButtonLabel = "Add Order",
  baseDetailUrl = "/admin/orders",
}: OrderListingViewProps) {
  const [orders, setOrders] = useState<OrderItem[]>(initialOrders);
  const [activeTab, setActiveTab] = useState(tabs[0] || "All");
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddOrderModalOpen, setIsAddOrderModalOpen] = useState(false);
  const [isMoreActionDrawerOpen, setIsMoreActionDrawerOpen] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Filter orders based on active tab & search query
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Tab filter
      const tabClean = activeTab.toLowerCase();
      let matchesTab = true;

      if (!tabClean.startsWith("all")) {
        if (tabClean.includes("completed") || tabClean.includes("delivered")) {
          matchesTab =
            order.status === "Delivered" || order.status === "Completed";
        } else if (tabClean.includes("pending")) {
          matchesTab = order.status === "Pending";
        } else if (tabClean.includes("cancel")) {
          matchesTab = order.status === "Cancelled";
        } else if (tabClean.includes("active")) {
          matchesTab =
            order.status === "Active" ||
            order.payment.toLowerCase().includes("active");
        } else if (tabClean.includes("overdue")) {
          matchesTab =
            order.status === "Overdue" ||
            order.payment.toLowerCase().includes("overdue");
        }
      }

      // Search filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        order.id.toLowerCase().includes(q) ||
        order.product.toLowerCase().includes(q) ||
        order.price.toLowerCase().includes(q) ||
        order.payment.toLowerCase().includes(q);

      return matchesTab && matchesSearch;
    });
  }, [orders, activeTab, searchQuery]);

  // Paginated orders
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredOrders.slice(start, start + rowsPerPage);
  }, [filteredOrders, currentPage, rowsPerPage]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / rowsPerPage),
  );

  const toggleAll = () => {
    if (
      selectedOrders.length === paginatedOrders.length &&
      paginatedOrders.length > 0
    ) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(paginatedOrders.map((o) => o.id));
    }
  };

  const toggleOrder = (id: string) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleDeleteOrders = () => {
    if (orderToDelete) {
      setOrders((prev) => prev.filter((o) => o.id !== orderToDelete));
      setSelectedOrders((prev) => prev.filter((id) => id !== orderToDelete));
      setOrderToDelete(null);
    } else if (isDeleteModalOpen && selectedOrders.length > 0) {
      setOrders((prev) => prev.filter((o) => !selectedOrders.includes(o.id)));
      setSelectedOrders([]);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-400 mx-auto pb-12">
      {/* Header Action Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        {title ? (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {title}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {pageType === "bnpl"
                ? "Manage customer installment plans, down payments, and repayment schedules"
                : "Manage customer standard orders, fulfillment, and shipping status"}
            </p>
          </div>
        ) : (
          <div />
        )}

        <div className="flex gap-3 w-full sm:w-auto ml-auto">
          <Button
            variant="blue"
            shape="rounded-sm"
            className="flex-1 sm:flex-initial"
            iconLeft={
              <Icon name="circle-plus" folder="dashboardIcon" size="sm" />
            }
            onClick={() => setIsAddOrderModalOpen(true)}
          >
            {addOrderButtonLabel}
          </Button>
          <Button
            variant="outline"
            shape="rounded-sm"
            className="flex-1 sm:flex-initial"
            iconRight={
              <Icon
                name="DotsHorizontal"
                folder="dashboardIcon"
                size="sm"
                className="text-gray-400"
              />
            }
            onClick={() => setIsMoreActionDrawerOpen(true)}
          >
            More Action
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <StatCard
            key={idx}
            title={stat.title}
            value={stat.value}
            trendValue={stat.trendValue}
            trendIsUp={stat.trendIsUp}
          />
        ))}
      </div>

      {/* Main Filter & Table Card */}
      <div className="bg-white rounded-[6px] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        {/* Filter Controls Row */}
        <div className="p-4 sm:p-6 flex flex-col lg:flex-row gap-6 items-center justify-between border-b border-gray-50">
          <TabFilter
            tabs={tabs}
            activeTab={activeTab}
            onChange={(tab) => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
            id={""}
          />

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              containerClassName="w-full lg:w-80 xl:w-96"
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

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <RowsPerPage
                value={rowsPerPage}
                onChange={(val) => {
                  setRowsPerPage(val);
                  setCurrentPage(1);
                }}
              />

              <div className="flex gap-2 ml-auto sm:ml-0">
                <Button
                  variant="outline"
                  shape="rounded-sm"
                  className="p-2.5! text-gray-400 hover:text-brand-blue"
                  title="Sort"
                >
                  <Icon name="sort" folder="dashboardIcon" size="sm" />
                </Button>
                <Button
                  variant="outline"
                  shape="rounded-sm"
                  className="p-2.5! text-gray-400 hover:text-brand-blue"
                  title="Filter"
                >
                  <Icon
                    name="flowbite_arrow-up-down-outline"
                    folder="dashboardIcon"
                    size="sm"
                  />
                </Button>
                <Button
                  variant="outline"
                  shape="rounded-sm"
                  className="p-2.5! text-gray-400 hover:text-brand-blue"
                  title="Options"
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
        </div>

        {/* Table Area */}
        <div className="admin-table-container">
          <table>
            <thead>
              <tr>
                <th className="w-12">
                  <Checkbox
                    checked={
                      selectedOrders.length === paginatedOrders.length &&
                      paginatedOrders.length > 0
                    }
                    onChange={toggleAll}
                  />
                </th>
                <th>Order Id</th>
                <th>Product</th>
                <th>Date</th>
                <th>{pageType === "bnpl" ? "Plan / Price" : "Price"}</th>
                <th>Payment</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-12 text-gray-400 font-medium text-sm"
                  >
                    No orders found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => {
                  const statusInfo = statusConfig[order.status] || {
                    color: "text-gray-500",
                    icon: "Pending",
                  };

                  const isPaid =
                    order.payment === "Paid" ||
                    order.payment === "Completed" ||
                    order.payment.includes("Paid");

                  const isInstallmentActive =
                    order.payment.includes("Active") ||
                    order.payment.includes("Part");

                  return (
                    <tr
                      key={order.id}
                      className="group hover:bg-gray-50/50 transition-colors"
                    >
                      <td>
                        <Checkbox
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => toggleOrder(order.id)}
                        />
                      </td>
                      <td>
                        <span className="text-sm font-semibold text-gray-900">
                          {order.id}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-3 min-w-50">
                          <div className="w-10 h-10 rounded-[6px] overflow-hidden border border-gray-100 bg-gray-50 shrink-0">
                            <img
                              src={order.image}
                              alt={order.product}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-700 leading-tight">
                              {order.product}
                            </span>
                            {order.plan && (
                              <span className="text-[11px] font-bold text-brand-blue mt-0.5">
                                {order.plan}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="admin-table-td text-sm font-medium text-gray-500 whitespace-nowrap">
                        {order.date}
                      </td>
                      <td className="admin-table-td">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900 whitespace-nowrap">
                            ₦{order.price}
                          </span>
                          {order.deposit && (
                            <span className="text-[10px] font-medium text-gray-400">
                              Deposit: {order.deposit}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isPaid
                                ? "bg-blue-500"
                                : isInstallmentActive
                                  ? "bg-amber-500"
                                  : "bg-rose-500"
                            }`}
                          ></span>
                          <span className="text-sm font-medium text-gray-700">
                            {order.payment}
                          </span>
                        </div>
                      </td>
                      <td className="admin-table-td">
                        <div
                          className={`flex items-center gap-2 font-bold text-sm whitespace-nowrap ${statusInfo.color}`}
                        >
                          <Icon
                            name={statusInfo.icon}
                            folder="dashboardIcon"
                            size="sm"
                          />
                          {order.status}
                        </div>
                      </td>
                      <td className="text-right">
                        <div className="flex justify-end items-center gap-2">
                          <Link
                            href={`${baseDetailUrl}/${order.id.replace("#", "")}`}
                          >
                            <Button
                              variant="outline"
                              shape="rounded-sm"
                              className="p-1.5! text-gray-400 hover:text-blue-500 hover:bg-brand-blue-light transition-all"
                              title="View Order Details"
                            >
                              <Icon
                                name="view"
                                folder="dashboardIcon"
                                size="sm"
                              />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            shape="rounded-sm"
                            className="p-1.5! text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
                            onClick={() => setOrderToDelete(order.id)}
                            title="Delete Order"
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        {/* Add Order Modal */}
        <AddOrderModal
          isOpen={isAddOrderModalOpen}
          onClose={() => setIsAddOrderModalOpen(false)}
        />

        {/* More Actions Drawer */}
        <OrdersMoreActionsDrawer
          isOpen={isMoreActionDrawerOpen && selectedOrders.length === 0}
          onClose={() => setIsMoreActionDrawerOpen(false)}
          onBulkPrint={() => console.log("Printing labels...")}
        />

        {/* Bulk Actions Drawer */}
        <BulkActionsDrawer
          isOpen={selectedOrders.length > 0}
          onClose={() => setSelectedOrders([])}
          selectedIds={selectedOrders}
          items={orders}
          onClearSelection={() => setSelectedOrders([])}
          title={
            pageType === "bnpl" ? "BNPL Orders Selected" : "Orders Selected"
          }
          actions={[
            {
              id: "print",
              title: "Print Selected Labels",
              icon: "cloud_download",
              folder: "icon",
              onClick: () => console.log("Printing selected labels..."),
            },
            {
              id: "delivered",
              title: "Mark as Delivered",
              icon: "verified",
              folder: "icon",
              onClick: () => {
                setOrders((prev) =>
                  prev.map((o) =>
                    selectedOrders.includes(o.id)
                      ? { ...o, status: "Delivered" }
                      : o,
                  ),
                );
                setSelectedOrders([]);
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

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={!!orderToDelete || isDeleteModalOpen}
          onClose={() => {
            setOrderToDelete(null);
            setIsDeleteModalOpen(false);
          }}
          onConfirm={handleDeleteOrders}
          title="Delete Order"
          message={
            orderToDelete
              ? `Are you sure you want to delete order ${orderToDelete}? This action cannot be undone.`
              : `Are you sure you want to delete the ${selectedOrders.length} selected orders? This action cannot be undone.`
          }
          confirmText="Yes, delete order"
          type="danger"
        />
      </div>
    </div>
  );
}
