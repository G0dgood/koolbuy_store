"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/app/components/Button";
import { Input } from "@/app/components/Form/Inputs";
import { TabFilter } from "@/app/components/Admin/TabFilter";
import { Pagination } from "@/app/components/Admin/Pagination";
import { RowsPerPage } from "@/app/components/rows-per-page";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";
import Link from "next/link";
import {
  HiOutlineTag,
  HiOutlineTicket,
  HiOutlinePlus,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineCheckCircle,
  HiOutlineXMark,
  HiOutlineMagnifyingGlass,
  HiOutlineClipboardDocument,
  HiOutlineArrowRight,
  HiOutlineClock,
  HiOutlineCurrencyDollar,
  HiOutlineReceiptPercent,
} from "react-icons/hi2";

/* =========================================================================
   TYPES
   ========================================================================= */

interface MarketingPromocode {
  id: string;
  image: string;
  promoCode: string;
  title: string;
  description: string;
  promoTypes:
    | "Percentage Discount"
    | "Fixed Amount"
    | "Free Shipping"
    | "Cashback Voucher";
  totalAmount: string;
  expiryDate: string;
  status: "Active" | "Inactive" | "Expired";
  usedCount: number;
}

/* =========================================================================
   INITIAL DATA: MARKETING PROMO CODES
   ========================================================================= */

const initialPromocodes: MarketingPromocode[] = [
  {
    id: "promo-1",
    image: "/images/koolboks/items/5.webp",
    promoCode: "KOOLSUMMER50",
    title: "Summer Solstice Cold Storage Discount",
    description:
      "Get flat ₦50,000 instant discount on all Scanfrost and Somotex 600L chest freezers.",
    promoTypes: "Fixed Amount",
    totalAmount: "₦50,000",
    expiryDate: "30-10-2026",
    status: "Active",
    usedCount: 248,
  },
  {
    id: "promo-2",
    image: "/images/koolboks/items/4.webp",
    promoCode: "CLEANENERGY10",
    title: "Clean Energy Solar Rebate Voucher",
    description:
      "10% discount on off-grid solar equipment, DC pedestals, and solar inverter units.",
    promoTypes: "Percentage Discount",
    totalAmount: "10%",
    expiryDate: "15-11-2026",
    status: "Active",
    usedCount: 412,
  },
  {
    id: "promo-3",
    image: "/images/koolboks/items/3.webp",
    promoCode: "COMMERCIAL100",
    title: "Commercial Cold-Room & Glass Door Promo",
    description:
      "Flat ₦100,000 discount voucher on commercial display refrigeration and cold rooms.",
    promoTypes: "Fixed Amount",
    totalAmount: "₦100,000",
    expiryDate: "31-12-2026",
    status: "Active",
    usedCount: 89,
  },
  {
    id: "promo-4",
    image: "/images/koolboks/items/1.webp",
    promoCode: "WELCOMEKOOL",
    title: "First Order Welcome Discount",
    description:
      "Enjoy ₦15,000 off on your first registered residential freezer purchase.",
    promoTypes: "Fixed Amount",
    totalAmount: "₦15,000",
    expiryDate: "31-12-2026",
    status: "Active",
    usedCount: 890,
  },
  {
    id: "promo-5",
    image: "/images/koolboks/items/2.webp",
    promoCode: "FREESHIPCOOL",
    title: "Nationwide Zero-Cost Freight Campaign",
    description:
      "Free delivery freight on all double-door chest freezers delivered in Lagos and Abuja.",
    promoTypes: "Free Shipping",
    totalAmount: "Free Delivery",
    expiryDate: "20-11-2026",
    status: "Active",
    usedCount: 164,
  },
  {
    id: "promo-6",
    image: "/images/koolboks/items/6.webp",
    promoCode: "FLASHCOOL15",
    title: "Weekend Flash Upright Freezer Promo",
    description:
      "15% off limited weekend flash discount on upright high-efficiency deep freezers.",
    promoTypes: "Percentage Discount",
    totalAmount: "15%",
    expiryDate: "25-10-2026",
    status: "Active",
    usedCount: 120,
  },
  {
    id: "promo-7",
    image: "/images/koolboks/items/4.webp",
    promoCode: "SOLARREBATE20",
    title: "Paygo Solar Upgrade Cashback",
    description:
      "Earn ₦20,000 cashback voucher credited directly towards PAYG solar installment plans.",
    promoTypes: "Cashback Voucher",
    totalAmount: "₦20,000",
    expiryDate: "05-12-2026",
    status: "Active",
    usedCount: 75,
  },
  {
    id: "promo-8",
    image: "/images/koolboks/items/1.webp",
    promoCode: "EXPIREDDEAL",
    title: "Independence Day Appliance Campaign",
    description:
      "Flat ₦25,000 discount voucher on all single door solar chest freezers.",
    promoTypes: "Fixed Amount",
    totalAmount: "₦25,000",
    expiryDate: "01-10-2026",
    status: "Expired",
    usedCount: 520,
  },
];

/* =========================================================================
   MAIN COMPONENT
   ========================================================================= */

export default function MarketingPromocodePage() {
  const [promocodes, setPromocodes] =
    useState<MarketingPromocode[]>(initialPromocodes);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [promoToEdit, setPromoToEdit] = useState<MarketingPromocode | null>(
    null,
  );
  const [promoToDelete, setPromoToDelete] = useState<MarketingPromocode | null>(
    null,
  );

  // Form State
  const [formData, setFormData] = useState({
    image: "/images/koolboks/items/5.webp",
    promoCode: "",
    title: "",
    description: "",
    promoTypes: "Percentage Discount" as MarketingPromocode["promoTypes"],
    totalAmount: "10%",
    expiryDate: "31-12-2026",
    status: "Active" as MarketingPromocode["status"],
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast(`Copied promo code "${code}" to clipboard!`);
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setPromoToEdit(null);
    setFormData({
      image: "/images/koolboks/items/1.webp",
      promoCode: "",
      title: "",
      description: "",
      promoTypes: "Percentage Discount",
      totalAmount: "10%",
      expiryDate: "31-12-2026",
      status: "Active",
    });
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (promo: MarketingPromocode) => {
    setPromoToEdit(promo);
    setFormData({
      image: promo.image,
      promoCode: promo.promoCode,
      title: promo.title,
      description: promo.description,
      promoTypes: promo.promoTypes,
      totalAmount: promo.totalAmount,
      expiryDate: promo.expiryDate,
      status: promo.status,
    });
    setIsAddModalOpen(true);
  };

  // Save Promo Code
  const handleSavePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.promoCode.trim() || !formData.title.trim()) return;

    if (promoToEdit) {
      setPromocodes((prev) =>
        prev.map((p) => (p.id === promoToEdit.id ? { ...p, ...formData } : p)),
      );
      showToast(`Updated promo code: ${formData.promoCode}`);
    } else {
      const newPromo: MarketingPromocode = {
        id: `promo-${Date.now()}`,
        ...formData,
        usedCount: 0,
      };
      setPromocodes((prev) => [newPromo, ...prev]);
      showToast(`Created new promo code: ${formData.promoCode}`);
    }
    setIsAddModalOpen(false);
  };

  // Delete Promo Code
  const confirmDeletePromo = () => {
    if (!promoToDelete) return;
    setPromocodes((prev) => prev.filter((p) => p.id !== promoToDelete.id));
    showToast(`Deleted promo code: ${promoToDelete.promoCode}`);
    setPromoToDelete(null);
  };

  // Tab Counts
  const tabs = [
    `All (${promocodes.length})`,
    `Percentage Discount (${promocodes.filter((p) => p.promoTypes === "Percentage Discount").length})`,
    `Fixed Amount (${promocodes.filter((p) => p.promoTypes === "Fixed Amount").length})`,
    `Free Shipping (${promocodes.filter((p) => p.promoTypes === "Free Shipping").length})`,
  ];

  // Filtering
  const filteredPromos = useMemo(() => {
    return promocodes.filter((promo) => {
      // Tab filter
      if (
        activeTab.startsWith("Percentage") &&
        promo.promoTypes !== "Percentage Discount"
      ) {
        return false;
      }
      if (
        activeTab.startsWith("Fixed") &&
        promo.promoTypes !== "Fixed Amount"
      ) {
        return false;
      }
      if (
        activeTab.startsWith("Free Shipping") &&
        promo.promoTypes !== "Free Shipping"
      ) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesCode = promo.promoCode.toLowerCase().includes(q);
        const matchesTitle = promo.title.toLowerCase().includes(q);
        const matchesDesc = promo.description.toLowerCase().includes(q);
        const matchesAmount = promo.totalAmount.toLowerCase().includes(q);
        return matchesCode || matchesTitle || matchesDesc || matchesAmount;
      }

      return true;
    });
  }, [promocodes, activeTab, searchQuery]);

  // Pagination
  const paginatedPromos = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredPromos.slice(start, start + rowsPerPage);
  }, [filteredPromos, currentPage, rowsPerPage]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPromos.length / rowsPerPage),
  );

  return (
    <div className="flex flex-col gap-6 pb-16 mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-[#1D3557] text-white text-xs px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <HiOutlineCheckCircle className="w-4 h-4 text-[#00BCD4]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5">
        <div>
          {/* <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Promocode
            </h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-brand-blue-light text-brand-blue border border-[#00BCD4]/20">
              Marketing Campaigns
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Create customer discount vouchers, marketing coupon campaigns, and
            seasonal offers
          </p> */}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link href="/admin/accounting-promos">
            <Button
              variant="outline"
              size="md"
              className="border-gray-200 text-gray-800 shadow-2xs hover:bg-gray-50 px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5"
            >
              <span>View Accounting Promo Usage</span>
              <HiOutlineArrowRight className="w-3.5 h-3.5 text-[#00BCD4]" />
            </Button>
          </Link>

          <Button
            variant="primary"
            shape="rounded-sm"
            className="bg-[#00BCD4] hover:bg-[#00acc1] text-white flex items-center gap-1.5 text-xs font-semibold px-4 py-2 cursor-pointer shadow-xs"
            onClick={handleOpenAddModal}
          >
            <HiOutlinePlus className="w-4 h-4" />
            <span>Add Promo Code</span>
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Total Campaigns
            </span>
            <HiOutlineTicket className="w-4 h-4 text-[#00BCD4]" />
          </div>
          <p className="text-xl font-black text-gray-900">
            {promocodes.length}
          </p>
          <span className="text-[10px] text-gray-400 font-semibold">
            {promocodes.filter((p) => p.status === "Active").length} active now
          </span>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Total Redemptions
            </span>
            <HiOutlineReceiptPercent className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-black text-gray-900">2,510</p>
          <span className="text-[10px] text-emerald-600 font-semibold">
            ● 18.4% uplift this month
          </span>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Customer Savings
            </span>
            <HiOutlineCurrencyDollar className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-xl font-black text-gray-900">₦18.4M</p>
          <span className="text-[10px] text-purple-600 font-semibold">
            Absorbed discount value
          </span>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Expiring Soon
            </span>
            <HiOutlineClock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-black text-gray-900">2</p>
          <span className="text-[10px] text-amber-600 font-semibold">
            Within next 14 days
          </span>
        </div>
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
          />

          <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
            <div className="relative w-full sm:w-72">
              <Input
                type="text"
                placeholder="Search promo code, title..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full text-xs pr-8 py-2 rounded-lg"
              />
              <HiOutlineMagnifyingGlass className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Table with EXACT requested headers:
            # | Image | Promo Code | Title | Description | Promo Types | Total Amount | Expiry Date | Action */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-262.5">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4 w-16">Image</th>
                <th className="py-3.5 px-4">Promo Code</th>
                <th className="py-3.5 px-4">Title</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4">Promo Types</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Expiry Date</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
              {paginatedPromos.map((promo, index) => {
                const rowNumber = (currentPage - 1) * rowsPerPage + index + 1;
                const isExpired = promo.status === "Expired";

                return (
                  <tr
                    key={promo.id}
                    className="hover:bg-gray-50/60 transition-colors"
                  >
                    {/* 1. # */}
                    <td className="py-3.5 px-4 text-center font-mono text-xs text-gray-400">
                      {rowNumber}
                    </td>

                    {/* 2. Image */}
                    <td className="py-3.5 px-4">
                      <div className="w-12 h-12 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 shrink-0 shadow-2xs flex items-center justify-center">
                        <img
                          src={promo.image}
                          alt={promo.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>

                    {/* 3. Promo Code */}
                    <td className="py-3.5 px-4 font-mono font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-md text-xs bg-brand-blue-light/70 text-brand-blue border border-[#00BCD4]/30 font-bold tracking-wider">
                          {promo.promoCode}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(promo.promoCode)}
                          className="p-1 text-gray-400 hover:text-brand-blue transition-colors cursor-pointer"
                          title="Copy promo code"
                        >
                          <HiOutlineClipboardDocument className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* 4. Title */}
                    <td className="py-3.5 px-4 font-bold text-gray-900 max-w-xs">
                      <div className="truncate font-semibold text-xs text-gray-900">
                        {promo.title}
                      </div>
                      <span className="text-[10px] text-gray-400 font-normal">
                        Used {promo.usedCount} times
                      </span>
                    </td>

                    {/* 5. Description */}
                    <td className="py-3.5 px-4 text-gray-500 max-w-sm">
                      <p className="line-clamp-2 text-xs leading-relaxed">
                        {promo.description}
                      </p>
                    </td>

                    {/* 6. Promo Types */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold ${
                          promo.promoTypes === "Percentage Discount"
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : promo.promoTypes === "Fixed Amount"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : promo.promoTypes === "Free Shipping"
                                ? "bg-cyan-50 text-cyan-700 border border-cyan-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {promo.promoTypes}
                      </span>
                    </td>

                    {/* 7. Total Amount */}
                    <td className="py-3.5 px-4 font-black text-gray-900 font-mono text-xs whitespace-nowrap">
                      {promo.totalAmount}
                    </td>

                    {/* 8. Expiry Date */}
                    <td className="py-3.5 px-4 font-medium text-xs whitespace-nowrap">
                      <div className="flex flex-col">
                        <span
                          className={`font-mono ${
                            isExpired
                              ? "text-rose-500 line-through"
                              : "text-gray-700"
                          }`}
                        >
                          {promo.expiryDate}
                        </span>
                        <span
                          className={`text-[10px] font-bold ${
                            isExpired ? "text-rose-600" : "text-emerald-600"
                          }`}
                        >
                          {isExpired ? "Expired" : "Active"}
                        </span>
                      </div>
                    </td>

                    {/* 9. Action */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(promo)}
                          className="p-1.5 text-gray-400 hover:text-[#00BCD4] hover:bg-brand-blue-light/50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Promo Code"
                        >
                          <HiOutlinePencilSquare className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setPromoToDelete(promo)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Promo Code"
                        >
                          <HiOutlineTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {paginatedPromos.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="py-12 text-center text-gray-400 text-xs"
                  >
                    <HiOutlineTicket className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="font-bold text-gray-600">
                      No promocodes found
                    </p>
                    <p className="text-gray-400 mt-0.5">
                      Try searching with different terms or create a new
                      campaign
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer: RowsPerPage & Pagination */}
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3">
          <RowsPerPage
            value={rowsPerPage}
            onChange={(val) => {
              setRowsPerPage(val);
              setCurrentPage(1);
            }}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* =========================================================================
          MODAL: ADD / EDIT PROMO CODE
          ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-lg border border-gray-100 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-blue-light border border-[#00BCD4]/20 text-[#00BCD4] flex items-center justify-center">
                  <HiOutlineTag className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-gray-900">
                  {promoToEdit ? "Edit Promo Code" : "Create Promo Code"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <HiOutlineXMark className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleSavePromo}
              className="p-5 overflow-y-auto flex flex-col gap-4"
            >
              {/* Promo Code & Total Amount */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Promo Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. KOOLSUMMER50"
                    value={formData.promoCode}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        promoCode: e.target.value.toUpperCase(),
                      }))
                    }
                    className="w-full text-xs font-mono font-bold px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#00BCD4] text-gray-800 tracking-wider"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Total Amount *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ₦50,000 or 15%"
                    value={formData.totalAmount}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        totalAmount: e.target.value,
                      }))
                    }
                    className="w-full text-xs font-semibold px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#00BCD4] text-gray-800"
                  />
                </div>
              </div>

              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Campaign Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Summer Solstice Cold Storage Discount"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full text-xs font-semibold px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#00BCD4] text-gray-800"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Discount terms, minimum order criteria, eligible models..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full text-xs p-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#00BCD4] text-gray-800 leading-relaxed"
                />
              </div>

              {/* Promo Types & Expiry Date */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Promo Type
                  </label>
                  <select
                    value={formData.promoTypes}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        promoTypes: e.target.value as any,
                      }))
                    }
                    className="w-full text-xs font-semibold px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#00BCD4] text-gray-800"
                  >
                    <option value="Percentage Discount">
                      Percentage Discount
                    </option>
                    <option value="Fixed Amount">Fixed Amount</option>
                    <option value="Free Shipping">Free Shipping</option>
                    <option value="Cashback Voucher">Cashback Voucher</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Expiry Date *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="DD-MM-YYYY"
                    value={formData.expiryDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        expiryDate: e.target.value,
                      }))
                    }
                    className="w-full text-xs font-mono px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#00BCD4] text-gray-800"
                  />
                </div>
              </div>

              {/* Image URL & Status */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Image Asset
                  </label>
                  <select
                    value={formData.image}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        image: e.target.value,
                      }))
                    }
                    className="w-full text-xs font-semibold px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#00BCD4] text-gray-800"
                  >
                    <option value="/images/koolboks/items/5.webp">
                      600L Inverter Freezer
                    </option>
                    <option value="/images/koolboks/items/4.webp">
                      Solar Pedestal Unit
                    </option>
                    <option value="/images/koolboks/items/3.webp">
                      Commercial Glass Display
                    </option>
                    <option value="/images/koolboks/items/1.webp">
                      Single Door Chest
                    </option>
                    <option value="/images/koolboks/items/2.webp">
                      Double Door Freezer
                    </option>
                    <option value="/images/koolboks/items/6.webp">
                      Upright Deep Freezer
                    </option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: e.target.value as any,
                      }))
                    }
                    className="w-full text-xs font-semibold px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#00BCD4] text-gray-800"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  shape="rounded-sm"
                  className="text-xs font-semibold px-3.5 py-1.5 border-gray-200 cursor-pointer"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  shape="rounded-sm"
                  className="bg-[#00BCD4] hover:bg-[#00acc1] text-white text-xs font-semibold px-4 py-1.5 cursor-pointer shadow-xs"
                >
                  {promoToEdit ? "Update Promo" : "Create Promo"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {promoToDelete && (
        <ConfirmationModal
          isOpen={true}
          onClose={() => setPromoToDelete(null)}
          onConfirm={confirmDeletePromo}
          title="Delete Promo Code"
          message={`Are you sure you want to delete the promo code "${promoToDelete.promoCode}"? Customers will no longer be able to redeem this voucher.`}
          confirmText="Yes, Delete"
          cancelText="Cancel"
          type="danger"
        />
      )}
    </div>
  );
}
