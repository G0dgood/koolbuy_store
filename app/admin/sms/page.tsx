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
  HiOutlineChatBubbleLeftRight,
  HiOutlineEye,
  HiOutlinePencilSquare,
  HiOutlineCheck,
  HiOutlinePaperAirplane,
  HiOutlineDevicePhoneMobile,
  HiOutlineBell,
} from "react-icons/hi2";

export interface SMSTemplate {
  id: string;
  key: string;
  name: string;
  category: "Orders" | "Security" | "Financing" | "Logistics";
  senderId: string;
  body: string;
  variables: string[];
  lastUpdated: string;
  isActive: boolean;
}

const INITIAL_SMS_TEMPLATES: SMSTemplate[] = [
  {
    id: "sms-1",
    key: "sms_order_confirmed",
    name: "Order Confirmation",
    category: "Orders",
    senderId: "KOOLBUY",
    body: "Hi {{customer_name}}, your KoolBuy order #{{order_id}} for {{total_amount}} is confirmed. Track your solar cooling shipment at {{short_url}}",
    variables: ["{{customer_name}}", "{{order_id}}", "{{total_amount}}", "{{short_url}}"],
    lastUpdated: "Oct 14, 2026",
    isActive: true,
  },
  {
    id: "sms-2",
    key: "sms_dispatch_out",
    name: "Out for Delivery",
    category: "Logistics",
    senderId: "KOOLBUY",
    body: "Your KoolBuy order #{{order_id}} is out for delivery today with {{driver_name}} ({{driver_phone}}). Please ensure someone is available at the address.",
    variables: ["{{order_id}}", "{{driver_name}}", "{{driver_phone}}"],
    lastUpdated: "Oct 12, 2026",
    isActive: true,
  },
  {
    id: "sms-3",
    key: "sms_auth_otp",
    name: "One-Time Password (OTP)",
    category: "Security",
    senderId: "KOOLBUY",
    body: "{{otp_code}} is your KoolBuy verification code. Valid for 10 minutes. Do not share this code with anyone.",
    variables: ["{{otp_code}}"],
    lastUpdated: "Oct 16, 2026",
    isActive: true,
  },
  {
    id: "sms-4",
    key: "sms_bnpl_reminder",
    name: "BNPL Due Reminder",
    category: "Financing",
    senderId: "KOOLBUY",
    body: "Reminder: Your KoolBuy BNPL installment of {{amount}} is due on {{due_date}}. Pay online via {{payment_url}} to prevent service interruption.",
    variables: ["{{amount}}", "{{due_date}}", "{{payment_url}}"],
    lastUpdated: "Oct 08, 2026",
    isActive: true,
  },
  {
    id: "sms-5",
    key: "sms_order_delivered",
    name: "Order Delivered",
    category: "Orders",
    senderId: "KOOLBUY",
    body: "Order #{{order_id}} has been delivered successfully. Thank you for choosing KoolBuy clean energy cooling! Support: 0800-KOOLBUY",
    variables: ["{{order_id}}"],
    lastUpdated: "Oct 05, 2026",
    isActive: true,
  },
  {
    id: "sms-6",
    key: "sms_bnpl_approved",
    name: "BNPL Plan Approved",
    category: "Financing",
    senderId: "KOOLBUY",
    body: "Congratulations {{customer_name}}! Your Pay-Later application for {{product_name}} is approved. Review your repayment schedule: {{portal_url}}",
    variables: ["{{customer_name}}", "{{product_name}}", "{{portal_url}}"],
    lastUpdated: "Sep 30, 2026",
    isActive: true,
  },
];

export default function SMSTemplatesPage() {
  const [templates, setTemplates] = useState<SMSTemplate[]>(INITIAL_SMS_TEMPLATES);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [previewTemplate, setPreviewTemplate] = useState<SMSTemplate | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<SMSTemplate | null>(null);
  const [editBody, setEditBody] = useState("");
  const [editSenderId, setEditSenderId] = useState("KOOLBUY");

  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      const matchSearch =
        search.trim() === "" ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.body.toLowerCase().includes(search.toLowerCase()) ||
        t.key.toLowerCase().includes(search.toLowerCase());

      const matchCategory = selectedCategory === "all" || t.category === selectedCategory;
      const matchStatus =
        selectedStatus === "all" ||
        (selectedStatus === "active" && t.isActive) ||
        (selectedStatus === "inactive" && !t.isActive);

      return matchSearch && matchCategory && matchStatus;
    });
  }, [templates, search, selectedCategory, selectedStatus]);

  const activeCount = templates.filter((t) => t.isActive).length;
  const avgChars = Math.round(
    templates.reduce((acc, curr) => acc + curr.body.length, 0) / (templates.length || 1)
  );

  const handleToggleStatus = (id: string, current: boolean) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isActive: !current } : t))
    );
    toast.success(`SMS template ${!current ? "activated" : "paused"}.`);
  };

  const handleOpenEdit = (t: SMSTemplate) => {
    setEditingTemplate(t);
    setEditBody(t.body);
    setEditSenderId(t.senderId);
  };

  const handleSaveEdit = () => {
    if (!editingTemplate) return;
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === editingTemplate.id
          ? { ...t, body: editBody, senderId: editSenderId, lastUpdated: "Just now" }
          : t
      )
    );
    toast.success(`Updated template "${editingTemplate.name}".`);
    setEditingTemplate(null);
  };

  const handleInsertTag = (tag: string) => {
    setEditBody((prev) => `${prev} ${tag}`);
  };

  const charCount = editBody.length;
  const smsParts = Math.ceil(charCount / 160) || 1;

  return (
    <div className="flex flex-col gap-6 pb-16">
      {/* Action Bar */}
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" size="sm" href="/admin/notifications" iconLeft={<HiOutlineBell className="w-4 h-4 text-brand-orange-text" />}>
          Notifications Log
        </Button>
        <Button
          variant="primary"
          size="sm"
          iconLeft={<HiOutlinePaperAirplane className="w-4 h-4" />}
          onClick={() => toast.success("Test SMS dispatched to verified test device.")}
        >
          Send Test SMS
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard size="sm" title="Total SMS Templates" value={templates.length} periodLabel="Configured alerts" />
        <StatCard size="sm" title="Active" value={activeCount} periodLabel="Enabled for delivery" />
        <StatCard size="sm" title="Avg Length" value={`${avgChars} chars`} periodLabel="1 Part standard rate" />
        <StatCard size="sm" title="Primary Sender ID" value="KOOLBUY" periodLabel="Registered alpha sender" />
      </div>

      {/* Filters */}
      <div className="bg-white border border-light-gray rounded-lg flex flex-col overflow-hidden">
        <div className="p-4 sm:px-6 flex flex-col gap-3 border-b border-light-gray">
          <div className="flex flex-col lg:flex-row gap-3 lg:items-center justify-between">
            <Search
              value={search}
              onChange={(val) => setSearch(val)}
              placeholder="Search template name, body text, or trigger key..."
              maxWidth="max-w-none"
              className="w-full lg:w-96"
            />

            <div className="flex flex-wrap items-center gap-3">
              <div className="w-44">
                <Dropdown
                  options={[
                    { value: "all", label: "All categories" },
                    { value: "Orders", label: "Orders" },
                    { value: "Logistics", label: "Logistics & Delivery" },
                    { value: "Security", label: "Security & OTP" },
                    { value: "Financing", label: "BNPL & Financing" },
                  ]}
                  value={selectedCategory}
                  onChange={(val) => setSelectedCategory(String(val ?? "all"))}
                  placeholder="Category"
                  searchable={false}
                  size="sm"
                />
              </div>

              <div className="w-36">
                <Dropdown
                  options={[
                    { value: "all", label: "All statuses" },
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Paused" },
                  ]}
                  value={selectedStatus}
                  onChange={(val) => setSelectedStatus(String(val ?? "all"))}
                  placeholder="Status"
                  searchable={false}
                  size="sm"
                />
              </div>

              {(search || selectedCategory !== "all" || selectedStatus !== "all") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("all");
                    setSelectedStatus("all");
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* SMS Table */}
        <div className="admin-table-container">
          <table>
            <thead>
              <tr>
                <th>Template Name</th>
                <th>Category</th>
                <th>Sender ID</th>
                <th>Message Content</th>
                <th>Length</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTemplates.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-xs text-faint">
                    No SMS templates match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredTemplates.map((t) => {
                  const parts = Math.ceil(t.body.length / 160) || 1;
                  return (
                    <tr key={t.id} className="hover:bg-off-white/60 transition-colors">
                      <td>
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-brand-charcoal">{t.name}</span>
                          <span className="text-[11px] font-mono text-faint">{t.key}</span>
                        </div>
                      </td>
                      <td>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-off-white text-subtle border border-light-gray">
                          {t.category}
                        </span>
                      </td>
                      <td>
                        <span className="text-[11px] font-mono font-semibold text-brand-charcoal bg-black/[0.04] px-1.5 py-0.5 rounded">
                          {t.senderId}
                        </span>
                      </td>
                      <td>
                        <span className="text-xs text-subtle line-clamp-2 max-w-sm" title={t.body}>
                          {t.body}
                        </span>
                      </td>
                      <td>
                        <span className="text-[11px] text-faint font-medium">
                          {t.body.length} chars ({parts} SMS)
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(t.id, t.isActive)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold cursor-pointer transition-colors ${
                            t.isActive ? "bg-success-soft text-success" : "bg-off-white text-faint border border-light-gray"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${t.isActive ? "bg-success" : "bg-faint"}`} />
                          {t.isActive ? "Active" : "Paused"}
                        </button>
                      </td>
                      <td className="text-right">
                        <div className="inline-flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            iconLeft={<HiOutlineEye className="w-3.5 h-3.5 text-brand-orange-text" />}
                            onClick={() => setPreviewTemplate(t)}
                          >
                            Preview
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            iconLeft={<HiOutlinePencilSquare className="w-3.5 h-3.5" />}
                            onClick={() => handleOpenEdit(t)}
                          >
                            Edit
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Phone Preview Modal */}
      {previewTemplate && (
        <Modal
          isOpen={Boolean(previewTemplate)}
          onClose={() => setPreviewTemplate(null)}
          title={`SMS Preview: ${previewTemplate.name}`}
          size="md"
        >
          <ModalBody className="flex flex-col items-center py-6">
            {/* Phone Shell */}
            <div className="w-72 bg-off-white border-4 border-brand-charcoal rounded-3xl p-4 flex flex-col gap-4 shadow-float">
              <div className="flex flex-col items-center border-b border-light-gray pb-3">
                <span className="w-12 h-1 bg-medium-gray rounded-full mb-3" />
                <span className="text-xs font-semibold text-brand-charcoal">{previewTemplate.senderId}</span>
                <span className="text-[10px] text-faint">Verified Sender • Today 11:28 AM</span>
              </div>

              {/* Message Bubble */}
              <div className="bg-brand-charcoal text-white text-xs p-3.5 rounded-2xl rounded-tl-sm leading-relaxed">
                {previewTemplate.body}
              </div>

              <div className="text-center pt-2">
                <span className="text-[10px] text-faint">
                  {previewTemplate.body.length} characters • {Math.ceil(previewTemplate.body.length / 160)} SMS segment
                </span>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" size="sm" onClick={() => setPreviewTemplate(null)}>
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              iconLeft={<HiOutlinePencilSquare className="w-4 h-4" />}
              onClick={() => {
                const target = previewTemplate;
                setPreviewTemplate(null);
                handleOpenEdit(target);
              }}
            >
              Edit Template
            </Button>
          </ModalFooter>
        </Modal>
      )}

      {/* Edit Modal */}
      {editingTemplate && (
        <Modal
          isOpen={Boolean(editingTemplate)}
          onClose={() => setEditingTemplate(null)}
          title={`Edit SMS Template: ${editingTemplate.name}`}
          size="md"
        >
          <ModalBody className="flex flex-col gap-4 py-4">
            <div>
              <label className="block text-[12px] font-medium text-subtle mb-1.5">Sender ID</label>
              <input
                type="text"
                value={editSenderId}
                onChange={(e) => setEditSenderId(e.target.value.toUpperCase().slice(0, 11))}
                maxLength={11}
                className="w-full h-9 px-3 text-xs font-mono font-normal text-brand-charcoal bg-white border border-light-gray rounded-lg placeholder:text-faint focus:outline-none focus:ring-1 focus:ring-brand-orange/30 focus:border-brand-orange transition-all"
              />
              <span className="text-[11px] text-faint mt-1 block">Maximum 11 alphanumeric characters</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[12px] font-medium text-subtle">
                  Merge Variables (click to insert)
                </label>
              </div>
              <div className="flex flex-wrap gap-1.5 p-2 bg-off-white rounded-lg border border-light-gray">
                {editingTemplate.variables.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleInsertTag(tag)}
                    className="text-[11px] font-mono px-2 py-0.5 rounded bg-white hover:bg-brand-orange-soft text-brand-charcoal hover:text-brand-orange-text border border-light-gray transition-colors cursor-pointer"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[12px] font-medium text-subtle">SMS Body Text</label>
                <span className={`text-[11px] font-medium ${charCount > 160 ? "text-brand-orange-text" : "text-faint"}`}>
                  {charCount} / 160 chars ({smsParts} {smsParts === 1 ? "SMS" : "SMS parts"})
                </span>
              </div>
              <textarea
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                rows={4}
                className="w-full text-xs font-normal text-brand-charcoal p-3 bg-white border border-light-gray rounded-lg placeholder:text-faint focus:outline-none focus:ring-1 focus:ring-brand-orange/30 focus:border-brand-orange transition-all leading-relaxed resize-none"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" size="sm" onClick={() => setEditingTemplate(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              iconLeft={<HiOutlineCheck className="w-4 h-4" />}
              onClick={handleSaveEdit}
            >
              Save SMS Template
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
}
