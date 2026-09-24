"use client";

import React, { useState } from "react";
import { Button } from "@/app/components/Button";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";
import {
  HiOutlineReceiptPercent,
  HiOutlineTag,
  HiOutlinePlus,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineCheckCircle,
  HiOutlineXMark,
  HiOutlineInformationCircle,
  HiOutlineMagnifyingGlass,
  HiOutlineCheck,
} from "react-icons/hi2";

/* =========================================================================
   TYPES
   ========================================================================= */

interface TaxCategory {
  id: string;
  name: string;
  code: string;
  description: string;
  status: "Active" | "Inactive";
  itemCount: number;
}

interface TaxRate {
  id: string;
  name: string;
  categoryName: string;
  rate: number;
  type: "Percentage" | "Fixed";
  priority: number;
  status: "Active" | "Inactive";
}

/* =========================================================================
   INITIAL DATA
   ========================================================================= */

const initialCategories: TaxCategory[] = [
  {
    id: "tc-1",
    name: "Standard Solar Equipment",
    code: "TAX-SOLAR-STD",
    description: "Standard domestic solar chest and upright freezers",
    status: "Active",
    itemCount: 42,
  },
  {
    id: "tc-2",
    name: "Clean Energy Zero-Rated",
    code: "TAX-CLEAN-ZERO",
    description: "Off-grid certified panels, inverters & battery packs",
    status: "Active",
    itemCount: 18,
  },
  {
    id: "tc-3",
    name: "Commercial Refrigeration",
    code: "TAX-COMM-REF",
    description: "Heavy-duty commercial glass door freezers & cold rooms",
    status: "Active",
    itemCount: 26,
  },
  {
    id: "tc-4",
    name: "Accessories & Spare Parts",
    code: "TAX-PARTS",
    description: "Replacement compressors, thermostats & cabling",
    status: "Active",
    itemCount: 54,
  },
  {
    id: "tc-5",
    name: "Installation & Services",
    code: "TAX-SRV",
    description: "Professional solar cold chain installation and auditing",
    status: "Active",
    itemCount: 9,
  },
];

const initialRates: TaxRate[] = [
  {
    id: "tr-1",
    name: "Standard VAT (Nigeria)",
    categoryName: "Standard Solar Equipment",
    rate: 7.5,
    type: "Percentage",
    priority: 1,
    status: "Active",
  },
  {
    id: "tr-2",
    name: "Withholding Tax (WHT)",
    categoryName: "Installation & Services",
    rate: 5.0,
    type: "Percentage",
    priority: 2,
    status: "Active",
  },
  {
    id: "tr-3",
    name: "Clean Energy Exemption",
    categoryName: "Clean Energy Zero-Rated",
    rate: 0.0,
    type: "Percentage",
    priority: 1,
    status: "Active",
  },
  {
    id: "tr-4",
    name: "Commercial Cold Chain VAT",
    categoryName: "Commercial Refrigeration",
    rate: 7.5,
    type: "Percentage",
    priority: 1,
    status: "Active",
  },
  {
    id: "tr-5",
    name: "Interstate Transit Surcharge",
    categoryName: "Accessories & Spare Parts",
    rate: 2.5,
    type: "Percentage",
    priority: 3,
    status: "Active",
  },
];

export default function TaxPage() {
  // 1. Toggle: Price Inclusive of Tax
  const [priceInclusiveOfTax, setPriceInclusiveOfTax] = useState(true);

  // 2. State for Categories & Rates
  const [categories, setCategories] =
    useState<TaxCategory[]>(initialCategories);
  const [rates, setRates] = useState<TaxRate[]>(initialRates);

  // Search queries
  const [categorySearch, setCategorySearch] = useState("");
  const [rateSearch, setRateSearch] = useState("");

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals for Tax Category
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<TaxCategory | null>(
    null,
  );
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    code: "",
    description: "",
    status: "Active" as "Active" | "Inactive",
  });

  // Modals for Tax Rate
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [rateToEdit, setRateToEdit] = useState<TaxRate | null>(null);
  const [rateForm, setRateForm] = useState({
    name: "",
    categoryName: "Standard Solar Equipment",
    rate: "7.5",
    type: "Percentage" as "Percentage" | "Fixed",
    priority: "1",
    status: "Active" as "Active" | "Inactive",
  });

  // Delete modal state
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    type: "category" | "rate";
    id: string;
    name: string;
  } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleInclusive = (checked: boolean) => {
    setPriceInclusiveOfTax(checked);
    showToast(
      checked
        ? "Price Inclusive of Tax enabled — catalog prices now show tax included"
        : "Price Inclusive of Tax disabled — tax will be added separately at checkout",
    );
  };

  /* =========================================================================
     TAX CATEGORY ACTIONS
     ========================================================================= */

  const handleOpenAddCategory = () => {
    setCategoryToEdit(null);
    setCategoryForm({
      name: "",
      code: `TAX-${Date.now().toString().slice(-4)}`,
      description: "",
      status: "Active",
    });
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat: TaxCategory) => {
    setCategoryToEdit(cat);
    setCategoryForm({
      name: cat.name,
      code: cat.code,
      description: cat.description,
      status: cat.status,
    });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) return;

    if (categoryToEdit) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === categoryToEdit.id ? { ...c, ...categoryForm } : c,
        ),
      );
      showToast(`Updated tax category: ${categoryForm.name}`);
    } else {
      const newCat: TaxCategory = {
        id: `tc-${Date.now()}`,
        name: categoryForm.name,
        code: categoryForm.code || `TAX-${Date.now().toString().slice(-4)}`,
        description: categoryForm.description,
        status: categoryForm.status,
        itemCount: 0,
      };
      setCategories((prev) => [...prev, newCat]);
      showToast(`Created tax category: ${categoryForm.name}`);
    }
    setIsCategoryModalOpen(false);
  };

  const toggleCategoryStatus = (id: string) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "Active" ? "Inactive" : "Active" }
          : c,
      ),
    );
    showToast("Category status updated!");
  };

  /* =========================================================================
     TAX RATE ACTIONS
     ========================================================================= */

  const handleOpenAddRate = () => {
    setRateToEdit(null);
    setRateForm({
      name: "",
      categoryName: categories[0]?.name || "Standard Solar Equipment",
      rate: "7.5",
      type: "Percentage",
      priority: "1",
      status: "Active",
    });
    setIsRateModalOpen(true);
  };

  const handleOpenEditRate = (rate: TaxRate) => {
    setRateToEdit(rate);
    setRateForm({
      name: rate.name,
      categoryName: rate.categoryName,
      rate: rate.rate.toString(),
      type: rate.type,
      priority: rate.priority.toString(),
      status: rate.status,
    });
    setIsRateModalOpen(true);
  };

  const handleSaveRate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rateForm.name.trim()) return;

    const parsedRate = parseFloat(rateForm.rate) || 0;
    const parsedPriority = parseInt(rateForm.priority, 10) || 1;

    if (rateToEdit) {
      setRates((prev) =>
        prev.map((r) =>
          r.id === rateToEdit.id
            ? {
                ...r,
                name: rateForm.name,
                categoryName: rateForm.categoryName,
                rate: parsedRate,
                type: rateForm.type,
                priority: parsedPriority,
                status: rateForm.status,
              }
            : r,
        ),
      );
      showToast(`Updated tax rate: ${rateForm.name}`);
    } else {
      const newRate: TaxRate = {
        id: `tr-${Date.now()}`,
        name: rateForm.name,
        categoryName: rateForm.categoryName,
        rate: parsedRate,
        type: rateForm.type,
        priority: parsedPriority,
        status: rateForm.status,
      };
      setRates((prev) => [...prev, newRate]);
      showToast(`Created tax rate: ${rateForm.name}`);
    }
    setIsRateModalOpen(false);
  };

  const toggleRateStatus = (id: string) => {
    setRates((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: r.status === "Active" ? "Inactive" : "Active" }
          : r,
      ),
    );
    showToast("Tax rate status updated!");
  };

  /* =========================================================================
     DELETE CONFIRMATION
     ========================================================================= */

  const confirmDelete = () => {
    if (!deleteConfirmation) return;
    if (deleteConfirmation.type === "category") {
      setCategories((prev) =>
        prev.filter((c) => c.id !== deleteConfirmation.id),
      );
      showToast(`Deleted category: ${deleteConfirmation.name}`);
    } else {
      setRates((prev) => prev.filter((r) => r.id !== deleteConfirmation.id));
      showToast(`Deleted tax rate: ${deleteConfirmation.name}`);
    }
    setDeleteConfirmation(null);
  };

  // Filtered views
  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(categorySearch.toLowerCase()) ||
      c.code.toLowerCase().includes(categorySearch.toLowerCase()) ||
      c.description.toLowerCase().includes(categorySearch.toLowerCase()),
  );

  const filteredRates = rates.filter(
    (r) =>
      r.name.toLowerCase().includes(rateSearch.toLowerCase()) ||
      r.categoryName.toLowerCase().includes(rateSearch.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-6 mx-auto pb-16">
      {/* Toast Notification */}
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
              Tax Configuration
            </h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-brand-blue-light text-brand-blue border border-[#00BCD4]/20">
              Tax Policies
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Configure price tax inclusions, product tax categories, and
            applicable regional VAT/WHT rates
          </p> */}
        </div>
      </div>

      {/* =========================================================================
          PROMINENT TOGGLE: PRICE INCLUSIVE OF TAX
          ========================================================================= */}
      <div className="bg-white rounded-lg border border-gray-100 p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div
              className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 border ${
                priceInclusiveOfTax
                  ? "bg-brand-blue-light border-[#00BCD4]/20 text-[#00BCD4]"
                  : "bg-gray-100 border-gray-200 text-gray-400"
              }`}
            >
              <HiOutlineReceiptPercent className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-sm font-bold text-gray-900">
                  Price Inclusive of Tax
                </h3>
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${
                    priceInclusiveOfTax
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-gray-100 text-gray-600 border border-gray-200"
                  }`}
                >
                  {priceInclusiveOfTax ? (
                    <>
                      <HiOutlineCheck className="w-3 h-3 text-emerald-600" />
                      <span>Enabled (Tax included in item prices)</span>
                    </>
                  ) : (
                    <span>Disabled (Tax calculated at checkout)</span>
                  )}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                When enabled, product prices displayed across catalog, search,
                and product details already include tax amounts. When disabled,
                tax is calculated as a separate line item at checkout.
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <label className="relative inline-flex items-center cursor-pointer shrink-0 sm:self-center">
            <input
              type="checkbox"
              checked={priceInclusiveOfTax}
              onChange={(e) => handleToggleInclusive(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00BCD4]" />
          </label>
        </div>

        {/* Pricing Calculation Preview */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-gray-500 gap-2 bg-gray-50/50 p-2.5 rounded-lg">
          <div className="flex items-center gap-1.5">
            <HiOutlineInformationCircle className="w-4 h-4 text-brand-blue shrink-0" />
            <span>
              <strong>Customer Display Mode:</strong>{" "}
              {priceInclusiveOfTax
                ? "Items list gross retail prices (e.g. ₦100,000 includes ₦6,977 VAT breakdown on receipt)"
                : "Items list net base price (e.g. ₦100,000 + ₦7,500 VAT added on checkout summary)"}
            </span>
          </div>
          <span className="font-mono text-gray-400">
            Rule:{" "}
            {priceInclusiveOfTax ? "GROSS_TAX_INCLUDED" : "NET_TAX_EXCLUDED"}
          </span>
        </div>
      </div>

      {/* =========================================================================
          THE TWO CARDS: TAX CATEGORY AND TAX RATE
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* =====================================================================
            CARD 1: TAX CATEGORY
            ===================================================================== */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-2xs overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gray-50/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-blue-light border border-[#00BCD4]/20 text-[#00BCD4] flex items-center justify-center shrink-0">
                <HiOutlineTag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#1D3557] uppercase tracking-wider">
                  Tax Category
                </h2>
                <span className="text-[11px] text-gray-400 font-medium">
                  {categories.length} product classifications
                </span>
              </div>
            </div>

            <Button
              variant="primary"
              shape="rounded-sm"
              className="bg-[#00BCD4] hover:bg-[#00acc1] text-white flex items-center gap-1 text-xs font-semibold px-3 py-1.5 cursor-pointer shadow-xs"
              onClick={handleOpenAddCategory}
            >
              <HiOutlinePlus className="w-3.5 h-3.5" />
              <span>Add Category</span>
            </Button>
          </div>

          {/* Quick Search */}
          <div className="p-3 border-b border-gray-100 bg-white">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search tax category name or code..."
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-[#00BCD4] text-gray-800"
              />
              <HiOutlineMagnifyingGlass className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Categories List / Table */}
          <div className="divide-y divide-gray-100 max-h-140 overflow-y-auto">
            {filteredCategories.map((cat) => (
              <div
                key={cat.id}
                className="p-4 flex items-start justify-between gap-3 hover:bg-gray-50/60 transition-colors"
              >
                <div className="flex flex-col gap-1 min-w-0 pr-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-xs font-bold text-gray-900">
                      {cat.name}
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200">
                      {cat.code}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleCategoryStatus(cat.id)}
                      className={`text-[10px] font-bold px-2 py-0.2 rounded cursor-pointer transition-colors ${
                        cat.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                          : "bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200"
                      }`}
                      title="Click to toggle status"
                    >
                      {cat.status}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {cat.description}
                  </p>
                  <span className="text-[11px] text-gray-400 mt-0.5 font-medium">
                    Applied to {cat.itemCount} catalog items
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenEditCategory(cat)}
                    className="p-1.5 text-gray-400 hover:text-[#00BCD4] hover:bg-brand-blue-light/50 rounded-lg transition-colors cursor-pointer"
                    title="Edit Category"
                  >
                    <HiOutlinePencilSquare className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setDeleteConfirmation({
                        type: "category",
                        id: cat.id,
                        name: cat.name,
                      })
                    }
                    className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Category"
                  >
                    <HiOutlineTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {filteredCategories.length === 0 && (
              <div className="p-8 text-center text-gray-400 text-xs">
                No tax categories match your search.
              </div>
            )}
          </div>
        </div>

        {/* =====================================================================
            CARD 2: TAX RATE
            ===================================================================== */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-2xs overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gray-50/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-blue-light border border-[#00BCD4]/20 text-[#00BCD4] flex items-center justify-center shrink-0">
                <HiOutlineReceiptPercent className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#1D3557] uppercase tracking-wider">
                  Tax Rate
                </h2>
                <span className="text-[11px] text-gray-400 font-medium">
                  {rates.length} configured rates
                </span>
              </div>
            </div>

            <Button
              variant="primary"
              shape="rounded-sm"
              className="bg-[#00BCD4] hover:bg-[#00acc1] text-white flex items-center gap-1 text-xs font-semibold px-3 py-1.5 cursor-pointer shadow-xs"
              onClick={handleOpenAddRate}
            >
              <HiOutlinePlus className="w-3.5 h-3.5" />
              <span>Add Tax Rate</span>
            </Button>
          </div>

          {/* Quick Search */}
          <div className="p-3 border-b border-gray-100 bg-white">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search tax rate or category..."
                value={rateSearch}
                onChange={(e) => setRateSearch(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-[#00BCD4] text-gray-800"
              />
              <HiOutlineMagnifyingGlass className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Tax Rates List / Table */}
          <div className="divide-y divide-gray-100 max-h-140 overflow-y-auto">
            {filteredRates.map((rate) => (
              <div
                key={rate.id}
                className="p-4 flex items-center justify-between gap-3 hover:bg-gray-50/60 transition-colors"
              >
                <div className="flex flex-col gap-1 min-w-0 pr-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-xs font-bold text-gray-900">
                      {rate.name}
                    </h4>
                    <span className="text-xs font-black text-brand-blue bg-brand-blue-light/60 px-2 py-0.5 rounded-md border border-[#00BCD4]/20 font-mono">
                      {rate.rate}%
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleRateStatus(rate.id)}
                      className={`text-[10px] font-bold px-2 py-0.2 rounded cursor-pointer transition-colors ${
                        rate.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                          : "bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200"
                      }`}
                      title="Click to toggle status"
                    >
                      {rate.status}
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                    <span className="truncate">Category:</span>
                    <span className="font-semibold text-gray-700 truncate">
                      {rate.categoryName}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-0.5">
                    <span>Type: {rate.type}</span>
                    <span>•</span>
                    <span>Priority: {rate.priority}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenEditRate(rate)}
                    className="p-1.5 text-gray-400 hover:text-[#00BCD4] hover:bg-brand-blue-light/50 rounded-lg transition-colors cursor-pointer"
                    title="Edit Tax Rate"
                  >
                    <HiOutlinePencilSquare className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setDeleteConfirmation({
                        type: "rate",
                        id: rate.id,
                        name: rate.name,
                      })
                    }
                    className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Tax Rate"
                  >
                    <HiOutlineTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {filteredRates.length === 0 && (
              <div className="p-8 text-center text-gray-400 text-xs">
                No tax rates match your search.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODAL: ADD / EDIT TAX CATEGORY
          ========================================================================= */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-lg border border-gray-100 shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-sm font-bold text-gray-900">
                {categoryToEdit ? "Edit Tax Category" : "Add Tax Category"}
              </h3>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <HiOutlineXMark className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleSaveCategory}
              className="p-5 flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Commercial Cold Storage"
                  value={categoryForm.name}
                  onChange={(e) =>
                    setCategoryForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full text-xs font-semibold px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#00BCD4] text-gray-800"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Tax Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. TAX-COMM-COLD"
                  value={categoryForm.code}
                  onChange={(e) =>
                    setCategoryForm((prev) => ({
                      ...prev,
                      code: e.target.value,
                    }))
                  }
                  className="w-full text-xs font-mono px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#00BCD4] text-gray-800"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief description of products in this category..."
                  value={categoryForm.description}
                  onChange={(e) =>
                    setCategoryForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full text-xs p-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#00BCD4] text-gray-800 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50/50">
                <span className="text-xs font-bold text-gray-700">Status</span>
                <select
                  value={categoryForm.status}
                  onChange={(e) =>
                    setCategoryForm((prev) => ({
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

              <div className="pt-2 border-t border-gray-100 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  shape="rounded-sm"
                  className="text-xs font-semibold px-3 py-1.5 border-gray-200 cursor-pointer"
                  onClick={() => setIsCategoryModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  shape="rounded-sm"
                  className="bg-[#00BCD4] hover:bg-[#00acc1] text-white text-xs font-semibold px-4 py-1.5 cursor-pointer shadow-xs"
                >
                  {categoryToEdit ? "Update Category" : "Create Category"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD / EDIT TAX RATE
          ========================================================================= */}
      {isRateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-lg border border-gray-100 shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-sm font-bold text-gray-900">
                {rateToEdit ? "Edit Tax Rate" : "Add Tax Rate"}
              </h3>
              <button
                type="button"
                onClick={() => setIsRateModalOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <HiOutlineXMark className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRate} className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Rate Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Standard VAT (7.5%)"
                  value={rateForm.name}
                  onChange={(e) =>
                    setRateForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full text-xs font-semibold px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#00BCD4] text-gray-800"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Tax Category *
                </label>
                <select
                  value={rateForm.categoryName}
                  onChange={(e) =>
                    setRateForm((prev) => ({
                      ...prev,
                      categoryName: e.target.value,
                    }))
                  }
                  className="w-full text-xs font-semibold px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#00BCD4] text-gray-800"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Rate Value (%) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    required
                    placeholder="7.5"
                    value={rateForm.rate}
                    onChange={(e) =>
                      setRateForm((prev) => ({ ...prev, rate: e.target.value }))
                    }
                    className="w-full text-xs font-mono px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#00BCD4] text-gray-800"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Rate Type
                  </label>
                  <select
                    value={rateForm.type}
                    onChange={(e) =>
                      setRateForm((prev) => ({
                        ...prev,
                        type: e.target.value as "Percentage" | "Fixed",
                      }))
                    }
                    className="w-full text-xs font-semibold px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#00BCD4] text-gray-800"
                  >
                    <option value="Percentage">Percentage (%)</option>
                    <option value="Fixed">Fixed Amount</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Priority
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={rateForm.priority}
                    onChange={(e) =>
                      setRateForm((prev) => ({
                        ...prev,
                        priority: e.target.value,
                      }))
                    }
                    className="w-full text-xs font-mono px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#00BCD4] text-gray-800"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Status
                  </label>
                  <select
                    value={rateForm.status}
                    onChange={(e) =>
                      setRateForm((prev) => ({
                        ...prev,
                        status: e.target.value as "Active" | "Inactive",
                      }))
                    }
                    className="w-full text-xs font-semibold px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#00BCD4] text-gray-800"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  shape="rounded-sm"
                  className="text-xs font-semibold px-3 py-1.5 border-gray-200 cursor-pointer"
                  onClick={() => setIsRateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  shape="rounded-sm"
                  className="bg-[#00BCD4] hover:bg-[#00acc1] text-white text-xs font-semibold px-4 py-1.5 cursor-pointer shadow-xs"
                >
                  {rateToEdit ? "Update Tax Rate" : "Create Tax Rate"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {deleteConfirmation && (
        <ConfirmationModal
          isOpen={true}
          onClose={() => setDeleteConfirmation(null)}
          onConfirm={confirmDelete}
          title={`Delete ${
            deleteConfirmation.type === "category" ? "Tax Category" : "Tax Rate"
          }`}
          message={`Are you sure you want to delete "${deleteConfirmation.name}"? This action cannot be undone.`}
          confirmText="Yes, Delete"
          cancelText="Cancel"
          type="danger"
        />
      )}
    </div>
  );
}
