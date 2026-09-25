"use client";

import React, { useState, useMemo } from "react";
import { StatCard } from "@/app/components/Admin/StatCard";
import { TabFilter } from "@/app/components/Admin/TabFilter";
import { Pagination } from "@/app/components/Admin/Pagination";
import { RowsPerPage } from "@/app/components/rows-per-page";
import { Input } from "@/app/components/Form/Inputs";
import { Button } from "@/app/components/Button";
import { Icon } from "@/app/components/Icon";
import { Modal, ModalBody } from "@/app/components/Modal";
import {
  HiOutlineReceiptPercent,
  HiOutlineBuildingStorefront,
  HiOutlineShieldCheck,
  HiOutlineDocumentArrowDown,
  HiOutlineShoppingBag,
} from "react-icons/hi2";

interface SubscriptionDiscountOrder {
  id: string;
  orderNumber: string;
  date: string;
  customer: string;
  customerEmail: string;
  vendorsName: string;
  discountOnAdminAccount: string;
  discountOnVendorAccount: string;
  totalSubscriptionDiscount: string;
  status: "Completed" | "Active" | "Pending";
}

const initialDiscountOrders: SubscriptionDiscountOrder[] = [
  {
    id: "1",
    orderNumber: "#ORD-99120",
    date: "18-09-2026 14:30",
    customer: "Adebayo Olumide",
    customerEmail: "adebayo@koolboks.com",
    vendorsName: "Scanfrost Official Store",
    discountOnAdminAccount: "₦10,000",
    discountOnVendorAccount: "₦15,000",
    totalSubscriptionDiscount: "₦25,000",
    status: "Completed",
  },
  {
    id: "2",
    orderNumber: "#ORD-99115",
    date: "18-09-2026 12:15",
    customer: "Chioma Nwosu",
    customerEmail: "chioma.n@gmail.com",
    vendorsName: "Bruhm Appliances Hub",
    discountOnAdminAccount: "₦8,500",
    discountOnVendorAccount: "₦0",
    totalSubscriptionDiscount: "₦8,500",
    status: "Completed",
  },
  {
    id: "3",
    orderNumber: "#ORD-99104",
    date: "17-09-2026 18:40",
    customer: "Babatunde Lawal",
    customerEmail: "babatunde.l@yahoo.com",
    vendorsName: "Somotex Mega Store",
    discountOnAdminAccount: "₦0",
    discountOnVendorAccount: "₦12,000",
    totalSubscriptionDiscount: "₦12,000",
    status: "Completed",
  },
  {
    id: "4",
    orderNumber: "#ORD-99092",
    date: "17-09-2026 11:20",
    customer: "Fatima Al-Hassan",
    customerEmail: "fatima.h@gmail.com",
    vendorsName: "Scanfrost Official Store",
    discountOnAdminAccount: "₦5,000",
    discountOnVendorAccount: "₦5,000",
    totalSubscriptionDiscount: "₦10,000",
    status: "Active",
  },
  {
    id: "5",
    orderNumber: "#ORD-99081",
    date: "16-09-2026 16:05",
    customer: "Emeka Okafor",
    customerEmail: "emeka.o@enterprise.ng",
    vendorsName: "Thermocool Direct",
    discountOnAdminAccount: "₦15,000",
    discountOnVendorAccount: "₦15,000",
    totalSubscriptionDiscount: "₦30,000",
    status: "Completed",
  },
  {
    id: "6",
    orderNumber: "#ORD-99070",
    date: "16-09-2026 10:45",
    customer: "Zainab Bello",
    customerEmail: "zainab.b@outlook.com",
    vendorsName: "Hisense Official",
    discountOnAdminAccount: "₦0",
    discountOnVendorAccount: "₦7,500",
    totalSubscriptionDiscount: "₦7,500",
    status: "Pending",
  },
  {
    id: "7",
    orderNumber: "#ORD-99058",
    date: "15-09-2026 15:22",
    customer: "Kelechi Eze",
    customerEmail: "kelechi.eze@gmail.com",
    vendorsName: "Somotex Mega Store",
    discountOnAdminAccount: "₦4,000",
    discountOnVendorAccount: "₦0",
    totalSubscriptionDiscount: "₦4,000",
    status: "Completed",
  },
  {
    id: "8",
    orderNumber: "#ORD-99045",
    date: "15-09-2026 09:18",
    customer: "Tunde Babalola",
    customerEmail: "tunde.b@example.com",
    vendorsName: "Bruhm Appliances Hub",
    discountOnAdminAccount: "₦10,000",
    discountOnVendorAccount: "₦10,000",
    totalSubscriptionDiscount: "₦20,000",
    status: "Completed",
  },
  {
    id: "9",
    orderNumber: "#ORD-99032",
    date: "14-09-2026 17:50",
    customer: "Folake Adeleke",
    customerEmail: "folake.a@gmail.com",
    vendorsName: "Scanfrost Official Store",
    discountOnAdminAccount: "₦6,000",
    discountOnVendorAccount: "₦6,000",
    totalSubscriptionDiscount: "₦12,000",
    status: "Completed",
  },
  {
    id: "10",
    orderNumber: "#ORD-99019",
    date: "14-09-2026 13:10",
    customer: "Ibrahim Musa",
    customerEmail: "ibrahim.m@north.ng",
    vendorsName: "Thermocool Direct",
    discountOnAdminAccount: "₦0",
    discountOnVendorAccount: "₦0",
    totalSubscriptionDiscount: "₦0",
    status: "Completed",
  },
];

const tabs = [
  "All Orders",
  "Admin Discounted",
  "Vendor Discounted",
  "Co-Funded",
];

export default function SubscriptionDiscountsPage() {
  const [activeTab, setActiveTab] = useState("All Orders");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] =
    useState<SubscriptionDiscountOrder | null>(null);

  // Filter orders
  const filteredOrders = useMemo(() => {
    return initialDiscountOrders.filter((order) => {
      // Tab filter
      if (
        activeTab === "Admin Discounted" &&
        order.discountOnAdminAccount === "₦0"
      ) {
        return false;
      }
      if (
        activeTab === "Vendor Discounted" &&
        order.discountOnVendorAccount === "₦0"
      ) {
        return false;
      }
      if (
        activeTab === "Co-Funded" &&
        (order.discountOnAdminAccount === "₦0" ||
          order.discountOnVendorAccount === "₦0")
      ) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesOrder = order.orderNumber.toLowerCase().includes(query);
        const matchesCustomer = order.customer.toLowerCase().includes(query);
        const matchesVendor = order.vendorsName.toLowerCase().includes(query);
        const matchesTotal = order.totalSubscriptionDiscount
          .toLowerCase()
          .includes(query);

        return matchesOrder || matchesCustomer || matchesVendor || matchesTotal;
      }

      return true;
    });
  }, [activeTab, searchQuery]);

  // Paginated records
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredOrders.slice(start, start + rowsPerPage);
  }, [filteredOrders, currentPage, rowsPerPage]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / rowsPerPage),
  );

  // Calculate live summary values (with fallback to 0)
  const parseNaira = (val: string) => {
    const num = parseInt(val.replace(/[^\d]/g, ""), 10);
    return isNaN(num) ? 0 : num;
  };

  const totalDiscountSum = useMemo(() => {
    const sum = initialDiscountOrders.reduce(
      (acc, curr) => acc + parseNaira(curr.totalSubscriptionDiscount),
      0,
    );
    return sum === 0 ? "0" : `₦${sum.toLocaleString()}`;
  }, []);

  const adminDiscountSum = useMemo(() => {
    const sum = initialDiscountOrders.reduce(
      (acc, curr) => acc + parseNaira(curr.discountOnAdminAccount),
      0,
    );
    return sum === 0 ? "0" : `₦${sum.toLocaleString()}`;
  }, []);

  const vendorDiscountSum = useMemo(() => {
    const sum = initialDiscountOrders.reduce(
      (acc, curr) => acc + parseNaira(curr.discountOnVendorAccount),
      0,
    );
    return sum === 0 ? "0" : `₦${sum.toLocaleString()}`;
  }, []);

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          {/* <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Subscription Discounts
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Audit subscription order discounts, vendor vs admin absorption accounts, and promotional subsidies
          </p> */}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="blue"
            size="md"
            iconLeft={<HiOutlineDocumentArrowDown size={18} />}
            className="px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold shadow-sm shadow-brand-blue/20 bg-[#00BCD4] hover:bg-[#00BCD4]/90 text-white"
            onClick={() => setIsExportModalOpen(true)}
          >
            Export Report
          </Button>
        </div>
      </div>

      {/* 3 Cards: Total Subscription Discount, Subscription Discount On Admin's Account, Subscription Discount On Vendors's Account */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* 1. Total Subscription Discount */}
        <StatCard
          size="sm"
          title="Total Subscription Discount"
          value={totalDiscountSum}
          trendValue="100% Covered"
          trendIsUp={true}
          subtitle="Cumulative subscription discounts"
          badgeIcon={<HiOutlineReceiptPercent className="w-4 h-4" />}
        />

        {/* 2. Subscription Discount On Admin's Account */}
        <StatCard
          size="sm"
          title="Subscription Discount On Admin's Account"
          value={adminDiscountSum}
          trendValue="Platform absorbed"
          trendIsUp={true}
          subtitle="Funded from admin operational revenue"
          badgeIcon={<HiOutlineShieldCheck className="w-4 h-4 text-cyan-600" />}
        />

        {/* 3. Subscription Discount On Vendors's Account */}
        <StatCard
          size="sm"
          title="Subscription Discount On Vendors's Account"
          value={vendorDiscountSum}
          trendValue="Merchant absorbed"
          trendIsUp={true}
          subtitle="Funded from merchant partner margins"
          badgeIcon={
            <HiOutlineBuildingStorefront className="w-4 h-4 text-purple-600" />
          }
        />
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        {/* Controls Row */}
        <div className="p-4 sm:p-6 flex flex-col lg:flex-row gap-6 items-center justify-between border-b border-gray-50">
          <TabFilter
            tabs={tabs}
            activeTab={activeTab}
            onChange={(tab) => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
            id="sub-discount-filter"
          />

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <Input
              type="text"
              placeholder="Search order number, customer, vendor..."
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
            </div>
          </div>
        </div>

        {/* Table Area with the exact 6 requested headers */}
        <div className="admin-table-container">
          <table>
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Customer</th>
                <th>Vendors Name</th>
                <th>Discount On Admin's Account</th>
                <th>Discount On Vendors's Account</th>
                <th>Total Subscription Discount</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="hover:bg-gray-50/60 transition-colors"
                  >
                    {/* Order Number */}
                    <td className="font-mono font-bold text-xs text-brand-blue whitespace-nowrap">
                      {order.orderNumber}
                    </td>

                    {/* Customer */}
                    <td>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-900 whitespace-nowrap">
                          {order.customer}
                        </span>
                        <span className="text-[11px] text-gray-400">
                          {order.customerEmail}
                        </span>
                      </div>
                    </td>

                    {/* Vendors Name */}
                    <td className="text-xs font-semibold text-gray-800 whitespace-nowrap">
                      {order.vendorsName}
                    </td>

                    {/* Discount On Admin's Account */}
                    <td className="text-xs whitespace-nowrap">
                      {order.discountOnAdminAccount !== "₦0" ? (
                        <span className="font-bold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-md border border-cyan-100">
                          {order.discountOnAdminAccount}
                        </span>
                      ) : (
                        <span className="text-gray-400">0</span>
                      )}
                    </td>

                    {/* Discount On Vendors's Account */}
                    <td className="text-xs whitespace-nowrap">
                      {order.discountOnVendorAccount !== "₦0" ? (
                        <span className="font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-100">
                          {order.discountOnVendorAccount}
                        </span>
                      ) : (
                        <span className="text-gray-400">0</span>
                      )}
                    </td>

                    {/* Total Subscription Discount */}
                    <td className="text-xs whitespace-nowrap">
                      {order.totalSubscriptionDiscount !== "₦0" ? (
                        <span className="font-black text-gray-900 bg-gray-100 px-3 py-1 rounded-md border border-gray-200">
                          {order.totalSubscriptionDiscount}
                        </span>
                      ) : (
                        <span className="text-gray-400">0</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-gray-400 text-xs"
                  >
                    No subscription discount records found matching your
                    criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="admin-pagination-footer">
          <p className="text-xs text-gray-400">
            Showing{" "}
            <span className="font-bold text-gray-700">
              {filteredOrders.length === 0
                ? 0
                : (currentPage - 1) * rowsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-bold text-gray-700">
              {Math.min(currentPage * rowsPerPage, filteredOrders.length)}
            </span>{" "}
            of{" "}
            <span className="font-bold text-gray-700">
              {filteredOrders.length}
            </span>{" "}
            entries
          </p>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Detail Modal */}
      {selectedOrder && (
        <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)}>
          <ModalBody>
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-lg bg-brand-blue-light text-brand-blue flex items-center justify-center">
                    <HiOutlineShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">
                      Subscription Discount Breakdown
                    </h3>
                    <p className="text-xs text-gray-400">
                      Order {selectedOrder.orderNumber} • {selectedOrder.date}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-md border border-emerald-100">
                  {selectedOrder.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="text-gray-400">Customer</span>
                  <p className="font-bold text-gray-900 mt-0.5">
                    {selectedOrder.customer}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    {selectedOrder.customerEmail}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="text-gray-400">Vendor</span>
                  <p className="font-bold text-gray-900 mt-0.5">
                    {selectedOrder.vendorsName}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Verified Merchant Partner
                  </p>
                </div>

                <div className="p-3 bg-cyan-50/50 rounded-lg border border-cyan-100">
                  <span className="text-gray-500">
                    Discount On Admin's Account
                  </span>
                  <p className="font-bold text-brand-blue mt-0.5 text-sm">
                    {selectedOrder.discountOnAdminAccount}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Platform funded absorption
                  </p>
                </div>

                <div className="p-3 bg-purple-50/50 rounded-lg border border-purple-100">
                  <span className="text-gray-500">
                    Discount On Vendors's Account
                  </span>
                  <p className="font-bold text-purple-700 mt-0.5 text-sm">
                    {selectedOrder.discountOnVendorAccount}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Merchant funded absorption
                  </p>
                </div>

                <div className="p-3 bg-gray-100 rounded-lg border border-gray-200 col-span-2 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-gray-700">
                      Total Subscription Discount
                    </span>
                    <p className="text-[10px] text-gray-500">
                      Combined customer savings on order
                    </p>
                  </div>
                  <span className="text-base font-black text-gray-900">
                    {selectedOrder.totalSubscriptionDiscount}
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  size="sm"
                  className="bg-[#00BCD4] text-white"
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </ModalBody>
        </Modal>
      )}

      {/* Export Modal */}
      <Modal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      >
        <ModalBody>
          <div className="space-y-4 pt-2 text-center">
            <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <HiOutlineDocumentArrowDown className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">
                Export Subscription Discount Report
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Download comprehensive ledger detailing admin vs vendor funded
                subscription discounts.
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsExportModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-[#00BCD4] text-white"
                onClick={() => setIsExportModalOpen(false)}
              >
                Download CSV
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}
