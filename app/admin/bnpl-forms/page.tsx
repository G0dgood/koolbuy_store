"use client";

import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import { Button } from "@/app/components/Button";
import Search from "@/app/components/ui/Search";
import Dropdown from "@/app/components/ui/Dropdown";
import { StatCard } from "@/app/components/Admin/StatCard";
import Modal from "@/app/components/Modal/Modal";
import ModalBody from "@/app/components/Modal/ModalBody";
import ModalFooter from "@/app/components/Modal/ModalFooter";
import {
  HiOutlineClipboardDocumentList,
  HiOutlineEye,
  HiOutlinePlus,
  HiOutlineCheck,
  HiOutlineTrash,
  HiOutlineDocumentArrowUp,
  HiOutlineUser,
  HiOutlineBriefcase,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
} from "react-icons/hi2";

export type BNPLSection = "personal" | "employment" | "guarantor" | "documents";

export interface BNPLFormField {
  id: string;
  section: BNPLSection;
  label: string;
  fieldKey: string;
  fieldType: "text" | "number" | "phone" | "email" | "select" | "date" | "file";
  requirement: "mandatory" | "optional" | "disabled";
  helperText?: string;
}

const INITIAL_FIELDS: BNPLFormField[] = [
  // Personal Information
  {
    id: "f-1",
    section: "personal",
    label: "Full Legal Name",
    fieldKey: "applicant_full_name",
    fieldType: "text",
    requirement: "mandatory",
    helperText: "Must match government identification and BVN records exactly.",
  },
  {
    id: "f-2",
    section: "personal",
    label: "Bank Verification Number (BVN)",
    fieldKey: "applicant_bvn",
    fieldType: "number",
    requirement: "mandatory",
    helperText: "11-digit verification number validated via NIBSS API.",
  },
  {
    id: "f-3",
    section: "personal",
    label: "National Identification Number (NIN)",
    fieldKey: "applicant_nin",
    fieldType: "number",
    requirement: "mandatory",
    helperText: "Used for identity authentication and credit scoring.",
  },
  {
    id: "f-4",
    section: "personal",
    label: "Primary Phone Number",
    fieldKey: "applicant_phone",
    fieldType: "phone",
    requirement: "mandatory",
    helperText: "Must be active on WhatsApp for delivery coordination.",
  },
  {
    id: "f-5",
    section: "personal",
    label: "Date of Birth",
    fieldKey: "applicant_dob",
    fieldType: "date",
    requirement: "mandatory",
    helperText: "Applicants must be at least 21 years of age.",
  },
  {
    id: "f-6",
    section: "personal",
    label: "Residential Address",
    fieldKey: "residential_address",
    fieldType: "text",
    requirement: "mandatory",
    helperText: "Physical location where solar equipment will be installed.",
  },
  {
    id: "f-7",
    section: "personal",
    label: "Marital Status",
    fieldKey: "marital_status",
    fieldType: "select",
    requirement: "optional",
    helperText: "Used for household credit profiling.",
  },

  // Employment & Income
  {
    id: "f-8",
    section: "employment",
    label: "Employment Status",
    fieldKey: "employment_status",
    fieldType: "select",
    requirement: "mandatory",
    helperText: "Salaried employee, registered business owner, or self-employed.",
  },
  {
    id: "f-9",
    section: "employment",
    label: "Employer / Company Name",
    fieldKey: "employer_name",
    fieldType: "text",
    requirement: "mandatory",
    helperText: "Name of registered enterprise or corporate employer.",
  },
  {
    id: "f-10",
    section: "employment",
    label: "Monthly Net Income (₦)",
    fieldKey: "monthly_net_income",
    fieldType: "number",
    requirement: "mandatory",
    helperText: "Verified average take-home income over the last 6 months.",
  },
  {
    id: "f-11",
    section: "employment",
    label: "Monthly Salary / Pay Day",
    fieldKey: "salary_pay_day",
    fieldType: "select",
    requirement: "mandatory",
    helperText: "Select day of the month when salary or revenue is received.",
  },
  {
    id: "f-12",
    section: "employment",
    label: "Workplace Physical Address",
    fieldKey: "workplace_address",
    fieldType: "text",
    requirement: "mandatory",
    helperText: "Office or commercial branch location.",
  },

  // Guarantor Details
  {
    id: "f-13",
    section: "guarantor",
    label: "Guarantor Full Legal Name",
    fieldKey: "guarantor_name",
    fieldType: "text",
    requirement: "mandatory",
    helperText: "First and last name of the verified guarantor.",
  },
  {
    id: "f-14",
    section: "guarantor",
    label: "Relationship to Applicant",
    fieldKey: "guarantor_relationship",
    fieldType: "select",
    requirement: "mandatory",
    helperText: "Immediate family member, employer, or certified colleague.",
  },
  {
    id: "f-15",
    section: "guarantor",
    label: "Guarantor Mobile Number",
    fieldKey: "guarantor_phone",
    fieldType: "phone",
    requirement: "mandatory",
    helperText: "Will receive OTP verification during application review.",
  },
  {
    id: "f-16",
    section: "guarantor",
    label: "Guarantor NIN / BVN",
    fieldKey: "guarantor_id_number",
    fieldType: "number",
    requirement: "mandatory",
    helperText: "Required for legal guarantee agreement execution.",
  },

  // Document Uploads
  {
    id: "f-17",
    section: "documents",
    label: "Government Identification Card",
    fieldKey: "doc_government_id",
    fieldType: "file",
    requirement: "mandatory",
    helperText: "National e-ID, Voter Card, Driver's License or International Passport.",
  },
  {
    id: "f-18",
    section: "documents",
    label: "Recent Utility Bill (Electricity/Water)",
    fieldKey: "doc_utility_bill",
    fieldType: "file",
    requirement: "mandatory",
    helperText: "Proof of residence issued within the last 3 months.",
  },
  {
    id: "f-19",
    section: "documents",
    label: "6-Month Official Bank Statement",
    fieldKey: "doc_bank_statement",
    fieldType: "file",
    requirement: "mandatory",
    helperText: "PDF statement downloaded directly from online banking portal.",
  },
  {
    id: "f-20",
    section: "documents",
    label: "Passport Photograph",
    fieldKey: "doc_passport_photo",
    fieldType: "file",
    requirement: "mandatory",
    helperText: "Clear selfie or white-background portrait photo.",
  },
];

const SECTION_METADATA: Record<BNPLSection, { title: string; icon: any; description: string }> = {
  personal: {
    title: "1. Personal Information",
    icon: HiOutlineUser,
    description: "Applicant identification, BVN verification, and residential details.",
  },
  employment: {
    title: "2. Employment & Income",
    icon: HiOutlineBriefcase,
    description: "Income verification, employer contacts, and salary pay cycles.",
  },
  guarantor: {
    title: "3. Guarantor Verification",
    icon: HiOutlineShieldCheck,
    description: "Third-party co-signer verification and indemnity contact.",
  },
  documents: {
    title: "4. Required Documents",
    icon: HiOutlineDocumentArrowUp,
    description: "KYC documentation, bank statements, and proof of address.",
  },
};

export default function BNPLFormsPage() {
  const [fields, setFields] = useState<BNPLFormField[]>(INITIAL_FIELDS);
  const [search, setSearch] = useState("");
  const [activeSection, setActiveSection] = useState<string>("all");
  const [activeRequirement, setActiveRequirement] = useState<string>("all");

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New field state
  const [newLabel, setNewLabel] = useState("");
  const [newKey, setNewKey] = useState("");
  const [newSection, setNewSection] = useState<BNPLSection>("personal");
  const [newType, setNewType] = useState<BNPLFormField["fieldType"]>("text");
  const [newRequirement, setNewRequirement] = useState<BNPLFormField["requirement"]>("mandatory");
  const [newHelper, setNewHelper] = useState("");

  const filteredFields = useMemo(() => {
    return fields.filter((f) => {
      const matchSearch =
        search.trim() === "" ||
        f.label.toLowerCase().includes(search.toLowerCase()) ||
        f.fieldKey.toLowerCase().includes(search.toLowerCase()) ||
        (f.helperText && f.helperText.toLowerCase().includes(search.toLowerCase()));

      const matchSection = activeSection === "all" || f.section === activeSection;
      const matchRequirement = activeRequirement === "all" || f.requirement === activeRequirement;

      return matchSearch && matchSection && matchRequirement;
    });
  }, [fields, search, activeSection, activeRequirement]);

  const mandatoryCount = fields.filter((f) => f.requirement === "mandatory").length;
  const optionalCount = fields.filter((f) => f.requirement === "optional").length;

  const handleUpdateRequirement = (id: string, req: BNPLFormField["requirement"]) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, requirement: req } : f))
    );
    toast.success("Field requirement setting updated.");
  };

  const handleDeleteField = (id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
    toast.success("Field removed from form.");
  };

  const handleAddField = () => {
    if (!newLabel.trim()) {
      toast.error("Please enter a field label.");
      return;
    }
    const generatedKey = newKey.trim() || newLabel.toLowerCase().replace(/[^a-z0-9]+/g, "_");
    const newFieldObj: BNPLFormField = {
      id: `custom-${Date.now()}`,
      section: newSection,
      label: newLabel.trim(),
      fieldKey: generatedKey,
      fieldType: newType,
      requirement: newRequirement,
      helperText: newHelper.trim(),
    };

    setFields((prev) => [...prev, newFieldObj]);
    toast.success(`Added field "${newLabel}".`);
    setIsAddOpen(false);
    setNewLabel("");
    setNewKey("");
    setNewHelper("");
  };

  const handleSaveForm = () => {
    toast.success("BNPL application form configuration published successfully!");
  };

  return (
    <div className="flex flex-col gap-6 pb-16">
      {/* Action Bar */}
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" size="sm" href="/admin/bnpl-orders">
          BNPL Orders
        </Button>
        <Button
          variant="outline"
          size="sm"
          iconLeft={<HiOutlineEye className="w-4 h-4 text-brand-orange-text" />}
          onClick={() => setIsPreviewOpen(true)}
        >
          Preview Form
        </Button>
        <Button
          variant="primary"
          size="sm"
          iconLeft={<HiOutlineCheck className="w-4 h-4" />}
          onClick={handleSaveForm}
        >
          Save Configuration
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard size="sm" title="Total Form Fields" value={fields.length} periodLabel="Across 4 sections" />
        <StatCard size="sm" title="Mandatory Fields" value={mandatoryCount} periodLabel="Strict KYC validation" />
        <StatCard size="sm" title="Optional Fields" value={optionalCount} periodLabel="Secondary profiling" />
        <StatCard size="sm" title="Document Uploads" value={4} periodLabel="Verified identity & bank PDFs" />
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-light-gray rounded-lg flex flex-col overflow-hidden">
        <div className="p-4 sm:px-6 flex flex-col gap-3 border-b border-light-gray">
          <div className="flex flex-col lg:flex-row gap-3 lg:items-center justify-between">
            <Search
              value={search}
              onChange={(val) => setSearch(val)}
              placeholder="Search field label, variable key, or instructions..."
              maxWidth="max-w-none"
              className="w-full lg:w-96"
            />

            <div className="flex flex-wrap items-center gap-3">
              <div className="w-48">
                <Dropdown
                  options={[
                    { value: "all", label: "All sections" },
                    { value: "personal", label: "Personal Information" },
                    { value: "employment", label: "Employment & Income" },
                    { value: "guarantor", label: "Guarantor Details" },
                    { value: "documents", label: "Document Uploads" },
                  ]}
                  value={activeSection}
                  onChange={(val) => setActiveSection(String(val ?? "all"))}
                  placeholder="Section"
                  searchable={false}
                  size="sm"
                />
              </div>

              <div className="w-40">
                <Dropdown
                  options={[
                    { value: "all", label: "All requirements" },
                    { value: "mandatory", label: "Mandatory only" },
                    { value: "optional", label: "Optional only" },
                    { value: "disabled", label: "Disabled" },
                  ]}
                  value={activeRequirement}
                  onChange={(val) => setActiveRequirement(String(val ?? "all"))}
                  placeholder="Requirement"
                  searchable={false}
                  size="sm"
                />
              </div>

              <Button
                variant="outline"
                size="sm"
                iconLeft={<HiOutlinePlus className="w-3.5 h-3.5 text-brand-orange-text" />}
                onClick={() => setIsAddOpen(true)}
              >
                Add Custom Field
              </Button>
            </div>
          </div>
        </div>

        {/* Fields List grouped by Section */}
        <div className="p-5 flex flex-col gap-6">
          {(["personal", "employment", "guarantor", "documents"] as BNPLSection[]).map((sec) => {
            const secFields = filteredFields.filter((f) => f.section === sec);
            if (secFields.length === 0) return null;
            const meta = SECTION_METADATA[sec];
            const SectionIcon = meta.icon;

            return (
              <div key={sec} className="flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-light-gray pb-2">
                  <div className="flex items-center gap-2">
                    <SectionIcon className="w-4 h-4 text-brand-orange-text" />
                    <h2 className="text-sm font-semibold text-brand-charcoal">{meta.title}</h2>
                    <span className="text-[11px] text-faint">({secFields.length} fields)</span>
                  </div>
                  <p className="text-[11px] text-faint hidden sm:block">{meta.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {secFields.map((field) => (
                    <div
                      key={field.id}
                      className="p-3.5 rounded-lg border border-light-gray bg-white flex flex-col justify-between gap-3 shadow-sm hover:border-brand-charcoal/30 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-brand-charcoal">{field.label}</span>
                          <span className="text-[11px] font-mono text-faint">{field.fieldKey}</span>
                        </div>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-off-white text-subtle border border-light-gray">
                          {field.fieldType}
                        </span>
                      </div>

                      {field.helperText && (
                        <p className="text-[11px] text-subtle leading-relaxed">{field.helperText}</p>
                      )}

                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-light-gray/60">
                        <div className="w-36">
                          <Dropdown
                            options={[
                              { value: "mandatory", label: "Mandatory" },
                              { value: "optional", label: "Optional" },
                              { value: "disabled", label: "Disabled" },
                            ]}
                            value={field.requirement}
                            onChange={(val) =>
                              handleUpdateRequirement(field.id, val as BNPLFormField["requirement"])
                            }
                            searchable={false}
                            size="sm"
                          />
                        </div>

                        {field.id.startsWith("custom-") && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-error hover:bg-error-soft hover:text-error"
                            title="Delete custom field"
                            onClick={() => handleDeleteField(field.id)}
                            iconLeft={<HiOutlineTrash className="w-4 h-4" />}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Custom Field Modal */}
      {isAddOpen && (
        <Modal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          title="Add Custom BNPL Form Field"
          size="md"
        >
          <ModalBody className="flex flex-col gap-4 py-4">
            <div>
              <label className="block text-[12px] font-medium text-subtle mb-1">Field Label</label>
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="e.g. Alternate Contact Number"
                className="w-full text-xs font-semibold px-3 py-2 bg-white border border-light-gray rounded-lg focus:outline-none focus:border-brand-orange"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-medium text-subtle mb-1">Section</label>
                <Dropdown
                  options={[
                    { value: "personal", label: "Personal Information" },
                    { value: "employment", label: "Employment & Income" },
                    { value: "guarantor", label: "Guarantor Details" },
                    { value: "documents", label: "Document Uploads" },
                  ]}
                  value={newSection}
                  onChange={(val) => setNewSection(val as BNPLSection)}
                  searchable={false}
                  size="sm"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-subtle mb-1">Field Type</label>
                <Dropdown
                  options={[
                    { value: "text", label: "Text String" },
                    { value: "number", label: "Numeric Number" },
                    { value: "phone", label: "Phone Number" },
                    { value: "email", label: "Email Address" },
                    { value: "date", label: "Date Picker" },
                    { value: "select", label: "Select Dropdown" },
                    { value: "file", label: "File Upload" },
                  ]}
                  value={newType}
                  onChange={(val) => setNewType(val as any)}
                  searchable={false}
                  size="sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-subtle mb-1">Requirement Level</label>
              <Dropdown
                options={[
                  { value: "mandatory", label: "Mandatory (Blocks submission if empty)" },
                  { value: "optional", label: "Optional (Applicant may skip)" },
                ]}
                value={newRequirement}
                onChange={(val) => setNewRequirement(val as any)}
                searchable={false}
                size="sm"
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-subtle mb-1">
                Instruction / Helper Text
              </label>
              <textarea
                value={newHelper}
                onChange={(e) => setNewHelper(e.target.value)}
                rows={2}
                placeholder="e.g. Enter a valid Nigerian mobile phone number."
                className="w-full text-xs p-2.5 bg-white border border-light-gray rounded-lg focus:outline-none focus:border-brand-orange text-subtle"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" size="sm" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddField}>
              Add Field to Form
            </Button>
          </ModalFooter>
        </Modal>
      )}

      {/* Live Form Preview Modal */}
      {isPreviewOpen && (
        <Modal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          title="Customer BNPL Application Preview"
          size="lg"
        >
          <ModalBody className="flex flex-col gap-6 py-6 max-h-[75vh] overflow-y-auto">
            <div className="bg-brand-charcoal text-white p-6 rounded-lg flex flex-col gap-2">
              <span className="text-[11px] font-semibold text-brand-orange uppercase tracking-wider">
                Storefront Financing Flow
              </span>
              <h2 className="text-lg font-semibold">Pay in Monthly Installments with KoolBuy BNPL</h2>
              <p className="text-xs text-white/70 leading-relaxed">
                Applicants must complete the steps below to verify creditworthiness and activate their solar cooling installment plan.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              {(["personal", "employment", "guarantor", "documents"] as BNPLSection[]).map((sec) => {
                const secFields = fields.filter((f) => f.section === sec && f.requirement !== "disabled");
                if (secFields.length === 0) return null;
                const meta = SECTION_METADATA[sec];

                return (
                  <div key={sec} className="flex flex-col gap-3 p-4 bg-off-white/60 rounded-lg border border-light-gray">
                    <h3 className="text-xs font-semibold text-brand-charcoal border-b border-light-gray pb-2">
                      {meta.title}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {secFields.map((f) => (
                        <div key={f.id} className="flex flex-col gap-1">
                          <label className="text-[11px] font-medium text-subtle flex items-center justify-between">
                            <span>
                              {f.label}{" "}
                              {f.requirement === "mandatory" && <span className="text-error">*</span>}
                            </span>
                            <span className="text-[10px] text-faint">({f.requirement})</span>
                          </label>
                          <input
                            type="text"
                            disabled
                            placeholder={`Enter ${f.label.toLowerCase()}...`}
                            className="w-full text-xs px-3 py-2 bg-white border border-light-gray rounded-lg text-faint cursor-not-allowed"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" size="sm" onClick={() => setIsPreviewOpen(false)}>
              Close Preview
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
}
