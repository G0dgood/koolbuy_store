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
import Checkbox from "@/app/components/Checkbox";
import Link from "next/link";
import {
  HiOutlineTag,
  HiOutlineBuildingStorefront,
  HiOutlineTicket,
  HiOutlineUsers,
  HiOutlineDocumentArrowDown,
  HiOutlinePlus,
  HiOutlineArrowRight,
} from "react-icons/hi2";

interface PromoOrderRecord {
  id: string;
  orderId: string;
  dateTime: string;
  customerName: string;
  customerEmail: string;
  vendorName: string;
  subtotalAmount: string;
  vendorPaidDiscount: string;
  adminPaidDiscount: string;
  finalAmount: string;
  paymentMethods: string;
  orderStatus: "Delivered" | "Shipped" | "Pending" | "Completed" | "Cancelled";
}

const initialPromoOrders: PromoOrderRecord[] = [
  {
    id: "1",
    orderId: "#ORD-88210",
    dateTime: "19-09-2026 15:40",
    customerName: "Adebayo Olumide",
    customerEmail: "adebayo@koolboks.com",
    vendorName: "Scanfrost Official Store",
    subtotalAmount: "₦1,406,000",
    vendorPaidDiscount: "₦20,000 [SCAN20]",
    adminPaidDiscount: "-",
    finalAmount: "₦1,386,000",
    paymentMethods: "Debit Card",
    orderStatus: "Delivered",
  },
  {
    id: "2",
    orderId: "#ORD-88204",
    dateTime: "19-09-2026 12:20",
    customerName: "Chioma Nwosu",
    customerEmail: "chioma.n@gmail.com",
    vendorName: "Bruhm Appliances Hub",
    subtotalAmount: "₦1,662,370",
    vendorPaidDiscount: "-",
    adminPaidDiscount: "₦25,000 [KOOLBUY25]",
    finalAmount: "₦1,637,370",
    paymentMethods: "BNPL Installment",
    orderStatus: "Delivered",
  },
  {
    id: "3",
    orderId: "#ORD-88195",
    dateTime: "18-09-2026 18:05",
    customerName: "Babatunde Lawal",
    customerEmail: "babatunde.l@yahoo.com",
    vendorName: "Somotex Mega Store",
    subtotalAmount: "₦2,100,000",
    vendorPaidDiscount: "₦30,000 [SOMOTEX30]",
    adminPaidDiscount: "₦15,000 [WELCOME15]",
    finalAmount: "₦2,055,000",
    paymentMethods: "Bank Transfer",
    orderStatus: "Delivered",
  },
  {
    id: "4",
    orderId: "#ORD-88180",
    dateTime: "18-09-2026 10:15",
    customerName: "Fatima Al-Hassan",
    customerEmail: "fatima.h@gmail.com",
    vendorName: "Scanfrost Official Store",
    subtotalAmount: "₦1,287,600",
    vendorPaidDiscount: "₦12,800 [VENDOR10]",
    adminPaidDiscount: "-",
    finalAmount: "₦1,274,800",
    paymentMethods: "Debit Card",
    orderStatus: "Shipped",
  },
  {
    id: "5",
    orderId: "#ORD-88168",
    dateTime: "17-09-2026 16:50",
    customerName: "Emeka Okafor",
    customerEmail: "emeka.o@enterprise.ng",
    vendorName: "Thermocool Direct",
    subtotalAmount: "₦2,420,000",
    vendorPaidDiscount: "-",
    adminPaidDiscount: "₦50,000 [MEGA50]",
    finalAmount: "₦2,370,000",
    paymentMethods: "Corporate Wire",
    orderStatus: "Completed",
  },
  {
    id: "6",
    orderId: "#ORD-88155",
    dateTime: "17-09-2026 11:35",
    customerName: "Zainab Bello",
    customerEmail: "zainab.b@outlook.com",
    vendorName: "Hisense Official",
    subtotalAmount: "₦430,000",
    vendorPaidDiscount: "₦15,000 [HISENSE15]",
    adminPaidDiscount: "-",
    finalAmount: "₦415,000",
    paymentMethods: "KoolPay Wallet",
    orderStatus: "Pending",
  },
  {
    id: "7",
    orderId: "#ORD-88142",
    dateTime: "16-09-2026 14:10",
    customerName: "Kelechi Eze",
    customerEmail: "kelechi.eze@gmail.com",
    vendorName: "Somotex Mega Store",
    subtotalAmount: "₦1,287,600",
    vendorPaidDiscount: "-",
    adminPaidDiscount: "₦10,000 [NEWUSER]",
    finalAmount: "₦1,277,600",
    paymentMethods: "Debit Card",
    orderStatus: "Delivered",
  },
  {
    id: "8",
    orderId: "#ORD-88130",
    dateTime: "16-09-2026 09:25",
    customerName: "Tunde Babalola",
    customerEmail: "tunde.b@example.com",
    vendorName: "Bruhm Appliances Hub",
    subtotalAmount: "₦1,662,370",
    vendorPaidDiscount: "₦25,000 [BRUHM25]",
    adminPaidDiscount: "₦10,000 [VIPPROMO]",
    finalAmount: "₦1,627,370",
    paymentMethods: "BNPL Installment",
    orderStatus: "Delivered",
  },
  {
    id: "9",
    orderId: "#ORD-88118",
    dateTime: "15-09-2026 17:30",
    customerName: "Folake Adeleke",
    customerEmail: "folake.a@gmail.com",
    vendorName: "Scanfrost Official Store",
    subtotalAmount: "₦1,406,000",
    vendorPaidDiscount: "₦15,000 [SCANFROST]",
    adminPaidDiscount: "-",
    finalAmount: "₦1,391,000",
    paymentMethods: "Debit Card",
    orderStatus: "Delivered",
  },
  {
    id: "10",
    orderId: "#ORD-88102",
    dateTime: "15-09-2026 13:45",
    customerName: "Ibrahim Musa",
    customerEmail: "ibrahim.m@north.ng",
    vendorName: "Thermocool Direct",
    subtotalAmount: "₦2,100,000",
    vendorPaidDiscount: "-",
    adminPaidDiscount: "₦20,000 [ADMINFEST]",
    finalAmount: "₦2,080,000",
    paymentMethods: "Bank Transfer",
    orderStatus: "Cancelled",
  },
];

const tabs = [
  "All Promos (1,420)",
  "Vendor Paid Promos",
  "Admin Paid Promos",
  "Delivered",
  "Pending",
];

const statusStyles = {
  Delivered: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  Completed: "bg-blue-50 text-brand-blue border border-blue-100",
  Shipped: "bg-sky-50 text-sky-600 border border-sky-100",
  Pending: "bg-amber-50 text-amber-600 border border-amber-100",
  Cancelled: "bg-rose-50 text-rose-600 border border-rose-100",
};

export default function AccountingPromoCodesPage() {
  const [activeTab, setActiveTab] = useState("All Promos (1,420)");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAddReportModalOpen, setIsAddReportModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PromoOrderRecord | null>(
    null,
  );

  // Filter records
  const filteredOrders = useMemo(() => {
    return initialPromoOrders.filter((order) => {
      if (
        activeTab === "Vendor Paid Promos" &&
        order.vendorPaidDiscount === "-"
      ) {
        return false;
      }
      if (
        activeTab === "Admin Paid Promos" &&
        order.adminPaidDiscount === "-"
      ) {
        return false;
      }
      if (activeTab === "Delivered" && order.orderStatus !== "Delivered") {
        return false;
      }
      if (activeTab === "Pending" && order.orderStatus !== "Pending") {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesOrder = order.orderId.toLowerCase().includes(query);
        const matchesCustomer = order.customerName
          .toLowerCase()
          .includes(query);
        const matchesVendor = order.vendorName.toLowerCase().includes(query);
        const matchesPayment = order.paymentMethods
          .toLowerCase()
          .includes(query);
        const matchesVendorDiscount = order.vendorPaidDiscount
          .toLowerCase()
          .includes(query);
        const matchesAdminDiscount = order.adminPaidDiscount
          .toLowerCase()
          .includes(query);

        return (
          matchesOrder ||
          matchesCustomer ||
          matchesVendor ||
          matchesPayment ||
          matchesVendorDiscount ||
          matchesAdminDiscount
        );
      }

      return true;
    });
  }, [activeTab, searchQuery]);

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
      selectedIds.length === paginatedOrders.length &&
      paginatedOrders.length > 0
    ) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedOrders.map((o) => o.id));
    }
  };

  const toggleItem = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <div className="flex flex-col gap-6 pb-12 mx-auto">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          {/* <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Promo Codes (Accounting)
            </h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-brand-blue-light text-brand-blue border border-[#00BCD4]/20">
              Accounting Audit
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Audit promotional code usage, track vendor vs admin absorbed
            funding, and view order breakdowns
          </p> */}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link href="/admin/coupons">
            <Button
              variant="outline"
              size="md"
              className="border-gray-200 text-gray-800 shadow-2xs hover:bg-gray-50 px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5"
            >
              <span>View Marketing Promocodes</span>
              <HiOutlineArrowRight className="w-3.5 h-3.5 text-[#00BCD4]" />
            </Button>
          </Link>

          <Button
            variant="outline"
            size="md"
            iconLeft={
              <HiOutlineDocumentArrowDown
                size={18}
                className="text-brand-blue"
              />
            }
            className="border-gray-200 text-gray-800 shadow-2xs hover:bg-gray-50 px-4 py-2 text-xs sm:text-sm font-semibold"
            onClick={() => setIsExportModalOpen(true)}
          >
            Export Report
          </Button>

          <Button
            variant="blue"
            size="md"
            className="px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold shadow-sm shadow-brand-blue/20 bg-[#00BCD4] hover:bg-[#00BCD4]/90 text-white"
            iconLeft={<HiOutlinePlus size={16} />}
            onClick={() => setIsAddReportModalOpen(true)}
          >
            + Add Report
          </Button>
        </div>
      </div>

      {/* 4 Cards (smaller rounded-lg) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          size="sm"
          title="Admin Paid Total"
          value="₦4,850,000"
          trendValue="12.4%"
          trendIsUp={true}
          subtitle="Platform funded promos"
          badgeIcon={<HiOutlineTag className="w-4 h-4" />}
        />

        <StatCard
          size="sm"
          title="Vendor Paid Total"
          value="₦6,240,000"
          trendValue="18.2%"
          trendIsUp={true}
          subtitle="Merchant funded promos"
          badgeIcon={<HiOutlineBuildingStorefront className="w-4 h-4" />}
        />

        <StatCard
          size="sm"
          title="Promo Code Uses"
          value="1,420"
          trendValue="15.0%"
          trendIsUp={true}
          subtitle="Total redemptions"
          badgeIcon={<HiOutlineTicket className="w-4 h-4" />}
        />

        <StatCard
          size="sm"
          title="Unique Users To Use Promo Code"
          value="1,180"
          trendValue="9.5%"
          trendIsUp={true}
          subtitle="Distinct customers"
          badgeIcon={<HiOutlineUsers className="w-4 h-4" />}
        />
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-2xs overflow-hidden flex flex-col">
        {/* Filter Controls Row */}
        <div className="p-4 sm:p-5 flex flex-col lg:flex-row gap-4 items-center justify-between border-b border-gray-100">
          <TabFilter
            tabs={tabs}
            activeTab={activeTab}
            onChange={(tab) => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
            id="promo-codes-tab-filter"
          />

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <Input
              type="text"
              placeholder="Search order ID, customer, vendor, code..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              containerClassName="w-full lg:w-80"
              className="bg-white border-gray-200 text-xs font-medium rounded-lg"
              suffixElement={
                <Icon
                  name="search-01"
                  folder="dashboardIcon"
                  size="sm"
                  className="text-gray-400"
                />
              }
            />

            <RowsPerPage
              value={rowsPerPage}
              onChange={(val) => {
                setRowsPerPage(val);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* Table Area */}
        <div className="admin-table-container overflow-x-auto">
          <table className="w-full min-w-237.5">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="w-10 py-3 px-4">
                  <Checkbox
                    checked={
                      selectedIds.length === paginatedOrders.length &&
                      paginatedOrders.length > 0
                    }
                    onChange={toggleAll}
                  />
                </th>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Vendor Name</th>
                <th className="py-3 px-4">Subtotal Amount</th>
                <th className="py-3 px-4">Promo Discount [Vendor Paid]</th>
                <th className="py-3 px-4">Promo Discount [Admin Paid]</th>
                <th className="py-3 px-4">Final Amount</th>
                <th className="py-3 px-4">Payment Methods</th>
                <th className="py-3 px-4">Order Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="hover:bg-gray-50/60 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4">
                      <div onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedIds.includes(order.id)}
                          onChange={() => toggleItem(order.id)}
                        />
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-xs text-brand-blue whitespace-nowrap">
                      {order.orderId}
                    </td>

                    <td className="py-3.5 px-4 text-xs text-gray-500 whitespace-nowrap">
                      {order.dateTime}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-900 whitespace-nowrap">
                          {order.customerName}
                        </span>
                        <span className="text-[11px] text-gray-400">
                          {order.customerEmail}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-xs font-semibold text-gray-800 whitespace-nowrap">
                      {order.vendorName}
                    </td>

                    <td className="py-3.5 px-4 text-xs font-medium text-gray-600 whitespace-nowrap">
                      {order.subtotalAmount}
                    </td>

                    <td className="py-3.5 px-4 text-xs whitespace-nowrap">
                      {order.vendorPaidDiscount !== "-" ? (
                        <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                          {order.vendorPaidDiscount}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-center block">
                          -
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-xs whitespace-nowrap">
                      {order.adminPaidDiscount !== "-" ? (
                        <span className="font-bold text-brand-blue bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-100">
                          {order.adminPaidDiscount}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-center block">
                          -
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-xs text-gray-900 whitespace-nowrap">
                      {order.finalAmount}
                    </td>

                    <td className="py-3.5 px-4 text-xs whitespace-nowrap">
                      <span className="font-medium text-gray-700 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-200">
                        {order.paymentMethods}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-xs whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold ${
                          statusStyles[order.orderStatus]
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={11}
                    className="py-12 text-center text-gray-400 text-xs"
                  >
                    No promo code transactions found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3">
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

      {/* Export Report Modal */}
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
                Export Promo Code Report
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Download detailed audit logs including vendor vs admin absorbed
                promo code costs and customer redemptions.
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
