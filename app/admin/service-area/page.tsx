"use client";

import React, { useState, useMemo } from "react";
import { Icon } from "@/app/components/Icon";
import { Button } from "@/app/components/Button";
import { Input } from "@/app/components/Form/Inputs";
import { Pagination } from "@/app/components/Admin/Pagination";
import { RowsPerPage } from "@/app/components/rows-per-page";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";
import Modal from "@/app/components/Modal/Modal";
import ModalBody from "@/app/components/Modal/ModalBody";
import ModalFooter from "@/app/components/Modal/ModalFooter";
import { HiOutlinePencilSquare } from "react-icons/hi2";

interface ServiceArea {
  id: string;
  name: string;
}

const initialServiceAreas: ServiceArea[] = [
  { id: "SA-01", name: "Lagos Island Zone" },
  { id: "SA-02", name: "Lagos Mainland Central" },
  { id: "SA-03", name: "Abuja Municipal Core" },
  { id: "SA-04", name: "Port Harcourt Metro" },
  { id: "SA-05", name: "Ibadan Metropolitan" },
  { id: "SA-06", name: "Kano Commercial Zone" },
  { id: "SA-07", name: "Enugu Urban Center" },
  { id: "SA-08", name: "Badagry Outskirts" },
  { id: "SA-09", name: "Calabar South & Municipal" },
  { id: "SA-10", name: "Benin City Central" },
  { id: "SA-11", name: "Abeokuta City Center" },
  { id: "SA-12", name: "Kaduna South & North" },
];

export default function AdminServiceAreaPage() {
  const [serviceAreas, setServiceAreas] =
    useState<ServiceArea[]>(initialServiceAreas);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [areaToEdit, setAreaToEdit] = useState<ServiceArea | null>(null);
  const [areaToDelete, setAreaToDelete] = useState<ServiceArea | null>(null);

  const filteredAreas = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return serviceAreas;
    return serviceAreas.filter((area) => area.name.toLowerCase().includes(q));
  }, [serviceAreas, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredAreas.length / rowsPerPage));
  const paginatedAreas = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredAreas.slice(start, start + rowsPerPage);
  }, [filteredAreas, currentPage, rowsPerPage]);

  const handleDeleteArea = () => {
    if (areaToDelete) {
      setServiceAreas((prev) => prev.filter((a) => a.id !== areaToDelete.id));
      setAreaToDelete(null);
    }
  };

  const handleSaveEditArea = (updated: ServiceArea) => {
    setServiceAreas((prev) =>
      prev.map((a) => (a.id === updated.id ? updated : a)),
    );
    setAreaToEdit(null);
  };

  return (
    <div className="flex flex-col gap-6 mx-auto pb-12">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          {/* <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Admin Service Area
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage delivery coverage zones and regional logistics service areas
          </p> */}
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
      <div className="bg-white rounded-lg border border-gray-100 shadow-2xs overflow-hidden flex flex-col">
        {/* Search and Table Controls */}
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-gray-100">
          <div className="w-full sm:w-80">
            <Input
              type="text"
              placeholder="Search service area name..."
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

        {/* Table Area with EXACT requested headers: Name and Action */}
        <div className="admin-table-container">
          <table>
            <thead>
              <tr>
                <th className="pl-6 text-left">Name</th>
                <th className="pr-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAreas.length === 0 ? (
                <tr>
                  <td
                    colSpan={2}
                    className="text-center py-12 text-gray-400 font-medium text-sm"
                  >
                    No service areas found matching your query.
                  </td>
                </tr>
              ) : (
                paginatedAreas.map((area) => (
                  <tr
                    key={area.id}
                    className="group hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="pl-6 py-4">
                      <span className="text-sm font-bold text-gray-900 block">
                        {area.name}
                      </span>
                    </td>
                    <td className="pr-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <Button
                          variant="outline"
                          shape="rounded-sm"
                          className="p-1.5! text-gray-400 hover:text-brand-blue hover:bg-brand-blue-light transition-all cursor-pointer"
                          onClick={() => setAreaToEdit(area)}
                          title="Edit area"
                        >
                          <HiOutlinePencilSquare className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          shape="rounded-sm"
                          className="p-1.5! text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all cursor-pointer"
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-gray-400 font-medium">
            Showing {paginatedAreas.length} of {filteredAreas.length} service
            areas
          </span>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!areaToDelete}
        onClose={() => setAreaToDelete(null)}
        onConfirm={handleDeleteArea}
        title="Delete Service Area"
        message={`Are you sure you want to delete service area "${areaToDelete?.name}"? Customers in this region will no longer receive automated delivery calculations.`}
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

      {/* Edit Service Area Modal */}
      {areaToEdit && (
        <EditServiceAreaModal
          isOpen={!!areaToEdit}
          area={areaToEdit}
          onClose={() => setAreaToEdit(null)}
          onSave={handleSaveEditArea}
        />
      )}
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
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({
      id: `SA-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
    });
    setName("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Service Area" size="md">
      <form onSubmit={handleSubmit}>
        <ModalBody className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Service Area Name
            </label>
            <Input
              placeholder="e.g. Lagos Island Zone"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="blue" type="submit">
            Add Service Area
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}

function EditServiceAreaModal({
  isOpen,
  area,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  area: ServiceArea;
  onClose: () => void;
  onSave: (area: ServiceArea) => void;
}) {
  const [name, setName] = useState(area.name);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      ...area,
      name: name.trim(),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Service Area"
      size="md"
    >
      <form onSubmit={handleSubmit}>
        <ModalBody className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Service Area Name
            </label>
            <Input
              placeholder="e.g. Lagos Island Zone"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="blue" type="submit">
            Save Changes
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
