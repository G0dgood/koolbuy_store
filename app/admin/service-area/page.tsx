"use client";

import React, { useState, useMemo } from "react";
import { Icon } from "@/app/components/Icon";
import { Button } from "@/app/components/Button";
import { Input } from "@/app/components/Form/Inputs";
import { Select } from "@/app/components/Form/Select";
import { Pagination } from "@/app/components/Admin/Pagination";
import { RowsPerPage } from "@/app/components/rows-per-page";
import Checkbox from "@/app/components/Checkbox";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";
import Modal from "@/app/components/Modal/Modal";
import ModalBody from "@/app/components/Modal/ModalBody";
import ModalFooter from "@/app/components/Modal/ModalFooter";

interface ServiceArea {
  id: string;
  zoneName: string;
  state: string;
  coverage: string;
  deliveryFee: string;
  estimatedTransit: string;
  hub: string;
  status: "Active" | "Restricted" | "Inactive";
}

const initialServiceAreas: ServiceArea[] = [
  {
    id: "SA-01",
    zoneName: "Lagos Island Zone",
    state: "Lagos",
    coverage: "Lekki, Ikoyi, Victoria Island, Ajah",
    deliveryFee: "₦5,000",
    estimatedTransit: "24 Hours",
    hub: "Lagos Central Hub",
    status: "Active",
  },
  {
    id: "SA-02",
    zoneName: "Lagos Mainland Central",
    state: "Lagos",
    coverage: "Ikeja, Yaba, Surulere, Maryland",
    deliveryFee: "₦6,000",
    estimatedTransit: "24 - 48 Hours",
    hub: "Lagos Mainland Depot",
    status: "Active",
  },
  {
    id: "SA-03",
    zoneName: "Abuja Municipal Core",
    state: "FCT Abuja",
    coverage: "Maitama, Wuse 2, Garki, Asokoro",
    deliveryFee: "₦8,500",
    estimatedTransit: "1 - 2 Business Days",
    hub: "Abuja Regional Center",
    status: "Active",
  },
  {
    id: "SA-04",
    zoneName: "Port Harcourt Metro",
    state: "Rivers",
    coverage: "PH City, Obio-Akpor, GRA Phase 2",
    deliveryFee: "₦12,000",
    estimatedTransit: "2 - 3 Business Days",
    hub: "Niger Delta Hub",
    status: "Active",
  },
  {
    id: "SA-05",
    zoneName: "Ibadan Metropolitan",
    state: "Oyo",
    coverage: "Bodija, Oluyole, Ring Road, Dugbe",
    deliveryFee: "₦7,500",
    estimatedTransit: "1 - 2 Business Days",
    hub: "Southwest Distribution Hub",
    status: "Active",
  },
  {
    id: "SA-06",
    zoneName: "Kano Commercial Zone",
    state: "Kano",
    coverage: "Nassarawa, Fagge, Tarauni, Dala",
    deliveryFee: "₦15,000",
    estimatedTransit: "3 - 5 Business Days",
    hub: "Northern Regional Hub",
    status: "Active",
  },
  {
    id: "SA-07",
    zoneName: "Enugu Urban Center",
    state: "Enugu",
    coverage: "Independence Layout, New Haven, Achara",
    deliveryFee: "₦11,000",
    estimatedTransit: "2 - 4 Business Days",
    hub: "Southeast Hub",
    status: "Active",
  },
  {
    id: "SA-08",
    zoneName: "Badagry Outskirts",
    state: "Lagos",
    coverage: "Badagry, Ijanikin, Morogbo",
    deliveryFee: "₦10,000",
    estimatedTransit: "3 - 4 Business Days",
    hub: "Lagos West Transit Hub",
    status: "Restricted",
  },
  {
    id: "SA-09",
    zoneName: "Calabar South & Municipal",
    state: "Cross River",
    coverage: "Calabar City, Marina, State Housing",
    deliveryFee: "₦14,500",
    estimatedTransit: "3 - 5 Business Days",
    hub: "Cross River Center",
    status: "Inactive",
  },
  {
    id: "SA-10",
    zoneName: "Benin City Central",
    state: "Edo",
    coverage: "GRA, Uselu, Ikpoba Okha, Egor",
    deliveryFee: "₦9,500",
    estimatedTransit: "2 - 3 Business Days",
    hub: "Midwest Distribution Depot",
    status: "Active",
  },
];

const statusStyles: Record<string, string> = {
  Active: "text-emerald-700 bg-emerald-50 border-emerald-100",
  Restricted: "text-amber-700 bg-amber-50 border-amber-100",
  Inactive: "text-gray-500 bg-gray-100 border-gray-200",
};

export default function AdminServiceAreaPage() {
  const [serviceAreas, setServiceAreas] =
    useState<ServiceArea[]>(initialServiceAreas);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [areaToDelete, setAreaToDelete] = useState<ServiceArea | null>(null);

  const filteredAreas = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return serviceAreas;
    return serviceAreas.filter(
      (area) =>
        area.zoneName.toLowerCase().includes(q) ||
        area.state.toLowerCase().includes(q) ||
        area.coverage.toLowerCase().includes(q) ||
        area.hub.toLowerCase().includes(q),
    );
  }, [serviceAreas, searchQuery]);

  const paginatedAreas = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredAreas.slice(start, start + rowsPerPage);
  }, [filteredAreas, currentPage, rowsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredAreas.length / rowsPerPage));

  const handleSelectAll = () => {
    if (
      selectedIds.length === paginatedAreas.length &&
      paginatedAreas.length > 0
    ) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedAreas.map((a) => a.id));
    }
  };

  const handleToggleItem = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleDeleteArea = () => {
    if (areaToDelete) {
      setServiceAreas((prev) => prev.filter((a) => a.id !== areaToDelete.id));
      setSelectedIds((prev) => prev.filter((id) => id !== areaToDelete.id));
      setAreaToDelete(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-400 mx-auto pb-12 p-2 sm:p-4">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Admin Service Area
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage delivery coverage zones, regional shipping fees, and
            fulfillment hubs
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="blue"
            shape="rounded-sm"
            className="flex-1 sm:flex-initial"
            iconLeft={
              <Icon name="circle-plus" folder="dashboardIcon" size="sm" />
            }
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Service Area
          </Button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        {/* Search and Table Controls */}
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-gray-50">
          <div className="w-full sm:w-80">
            <Input
              type="text"
              placeholder="Search zone, state, LGA, or hub..."
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

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
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
        <div className="admin-table-container">
          <table>
            <thead>
              <tr>
                <th className="w-10">
                  <Checkbox
                    checked={
                      selectedIds.length === paginatedAreas.length &&
                      paginatedAreas.length > 0
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Zone Name</th>
                <th>State / Region</th>
                <th>Coverage / LGAs</th>
                <th>Delivery Fee</th>
                <th>Est. Transit</th>
                <th>Fulfillment Hub</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAreas.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="text-center py-12 text-gray-400 font-medium text-sm"
                  >
                    No service areas found matching your query.
                  </td>
                </tr>
              ) : (
                paginatedAreas.map((area) => {
                  const isChecked = selectedIds.includes(area.id);
                  return (
                    <tr
                      key={area.id}
                      className={`group hover:bg-gray-50/50 transition-colors ${
                        isChecked ? "bg-blue-50/20" : ""
                      }`}
                    >
                      <td>
                        <Checkbox
                          checked={isChecked}
                          onChange={() => handleToggleItem(area.id)}
                        />
                      </td>
                      <td>
                        <span className="text-xs font-bold text-gray-900 block">
                          {area.zoneName}
                        </span>
                        <span className="text-[10px] font-mono text-gray-400">
                          {area.id}
                        </span>
                      </td>
                      <td className="text-xs font-semibold text-gray-700 whitespace-nowrap">
                        {area.state}
                      </td>
                      <td
                        className="text-xs font-medium text-gray-500 max-w-xs truncate"
                        title={area.coverage}
                      >
                        {area.coverage}
                      </td>
                      <td className="text-xs font-bold text-brand-blue whitespace-nowrap">
                        {area.deliveryFee}
                      </td>
                      <td className="text-xs font-medium text-gray-600 whitespace-nowrap">
                        {area.estimatedTransit}
                      </td>
                      <td className="text-xs font-medium text-gray-700 whitespace-nowrap">
                        {area.hub}
                      </td>
                      <td>
                        <span
                          className={`px-2.5 py-1 rounded-[6px] text-[11px] font-bold border inline-block ${
                            statusStyles[area.status] ||
                            "text-gray-600 bg-gray-50 border-gray-100"
                          }`}
                        >
                          {area.status}
                        </span>
                      </td>
                      <td className="text-right">
                        <div className="flex justify-end items-center gap-2">
                          <Button
                            variant="outline"
                            shape="rounded-sm"
                            className="p-1.5! text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
                            onClick={() => setAreaToDelete(area)}
                            title="Delete area"
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
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!areaToDelete}
        onClose={() => setAreaToDelete(null)}
        onConfirm={handleDeleteArea}
        title="Delete Service Area"
        message={`Are you sure you want to delete service area "${areaToDelete?.zoneName}" (${areaToDelete?.state})? Customers in this region will no longer receive automated delivery calculations.`}
        confirmText="Yes, delete area"
        type="danger"
      />

      {/* Add Service Area Modal */}
      <AddServiceAreaModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={(newArea) => {
          setServiceAreas((prev) => [newArea, ...prev]);
          setIsAddModalOpen(false);
        }}
      />
    </div>
  );
}

function AddServiceAreaModal({
  isOpen,
  onClose,
  onAdd,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (area: ServiceArea) => void;
}) {
  const [formData, setFormData] = useState({
    zoneName: "",
    state: "",
    coverage: "",
    deliveryFee: "",
    estimatedTransit: "24 - 48 Hours",
    hub: "",
    status: "Active" as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      id: `SA-${Date.now().toString().slice(-4)}`,
      ...formData,
    });
    setFormData({
      zoneName: "",
      state: "",
      coverage: "",
      deliveryFee: "",
      estimatedTransit: "24 - 48 Hours",
      hub: "",
      status: "Active",
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Service Area" size="lg">
      <form onSubmit={handleSubmit}>
        <ModalBody className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Zone / Area Name
              </label>
              <Input
                placeholder="e.g. Lagos Island Core"
                value={formData.zoneName}
                onChange={(e) =>
                  setFormData({ ...formData, zoneName: e.target.value })
                }
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase">
                State / Region
              </label>
              <Input
                placeholder="e.g. Lagos"
                value={formData.state}
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-500 uppercase">
              Coverage Cities / LGAs
            </label>
            <Input
              placeholder="e.g. Lekki, Ikoyi, Victoria Island, Ajah"
              value={formData.coverage}
              onChange={(e) =>
                setFormData({ ...formData, coverage: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Standard Delivery Fee
              </label>
              <Input
                placeholder="e.g. ₦6,000"
                value={formData.deliveryFee}
                onChange={(e) =>
                  setFormData({ ...formData, deliveryFee: e.target.value })
                }
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Estimated Transit Time
              </label>
              <Input
                placeholder="e.g. 24 - 48 Hours"
                value={formData.estimatedTransit}
                onChange={(e) =>
                  setFormData({ ...formData, estimatedTransit: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Fulfillment Hub
              </label>
              <Input
                placeholder="e.g. Lagos Central Depot"
                value={formData.hub}
                onChange={(e) =>
                  setFormData({ ...formData, hub: e.target.value })
                }
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Status
              </label>
              <Select
                value={formData.status}
                onChange={(val) =>
                  setFormData({ ...formData, status: val as any })
                }
                options={[
                  { label: "Active", value: "Active" },
                  { label: "Restricted", value: "Restricted" },
                  { label: "Inactive", value: "Inactive" },
                ]}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="blue" type="submit">
            Save Service Area
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
