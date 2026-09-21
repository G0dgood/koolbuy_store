"use client";

import React, { useState } from "react";
import { Icon } from "@/app/components/Icon";
import { Button } from "@/app/components/Button";
import { Input } from "@/app/components/Form/Inputs";
import { Select } from "@/app/components/Form/Select";
import Modal from "@/app/components/Modal/Modal";
import ModalBody from "@/app/components/Modal/ModalBody";
import ModalFooter from "@/app/components/Modal/ModalFooter";

type ToolTab =
  | "upload-files"
  | "catalog-copy"
  | "tax-copy"
  | "reset-defaults"
  | "product-integrity";

interface UploadedFileItem {
  id: string;
  name: string;
  size: string;
  type: string;
  progress: number;
  status: "ready" | "uploading" | "completed" | "error";
  targetFolder: string;
}

interface IntegrityIssue {
  id: string;
  sku: string;
  productName: string;
  issueType: "Missing Image" | "Orphaned SKU" | "Zero Price" | "Inventory Mismatch" | "Missing BNPL Plan";
  severity: "High" | "Medium" | "Low";
  status: "Open" | "Resolved";
  detectedAt: string;
}

export default function AdminToolsPage() {
  const [activeTab, setActiveTab] = useState<ToolTab>("upload-files");

  // =========================================================================
  // 1. Upload Multiple Files State
  // =========================================================================
  const [targetFolder, setTargetFolder] = useState("products");
  const [fileList, setFileList] = useState<UploadedFileItem[]>([
    {
      id: "f-1",
      name: "solar_freezer_210l_front.webp",
      size: "245 KB",
      type: "image/webp",
      progress: 100,
      status: "completed",
      targetFolder: "products",
    },
    {
      id: "f-2",
      name: "koolboks_inverter_specsheet.pdf",
      size: "1.4 MB",
      type: "application/pdf",
      progress: 100,
      status: "completed",
      targetFolder: "compliance",
    },
    {
      id: "f-3",
      name: "banner_blackfriday_mobile.jpg",
      size: "480 KB",
      type: "image/jpeg",
      progress: 60,
      status: "uploading",
      targetFolder: "banners",
    },
  ]);
  const [isSimulatingUpload, setIsSimulatingUpload] = useState(false);

  const handleSimulateAddFiles = () => {
    const dummyFiles: UploadedFileItem[] = [
      {
        id: `f-${Date.now()}-1`,
        name: `appliance_catalog_batch_${Math.floor(Math.random() * 100)}.png`,
        size: "320 KB",
        type: "image/png",
        progress: 100,
        status: "completed",
        targetFolder,
      },
      {
        id: `f-${Date.now()}-2`,
        name: `vendor_contract_annex_${Math.floor(Math.random() * 100)}.pdf`,
        size: "890 KB",
        type: "application/pdf",
        progress: 100,
        status: "completed",
        targetFolder,
      },
    ];
    setFileList((prev) => [...dummyFiles, ...prev]);
  };

  const handleRemoveFile = (id: string) => {
    setFileList((prev) => prev.filter((f) => f.id !== id));
  };

  const handleClearAllFiles = () => {
    setFileList([]);
  };

  // =========================================================================
  // 2. Catalog Copy State
  // =========================================================================
  const [sourceCatalog, setSourceCatalog] = useState("lagos-core");
  const [destinationCatalog, setDestinationCatalog] = useState("abuja-regional");
  const [includePricing, setIncludePricing] = useState(true);
  const [includeInventory, setIncludeInventory] = useState(false);
  const [includeMedia, setIncludeMedia] = useState(true);
  const [includeBnplRules, setIncludeBnplRules] = useState(true);
  const [isCatalogCopyModalOpen, setIsCatalogCopyModalOpen] = useState(false);
  const [isCatalogCopying, setIsCatalogCopying] = useState(false);

  const handleExecuteCatalogCopy = () => {
    setIsCatalogCopying(true);
    setTimeout(() => {
      setIsCatalogCopying(false);
      setIsCatalogCopyModalOpen(false);
      alert(`Catalog successfully replicated from ${sourceCatalog} to ${destinationCatalog}. 142 items copied.`);
    }, 1200);
  };

  // =========================================================================
  // 3. Tax Copy State
  // =========================================================================
  const [sourceTaxState, setSourceTaxState] = useState("Lagos State (7.5% VAT + 1% Green Tariff)");
  const [destinationTaxState, setDestinationTaxState] = useState("Ogun State");
  const [overridePercentage, setOverridePercentage] = useState("");
  const [applyToAllCategories, setApplyToAllCategories] = useState(true);
  const [isTaxCopying, setIsTaxCopying] = useState(false);

  const handleExecuteTaxCopy = () => {
    setIsTaxCopying(true);
    setTimeout(() => {
      setIsTaxCopying(false);
      alert(`Tax schedules copied from "${sourceTaxState}" to "${destinationTaxState}".`);
    }, 1000);
  };

  // =========================================================================
  // 4. Reset to Default Configuration Settings State
  // =========================================================================
  const [resetLocalization, setResetLocalization] = useState(true);
  const [resetNomenclature, setResetNomenclature] = useState(true);
  const [resetSecurityPolicy, setResetSecurityPolicy] = useState(false);
  const [resetStorefrontStyling, setResetStorefrontStyling] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleExecuteReset = () => {
    if (confirmInput.trim().toUpperCase() !== "RESET") {
      alert('Please type "RESET" to confirm configuration restore.');
      return;
    }
    setIsResetting(true);
    setTimeout(() => {
      setIsResetting(false);
      setIsResetModalOpen(false);
      setConfirmInput("");
      alert("Configuration settings restored to factory system defaults.");
    }, 1200);
  };

  // =========================================================================
  // 5. Product Integrity State
  // =========================================================================
  const [isScanning, setIsScanning] = useState(false);
  const [integrityIssues, setIntegrityIssues] = useState<IntegrityIssue[]>([
    {
      id: "ISS-01",
      sku: "KB-FRZ-300L-SOLAR",
      productName: "Koolboks 300L Solar Chest Freezer",
      issueType: "Missing Image",
      severity: "High",
      status: "Open",
      detectedAt: "Today, 18:22",
    },
    {
      id: "ISS-02",
      sku: "KB-INV-KIT-500W",
      productName: "Solar Hybrid Power Inverter Kit 500W",
      issueType: "Missing BNPL Plan",
      severity: "High",
      status: "Open",
      detectedAt: "Today, 17:15",
    },
    {
      id: "ISS-03",
      sku: "KB-ICE-BOX-45L",
      productName: "Insulated Medical Cold Ice Box 45L",
      issueType: "Inventory Mismatch",
      severity: "Medium",
      status: "Open",
      detectedAt: "Yesterday",
    },
    {
      id: "ISS-04",
      sku: "KB-SPARE-GASKET-01",
      productName: "Replacement Silicone Freezer Door Gasket",
      issueType: "Orphaned SKU",
      severity: "Low",
      status: "Open",
      detectedAt: "Yesterday",
    },
  ]);

  const handleRunIntegrityScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      alert("Integrity verification completed across 1,280 SKUs. 4 issues flagged.");
    }, 1500);
  };

  const handleResolveIssue = (id: string) => {
    setIntegrityIssues((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "Resolved" } : item))
    );
  };

  return (
    <div className="space-y-6">
      {/* Tab Bar: 5 Tools */}
      <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto pb-0.5">
        <button
          onClick={() => setActiveTab("upload-files")}
          className={`px-4 py-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
            activeTab === "upload-files"
              ? "border-blue-600 text-blue-600 bg-white shadow-sm rounded-t-xl"
              : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-white/50"
          }`}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span>Upload Multiple Files Tool</span>
        </button>

        <button
          onClick={() => setActiveTab("catalog-copy")}
          className={`px-4 py-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
            activeTab === "catalog-copy"
              ? "border-blue-600 text-blue-600 bg-white shadow-sm rounded-t-xl"
              : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-white/50"
          }`}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          <span>Catalog Copy Tool</span>
        </button>

        <button
          onClick={() => setActiveTab("tax-copy")}
          className={`px-4 py-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
            activeTab === "tax-copy"
              ? "border-blue-600 text-blue-600 bg-white shadow-sm rounded-t-xl"
              : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-white/50"
          }`}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          <span>Tax Copy Tool</span>
        </button>

        <button
          onClick={() => setActiveTab("reset-defaults")}
          className={`px-4 py-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
            activeTab === "reset-defaults"
              ? "border-blue-600 text-blue-600 bg-white shadow-sm rounded-t-xl"
              : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-white/50"
          }`}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
          <span>Reset to Default Configuration Settings</span>
        </button>

        <button
          onClick={() => setActiveTab("product-integrity")}
          className={`px-4 py-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
            activeTab === "product-integrity"
              ? "border-blue-600 text-blue-600 bg-white shadow-sm rounded-t-xl"
              : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-white/50"
          }`}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span>Product Integrity</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-rose-50 text-rose-700">
            {integrityIssues.filter((i) => i.status === "Open").length}
          </span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* 1. UPLOAD MULTIPLE FILES TOOL                                         */}
      {/* ========================================================================= */}
      {activeTab === "upload-files" && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Upload Multiple Files Tool</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Batch upload catalog assets, product imagery, marketing banners, and merchant certificates directly into S3 storage.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-gray-500">Destination Folder:</span>
                <Select
                  options={[
                    { label: "Products / Appliance Photos", value: "products" },
                    { label: "Marketing Banners", value: "banners" },
                    { label: "Vendor Compliance & Certificates", value: "compliance" },
                    { label: "Instruction Manuals & PDFs", value: "manuals" },
                  ]}
                  value={targetFolder}
                  onChange={(val) => setTargetFolder(val)}
                  className="text-xs w-60"
                />
              </div>
            </div>

            {/* Drag & Drop Zone */}
            <div
              onClick={handleSimulateAddFiles}
              className="border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all bg-gray-50/50 hover:bg-blue-50/20 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Icon name="upload" className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-bold text-gray-900">
                Click or drag files here to upload to <span className="font-mono text-blue-600">/{targetFolder}</span>
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Supports PNG, JPG, WebP, SVG, PDF, CSV, XLSX up to 50MB per file.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white text-gray-800 border border-gray-200 shadow-2xs">
                <span>Select Multiple Files</span>
              </div>
            </div>

            {/* File List Queue */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Files in Queue ({fileList.length})
                </h3>
                {fileList.length > 0 && (
                  <button
                    onClick={handleClearAllFiles}
                    className="text-xs font-bold text-rose-600 hover:text-rose-800 transition-colors"
                  >
                    Clear Queue
                  </button>
                )}
              </div>

              {fileList.length === 0 ? (
                <div className="py-8 text-center text-xs text-gray-400 bg-gray-50 rounded-xl border border-gray-100">
                  No files queued. Click the dropzone above to add files.
                </div>
              ) : (
                <div className="space-y-2">
                  {fileList.map((file) => (
                    <div
                      key={file.id}
                      className="p-3.5 bg-gray-50/80 rounded-xl border border-gray-200 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-mono text-xs font-black uppercase shrink-0">
                          {file.name.split(".").pop()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-900 truncate">{file.name}</p>
                          <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                            <span>{file.size}</span>
                            <span>•</span>
                            <span className="font-mono">/{file.targetFolder}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        {file.status === "completed" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Uploaded
                          </span>
                        )}
                        {file.status === "uploading" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 animate-pulse">
                            {file.progress}% Uploading
                          </span>
                        )}

                        <button
                          onClick={() => handleRemoveFile(file.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Icon name="trash" className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. CATALOG COPY TOOL                                                  */}
      {/* ========================================================================= */}
      {activeTab === "catalog-copy" && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-lg font-bold text-gray-900">Catalog Copy Tool</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Duplicate products, SKUs, category hierarchies, and retail specifications between regional distribution branches or staging environments.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Source Catalog */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                <span className="text-xs font-black text-gray-700 uppercase tracking-wider block">
                  Source Catalog (Origin)
                </span>
                <Select
                  options={[
                    { label: "Lagos Core Master Catalog (142 Products)", value: "lagos-core" },
                    { label: "Solar Energy & Commercial Freezer Line", value: "solar-appliances" },
                    { label: "Vendor: SolarTech Ltd Catalog", value: "vendor-solartech" },
                    { label: "Koolboks Direct Wholesale", value: "koolboks-wholesale" },
                  ]}
                  value={sourceCatalog}
                  onChange={(val) => setSourceCatalog(val)}
                  className="text-xs w-full"
                />
                <p className="text-[11px] text-gray-400">
                  Products, categories, and attributes will be read from this catalog snapshot.
                </p>
              </div>

              {/* Destination Catalog */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                <span className="text-xs font-black text-gray-700 uppercase tracking-wider block">
                  Destination Catalog (Target)
                </span>
                <Select
                  options={[
                    { label: "Abuja Regional Hub Storefront", value: "abuja-regional" },
                    { label: "Port Harcourt Metro Catalog", value: "ph-metro" },
                    { label: "Kano Northern Commercial Line", value: "kano-north" },
                    { label: "Sandbox / Staging Environment", value: "staging-catalog" },
                  ]}
                  value={destinationCatalog}
                  onChange={(val) => setDestinationCatalog(val)}
                  className="text-xs w-full"
                />
                <p className="text-[11px] text-gray-400">
                  Existing items in the target catalog with matching SKUs will be updated or appended.
                </p>
              </div>
            </div>

            {/* Copy Preferences */}
            <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-3">
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Replication Rules & Data Scope
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <label className="flex items-center gap-2.5 text-xs font-medium text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includePricing}
                    onChange={(e) => setIncludePricing(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Copy base retail pricing and currency rates</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs font-medium text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeInventory}
                    onChange={(e) => setIncludeInventory(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Copy warehouse inventory counts (Default: Reset to 0)</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs font-medium text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeMedia}
                    onChange={(e) => setIncludeMedia(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Replicate product media thumbnails and gallery photos</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs font-medium text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeBnplRules}
                    onChange={(e) => setIncludeBnplRules(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Copy BNPL installment terms (3, 6, 12-month payment options)</span>
                </label>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsCatalogCopyModalOpen(true)}
              >
                Launch Catalog Copy Tool
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. TAX COPY TOOL                                                      */}
      {/* ========================================================================= */}
      {activeTab === "tax-copy" && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-lg font-bold text-gray-900">Tax Copy Tool</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Replicate state tax rules, VAT brackets, environmental green surcharges, and withholding guidelines across territories.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                <span className="text-xs font-black text-gray-700 uppercase tracking-wider block">
                  Source Tax Schedule
                </span>
                <Select
                  options={[
                    { label: "Lagos State (7.5% VAT + 1% Green Tariff)", value: "Lagos State (7.5% VAT + 1% Green Tariff)" },
                    { label: "FCT Abuja (7.5% Federal VAT Rate)", value: "FCT Abuja (7.5% Federal VAT Rate)" },
                    { label: "Commercial BNPL Tax Rules (Zero Rate on Solar)", value: "Commercial BNPL Tax Rules (Zero Rate on Solar)" },
                  ]}
                  value={sourceTaxState}
                  onChange={(val) => setSourceTaxState(val)}
                  className="text-xs w-full"
                />
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                <span className="text-xs font-black text-gray-700 uppercase tracking-wider block">
                  Destination State / Region
                </span>
                <Select
                  options={[
                    { label: "Ogun State", value: "Ogun State" },
                    { label: "Oyo State", value: "Oyo State" },
                    { label: "Rivers State", value: "Rivers State" },
                    { label: "Kano State", value: "Kano State" },
                    { label: "Delta State", value: "Delta State" },
                  ]}
                  value={destinationTaxState}
                  onChange={(val) => setDestinationTaxState(val)}
                  className="text-xs w-full"
                />
              </div>
            </div>

            <div className="p-4 bg-gray-50/70 border border-gray-200 rounded-xl space-y-4">
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Optional Overrides & Adjustments
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">
                    Rate Adjustment Delta (optional % offset)
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. +0.5% or leave empty"
                    value={overridePercentage}
                    onChange={(e) => setOverridePercentage(e.target.value)}
                    className="text-xs w-full"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={applyToAllCategories}
                      onChange={(e) => setApplyToAllCategories(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Apply uniformly to all product categories</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                variant="primary"
                size="md"
                onClick={handleExecuteTaxCopy}
                disabled={isTaxCopying}
              >
                {isTaxCopying ? "Replicating Tax Schedules..." : "Copy Tax Schedule"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 4. RESET TO DEFAULT CONFIGURATION SETTINGS                            */}
      {/* ========================================================================= */}
      {activeTab === "reset-defaults" && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900">Reset to Default Configuration Settings</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200 uppercase">
                  Admin Safe Reset
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Restore platform customization tokens, currency formats, default nomenclature terms, and security thresholds back to official factory baselines.
              </p>
            </div>

            {/* Warning Alert Banner */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
              <Icon name="alert-triangle" className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 space-y-1">
                <p className="font-bold">Caution: Factory Reset Mode</p>
                <p>
                  Resetting selected settings will overwrite any custom labels or localization overrides. Products, orders, and customer accounts will remain intact and will not be altered.
                </p>
              </div>
            </div>

            {/* Selectable Modules to Reset */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Select Configuration Modules to Restore
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 flex items-start gap-3 cursor-pointer hover:bg-gray-100/70 transition-colors">
                  <input
                    type="checkbox"
                    checked={resetLocalization}
                    onChange={(e) => setResetLocalization(e.target.checked)}
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-gray-900 block">Localization & Currency Tokens</span>
                    <span className="text-[11px] text-gray-500">Restore default NGN (₦), date formats, and Nigerian timezone.</span>
                  </div>
                </label>

                <label className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 flex items-start gap-3 cursor-pointer hover:bg-gray-100/70 transition-colors">
                  <input
                    type="checkbox"
                    checked={resetNomenclature}
                    onChange={(e) => setResetNomenclature(e.target.checked)}
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-gray-900 block">Platform Nomenclature</span>
                    <span className="text-[11px] text-gray-500">Reset custom terms (e.g. &quot;Merchant&quot; to &quot;Vendor&quot;, &quot;Plan&quot; to &quot;BNPL&quot;).</span>
                  </div>
                </label>

                <label className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 flex items-start gap-3 cursor-pointer hover:bg-gray-100/70 transition-colors">
                  <input
                    type="checkbox"
                    checked={resetSecurityPolicy}
                    onChange={(e) => setResetSecurityPolicy(e.target.checked)}
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-gray-900 block">Security Policies & Rate Limits</span>
                    <span className="text-[11px] text-gray-500">Revert session expiration, 2FA enforcement, and login attempt limits.</span>
                  </div>
                </label>

                <label className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 flex items-start gap-3 cursor-pointer hover:bg-gray-100/70 transition-colors">
                  <input
                    type="checkbox"
                    checked={resetStorefrontStyling}
                    onChange={(e) => setResetStorefrontStyling(e.target.checked)}
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-gray-900 block">Web & App Theme Styling</span>
                    <span className="text-[11px] text-gray-500">Restore default Koolboks primary blue, font sizing, and radius values.</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                variant="rose"
                size="md"
                onClick={() => setIsResetModalOpen(true)}
              >
                Proceed to Reset Defaults
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 5. PRODUCT INTEGRITY                                                  */}
      {/* ========================================================================= */}
      {activeTab === "product-integrity" && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Product Integrity Scanner</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Automated diagnostic scanner checking for missing images, pricing irregularities, broken BNPL configurations, and orphaned catalog SKUs.
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={handleRunIntegrityScan}
                disabled={isScanning}
              >
                {isScanning ? "Scanning Catalog..." : "Run Integrity Scan"}
              </Button>
            </div>

            {/* Diagnostic Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <span className="text-xs text-gray-500 font-semibold block uppercase">Total Scanned</span>
                <span className="text-2xl font-black text-gray-900 mt-1 block">1,280 SKUs</span>
              </div>
              <div className="bg-rose-50/70 p-4 rounded-xl border border-rose-100">
                <span className="text-xs text-rose-700 font-semibold block uppercase">Open Anomalies</span>
                <span className="text-2xl font-black text-rose-600 mt-1 block">
                  {integrityIssues.filter((i) => i.status === "Open").length} Issues
                </span>
              </div>
              <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-100">
                <span className="text-xs text-emerald-700 font-semibold block uppercase">Catalog Health</span>
                <span className="text-2xl font-black text-emerald-600 mt-1 block">99.7%</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <span className="text-xs text-gray-500 font-semibold block uppercase">Last Integrity Run</span>
                <span className="text-sm font-bold text-gray-800 mt-2 block">10 mins ago</span>
              </div>
            </div>

            {/* Issue Table */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Flagged Product Anomalies
              </h3>

              <div className="overflow-x-auto border border-gray-200 rounded-xl">
                <table className="w-full text-left text-xs text-gray-700">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase font-semibold">
                    <tr>
                      <th className="py-3 px-4">SKU / Product</th>
                      <th className="py-3 px-4">Issue Description</th>
                      <th className="py-3 px-4">Severity</th>
                      <th className="py-3 px-4">Detected</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {integrityIssues.map((issue) => (
                      <tr key={issue.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-gray-900">{issue.productName}</div>
                          <div className="text-[11px] font-mono text-gray-400">{issue.sku}</div>
                        </td>

                        <td className="py-3 px-4 font-medium text-gray-800">
                          {issue.issueType}
                        </td>

                        <td className="py-3 px-4">
                          {issue.severity === "High" && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-100 text-rose-800">
                              HIGH
                            </span>
                          )}
                          {issue.severity === "Medium" && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-100 text-amber-800">
                              MEDIUM
                            </span>
                          )}
                          {issue.severity === "Low" && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-slate-100 text-slate-800">
                              LOW
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-gray-500">
                          {issue.detectedAt}
                        </td>

                        <td className="py-3 px-4">
                          {issue.status === "Open" ? (
                            <span className="text-rose-600 font-bold">Unresolved</span>
                          ) : (
                            <span className="text-emerald-600 font-bold">Resolved</span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right">
                          {issue.status === "Open" ? (
                            <button
                              onClick={() => handleResolveIssue(issue.id)}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors"
                            >
                              Auto-Fix
                            </button>
                          ) : (
                            <span className="text-gray-400 text-xs">Completed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: CONFIRM CATALOG COPY                                           */}
      {/* ========================================================================= */}
      <Modal isOpen={isCatalogCopyModalOpen} onClose={() => setIsCatalogCopyModalOpen(false)}>
        <ModalBody>
          <div className="space-y-4 pt-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Icon name="copy" className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900">Confirm Catalog Replication</h3>
              <p className="text-xs text-gray-500 mt-1">
                You are about to replicate catalog records from <span className="font-bold text-gray-800">{sourceCatalog}</span> into <span className="font-bold text-gray-800">{destinationCatalog}</span>.
              </p>
            </div>

            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-1">
              <div>✓ Base retail prices included: {includePricing ? "Yes" : "No"}</div>
              <div>✓ Media and product assets included: {includeMedia ? "Yes" : "No"}</div>
              <div>✓ BNPL installment payment terms included: {includeBnplRules ? "Yes" : "No"}</div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="flex items-center justify-end gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCatalogCopyModalOpen(false)}
              disabled={isCatalogCopying}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleExecuteCatalogCopy}
              disabled={isCatalogCopying}
            >
              {isCatalogCopying ? "Copying Catalog..." : "Confirm & Execute"}
            </Button>
          </div>
        </ModalFooter>
      </Modal>

      {/* ===================================================================== */}
      {/* MODAL: RESET CONFIGURATION CONFIRMATION                               */}
      {/* ========================================================================= */}
      <Modal isOpen={isResetModalOpen} onClose={() => setIsResetModalOpen(false)}>
        <ModalBody>
          <div className="space-y-4 pt-2">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Icon name="trash" className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900">Confirm Factory Configuration Reset</h3>
              <p className="text-xs text-gray-500 mt-1">
                Type <span className="font-mono font-bold text-rose-600">RESET</span> below to confirm rolling back selected system settings to baseline defaults.
              </p>
            </div>

            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Type RESET here"
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
                className="w-full text-center font-mono font-bold text-sm tracking-wider"
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="flex items-center justify-end gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsResetModalOpen(false);
                setConfirmInput("");
              }}
              disabled={isResetting}
            >
              Cancel
            </Button>
            <Button
              variant="rose"
              size="sm"
              onClick={handleExecuteReset}
              disabled={isResetting}
            >
              {isResetting ? "Restoring Defaults..." : "Confirm Reset Defaults"}
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
}
