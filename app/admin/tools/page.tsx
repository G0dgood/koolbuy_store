"use client";

import React, { useState } from "react";
import { TabFilter } from "@/app/components/Tabs";
import Checkbox from "@/app/components/Checkbox";
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
      <TabFilter<ToolTab>
        ariaLabel="Tools"
        options={[
          {
            value: "upload-files",
            label: "Upload Multiple Files Tool",
            icon: (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            ),
          },
          {
            value: "catalog-copy",
            label: "Catalog Copy Tool",
            icon: (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            ),
          },
          {
            value: "tax-copy",
            label: "Tax Copy Tool",
            icon: (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            ),
          },
          {
            value: "reset-defaults",
            label: "Reset to Default Configuration Settings",
            icon: (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
            ),
          },
          {
            value: "product-integrity",
            label: "Product Integrity",
            icon: (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            ),
            count: integrityIssues.filter((i) => i.status === "Open").length,
          },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* ===================================================================== */}
      {/* 1. UPLOAD MULTIPLE FILES TOOL                                         */}
      {/* ========================================================================= */}
      {activeTab === "upload-files" && (
        <div className="space-y-6">
          <div className="bg-white border border-light-gray rounded-lg p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-light-gray pb-4">
              <div>
                <h2 className="text-lg font-semibold text-brand-charcoal">Upload Multiple Files Tool</h2>
                <p className="text-xs text-faint mt-0.5">
                  Batch upload catalog assets, product imagery, marketing banners, and merchant certificates directly into S3 storage.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-faint">Destination Folder:</span>
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
              className="border-2 border-dashed border-medium-gray hover:border-brand-orange rounded-lg p-8 sm:p-12 text-center cursor-pointer transition-all bg-off-white/50 hover:bg-brand-orange-soft/20 group"
            >
              <div className="w-14 h-14 rounded-lg bg-brand-orange-soft text-brand-orange-text flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Icon name="upload" className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-semibold text-brand-charcoal">
                Click or drag files here to upload to <span className="font-mono text-brand-orange-text">/{targetFolder}</span>
              </h3>
              <p className="text-xs text-faint mt-1">
                Supports PNG, JPG, WebP, SVG, PDF, CSV, XLSX up to 50MB per file.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-white text-brand-charcoal border border-light-gray">
                <span>Select Multiple Files</span>
              </div>
            </div>

            {/* File List Queue */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[12px] font-medium text-subtle">
                  Files in queue ({fileList.length})
                </h3>
                {fileList.length > 0 && (
                  <button
                    onClick={handleClearAllFiles}
                    className="text-xs font-semibold text-error hover:text-error transition-colors"
                  >
                    Clear Queue
                  </button>
                )}
              </div>

              {fileList.length === 0 ? (
                <div className="py-8 text-center text-xs text-faint bg-off-white rounded-lg border border-light-gray">
                  No files queued. Click the dropzone above to add files.
                </div>
              ) : (
                <div className="space-y-2">
                  {fileList.map((file) => (
                    <div
                      key={file.id}
                      className="p-3.5 bg-off-white/80 rounded-lg border border-light-gray flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-brand-orange-soft text-brand-orange-text flex items-center justify-center font-mono text-xs font-semibold uppercase shrink-0">
                          {file.name.split(".").pop()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-brand-charcoal truncate">{file.name}</p>
                          <div className="flex items-center gap-2 text-[11px] text-faint mt-0.5">
                            <span>{file.size}</span>
                            <span>•</span>
                            <span className="font-mono">/{file.targetFolder}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        {file.status === "completed" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-success-soft text-success">
                            Uploaded
                          </span>
                        )}
                        {file.status === "uploading" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-orange-soft text-brand-charcoal animate-pulse">
                            {file.progress}% Uploading
                          </span>
                        )}

                        <button
                          onClick={() => handleRemoveFile(file.id)}
                          className="p-1.5 rounded-lg text-faint hover:text-error hover:bg-error-soft transition-colors"
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
          <div className="bg-white border border-light-gray rounded-lg p-6 space-y-6">
            <div className="border-b border-light-gray pb-4">
              <h2 className="text-lg font-semibold text-brand-charcoal">Catalog Copy Tool</h2>
              <p className="text-xs text-faint mt-0.5">
                Duplicate products, SKUs, category hierarchies, and retail specifications between regional distribution branches or staging environments.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Source Catalog */}
              <div className="p-4 bg-off-white rounded-lg border border-light-gray space-y-3">
                <span className="text-[12px] font-medium text-subtle block">
                  Source catalog (origin)
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
                <p className="text-[11px] text-faint">
                  Products, categories, and attributes will be read from this catalog snapshot.
                </p>
              </div>

              {/* Destination Catalog */}
              <div className="p-4 bg-off-white rounded-lg border border-light-gray space-y-3">
                <span className="text-[12px] font-medium text-subtle block">
                  Destination catalog (target)
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
                <p className="text-[11px] text-faint">
                  Existing items in the target catalog with matching SKUs will be updated or appended.
                </p>
              </div>
            </div>

            {/* Copy Preferences */}
            <div className="p-4 bg-white border border-light-gray rounded-lg space-y-3">
              <h3 className="text-[12px] font-medium text-subtle">
                Replication rules & data scope
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <label className="flex items-center gap-2.5 text-xs font-medium text-subtle cursor-pointer">
                  <Checkbox
                    size="small"
                    checked={includePricing}
                    onChange={(checked) => setIncludePricing(checked)}
                  />
                  <span>Copy base retail pricing and currency rates</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs font-medium text-subtle cursor-pointer">
                  <Checkbox
                    size="small"
                    checked={includeInventory}
                    onChange={(checked) => setIncludeInventory(checked)}
                  />
                  <span>Copy warehouse inventory counts (Default: Reset to 0)</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs font-medium text-subtle cursor-pointer">
                  <Checkbox
                    size="small"
                    checked={includeMedia}
                    onChange={(checked) => setIncludeMedia(checked)}
                  />
                  <span>Replicate product media thumbnails and gallery photos</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs font-medium text-subtle cursor-pointer">
                  <Checkbox
                    size="small"
                    checked={includeBnplRules}
                    onChange={(checked) => setIncludeBnplRules(checked)}
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
          <div className="bg-white border border-light-gray rounded-lg p-6 space-y-6">
            <div className="border-b border-light-gray pb-4">
              <h2 className="text-lg font-semibold text-brand-charcoal">Tax Copy Tool</h2>
              <p className="text-xs text-faint mt-0.5">
                Replicate state tax rules, VAT brackets, environmental green surcharges, and withholding guidelines across territories.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-off-white rounded-lg border border-light-gray space-y-3">
                <span className="text-[12px] font-medium text-subtle block">
                  Source tax schedule
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

              <div className="p-4 bg-off-white rounded-lg border border-light-gray space-y-3">
                <span className="text-[12px] font-medium text-subtle block">
                  Destination state / region
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

            <div className="p-4 bg-off-white/70 border border-light-gray rounded-lg space-y-4">
              <h3 className="text-[12px] font-medium text-subtle">
                Optional overrides & adjustments
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-subtle block mb-1">
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
                  <label className="flex items-center gap-2 text-xs font-medium text-subtle cursor-pointer">
                    <Checkbox
                      size="small"
                      checked={applyToAllCategories}
                      onChange={(checked) => setApplyToAllCategories(checked)}
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
          <div className="bg-white border border-light-gray rounded-lg p-6 space-y-6">
            <div className="border-b border-light-gray pb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-brand-charcoal">Reset to Default Configuration Settings</h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-warning/10 text-brand-charcoal border border-warning/30">
                  Admin safe reset
                </span>
              </div>
              <p className="text-xs text-faint mt-0.5">
                Restore platform customization tokens, currency formats, default nomenclature terms, and security thresholds back to official factory baselines.
              </p>
            </div>

            {/* Warning Alert Banner */}
            <div className="p-4 bg-warning/10 border border-warning/30 rounded-lg flex items-start gap-3">
              <Icon name="alert-triangle" className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <div className="text-xs text-brand-charcoal space-y-1">
                <p className="font-semibold">Caution: Factory Reset Mode</p>
                <p>
                  Resetting selected settings will overwrite any custom labels or localization overrides. Products, orders, and customer accounts will remain intact and will not be altered.
                </p>
              </div>
            </div>

            {/* Selectable Modules to Reset */}
            <div className="space-y-3">
              <h3 className="text-[12px] font-medium text-subtle">
                Select configuration modules to restore
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="p-3.5 bg-off-white rounded-lg border border-light-gray flex items-start gap-3 cursor-pointer hover:bg-light-gray/60 transition-colors">
                  <Checkbox
                    size="small"
                    checked={resetLocalization}
                    onChange={(checked) => setResetLocalization(checked)}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-semibold text-brand-charcoal block">Localization & Currency Tokens</span>
                    <span className="text-[11px] text-faint">Restore default NGN (₦), date formats, and Nigerian timezone.</span>
                  </div>
                </label>

                <label className="p-3.5 bg-off-white rounded-lg border border-light-gray flex items-start gap-3 cursor-pointer hover:bg-light-gray/60 transition-colors">
                  <Checkbox
                    size="small"
                    checked={resetNomenclature}
                    onChange={(checked) => setResetNomenclature(checked)}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-semibold text-brand-charcoal block">Platform Nomenclature</span>
                    <span className="text-[11px] text-faint">Reset custom terms (e.g. &quot;Merchant&quot; to &quot;Vendor&quot;, &quot;Plan&quot; to &quot;BNPL&quot;).</span>
                  </div>
                </label>

                <label className="p-3.5 bg-off-white rounded-lg border border-light-gray flex items-start gap-3 cursor-pointer hover:bg-light-gray/60 transition-colors">
                  <Checkbox
                    size="small"
                    checked={resetSecurityPolicy}
                    onChange={(checked) => setResetSecurityPolicy(checked)}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-semibold text-brand-charcoal block">Security Policies & Rate Limits</span>
                    <span className="text-[11px] text-faint">Revert session expiration, 2FA enforcement, and login attempt limits.</span>
                  </div>
                </label>

                <label className="p-3.5 bg-off-white rounded-lg border border-light-gray flex items-start gap-3 cursor-pointer hover:bg-light-gray/60 transition-colors">
                  <Checkbox
                    size="small"
                    checked={resetStorefrontStyling}
                    onChange={(checked) => setResetStorefrontStyling(checked)}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-semibold text-brand-charcoal block">Web & App Theme Styling</span>
                    <span className="text-[11px] text-faint">Restore default Koolboks primary blue, font sizing, and radius values.</span>
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
          <div className="bg-white border border-light-gray rounded-lg p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-light-gray pb-4">
              <div>
                <h2 className="text-lg font-semibold text-brand-charcoal">Product Integrity Scanner</h2>
                <p className="text-xs text-faint mt-0.5">
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
              <div className="bg-off-white p-4 rounded-lg border border-light-gray">
                <span className="text-xs text-faint font-medium block">Total scanned</span>
                <span className="text-2xl font-semibold text-brand-charcoal mt-1 block">1,280 SKUs</span>
              </div>
              <div className="bg-error-soft/70 p-4 rounded-lg border border-error/30">
                <span className="text-xs text-error font-medium block">Open anomalies</span>
                <span className="text-2xl font-semibold text-error mt-1 block">
                  {integrityIssues.filter((i) => i.status === "Open").length} Issues
                </span>
              </div>
              <div className="bg-success-soft/70 p-4 rounded-lg border border-success/30">
                <span className="text-xs text-success font-medium block">Catalog health</span>
                <span className="text-2xl font-semibold text-success mt-1 block">99.7%</span>
              </div>
              <div className="bg-off-white p-4 rounded-lg border border-light-gray">
                <span className="text-xs text-faint font-medium block">Last integrity run</span>
                <span className="text-sm font-semibold text-brand-charcoal mt-2 block">10 mins ago</span>
              </div>
            </div>

            {/* Issue Table */}
            <div className="space-y-3">
              <h3 className="text-[12px] font-medium text-subtle">
                Flagged product anomalies
              </h3>

              <div className="overflow-x-auto border border-light-gray rounded-lg">
                <table className="w-full text-left text-xs text-subtle">
                  <thead className="bg-off-white border-b border-light-gray text-faint font-semibold">
                    <tr>
                      <th className="py-3 px-4">SKU / product</th>
                      <th className="py-3 px-4">Issue description</th>
                      <th className="py-3 px-4">Severity</th>
                      <th className="py-3 px-4">Detected</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-light-gray">
                    {integrityIssues.map((issue) => (
                      <tr key={issue.id} className="hover:bg-off-white/60 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-medium text-brand-charcoal">{issue.productName}</div>
                          <div className="text-[11px] font-mono text-faint">{issue.sku}</div>
                        </td>

                        <td className="py-3 px-4 font-medium text-brand-charcoal">
                          {issue.issueType}
                        </td>

                        <td className="py-3 px-4">
                          {issue.severity === "High" && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-error-soft text-error">
                              HIGH
                            </span>
                          )}
                          {issue.severity === "Medium" && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-warning/10 text-brand-charcoal">
                              MEDIUM
                            </span>
                          )}
                          {issue.severity === "Low" && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-off-white text-brand-charcoal">
                              LOW
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-faint">
                          {issue.detectedAt}
                        </td>

                        <td className="py-3 px-4">
                          {issue.status === "Open" ? (
                            <span className="text-error font-medium">Unresolved</span>
                          ) : (
                            <span className="text-success font-medium">Resolved</span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right">
                          {issue.status === "Open" ? (
                            <button
                              onClick={() => handleResolveIssue(issue.id)}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold text-brand-orange-text hover:text-brand-charcoal hover:bg-brand-orange-soft transition-colors"
                            >
                              Auto-Fix
                            </button>
                          ) : (
                            <span className="text-faint text-xs">Completed</span>
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
            <div className="w-12 h-12 rounded-lg bg-brand-orange-soft text-brand-orange-text flex items-center justify-center mx-auto">
              <Icon name="copy" className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-brand-charcoal">Confirm Catalog Replication</h3>
              <p className="text-xs text-faint mt-1">
                You are about to replicate catalog records from <span className="font-semibold text-brand-charcoal">{sourceCatalog}</span> into <span className="font-semibold text-brand-charcoal">{destinationCatalog}</span>.
              </p>
            </div>

            <div className="p-3 bg-brand-orange-soft/70 border border-brand-orange/30 rounded-lg text-xs text-brand-charcoal space-y-1">
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
            <div className="w-12 h-12 rounded-lg bg-error-soft text-error flex items-center justify-center mx-auto">
              <Icon name="trash" className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-brand-charcoal">Confirm Factory Configuration Reset</h3>
              <p className="text-xs text-faint mt-1">
                Type <span className="font-mono font-semibold text-error">RESET</span> below to confirm rolling back selected system settings to baseline defaults.
              </p>
            </div>

            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Type RESET here"
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
                className="w-full text-center font-mono font-semibold text-sm tracking-wider"
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
