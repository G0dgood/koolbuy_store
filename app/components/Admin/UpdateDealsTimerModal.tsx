"use client";

import React, { useState } from "react";
import Modal from "../Modal/Modal";
import { Button } from "../Button";
import { Input } from "../Form/Inputs";
import { HiOutlineInformationCircle } from "react-icons/hi2";

interface UpdateDealsTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues?: {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
  onUpdate: (values: { days: string; hours: string; minutes: string; seconds: string }) => void;
}

export function UpdateDealsTimerModal({ isOpen, onClose, initialValues, onUpdate }: UpdateDealsTimerModalProps) {
  const [formData, setFormData] = useState({
    days: initialValues?.days || "04",
    hours: initialValues?.hours || "13",
    minutes: initialValues?.minutes || "34",
    seconds: initialValues?.seconds || "56",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    // Ensure only numbers and max length of 2 (except days)
    const sanitized = value.replace(/[^0-9]/g, "");
    if (field !== "days" && sanitized.length > 2) return;
    setFormData(prev => ({ ...prev, [field]: sanitized }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Configure Offer Countdown" size="md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {/* Help Text */}
        <div className="bg-brand-orange-soft border border-brand-orange/15 rounded-lg p-4 flex gap-3">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-brand-orange-text shrink-0">
            <HiOutlineInformationCircle size={20} />
          </div>
          <p className="text-[11px] font-semibold text-brand-orange-text leading-relaxed">
            Set the remaining time for the active "Deals and Offers" section. This will be visible on the home page.
          </p>
        </div>

        {/* Input Grid */}
        <div className="grid grid-cols-4 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-medium text-subtle px-1">Days</label>
            <Input
              placeholder="00"
              value={formData.days}
              onChange={(e) => handleInputChange("days", e.target.value)}
              className="text-center font-semibold text-lg h-14 !rounded-lg"
              maxLength={3}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-medium text-subtle px-1">Hours</label>
            <Input
              placeholder="00"
              value={formData.hours}
              onChange={(e) => handleInputChange("hours", e.target.value)}
              className="text-center font-semibold text-lg h-14 !rounded-lg"
              maxLength={2}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-medium text-subtle px-1">Min</label>
            <Input
              placeholder="00"
              value={formData.minutes}
              onChange={(e) => handleInputChange("minutes", e.target.value)}
              className="text-center font-semibold text-lg h-14 !rounded-lg"
              maxLength={2}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-medium text-subtle px-1">Sec</label>
            <Input
              placeholder="00"
              value={formData.seconds}
              onChange={(e) => handleInputChange("seconds", e.target.value)}
              className="text-center font-semibold text-lg h-14 !rounded-lg"
              maxLength={2}
            />
          </div>
        </div>

        {/* Summary Preview */}
        <div className="flex items-center justify-between p-4 bg-off-white rounded-lg border border-light-gray">
          <span className="text-[12px] font-medium text-subtle">Preview display:</span>
          <div className="flex gap-2">
            <div className="flex flex-col items-center justify-center w-10 h-10 bg-white rounded-lg border border-light-gray">
              <span className="text-xs font-semibold text-brand-charcoal">{formData.days || "00"}</span>
              <span className="text-[11px] text-faint font-medium">Days</span>
            </div>
            <div className="flex flex-col items-center justify-center w-10 h-10 bg-white rounded-lg border border-light-gray">
              <span className="text-xs font-semibold text-brand-charcoal">{formData.hours || "00"}</span>
              <span className="text-[11px] text-faint font-medium">Hrs</span>
            </div>
            <div className="flex flex-col items-center justify-center w-10 h-10 bg-white rounded-lg border border-light-gray">
              <span className="text-xs font-semibold text-brand-charcoal">{formData.minutes || "00"}</span>
              <span className="text-[11px] text-faint font-medium">Min</span>
            </div>
            <div className="flex flex-col items-center justify-center w-10 h-10 bg-white rounded-lg border border-light-gray">
              <span className="text-xs font-semibold text-brand-charcoal">{formData.seconds || "00"}</span>
              <span className="text-[11px] text-faint font-medium">Sec</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-6 border-t border-light-gray">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 h-9 text-[12px] font-semibold border-light-gray text-faint hover:text-brand-charcoal"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-[2] h-9 text-[12px] font-semibold"
          >
            Establish timer
          </Button>
        </div>
      </form>
    </Modal>
  );
}
