"use client";

import React, { useState } from "react";
import { Icon } from "../../components/Icon";
import { Button } from "../../components/Button";
import { Input } from "../../components/Form/Inputs";
import {
  HiOutlineChatBubbleBottomCenterText,
  HiOutlineCheck,
  HiOutlineClipboardDocument,
  HiOutlineMagnifyingGlass,
  HiOutlineSparkles,
} from "react-icons/hi2";

interface SMSTemplate {
  id: string;
  name: string;
  subject: string;
  templateId: string;
  content: string;
  enabled: boolean;
  tags: string[];
}

const initialSMSTemplates: SMSTemplate[] = [
  {
    id: "order_placed_successfully",
    name: "Order Placed Successfully",
    subject: "Order Placed Successfully",
    templateId: "TMPL_ORD_PLACED_01",
    content:
      "Hi {user_name}, your Koolbuy order {order_number} of {amount} has been placed successfully. Thank you for shopping with us.",
    enabled: true,
    tags: ["{user_name}", "{amount}", "{order_number}"],
  },
  {
    id: "otp_sms_vendor_login",
    name: "Otp Sms For Vendor Login",
    subject: "Vendor Portal Login OTP",
    templateId: "TMPL_VND_OTP_02",
    content:
      "Dear {user_name}, your vendor login OTP is {otp}. Valid for 5 minutes. Do not share this code with anyone.",
    enabled: true,
    tags: ["{user_name}", "{otp}", "{website}"],
  },
  {
    id: "otp_sms_user_signup",
    name: "Otp Sms For User Signup",
    subject: "Koolbuy Registration Verification",
    templateId: "TMPL_USR_SGN_03",
    content:
      "Welcome to Koolbuy! Your account signup OTP is {otp}. Enter this code to verify your phone number.",
    enabled: true,
    tags: ["{user_name}", "{otp}"],
  },
  {
    id: "otp_sms_user_login",
    name: "Otp Sms For User Login",
    subject: "Customer Login Security OTP",
    templateId: "TMPL_USR_LOG_04",
    content:
      "Hello {user_name}, your Koolbuy login verification OTP is {otp}. It expires in 10 minutes.",
    enabled: true,
    tags: ["{user_name}", "{otp}"],
  },
  {
    id: "user_signup_sms",
    name: "User Signup Sms",
    subject: "Welcome to Koolbuy Clean Cooling",
    templateId: "TMPL_USR_WLC_05",
    content:
      "Hi {user_name}, welcome to Koolbuy! Access affordable solar freezers and flexible financing anytime on {website}.",
    enabled: true,
    tags: ["{user_name}", "{website}"],
  },
  {
    id: "otp_to_verify_account",
    name: "Otp to verify Account",
    subject: "Account Verification OTP",
    templateId: "TMPL_ACC_VER_06",
    content:
      "Use verification code {otp} to confirm your Koolbuy account details. Valid for 10 minutes.",
    enabled: true,
    tags: ["{user_name}", "{otp}"],
  },
  {
    id: "order_tracking",
    name: "Order Tracking",
    subject: "Koolbuy Order Tracking Update",
    templateId: "TMPL_ORD_TRK_07",
    content:
      "Hello {user_name}, your order {order_number} has been dispatched. Track delivery live: {tracking_url}",
    enabled: true,
    tags: ["{user_name}", "{order_number}", "{tracking_url}"],
  },
  {
    id: "otp_sms_for_tracking_url",
    name: "Otp Sms For Tracking url",
    subject: "Live Tracking Security Verification",
    templateId: "TMPL_TRK_URL_08",
    content:
      "Use OTP {otp} to access the secure live GPS delivery tracking portal for order {order_number}.",
    enabled: true,
    tags: ["{user_name}", "{otp}", "{order_number}"],
  },
  {
    id: "order_canceled",
    name: "Order Canceled",
    subject: "Order Cancellation Confirmation",
    templateId: "TMPL_ORD_CNC_09",
    content:
      "Hi {user_name}, your order {order_number} for {amount} has been canceled. Your refund is being processed.",
    enabled: true,
    tags: ["{user_name}", "{amount}", "{order_number}"],
  },
  {
    id: "order_completed",
    name: "Order Completed",
    subject: "Order Delivery Completed",
    templateId: "TMPL_ORD_CMP_10",
    content:
      "Dear {user_name}, order {order_number} of {amount} has been delivered and completed. Enjoy your cooling equipment!",
    enabled: true,
    tags: ["{user_name}", "{amount}", "{order_number}"],
  },
  {
    id: "ride_booked",
    name: "Ride Booked",
    subject: "Logistics Vehicle Booked",
    templateId: "TMPL_LOG_BOK_11",
    content:
      "Hello {user_name}, logistics vehicle has been scheduled for delivery of order {order_number}. Driver contact: {phone_no}.",
    enabled: true,
    tags: ["{user_name}", "{order_number}", "{phone_no}"],
  },
  {
    id: "order_canceled_vendor",
    name: "Order Canceled (Vendor)",
    subject: "Vendor Order Cancellation Alert",
    templateId: "TMPL_VND_CNC_12",
    content:
      "Attention {vendor_name}, customer order {order_number} ({amount}) has been canceled. Do not dispatch this package.",
    enabled: true,
    tags: ["{vendor_name}", "{amount}", "{order_number}"],
  },
];

const generalAvailableTags = [
  "{user_name}",
  "{amount}",
  "{order_number}",
  "{otp}",
  "{tracking_url}",
  "{vendor_name}",
  "{phone_no}",
  "{website}",
];

export default function SMSTemplatesPage() {
  const [templates, setTemplates] =
    useState<SMSTemplate[]>(initialSMSTemplates);
  const [selectedId, setSelectedId] = useState<string>(
    initialSMSTemplates[0].id,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedTag, setCopiedTag] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const currentTemplate =
    templates.find((t) => t.id === selectedId) || templates[0];

  const filteredList = templates.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase().trim()),
  );

  const handleUpdateCurrent = (updates: Partial<SMSTemplate>) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === currentTemplate.id ? { ...t, ...updates } : t)),
    );
  };

  const handleCopyTag = (tag: string) => {
    navigator.clipboard.writeText(tag);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 2000);
  };

  const handleInsertTag = (tag: string) => {
    handleUpdateCurrent({
      content: currentTemplate.content + " " + tag,
    });
  };

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Calculate SMS segments (160 characters per segment standard GSM)
  const charCount = currentTemplate.content.length;
  const segments = Math.ceil(charCount / 160) || 1;

  return (
    <div className="flex flex-col gap-6 mx-auto pb-16">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5">
        <div>
          {/* <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            SMS Templates
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Configure automated SMS notifications, OTP authentication codes, and
            DLT template IDs
          </p> */}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
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

      {/* Save Success Banner */}
      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg flex items-center justify-between text-xs font-semibold animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <HiOutlineSparkles className="w-4 h-4 text-emerald-600" />
            <span>
              Template <strong>{currentTemplate.name}</strong> saved
              successfully!
            </span>
          </div>
          <button onClick={() => setSaveSuccess(false)} className="font-bold">
            ✕
          </button>
        </div>
      )}

      {/* The Two Cards: List and Subjects */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Card 1: List (Template Name) */}
        <div className="lg:col-span-4 bg-white rounded-lg border border-gray-100 shadow-2xs overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex flex-col gap-3 bg-gray-50/50">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#1D3557] uppercase tracking-wider">
                List
              </h2>
              <span className="text-xs font-medium text-gray-400">
                {templates.length} Templates
              </span>
            </div>

            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Template Name
            </span>

            {/* Quick Search Box */}
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search template name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-[#00BCD4]"
              />
              <HiOutlineMagnifyingGlass className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* List Items */}
          <div className="flex flex-col divide-y divide-gray-50 max-h-160 overflow-y-auto">
            {filteredList.map((item) => {
              const isSelected = item.id === currentTemplate.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className={`flex items-center justify-between p-3.5 text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-brand-blue-light/60 border-l-4 border-l-[#00BCD4] text-brand-blue font-bold"
                      : "hover:bg-gray-50 text-gray-700 font-medium"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <HiOutlineChatBubbleBottomCenterText
                      className={`w-4 h-4 shrink-0 ${
                        isSelected ? "text-[#00BCD4]" : "text-gray-400"
                      }`}
                    />
                    <span className="text-xs truncate">{item.name}</span>
                  </div>

                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ml-2 ${
                      item.enabled
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {item.enabled ? "Active" : "Disabled"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Card 2: Subjects (SMS Editor) */}
        <div className="lg:col-span-8 bg-white rounded-lg border border-gray-100 shadow-2xs overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div>
              <h2 className="text-sm font-bold text-[#1D3557] uppercase tracking-wider">
                Subjects
              </h2>
              <span className="text-xs text-gray-400 font-medium">
                Editing:{" "}
                <strong className="text-gray-700">
                  {currentTemplate.name}
                </strong>
              </span>
            </div>

            {/* Enabled Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={currentTemplate.enabled}
                onChange={(e) =>
                  handleUpdateCurrent({ enabled: e.target.checked })
                }
                className="w-4 h-4 rounded text-[#00BCD4] focus:ring-[#00BCD4] accent-[#00BCD4] cursor-pointer"
              />
              <span className="text-xs font-bold text-gray-700">Enabled</span>
            </label>
          </div>

          {/* Form */}
          <div className="p-5 sm:p-6 flex flex-col gap-5">
            {/* Subject Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                Subject
              </label>
              <input
                type="text"
                value={currentTemplate.subject}
                onChange={(e) =>
                  handleUpdateCurrent({ subject: e.target.value })
                }
                placeholder="Enter subject..."
                className="w-full text-xs font-semibold px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#00BCD4] text-gray-800"
              />
            </div>

            {/* Template Id Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                Template Id
              </label>
              <input
                type="text"
                value={currentTemplate.templateId}
                onChange={(e) =>
                  handleUpdateCurrent({ templateId: e.target.value })
                }
                placeholder="Enter SMS gateway template ID..."
                className="w-full text-xs font-mono px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#00BCD4] text-gray-800"
              />
            </div>

            {/* Content Field */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Content
                </label>
                <span className="text-[11px] text-gray-400 font-mono">
                  {charCount} chars ({segments} SMS{" "}
                  {segments > 1 ? "segments" : "segment"})
                </span>
              </div>
              <textarea
                rows={6}
                value={currentTemplate.content}
                onChange={(e) =>
                  handleUpdateCurrent({ content: e.target.value })
                }
                placeholder="Write SMS message content..."
                className="w-full text-xs font-mono p-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#00BCD4] text-gray-800 leading-relaxed"
              />
            </div>

            {/* Tags Section */}
            <div className="flex flex-col gap-2.5 pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-600">Tags:-</span>
                <span className="text-[10px] text-gray-400">
                  Click tag to insert into content
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {generalAvailableTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleInsertTag(tag)}
                    title={`Click to insert ${tag}`}
                    className="group inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono bg-gray-100 hover:bg-[#00BCD4]/10 hover:text-[#00BCD4] border border-gray-200 transition-colors cursor-pointer text-gray-700"
                  >
                    <span>{tag}</span>
                    <HiOutlineClipboardDocument
                      className="w-3 h-3 text-gray-400 group-hover:text-[#00BCD4]"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyTag(tag);
                      }}
                    />
                  </button>
                ))}
              </div>

              {copiedTag && (
                <span className="text-[10px] font-semibold text-emerald-600 animate-in fade-in duration-150">
                  Copied {copiedTag} to clipboard!
                </span>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
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
        </div>
      </div>
    </div>
  );
}
