"use client";

import React, { useState, useMemo } from "react";
import { Input } from "@/app/components/Form/Inputs";
import { Button } from "@/app/components/Button";
import { Icon } from "@/app/components/Icon";
import { Modal, ModalBody } from "@/app/components/Modal";
import { Pagination } from "@/app/components/Admin/Pagination";
import { RowsPerPage } from "@/app/components/rows-per-page";
import Link from "next/link";
import {
  HiOutlineCreditCard,
  HiOutlinePlus,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineCheck,
  HiOutlineXMark,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineCheckBadge,
  HiOutlineArrowPath,
  HiOutlineSparkles,
} from "react-icons/hi2";

export interface MarketingLoyaltyPlan {
  id: string;
  image: string;
  name: string;
  linkUrl: string;
  description: string;
  minimumPoints: number;
  earningsPerOrder: number;
  status: "Active" | "Inactive";
}

const initialPlans: MarketingLoyaltyPlan[] = [
  {
    id: "1",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
    name: "Gold Plan",
    linkUrl: "https://koolbuystore.com/client/loyalty#",
    description: "Gold Loyalty Card",
    minimumPoints: 400,
    earningsPerOrder: 5,
    status: "Active",
  },
  {
    id: "2",
    image:
      "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=150&auto=format&fit=crop&q=80",
    name: "Silver Plan",
    linkUrl: "https://koolbuystore.com/client/loyalty#",
    description: "Silver Loyalty Card",
    minimumPoints: 600,
    earningsPerOrder: 8,
    status: "Active",
  },
  {
    id: "3",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
    name: "Platinum Plan",
    linkUrl: "https://koolbuystore.com/client/loyalty#",
    description: "Platinum Loyalty Card",
    minimumPoints: 800,
    earningsPerOrder: 10,
    status: "Active",
  },
];

export default function MarketingLoyaltyCardsPage() {
  // Top loyalty module switches & settings
  const [loyaltyEnabled, setLoyaltyEnabled] = useState(true);
  const [redemptionValue, setRedemptionValue] = useState("0.05");
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Plans state
  const [plans, setPlans] = useState<MarketingLoyaltyPlan[]>(initialPlans);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [planToEdit, setPlanToEdit] = useState<MarketingLoyaltyPlan | null>(
    null,
  );
  const [planToDelete, setPlanToDelete] = useState<MarketingLoyaltyPlan | null>(
    null,
  );

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    minimumPoints: "",
    earningsPerOrder: "",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
    linkUrl: "https://koolbuystore.com/client/loyalty#",
    status: "Active" as MarketingLoyaltyPlan["status"],
  });

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveSettings = () => {
    setIsSavingSettings(true);
    setTimeout(() => {
      setIsSavingSettings(false);
      showToast("Loyalty program settings updated successfully!");
    }, 400);
  };

  const handleOpenAddModal = () => {
    setFormData({
      name: "",
      description: "",
      minimumPoints: "",
      earningsPerOrder: "",
      image:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
      linkUrl: "https://koolbuystore.com/client/loyalty#",
      status: "Active",
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (plan: MarketingLoyaltyPlan) => {
    setPlanToEdit(plan);
    setFormData({
      name: plan.name,
      description: plan.description,
      minimumPoints: plan.minimumPoints.toString(),
      earningsPerOrder: plan.earningsPerOrder.toString(),
      image: plan.image,
      linkUrl: plan.linkUrl,
      status: plan.status,
    });
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (planToEdit) {
      setPlans((prev) =>
        prev.map((p) =>
          p.id === planToEdit.id
            ? {
                ...p,
                name: formData.name,
                description: formData.description,
                minimumPoints: Number(formData.minimumPoints) || 0,
                earningsPerOrder: Number(formData.earningsPerOrder) || 0,
                image: formData.image,
                linkUrl: formData.linkUrl,
                status: formData.status,
              }
            : p,
        ),
      );
      showToast(`Updated plan: ${formData.name}`);
      setPlanToEdit(null);
    } else {
      const newPlan: MarketingLoyaltyPlan = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        minimumPoints: Number(formData.minimumPoints) || 0,
        earningsPerOrder: Number(formData.earningsPerOrder) || 0,
        image: formData.image,
        linkUrl: formData.linkUrl || "https://koolbuystore.com/client/loyalty#",
        status: formData.status,
      };
      setPlans((prev) => [...prev, newPlan]);
      showToast(`Created new plan: ${formData.name}`);
      setIsAddModalOpen(false);
    }
  };

  const handleDeletePlan = () => {
    if (!planToDelete) return;
    setPlans((prev) => prev.filter((p) => p.id !== planToDelete.id));
    showToast(`Deleted plan: ${planToDelete.name}`);
    setPlanToDelete(null);
  };

  const handleTogglePlanStatus = (id: string) => {
    setPlans((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextStatus = p.status === "Active" ? "Inactive" : "Active";
          showToast(`${p.name} is now ${nextStatus}`);
          return { ...p, status: nextStatus };
        }
        return p;
      }),
    );
  };

  // Filter & pagination
  const filteredPlans = useMemo(() => {
    return plans.filter((plan) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        plan.name.toLowerCase().includes(q) ||
        plan.description.toLowerCase().includes(q) ||
        plan.minimumPoints.toString().includes(q) ||
        plan.earningsPerOrder.toString().includes(q)
      );
    });
  }, [plans, searchQuery]);

  const paginatedPlans = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredPlans.slice(start, start + rowsPerPage);
  }, [filteredPlans, currentPage, rowsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredPlans.length / rowsPerPage));

  // Badge tier color helper
  const getTierAccent = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("gold"))
      return "text-amber-600 bg-amber-50 border-amber-200";
    if (n.includes("silver"))
      return "text-slate-600 bg-slate-50 border-slate-200";
    if (n.includes("platinum"))
      return "text-indigo-600 bg-indigo-50 border-indigo-200";
    return "text-cyan-600 bg-cyan-50 border-cyan-200";
  };

  return (
    <div className="flex flex-col gap-5 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-gray-900 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
          <HiOutlineCheckBadge className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Program Configuration Card (NO metric/stat cards as requested) */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5 flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            {/* <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-blue-light text-brand-blue flex items-center justify-center">
                <HiOutlineCreditCard className="w-4 h-4" />
              </div>
              <h1 className="text-xl font-black text-gray-900 tracking-tight">
                Loyalty Cards
              </h1>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Configure loyalty tiers, redemption valuation rate, and customer point earnings per order
            </p> */}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              href="/admin/accounting-loyalty"
              className="inline-flex items-center gap-1.5 h-9 px-3.5 text-xs font-bold rounded-lg border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <span>Accounting Audit</span>
            </Link>
            <Button
              className="h-9 px-4 text-xs font-bold bg-[#00BCD4] hover:bg-[#00BCD4]/90 text-white rounded-lg shadow-xs cursor-pointer"
              iconLeft={<HiOutlinePlus className="w-3.5 h-3.5" />}
              onClick={handleOpenAddModal}
            >
              Add Loyalty Card
            </Button>
          </div>
        </div>

        {/* Setting Controls Row: Enable & Redemption Value 1 ₦ = */}
        <div className="pt-4 border-t border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gray-50/50 p-4 rounded-lg">
          <div className="flex flex-wrap items-center gap-6">
            {/* Enable switch */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-700">Enable</span>
              <button
                type="button"
                onClick={() => {
                  setLoyaltyEnabled(!loyaltyEnabled);
                  showToast(
                    `Loyalty Cards program ${!loyaltyEnabled ? "Enabled" : "Disabled"}`,
                  );
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer focus:outline-none ${
                  loyaltyEnabled ? "bg-[#00BCD4]" : "bg-gray-300"
                }`}
                title={
                  loyaltyEnabled
                    ? "Disable Loyalty Cards"
                    : "Enable Loyalty Cards"
                }
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    loyaltyEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span className="text-[11px] font-semibold text-gray-400">
                {loyaltyEnabled ? "Active" : "Disabled"}
              </span>
            </div>

            <div className="h-5 w-px bg-gray-200 hidden md:block" />

            {/* Redemption Value: 1 ₦ = */}
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold text-gray-700 whitespace-nowrap">
                Redemption Value
              </span>
              <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-2.5 py-1 text-xs">
                <span className="font-mono font-bold text-gray-900">1 ₦ =</span>
                <input
                  type="text"
                  value={redemptionValue}
                  onChange={(e) => setRedemptionValue(e.target.value)}
                  className="w-16 font-mono font-bold text-xs text-brand-blue bg-transparent outline-none border-b border-transparent focus:border-[#00BCD4] text-center"
                  placeholder="0.05"
                />
                <span className="text-[11px] text-gray-400 font-semibold">
                  Points
                </span>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-2.5 text-[11px] font-bold border-gray-200 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer"
                onClick={handleSaveSettings}
                disabled={isSavingSettings}
              >
                {isSavingSettings ? (
                  <HiOutlineArrowPath className="w-3 h-3 animate-spin" />
                ) : (
                  "Save Rate"
                )}
              </Button>
            </div>
          </div>

          <div className="text-[11px] text-gray-400 flex items-center gap-1">
            <HiOutlineSparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Customers earn & redeem points during checkout</span>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        {/* Search & Filter Bar */}
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-gray-100">
          <div className="w-full sm:w-80">
            <Input
              type="text"
              placeholder="Search loyalty plan..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-gray-50 border-gray-100 text-xs font-medium rounded-lg h-9 placeholder:text-gray-400"
              suffixElement={
                <Icon
                  name="search-01"
                  folder="dashboardIcon"
                  size="sm"
                  className="text-gray-400"
                />
              }
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-xs text-gray-500">
              Total Plans:{" "}
              <strong className="text-gray-900">{plans.length}</strong>
            </span>
            <RowsPerPage
              value={rowsPerPage}
              onChange={(val) => {
                setRowsPerPage(val);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* Table with EXACT requested headers:
            # | Image | Name | Description | Minimum Points | Earnings Per Order | Status | Action */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-225">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4 w-20">Image</th>
                <th className="py-3.5 px-4">Name</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4">Minimum Points</th>
                <th className="py-3.5 px-4">Earnings Per Order</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
              {paginatedPlans.length > 0 ? (
                paginatedPlans.map((plan, index) => {
                  const rowNumber = (currentPage - 1) * rowsPerPage + index + 1;
                  const isActive = plan.status === "Active";

                  return (
                    <tr
                      key={plan.id}
                      className="hover:bg-gray-50/60 transition-colors"
                    >
                      {/* 1. # */}
                      <td className="py-3.5 px-4 text-center font-mono text-xs text-gray-400">
                        {rowNumber}
                      </td>

                      {/* 2. Image */}
                      <td className="py-3.5 px-4">
                        <div className="w-12 h-10 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 shrink-0 shadow-2xs flex items-center justify-center">
                          <img
                            src={plan.image}
                            alt={plan.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>

                      {/* 3. Name (rendered with clickable plan link) */}
                      <td className="py-3.5 px-4 font-bold text-gray-900">
                        <a
                          href={plan.linkUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-brand-blue hover:text-[#00BCD4] hover:underline font-bold text-xs group"
                        >
                          <span>{plan.name}</span>
                          <HiOutlineArrowTopRightOnSquare className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                        </a>
                      </td>

                      {/* 4. Description */}
                      <td className="py-3.5 px-4 text-gray-700 font-medium max-w-xs whitespace-nowrap">
                        {plan.description}
                      </td>

                      {/* 5. Minimum Points */}
                      <td className="py-3.5 px-4 font-black text-gray-900 font-mono text-xs whitespace-nowrap">
                        {plan.minimumPoints}
                      </td>

                      {/* 6. Earnings Per Order */}
                      <td className="py-3.5 px-4 font-black text-gray-900 font-mono text-xs whitespace-nowrap">
                        {plan.earningsPerOrder}
                      </td>

                      {/* 7. Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleTogglePlanStatus(plan.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold border transition-colors cursor-pointer ${
                            isActive
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
                          }`}
                          title={`Click to ${isActive ? "Deactivate" : "Activate"}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isActive ? "bg-emerald-500" : "bg-gray-400"
                            }`}
                          />
                          <span>{plan.status}</span>
                        </button>
                      </td>

                      {/* 8. Action */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(plan)}
                            className="p-1.5 text-gray-400 hover:text-[#00BCD4] hover:bg-brand-blue-light/50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Loyalty Plan"
                          >
                            <HiOutlinePencilSquare className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setPlanToDelete(plan)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Loyalty Plan"
                          >
                            <HiOutlineTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="py-12 text-center text-gray-400 text-xs"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                        <HiOutlineCreditCard className="w-5 h-5" />
                      </div>
                      <p className="font-bold text-gray-600">
                        No loyalty plans found
                      </p>
                      <p className="text-[11px] text-gray-400">
                        Try changing your search query or create a new loyalty
                        card tier.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 bg-gray-50/20">
          <p className="text-xs text-gray-400">
            Showing{" "}
            <span className="font-bold text-gray-700">
              {filteredPlans.length === 0
                ? 0
                : (currentPage - 1) * rowsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-bold text-gray-700">
              {Math.min(currentPage * rowsPerPage, filteredPlans.length)}
            </span>{" "}
            of{" "}
            <span className="font-bold text-gray-700">
              {filteredPlans.length}
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

      {/* Add / Edit Modal */}
      {(isAddModalOpen || planToEdit) && (
        <Modal
          isOpen={isAddModalOpen || !!planToEdit}
          onClose={() => {
            setIsAddModalOpen(false);
            setPlanToEdit(null);
          }}
        >
          <ModalBody>
            <form onSubmit={handleSavePlan} className="space-y-4 pt-1">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-brand-blue-light text-brand-blue flex items-center justify-center">
                    <HiOutlineCreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">
                      {planToEdit ? "Edit Loyalty Plan" : "Add Loyalty Plan"}
                    </h3>
                    <p className="text-[11px] text-gray-400">
                      Specify the tier name, description, points threshold, and
                      earnings
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setPlanToEdit(null);
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-md cursor-pointer"
                >
                  <HiOutlineXMark className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3.5 text-xs">
                {/* Plan Name */}
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Plan Name *
                  </label>
                  <Input
                    placeholder="e.g. Gold Plan, Silver Plan, Platinum Plan"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="bg-gray-50 border-gray-200 text-xs rounded-lg"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Description *
                  </label>
                  <Input
                    placeholder="e.g. Gold Loyalty Card"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="bg-gray-50 border-gray-200 text-xs rounded-lg"
                    required
                  />
                </div>

                {/* Minimum Points & Earnings Per Order */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      Minimum Points *
                    </label>
                    <Input
                      type="number"
                      placeholder="400"
                      value={formData.minimumPoints}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          minimumPoints: e.target.value,
                        })
                      }
                      className="bg-gray-50 border-gray-200 text-xs rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      Earnings Per Order *
                    </label>
                    <Input
                      type="number"
                      placeholder="5"
                      value={formData.earningsPerOrder}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          earningsPerOrder: e.target.value,
                        })
                      }
                      className="bg-gray-50 border-gray-200 text-xs rounded-lg"
                      required
                    />
                  </div>
                </div>

                {/* Target Link URL */}
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Plan Link URL
                  </label>
                  <Input
                    placeholder="https://koolbuystore.com/client/loyalty#"
                    value={formData.linkUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, linkUrl: e.target.value })
                    }
                    className="bg-gray-50 border-gray-200 text-xs rounded-lg"
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Card Image URL
                  </label>
                  <Input
                    placeholder="Image URL"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    className="bg-gray-50 border-gray-200 text-xs rounded-lg"
                  />
                </div>

                {/* Status Toggle */}
                <div className="flex items-center justify-between pt-1">
                  <span className="font-bold text-gray-700">Plan Status</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          status:
                            formData.status === "Active"
                              ? "Inactive"
                              : "Active",
                        })
                      }
                      className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors cursor-pointer ${
                        formData.status === "Active"
                          ? "bg-emerald-500"
                          : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          formData.status === "Active"
                            ? "translate-x-5"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                    <span className="text-xs font-semibold text-gray-600">
                      {formData.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-lg text-xs font-semibold"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setPlanToEdit(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-[#00BCD4] hover:bg-[#00BCD4]/90 text-white rounded-lg text-xs font-semibold"
                >
                  {planToEdit ? "Update Plan" : "Create Plan"}
                </Button>
              </div>
            </form>
          </ModalBody>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {planToDelete && (
        <Modal isOpen={!!planToDelete} onClose={() => setPlanToDelete(null)}>
          <ModalBody>
            <div className="space-y-4 pt-2 text-center">
              <div className="w-12 h-12 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <HiOutlineTrash className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">
                  Delete Loyalty Plan
                </h3>
                <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                  Are you sure you want to delete{" "}
                  <strong className="text-gray-800">{planToDelete.name}</strong>
                  ? Customers will no longer be able to accrue or view this
                  tier.
                </p>
              </div>
              <div className="flex justify-center gap-2.5 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg text-xs"
                  onClick={() => setPlanToDelete(null)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold"
                  onClick={handleDeletePlan}
                >
                  Confirm Delete
                </Button>
              </div>
            </div>
          </ModalBody>
        </Modal>
      )}
    </div>
  );
}
