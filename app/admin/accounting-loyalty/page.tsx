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
import Link from "next/link";
import {
  HiOutlineCreditCard,
  HiOutlineSparkles,
  HiOutlineGift,
  HiOutlineShoppingCart,
  HiOutlineArrowDownTray,
  HiOutlineCheckBadge,
  HiOutlineArrowRight,
} from "react-icons/hi2";

interface LoyaltyRecord {
  id: string;
  orderId: string;
  dateTime: string;
  customerName: string;
  customerEmail: string;
  finalAmount: string;
  loyaltyCardsUsed: string;
  loyaltyCardsMembership: "Gold VIP" | "Silver Preferred" | "Bronze Member";
  loyaltyCardsEarned: string;
  paymentMethods: string;
}

const initialLoyaltyRecords: LoyaltyRecord[] = [
  {
    id: "1",
    orderId: "#ORD-98421",
    dateTime: "18-09-2026 14:32",
    customerName: "Adebayo Olumide",
    customerEmail: "adebayo@koolboks.com",
    finalAmount: "₦1,406,000",
    loyaltyCardsUsed: "2 Cards (-₦10,000)",
    loyaltyCardsMembership: "Gold VIP",
    loyaltyCardsEarned: "+2 Cards",
    paymentMethods: "Debit Card",
  },
  {
    id: "2",
    orderId: "#ORD-98418",
    dateTime: "18-09-2026 12:15",
    customerName: "Chioma Nwosu",
    customerEmail: "chioma.n@gmail.com",
    finalAmount: "₦850,000",
    loyaltyCardsUsed: "1 Card (-₦5,000)",
    loyaltyCardsMembership: "Silver Preferred",
    loyaltyCardsEarned: "+1 Card",
    paymentMethods: "BNPL Installment",
  },
  {
    id: "3",
    orderId: "#ORD-98410",
    dateTime: "17-09-2026 18:40",
    customerName: "Babatunde Lawal",
    customerEmail: "babatunde.lawal@yahoo.com",
    finalAmount: "₦2,100,000",
    loyaltyCardsUsed: "3 Cards (-₦15,000)",
    loyaltyCardsMembership: "Gold VIP",
    loyaltyCardsEarned: "+3 Cards",
    paymentMethods: "Bank Transfer",
  },
  {
    id: "4",
    orderId: "#ORD-98395",
    dateTime: "17-09-2026 11:20",
    customerName: "Fatima Al-Hassan",
    customerEmail: "fatima.h@gmail.com",
    finalAmount: "₦430,000",
    loyaltyCardsUsed: "None",
    loyaltyCardsMembership: "Bronze Member",
    loyaltyCardsEarned: "+1 Card",
    paymentMethods: "Debit Card",
  },
  {
    id: "5",
    orderId: "#ORD-98380",
    dateTime: "16-09-2026 16:05",
    customerName: "Emeka Okafor",
    customerEmail: "emeka.okafor@enterprise.ng",
    finalAmount: "₦3,250,000",
    loyaltyCardsUsed: "4 Cards (-₦20,000)",
    loyaltyCardsMembership: "Gold VIP",
    loyaltyCardsEarned: "+4 Cards",
    paymentMethods: "Corporate Wire",
  },
  {
    id: "6",
    orderId: "#ORD-98372",
    dateTime: "16-09-2026 10:45",
    customerName: "Zainab Bello",
    customerEmail: "zainab.bello@outlook.com",
    finalAmount: "₦1,287,600",
    loyaltyCardsUsed: "1 Card (-₦5,000)",
    loyaltyCardsMembership: "Silver Preferred",
    loyaltyCardsEarned: "+2 Cards",
    paymentMethods: "KoolPay Wallet",
  },
  {
    id: "7",
    orderId: "#ORD-98360",
    dateTime: "15-09-2026 15:22",
    customerName: "Kelechi Eze",
    customerEmail: "kelechi.eze@gmail.com",
    finalAmount: "₦620,000",
    loyaltyCardsUsed: "None",
    loyaltyCardsMembership: "Bronze Member",
    loyaltyCardsEarned: "+1 Card",
    paymentMethods: "Debit Card",
  },
  {
    id: "8",
    orderId: "#ORD-98351",
    dateTime: "15-09-2026 09:18",
    customerName: "Tunde Babalola",
    customerEmail: "tunde.babalola@example.com",
    finalAmount: "₦1,662,370",
    loyaltyCardsUsed: "2 Cards (-₦10,000)",
    loyaltyCardsMembership: "Gold VIP",
    loyaltyCardsEarned: "+2 Cards",
    paymentMethods: "BNPL Installment",
  },
  {
    id: "9",
    orderId: "#ORD-98344",
    dateTime: "14-09-2026 17:50",
    customerName: "Folake Adeleke",
    customerEmail: "folake.adeleke@gmail.com",
    finalAmount: "₦940,000",
    loyaltyCardsUsed: "1 Card (-₦5,000)",
    loyaltyCardsMembership: "Silver Preferred",
    loyaltyCardsEarned: "+1 Card",
    paymentMethods: "Debit Card",
  },
  {
    id: "10",
    orderId: "#ORD-98330",
    dateTime: "14-09-2026 13:10",
    customerName: "Ibrahim Musa",
    customerEmail: "ibrahim.m@northlogistics.ng",
    finalAmount: "₦1,890,000",
    loyaltyCardsUsed: "2 Cards (-₦10,000)",
    loyaltyCardsMembership: "Bronze Member",
    loyaltyCardsEarned: "+2 Cards",
    paymentMethods: "Bank Transfer",
  },
];

const tabs = [
  "All Cards (940)",
  "Gold VIP",
  "Silver Preferred",
  "Bronze Member",
];

export default function AccountingLoyaltyCardsPage() {
  const [activeTab, setActiveTab] = useState("All Cards (940)");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<LoyaltyRecord | null>(
    null,
  );

  const filteredRecords = useMemo(() => {
    return initialLoyaltyRecords.filter((record) => {
      if (
        activeTab === "Gold VIP" &&
        record.loyaltyCardsMembership !== "Gold VIP"
      )
        return false;
      if (
        activeTab === "Silver Preferred" &&
        record.loyaltyCardsMembership !== "Silver Preferred"
      )
        return false;
      if (
        activeTab === "Bronze Member" &&
        record.loyaltyCardsMembership !== "Bronze Member"
      )
        return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesOrder = record.orderId.toLowerCase().includes(query);
        const matchesName = record.customerName.toLowerCase().includes(query);
        const matchesEmail = record.customerEmail.toLowerCase().includes(query);
        const matchesPayment = record.paymentMethods
          .toLowerCase()
          .includes(query);
        return matchesOrder || matchesName || matchesEmail || matchesPayment;
      }

      return true;
    });
  }, [activeTab, searchQuery]);

  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredRecords.slice(start, start + rowsPerPage);
  }, [filteredRecords, currentPage, rowsPerPage]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRecords.length / rowsPerPage),
  );

  const getMembershipBadge = (tier: string) => {
    switch (tier) {
      case "Gold VIP":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Silver Preferred":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "Bronze Member":
        return "bg-orange-50 text-orange-700 border-orange-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Top Header Action Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          {/* <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Loyalty Cards (Accounting)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
              Audit Report
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Audit loyalty cards applied at checkout, points earned and redeemed, customer tier status, and order settlements
          </p> */}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            href="/admin/loyalty-cards"
            className="inline-flex items-center gap-1.5 h-10 px-4 text-xs font-bold rounded-lg border border-brand-blue/30 text-brand-blue bg-brand-blue-light/50 hover:bg-brand-blue-light transition-colors"
          >
            <span>Marketing Loyalty Plans</span>
            <HiOutlineArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Button
            variant="outline"
            className="flex-1 sm:flex-initial h-10 px-4 text-xs font-bold border-gray-200 text-gray-700 hover:bg-gray-50"
            iconLeft={<HiOutlineArrowDownTray className="w-4 h-4" />}
            onClick={() => setIsExportModalOpen(true)}
          >
            Export Logs
          </Button>
          <Button
            className="flex-1 sm:flex-initial h-10 px-4 text-xs font-bold bg-[#00BCD4] hover:bg-[#00BCD4]/90 text-white shadow-xs"
            iconLeft={<HiOutlineGift className="w-4 h-4" />}
            onClick={() => setIsIssueModalOpen(true)}
          >
            Issue Loyalty Card
          </Button>
        </div>
      </div>

      {/* 4 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          size="sm"
          title="Type Of Loyalty Cards Applied"
          value="3 Active Types"
          trendValue="100% Active"
          trendIsUp={true}
          subtitle="Gold, Silver & Bronze Tiers"
          badgeIcon={<HiOutlineCreditCard className="w-4 h-4" />}
        />
        <StatCard
          size="sm"
          title="Total Loyalty Cards Earned"
          value="2,840 Cards"
          trendValue="18.5%"
          trendIsUp={true}
          subtitle="+340 this month"
          badgeIcon={<HiOutlineSparkles className="w-4 h-4" />}
        />
        <StatCard
          size="sm"
          title="Total Loyalty Cards Spent"
          value="1,620 Cards"
          trendValue="12.2%"
          trendIsUp={true}
          subtitle="₦8.1M redeemed value"
          badgeIcon={<HiOutlineGift className="w-4 h-4" />}
        />
        <StatCard
          size="sm"
          title="Unique Orders"
          value="940"
          trendValue="8.7%"
          trendIsUp={true}
          subtitle="Orders with loyalty cards"
          badgeIcon={<HiOutlineShoppingCart className="w-4 h-4" />}
        />
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 sm:p-6 flex flex-col lg:flex-row gap-6 items-center justify-between border-b border-gray-50">
          <TabFilter
            tabs={tabs}
            activeTab={activeTab}
            onChange={(tab) => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
            id="loyalty-tab-filter"
          />

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <Input
              type="text"
              placeholder="Search by order ID, customer, payment..."
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

        {/* Table Container */}
        <div className="admin-table-container">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date & Time</th>
                <th>Customer Name</th>
                <th>Final Amount</th>
                <th>Loyalty Cards Used</th>
                <th>Loyalty Cards Membership</th>
                <th>Loyalty Cards Earned</th>
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
                    <td className="font-mono font-bold text-xs text-brand-blue">
                      {record.orderId}
                    </td>
                    <td className="text-xs text-gray-500 whitespace-nowrap">
                      {record.dateTime}
                    </td>
                    <td>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-900">
                          {record.customerName}
                        </span>
                        <span className="text-[11px] text-gray-400">
                          {record.customerEmail}
                        </span>
                      </div>
                    </td>
                    <td className="font-bold text-xs text-gray-900">
                      {record.finalAmount}
                    </td>
                    <td className="text-xs">
                      {record.loyaltyCardsUsed !== "None" ? (
                        <span className="font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-100 whitespace-nowrap">
                          {record.loyaltyCardsUsed}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">None</span>
                      )}
                    </td>
                    <td>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border ${getMembershipBadge(
                          record.loyaltyCardsMembership,
                        )}`}
                      >
                        <HiOutlineCheckBadge className="w-3.5 h-3.5" />
                        {record.loyaltyCardsMembership}
                      </span>
                    </td>
                    <td className="text-xs">
                      <span className="font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 whitespace-nowrap">
                        {record.loyaltyCardsEarned}
                      </span>
                    </td>
                    <td className="text-xs">
                      <span className="font-medium text-gray-700 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-200 whitespace-nowrap">
                        {record.paymentMethods}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="py-12 text-center text-gray-400 text-xs"
                  >
                    No loyalty card transactions found matching your criteria.
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

      {/* Record Details Modal */}
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
                    <HiOutlineCreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">
                      Transaction {selectedRecord.orderId}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {selectedRecord.dateTime}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${getMembershipBadge(
                    selectedRecord.loyaltyCardsMembership,
                  )}`}
                >
                  {selectedRecord.loyaltyCardsMembership}
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
                  <span className="text-gray-400">Final Amount</span>
                  <p className="font-bold text-gray-900 text-sm mt-0.5">
                    {selectedRecord.finalAmount}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Via {selectedRecord.paymentMethods}
                  </p>
                </div>

                <div className="p-3 bg-rose-50/50 rounded-lg border border-rose-100">
                  <span className="text-gray-500">Loyalty Cards Used</span>
                  <p className="font-bold text-rose-600 mt-0.5">
                    {selectedRecord.loyaltyCardsUsed}
                  </p>
                </div>

                <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100">
                  <span className="text-gray-500">Loyalty Cards Earned</span>
                  <p className="font-bold text-emerald-600 mt-0.5">
                    {selectedRecord.loyaltyCardsEarned}
                  </p>
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

      {/* Export Modal */}
      <Modal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      >
        <ModalBody>
          <div className="space-y-4 pt-2 text-center">
            <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <HiOutlineArrowDownTray className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">
                Export Loyalty Card Report
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Download complete audit log of loyalty cards earned, redeemed,
                and customer tier assignments.
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

      {/* Issue Modal */}
      <Modal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
      >
        <ModalBody>
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-50 text-[#00BCD4] flex items-center justify-center">
                <HiOutlineGift className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">
                  Issue Loyalty Card
                </h3>
                <p className="text-xs text-gray-500">
                  Grant bonus loyalty cards or adjust member tier points
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">
                  Customer Email or Account ID
                </label>
                <Input
                  placeholder="e.g. customer@example.com"
                  className="bg-gray-50 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">
                  Number of Cards to Issue
                </label>
                <Input
                  type="number"
                  defaultValue="1"
                  className="bg-gray-50 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">
                  Reason for Issuance
                </label>
                <Input
                  placeholder="e.g. Promotional campaign bonus, Customer delight"
                  className="bg-gray-50 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsIssueModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-[#00BCD4] text-white"
                onClick={() => setIsIssueModalOpen(false)}
              >
                Confirm & Issue
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}
