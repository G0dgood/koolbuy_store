"use client";

import React, { useState } from "react";
import { Button } from "../../components/Button";
import { Input, Textarea } from "../../components/Form/Inputs";
import Modal from "../../components/Modal/Modal";
import ModalBody from "../../components/Modal/ModalBody";
import ModalFooter from "../../components/Modal/ModalFooter";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";
import {
  HiCheckBadge,
  HiPencilSquare,
  HiPhoto,
  HiArrowTopRightOnSquare,
} from "react-icons/hi2";

/** Read-only fields sit on off-white; editable ones turn white (DESIGN.md inputs). */
const fieldClass = (editing: boolean) =>
  `${editing ? "bg-white" : "bg-off-white"} text-brand-charcoal text-[13px] font-medium tabular-nums transition-colors`;

export default function OrganisationProfilePage() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [isSaveSuccessOpen, setIsSaveSuccessOpen] = useState(false);
  const [orgLogo, setOrgLogo] = useState("/images/koolboks/koolbuy_logo.webp");
  const [tempLogoUrl, setTempLogoUrl] = useState("");

  const [orgData, setOrgData] = useState({
    legalName: "Koolboks Technologies Limited",
    tradingName: "Koolbuy Store",
    rcNumber: "RC-1648291",
    tinNumber: "TIN-23948291-0001",
    industry: "Solar Refrigeration & Clean Tech",
    primaryEmail: "contact@koolboks.com",
    supportEmail: "support@koolbuy.com",
    primaryPhone: "+234 1 234 5678",
    supportPhone: "+234 800 KOOLBOKS",
    website: "https://koolbuy.com",
    registeredAddress: "Plot 12B, Admiralty Way, Lekki Phase 1",
    city: "Lagos",
    state: "Lagos State",
    country: "Nigeria",
    postalCode: "105102",
    operatingHours: "Monday – Saturday: 8:00 AM – 6:00 PM (WAT)",
    description:
      "Koolboks is dedicated to making eco-friendly solar refrigeration and clean energy freezing solutions accessible and affordable across Africa through innovative Pay-As-You-Go and Buy-Now-Pay-Later technology.",
    bankName: "Access Bank Plc",
    accountNumber: "0123456789",
    accountName: "Koolboks Technologies Ltd - Storefront Settlement",
    currency: "NGN (₦) - Nigerian Naira",
  });

  const handleSave = () => {
    setIsEditMode(false);
    setIsSaveSuccessOpen(true);
  };

  const handleLogoUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempLogoUrl) {
      setOrgLogo(tempLogoUrl);
      setTempLogoUrl("");
    }
    setIsLogoModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-8 mx-auto pb-12">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-light-gray pb-5">
        <div></div>

        <div className="flex items-center gap-3">
          {isEditMode ? (
            <>
              <Button
                variant="outline"
                className=""
                onClick={() => setIsEditMode(false)}
              >
                Cancel
              </Button>
              <Button
                variant="blue"
                iconLeft={<HiCheckBadge className="w-4 h-4" />}
                onClick={handleSave}
              >
                Save Changes
              </Button>
            </>
          ) : (
            <Button
              variant="blue"
              iconLeft={<HiPencilSquare className="w-4 h-4" />}
              onClick={() => setIsEditMode(true)}
            >
              Edit Organisation Details
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Column: Brand & Legal Credentials (4 cols) */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          {/* Brand Summary Card */}
          <div className="bg-white rounded-lg border border-light-gray p-6 flex flex-col items-center text-center relative overflow-hidden">
            {/* Top Accent Pattern */}
            <div className="absolute top-0 inset-x-0 h-24 bg-linear-to-r from-brand-charcoal via-brand-charcoal to-brand-orange-hover opacity-90" />

            {/* Logo Avatar */}
            <div className="relative mt-8 mb-4 w-28 h-28 rounded-lg border-4 border-white overflow-hidden bg-white p-2 ring-1 ring-light-gray flex items-center justify-center">
              <img
                src={orgLogo}
                alt="Organisation Logo"
                className="w-full h-full object-contain"
              />
            </div>

            <h2 className="text-[18px] font-semibold text-brand-charcoal tracking-[-0.01em]">
              {orgData.legalName}
            </h2>
            <span className="text-xs font-semibold text-brand-orange-text mt-0.5">
              Trading as: {orgData.tradingName}
            </span>

            <div className="w-full border-t border-light-gray my-5" />

            {/* Quick Credentials List */}
            <div className="w-full flex flex-col gap-3 text-left">
              <div className="flex justify-between items-center text-[13px] py-1.5 border-b border-black/[0.06]">
                <span className="text-faint">
                  Registration No.
                </span>
                <span className="font-semibold text-brand-charcoal tabular-nums">
                  {orgData.rcNumber}
                </span>
              </div>
              <div className="flex justify-between items-center text-[13px] py-1.5 border-b border-black/[0.06]">
                <span className="text-faint">Tax ID (TIN)</span>
                <span className="font-semibold text-brand-charcoal tabular-nums">
                  {orgData.tinNumber}
                </span>
              </div>
              <div className="flex justify-between items-center text-[13px] py-1.5 border-b border-black/[0.06]">
                <span className="text-faint">
                  Industry Sector
                </span>
                <span className="font-medium text-brand-charcoal text-right">
                  {orgData.industry}
                </span>
              </div>
              <div className="flex justify-between items-center text-[13px] py-1.5 border-b border-black/[0.06]">
                <span className="text-faint">
                  Operating Currency
                </span>
                <span className="font-semibold text-brand-charcoal">
                  {orgData.currency}
                </span>
              </div>
            </div>

            {/* Change Logo Action */}
            <Button
              variant="outline"
              className="mt-5 w-full text-[13px] font-semibold"
              iconLeft={<HiPhoto className="w-4 h-4" />}
              onClick={() => setIsLogoModalOpen(true)}
            >
              Update Brand Logo
            </Button>
          </div>

          {/* Corporate Channels Card */}
          <div className="bg-white rounded-lg border border-light-gray p-6 flex flex-col gap-4">
            <h3 className="text-[15px] font-semibold text-brand-charcoal">
              Corporate Web Presence
            </h3>

            <div className="flex flex-col gap-2.5 text-[13px]">
              <a
                href={orgData.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-lg bg-off-white hover:bg-brand-orange-soft transition-colors transition-colors group"
              >
                <span className="font-semibold text-brand-charcoal group-hover:text-brand-orange-text">
                  Official Website
                </span>
                <HiArrowTopRightOnSquare className="w-3.5 h-3.5 text-faint group-hover:text-brand-orange-text" />
              </a>

              <div className="flex items-center justify-between p-3 rounded-lg bg-off-white">
                <span className="text-subtle">
                  Customer Support Email
                </span>
                <a
                  href={`mailto:${orgData.supportEmail}`}
                  className="font-semibold text-brand-charcoal hover:text-brand-orange-text"
                >
                  {orgData.supportEmail}
                </a>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-off-white">
                <span className="text-subtle">
                  Corporate Inquiries
                </span>
                <a
                  href={`mailto:${orgData.primaryEmail}`}
                  className="font-semibold text-brand-charcoal hover:text-brand-orange-text"
                >
                  {orgData.primaryEmail}
                </a>
              </div>
            </div>
          </div>

          {/* Compliance & Regulatory Seal */}
          <div className="bg-brand-orange-soft rounded-lg border border-brand-orange/15 p-6 flex flex-col gap-3">
            <div>
              <h3 className="text-[15px] font-semibold text-brand-charcoal">
                Corporate Compliance
              </h3>
              <p className="text-[12px] text-subtle mt-0.5">
                CAC & Regulatory Status: Active
              </p>
            </div>
            <p className="text-[12px] text-subtle leading-relaxed">
              This organization account is verified and authorized for merchant
              trade, BNPL financing, and payment aggregation on Koolbuy.
            </p>
          </div>
        </div>

        {/* Right Column: Detailed Organisation Profile & Coordinates (8 cols) */}
        <div className="xl:col-span-8 flex flex-col gap-8">
          {/* Main Business Details */}
          <div className="bg-white rounded-lg border border-light-gray p-6 sm:p-8 flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-light-gray pb-4">
              <h3 className="text-[15px] font-semibold text-brand-charcoal">
                Legal Business Information
              </h3>
              <span className="text-[12px] font-medium text-faint">
                {isEditMode ? "Editing Enabled" : "Read Only"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-medium text-subtle">
                  Registered Legal Entity Name
                </label>
                <Input
                  type="text"
                  value={orgData.legalName}
                  readOnly={!isEditMode}
                  onChange={(e) =>
                    setOrgData({ ...orgData, legalName: e.target.value })
                  }
                  className={fieldClass(isEditMode)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-medium text-subtle">
                  Commercial / Trading Name
                </label>
                <Input
                  type="text"
                  value={orgData.tradingName}
                  readOnly={!isEditMode}
                  onChange={(e) =>
                    setOrgData({ ...orgData, tradingName: e.target.value })
                  }
                  className={fieldClass(isEditMode)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-medium text-subtle">
                  Company Registration Number (RC)
                </label>
                <Input
                  type="text"
                  value={orgData.rcNumber}
                  readOnly={!isEditMode}
                  onChange={(e) =>
                    setOrgData({ ...orgData, rcNumber: e.target.value })
                  }
                  className={fieldClass(isEditMode)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-medium text-subtle">
                  Tax Identification Number (TIN)
                </label>
                <Input
                  type="text"
                  value={orgData.tinNumber}
                  readOnly={!isEditMode}
                  onChange={(e) =>
                    setOrgData({ ...orgData, tinNumber: e.target.value })
                  }
                  className={fieldClass(isEditMode)}
                />
              </div>
            </div>

            {/* Organisation Mission / Description */}
            <div className="flex flex-col gap-2 pt-2">
              <label className="text-[12px] font-medium text-subtle">
                Organisation Overview & Purpose
              </label>
              <Textarea
                rows={3}
                value={orgData.description}
                readOnly={!isEditMode}
                onChange={(e) =>
                  setOrgData({ ...orgData, description: e.target.value })
                }
                className={fieldClass(isEditMode)}
              />
            </div>
          </div>

          {/* Headquarters Location & Operating Coordinates */}
          <div className="bg-white rounded-lg border border-light-gray p-6 sm:p-8 flex flex-col gap-6">
            <div className="border-b border-light-gray pb-4">
              <h3 className="text-[15px] font-semibold text-brand-charcoal">
                Corporate Headquarters & Address
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-[12px] font-medium text-subtle">
                  Registered Physical Address
                </label>
                <Input
                  type="text"
                  value={orgData.registeredAddress}
                  readOnly={!isEditMode}
                  onChange={(e) =>
                    setOrgData({
                      ...orgData,
                      registeredAddress: e.target.value,
                    })
                  }
                  className={fieldClass(isEditMode)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-medium text-subtle">
                  City
                </label>
                <Input
                  type="text"
                  value={orgData.city}
                  readOnly={!isEditMode}
                  onChange={(e) =>
                    setOrgData({ ...orgData, city: e.target.value })
                  }
                  className={fieldClass(isEditMode)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-medium text-subtle">
                  State / Region
                </label>
                <Input
                  type="text"
                  value={orgData.state}
                  readOnly={!isEditMode}
                  onChange={(e) =>
                    setOrgData({ ...orgData, state: e.target.value })
                  }
                  className={fieldClass(isEditMode)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-medium text-subtle">
                  Country
                </label>
                <Input
                  type="text"
                  value={orgData.country}
                  readOnly={!isEditMode}
                  onChange={(e) =>
                    setOrgData({ ...orgData, country: e.target.value })
                  }
                  className={fieldClass(isEditMode)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-medium text-subtle">
                  Postal / ZIP Code
                </label>
                <Input
                  type="text"
                  value={orgData.postalCode}
                  readOnly={!isEditMode}
                  onChange={(e) =>
                    setOrgData({ ...orgData, postalCode: e.target.value })
                  }
                  className={fieldClass(isEditMode)}
                />
              </div>
            </div>
          </div>

          {/* Official Communication & Banking Settlement */}
          <div className="bg-white rounded-lg border border-light-gray p-6 sm:p-8 flex flex-col gap-6">
            <div className="border-b border-light-gray pb-4">
              <h3 className="text-[15px] font-semibold text-brand-charcoal">
                Communication & Settlement Banking
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-medium text-subtle">
                  Official Corporate Telephone
                </label>
                <Input
                  type="text"
                  value={orgData.primaryPhone}
                  readOnly={!isEditMode}
                  onChange={(e) =>
                    setOrgData({ ...orgData, primaryPhone: e.target.value })
                  }
                  className={fieldClass(isEditMode)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-medium text-subtle">
                  Customer Support Toll-Free
                </label>
                <Input
                  type="text"
                  value={orgData.supportPhone}
                  readOnly={!isEditMode}
                  onChange={(e) =>
                    setOrgData({ ...orgData, supportPhone: e.target.value })
                  }
                  className={fieldClass(isEditMode)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-medium text-subtle">
                  Primary Settlement Financial Institution
                </label>
                <Input
                  type="text"
                  value={orgData.bankName}
                  readOnly={!isEditMode}
                  onChange={(e) =>
                    setOrgData({ ...orgData, bankName: e.target.value })
                  }
                  className={fieldClass(isEditMode)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-medium text-subtle">
                  Settlement Account Number
                </label>
                <Input
                  type="text"
                  value={orgData.accountNumber}
                  readOnly={!isEditMode}
                  onChange={(e) =>
                    setOrgData({ ...orgData, accountNumber: e.target.value })
                  }
                  className={fieldClass(isEditMode)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Logo Modal */}
      <Modal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
        title="Update Organisation Brand Logo"
        size="md"
      >
        <form onSubmit={handleLogoUpload}>
          <ModalBody className="flex flex-col gap-4">
            <p className="text-[13px] text-subtle leading-relaxed">
              Enter the image URL for the official organisation logo or select a
              preset Koolbuy brand asset.
            </p>
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-medium text-subtle">
                Logo Image URL
              </label>
              <Input
                placeholder="https://example.com/logo.png or /images/..."
                value={tempLogoUrl}
                onChange={(e) => setTempLogoUrl(e.target.value)}
                required
              />
            </div>
            <div className="p-3 bg-off-white rounded-lg flex items-center justify-between text-[13px]">
              <span className="text-subtle">Preset Default Logo:</span>
              <button
                type="button"
                className="text-brand-orange-text font-semibold hover:underline"
                onClick={() =>
                  setTempLogoUrl("/images/koolboks/koolbuy_logo.webp")
                }
              >
                Use Koolbuy Logo
              </button>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsLogoModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="blue" type="submit">
              Apply Logo
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      {/* Success Confirmation Modal */}
      <ConfirmationModal
        isOpen={isSaveSuccessOpen}
        onClose={() => setIsSaveSuccessOpen(false)}
        onConfirm={() => setIsSaveSuccessOpen(false)}
        title="Organisation Profile Updated"
        message="Your corporate organisation credentials, business identity, and operational address have been successfully updated across the Koolbuy platform."
        confirmText="Done"
        type="info"
      />
    </div>
  );
}
