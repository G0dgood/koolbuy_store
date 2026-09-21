"use client";

import React, { useState } from "react";
import { Icon } from "../../components/Icon";
import { Button } from "../../components/Button";
import { Input, Textarea } from "../../components/Form/Inputs";
import Modal from "../../components/Modal/Modal";
import ModalBody from "../../components/Modal/ModalBody";
import ModalFooter from "../../components/Modal/ModalFooter";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";
import {
  HiBuildingOffice2,
  HiCheckBadge,
  HiGlobeAlt,
  HiEnvelope,
  HiPhone,
  HiMapPin,
  HiShieldCheck,
  HiPencilSquare,
  HiPhoto,
  HiArrowTopRightOnSquare,
} from "react-icons/hi2";

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
    <div className="flex flex-col gap-8 max-w-400 mx-auto pb-12 p-2 sm:p-4">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5">
        <div>
          {/* <div className="flex items-center gap-2.5"> */}
          {/* <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Organisation Profile</h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-brand-blue border border-blue-100">
              <HiCheckBadge className="w-3.5 h-3.5 text-brand-blue" />
              Verified Enterprise
            </span> */}
          {/* </div>
          <p className="text-xs text-gray-500 mt-1">
            Manage your legal business identity, official contact coordinates,
            operational headquarters, and corporate branding
          </p> */}
        </div>

        <div className="flex items-center gap-3">
          {isEditMode ? (
            <>
              <Button
                variant="outline"
                className="text-gray-600"
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
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center relative overflow-hidden">
            {/* Top Accent Pattern */}
            <div className="absolute top-0 inset-x-0 h-24 bg-linear-to-r from-blue-600 via-brand-blue to-sky-500 opacity-90" />

            {/* Logo Avatar */}
            <div className="relative mt-8 mb-4 w-28 h-28 rounded-2xl border-4 border-white overflow-hidden shadow-md bg-white p-2 flex items-center justify-center">
              <img
                src={orgLogo}
                alt="Organisation Logo"
                className="w-full h-full object-contain"
              />
            </div>

            <h2 className="text-lg font-bold text-gray-900">
              {orgData.legalName}
            </h2>
            <span className="text-xs font-semibold text-brand-blue mt-0.5">
              Trading as: {orgData.tradingName}
            </span>

            <div className="w-full border-t border-gray-100 my-5" />

            {/* Quick Credentials List */}
            <div className="w-full flex flex-col gap-3 text-left">
              <div className="flex justify-between items-center text-xs py-1 border-b border-gray-50">
                <span className="text-gray-400 font-medium">
                  Registration No.
                </span>
                <span className="font-mono font-bold text-gray-800">
                  {orgData.rcNumber}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs py-1 border-b border-gray-50">
                <span className="text-gray-400 font-medium">Tax ID (TIN)</span>
                <span className="font-mono font-bold text-gray-800">
                  {orgData.tinNumber}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs py-1 border-b border-gray-50">
                <span className="text-gray-400 font-medium">
                  Industry Sector
                </span>
                <span className="font-medium text-gray-800 text-right">
                  {orgData.industry}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs py-1 border-b border-gray-50">
                <span className="text-gray-400 font-medium">
                  Operating Currency
                </span>
                <span className="font-semibold text-gray-800">
                  {orgData.currency}
                </span>
              </div>
            </div>

            {/* Change Logo Action */}
            <Button
              variant="outline"
              className="mt-5 w-full text-xs font-semibold border-gray-200 text-gray-700 hover:text-brand-blue"
              iconLeft={<HiPhoto className="w-4 h-4" />}
              onClick={() => setIsLogoModalOpen(true)}
            >
              Update Brand Logo
            </Button>
          </div>

          {/* Corporate Channels Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <HiGlobeAlt className="w-4 h-4 text-brand-blue" />
              Corporate Web Presence
            </h3>

            <div className="flex flex-col gap-3 text-xs">
              <a
                href={orgData.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50/70 hover:bg-blue-50/50 hover:text-brand-blue transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <HiGlobeAlt className="w-4 h-4 text-gray-400 group-hover:text-brand-blue" />
                  <span className="font-semibold text-gray-800 group-hover:text-brand-blue">
                    Official Website
                  </span>
                </div>
                <HiArrowTopRightOnSquare className="w-3.5 h-3.5 text-gray-400" />
              </a>

              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/70">
                <span className="text-gray-500 font-medium">
                  Customer Support Email
                </span>
                <a
                  href={`mailto:${orgData.supportEmail}`}
                  className="font-semibold text-gray-800 hover:text-brand-blue"
                >
                  {orgData.supportEmail}
                </a>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/70">
                <span className="text-gray-500 font-medium">
                  Corporate Inquiries
                </span>
                <a
                  href={`mailto:${orgData.primaryEmail}`}
                  className="font-semibold text-gray-800 hover:text-brand-blue"
                >
                  {orgData.primaryEmail}
                </a>
              </div>
            </div>
          </div>

          {/* Compliance & Regulatory Seal */}
          <div className="bg-linear-to-br from-blue-50/80 via-white to-blue-50/40 rounded-2xl border border-blue-100 p-6 flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-blue text-white flex items-center justify-center shrink-0 shadow-xs">
                <HiShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-xs">
                  Corporate Compliance
                </h4>
                <p className="text-[11px] text-gray-500">
                  CAC & Regulatory Status: Active
                </p>
              </div>
            </div>
            <p className="text-[11px] text-gray-600 leading-relaxed pt-1">
              This organization account is verified and authorized for merchant
              trade, BNPL financing, and payment aggregation on Koolbuy.
            </p>
          </div>
        </div>

        {/* Right Column: Detailed Organisation Profile & Coordinates (8 cols) */}
        <div className="xl:col-span-8 flex flex-col gap-8">
          {/* Main Business Details */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-gray-50 pb-4">
              <div className="flex items-center gap-2">
                <HiBuildingOffice2 className="w-5 h-5 text-brand-blue" />
                <h3 className="text-base font-bold text-gray-900">
                  Legal Business Information
                </h3>
              </div>
              <span className="text-xs font-semibold text-gray-400">
                {isEditMode ? "Editing Enabled" : "Read Only"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Registered Legal Entity Name
                </label>
                <Input
                  type="text"
                  value={orgData.legalName}
                  readOnly={!isEditMode}
                  onChange={(e) =>
                    setOrgData({ ...orgData, legalName: e.target.value })
                  }
                  className={`${
                    !isEditMode
                      ? "bg-gray-50 text-gray-800"
                      : "bg-white text-gray-900"
                  } font-semibold text-xs transition-colors`}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Commercial / Trading Name
                </label>
                <Input
                  type="text"
                  value={orgData.tradingName}
                  readOnly={!isEditMode}
                  onChange={(e) =>
                    setOrgData({ ...orgData, tradingName: e.target.value })
                  }
                  className={`${
                    !isEditMode
                      ? "bg-gray-50 text-gray-800"
                      : "bg-white text-gray-900"
                  } font-semibold text-xs transition-colors`}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Company Registration Number (RC)
                </label>
                <Input
                  type="text"
                  value={orgData.rcNumber}
                  readOnly={!isEditMode}
                  onChange={(e) =>
                    setOrgData({ ...orgData, rcNumber: e.target.value })
                  }
                  className={`${
                    !isEditMode
                      ? "bg-gray-50 text-gray-800"
                      : "bg-white text-gray-900"
                  } font-mono font-semibold text-xs transition-colors`}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Tax Identification Number (TIN)
                </label>
                <Input
                  type="text"
                  value={orgData.tinNumber}
                  readOnly={!isEditMode}
                  onChange={(e) =>
                    setOrgData({ ...orgData, tinNumber: e.target.value })
                  }
                  className={`${
                    !isEditMode
                      ? "bg-gray-50 text-gray-800"
                      : "bg-white text-gray-900"
                  } font-mono font-semibold text-xs transition-colors`}
                />
              </div>
            </div>

            {/* Organisation Mission / Description */}
            <div className="flex flex-col gap-2 pt-2">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                Organisation Overview & Purpose
              </label>
              <Textarea
                rows={3}
                value={orgData.description}
                readOnly={!isEditMode}
                onChange={(e) =>
                  setOrgData({ ...orgData, description: e.target.value })
                }
                className={`${
                  !isEditMode
                    ? "bg-gray-50 text-gray-800"
                    : "bg-white text-gray-900"
                } text-xs font-medium leading-relaxed`}
              />
            </div>
          </div>

          {/* Headquarters Location & Operating Coordinates */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 flex flex-col gap-6">
            <div className="flex items-center gap-2 border-b border-gray-50 pb-4">
              <HiMapPin className="w-5 h-5 text-brand-blue" />
              <h3 className="text-base font-bold text-gray-900">
                Corporate Headquarters & Address
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
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
                  className={`${
                    !isEditMode
                      ? "bg-gray-50 text-gray-800"
                      : "bg-white text-gray-900"
                  } font-semibold text-xs`}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                  City
                </label>
                <Input
                  type="text"
                  value={orgData.city}
                  readOnly={!isEditMode}
                  onChange={(e) =>
                    setOrgData({ ...orgData, city: e.target.value })
                  }
                  className={`${
                    !isEditMode
                      ? "bg-gray-50 text-gray-800"
                      : "bg-white text-gray-900"
                  } font-semibold text-xs`}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                  State / Region
                </label>
                <Input
                  type="text"
                  value={orgData.state}
                  readOnly={!isEditMode}
                  onChange={(e) =>
                    setOrgData({ ...orgData, state: e.target.value })
                  }
                  className={`${
                    !isEditMode
                      ? "bg-gray-50 text-gray-800"
                      : "bg-white text-gray-900"
                  } font-semibold text-xs`}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Country
                </label>
                <Input
                  type="text"
                  value={orgData.country}
                  readOnly={!isEditMode}
                  onChange={(e) =>
                    setOrgData({ ...orgData, country: e.target.value })
                  }
                  className={`${
                    !isEditMode
                      ? "bg-gray-50 text-gray-800"
                      : "bg-white text-gray-900"
                  } font-semibold text-xs`}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Postal / ZIP Code
                </label>
                <Input
                  type="text"
                  value={orgData.postalCode}
                  readOnly={!isEditMode}
                  onChange={(e) =>
                    setOrgData({ ...orgData, postalCode: e.target.value })
                  }
                  className={`${
                    !isEditMode
                      ? "bg-gray-50 text-gray-800"
                      : "bg-white text-gray-900"
                  } font-semibold text-xs`}
                />
              </div>
            </div>
          </div>

          {/* Official Communication & Banking Settlement */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 flex flex-col gap-6">
            <div className="flex items-center gap-2 border-b border-gray-50 pb-4">
              <HiPhone className="w-5 h-5 text-brand-blue" />
              <h3 className="text-base font-bold text-gray-900">
                Communication & Settlement Banking
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Official Corporate Telephone
                </label>
                <Input
                  type="text"
                  value={orgData.primaryPhone}
                  readOnly={!isEditMode}
                  onChange={(e) =>
                    setOrgData({ ...orgData, primaryPhone: e.target.value })
                  }
                  className={`${
                    !isEditMode
                      ? "bg-gray-50 text-gray-800"
                      : "bg-white text-gray-900"
                  } font-semibold text-xs`}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Customer Support Toll-Free
                </label>
                <Input
                  type="text"
                  value={orgData.supportPhone}
                  readOnly={!isEditMode}
                  onChange={(e) =>
                    setOrgData({ ...orgData, supportPhone: e.target.value })
                  }
                  className={`${
                    !isEditMode
                      ? "bg-gray-50 text-gray-800"
                      : "bg-white text-gray-900"
                  } font-semibold text-xs`}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Primary Settlement Financial Institution
                </label>
                <Input
                  type="text"
                  value={orgData.bankName}
                  readOnly={!isEditMode}
                  onChange={(e) =>
                    setOrgData({ ...orgData, bankName: e.target.value })
                  }
                  className={`${
                    !isEditMode
                      ? "bg-gray-50 text-gray-800"
                      : "bg-white text-gray-900"
                  } font-semibold text-xs`}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Settlement Account Number
                </label>
                <Input
                  type="text"
                  value={orgData.accountNumber}
                  readOnly={!isEditMode}
                  onChange={(e) =>
                    setOrgData({ ...orgData, accountNumber: e.target.value })
                  }
                  className={`${
                    !isEditMode
                      ? "bg-gray-50 text-gray-800"
                      : "bg-white text-gray-900"
                  } font-mono font-bold text-xs`}
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
            <p className="text-xs text-gray-500 leading-relaxed">
              Enter the image URL for the official organisation logo or select a
              preset Koolbuy brand asset.
            </p>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-600 uppercase">
                Logo Image URL
              </label>
              <Input
                placeholder="https://example.com/logo.png or /images/..."
                value={tempLogoUrl}
                onChange={(e) => setTempLogoUrl(e.target.value)}
                required
              />
            </div>
            <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between text-xs">
              <span className="text-gray-500">Preset Default Logo:</span>
              <button
                type="button"
                className="text-brand-blue font-bold hover:underline"
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
