"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/app/components/Button";
import { Input } from "@/app/components/Form/Inputs";
import { TabFilter } from "@/app/components/Admin/TabFilter";
import { Pagination } from "@/app/components/Admin/Pagination";
import { RowsPerPage } from "@/app/components/rows-per-page";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";
import {
  HiOutlinePlus,
  HiOutlineClock,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineCheckCircle,
  HiOutlineXMark,
  HiOutlineMagnifyingGlass,
  HiOutlineCurrencyDollar,
  HiOutlineTruck,
  HiOutlineCalendarDays,
} from "react-icons/hi2";

/* =========================================================================
   TYPES
   ========================================================================= */

interface DeliverySlot {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  price: string;
  durationInMinute: number;
  cutOffTime: string;
  status: "Active" | "Inactive";
}

/* =========================================================================
   INITIAL DATA
   ========================================================================= */

const initialSlots: DeliverySlot[] = [
  {
    id: "slot-1",
    title: "Morning Standard Window",
    startTime: "08:00 AM",
    endTime: "12:00 PM",
    price: "Free",
    durationInMinute: 240,
    cutOffTime: "06:00 AM",
    status: "Active",
  },
  {
    id: "slot-2",
    title: "Afternoon Prime Slot",
    startTime: "12:00 PM",
    endTime: "04:00 PM",
    price: "₦1,500",
    durationInMinute: 240,
    cutOffTime: "10:00 AM",
    status: "Active",
  },
  {
    id: "slot-3",
    title: "Evening Express Cold-Chain",
    startTime: "04:00 PM",
    endTime: "08:00 PM",
    price: "₦2,500",
    durationInMinute: 240,
    cutOffTime: "02:00 PM",
    status: "Active",
  },
  {
    id: "slot-4",
    title: "Early Morning Priority",
    startTime: "06:00 AM",
    endTime: "09:00 AM",
    price: "₦3,000",
    durationInMinute: 180,
    cutOffTime: "09:00 PM (Prev Day)",
    status: "Active",
  },
  {
    id: "slot-5",
    title: "Midday Rapid 2-Hour Slot",
    startTime: "11:00 AM",
    endTime: "01:00 PM",
    price: "₦2,000",
    durationInMinute: 120,
    cutOffTime: "09:30 AM",
    status: "Active",
  },
  {
    id: "slot-6",
    title: "Night Owl Delivery",
    startTime: "08:00 PM",
    endTime: "11:00 PM",
    price: "₦3,500",
    durationInMinute: 180,
    cutOffTime: "06:00 PM",
    status: "Inactive",
  },
  {
    id: "slot-7",
    title: "Saturday Weekend Special",
    startTime: "09:00 AM",
    endTime: "02:00 PM",
    price: "₦1,200",
    durationInMinute: 300,
    cutOffTime: "06:00 PM (Friday)",
    status: "Active",
  },
  {
    id: "slot-8",
    title: "Sunday Express Dispatch",
    startTime: "10:00 AM",
    endTime: "03:00 PM",
    price: "₦2,800",
    durationInMinute: 300,
    cutOffTime: "08:00 PM (Saturday)",
    status: "Inactive",
  },
];

/* =========================================================================
   MAIN COMPONENT
   ========================================================================= */

export default function DeliverySlotsPage() {
  const [slots, setSlots] = useState<DeliverySlot[]>(initialSlots);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [slotToEdit, setSlotToEdit] = useState<DeliverySlot | null>(null);
  const [slotToDelete, setSlotToDelete] = useState<DeliverySlot | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    startTime: "09:00 AM",
    endTime: "01:00 PM",
    price: "Free",
    durationInMinute: 240,
    cutOffTime: "07:00 AM",
    status: "Active" as "Active" | "Inactive",
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setSlotToEdit(null);
    setFormData({
      title: "",
      startTime: "09:00 AM",
      endTime: "01:00 PM",
      price: "Free",
      durationInMinute: 240,
      cutOffTime: "07:00 AM",
      status: "Active",
    });
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (slot: DeliverySlot) => {
    setSlotToEdit(slot);
    setFormData({
      title: slot.title,
      startTime: slot.startTime,
      endTime: slot.endTime,
      price: slot.price,
      durationInMinute: slot.durationInMinute,
      cutOffTime: slot.cutOffTime,
      status: slot.status,
    });
    setIsAddModalOpen(true);
  };

  // Save Slot (Add or Edit)
  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (slotToEdit) {
      setSlots((prev) =>
        prev.map((s) => (s.id === slotToEdit.id ? { ...s, ...formData } : s)),
      );
      showToast(`Updated slot: ${formData.title}`);
    } else {
      const newSlot: DeliverySlot = {
        id: `slot-${Date.now()}`,
        ...formData,
      };
      setSlots((prev) => [newSlot, ...prev]);
      showToast(`Created slot: ${formData.title}`);
    }

    setIsAddModalOpen(false);
  };

  // Delete Slot
  const confirmDeleteSlot = () => {
    if (!slotToDelete) return;
    setSlots((prev) => prev.filter((s) => s.id !== slotToDelete.id));
    showToast(`Deleted slot: ${slotToDelete.title}`);
    setSlotToDelete(null);
  };

  // Toggle Status
  const toggleSlotStatus = (id: string) => {
    setSlots((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const nextStatus = s.status === "Active" ? "Inactive" : "Active";
          showToast(`Slot status changed to ${nextStatus}`);
          return { ...s, status: nextStatus };
        }
        return s;
      }),
    );
  };

  // Tabs count
  const tabs = [
    `All (${slots.length})`,
    `Active (${slots.filter((s) => s.status === "Active").length})`,
    `Inactive (${slots.filter((s) => s.status === "Inactive").length})`,
  ];

  // Filtering
  const filteredSlots = useMemo(() => {
    return slots.filter((slot) => {
      // Tab filter
      if (activeTab.startsWith("Active") && slot.status !== "Active") {
        return false;
      }
      if (activeTab.startsWith("Inactive") && slot.status !== "Inactive") {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = slot.title.toLowerCase().includes(q);
        const matchesTime =
          slot.startTime.toLowerCase().includes(q) ||
          slot.endTime.toLowerCase().includes(q) ||
          slot.cutOffTime.toLowerCase().includes(q);
        const matchesPrice = slot.price.toLowerCase().includes(q);
        return matchesTitle || matchesTime || matchesPrice;
      }

      return true;
    });
  }, [slots, activeTab, searchQuery]);

  // Pagination
  const paginatedSlots = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredSlots.slice(start, start + rowsPerPage);
  }, [filteredSlots, currentPage, rowsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredSlots.length / rowsPerPage));

  return (
    <div className="flex flex-col gap-6 mx-auto pb-16">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-[#1D3557] text-white text-xs px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <HiOutlineCheckCircle className="w-4 h-4 text-[#00BCD4]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5">
        <div>
          {/* <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Delivery Slots
            </h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-brand-blue-light text-brand-blue border border-[#00BCD4]/20">
              Fulfillment Windows
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Configure customer delivery time slots, booking cutoff constraints,
            and slot surcharges
          </p> */}
        </div>

        {/* Add Delivery Slot Button */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="primary"
            shape="rounded-sm"
            className="bg-[#00BCD4] hover:bg-[#00acc1] text-white flex items-center gap-1.5 text-xs font-semibold px-4 py-2 cursor-pointer shadow-xs"
            onClick={handleOpenAddModal}
          >
            <HiOutlinePlus className="w-4 h-4" />
            <span>Add Delivery Slot</span>
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Total Slots
            </span>
            <HiOutlineCalendarDays className="w-4 h-4 text-[#00BCD4]" />
          </div>
          <p className="text-xl font-black text-gray-900">{slots.length}</p>
          <span className="text-[10px] text-gray-500 font-semibold">
            Configured windows
          </span>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Active Slots
            </span>
            <HiOutlineClock className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-black text-gray-900">
            {slots.filter((s) => s.status === "Active").length}
          </p>
          <span className="text-[10px] text-emerald-600 font-semibold">
            Bookable at checkout
          </span>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Standard Free
            </span>
            <HiOutlineTruck className="w-4 h-4 text-brand-blue" />
          </div>
          <p className="text-xl font-black text-gray-900">
            {slots.filter((s) => s.price.toLowerCase() === "free").length}
          </p>
          <span className="text-[10px] text-brand-blue font-semibold">
            Zero-cost windows
          </span>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Premium Surcharged
            </span>
            <HiOutlineCurrencyDollar className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-black text-gray-900">
            {slots.filter((s) => s.price.toLowerCase() !== "free").length}
          </p>
          <span className="text-[10px] text-amber-600 font-semibold">
            Express cold-chain fees
          </span>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-2xs overflow-hidden flex flex-col">
        {/* Filter Controls Bar */}
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
                placeholder="Search slot title or time..."
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

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-225">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Start Time</th>
                <th className="py-3 px-4">End Time</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4 text-center">Duration In Minute</th>
                <th className="py-3 px-4">CutOff Time</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
              {paginatedSlots.map((slot, index) => {
                const rowNumber = (currentPage - 1) * rowsPerPage + index + 1;
                const isFree = slot.price.toLowerCase() === "free";

                return (
                  <tr
                    key={slot.id}
                    className="hover:bg-gray-50/60 transition-colors"
                  >
                    {/* 1. # */}
                    <td className="py-3.5 px-4 text-center font-mono text-xs text-gray-400">
                      {rowNumber}
                    </td>

                    {/* 2. Title */}
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#00BCD4] shrink-0" />
                        <span>{slot.title}</span>
                      </div>
                    </td>

                    {/* 3. Start Time */}
                    <td className="py-3.5 px-4 font-mono font-medium text-gray-700">
                      {slot.startTime}
                    </td>

                    {/* 4. End Time */}
                    <td className="py-3.5 px-4 font-mono font-medium text-gray-700">
                      {slot.endTime}
                    </td>

                    {/* 5. Price */}
                    <td className="py-3.5 px-4 font-bold">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] ${
                          isFree
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200 font-mono"
                        }`}
                      >
                        {slot.price}
                      </span>
                    </td>

                    {/* 6. Duration In Minute */}
                    <td className="py-3.5 px-4 text-center font-mono text-gray-700">
                      <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-semibold text-[11px]">
                        {slot.durationInMinute} mins
                      </span>
                    </td>

                    {/* 7. CutOff Time */}
                    <td className="py-3.5 px-4 font-medium text-gray-600">
                      <span className="flex items-center gap-1.5">
                        <HiOutlineClock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>{slot.cutOffTime}</span>
                      </span>
                    </td>

                    {/* 8. Status */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => toggleSlotStatus(slot.id)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                          slot.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                            : "bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200"
                        }`}
                        title="Click to toggle status"
                      >
                        {slot.status}
                      </button>
                    </td>

                    {/* 9. Action */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(slot)}
                          className="p-1.5 text-gray-400 hover:text-[#00BCD4] hover:bg-brand-blue-light/50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Delivery Slot"
                        >
                          <HiOutlinePencilSquare className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setSlotToDelete(slot)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Delivery Slot"
                        >
                          <HiOutlineTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {paginatedSlots.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="py-12 text-center text-gray-400 text-xs"
                  >
                    <HiOutlineClock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="font-bold text-gray-600">
                      No delivery slots found
                    </p>
                    <p className="text-gray-400 mt-0.5">
                      Try adjusting your search criteria or add a new delivery
                      slot
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
          MODAL: ADD / EDIT DELIVERY SLOT
          ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-lg border border-gray-100 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-blue-light border border-[#00BCD4]/20 text-[#00BCD4] flex items-center justify-center">
                  <HiOutlineClock className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-gray-900">
                  {slotToEdit ? "Edit Delivery Slot" : "Add Delivery Slot"}
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
              onSubmit={handleSaveSlot}
              className="p-5 overflow-y-auto flex flex-col gap-4"
            >
              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Afternoon Prime Window"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full text-xs font-semibold px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#00BCD4] text-gray-800"
                />
              </div>

              {/* Start Time & End Time */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Start Time *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 08:00 AM"
                    value={formData.startTime}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        startTime: e.target.value,
                      }))
                    }
                    className="w-full text-xs font-mono px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#00BCD4] text-gray-800"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    End Time *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 12:00 PM"
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        endTime: e.target.value,
                      }))
                    }
                    className="w-full text-xs font-mono px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#00BCD4] text-gray-800"
                  />
                </div>
              </div>

              {/* Price & Duration */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Price *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Free or ₦1,500"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                    className="w-full text-xs font-semibold px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#00BCD4] text-gray-800"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Duration In Minute *
                  </label>
                  <input
                    type="number"
                    min="15"
                    step="15"
                    required
                    value={formData.durationInMinute}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        durationInMinute: parseInt(e.target.value, 10) || 0,
                      }))
                    }
                    className="w-full text-xs font-mono px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#00BCD4] text-gray-800"
                  />
                </div>
              </div>

              {/* CutOff Time */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  CutOff Time *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 06:00 AM or 2 hours before window"
                  value={formData.cutOffTime}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      cutOffTime: e.target.value,
                    }))
                  }
                  className="w-full text-xs font-semibold px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#00BCD4] text-gray-800"
                />
              </div>

              {/* Status */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50/50">
                <span className="text-xs font-bold text-gray-700">Status</span>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: e.target.value as "Active" | "Inactive",
                    }))
                  }
                  className="text-xs font-semibold px-2.5 py-1 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-[#00BCD4] text-gray-800"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
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
                  {slotToEdit ? "Update Slot" : "Create Delivery Slot"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {slotToDelete && (
        <ConfirmationModal
          isOpen={true}
          onClose={() => setSlotToDelete(null)}
          onConfirm={confirmDeleteSlot}
          title="Delete Delivery Slot"
          message={`Are you sure you want to delete the slot "${slotToDelete.title}"? Customers will no longer be able to select this window.`}
          confirmText="Yes, Delete"
          cancelText="Cancel"
          type="danger"
        />
      )}
    </div>
  );
}
