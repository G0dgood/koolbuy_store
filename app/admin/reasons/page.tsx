"use client";

import React, { useState, useMemo } from "react";
import { Icon } from "../../components/Icon";
import { Button } from "../../components/Button";
import { Input } from "../../components/Form/Inputs";
import { TabFilter } from "../../components/Admin/TabFilter";
import { Pagination } from "../../components/Admin/Pagination";
import { RowsPerPage } from "@/app/components/rows-per-page";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";
import Modal from "../../components/Modal/Modal";
import ModalBody from "../../components/Modal/ModalBody";
import ModalFooter from "../../components/Modal/ModalFooter";
import {
  HiOutlinePlus,
  HiOutlinePencilSquare,
  HiOutlineCheck,
} from "react-icons/hi2";

export interface ReasonItem {
  id: string;
  title: string;
  type:
    | "Order Cancel"
    | "Refund"
    | "Return"
    | "Vendor Reject"
    | "Delivery Delay";
  status: "Active" | "Inactive";
}

const initialReasons: ReasonItem[] = [
  {
    id: "RSN-01",
    title: "Cooling equipment damaged during transit",
    type: "Refund",
    status: "Active",
  },
  {
    id: "RSN-02",
    title: "Customer unreachable upon delivery arrival",
    type: "Delivery Delay",
    status: "Active",
  },
  {
    id: "RSN-03",
    title: "Product out of stock at vendor facility",
    type: "Vendor Reject",
    status: "Active",
  },
  {
    id: "RSN-04",
    title: "Customer ordered wrong voltage / capacity",
    type: "Order Cancel",
    status: "Active",
  },
  {
    id: "RSN-05",
    title: "Defective solar compressor or electronic controller",
    type: "Return",
    status: "Active",
  },
  {
    id: "RSN-06",
    title: "Duplicate order placed by accident",
    type: "Order Cancel",
    status: "Active",
  },
  {
    id: "RSN-07",
    title: "Delivery transit exceeded scheduled time window",
    type: "Delivery Delay",
    status: "Active",
  },
  {
    id: "RSN-08",
    title: "Wrong item model dispatched by merchant",
    type: "Return",
    status: "Active",
  },
  {
    id: "RSN-09",
    title: "Customer changed mind before dispatch",
    type: "Order Cancel",
    status: "Active",
  },
  {
    id: "RSN-10",
    title: "Severe weather / impassable road condition",
    type: "Delivery Delay",
    status: "Inactive",
  },
  {
    id: "RSN-11",
    title: "Failed payment authorization reconciliation",
    type: "Refund",
    status: "Active",
  },
  {
    id: "RSN-12",
    title: "Vendor unable to service warranty location",
    type: "Vendor Reject",
    status: "Active",
  },
];

const typeStyles: Record<string, string> = {
  "Order Cancel": "bg-rose-50 text-rose-700 border-rose-100",
  Refund: "bg-amber-50 text-amber-700 border-amber-100",
  Return: "bg-purple-50 text-purple-700 border-purple-100",
  "Vendor Reject": "bg-orange-50 text-orange-700 border-orange-100",
  "Delivery Delay": "bg-blue-50 text-blue-700 border-blue-100",
};

export default function ReasonsManagementPage() {
  const [reasons, setReasons] = useState<ReasonItem[]>(initialReasons);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [reasonToEdit, setReasonToEdit] = useState<ReasonItem | null>(null);
  const [reasonToDelete, setReasonToDelete] = useState<ReasonItem | null>(null);

  const tabs = [
    "All",
    "Order Cancel",
    "Refund",
    "Return",
    "Vendor Reject",
    "Delivery Delay",
  ];

  const filteredReasons = useMemo(() => {
    return reasons.filter((item) => {
      const matchesTab = activeTab === "All" || item.type === activeTab;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q);
      return matchesTab && matchesSearch;
    });
  }, [reasons, activeTab, searchQuery]);

  const totalPages = Math.ceil(filteredReasons.length / rowsPerPage) || 1;
  const paginatedReasons = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredReasons.slice(start, start + rowsPerPage);
  }, [filteredReasons, currentPage, rowsPerPage]);

  const handleDelete = () => {
    if (!reasonToDelete) return;
    setReasons((prev) => prev.filter((r) => r.id !== reasonToDelete.id));
    setReasonToDelete(null);
  };

  const handleSaveEdit = (updated: ReasonItem) => {
    setReasons((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    setReasonToEdit(null);
  };

  const handleAddReason = (newReason: ReasonItem) => {
    setReasons((prev) => [newReason, ...prev]);
    setIsAddModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5">
        <div>
          {/* <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Reasons Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Configure automated cancellation, refund, return, and rejection
            reason codes for orders
          </p> */}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="primary"
            shape="rounded-sm"
            className="bg-[#00BCD4] hover:bg-[#00acc1] text-white flex items-center gap-1.5 text-xs font-semibold px-4 py-2 cursor-pointer shadow-sm"
            onClick={() => setIsAddModalOpen(true)}
          >
            <HiOutlinePlus className="w-4 h-4" />
            <span>Add Reason</span>
          </Button>
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
                placeholder="Search reason title..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-white border-gray-200 placeholder:text-gray-400 text-xs font-medium"
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
            <RowsPerPage value={rowsPerPage} onChange={setRowsPerPage} />
          </div>
        </div>

        {/* Reasons Table with EXACT requested headers: # | Title | Status | Type | Action */}
        <div className="admin-table-container">
          <table>
            <thead>
              <tr>
                <th className="w-14 text-center">#</th>
                <th>Title</th>
                <th>Status</th>
                <th>Type</th>
                <th className="text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedReasons.length > 0 ? (
                paginatedReasons.map((reason, idx) => {
                  const rowNumber = (currentPage - 1) * rowsPerPage + idx + 1;
                  return (
                    <tr
                      key={reason.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      {/* # */}
                      <td className="text-center font-bold text-gray-500 text-xs">
                        {rowNumber}
                      </td>

                      {/* Title */}
                      <td>
                        <span className="text-xs font-bold text-gray-900 block">
                          {reason.title}
                        </span>
                      </td>

                      {/* Status */}
                      <td>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                            reason.status === "Active"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-gray-100 text-gray-500 border-gray-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              reason.status === "Active"
                                ? "bg-emerald-500"
                                : "bg-gray-400"
                            }`}
                          ></span>
                          {reason.status}
                        </span>
                      </td>

                      {/* Type */}
                      <td>
                        <span
                          className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border ${
                            typeStyles[reason.type] ||
                            "bg-gray-50 text-gray-700 border-gray-200"
                          }`}
                        >
                          {reason.type}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="text-right pr-6">
                        <div className="flex justify-end items-center gap-2">
                          <Button
                            variant="outline"
                            shape="rounded-sm"
                            className="p-1.5! text-gray-400 hover:text-brand-blue hover:bg-brand-blue-light transition-all cursor-pointer"
                            onClick={() => setReasonToEdit(reason)}
                            title="Edit Reason"
                          >
                            <HiOutlinePencilSquare className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            shape="rounded-sm"
                            className="p-1.5! text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all cursor-pointer"
                            onClick={() => setReasonToDelete(reason)}
                            title="Delete Reason"
                          >
                            <Icon
                              name="Delete"
                              folder="dashboardIcon"
                              size="sm"
                            />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-12 text-gray-400 font-medium text-sm"
                  >
                    No reasons found matching your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-gray-400 font-medium">
            Showing {paginatedReasons.length} of {filteredReasons.length}{" "}
            reasons
          </span>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Add Reason Modal */}
      <AddOrEditReasonModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Reason"
        onSave={(data) =>
          handleAddReason({
            id: `RSN-${Date.now().toString().slice(-4)}`,
            ...data,
          })
        }
      />

      {/* Edit Reason Modal */}
      {reasonToEdit && (
        <AddOrEditReasonModal
          isOpen={!!reasonToEdit}
          initialData={reasonToEdit}
          onClose={() => setReasonToEdit(null)}
          title="Edit Reason"
          onSave={(data) =>
            handleSaveEdit({
              ...reasonToEdit,
              ...data,
            })
          }
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!reasonToDelete}
        onClose={() => setReasonToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Reason"
        message={`Are you sure you want to delete reason "${reasonToDelete?.title}"?`}
        confirmText="Yes, delete reason"
        type="danger"
      />
    </div>
  );
}

function AddOrEditReasonModal({
  isOpen,
  initialData,
  onClose,
  title,
  onSave,
}: {
  isOpen: boolean;
  initialData?: ReasonItem;
  onClose: () => void;
  title: string;
  onSave: (data: {
    title: string;
    type: ReasonItem["type"];
    status: ReasonItem["status"];
  }) => void;
}) {
  const [formTitle, setFormTitle] = useState(initialData?.title || "");
  const [type, setType] = useState<ReasonItem["type"]>(
    initialData?.type || "Order Cancel",
  );
  const [status, setStatus] = useState<ReasonItem["status"]>(
    initialData?.status || "Active",
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;
    onSave({
      title: formTitle.trim(),
      type,
      status,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <form onSubmit={handleSubmit}>
        <ModalBody className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Reason Title
            </label>
            <Input
              placeholder="e.g. Equipment damaged during transit"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Reason Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full text-xs font-semibold px-3 py-2 border border-gray-200 rounded-md bg-white focus:outline-none focus:border-[#00BCD4]"
            >
              <option value="Order Cancel">Order Cancel</option>
              <option value="Refund">Refund</option>
              <option value="Return">Return</option>
              <option value="Vendor Reject">Vendor Reject</option>
              <option value="Delivery Delay">Delivery Delay</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full text-xs font-semibold px-3 py-2 border border-gray-200 rounded-md bg-white focus:outline-none focus:border-[#00BCD4]"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            className="bg-[#00BCD4] hover:bg-[#00acc1] text-white"
          >
            Save Reason
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
