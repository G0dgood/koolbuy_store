"use client";

import React, { useState, useMemo } from "react";
import { Icon } from "../../components/Icon";
import { Button } from "../../components/Button";
import { Input } from "../../components/Form/Inputs";
import { Pagination } from "../../components/Admin/Pagination";
import { RowsPerPage } from "@/app/components/rows-per-page";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";
import Modal from "../../components/Modal/Modal";
import ModalBody from "../../components/Modal/ModalBody";
import ModalFooter from "../../components/Modal/ModalFooter";
import Drawer from "../../components/Drawer/Drawer";
import {
  HiOutlineEye,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlinePlus,
  HiOutlineGlobeAlt,
  HiOutlineDocumentCheck,
  HiOutlineClipboardDocumentList,
} from "react-icons/hi2";

interface BNPLFormItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  status: "Active" | "Draft";
  submissions: number;
  fieldsCount: number;
  fields: { label: string; type: string; required: boolean }[];
}

const initialBNPLForms: BNPLFormItem[] = [
  {
    id: "BNPL-01",
    title: "Individual Solar Freezer BNPL Application",
    slug: "individual-solar-freezer",
    description:
      "Standard personal financing application for domestic solar cooling units.",
    status: "Active",
    submissions: 342,
    fieldsCount: 14,
    fields: [
      { label: "Full Legal Name (as on BVN)", type: "text", required: true },
      {
        label: "Bank Verification Number (BVN)",
        type: "number",
        required: true,
      },
      {
        label: "National Identification Number (NIN)",
        type: "number",
        required: true,
      },
      { label: "Residential Address & State", type: "text", required: true },
      { label: "Phone Number", type: "tel", required: true },
      { label: "Monthly Income Bracket", type: "select", required: true },
      {
        label: "Proof of Identification (Upload)",
        type: "file",
        required: true,
      },
      { label: "Recent Utility Bill (Upload)", type: "file", required: true },
    ],
  },
  {
    id: "BNPL-02",
    title: "Commercial Vendor BNPL Financing Form",
    slug: "commercial-vendor-financing",
    description:
      "Enterprise and commercial merchant credit applications for walk-in and chest freezers.",
    status: "Active",
    submissions: 189,
    fieldsCount: 18,
    fields: [
      { label: "Registered Business Name (CAC)", type: "text", required: true },
      {
        label: "Tax Identification Number (TIN)",
        type: "text",
        required: true,
      },
      {
        label: "Storefront / Warehouse Location",
        type: "text",
        required: true,
      },
      {
        label: "Average Monthly Sales Turnover (₦)",
        type: "number",
        required: true,
      },
      {
        label: "Business Bank Statement (6 Months)",
        type: "file",
        required: true,
      },
      { label: "Director BVN & Government ID", type: "file", required: true },
    ],
  },
  {
    id: "BNPL-03",
    title: "Micro-Business Installment Verification",
    slug: "micro-business-installment",
    description:
      "Tailored micro-financing application for petty traders, kiosks, and food vendors.",
    status: "Active",
    submissions: 94,
    fieldsCount: 12,
    fields: [
      { label: "Trader Full Name", type: "text", required: true },
      { label: "Market / Shop Stall Number", type: "text", required: true },
      {
        label: "Market Association Leader Verification",
        type: "text",
        required: true,
      },
      { label: "Daily Savings / Bank Record", type: "file", required: true },
    ],
  },
  {
    id: "BNPL-04",
    title: "Agricultural Cold Chain Installment Plan",
    slug: "agric-cold-chain-bnpl",
    description:
      "Specialized flexible seasonal repayment form for farmers and perishables merchants.",
    status: "Active",
    submissions: 67,
    fieldsCount: 16,
    fields: [
      { label: "Farm / Cooperative Name", type: "text", required: true },
      { label: "Farm Location & LGA", type: "text", required: true },
      { label: "Primary Produce Refrigerated", type: "select", required: true },
      {
        label: "Seasonal Harvest Cashflow Cycle",
        type: "select",
        required: true,
      },
    ],
  },
  {
    id: "BNPL-05",
    title: "Healthcare & Vaccine Storage BNPL Form",
    slug: "healthcare-vaccine-bnpl",
    description:
      "Priority financing for clinics, pharmacies, and biological cooling preservation.",
    status: "Draft",
    submissions: 23,
    fieldsCount: 15,
    fields: [
      {
        label: "Medical Facility Name & Reg. No.",
        type: "text",
        required: true,
      },
      {
        label: "Supervising Pharmacist / Doctor Name",
        type: "text",
        required: true,
      },
      {
        label: "Facility Operating License (Upload)",
        type: "file",
        required: true,
      },
      {
        label: "Required Temperature Range (°C)",
        type: "select",
        required: true,
      },
    ],
  },
  {
    id: "BNPL-06",
    title: "Cooperative & Group Purchase BNPL Scheme",
    slug: "cooperative-group-scheme",
    description: "Joint liability group installment purchase application.",
    status: "Active",
    submissions: 112,
    fieldsCount: 20,
    fields: [
      { label: "Cooperative Society Name", type: "text", required: true },
      {
        label: "Cooperative Registration Certificate",
        type: "file",
        required: true,
      },
      {
        label: "Authorized Signatories BVN (3 Members)",
        type: "text",
        required: true,
      },
      {
        label: "Total Equipment Units Requested",
        type: "number",
        required: true,
      },
    ],
  },
  {
    id: "BNPL-07",
    title: "Solar Inverter Upgrade Financing Request",
    slug: "solar-inverter-upgrade",
    description:
      "Add-on financing form for existing clients adding lithium batteries or solar panels.",
    status: "Active",
    submissions: 48,
    fieldsCount: 11,
    fields: [
      {
        label: "Existing Koolbuy Customer Account ID",
        type: "text",
        required: true,
      },
      {
        label: "Current Freezer Model & Serial Number",
        type: "text",
        required: true,
      },
      {
        label: "Requested Solar Capacity (Watts / Ah)",
        type: "select",
        required: true,
      },
    ],
  },
  {
    id: "BNPL-08",
    title: "Student & Home Appliance BNPL Form",
    slug: "student-home-appliance",
    description:
      "Entry-level low deposit financing form for mini compact solar coolers.",
    status: "Draft",
    submissions: 15,
    fieldsCount: 10,
    fields: [
      { label: "Student / Resident Full Name", type: "text", required: true },
      { label: "Institution or Employer ID", type: "file", required: true },
      { label: "Guarantor Contact & Phone", type: "text", required: true },
    ],
  },
];

export default function BNPLFormsPage() {
  const [formsData, setFormsData] = useState<BNPLFormItem[]>(initialBNPLForms);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modal / Drawer states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formToEdit, setFormToEdit] = useState<BNPLFormItem | null>(null);
  const [formToDelete, setFormToDelete] = useState<BNPLFormItem | null>(null);
  const [formToView, setFormToView] = useState<BNPLFormItem | null>(null);

  const filteredForms = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return formsData;
    return formsData.filter(
      (f) =>
        f.title.toLowerCase().includes(q) ||
        f.slug.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q),
    );
  }, [formsData, searchQuery]);

  const totalPages = Math.ceil(filteredForms.length / rowsPerPage) || 1;
  const paginatedForms = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredForms.slice(start, start + rowsPerPage);
  }, [filteredForms, currentPage, rowsPerPage]);

  const handleDeleteForm = () => {
    if (!formToDelete) return;
    setFormsData((prev) => prev.filter((f) => f.id !== formToDelete.id));
    setFormToDelete(null);
  };

  const handleSaveEdit = (updated: BNPLFormItem) => {
    setFormsData((prev) =>
      prev.map((f) => (f.id === updated.id ? updated : f)),
    );
    setFormToEdit(null);
  };

  const handleAddForm = (newForm: BNPLFormItem) => {
    setFormsData((prev) => [newForm, ...prev]);
    setIsAddModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 mx-auto pb-16">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5">
        <div>
          {/* <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            BNPL Forms
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage Buy Now Pay Later digital application templates, slugs, and
            customer financing forms
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
            <span>Create BNPL Form</span>
          </Button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-2xs overflow-hidden flex flex-col">
        {/* Search Toolbar */}
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-gray-100">
          <div className="w-full sm:w-80">
            <Input
              type="text"
              placeholder="Search form title or slug..."
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

        {/* BNPL Forms Table with EXACT requested headers: # | Title | Slug | Action/View */}
        <div className="admin-table-container">
          <table>
            <thead>
              <tr>
                <th className="w-14 text-center">#</th>
                <th>Title</th>
                <th>Slug</th>
                <th className="text-right pr-6">Action/View</th>
              </tr>
            </thead>
            <tbody>
              {paginatedForms.length > 0 ? (
                paginatedForms.map((form, idx) => {
                  const rowNumber = (currentPage - 1) * rowsPerPage + idx + 1;
                  return (
                    <tr
                      key={form.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      {/* # */}
                      <td className="text-center font-bold text-gray-500 text-xs">
                        {rowNumber}
                      </td>

                      {/* Title */}
                      <td>
                        <div className="flex items-center gap-3 min-w-60">
                          <div className="w-9 h-9 rounded-lg bg-blue-50 text-brand-blue flex items-center justify-center shrink-0 border border-blue-100">
                            <HiOutlineDocumentCheck className="w-5 h-5" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-900 leading-tight">
                              {form.title}
                            </span>
                            <span className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">
                              {form.description}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Slug */}
                      <td>
                        <div className="flex items-center gap-1.5 font-mono text-xs text-gray-600 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-200 w-fit">
                          <HiOutlineGlobeAlt className="w-3.5 h-3.5 text-[#00BCD4]" />
                          <span>/{form.slug}</span>
                        </div>
                      </td>

                      {/* Action/View */}
                      <td className="text-right pr-6">
                        <div className="flex justify-end items-center gap-2">
                          <Button
                            variant="outline"
                            shape="rounded-sm"
                            className="px-2.5 py-1.5 text-xs font-semibold text-[#00BCD4] border-[#00BCD4]/30 hover:bg-[#00BCD4]/10 transition-all flex items-center gap-1 cursor-pointer"
                            onClick={() => setFormToView(form)}
                            title="View Form Preview"
                          >
                            <HiOutlineEye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </Button>

                          <Button
                            variant="outline"
                            shape="rounded-sm"
                            className="p-1.5! text-gray-400 hover:text-brand-blue hover:bg-brand-blue-light transition-all cursor-pointer"
                            onClick={() => setFormToEdit(form)}
                            title="Edit Form"
                          >
                            <HiOutlinePencilSquare className="w-4 h-4" />
                          </Button>

                          <Button
                            variant="outline"
                            shape="rounded-sm"
                            className="p-1.5! text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all cursor-pointer"
                            onClick={() => setFormToDelete(form)}
                            title="Delete Form"
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
                    colSpan={4}
                    className="text-center py-12 text-gray-400 font-medium text-sm"
                  >
                    No BNPL forms found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-gray-400 font-medium">
            Showing {paginatedForms.length} of {filteredForms.length} BNPL forms
          </span>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* View Form Details & Fields Drawer */}
      <Drawer
        isOpen={!!formToView}
        onClose={() => setFormToView(null)}
        title="BNPL Form Preview"
      >
        {formToView && (
          <div className="flex flex-col gap-6 h-full overflow-y-auto pr-1">
            <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase">
                  Form Identifier
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {formToView.status}
                </span>
              </div>
              <h3 className="text-base font-black text-[#1D3557]">
                {formToView.title}
              </h3>
              <div className="flex items-center gap-2 text-xs font-mono text-gray-600">
                <HiOutlineGlobeAlt className="w-4 h-4 text-[#00BCD4]" />
                <span>koolbuy.com/apply/{formToView.slug}</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mt-1">
                {formToView.description}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Configured Application Fields ({formToView.fields.length})
              </h4>
            </div>

            <div className="flex flex-col gap-2.5">
              {formToView.fields.map((f, i) => (
                <div
                  key={i}
                  className="p-3 bg-white border border-gray-200 rounded-lg shadow-2xs flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="text-xs font-bold text-gray-800">
                      {f.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-semibold">
                      {f.type}
                    </span>
                    {f.required && (
                      <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded">
                        Required
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Drawer>

      {/* Create BNPL Form Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create New BNPL Form"
        size="md"
      >
        <CreateOrEditFormModalContent
          onClose={() => setIsAddModalOpen(false)}
          onSave={(formData) =>
            handleAddForm({
              id: `BNPL-${Date.now().toString().slice(-4)}`,
              submissions: 0,
              fieldsCount: 8,
              fields: [
                { label: "Full Legal Name", type: "text", required: true },
                {
                  label: "Bank Verification Number (BVN)",
                  type: "number",
                  required: true,
                },
                { label: "Phone Number", type: "tel", required: true },
                { label: "Proof of ID", type: "file", required: true },
              ],
              ...formData,
            })
          }
        />
      </Modal>

      {/* Edit BNPL Form Modal */}
      {formToEdit && (
        <Modal
          isOpen={!!formToEdit}
          onClose={() => setFormToEdit(null)}
          title="Edit BNPL Form"
          size="md"
        >
          <CreateOrEditFormModalContent
            initialData={formToEdit}
            onClose={() => setFormToEdit(null)}
            onSave={(formData) =>
              handleSaveEdit({
                ...formToEdit,
                ...formData,
              })
            }
          />
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!formToDelete}
        onClose={() => setFormToDelete(null)}
        onConfirm={handleDeleteForm}
        title="Delete BNPL Form"
        message={`Are you sure you want to delete "${formToDelete?.title}"? Customer applications using this slug will no longer be accessible.`}
        confirmText="Yes, delete form"
        type="danger"
      />
    </div>
  );
}

function CreateOrEditFormModalContent({
  initialData,
  onClose,
  onSave,
}: {
  initialData?: BNPLFormItem;
  onClose: () => void;
  onSave: (data: {
    title: string;
    slug: string;
    description: string;
    status: "Active" | "Draft";
  }) => void;
}) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [status, setStatus] = useState<"Active" | "Draft">(
    initialData?.status || "Active",
  );

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!initialData) {
      setSlug(
        newTitle
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, ""),
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) return;
    onSave({
      title: title.trim(),
      slug: slug.trim(),
      description: description.trim(),
      status,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <ModalBody className="flex flex-col gap-4 py-4">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Form Title
          </label>
          <Input
            placeholder="e.g. Commercial Vendor BNPL Financing Form"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Form Slug
          </label>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-400 font-mono">/apply/</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. commercial-vendor-financing"
              className="w-full text-xs font-mono px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-[#00BCD4]"
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Description / Instructions
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief purpose of this financing form..."
            className="w-full text-xs p-2.5 border border-gray-200 rounded-md focus:outline-none focus:border-[#00BCD4] text-gray-700 leading-relaxed"
          />
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
            <option value="Active">Active (Accepting Submissions)</option>
            <option value="Draft">Draft (Disabled)</option>
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
          {initialData ? "Save Changes" : "Create Form"}
        </Button>
      </ModalFooter>
    </form>
  );
}
