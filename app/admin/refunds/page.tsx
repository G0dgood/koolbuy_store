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
  HiOutlineBanknotes,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineBuildingStorefront,
  HiOutlineDocumentArrowDown,
  HiOutlineCheck,
  HiOutlineXMark,
  HiOutlineEye,
} from "react-icons/hi2";

interface PayoutRequestRecord {
  id: string;
  reference: string;
  date: string;
  vendor: string;
  vendorEmail: string;
  requestedBy: string;
  requesterRole: string;
  amount: string;
  payoutType:
    | "Bank Transfer"
    | "Instant Wire"
    | "Wallet Withdrawal"
    | "Weekly Settlement";
  status: "Pending" | "Completed" | "Rejected";
  accountDetails: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
}

const initialPayoutRequests: PayoutRequestRecord[] = [
  {
    id: "1",
    reference: "PAY-98421",
    date: "18-09-2026 14:20",
    vendor: "Scanfrost Official Store",
    vendorEmail: "finance@scanfrost.ng",
    requestedBy: "Alhaji Musa Danjuma",
    requesterRole: "Finance Director",
    amount: "₦1,850,000",
    payoutType: "Weekly Settlement",
    status: "Pending",
    accountDetails: {
      bankName: "Zenith Bank",
      accountNumber: "1012938475",
      accountName: "Scanfrost Nigeria Ltd",
    },
  },
  {
    id: "2",
    reference: "PAY-98418",
    date: "18-09-2026 11:45",
    vendor: "Bruhm Appliances Hub",
    vendorEmail: "accounts@bruhm.ng",
    requestedBy: "Chidinma Okeke",
    requesterRole: "Store Admin",
    amount: "₦1,240,000",
    payoutType: "Instant Wire",
    status: "Pending",
    accountDetails: {
      bankName: "Guaranty Trust Bank",
      accountNumber: "0123984756",
      accountName: "Bruhm Appliances Nig",
    },
  },
  {
    id: "3",
    reference: "PAY-98410",
    date: "17-09-2026 16:30",
    vendor: "Somotex Mega Store",
    vendorEmail: "settlements@somotex.com",
    requestedBy: "Olufemi Adeleke",
    requesterRole: "Managing Partner",
    amount: "₦2,150,000",
    payoutType: "Bank Transfer",
    status: "Pending",
    accountDetails: {
      bankName: "Access Bank",
      accountNumber: "0098765432",
      accountName: "Somotex Group",
    },
  },
  {
    id: "4",
    reference: "PAY-98380",
    date: "17-09-2026 10:15",
    vendor: "Thermocool Direct",
    vendorEmail: "payouts@pzcussons.ng",
    requestedBy: "Ibrahim Yusuf",
    requesterRole: "Chief Accountant",
    amount: "₦1,080,000",
    payoutType: "Weekly Settlement",
    status: "Pending",
    accountDetails: {
      bankName: "First Bank of Nigeria",
      accountNumber: "3029184756",
      accountName: "PZ Cussons Nig Plc",
    },
  },
  {
    id: "5",
    reference: "PAY-98372",
    date: "16-09-2026 15:40",
    vendor: "Hisense Official",
    vendorEmail: "finance@hisense.ng",
    requestedBy: "Linda Chen",
    requesterRole: "Regional Treasury",
    amount: "₦2,450,000",
    payoutType: "Instant Wire",
    status: "Completed",
    accountDetails: {
      bankName: "Stanbic IBTC Bank",
      accountNumber: "0039485721",
      accountName: "Hisense Appliances Ltd",
    },
  },
  {
    id: "6",
    reference: "PAY-98330",
    date: "16-09-2026 09:20",
    vendor: "Maxi Appliances",
    vendorEmail: "store@maxiappliances.com",
    requestedBy: "Sunday Eze",
    requesterRole: "Operations Lead",
    amount: "₦780,000",
    payoutType: "Wallet Withdrawal",
    status: "Completed",
    accountDetails: {
      bankName: "United Bank for Africa",
      accountNumber: "2019485762",
      accountName: "Maxi Retail Hub",
    },
  },
  {
    id: "7",
    reference: "PAY-98315",
    date: "15-09-2026 17:10",
    vendor: "Skyrun Solar Systems",
    vendorEmail: "treasury@skyrunsolar.ng",
    requestedBy: "Emeka Anozie",
    requesterRole: "Store Owner",
    amount: "₦3,200,000",
    payoutType: "Weekly Settlement",
    status: "Completed",
    accountDetails: {
      bankName: "Zenith Bank",
      accountNumber: "1092837465",
      accountName: "Skyrun Solar Hub",
    },
  },
  {
    id: "8",
    reference: "PAY-98302",
    date: "15-09-2026 12:00",
    vendor: "Polystar Electronics",
    vendorEmail: "accounts@polystar.com",
    requestedBy: "Grace Nwachukwu",
    requesterRole: "Finance Officer",
    amount: "₦950,000",
    payoutType: "Bank Transfer",
    status: "Completed",
    accountDetails: {
      bankName: "Fidelity Bank",
      accountNumber: "5029384756",
      accountName: "Polystar Electronics",
    },
  },
  {
    id: "9",
    reference: "PAY-98290",
    date: "14-09-2026 14:55",
    vendor: "Restpoint Cooling Hub",
    vendorEmail: "info@restpointcooling.ng",
    requestedBy: "Kunle Ajayi",
    requesterRole: "Vendor Representative",
    amount: "₦620,000",
    payoutType: "Wallet Withdrawal",
    status: "Completed",
    accountDetails: {
      bankName: "Wema Bank",
      accountNumber: "0192837465",
      accountName: "Restpoint Hub",
    },
  },
  {
    id: "10",
    reference: "PAY-98275",
    date: "14-09-2026 10:30",
    vendor: "Haier Thermocool Flagship",
    vendorEmail: "settlements@haierthermocool.ng",
    requestedBy: "Babatunde Lawal",
    requesterRole: "Account Manager",
    amount: "₦1,890,000",
    payoutType: "Weekly Settlement",
    status: "Completed",
    accountDetails: {
      bankName: "First Bank of Nigeria",
      accountNumber: "2039485761",
      accountName: "Haier Commercial Nig",
    },
  },
];

const toggleOptions = ["Pending", "Completed"];

export default function PayoutRequestsPage() {
  const [requests, setRequests] = useState<PayoutRequestRecord[]>(
    initialPayoutRequests,
  );
  const [activeToggle, setActiveToggle] = useState<"Pending" | "Completed">(
    "Pending",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<PayoutRequestRecord | null>(null);
  const [actionConfirmRequest, setActionConfirmRequest] = useState<{
    request: PayoutRequestRecord;
    action: "approve" | "reject";
  } | null>(null);

  // Filter requests based on Pending / Completed toggle and search query
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      // Toggle filter for Pending vs Completed
      if (activeToggle === "Pending" && req.status !== "Pending") {
        return false;
      }
      if (activeToggle === "Completed" && req.status !== "Completed") {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchVendor = req.vendor.toLowerCase().includes(q);
        const matchRequester = req.requestedBy.toLowerCase().includes(q);
        const matchType = req.payoutType.toLowerCase().includes(q);
        const matchAmount = req.amount.toLowerCase().includes(q);
        const matchRef = req.reference.toLowerCase().includes(q);
        return (
          matchVendor || matchRequester || matchType || matchAmount || matchRef
        );
      }

      return true;
    });
  }, [requests, activeToggle, searchQuery]);

  // Paginated records
  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredRequests.slice(start, start + rowsPerPage);
  }, [filteredRequests, currentPage, rowsPerPage]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRequests.length / rowsPerPage),
  );

  // Approve / Reject handler
  const handleConfirmAction = () => {
    if (!actionConfirmRequest) return;
    const { request, action } = actionConfirmRequest;
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === request.id) {
          return {
            ...r,
            status: action === "approve" ? "Completed" : "Rejected",
          };
        }
        return r;
      }),
    );
    setActionConfirmRequest(null);
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Top Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          {/* <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Payout Requests
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Authorize vendor settlement withdrawals, track disbursement queues, and verify bank details
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
            Export Payouts
          </Button>
        </div>
      </div>

      {/* 4 Cards: Total Order Value, Total Available Funds, Pending Payout Value, Completed Payout Value */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Order Value */}
        <StatCard
          size="sm"
          title="Total Order Value"
          value="₦48,850,000"
          trendValue="14.2%"
          trendIsUp={true}
          subtitle="Across all orders"
          badgeIcon={<HiOutlineCurrencyDollar className="w-4 h-4" />}
        />

        {/* 2. Total Available Funds */}
        <StatCard
          size="sm"
          title="Total Available Funds"
          value="₦28,450,000"
          trendValue="11.5%"
          trendIsUp={true}
          subtitle="Ready for disbursement"
          badgeIcon={<HiOutlineBanknotes className="w-4 h-4" />}
        />

        {/* 3. Pending Payout Value */}
        <StatCard
          size="sm"
          title="Pending Payout Value"
          value="₦6,320,000"
          trendValue="4 Pending"
          trendIsUp={false}
          subtitle="Awaiting admin approval"
          badgeIcon={<HiOutlineClock className="w-4 h-4 text-amber-500" />}
        />

        {/* 4. Completed Payout Value */}
        <StatCard
          size="sm"
          title="Completed Payout Value"
          value="₦22,130,000"
          trendValue="18.0%"
          trendIsUp={true}
          subtitle="Disbursed to date"
          badgeIcon={
            <HiOutlineCheckCircle className="w-4 h-4 text-emerald-500" />
          }
        />
      </div>

      {/* Main Table Card with Pending / Completed Toggle */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        {/* Controls Row */}
        <div className="p-4 sm:p-6 flex flex-col lg:flex-row gap-6 items-center justify-between border-b border-gray-50">
          {/* Toggle for pending and completed */}
          <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg w-full sm:w-auto">
            {toggleOptions.map((opt) => {
              const count = requests.filter((r) => r.status === opt).length;
              const isActive = activeToggle === opt;
              return (
                <button
                  key={opt}
                  onClick={() => {
                    setActiveToggle(opt as "Pending" | "Completed");
                    setCurrentPage(1);
                  }}
                  className={`flex-1 sm:flex-initial px-5 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${
                    isActive
                      ? "bg-white text-gray-900 shadow-xs"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <span>{opt}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] ${
                      isActive
                        ? opt === "Pending"
                          ? "bg-amber-50 text-amber-600 font-extrabold"
                          : "bg-emerald-50 text-emerald-600 font-extrabold"
                        : "bg-gray-200/60 text-gray-600"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <Input
              type="text"
              placeholder="Search vendor, requester, amount..."
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

        {/* Table Area with exact 6 headers: Date, Vendor, Requested By, Amount, Payout Type, Action */}
        <div className="admin-table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Vendor</th>
                <th>Requested By</th>
                <th>Amount</th>
                <th>Payout Type</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRequests.length > 0 ? (
                paginatedRequests.map((req) => (
                  <tr
                    key={req.id}
                    onClick={() => setSelectedRequest(req)}
                    className="hover:bg-gray-50/60 transition-colors"
                  >
                    {/* Date */}
                    <td className="text-xs text-gray-500 whitespace-nowrap">
                      {req.date}
                    </td>

                    {/* Vendor */}
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-md bg-blue-50 text-brand-blue flex items-center justify-center shrink-0">
                          <HiOutlineBuildingStorefront size={14} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-xs text-gray-900 whitespace-nowrap">
                            {req.vendor}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {req.accountDetails.bankName} ••••{" "}
                            {req.accountDetails.accountNumber.slice(-4)}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Requested By */}
                    <td>
                      <div className="flex flex-col">
                        <span className="font-bold text-xs text-gray-900 whitespace-nowrap">
                          {req.requestedBy}
                        </span>
                        <span className="text-[11px] text-gray-400">
                          {req.requesterRole}
                        </span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="font-black text-xs text-gray-900 whitespace-nowrap">
                      {req.amount}
                    </td>

                    {/* Payout Type */}
                    <td className="text-xs whitespace-nowrap">
                      <span className="font-medium text-gray-700 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-200">
                        {req.payoutType}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="text-right whitespace-nowrap">
                      <div
                        className="flex items-center justify-end gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {req.status === "Pending" ? (
                          <>
                            <button
                              onClick={() =>
                                setActionConfirmRequest({
                                  request: req,
                                  action: "approve",
                                })
                              }
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#00BCD4] hover:bg-[#00BCD4]/90 text-white rounded-md text-xs font-bold shadow-xs transition-colors"
                              title="Approve and disburse payout"
                            >
                              <HiOutlineCheck size={14} />
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                setActionConfirmRequest({
                                  request: req,
                                  action: "reject",
                                })
                              }
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-md text-xs font-semibold transition-colors"
                              title="Reject payout request"
                            >
                              <HiOutlineXMark size={14} />
                              Reject
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setSelectedRequest(req)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-md text-xs font-semibold border border-gray-200 transition-colors"
                          >
                            <HiOutlineEye size={14} />
                            Receipt
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-gray-400 text-xs"
                  >
                    No {activeToggle.toLowerCase()} payout requests found.
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
              {filteredRequests.length === 0
                ? 0
                : (currentPage - 1) * rowsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-bold text-gray-700">
              {Math.min(currentPage * rowsPerPage, filteredRequests.length)}
            </span>{" "}
            of{" "}
            <span className="font-bold text-gray-700">
              {filteredRequests.length}
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

      {/* Payout Details Modal */}
      {selectedRequest && (
        <Modal
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
        >
          <ModalBody>
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-lg bg-brand-blue-light text-brand-blue flex items-center justify-center">
                    <HiOutlineBanknotes className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">
                      Payout Request {selectedRequest.reference}
                    </h3>
                    <p className="text-xs text-gray-400">
                      Requested {selectedRequest.date}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                    selectedRequest.status === "Pending"
                      ? "bg-amber-50 text-amber-600 border border-amber-100"
                      : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                  }`}
                >
                  {selectedRequest.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="text-gray-400">Vendor Store</span>
                  <p className="font-bold text-gray-900 mt-0.5">
                    {selectedRequest.vendor}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    {selectedRequest.vendorEmail}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="text-gray-400">Requested By</span>
                  <p className="font-bold text-gray-900 mt-0.5">
                    {selectedRequest.requestedBy}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    {selectedRequest.requesterRole}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 col-span-2 space-y-1.5">
                  <span className="text-gray-400">
                    Beneficiary Bank Account
                  </span>
                  <div className="flex justify-between items-center text-xs pt-1">
                    <span className="font-bold text-gray-900">
                      {selectedRequest.accountDetails.accountName}
                    </span>
                    <span className="font-mono font-bold text-brand-blue">
                      {selectedRequest.accountDetails.accountNumber}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    {selectedRequest.accountDetails.bankName} • Verified Vendor
                    Payout Account
                  </p>
                </div>

                <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 col-span-2 flex justify-between items-center">
                  <div>
                    <span className="text-xs text-gray-500">
                      Requested Amount
                    </span>
                    <p className="text-[11px] text-gray-400">
                      Via {selectedRequest.payoutType}
                    </p>
                  </div>
                  <span className="text-lg font-black text-gray-900">
                    {selectedRequest.amount}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedRequest(null)}
                >
                  Close
                </Button>
                {selectedRequest.status === "Pending" && (
                  <Button
                    size="sm"
                    className="bg-[#00BCD4] text-white"
                    onClick={() => {
                      setActionConfirmRequest({
                        request: selectedRequest,
                        action: "approve",
                      });
                      setSelectedRequest(null);
                    }}
                  >
                    Approve Payout
                  </Button>
                )}
              </div>
            </div>
          </ModalBody>
        </Modal>
      )}

      {/* Confirmation Modal for Approve / Reject */}
      {actionConfirmRequest && (
        <Modal
          isOpen={!!actionConfirmRequest}
          onClose={() => setActionConfirmRequest(null)}
        >
          <ModalBody>
            <div className="space-y-4 pt-2 text-center">
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto ${
                  actionConfirmRequest.action === "approve"
                    ? "bg-cyan-50 text-[#00BCD4]"
                    : "bg-rose-50 text-rose-600"
                }`}
              >
                {actionConfirmRequest.action === "approve" ? (
                  <HiOutlineCheck size={24} />
                ) : (
                  <HiOutlineXMark size={24} />
                )}
              </div>

              <div>
                <h3 className="font-bold text-gray-900 text-base">
                  {actionConfirmRequest.action === "approve"
                    ? "Approve Payout Request?"
                    : "Reject Payout Request?"}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {actionConfirmRequest.action === "approve"
                    ? `Are you sure you want to authorize the disbursement of ${actionConfirmRequest.request.amount} to ${actionConfirmRequest.request.vendor}?`
                    : `Are you sure you want to decline the payout request for ${actionConfirmRequest.request.amount} from ${actionConfirmRequest.request.vendor}?`}
                </p>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActionConfirmRequest(null)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className={`${
                    actionConfirmRequest.action === "approve"
                      ? "bg-[#00BCD4] hover:bg-[#00BCD4]/90 text-white"
                      : "bg-rose-600 hover:bg-rose-700 text-white"
                  }`}
                  onClick={handleConfirmAction}
                >
                  {actionConfirmRequest.action === "approve"
                    ? "Confirm Approval"
                    : "Confirm Rejection"}
                </Button>
              </div>
            </div>
          </ModalBody>
        </Modal>
      )}

      {/* Export Payouts Modal */}
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
                Export Payout Requests Ledger
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Download complete disbursement audit trail including bank
                account numbers, approval timestamps, and payout statuses.
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
