"use client";

import React, { useState } from "react";
import { TabFilter } from "@/app/components/Tabs";
import Checkbox from "@/app/components/Checkbox";
import { Icon } from "@/app/components/Icon";
import { Button } from "@/app/components/Button";
import { Input, Textarea } from "@/app/components/Form/Inputs";
import { Select } from "@/app/components/Form/Select";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";
import {
  HiGlobeAlt,
  HiBuildingStorefront,
  HiLink,
  HiTag,
  HiUserGroup,
  HiAdjustmentsHorizontal,
  HiDocumentText,
  HiCheckCircle,
  HiArrowPath,
  HiPlus,
  HiTrash,
} from "react-icons/hi2";

type CustomizeTab =
  | "localization"
  | "vendor-type"
  | "links"
  | "nomenclature"
  | "user-onboarding"
  | "miscellaneous"
  | "policy";

export default function CustomizePage() {
  const [activeTab, setActiveTab] = useState<CustomizeTab>("localization");
  const [isSaveSuccessOpen, setIsSaveSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // 1. Localization State
  const [localization, setLocalization] = useState({
    defaultLanguage: "English (UK)",
    primaryCurrency: "NGN (₦)",
    secondaryCurrencies: "USD ($), EUR (€), GHS (₵)",
    timezone: "Africa/Lagos (WAT, UTC+1)",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12-Hour (AM/PM)",
    numberFormat: "1,234,567.89",
  });

  // 2. Vendor Types State
  const [vendorTypes, setVendorTypes] = useState([
    {
      id: "vt-1",
      name: "Direct Manufacturer (OEM)",
      code: "OEM",
      commission: "8%",
      autoApproveProducts: true,
      maxProducts: "Unlimited",
      status: "Active",
    },
    {
      id: "vt-2",
      name: "Authorized Solar Distributor",
      code: "DISTRIBUTOR",
      commission: "12%",
      autoApproveProducts: false,
      maxProducts: "5,000",
      status: "Active",
    },
    {
      id: "vt-3",
      name: "Certified Technical Installer",
      code: "INSTALLER",
      commission: "10%",
      autoApproveProducts: false,
      maxProducts: "500",
      status: "Active",
    },
    {
      id: "vt-4",
      name: "Retail Appliance Merchant",
      code: "RETAILER",
      commission: "15%",
      autoApproveProducts: false,
      maxProducts: "1,000",
      status: "Active",
    },
  ]);
  const [newVendorType, setNewVendorType] = useState({
    name: "",
    code: "",
    commission: "",
    autoApproveProducts: false,
  });

  // 3. Links State
  const [links, setLinks] = useState([
    {
      id: "lk-1",
      label: "Support WhatsApp Helpline",
      url: "https://wa.me/234800KOOLBOKS",
      category: "Customer Support",
    },
    {
      id: "lk-2",
      label: "Developer API & Webhooks",
      url: "https://developer.koolbuy.com/v1",
      category: "Integration",
    },
    {
      id: "lk-3",
      label: "Android Mobile App (Play Store)",
      url: "https://play.google.com/store/apps/details?id=com.koolbuy.store",
      category: "Mobile Apps",
    },
    {
      id: "lk-4",
      label: "iOS Storefront App (App Store)",
      url: "https://apps.apple.com/app/koolbuy-store/id1648291",
      category: "Mobile Apps",
    },
    {
      id: "lk-5",
      label: "Official Corporate Website",
      url: "https://koolboks.com",
      category: "Corporate",
    },
  ]);
  const [newLink, setNewLink] = useState({
    label: "",
    url: "",
    category: "Customer Support",
  });

  // 4. Nomenclature State
  const [nomenclature, setNomenclature] = useState({
    vendorSingular: "Vendor",
    vendorPlural: "Vendors",
    customerSingular: "Customer",
    customerPlural: "Customers",
    orderSingular: "Order",
    orderPlural: "Orders",
    bnplTerm: "Buy Now Pay Later (BNPL)",
    installmentTerm: "Installment Milestone",
    storefrontTerm: "KoolBuy Store",
    loyaltyPointsTerm: "KoolCoins",
  });

  // 5. User Onboarding State
  const [onboarding, setOnboarding] = useState({
    requireBvnVerification: true,
    requirePhoneOtp: true,
    requireEmailVerification: true,
    allowGuestCheckout: true,
    welcomeDiscountActive: true,
    welcomeDiscountPercent: "10%",
    welcomeMessage:
      "Welcome to Koolbuy! Enjoy eco-friendly freezing solutions with flexible installment plans.",
    requireCacForBusinessBuyers: true,
    requireGuarantorForBnpl: true,
  });

  // 6. Miscellaneous State
  const [misc, setMisc] = useState({
    maintenanceMode: false,
    bannerAnnouncementActive: true,
    bannerText:
      "Flash Sale: Up to 20% discount on Solar Inverter Freezers with 3-Month zero-interest BNPL!",
    autoCancelUnpaidHours: "48",
    lowStockThreshold: "5",
    enableCustomerReviews: true,
    autoApproveReviews: false,
    maxCartQuantityPerItem: "10",
  });

  // 7. Policy State
  const [policies, setPolicies] = useState({
    termsConditions: `1. Acceptance of Terms: By accessing Koolbuy, customers agree to abide by all merchant policies and electronic payment processing terms.\n2. Product Warranties: All Scanfrost, Bruhm, and Koolboks chest freezers come with a minimum 12-month manufacturer warranty covering compressor and solar inverter circuitry.\n3. Merchant Obligations: Vendors must maintain inventory accuracy and process dispatch within 48 business hours of order placement.`,
    privacyPolicy: `1. Data Collection: Koolbuy gathers customer identification information, delivery addresses, and contact numbers exclusively to fulfill orders and perform regulatory compliance.\n2. BVN & Credit Checks: In compliance with NDPR and CBN guidelines, financial credentials provided during BNPL applications are encrypted and checked against verified credit bureau databases.\n3. Third-Party Sharing: Customer records are never sold or distributed to unauthorized marketing entities.`,
    refundPolicy: `1. 7-Day Return Window: Customers may return damaged or non-functional appliances within 7 calendar days of confirmed delivery.\n2. Inspection & Replacement: Units must remain in pristine packaging with technical tags intact for immediate warehouse replacement or full refund.\n3. BNPL Cancellations: Initial down payments will be refunded to the source bank account within 3 to 5 business days upon equipment retrieval.`,
    bnplPolicy: `1. Milestone Repayment: Customers agree to debit authorizations scheduled on the 1st or 15th of each month according to chosen installment tenors (3, 6, or 12 months).\n2. Grace Period: A 3-day grace period is extended before late penalty fees of 1.5% are assessed.\n3. Asset Protection: Koolboks IoT-enabled freezers maintain remote lockout protection in cases of 30+ days non-repayment until installment regularization.`,
  });

  const handleSaveSection = (sectionName: string) => {
    setSuccessMessage(
      `${sectionName} configurations have been successfully saved and applied!`,
    );
    setIsSaveSuccessOpen(true);
  };

  const navTabs = [
    { id: "localization", label: "Localization", icon: HiGlobeAlt },
    { id: "vendor-type", label: "Vendor Type", icon: HiBuildingStorefront },
    { id: "links", label: "Links", icon: HiLink },
    { id: "nomenclature", label: "Nomenclature", icon: HiTag },
    { id: "user-onboarding", label: "User Onboarding", icon: HiUserGroup },
    {
      id: "miscellaneous",
      label: "Miscellaneous",
      icon: HiAdjustmentsHorizontal,
    },
    { id: "policy", label: "Policy", icon: HiDocumentText },
  ];

  return (
    <div className="flex flex-col gap-6 mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-light-gray pb-5">
        <div>
          {/* <h1 className="text-2xl font-semibold text-brand-charcoal tracking-tight">
            Platform Customization
          </h1>
          <p className="text-xs text-faint mt-0.5">
            Configure system localization, vendor classifications, navigation
            links, naming terminology, onboarding flows, and legal policies.
          </p> */}
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <TabFilter
        ariaLabel="Customization sections"
        options={navTabs.map((t) => ({ value: t.id as CustomizeTab, label: t.label, icon: <t.icon /> }))}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* TAB 1: LOCALIZATION */}
      {activeTab === "localization" && (
        <div className="bg-white rounded-lg border border-light-gray p-6 sm:p-8 flex flex-col gap-6">
          <div className="flex justify-between items-center border-b border-light-gray pb-4">
            <div>
              <h3 className="text-base font-semibold text-brand-charcoal">
                Localization Settings
              </h3>
              <p className="text-xs text-faint mt-0.5">
                Manage global language defaults, active currencies, time zones,
                and numeric formats.
              </p>
            </div>
            <Button
              variant="blue"
              onClick={() => handleSaveSection("Localization")}
              iconLeft={<HiCheckCircle className="w-4 h-4" />}
            >
              Save Localization
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-medium text-subtle">
                Default language
              </label>
              <Select
                value={localization.defaultLanguage}
                onChange={(val) =>
                  setLocalization({
                    ...localization,
                    defaultLanguage: val as string,
                  })
                }
                options={[
                  { label: "English (UK)", value: "English (UK)" },
                  { label: "English (US)", value: "English (US)" },
                  { label: "French (Français)", value: "French (Français)" },
                  { label: "Yorùbá", value: "Yorùbá" },
                  { label: "Hausa", value: "Hausa" },
                  { label: "Igbo", value: "Igbo" },
                ]}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-medium text-subtle">
                Primary currency
              </label>
              <Select
                value={localization.primaryCurrency}
                onChange={(val) =>
                  setLocalization({
                    ...localization,
                    primaryCurrency: val as string,
                  })
                }
                options={[
                  { label: "Nigerian Naira (₦)", value: "NGN (₦)" },
                  { label: "US Dollar ($)", value: "USD ($)" },
                  { label: "Euro (€)", value: "EUR (€)" },
                  { label: "Ghanaian Cedi (₵)", value: "GHS (₵)" },
                  { label: "West African CFA (CFA)", value: "XOF (CFA)" },
                ]}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-medium text-subtle">
                Secondary supported currencies
              </label>
              <Input
                value={localization.secondaryCurrencies}
                onChange={(e) =>
                  setLocalization({
                    ...localization,
                    secondaryCurrencies: e.target.value,
                  })
                }
                placeholder="Comma-separated currencies"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-medium text-subtle">
                System timezone
              </label>
              <Select
                value={localization.timezone}
                onChange={(val) =>
                  setLocalization({ ...localization, timezone: val as string })
                }
                options={[
                  {
                    label: "Africa/Lagos (WAT, UTC+1)",
                    value: "Africa/Lagos (WAT, UTC+1)",
                  },
                  {
                    label: "Africa/Accra (GMT, UTC+0)",
                    value: "Africa/Accra (GMT, UTC+0)",
                  },
                  {
                    label: "Europe/London (GMT, UTC+0)",
                    value: "Europe/London (GMT, UTC+0)",
                  },
                  {
                    label: "Europe/Paris (CET, UTC+1)",
                    value: "Europe/Paris (CET, UTC+1)",
                  },
                ]}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-medium text-subtle">
                Date display format
              </label>
              <Select
                value={localization.dateFormat}
                onChange={(val) =>
                  setLocalization({
                    ...localization,
                    dateFormat: val as string,
                  })
                }
                options={[
                  {
                    label: "DD/MM/YYYY (e.g. 20/01/2025)",
                    value: "DD/MM/YYYY",
                  },
                  {
                    label: "MM/DD/YYYY (e.g. 01/20/2025)",
                    value: "MM/DD/YYYY",
                  },
                  {
                    label: "YYYY-MM-DD (e.g. 2025-01-20)",
                    value: "YYYY-MM-DD",
                  },
                  {
                    label: "DD MMM YYYY (e.g. 20 Jan 2025)",
                    value: "DD MMM YYYY",
                  },
                ]}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-medium text-subtle">
                Number & decimal format
              </label>
              <Select
                value={localization.numberFormat}
                onChange={(val) =>
                  setLocalization({
                    ...localization,
                    numberFormat: val as string,
                  })
                }
                options={[
                  {
                    label: "1,234,567.89 (Standard comma and period)",
                    value: "1,234,567.89",
                  },
                  {
                    label: "1.234.567,89 (European period and comma)",
                    value: "1.234.567,89",
                  },
                  {
                    label: "1 234 567.89 (Space thousand separator)",
                    value: "1 234 567.89",
                  },
                ]}
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VENDOR TYPE */}
      {activeTab === "vendor-type" && (
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-lg border border-light-gray p-6 sm:p-8 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-light-gray pb-4">
              <div>
                <h3 className="text-base font-semibold text-brand-charcoal">
                  Vendor Classification & Types
                </h3>
                <p className="text-xs text-faint mt-0.5">
                  Define merchant categories, default commission percentages,
                  and auto-publishing rules.
                </p>
              </div>
              <Button
                variant="blue"
                onClick={() => handleSaveSection("Vendor Type")}
                iconLeft={<HiCheckCircle className="w-4 h-4" />}
              >
                Save Changes
              </Button>
            </div>

            {/* Vendor Types Table */}
            <div className="admin-table-container">
              <table>
                <thead>
                  <tr>
                    <th>Vendor Type Name</th>
                    <th>Code / Identifier</th>
                    <th>Default Commission</th>
                    <th>Catalog Capacity</th>
                    <th>Auto-Approve Products</th>
                    <th>Status</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {vendorTypes.map((vt) => (
                    <tr
                      key={vt.id}
                      className="hover:bg-off-white transition-colors"
                    >
                      <td className="font-medium text-brand-charcoal text-xs">
                        {vt.name}
                      </td>
                      <td className="font-mono text-subtle text-xs">
                        {vt.code}
                      </td>
                      <td className="font-medium text-brand-orange-text text-xs">
                        {vt.commission}
                      </td>
                      <td className="text-xs text-subtle font-medium">
                        {vt.maxProducts}
                      </td>
                      <td>
                        <span
                          className={`px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                            vt.autoApproveProducts
                              ? "bg-success-soft text-success"
                              : "bg-off-white text-subtle"
                          }`}
                        >
                          {vt.autoApproveProducts
                            ? "Auto-Approved"
                            : "Manual Review"}
                        </span>
                      </td>
                      <td>
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-brand-orange-soft text-brand-orange-text">
                          {vt.status}
                        </span>
                      </td>
                      <td className="text-right">
                        <Button
                          variant="outline"
                          className="p-1.5! text-faint hover:text-error hover:bg-error-soft"
                          onClick={() =>
                            setVendorTypes((prev) =>
                              prev.filter((v) => v.id !== vt.id),
                            )
                          }
                          title="Delete vendor type"
                        >
                          <HiTrash className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add New Vendor Type Form */}
            <div className="bg-off-white rounded-lg p-5 border border-light-gray flex flex-col gap-4">
              <h4 className="text-xs font-semibold text-brand-charcoal">
                Create new vendor classification
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <Input
                  placeholder="Classification Name"
                  value={newVendorType.name}
                  onChange={(e) =>
                    setNewVendorType({ ...newVendorType, name: e.target.value })
                  }
                />
                <Input
                  placeholder="Code (e.g. AGENT)"
                  value={newVendorType.code}
                  onChange={(e) =>
                    setNewVendorType({ ...newVendorType, code: e.target.value })
                  }
                />
                <Input
                  placeholder="Commission (e.g. 10%)"
                  value={newVendorType.commission}
                  onChange={(e) =>
                    setNewVendorType({
                      ...newVendorType,
                      commission: e.target.value,
                    })
                  }
                />
                <Button
                  variant="blue"
                  iconLeft={<HiPlus className="w-4 h-4" />}
                  onClick={() => {
                    if (newVendorType.name && newVendorType.code) {
                      setVendorTypes((prev) => [
                        ...prev,
                        {
                          id: `vt-${Date.now()}`,
                          name: newVendorType.name,
                          code: newVendorType.code.toUpperCase(),
                          commission: newVendorType.commission || "10%",
                          autoApproveProducts: false,
                          maxProducts: "1,000",
                          status: "Active",
                        },
                      ]);
                      setNewVendorType({
                        name: "",
                        code: "",
                        commission: "",
                        autoApproveProducts: false,
                      });
                    }
                  }}
                >
                  Add Classification
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LINKS */}
      {activeTab === "links" && (
        <div className="bg-white rounded-lg border border-light-gray p-6 sm:p-8 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-light-gray pb-4">
            <div>
              <h3 className="text-base font-semibold text-brand-charcoal">
                System & External Links
              </h3>
              <p className="text-xs text-faint mt-0.5">
                Configure navigation links, customer helpline shortcuts, mobile
                app links, and API portals.
              </p>
            </div>
            <Button
              variant="blue"
              onClick={() => handleSaveSection("Links")}
              iconLeft={<HiCheckCircle className="w-4 h-4" />}
            >
              Save Links
            </Button>
          </div>

          <div className="admin-table-container">
            <table>
              <thead>
                <tr>
                  <th>Link Label</th>
                  <th>Category</th>
                  <th>Destination URL</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {links.map((lk) => (
                  <tr
                    key={lk.id}
                    className="hover:bg-off-white transition-colors"
                  >
                    <td className="font-medium text-brand-charcoal text-xs">
                      {lk.label}
                    </td>
                    <td>
                      <span className="text-xs bg-off-white text-subtle px-2.5 py-1 rounded-md font-medium">
                        {lk.category}
                      </span>
                    </td>
                    <td className="font-mono text-xs text-brand-orange-text max-w-sm truncate">
                      <a
                        href={lk.url}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline"
                      >
                        {lk.url}
                      </a>
                    </td>
                    <td className="text-right">
                      <Button
                        variant="outline"
                        className="p-1.5! text-faint hover:text-error hover:bg-error-soft"
                        onClick={() =>
                          setLinks((prev) => prev.filter((l) => l.id !== lk.id))
                        }
                      >
                        <HiTrash className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Link */}
          <div className="bg-off-white rounded-lg p-5 border border-light-gray flex flex-col gap-4">
            <h4 className="text-xs font-semibold text-brand-charcoal">
              Add new external / system link
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                placeholder="Link Title (e.g. Terms Portal)"
                value={newLink.label}
                onChange={(e) =>
                  setNewLink({ ...newLink, label: e.target.value })
                }
              />
              <Input
                placeholder="https://..."
                value={newLink.url}
                onChange={(e) =>
                  setNewLink({ ...newLink, url: e.target.value })
                }
              />
              <Button
                variant="blue"
                iconLeft={<HiPlus className="w-4 h-4" />}
                onClick={() => {
                  if (newLink.label && newLink.url) {
                    setLinks((prev) => [
                      ...prev,
                      {
                        id: `lk-${Date.now()}`,
                        ...newLink,
                      },
                    ]);
                    setNewLink({
                      label: "",
                      url: "",
                      category: "Customer Support",
                    });
                  }
                }}
              >
                Add Link
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: NOMENCLATURE */}
      {activeTab === "nomenclature" && (
        <div className="bg-white rounded-lg border border-light-gray p-6 sm:p-8 flex flex-col gap-6">
          <div className="flex justify-between items-center border-b border-light-gray pb-4">
            <div>
              <h3 className="text-base font-semibold text-brand-charcoal">
                Custom Terminology & Nomenclature
              </h3>
              <p className="text-xs text-faint mt-0.5">
                Customize labels and terms across storefront cards, checkout
                buttons, and admin menus.
              </p>
            </div>
            <Button
              variant="blue"
              onClick={() => handleSaveSection("Nomenclature")}
              iconLeft={<HiCheckCircle className="w-4 h-4" />}
            >
              Save Nomenclature
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-medium text-subtle">
                Vendor term (singular / plural)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  value={nomenclature.vendorSingular}
                  onChange={(e) =>
                    setNomenclature({
                      ...nomenclature,
                      vendorSingular: e.target.value,
                    })
                  }
                  placeholder="e.g. Vendor"
                />
                <Input
                  value={nomenclature.vendorPlural}
                  onChange={(e) =>
                    setNomenclature({
                      ...nomenclature,
                      vendorPlural: e.target.value,
                    })
                  }
                  placeholder="e.g. Vendors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-medium text-subtle">
                Customer term (singular / plural)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  value={nomenclature.customerSingular}
                  onChange={(e) =>
                    setNomenclature({
                      ...nomenclature,
                      customerSingular: e.target.value,
                    })
                  }
                  placeholder="e.g. Customer"
                />
                <Input
                  value={nomenclature.customerPlural}
                  onChange={(e) =>
                    setNomenclature({
                      ...nomenclature,
                      customerPlural: e.target.value,
                    })
                  }
                  placeholder="e.g. Customers"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-medium text-subtle">
                Order term (singular / plural)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  value={nomenclature.orderSingular}
                  onChange={(e) =>
                    setNomenclature({
                      ...nomenclature,
                      orderSingular: e.target.value,
                    })
                  }
                  placeholder="e.g. Order"
                />
                <Input
                  value={nomenclature.orderPlural}
                  onChange={(e) =>
                    setNomenclature({
                      ...nomenclature,
                      orderPlural: e.target.value,
                    })
                  }
                  placeholder="e.g. Orders"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-medium text-subtle">
                BNPL terminology
              </label>
              <Input
                value={nomenclature.bnplTerm}
                onChange={(e) =>
                  setNomenclature({ ...nomenclature, bnplTerm: e.target.value })
                }
                placeholder="e.g. Buy Now Pay Later (BNPL)"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-medium text-subtle">
                Installment payment milestone term
              </label>
              <Input
                value={nomenclature.installmentTerm}
                onChange={(e) =>
                  setNomenclature({
                    ...nomenclature,
                    installmentTerm: e.target.value,
                  })
                }
                placeholder="e.g. Installment Milestone"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-medium text-subtle">
                Loyalty reward points term
              </label>
              <Input
                value={nomenclature.loyaltyPointsTerm}
                onChange={(e) =>
                  setNomenclature({
                    ...nomenclature,
                    loyaltyPointsTerm: e.target.value,
                  })
                }
                placeholder="e.g. KoolCoins"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: USER ONBOARDING */}
      {activeTab === "user-onboarding" && (
        <div className="bg-white rounded-lg border border-light-gray p-6 sm:p-8 flex flex-col gap-6">
          <div className="flex justify-between items-center border-b border-light-gray pb-4">
            <div>
              <h3 className="text-base font-semibold text-brand-charcoal">
                User Onboarding & Verification
              </h3>
              <p className="text-xs text-faint mt-0.5">
                Set account creation requirements, identity verification rules,
                and welcome incentives.
              </p>
            </div>
            <Button
              variant="blue"
              onClick={() => handleSaveSection("User Onboarding")}
              iconLeft={<HiCheckCircle className="w-4 h-4" />}
            >
              Save Onboarding Rules
            </Button>
          </div>

          <div className="flex flex-col gap-5 divide-y divide-light-gray">
            {/* BVN Verification Toggle */}
            <div className="flex items-center justify-between pt-3">
              <div>
                <span className="text-xs font-semibold text-brand-charcoal block">
                  Require Bank Verification Number (BVN) for BNPL Applications
                </span>
                <span className="text-xs text-faint">
                  Ensures creditworthiness and fraud protection before approving
                  installment contracts.
                </span>
              </div>
              <Checkbox
                size="medium"
                checked={onboarding.requireBvnVerification}
                onChange={(checked) =>
                  setOnboarding({
                    ...onboarding,
                    requireBvnVerification: checked,
                  })
                }
              />
            </div>

            {/* Phone OTP Toggle */}
            <div className="flex items-center justify-between pt-4">
              <div>
                <span className="text-xs font-semibold text-brand-charcoal block">
                  Enforce SMS OTP Verification on Registration
                </span>
                <span className="text-xs text-faint">
                  Sends automated one-time passcodes to Nigerian phone numbers
                  via SMS.
                </span>
              </div>
              <Checkbox
                size="medium"
                checked={onboarding.requirePhoneOtp}
                onChange={(checked) =>
                  setOnboarding({
                    ...onboarding,
                    requirePhoneOtp: checked,
                  })
                }
              />
            </div>

            {/* Guest Checkout */}
            <div className="flex items-center justify-between pt-4">
              <div>
                <span className="text-xs font-semibold text-brand-charcoal block">
                  Allow Guest Checkout for Full Payments
                </span>
                <span className="text-xs text-faint">
                  Permits immediate card or bank transfer checkout without
                  creating a permanent account.
                </span>
              </div>
              <Checkbox
                size="medium"
                checked={onboarding.allowGuestCheckout}
                onChange={(checked) =>
                  setOnboarding({
                    ...onboarding,
                    allowGuestCheckout: checked,
                  })
                }
              />
            </div>

            {/* Welcome Message */}
            <div className="flex flex-col gap-2 pt-4">
              <label className="text-[12px] font-medium text-subtle">
                Welcome notification / splash text
              </label>
              <Textarea
                rows={2}
                value={onboarding.welcomeMessage}
                onChange={(e) =>
                  setOnboarding({
                    ...onboarding,
                    welcomeMessage: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: MISCELLANEOUS */}
      {activeTab === "miscellaneous" && (
        <div className="bg-white rounded-lg border border-light-gray p-6 sm:p-8 flex flex-col gap-6">
          <div className="flex justify-between items-center border-b border-light-gray pb-4">
            <div>
              <h3 className="text-base font-semibold text-brand-charcoal">
                Miscellaneous System Controls
              </h3>
              <p className="text-xs text-faint mt-0.5">
                Maintenance mode, site banners, automated inventory thresholds,
                and review approval triggers.
              </p>
            </div>
            <Button
              variant="blue"
              onClick={() => handleSaveSection("Miscellaneous")}
              iconLeft={<HiCheckCircle className="w-4 h-4" />}
            >
              Save Settings
            </Button>
          </div>

          <div className="flex flex-col gap-6 divide-y divide-light-gray">
            {/* Maintenance Mode */}
            <div className="flex items-center justify-between pt-3">
              <div>
                <span className="text-xs font-semibold text-brand-charcoal block">
                  Storefront Maintenance Mode
                </span>
                <span className="text-xs text-faint">
                  Temporarily disable public storefront checkout while keeping
                  admin access live.
                </span>
              </div>
              <Checkbox
                size="medium"
                checked={misc.maintenanceMode}
                onChange={(checked) =>
                  setMisc({ ...misc, maintenanceMode: checked })
                }
              />
            </div>

            {/* Global Banner */}
            <div className="flex flex-col gap-3 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-brand-charcoal block">
                    Global Header Announcement Banner
                  </span>
                  <span className="text-xs text-faint">
                    Display top promotional notification strip.
                  </span>
                </div>
                <Checkbox
                  size="medium"
                  checked={misc.bannerAnnouncementActive}
                  onChange={(checked) =>
                    setMisc({
                      ...misc,
                      bannerAnnouncementActive: checked,
                    })
                  }
                />
              </div>
              {misc.bannerAnnouncementActive && (
                <Input
                  value={misc.bannerText}
                  onChange={(e) =>
                    setMisc({ ...misc, bannerText: e.target.value })
                  }
                  placeholder="Banner announcement message"
                />
              )}
            </div>

            {/* Thresholds */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-medium text-subtle">
                  Low stock inventory threshold (units)
                </label>
                <Input
                  type="number"
                  value={misc.lowStockThreshold}
                  onChange={(e) =>
                    setMisc({ ...misc, lowStockThreshold: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-medium text-subtle">
                  Auto-cancel unpaid orders after (hours)
                </label>
                <Input
                  type="number"
                  value={misc.autoCancelUnpaidHours}
                  onChange={(e) =>
                    setMisc({ ...misc, autoCancelUnpaidHours: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: POLICY */}
      {activeTab === "policy" && (
        <div className="bg-white rounded-lg border border-light-gray p-6 sm:p-8 flex flex-col gap-6">
          <div className="flex justify-between items-center border-b border-light-gray pb-4">
            <div>
              <h3 className="text-base font-semibold text-brand-charcoal">
                Legal Policies & Operational Charters
              </h3>
              <p className="text-xs text-faint mt-0.5">
                Maintain published customer agreements, BNPL repayment charters,
                and privacy terms.
              </p>
            </div>
            <Button
              variant="blue"
              onClick={() => handleSaveSection("Policy")}
              iconLeft={<HiCheckCircle className="w-4 h-4" />}
            >
              Save Policies
            </Button>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-medium text-subtle">
                Terms & conditions
              </label>
              <Textarea
                rows={4}
                value={policies.termsConditions}
                onChange={(e) =>
                  setPolicies({ ...policies, termsConditions: e.target.value })
                }
                className="font-mono text-xs leading-relaxed"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-medium text-subtle">
                Privacy & data protection policy (NDPR compliant)
              </label>
              <Textarea
                rows={4}
                value={policies.privacyPolicy}
                onChange={(e) =>
                  setPolicies({ ...policies, privacyPolicy: e.target.value })
                }
                className="font-mono text-xs leading-relaxed"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-medium text-subtle">
                Returns, exchanges & warranty policy
              </label>
              <Textarea
                rows={4}
                value={policies.refundPolicy}
                onChange={(e) =>
                  setPolicies({ ...policies, refundPolicy: e.target.value })
                }
                className="font-mono text-xs leading-relaxed"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-medium text-subtle">
                BNPL credit & repossession charter
              </label>
              <Textarea
                rows={4}
                value={policies.bnplPolicy}
                onChange={(e) =>
                  setPolicies({ ...policies, bnplPolicy: e.target.value })
                }
                className="font-mono text-xs leading-relaxed"
              />
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isSaveSuccessOpen}
        onClose={() => setIsSaveSuccessOpen(false)}
        onConfirm={() => setIsSaveSuccessOpen(false)}
        title="Settings Updated"
        message={successMessage}
        confirmText="Done"
        type="info"
      />
    </div>
  );
}
