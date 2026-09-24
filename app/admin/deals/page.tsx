"use client";

import React, { useState, useMemo } from "react";
import { Input } from "@/app/components/Form/Inputs";
import { Button } from "@/app/components/Button";
import { Icon } from "@/app/components/Icon";
import { Modal, ModalBody } from "@/app/components/Modal";
import { Pagination } from "@/app/components/Admin/Pagination";
import { RowsPerPage } from "@/app/components/rows-per-page";
import {
  HiOutlineMegaphone,
  HiOutlinePlus,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineXMark,
  HiOutlineCheckBadge,
  HiOutlineSignal,
  HiOutlineClock,
  HiOutlineUsers,
  HiOutlineLink,
} from "react-icons/hi2";

export interface MarketingCampaign {
  id: string;
  title: string;
  type:
    | "Push Notification"
    | "SMS"
    | "Email"
    | "In-App Banner"
    | "Web Notification";
  urlOption: string;
  sendTo: string;
  scheduleTime: string;
  requestUserCount: number;
  requestTimeDifference: string;
  totalRequestCount: number;
  liveCount: number;
  status?: "Scheduled" | "In Progress" | "Completed" | "Draft";
}

const initialCampaigns: MarketingCampaign[] = [
  {
    id: "1",
    title: "Summer Solar Sale 2026 Announcement",
    type: "Push Notification",
    urlOption: "Deep Link (/promos/summer)",
    sendTo: "All Registered Users",
    scheduleTime: "22-09-2026 10:00",
    requestUserCount: 8500,
    requestTimeDifference: "15s",
    totalRequestCount: 15000,
    liveCount: 14892,
    status: "Completed",
  },
  {
    id: "2",
    title: "Scanfrost Commercial Freezer Discount Alert",
    type: "Email",
    urlOption: "Category (/categories/commercial)",
    sendTo: "Active Buyers (30d)",
    scheduleTime: "23-09-2026 14:30",
    requestUserCount: 3200,
    requestTimeDifference: "30s",
    totalRequestCount: 6500,
    liveCount: 6480,
    status: "In Progress",
  },
  {
    id: "3",
    title: "Flash Cool Weekend Voucher [FLASHCOOL15]",
    type: "SMS",
    urlOption: "Web URL (https://koolbuystore.com/promos)",
    sendTo: "Gold & Silver Members",
    scheduleTime: "24-09-2026 09:00",
    requestUserCount: 1200,
    requestTimeDifference: "Instant",
    totalRequestCount: 2500,
    liveCount: 2495,
    status: "Scheduled",
  },
  {
    id: "4",
    title: "Zero Deposit BNPL Plan Expansion",
    type: "In-App Banner",
    urlOption: "Deep Link (/bnpl-plans)",
    sendTo: "Verified Customers",
    scheduleTime: "25-09-2026 16:00",
    requestUserCount: 5000,
    requestTimeDifference: "45s",
    totalRequestCount: 10000,
    liveCount: 9910,
    status: "Scheduled",
  },
  {
    id: "5",
    title: "Re-engagement: We Miss You! 10% Off",
    type: "Push Notification",
    urlOption: "Deep Link (/shop)",
    sendTo: "Inactive Users (>60 Days)",
    scheduleTime: "26-09-2026 11:15",
    requestUserCount: 4100,
    requestTimeDifference: "1m",
    totalRequestCount: 8000,
    liveCount: 7750,
    status: "Draft",
  },
];

export default function MarketingCampaignsPage() {
  const [campaigns, setCampaigns] =
    useState<MarketingCampaign[]>(initialCampaigns);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [campaignToEdit, setCampaignToEdit] =
    useState<MarketingCampaign | null>(null);
  const [campaignToDelete, setCampaignToDelete] =
    useState<MarketingCampaign | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    type: "Push Notification" as MarketingCampaign["type"],
    urlOption: "",
    sendTo: "",
    scheduleTime: "",
    requestUserCount: "",
    requestTimeDifference: "15s",
    totalRequestCount: "",
    liveCount: "0",
    status: "Scheduled" as MarketingCampaign["status"],
  });

  const handleOpenAddModal = () => {
    setFormData({
      title: "",
      type: "Push Notification",
      urlOption: "",
      sendTo: "All Registered Users",
      scheduleTime: new Date(Date.now() + 86400000)
        .toISOString()
        .slice(0, 16)
        .replace("T", " "),
      requestUserCount: "1000",
      requestTimeDifference: "15s",
      totalRequestCount: "5000",
      liveCount: "0",
      status: "Scheduled",
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (c: MarketingCampaign) => {
    setCampaignToEdit(c);
    setFormData({
      title: c.title,
      type: c.type,
      urlOption: c.urlOption,
      sendTo: c.sendTo,
      scheduleTime: c.scheduleTime,
      requestUserCount: c.requestUserCount.toString(),
      requestTimeDifference: c.requestTimeDifference,
      totalRequestCount: c.totalRequestCount.toString(),
      liveCount: c.liveCount.toString(),
      status: c.status || "Scheduled",
    });
  };

  const handleSaveCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (campaignToEdit) {
      setCampaigns((prev) =>
        prev.map((c) =>
          c.id === campaignToEdit.id
            ? {
                ...c,
                title: formData.title,
                type: formData.type,
                urlOption: formData.urlOption,
                sendTo: formData.sendTo,
                scheduleTime: formData.scheduleTime,
                requestUserCount: Number(formData.requestUserCount) || 0,
                requestTimeDifference: formData.requestTimeDifference,
                totalRequestCount: Number(formData.totalRequestCount) || 0,
                liveCount: Number(formData.liveCount) || 0,
                status: formData.status,
              }
            : c,
        ),
      );
      showToast(`Updated campaign: ${formData.title}`);
      setCampaignToEdit(null);
    } else {
      const newCampaign: MarketingCampaign = {
        id: Date.now().toString(),
        title: formData.title,
        type: formData.type,
        urlOption: formData.urlOption,
        sendTo: formData.sendTo,
        scheduleTime: formData.scheduleTime,
        requestUserCount: Number(formData.requestUserCount) || 0,
        requestTimeDifference: formData.requestTimeDifference,
        totalRequestCount: Number(formData.totalRequestCount) || 0,
        liveCount: Number(formData.liveCount) || 0,
        status: formData.status,
      };
      setCampaigns((prev) => [newCampaign, ...prev]);
      showToast(`Created campaign: ${formData.title}`);
      setIsAddModalOpen(false);
    }
  };

  const handleDeleteCampaign = () => {
    if (!campaignToDelete) return;
    setCampaigns((prev) => prev.filter((c) => c.id !== campaignToDelete.id));
    showToast(`Deleted campaign: ${campaignToDelete.title}`);
    setCampaignToDelete(null);
  };

  // Filter & Pagination
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) => {
      if (selectedType !== "All" && c.type !== selectedType) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.type.toLowerCase().includes(q) ||
        c.urlOption.toLowerCase().includes(q) ||
        c.sendTo.toLowerCase().includes(q)
      );
    });
  }, [campaigns, searchQuery, selectedType]);

  const paginatedCampaigns = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredCampaigns.slice(start, start + rowsPerPage);
  }, [filteredCampaigns, currentPage, rowsPerPage]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCampaigns.length / rowsPerPage),
  );

  // Type badge styling
  const getTypeBadge = (type: MarketingCampaign["type"]) => {
    switch (type) {
      case "Push Notification":
        return "bg-cyan-50 text-[#00BCD4] border-cyan-200";
      case "Email":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "SMS":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "In-App Banner":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200";
    }
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

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          {/* <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-blue-light text-brand-blue flex items-center justify-center">
              <HiOutlineMegaphone className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">
              Campaigns
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Manage and schedule customer communication campaigns, dispatch
            intervals, and audience reach
          </p> */}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            className="h-9 px-4 text-xs font-bold bg-[#00BCD4] hover:bg-[#00BCD4]/90 text-white rounded-lg shadow-xs cursor-pointer"
            iconLeft={<HiOutlinePlus className="w-3.5 h-3.5" />}
            onClick={handleOpenAddModal}
          >
            Create Campaign
          </Button>
        </div>
      </div>

      {/* Main Table Card (All extraneous cards and timers removed) */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        {/* Controls: Search and Filters */}
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <div className="w-full sm:w-80">
              <Input
                type="text"
                placeholder="Search by title, type, audience..."
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

            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Filter campaigns by channel type"
              className="h-9 px-3 text-xs font-bold bg-gray-50 border border-gray-200 rounded-lg text-gray-700 outline-none cursor-pointer"
            >
              <option value="All">All Types</option>
              <option value="Push Notification">Push Notification</option>
              <option value="Email">Email</option>
              <option value="SMS">SMS</option>
              <option value="In-App Banner">In-App Banner</option>
            </select>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-xs text-gray-500">
              Total Campaigns:{" "}
              <strong className="text-gray-900">{campaigns.length}</strong>
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
            # | Title | Type | URL Option | Send to | Schedule Time | Request User Count | Request Time Difference | Total Request Count | Live Count | Action */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-312.5">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4">Title</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">URL Option</th>
                <th className="py-3.5 px-4">Send to</th>
                <th className="py-3.5 px-4">Schedule Time</th>
                <th className="py-3.5 px-4 text-center">Request User Count</th>
                <th className="py-3.5 px-4 text-center">
                  Request Time Difference
                </th>
                <th className="py-3.5 px-4 text-center">Total Request Count</th>
                <th className="py-3.5 px-4 text-center">Live Count</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
              {paginatedCampaigns.length > 0 ? (
                paginatedCampaigns.map((c, index) => {
                  const rowNumber = (currentPage - 1) * rowsPerPage + index + 1;

                  return (
                    <tr
                      key={c.id}
                      className="hover:bg-gray-50/60 transition-colors"
                    >
                      {/* 1. # */}
                      <td className="py-3.5 px-4 text-center font-mono text-xs text-gray-400">
                        {rowNumber}
                      </td>

                      {/* 2. Title */}
                      <td className="py-3.5 px-4 font-bold text-gray-900 max-w-xs">
                        <div className="truncate font-semibold text-xs text-gray-900">
                          {c.title}
                        </div>
                      </td>

                      {/* 3. Type */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold border ${getTypeBadge(
                            c.type,
                          )}`}
                        >
                          {c.type}
                        </span>
                      </td>

                      {/* 4. URL Option */}
                      <td className="py-3.5 px-4 text-gray-600 font-mono text-[11px] max-w-xs truncate">
                        <div className="flex items-center gap-1.5">
                          <HiOutlineLink className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="truncate">{c.urlOption}</span>
                        </div>
                      </td>

                      {/* 5. Send to */}
                      <td className="py-3.5 px-4 font-medium text-gray-800 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <HiOutlineUsers className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>{c.sendTo}</span>
                        </div>
                      </td>

                      {/* 6. Schedule Time */}
                      <td className="py-3.5 px-4 font-medium text-gray-700 font-mono text-[11px] whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <HiOutlineClock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>{c.scheduleTime}</span>
                        </div>
                      </td>

                      {/* 7. Request User Count */}
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-xs text-gray-900 whitespace-nowrap">
                        {c.requestUserCount.toLocaleString()}
                      </td>

                      {/* 8. Request Time Difference */}
                      <td className="py-3.5 px-4 text-center font-mono font-semibold text-xs text-gray-600 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                          {c.requestTimeDifference}
                        </span>
                      </td>

                      {/* 9. Total Request Count */}
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-xs text-gray-900 whitespace-nowrap">
                        {c.totalRequestCount.toLocaleString()}
                      </td>

                      {/* 10. Live Count */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
                          <HiOutlineSignal className="w-3 h-3 text-emerald-500 animate-pulse" />
                          {c.liveCount.toLocaleString()}
                        </span>
                      </td>

                      {/* 11. Action */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(c)}
                            className="p-1.5 text-gray-400 hover:text-[#00BCD4] hover:bg-brand-blue-light/50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Campaign"
                          >
                            <HiOutlinePencilSquare className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setCampaignToDelete(c)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Campaign"
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
                    colSpan={11}
                    className="py-12 text-center text-gray-400 text-xs"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                        <HiOutlineMegaphone className="w-5 h-5" />
                      </div>
                      <p className="font-bold text-gray-600">
                        No campaigns found
                      </p>
                      <p className="text-[11px] text-gray-400">
                        Try changing your search query or schedule a new
                        campaign.
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
              {filteredCampaigns.length === 0
                ? 0
                : (currentPage - 1) * rowsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-bold text-gray-700">
              {Math.min(currentPage * rowsPerPage, filteredCampaigns.length)}
            </span>{" "}
            of{" "}
            <span className="font-bold text-gray-700">
              {filteredCampaigns.length}
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

      {/* Add / Edit Campaign Modal */}
      {(isAddModalOpen || campaignToEdit) && (
        <Modal
          isOpen={isAddModalOpen || !!campaignToEdit}
          onClose={() => {
            setIsAddModalOpen(false);
            setCampaignToEdit(null);
          }}
        >
          <ModalBody>
            <form onSubmit={handleSaveCampaign} className="space-y-4 pt-1">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-brand-blue-light text-brand-blue flex items-center justify-center">
                    <HiOutlineMegaphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">
                      {campaignToEdit ? "Edit Campaign" : "Create Campaign"}
                    </h3>
                    <p className="text-[11px] text-gray-400">
                      Configure campaign audience, URL destination, and dispatch
                      throttle
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setCampaignToEdit(null);
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-md cursor-pointer"
                >
                  <HiOutlineXMark className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                {/* Title */}
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Campaign Title *
                  </label>
                  <Input
                    placeholder="e.g. Summer Solar Sale 2026 Announcement"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="bg-gray-50 border-gray-200 text-xs rounded-lg"
                    required
                  />
                </div>

                {/* Type & Send To */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      Type *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          type: e.target.value as MarketingCampaign["type"],
                        })
                      }
                      className="w-full h-10 px-3 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-700 outline-none"
                    >
                      <option value="Push Notification">
                        Push Notification
                      </option>
                      <option value="Email">Email</option>
                      <option value="SMS">SMS</option>
                      <option value="In-App Banner">In-App Banner</option>
                      <option value="Web Notification">Web Notification</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      Send to *
                    </label>
                    <Input
                      placeholder="e.g. All Registered Users"
                      value={formData.sendTo}
                      onChange={(e) =>
                        setFormData({ ...formData, sendTo: e.target.value })
                      }
                      className="bg-gray-50 border-gray-200 text-xs rounded-lg"
                      required
                    />
                  </div>
                </div>

                {/* URL Option */}
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    URL Option *
                  </label>
                  <Input
                    placeholder="e.g. Deep Link (/promos/summer) or https://..."
                    value={formData.urlOption}
                    onChange={(e) =>
                      setFormData({ ...formData, urlOption: e.target.value })
                    }
                    className="bg-gray-50 border-gray-200 text-xs rounded-lg"
                    required
                  />
                </div>

                {/* Schedule Time & Request Time Difference */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      Schedule Time *
                    </label>
                    <Input
                      placeholder="YYYY-MM-DD HH:mm"
                      value={formData.scheduleTime}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          scheduleTime: e.target.value,
                        })
                      }
                      className="bg-gray-50 border-gray-200 text-xs rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      Request Time Difference *
                    </label>
                    <Input
                      placeholder="e.g. 15s, 30s, Instant"
                      value={formData.requestTimeDifference}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          requestTimeDifference: e.target.value,
                        })
                      }
                      className="bg-gray-50 border-gray-200 text-xs rounded-lg"
                      required
                    />
                  </div>
                </div>

                {/* User Counts */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      Request User Count *
                    </label>
                    <Input
                      type="number"
                      placeholder="5000"
                      value={formData.requestUserCount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          requestUserCount: e.target.value,
                        })
                      }
                      className="bg-gray-50 border-gray-200 text-xs rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      Total Request Count *
                    </label>
                    <Input
                      type="number"
                      placeholder="10000"
                      value={formData.totalRequestCount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          totalRequestCount: e.target.value,
                        })
                      }
                      className="bg-gray-50 border-gray-200 text-xs rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      Live Count
                    </label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={formData.liveCount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          liveCount: e.target.value,
                        })
                      }
                      className="bg-gray-50 border-gray-200 text-xs rounded-lg"
                    />
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
                    setCampaignToEdit(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-[#00BCD4] hover:bg-[#00BCD4]/90 text-white rounded-lg text-xs font-semibold"
                >
                  {campaignToEdit ? "Update Campaign" : "Schedule Campaign"}
                </Button>
              </div>
            </form>
          </ModalBody>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {campaignToDelete && (
        <Modal
          isOpen={!!campaignToDelete}
          onClose={() => setCampaignToDelete(null)}
        >
          <ModalBody>
            <div className="space-y-4 pt-2 text-center">
              <div className="w-12 h-12 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <HiOutlineTrash className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">
                  Delete Campaign
                </h3>
                <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                  Are you sure you want to delete{" "}
                  <strong className="text-gray-800">
                    {campaignToDelete.title}
                  </strong>
                  ? Any pending dispatches will be cancelled.
                </p>
              </div>
              <div className="flex justify-center gap-2.5 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg text-xs"
                  onClick={() => setCampaignToDelete(null)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold"
                  onClick={handleDeleteCampaign}
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
