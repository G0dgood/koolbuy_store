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
  HiOutlineDocumentText,
  HiOutlineReceiptPercent,
  HiOutlineDocumentArrowDown,
  HiOutlineAdjustmentsHorizontal,
} from "react-icons/hi2";
import Link from "next/link";

interface TaxRecord {
  id: string;
  orderId: string;
  dateTime: string;
  customerName: string;
  customerEmail: string;
  finalAmount: string;
  taxAmount: string;
  paymentMethods: string;
  taxType: "VAT (7.5%)" | "WHT (5%)" | "VAT + WHT";
}

const initialTaxRecords: TaxRecord[] = [
  {
    id: "1",
    orderId: "#ORD-98421",
    dateTime: "18-09-2026 14:32",
    customerName: "Adebayo Olumide",
    customerEmail: "adebayo@koolboks.com",
    finalAmount: "₦1,406,000",
    taxAmount: "₦105,450",
    paymentMethods: "Debit Card",
    taxType: "VAT (7.5%)",
  },
  {
    id: "2",
    orderId: "#ORD-98418",
    dateTime: "18-09-2026 12:15",
    customerName: "Chioma Nwosu",
    customerEmail: "chioma.n@gmail.com",
    finalAmount: "₦1,662,370",
    taxAmount: "₦124,678",
    paymentMethods: "BNPL Installment",
    taxType: "VAT (7.5%)",
  },
  {
    id: "3",
    orderId: "#ORD-98410",
    dateTime: "17-09-2026 18:40",
    customerName: "Babatunde Lawal",
    customerEmail: "babatunde.l@yahoo.com",
    finalAmount: "₦2,100,000",
    taxAmount: "₦157,500",
    paymentMethods: "Bank Transfer",
    taxType: "VAT (7.5%)",
  },
  {
    id: "4",
    orderId: "#ORD-98395",
    dateTime: "17-09-2026 11:20",
    customerName: "Fatima Al-Hassan",
    customerEmail: "fatima.h@gmail.com",
    finalAmount: "₦430,000",
    taxAmount: "₦32,250",
    paymentMethods: "Debit Card",
    taxType: "VAT (7.5%)",
  },
  {
    id: "5",
    orderId: "#ORD-98380",
    dateTime: "16-09-2026 16:05",
    customerName: "Emeka Okafor",
    customerEmail: "emeka.o@enterprise.ng",
    finalAmount: "₦3,250,000",
    taxAmount: "₦243,750",
    paymentMethods: "Corporate Wire",
    taxType: "VAT + WHT",
  },
  {
    id: "6",
    orderId: "#ORD-98372",
    dateTime: "16-09-2026 10:45",
    customerName: "Zainab Bello",
    customerEmail: "zainab.b@outlook.com",
    finalAmount: "₦1,287,600",
    taxAmount: "₦96,570",
    paymentMethods: "KoolPay Wallet",
    taxType: "VAT (7.5%)",
  },
  {
    id: "7",
    orderId: "#ORD-98360",
    dateTime: "15-09-2026 15:22",
    customerName: "Kelechi Eze",
    customerEmail: "kelechi.eze@gmail.com",
    finalAmount: "₦620,000",
    taxAmount: "₦46,500",
    paymentMethods: "Debit Card",
    taxType: "VAT (7.5%)",
  },
  {
    id: "8",
    orderId: "#ORD-98351",
    dateTime: "15-09-2026 09:18",
    customerName: "Tunde Babalola",
    customerEmail: "tunde.b@example.com",
    finalAmount: "₦1,662,370",
    taxAmount: "₦124,678",
    paymentMethods: "BNPL Installment",
    taxType: "VAT (7.5%)",
  },
  {
    id: "9",
    orderId: "#ORD-98344",
    dateTime: "14-09-2026 17:50",
    customerName: "Folake Adeleke",
    customerEmail: "folake.a@gmail.com",
    finalAmount: "₦940,000",
    taxAmount: "₦70,500",
    paymentMethods: "Debit Card",
    taxType: "VAT (7.5%)",
  },
  {
    id: "10",
    orderId: "#ORD-98330",
    dateTime: "14-09-2026 13:10",
    customerName: "Ibrahim Musa",
    customerEmail: "ibrahim.m@north.ng",
    finalAmount: "₦1,890,000",
    taxAmount: "₦141,750",
    paymentMethods: "Bank Transfer",
    taxType: "VAT (7.5%)",
  },
];

const tabs = ["All Taxes", "VAT (7.5%)", "Withholding Tax (5%)"];

export default function TaxesReportPage() {
  const [activeTab, setActiveTab] = useState("All Taxes");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<TaxRecord | null>(null);

  // Filter records
  const filteredRecords = useMemo(() => {
    return initialTaxRecords.filter((record) => {
      // Tab filter
      if (activeTab === "VAT (7.5%)" && !record.taxType.includes("VAT")) {
        return false;
      }
      if (
        activeTab === "Withholding Tax (5%)" &&
        !record.taxType.includes("WHT")
      ) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesOrder = record.orderId.toLowerCase().includes(query);
        const matchesCustomer = record.customerName
          .toLowerCase()
          .includes(query);
        const matchesPayment = record.paymentMethods
          .toLowerCase()
          .includes(query);
        const matchesAmount = record.finalAmount.toLowerCase().includes(query);
        const matchesTax = record.taxAmount.toLowerCase().includes(query);

        return (
          matchesOrder ||
          matchesCustomer ||
          matchesPayment ||
          matchesAmount ||
          matchesTax
        );
      }

      return true;
    });
  }, [activeTab, searchQuery]);

  // Paginated records
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredRecords.slice(start, start + rowsPerPage);
  }, [filteredRecords, currentPage, rowsPerPage]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRecords.length / rowsPerPage),
  );

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          {/* <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Taxes
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Audit collected tax transactions, VAT applied, and revenue compliance
          </p> */}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link href="/admin/tax">
            <Button
              variant="outline"
              size="md"
              iconLeft={<HiOutlineAdjustmentsHorizontal size={18} />}
              className="border-gray-200 text-gray-800 shadow-2xs hover:bg-gray-50 px-4 py-2 text-xs sm:text-sm font-semibold"
            >
              Configure Tax Rates
            </Button>
          </Link>

          <Button
            variant="blue"
            size="md"
            iconLeft={<HiOutlineDocumentArrowDown size={18} />}
            className="px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold shadow-sm shadow-brand-blue/20 bg-[#00BCD4] hover:bg-[#00BCD4]/90 text-white"
            onClick={() => setIsExportModalOpen(true)}
          >
            Export Tax Report
          </Button>
        </div>
      </div>

      {/* 2 Cards (Type Of Taxes Applied, Total Tax Collected) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 1. Type Of Taxes Applied */}
        <StatCard
          size="sm"
          title="Type Of Taxes Applied"
          value="VAT (7.5%), WHT (5%)"
          trendValue="100% Active"
          trendIsUp={true}
          subtitle="Standard VAT & Withholding Tax"
          badgeIcon={<HiOutlineReceiptPercent className="w-4 h-4" />}
        />

        {/* 2. Total Tax Collected */}
        <StatCard
          size="sm"
          title="Total Tax Collected"
          value="₦14,820,000"
          trendValue="11.8%"
          trendIsUp={true}
          subtitle="+₦1.2M this month"
          badgeIcon={<HiOutlineDocumentText className="w-4 h-4" />}
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
            id="taxes-tab-filter"
          />

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <Input
              type="text"
              placeholder="Search order ID, customer, payment..."
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

        {/* Table Area */}
        <div className="admin-table-container">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date & Time</th>
                <th>Customer Name</th>
                <th>Final Amount</th>
                <th>Tax Amount</th>
                <th>Payment Methods</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRecords.length > 0 ? (
                paginatedRecords.map((record) => (
                  <tr
                    key={record.id}
                    onClick={() => setSelectedRecord(record)}
                    className="hover:bg-gray-50/60 transition-colors"
                  >
                    {/* Order ID */}
                    <td className="font-mono font-bold text-xs text-brand-blue whitespace-nowrap">
                      {record.orderId}
                    </td>

                    {/* Date & Time */}
                    <td className="text-xs text-gray-500 whitespace-nowrap">
                      {record.dateTime}
                    </td>

                    {/* Customer Name */}
                    <td>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-900 whitespace-nowrap">
                          {record.customerName}
                        </span>
                        <span className="text-[11px] text-gray-400">
                          {record.customerEmail}
                        </span>
                      </div>
                    </td>

                    {/* Final Amount */}
                    <td className="font-bold text-xs text-gray-900 whitespace-nowrap">
                      {record.finalAmount}
                    </td>

                    {/* Tax Amount */}
                    <td className="text-xs whitespace-nowrap">
                      <span className="font-bold text-brand-blue bg-cyan-50 px-2.5 py-1 rounded-md border border-cyan-100">
                        {record.taxAmount}
                      </span>
                    </td>

                    {/* Payment Methods */}
                    <td className="text-xs whitespace-nowrap">
                      <span className="font-medium text-gray-700 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-200">
                        {record.paymentMethods}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-gray-400 text-xs"
                  >
                    No tax records found matching your criteria.
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
              {filteredRecords.length === 0
                ? 0
                : (currentPage - 1) * rowsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-bold text-gray-700">
              {Math.min(currentPage * rowsPerPage, filteredRecords.length)}
            </span>{" "}
            of{" "}
            <span className="font-bold text-gray-700">
              {filteredRecords.length}
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

      {/* Tax Record Details Modal */}
      {selectedRecord && (
        <Modal
          isOpen={!!selectedRecord}
          onClose={() => setSelectedRecord(null)}
        >
          <ModalBody>
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-brand-blue-light text-brand-blue flex items-center justify-center">
                    <HiOutlineReceiptPercent className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">
                      Tax Assessment for {selectedRecord.orderId}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {selectedRecord.dateTime}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-xs bg-cyan-50 text-brand-blue px-2.5 py-1 rounded-md border border-cyan-100">
                  {selectedRecord.taxType}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="text-gray-400">Customer</span>
                  <p className="font-bold text-gray-900 mt-0.5">
                    {selectedRecord.customerName}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    {selectedRecord.customerEmail}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="text-gray-400">Final Order Amount</span>
                  <p className="font-bold text-gray-900 text-sm mt-0.5">
                    {selectedRecord.finalAmount}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Via {selectedRecord.paymentMethods}
                  </p>
                </div>

                <div className="p-3 bg-cyan-50/50 rounded-lg border border-cyan-100 col-span-2 flex items-center justify-between">
                  <div>
                    <span className="text-gray-500">Total Tax Levied</span>
                    <p className="text-[11px] text-gray-400">
                      Standard VAT calculation on taxable merchandise
                    </p>
                  </div>
                  <span className="text-base font-black text-brand-blue">
                    {selectedRecord.taxAmount}
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  size="sm"
                  className="bg-[#00BCD4] text-white"
                  onClick={() => setSelectedRecord(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </ModalBody>
        </Modal>
      )}

      {/* Export Tax Report Modal */}
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
                Export Tax & VAT Audit Report
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Download tax ledger for statutory compliance, FIRS submission,
                and accounting reconciliation.
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
