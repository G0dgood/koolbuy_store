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
  HiOutlineCurrencyDollar,
  HiOutlineTruck,
  HiOutlineReceiptPercent,
  HiOutlineDocumentArrowDown,
  HiOutlineBuildingStorefront,
} from "react-icons/hi2";

interface VendorSettlementRecord {
  id: string;
  vendorName: string;
  orderId: string;
  dateTime: string;
  orderValue: string;
  deliveryFees: string;
  adminCommissions: string;
  promoVendor: string;
  promoAdmin: string;
  serviceFee: string;
  fixedFee: string;
  cashCollected: string;
  paymentGateway: string;
  vendorEarning: string;
}

const initialSettlements: VendorSettlementRecord[] = [
  {
    id: "1",
    vendorName: "Scanfrost Official Store",
    orderId: "#ORD-98421",
    dateTime: "18-09-2026 14:32",
    orderValue: "₦1,406,000",
    deliveryFees: "₦15,000",
    adminCommissions: "₦140,600",
    promoVendor: "₦20,000",
    promoAdmin: "₦10,000",
    serviceFee: "₦5,000",
    fixedFee: "₦500",
    cashCollected: "₦1,391,000",
    paymentGateway: "Paystack (₦2,000)",
    vendorEarning: "₦1,237,900",
  },
  {
    id: "2",
    vendorName: "Bruhm Appliances Hub",
    orderId: "#ORD-98418",
    dateTime: "18-09-2026 12:15",
    orderValue: "₦1,662,370",
    deliveryFees: "₦18,000",
    adminCommissions: "₦166,237",
    promoVendor: "₦25,000",
    promoAdmin: "₦0",
    serviceFee: "₦5,000",
    fixedFee: "₦500",
    cashCollected: "₦1,655,370",
    paymentGateway: "Flutterwave (₦2,000)",
    vendorEarning: "₦1,465,633",
  },
  {
    id: "3",
    vendorName: "Somotex Mega Store",
    orderId: "#ORD-98410",
    dateTime: "17-09-2026 18:40",
    orderValue: "₦2,100,000",
    deliveryFees: "₦22,000",
    adminCommissions: "₦210,000",
    promoVendor: "₦30,000",
    promoAdmin: "₦15,000",
    serviceFee: "₦6,000",
    fixedFee: "₦500",
    cashCollected: "₦2,077,000",
    paymentGateway: "Monnify (₦2,000)",
    vendorEarning: "₦1,851,500",
  },
  {
    id: "4",
    vendorName: "Thermocool Direct",
    orderId: "#ORD-98380",
    dateTime: "17-09-2026 16:50",
    orderValue: "₦2,420,000",
    deliveryFees: "₦25,000",
    adminCommissions: "₦242,000",
    promoVendor: "₦0",
    promoAdmin: "₦50,000",
    serviceFee: "₦7,000",
    fixedFee: "₦500",
    cashCollected: "₦2,395,000",
    paymentGateway: "Bank Wire (₦1,500)",
    vendorEarning: "₦2,169,000",
  },
  {
    id: "5",
    vendorName: "Hisense Official",
    orderId: "#ORD-98372",
    dateTime: "16-09-2026 11:35",
    orderValue: "₦430,000",
    deliveryFees: "₦10,000",
    adminCommissions: "₦43,000",
    promoVendor: "₦15,000",
    promoAdmin: "₦0",
    serviceFee: "₦2,500",
    fixedFee: "₦500",
    cashCollected: "₦425,000",
    paymentGateway: "Paystack (₦850)",
    vendorEarning: "₦368,150",
  },
  {
    id: "6",
    vendorName: "Haier Thermocool Flagship",
    orderId: "#ORD-98330",
    dateTime: "16-09-2026 10:20",
    orderValue: "₦1,890,000",
    deliveryFees: "₦20,000",
    adminCommissions: "₦189,000",
    promoVendor: "₦0",
    promoAdmin: "₦20,000",
    serviceFee: "₦5,500",
    fixedFee: "₦500",
    cashCollected: "₦1,890,000",
    paymentGateway: "Paystack (₦2,000)",
    vendorEarning: "₦1,693,000",
  },
  {
    id: "7",
    vendorName: "Maxi Appliances",
    orderId: "#ORD-98315",
    dateTime: "15-09-2026 15:10",
    orderValue: "₦1,287,600",
    deliveryFees: "₦15,000",
    adminCommissions: "₦128,760",
    promoVendor: "₦12,800",
    promoAdmin: "₦0",
    serviceFee: "₦4,000",
    fixedFee: "₦500",
    cashCollected: "₦1,289,800",
    paymentGateway: "Flutterwave (₦1,800)",
    vendorEarning: "₦1,139,740",
  },
  {
    id: "8",
    vendorName: "Polystar Electronics",
    orderId: "#ORD-98302",
    dateTime: "15-09-2026 11:45",
    orderValue: "₦950,000",
    deliveryFees: "₦12,000",
    adminCommissions: "₦95,000",
    promoVendor: "₦10,000",
    promoAdmin: "₦5,000",
    serviceFee: "₦3,000",
    fixedFee: "₦500",
    cashCollected: "₦947,000",
    paymentGateway: "Monnify (₦1,200)",
    vendorEarning: "₦839,100",
  },
  {
    id: "9",
    vendorName: "Skyrun Solar Systems",
    orderId: "#ORD-98290",
    dateTime: "14-09-2026 16:30",
    orderValue: "₦3,150,000",
    deliveryFees: "₦30,000",
    adminCommissions: "₦315,000",
    promoVendor: "₦35,000",
    promoAdmin: "₦0",
    serviceFee: "₦8,000",
    fixedFee: "₦500",
    cashCollected: "₦3,145,000",
    paymentGateway: "Bank Wire (₦2,000)",
    vendorEarning: "₦2,789,500",
  },
  {
    id: "10",
    vendorName: "Restpoint Cooling Hub",
    orderId: "#ORD-98275",
    dateTime: "14-09-2026 13:15",
    orderValue: "₦620,000",
    deliveryFees: "₦10,000",
    adminCommissions: "₦62,000",
    promoVendor: "₦0",
    promoAdmin: "₦10,000",
    serviceFee: "₦2,500",
    fixedFee: "₦500",
    cashCollected: "₦620,000",
    paymentGateway: "Paystack (₦1,100)",
    vendorEarning: "₦553,900",
  },
];

const tabs = [
  "All Vendors",
  "Top Earners",
  "With Promo Deductions",
  "High Volume",
];

export default function VendorAccountingPage() {
  const [activeTab, setActiveTab] = useState("All Vendors");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedSettlement, setSelectedSettlement] =
    useState<VendorSettlementRecord | null>(null);

  // Filter records
  const filteredSettlements = useMemo(() => {
    return initialSettlements.filter((item) => {
      // Tab filter
      if (activeTab === "With Promo Deductions" && item.promoVendor === "₦0") {
        return false;
      }
      if (
        activeTab === "Top Earners" &&
        ![
          "Somotex Mega Store",
          "Thermocool Direct",
          "Skyrun Solar Systems",
        ].includes(item.vendorName)
      ) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesVendor = item.vendorName.toLowerCase().includes(query);
        const matchesOrder = item.orderId.toLowerCase().includes(query);
        const matchesGateway = item.paymentGateway
          .toLowerCase()
          .includes(query);
        const matchesAmount = item.vendorEarning.toLowerCase().includes(query);

        return matchesVendor || matchesOrder || matchesGateway || matchesAmount;
      }

      return true;
    });
  }, [activeTab, searchQuery]);

  // Paginated records
  const paginatedSettlements = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredSettlements.slice(start, start + rowsPerPage);
  }, [filteredSettlements, currentPage, rowsPerPage]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSettlements.length / rowsPerPage),
  );

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          {/* <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Vendors Accounting
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Vendor commission reconciliations, promo absorption, fee deductions, and net payouts
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
            Export Settlements
          </Button>
        </div>
      </div>

      {/* 3 Cards (Total Order Value, Total Delivery Fees, Total Admin Commissions) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* 1. Total Order Value */}
        <StatCard
          size="sm"
          title="Total Order Value"
          value="₦48,850,000"
          trendValue="16.4%"
          trendIsUp={true}
          subtitle="Gross merchandise value"
          badgeIcon={<HiOutlineCurrencyDollar className="w-4 h-4" />}
        />

        {/* 2. Total Delivery Fees */}
        <StatCard
          size="sm"
          title="Total Delivery Fees"
          value="₦3,420,000"
          trendValue="8.2%"
          trendIsUp={true}
          subtitle="Logistics fulfillment value"
          badgeIcon={<HiOutlineTruck className="w-4 h-4" />}
        />

        {/* 3. Total Admin Commissions */}
        <StatCard
          size="sm"
          title="Total Admin Commissions"
          value="₦4,885,000"
          trendValue="14.5%"
          trendIsUp={true}
          subtitle="10% average platform cut"
          badgeIcon={<HiOutlineReceiptPercent className="w-4 h-4" />}
        />
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        {/* Filter Controls Row */}
        <div className="p-4 sm:p-6 flex flex-col lg:flex-row gap-6 items-center justify-between border-b border-gray-50">
          <TabFilter
            tabs={tabs}
            activeTab={activeTab}
            onChange={(tab) => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
            id="vendor-accounting-tab-filter"
          />

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <Input
              type="text"
              placeholder="Search vendor name, order ID, gateway..."
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

        {/* Table Area with the exact 11 requested headers */}
        <div className="admin-table-container">
          <table>
            <thead>
              <tr>
                <th>Vendor Name</th>
                <th>Order Value</th>
                <th>Delivery Fees</th>
                <th>Admin Commissions</th>
                <th>Promo [Vendor]</th>
                <th>Promo [Admin]</th>
                <th>Service Fee</th>
                <th>Fixed Fee</th>
                <th>Cash Collected</th>
                <th>Payment Gateway</th>
                <th>Vendor Earning</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSettlements.length > 0 ? (
                paginatedSettlements.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => setSelectedSettlement(row)}
                    className="hover:bg-gray-50/60 transition-colors"
                  >
                    {/* Vendor Name */}
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-md bg-blue-50 text-brand-blue flex items-center justify-center shrink-0">
                          <HiOutlineBuildingStorefront size={14} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-xs text-gray-900 whitespace-nowrap">
                            {row.vendorName}
                          </span>
                          <span className="text-[10px] font-mono text-gray-400">
                            {row.orderId}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Order Value */}
                    <td className="font-bold text-xs text-gray-900 whitespace-nowrap">
                      {row.orderValue}
                    </td>

                    {/* Delivery Fees */}
                    <td className="text-xs text-gray-600 whitespace-nowrap">
                      {row.deliveryFees}
                    </td>

                    {/* Admin Commissions */}
                    <td className="font-semibold text-xs text-brand-blue whitespace-nowrap">
                      {row.adminCommissions}
                    </td>

                    {/* Promo [Vendor] */}
                    <td className="text-xs whitespace-nowrap">
                      {row.promoVendor !== "₦0" ? (
                        <span className="font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                          {row.promoVendor}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>

                    {/* Promo [Admin] */}
                    <td className="text-xs whitespace-nowrap">
                      {row.promoAdmin !== "₦0" ? (
                        <span className="font-semibold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-100">
                          {row.promoAdmin}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>

                    {/* Service Fee */}
                    <td className="text-xs text-gray-600 whitespace-nowrap">
                      {row.serviceFee}
                    </td>

                    {/* Fixed Fee */}
                    <td className="text-xs text-gray-500 whitespace-nowrap">
                      {row.fixedFee}
                    </td>

                    {/* Cash Collected */}
                    <td className="font-bold text-xs text-gray-900 whitespace-nowrap">
                      {row.cashCollected}
                    </td>

                    {/* Payment Gateway */}
                    <td className="text-xs text-gray-600 whitespace-nowrap">
                      <span className="bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                        {row.paymentGateway}
                      </span>
                    </td>

                    {/* Vendor Earning */}
                    <td className="font-black text-xs text-emerald-600 whitespace-nowrap">
                      {row.vendorEarning}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={11}
                    className="py-12 text-center text-gray-400 text-xs"
                  >
                    No vendor accounting settlements found matching your
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
              {filteredSettlements.length === 0
                ? 0
                : (currentPage - 1) * rowsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-bold text-gray-700">
              {Math.min(currentPage * rowsPerPage, filteredSettlements.length)}
            </span>{" "}
            of{" "}
            <span className="font-bold text-gray-700">
              {filteredSettlements.length}
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

      {/* Settlement Breakdown Modal */}
      {selectedSettlement && (
        <Modal
          isOpen={!!selectedSettlement}
          onClose={() => setSelectedSettlement(null)}
        >
          <ModalBody>
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-lg bg-brand-blue-light text-brand-blue flex items-center justify-center">
                    <HiOutlineBuildingStorefront className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">
                      {selectedSettlement.vendorName}
                    </h3>
                    <p className="text-xs text-gray-400">
                      Order {selectedSettlement.orderId} •{" "}
                      {selectedSettlement.dateTime}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-xs bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-md border border-emerald-100">
                  Settled
                </span>
              </div>

              {/* Breakdown Ledger */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-500">Gross Order Value</span>
                  <span className="font-bold text-gray-900">
                    {selectedSettlement.orderValue}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-500">Delivery Fees</span>
                  <span className="font-medium text-gray-700">
                    +{selectedSettlement.deliveryFees}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-500">
                    Admin Commission (Platform cut)
                  </span>
                  <span className="font-bold text-brand-blue">
                    -{selectedSettlement.adminCommissions}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-500">
                    Promo Discount [Vendor Paid]
                  </span>
                  <span className="font-medium text-purple-700">
                    -{selectedSettlement.promoVendor}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-500">Service Fee</span>
                  <span className="font-medium text-gray-700">
                    -{selectedSettlement.serviceFee}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-500">Fixed Transaction Fee</span>
                  <span className="font-medium text-gray-700">
                    -{selectedSettlement.fixedFee}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-500">Payment Gateway Fee</span>
                  <span className="font-medium text-gray-700">
                    {selectedSettlement.paymentGateway}
                  </span>
                </div>
                <div className="flex justify-between py-2 bg-emerald-50/60 p-3 rounded-lg border border-emerald-100 mt-2">
                  <span className="font-bold text-emerald-900 text-xs">
                    Net Vendor Earning
                  </span>
                  <span className="font-black text-emerald-600 text-sm">
                    {selectedSettlement.vendorEarning}
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  size="sm"
                  className="bg-[#00BCD4] text-white"
                  onClick={() => setSelectedSettlement(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </ModalBody>
        </Modal>
      )}

      {/* Export Settlements Modal */}
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
                Export Vendor Accounting Ledger
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Download comprehensive commission breakdowns, promo absorption
                records, and net payouts for merchant remittance.
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
