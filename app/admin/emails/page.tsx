"use client";

import React, { useState } from "react";
import { Icon } from "../../components/Icon";
import { Button } from "../../components/Button";
import { Input } from "../../components/Form/Inputs";
import Checkbox from "../../components/Checkbox";
import {
  HiOutlineEnvelope,
  HiOutlinePaperAirplane,
  HiOutlineCheck,
  HiOutlineClipboardDocument,
  HiOutlineMagnifyingGlass,
  HiOutlineSparkles,
} from "react-icons/hi2";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  enabled: boolean;
  category: string;
}

const initialTemplates: EmailTemplate[] = [
  {
    id: "new_vendor_signup",
    name: "New Vendor Signup",
    subject: "Welcome to Koolbuy Merchant Network - Complete Your Verification",
    content: `Dear {vendor_name},

Thank you for registering your business with Koolbuy. We are excited to partner with you to distribute high-efficiency clean energy cooling appliances.

Your application details:
Business Name: {title}
Description: {description}
Registered Email: {email}
Contact Phone: {phone_no}
Warehouse Address: {address}

Our Merchant Operations team is currently reviewing your uploaded CAC credentials. You can access your vendor dashboard at {website}/vendor/login.

Warm regards,
Koolbuy Merchant Team`,
    enabled: true,
    category: "Vendor",
  },
  {
    id: "verify_mail",
    name: "Verify Mail",
    subject: "Please Verify Your Email Address - Koolbuy",
    content: `Hello {title},

Thank you for creating an account on Koolbuy. Please confirm your email address ({email}) to activate your access and ensure security.

Click here to verify your email:
{website}/auth/verify-email?token=EXAMPLE_TOKEN

If you did not initiate this request, please ignore this email or contact support at {phone_no}.

Best regards,
Koolbuy Security Team`,
    enabled: true,
    category: "Auth",
  },
  {
    id: "forgot_password",
    name: "Forgot Password",
    subject: "Reset Your Koolbuy Account Password",
    content: `Hello {title},

We received a request to reset your password for your account associated with {email}.

To reset your password, visit:
{website}/auth/reset-password?token=EXAMPLE_TOKEN

This link is valid for the next 60 minutes. If you did not request a password reset, please contact {phone_no} immediately.

The Koolbuy Security Team`,
    enabled: true,
    category: "Auth",
  },
  {
    id: "refund",
    name: "Refund",
    subject: "Refund Notification for Your Order - Koolbuy",
    content: `Dear {title},

We have processed a refund for your order. 

Details:
Account: {email}
Description: {description}
Delivery Address: {address}

The funds have been credited back via your original payment method. Depending on your bank, it may take 2-5 business days to reflect.

If you have questions, please reach us at {phone_no} or visit {website}.

Sincerely,
Koolbuy Finance`,
    enabled: true,
    category: "Orders",
  },
  {
    id: "orders",
    name: "Orders",
    subject: "Your Koolbuy Order Confirmation",
    content: `Hello {title},

Thank you for your purchase from Koolbuy! Your order has been successfully placed.

Order Summary:
Description: {description}
Customer Email: {email}
Delivery Destination: {address}
Support Contact: {phone_no}

We are preparing your cooling equipment for logistics dispatch. Track your delivery status anytime at {website}/orders.

Thank you for choosing clean cooling!
Koolbuy Team`,
    enabled: true,
    category: "Orders",
  },
  {
    id: "success_email",
    name: "SuccessEmail",
    subject: "Transaction Successful - Koolbuy Payment Receipt",
    content: `Dear {title},

Your payment was successfully processed!

Transaction Information:
Description: {description}
Receipt issued to: {email}
Registered Phone: {phone_no}
Merchant / Vendor: {vendor_name}

Visit {website}/account for your official VAT invoice.

Warm regards,
Koolbuy Accounts`,
    enabled: true,
    category: "Payments",
  },
  {
    id: "fail_email",
    name: "FailEmail",
    subject: "Transaction Failed - Action Required",
    content: `Dear {title},

We were unable to process your payment for {description}.

No funds were deducted from your account. You can retry your transaction using an alternative payment gateway or card at {website}/checkout.

If you continue experiencing difficulties, contact our customer hotline at {phone_no} or email {email}.

Koolbuy Support`,
    enabled: true,
    category: "Payments",
  },
  {
    id: "send_referral_code",
    name: "SendReferralCode",
    subject: "Share Koolbuy & Earn Rewards - Your Referral Code Inside",
    content: `Hi {title},

Share clean solar refrigeration with friends, family, and business owners!

Your exclusive referral code is ready. When your referee orders a freezer on {website}, you both earn instant discounts.

Registered email: {email}
Support: {phone_no}

Start sharing today!
Koolbuy Rewards`,
    enabled: true,
    category: "Marketing",
  },
  {
    id: "new_customer_signup",
    name: "NewCustomerSignup",
    subject: "Welcome to Koolbuy - Nigeria's Clean Cooling Store",
    content: `Welcome {title}!

Thank you for joining Koolbuy. Discover Africa's most reliable solar chest freezers and commercial display refrigerators with up to 72 hours cold retention.

Your Account:
Email: {email}
Registered Phone: {phone_no}
Primary Delivery: {address}

Browse our full catalog at {website}.

Cheers,
The Koolbuy Team`,
    enabled: true,
    category: "Customer",
  },
  {
    id: "gift_card",
    name: "GiftCard",
    subject: "You've Received a Koolbuy Gift Voucher!",
    content: `Congratulations {title},

You have been gifted a Koolbuy digital shopping card!

Voucher Details:
Description: {description}
Delivered to: {email}

Redeem your voucher code directly at checkout on {website}. For assistance, call our support center at {phone_no}.

Happy Shopping,
Koolbuy`,
    enabled: true,
    category: "Marketing",
  },
  {
    id: "pickup_delivery_orders",
    name: "PickupDeliveryOrders",
    subject: "Your Koolbuy Equipment is Ready for Pickup / Delivery",
    content: `Dear {title},

Your cooling equipment order is ready!

Dispatch Details:
Description: {description}
Fulfillment Address / Hub: {address}
Vendor Partner: {vendor_name}
Customer Phone: {phone_no}

Please present your delivery code or government ID upon receiving your item. You can inspect delivery milestones live on {website}.

Best regards,
Koolbuy Logistics`,
    enabled: true,
    category: "Logistics",
  },
];

const availableTags = [
  "{vendor_name}",
  "{title}",
  "{description}",
  "{email}",
  "{phone_no}",
  "{address}",
  "{website}",
];

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>(initialTemplates);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    initialTemplates[0].id,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedTag, setCopiedTag] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Active template
  const currentTemplate =
    templates.find((t) => t.id === selectedTemplateId) || templates[0];

  // Filtered templates list for the Left Card
  const filteredTemplates = templates.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase().trim()),
  );

  const handleUpdateCurrent = (updates: Partial<EmailTemplate>) => {
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

  return (
    <div className="flex flex-col gap-6 mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5">
        <div>
          {/* <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Email Templates
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Configure automated transactional notification emails, dynamic tags,
            and content subjects
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
            <span>Save Template</span>
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
        {/* Card 1: List (Templates Name) */}
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
              Templates Name
            </span>

            {/* Quick Search */}
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-[#00BCD4]"
              />
              <HiOutlineMagnifyingGlass className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Templates Items List */}
          <div className="flex flex-col divide-y divide-gray-50 max-h-155 overflow-y-auto">
            {filteredTemplates.map((item) => {
              const isSelected = item.id === currentTemplate.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedTemplateId(item.id)}
                  className={`flex items-center justify-between p-3.5 text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-brand-blue-light/60 border-l-4 border-l-[#00BCD4] text-brand-blue font-bold"
                      : "hover:bg-gray-50 text-gray-700 font-medium"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <HiOutlineEnvelope
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

        {/* Card 2: Subjects (Template Editor) */}
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

          {/* Editor Form */}
          <div className="p-5 sm:p-6 flex flex-col gap-5">
            {/* Subject Input */}
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
                placeholder="Enter email subject line..."
                className="w-full text-xs font-semibold px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#00BCD4] text-gray-800"
              />
            </div>

            {/* Content Textarea */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Content
                </label>
                <span className="text-[11px] text-gray-400">
                  Plain text & variable tags supported
                </span>
              </div>
              <textarea
                rows={12}
                value={currentTemplate.content}
                onChange={(e) =>
                  handleUpdateCurrent({ content: e.target.value })
                }
                placeholder="Write template message content..."
                className="w-full text-xs font-mono p-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#00BCD4] text-gray-800 leading-relaxed"
              />
            </div>

            {/* Enabled Checkbox & Tags Section */}
            <div className="flex flex-col gap-3 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="enabled-checkbox"
                  checked={currentTemplate.enabled}
                  onChange={(e) =>
                    handleUpdateCurrent({ enabled: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-[#00BCD4] focus:ring-[#00BCD4] accent-[#00BCD4] cursor-pointer"
                />
                <label
                  htmlFor="enabled-checkbox"
                  className="text-xs font-bold text-gray-700 cursor-pointer"
                >
                  Enabled
                </label>
              </div>

              {/* Tags Section */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-600">
                    Tags:-
                  </span>
                  <span className="text-[10px] text-gray-400">
                    Click tag to insert into content
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {availableTags.map((tag) => (
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
