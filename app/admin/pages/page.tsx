"use client";

import React, { useState } from "react";
import { Icon } from "../../components/Icon";
import { Button } from "../../components/Button";
import { Input } from "../../components/Form/Inputs";
import { TabFilter } from "../../components/Admin/TabFilter";
import Modal from "../../components/Modal/Modal";
import ModalBody from "../../components/Modal/ModalBody";
import ModalFooter from "../../components/Modal/ModalFooter";
import {
  HiOutlineGlobeAlt,
  HiOutlineDocumentText,
  HiOutlineEye,
  HiOutlineCheck,
  HiOutlineArrowTopRightOnSquare,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineSparkles,
} from "react-icons/hi2";

type PageTabKey =
  | "Vendor Registration"
  | "Privacy Policy"
  | "Term & Conditons"
  | "BNPL";

interface SectionItem {
  id: string;
  title: string;
  content: string;
}

interface PageData {
  title: string;
  slug: string;
  metaDescription: string;
  status: "Published" | "Draft";
  lastUpdated: string;
  headline: string;
  subheadline: string;
  sections: SectionItem[];
}

const initialPagesData: Record<PageTabKey, PageData> = {
  "Vendor Registration": {
    title: "Vendor Registration & Onboarding Guidelines",
    slug: "/vendor-registration",
    metaDescription:
      "Join Nigeria's leading solar cooling marketplace. Learn vendor requirements, commission rates, and step-by-step registration.",
    status: "Published",
    lastUpdated: "Today at 2:45 PM",
    headline: "Sell with Koolbuy — Grow Your Cooling Business",
    subheadline:
      "Join Nigeria's premier clean-energy refrigeration marketplace and reach thousands of verified businesses and retail buyers.",
    sections: [
      {
        id: "vr-1",
        title: "Eligibility & Required Documentation",
        content:
          "To register as an authorized merchant on Koolbuy, businesses must hold a valid CAC Certificate of Incorporation, an active Tax Identification Number (TIN), a physical storefront or warehouse, and manufacturer warranty servicing capacity.",
      },
      {
        id: "vr-2",
        title: "Commission Structure & Payout Terms",
        content:
          "Koolbuy operates with competitive 5% category commissions on cooling appliances. Weekly payouts are reconciled automatically every Tuesday directly to your merchant corporate account with detailed accounting invoices.",
      },
      {
        id: "vr-3",
        title: "Onboarding & Inspection Steps",
        content:
          "1. Complete the digital application form. 2. Merchant verification review (24-48 business hours). 3. Upload product inventory and warranty policies. 4. Complete live test order dispatch.",
      },
      {
        id: "vr-4",
        title: "Merchant SLA & Fulfillment Standards",
        content:
          "Vendors are required to acknowledge and dispatch confirmed orders within 48 hours. Counterfeit equipment or unverified refurbished units are strictly prohibited and subject to immediate account revocation.",
      },
    ],
  },
  "Privacy Policy": {
    title: "Privacy Policy",
    slug: "/privacy-policy",
    metaDescription:
      "Learn how Koolbuy collects, processes, and protects your personal data, transaction history, and IoT telemetry in accordance with the NDPA.",
    status: "Published",
    lastUpdated: "Yesterday at 6:10 PM",
    headline: "Koolbuy Privacy & Data Protection Policy",
    subheadline:
      "We are committed to transparent, secure data handling for all customer orders, installment financing, and connected device telematics.",
    sections: [
      {
        id: "pp-1",
        title: "1. Information We Collect",
        content:
          "We collect personal identification details (name, email address, phone number, shipping address), financial transaction logs handled via encrypted PCI-DSS gateways, and IoT cooling hardware telemetry (compressor uptime, power inputs).",
      },
      {
        id: "pp-2",
        title: "2. How We Use Collected Data",
        content:
          "Your data is used strictly for order logistics, equipment warranty tracking, installment reconciliation, automated servicing notifications, and platform fraud prevention.",
      },
      {
        id: "pp-3",
        title: "3. Third-Party Sharing & Processors",
        content:
          "We never sell customer personal information. Necessary logistics details are shared only with licensed delivery partners, and payment tokens with certified settlement gateways (Paystack/Nomba).",
      },
      {
        id: "pp-4",
        title: "4. Your Rights Under the NDPA",
        content:
          "Under the Nigeria Data Protection Act, customers have the right to inspect, update, or request the deletion of their personal records by contacting privacy@koolboks.com.",
      },
    ],
  },
  "Term & Conditons": {
    title: "Terms and Conditions of Service",
    slug: "/terms",
    metaDescription:
      "Read the official terms and conditions governing the purchase, delivery, warranty, and usage of Koolbuy marketplace cooling appliances.",
    status: "Published",
    lastUpdated: "3 days ago",
    headline: "Terms and Conditions of Use",
    subheadline:
      "Please review these terms carefully before accessing the Koolbuy storefront, purchasing solar appliances, or initiating installment contracts.",
    sections: [
      {
        id: "tc-1",
        title: "1. Agreement & Platform Use",
        content:
          "By accessing Koolbuy or purchasing products, you agree to comply with all operational guidelines, store policies, and statutory trade regulations of the Federal Republic of Nigeria.",
      },
      {
        id: "tc-2",
        title: "2. Pricing, Invoicing & Orders",
        content:
          "All listed prices are denominated in Nigerian Naira (₦) and include applicable Value Added Taxes (VAT). Koolbuy reserves the right to cancel orders arising from typographical or technical pricing discrepancies.",
      },
      {
        id: "tc-3",
        title: "3. Manufacturer Warranty & Service",
        content:
          "All solar freezers and inverter refrigerators carry a 1-year limited manufacturer warranty. Tampering with internal wiring, solar controllers, or inverter units voids warranty protection.",
      },
      {
        id: "tc-4",
        title: "4. Delivery & Transit Damage Claims",
        content:
          "Customers must inspect equipment upon delivery. Any physical transit damage or missing components must be reported within 48 hours for immediate replacement.",
      },
    ],
  },
  BNPL: {
    title: "Buy Now Pay Later (BNPL) Information",
    slug: "/bnpl",
    metaDescription:
      "Discover how Koolbuy's solar cooling BNPL program works. Flexible daily and monthly installments with smart IoT remote pay-as-you-go technology.",
    status: "Published",
    lastUpdated: "5 days ago",
    headline: "Flexible Installment Plans for Clean Cooling",
    subheadline:
      "Acquire high-efficiency commercial freezers and domestic solar refrigerators with manageable payment schedules tailored to your cash flow.",
    sections: [
      {
        id: "bnpl-1",
        title: "1. How Koolbuy BNPL Works",
        content:
          "Select any eligible cooling appliance, choose an installment tenure (3, 6, or 12 months), pay an initial 20% to 30% down payment, and enjoy prompt delivery to your home or shop.",
      },
      {
        id: "bnpl-2",
        title: "2. Eligibility & Application Criteria",
        content:
          "Applicants must be Nigerian residents aged 18+, possess an active bank account with a valid BVN, and demonstrate steady commercial or business revenue streams.",
      },
      {
        id: "bnpl-3",
        title: "3. IoT Smart Pay-As-You-Go Technology",
        content:
          "Each BNPL appliance is linked to Koolboks proprietary IoT smart controllers. Keeping installments up to date ensures uninterrupted solar refrigeration. Missed repayments trigger automated standby locking.",
      },
      {
        id: "bnpl-4",
        title: "4. Full Ownership & Title Clearance",
        content:
          "Upon completion of your installment schedule, full unencumbered ownership of the appliance and warranty certificate is formally released to you.",
      },
    ],
  },
};

export default function CMSPagesManagement() {
  const [activeTab, setActiveTab] = useState<PageTabKey>("Vendor Registration");
  const [pagesState, setPagesState] = useState(initialPagesData);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  const tabs: PageTabKey[] = [
    "Vendor Registration",
    "Privacy Policy",
    "Term & Conditons",
    "BNPL",
  ];

  const currentPage = pagesState[activeTab];

  const updateCurrentPage = (updates: Partial<PageData>) => {
    setPagesState((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        ...updates,
      },
    }));
  };

  const handleUpdateSection = (
    sectionId: string,
    field: "title" | "content",
    val: string,
  ) => {
    const updatedSections = currentPage.sections.map((sec) =>
      sec.id === sectionId ? { ...sec, [field]: val } : sec,
    );
    updateCurrentPage({ sections: updatedSections });
  };

  const handleAddSection = () => {
    const newSection: SectionItem = {
      id: `sec-${Date.now()}`,
      title: "New Policy Section",
      content: "Enter detailed policy or guideline information here...",
    };
    updateCurrentPage({ sections: [...currentPage.sections, newSection] });
  };

  const handleDeleteSection = (sectionId: string) => {
    const updatedSections = currentPage.sections.filter(
      (sec) => sec.id !== sectionId,
    );
    updateCurrentPage({ sections: updatedSections });
  };

  const handleSave = () => {
    updateCurrentPage({ lastUpdated: "Just now" });
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  return (
    <div className="flex flex-col gap-6 mx-auto pb-16">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5">
        <div>
          {/* <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            CMS Pages
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Edit content, legal disclosures, and customer-facing informational
            landing pages
          </p> */}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            shape="rounded-sm"
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
            onClick={() => setIsPreviewOpen(true)}
          >
            <HiOutlineEye className="w-4 h-4 text-[#00BCD4]" />
            <span>Preview Page</span>
          </Button>

          <Button
            variant="primary"
            shape="rounded-sm"
            className="bg-[#00BCD4] hover:bg-[#00acc1] text-white flex items-center gap-1.5 text-xs font-semibold px-4 py-2 cursor-pointer shadow-sm"
            onClick={handleSave}
          >
            <HiOutlineCheck className="w-4 h-4" />
            <span>Save Changes</span>
          </Button>
        </div>
      </div>

      {/* Save Success Alert Banner */}
      {saveToast && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg flex items-center justify-between text-xs font-semibold animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <HiOutlineSparkles className="w-4 h-4 text-emerald-600" />
            <span>
              Changes to <strong>{currentPage.title}</strong> have been saved
              and published successfully.
            </span>
          </div>
          <button
            onClick={() => setSaveToast(false)}
            className="text-emerald-700 hover:text-emerald-900 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Page Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-gray-100 shadow-2xs">
        <TabFilter
          tabs={tabs}
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab as PageTabKey)}
        />

        <div className="flex items-center gap-3 text-xs font-medium text-gray-500">
          <span className="flex items-center gap-1.5 text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            {currentPage.status}
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="text-gray-400">
            Last updated:{" "}
            <strong className="text-gray-600">{currentPage.lastUpdated}</strong>
          </span>
        </div>
      </div>

      {/* Main Form Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Main Page Content */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Banner & Hero Settings */}
          <div className="bg-white rounded-lg border border-gray-100 p-5 sm:p-6 shadow-2xs flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <HiOutlineDocumentText className="w-5 h-5 text-[#00BCD4]" />
              <h3 className="text-sm font-bold text-[#1D3557]">
                Page Header & Hero Banner
              </h3>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                  Main Headline
                </label>
                <Input
                  value={currentPage.headline}
                  onChange={(e) =>
                    updateCurrentPage({ headline: e.target.value })
                  }
                  placeholder="Enter page headline..."
                  className="font-bold text-gray-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                  Subheadline / Summary
                </label>
                <textarea
                  value={currentPage.subheadline}
                  onChange={(e) =>
                    updateCurrentPage({ subheadline: e.target.value })
                  }
                  rows={2}
                  className="w-full text-xs p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#00BCD4] text-gray-700 leading-relaxed"
                  placeholder="Enter supporting subheadline..."
                />
              </div>
            </div>
          </div>

          {/* Sections Editor */}
          <div className="bg-white rounded-lg border border-gray-100 p-5 sm:p-6 shadow-2xs flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Icon
                  name="layer"
                  folder="dashboardIcon"
                  size="sm"
                  className="text-[#00BCD4]"
                />
                <h3 className="text-sm font-bold text-[#1D3557]">
                  Content Sections ({currentPage.sections.length})
                </h3>
              </div>
              <Button
                variant="outline"
                shape="rounded-sm"
                className="text-xs font-semibold text-[#00BCD4] border-[#00BCD4]/30 hover:bg-[#00BCD4]/10 flex items-center gap-1.5 cursor-pointer"
                onClick={handleAddSection}
              >
                <HiOutlinePlus className="w-3.5 h-3.5" />
                <span>Add Section</span>
              </Button>
            </div>

            <div className="flex flex-col gap-4">
              {currentPage.sections.map((section, idx) => (
                <div
                  key={section.id}
                  className="p-4 rounded-lg border border-gray-200 bg-gray-50/40 flex flex-col gap-3 relative group"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Section #{idx + 1}
                    </span>
                    {currentPage.sections.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteSection(section.id)}
                        className="text-gray-400 hover:text-rose-500 transition-colors p-1"
                        title="Delete section"
                      >
                        <HiOutlineTrash className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                      Section Title
                    </label>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) =>
                        handleUpdateSection(section.id, "title", e.target.value)
                      }
                      className="w-full text-xs font-bold px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-[#00BCD4]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                      Section Body Content
                    </label>
                    <textarea
                      value={section.content}
                      onChange={(e) =>
                        handleUpdateSection(
                          section.id,
                          "content",
                          e.target.value,
                        )
                      }
                      rows={4}
                      className="w-full text-xs p-3 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-[#00BCD4] text-gray-700 leading-relaxed font-normal"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Page Metadata, SEO & Publish Status */}
        <div className="flex flex-col gap-6">
          {/* Publishing Card */}
          <div className="bg-white rounded-lg border border-gray-100 p-5 shadow-2xs flex flex-col gap-4">
            <h3 className="text-sm font-bold text-[#1D3557] border-b border-gray-100 pb-2">
              Publishing Controls
            </h3>

            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                  Publication Status
                </label>
                <select
                  value={currentPage.status}
                  onChange={(e) =>
                    updateCurrentPage({
                      status: e.target.value as "Published" | "Draft",
                    })
                  }
                  className="w-full text-xs font-semibold px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-[#00BCD4]"
                >
                  <option value="Published">Published (Live to public)</option>
                  <option value="Draft">Draft (Internal review only)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                  Public URL Path
                </label>
                <div className="flex items-center gap-1.5 p-2 bg-gray-50 rounded-lg border border-gray-200 text-xs font-mono text-gray-700">
                  <HiOutlineGlobeAlt className="w-4 h-4 text-[#00BCD4] shrink-0" />
                  <span className="truncate">{currentPage.slug}</span>
                  <a
                    href={currentPage.slug}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-auto text-gray-400 hover:text-brand-blue"
                    title="View live page"
                  >
                    <HiOutlineArrowTopRightOnSquare className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* SEO Metadata Card */}
          <div className="bg-white rounded-lg border border-gray-100 p-5 shadow-2xs flex flex-col gap-4">
            <h3 className="text-sm font-bold text-[#1D3557] border-b border-gray-100 pb-2">
              Search Engine Optimization (SEO)
            </h3>

            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                  SEO Title
                </label>
                <Input
                  value={currentPage.title}
                  onChange={(e) => updateCurrentPage({ title: e.target.value })}
                  placeholder="Page title tag..."
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                  Meta Description
                </label>
                <textarea
                  value={currentPage.metaDescription}
                  onChange={(e) =>
                    updateCurrentPage({ metaDescription: e.target.value })
                  }
                  rows={3}
                  className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#00BCD4] text-gray-700 leading-relaxed"
                  placeholder="Enter meta description for search engines..."
                />
                <span className="text-[10px] text-gray-400">
                  Recommended: 120-160 characters (
                  {currentPage.metaDescription.length} chars)
                </span>
              </div>
            </div>
          </div>

          {/* Page Info Card */}
          <div className="bg-blue-50/50 rounded-lg border border-blue-100 p-4 flex flex-col gap-2">
            <span className="text-xs font-bold text-[#1D3557]">
              CMS Information
            </span>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              This page manages the public legal and informational content for{" "}
              <strong>{activeTab}</strong>. All changes are rendered on the
              storefront when set to Published.
            </p>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={`Live Preview: ${currentPage.title}`}
        size="lg"
      >
        <ModalBody className="flex flex-col gap-6 py-6 max-h-[70vh] overflow-y-auto">
          {/* Storefront Hero Preview */}
          <div className="bg-gradient-to-br from-[#1D3557] to-[#0d1b2a] text-white p-8 rounded-lg flex flex-col gap-3">
            <span className="text-[11px] uppercase tracking-widest font-bold text-[#00BCD4]">
              Koolbuy Storefront
            </span>
            <h1 className="text-2xl font-black">{currentPage.headline}</h1>
            <p className="text-xs text-gray-300 leading-relaxed max-w-2xl">
              {currentPage.subheadline}
            </p>
          </div>

          {/* Sections Preview */}
          <div className="flex flex-col gap-6">
            {currentPage.sections.map((section) => (
              <div
                key={section.id}
                className="flex flex-col gap-2 border-b border-gray-100 pb-4"
              >
                <h3 className="text-base font-bold text-[#1D3557]">
                  {section.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
            Close Preview
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
