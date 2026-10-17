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
  HiOutlineEnvelope,
  HiOutlineEye,
  HiOutlinePencilSquare,
  HiOutlineCheck,
  HiOutlinePaperAirplane,
  HiOutlineSparkles,
  HiOutlineTag,
  HiOutlineBell,
} from "react-icons/hi2";

export interface EmailTemplate {
  id: string;
  key: string;
  name: string;
  category: "Orders" | "Financing" | "Security" | "Marketing" | "Vendors";
  subject: string;
  variables: string[];
  lastUpdated: string;
  isActive: boolean;
  bodyPreview: string;
  bodyHtml: string;
}

const INITIAL_EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: "tpl-1",
    key: "order_confirmation",
    name: "Order Confirmed & Payment Received",
    category: "Orders",
    subject: "Your KoolBuy Order #{{order_id}} is confirmed!",
    variables: ["{{customer_name}}", "{{order_id}}", "{{total_amount}}", "{{items_summary}}", "{{delivery_address}}"],
    lastUpdated: "Oct 14, 2026",
    isActive: true,
    bodyPreview: "Hello {{customer_name}}, thank you for shopping with KoolBuy. We've received your payment of {{total_amount}} for order #{{order_id}}.",
    bodyHtml: `
      <div style="font-family: 'Work Sans', sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; color: #050711; background-color: #ffffff;">
        <div style="border-bottom: 2px solid #F57E16; padding-bottom: 16px; margin-bottom: 24px;">
          <h2 style="color: #F57E16; margin: 0; font-size: 22px;">KoolBuy Order Confirmed</h2>
        </div>
        <p>Hello <strong>{{customer_name}}</strong>,</p>
        <p>Thank you for choosing KoolBuy. Your order <strong>#{{order_id}}</strong> has been confirmed and is currently being prepared for dispatch.</p>
        <div style="background-color: #F8F9FA; border: 1px solid #E9ECEF; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <p style="margin: 0 0 8px 0; font-size: 13px; color: #495057;"><strong>Amount Paid:</strong> {{total_amount}}</p>
          <p style="margin: 0 0 8px 0; font-size: 13px; color: #495057;"><strong>Delivery Address:</strong> {{delivery_address}}</p>
          <p style="margin: 0; font-size: 13px; color: #495057;"><strong>Summary:</strong> {{items_summary}}</p>
        </div>
        <p style="font-size: 13px; color: #6C757D;">You will receive another notification with tracking details as soon as our courier collects your shipment.</p>
      </div>
    `,
  },
  {
    id: "tpl-2",
    key: "order_dispatched",
    name: "Order Dispatched / In Transit",
    category: "Orders",
    subject: "Good news! Your order #{{order_id}} is on the way",
    variables: ["{{customer_name}}", "{{order_id}}", "{{driver_name}}", "{{driver_phone}}", "{{tracking_url}}"],
    lastUpdated: "Oct 12, 2026",
    isActive: true,
    bodyPreview: "Your package is on its way! Driver {{driver_name}} has picked up order #{{order_id}} and will arrive shortly.",
    bodyHtml: `
      <div style="font-family: 'Work Sans', sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; color: #050711;">
        <h2 style="color: #050711; font-size: 20px;">Your Order is On the Way!</h2>
        <p>Hi {{customer_name}}, your solar cooling equipment for order #{{order_id}} is out for delivery with our verified logistics team.</p>
        <p><strong>Courier details:</strong> {{driver_name}} ({{driver_phone}})</p>
        <div style="margin: 24px 0;">
          <a href="{{tracking_url}}" style="background-color: #050711; color: #ffffff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 13px;">Track Delivery Live</a>
        </div>
      </div>
    `,
  },
  {
    id: "tpl-3",
    key: "bnpl_approved",
    name: "BNPL Application Approved",
    category: "Financing",
    subject: "Congratulations! Your KoolBuy BNPL application is approved",
    variables: ["{{customer_name}}", "{{credit_limit}}", "{{product_name}}", "{{monthly_installment}}", "{{next_due_date}}"],
    lastUpdated: "Oct 15, 2026",
    isActive: true,
    bodyPreview: "Great news! Your Buy Now Pay Later installment plan for {{product_name}} has been approved with a monthly installment of {{monthly_installment}}.",
    bodyHtml: `
      <div style="font-family: 'Work Sans', sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; color: #050711;">
        <h2 style="color: #6C8B7D; font-size: 22px;">BNPL Facility Approved</h2>
        <p>Dear {{customer_name}},</p>
        <p>We are delighted to inform you that your installment financing request for <strong>{{product_name}}</strong> has been approved.</p>
        <p>Your monthly repayment amount is <strong>{{monthly_installment}}</strong>, with the first installment due on <strong>{{next_due_date}}</strong>.</p>
      </div>
    `,
  },
  {
    id: "tpl-4",
    key: "bnpl_repayment_reminder",
    name: "BNPL Payment Due Reminder",
    category: "Financing",
    subject: "Reminder: Upcoming installment for {{product_name}} due in 3 days",
    variables: ["{{customer_name}}", "{{installment_amount}}", "{{due_date}}", "{{payment_link}}"],
    lastUpdated: "Oct 08, 2026",
    isActive: true,
    bodyPreview: "Friendly reminder that your monthly KoolBuy installment of {{installment_amount}} is scheduled for {{due_date}}.",
    bodyHtml: `
      <div style="font-family: 'Work Sans', sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; color: #050711;">
        <h2 style="color: #F57E16; font-size: 20px;">Payment Reminder</h2>
        <p>Hello {{customer_name}}, this is a quick reminder that your next cooling equipment installment of <strong>{{installment_amount}}</strong> is due on <strong>{{due_date}}</strong>.</p>
        <a href="{{payment_link}}" style="display: inline-block; background-color: #F57E16; color: #ffffff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600;">Pay Now Securely</a>
      </div>
    `,
  },
  {
    id: "tpl-5",
    key: "auth_otp",
    name: "Sign-in Verification Code (OTP)",
    category: "Security",
    subject: "{{otp_code}} is your KoolBuy security verification code",
    variables: ["{{otp_code}}", "{{expiry_minutes}}", "{{user_ip}}"],
    lastUpdated: "Oct 16, 2026",
    isActive: true,
    bodyPreview: "Use {{otp_code}} to verify your sign-in to your KoolBuy account. Code expires in {{expiry_minutes}} minutes.",
    bodyHtml: `
      <div style="font-family: 'Work Sans', sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; color: #050711; text-align: center;">
        <h2 style="font-size: 20px;">Security Verification Code</h2>
        <p style="color: #495057;">Use this one-time code to complete your sign-in.</p>
        <div style="background-color: #FEF1E6; border: 1px dashed #F57E16; border-radius: 8px; padding: 18px; margin: 20px auto; max-width: 240px;">
          <span style="font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #B85A0A;">{{otp_code}}</span>
        </div>
        <p style="font-size: 12px; color: #6C757D;">This code is valid for {{expiry_minutes}} minutes. Never share this code with anyone.</p>
      </div>
    `,
  },
  {
    id: "tpl-6",
    key: "welcome_customer",
    name: "Welcome to KoolBuy Marketplace",
    category: "Marketing",
    subject: "Welcome to KoolBuy, {{customer_name}}! Explore clean solar refrigeration",
    variables: ["{{customer_name}}", "{{explore_link}}", "{{support_email}}"],
    lastUpdated: "Oct 01, 2026",
    isActive: true,
    bodyPreview: "Welcome to KoolBuy! We bring energy-efficient, solar-powered refrigeration directly to your home and business.",
    bodyHtml: `
      <div style="font-family: 'Work Sans', sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; color: #050711;">
        <h2 style="color: #050711; font-size: 22px;">Welcome to KoolBuy!</h2>
        <p>Dear {{customer_name}}, welcome aboard Nigeria's premier clean-energy refrigeration marketplace.</p>
        <p>Whether you're stocking fresh produce or keeping dairy chilled, our IoT-monitored freezers keep working even during power outages.</p>
      </div>
    `,
  },
  {
    id: "tpl-7",
    key: "vendor_approved",
    name: "Vendor Registration Approved",
    category: "Vendors",
    subject: "Welcome to the KoolBuy Merchant Network",
    variables: ["{{vendor_name}}", "{{merchant_portal_link}}", "{{account_manager}}"],
    lastUpdated: "Sep 28, 2026",
    isActive: true,
    bodyPreview: "Congratulations! Your application to become a certified KoolBuy merchant has been verified and approved.",
    bodyHtml: `
      <div style="font-family: 'Work Sans', sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; color: #050711;">
        <h2 style="color: #6C8B7D; font-size: 22px;">Merchant Verification Approved</h2>
        <p>Dear {{vendor_name}},</p>
        <p>Your business credentials have been successfully authenticated by our compliance desk. You can now publish your cooling inventory to our storefront.</p>
      </div>
    `,
  },
  {
    id: "tpl-8",
    key: "refund_processed",
    name: "Refund Processed Successfully",
    category: "Orders",
    subject: "Refund update for Order #{{order_id}}",
    variables: ["{{customer_name}}", "{{order_id}}", "{{refund_amount}}", "{{payment_method}}", "{{reference}}"],
    lastUpdated: "Oct 11, 2026",
    isActive: false,
    bodyPreview: "Your refund of {{refund_amount}} for order #{{order_id}} has been disbursed to your {{payment_method}}.",
    bodyHtml: `
      <div style="font-family: 'Work Sans', sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; color: #050711;">
        <h2 style="font-size: 20px;">Refund Completed</h2>
        <p>Hi {{customer_name}}, your refund of <strong>{{refund_amount}}</strong> for order #{{order_id}} has been executed via {{payment_method}}.</p>
        <p style="font-size: 12px; color: #6C757D;">Reference: {{reference}}</p>
      </div>
    `,
  },
];

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>(INITIAL_EMAIL_TEMPLATES);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [editSubject, setEditSubject] = useState("");
  const [editBody, setEditBody] = useState("");

  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      const matchSearch =
        search.trim() === "" ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.subject.toLowerCase().includes(search.toLowerCase()) ||
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
  const orderCount = templates.filter((t) => t.category === "Orders").length;
  const financingCount = templates.filter((t) => t.category === "Financing").length;

  const handleToggleStatus = (id: string, current: boolean) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isActive: !current } : t))
    );
    toast.success(`Template ${!current ? "activated" : "paused"} successfully.`);
  };

  const handleOpenEdit = (t: EmailTemplate) => {
    setEditingTemplate(t);
    setEditSubject(t.subject);
    setEditBody(t.bodyHtml.trim());
  };

  const handleSaveEdit = () => {
    if (!editingTemplate) return;
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === editingTemplate.id
          ? { ...t, subject: editSubject, bodyHtml: editBody, lastUpdated: "Just now" }
          : t
      )
    );
    toast.success(`Updated template "${editingTemplate.name}".`);
    setEditingTemplate(null);
  };

  const handleInsertTag = (tag: string) => {
    setEditBody((prev) => `${prev} ${tag}`);
    toast.info(`Appended tag ${tag}`);
  };

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
          onClick={() => toast.success("Test email triggered to admin email.")}
        >
          Send Test Email
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard size="sm" title="Total Templates" value={templates.length} periodLabel="Configured event types" />
        <StatCard size="sm" title="Active" value={activeCount} periodLabel="Live in dispatch queue" />
        <StatCard size="sm" title="Order & Delivery" value={orderCount} periodLabel="Fulfillment touchpoints" />
        <StatCard size="sm" title="BNPL & Financing" value={financingCount} periodLabel="Payment installments" />
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-light-gray rounded-lg flex flex-col overflow-hidden">
        <div className="p-4 sm:px-6 flex flex-col gap-3 border-b border-light-gray">
          <div className="flex flex-col lg:flex-row gap-3 lg:items-center justify-between">
            <Search
              value={search}
              onChange={(val) => setSearch(val)}
              placeholder="Search template name, subject, or trigger key..."
              maxWidth="max-w-none"
              className="w-full lg:w-96"
            />

            <div className="flex flex-wrap items-center gap-3">
              <div className="w-44">
                <Dropdown
                  options={[
                    { value: "all", label: "All categories" },
                    { value: "Orders", label: "Orders & Delivery" },
                    { value: "Financing", label: "Financing & BNPL" },
                    { value: "Security", label: "Security & OTP" },
                    { value: "Marketing", label: "Marketing" },
                    { value: "Vendors", label: "Vendor Relations" },
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

        {/* Templates Table */}
        <div className="admin-table-container">
          <table>
            <thead>
              <tr>
                <th>Template Name</th>
                <th>Category</th>
                <th>Subject Line</th>
                <th>Dynamic Variables</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTemplates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-xs text-faint">
                    No email templates match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredTemplates.map((t) => (
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
                      <span className="text-xs text-subtle line-clamp-1 max-w-xs" title={t.subject}>
                        {t.subject}
                      </span>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {t.variables.slice(0, 3).map((v) => (
                          <span
                            key={v}
                            className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-brand-orange-soft text-brand-orange-text border border-brand-orange/20"
                          >
                            {v}
                          </span>
                        ))}
                        {t.variables.length > 3 && (
                          <span className="text-[10px] text-faint">+{t.variables.length - 3}</span>
                        )}
                      </div>
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <Modal
          isOpen={Boolean(previewTemplate)}
          onClose={() => setPreviewTemplate(null)}
          title={`Email Preview: ${previewTemplate.name}`}
          size="lg"
        >
          <ModalBody className="flex flex-col gap-4 py-4 max-h-[75vh] overflow-y-auto">
            <div className="p-4 bg-off-white rounded-lg border border-light-gray text-xs flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-faint w-16">From:</span>
                <span className="text-brand-charcoal font-medium">KoolBuy System &lt;no-reply@koolbuy.com&gt;</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-faint w-16">Subject:</span>
                <span className="text-brand-charcoal font-semibold">{previewTemplate.subject}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-faint w-16">Trigger:</span>
                <span className="font-mono text-brand-orange-text font-medium">{previewTemplate.key}</span>
              </div>
            </div>

            <div className="border border-light-gray rounded-lg p-6 bg-white shadow-sm">
              <div dangerouslySetInnerHTML={{ __html: previewTemplate.bodyHtml }} />
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
          title={`Edit Email Template: ${editingTemplate.name}`}
          size="lg"
        >
          <ModalBody className="flex flex-col gap-4 py-4 max-h-[75vh] overflow-y-auto">
            <div>
              <label className="block text-[12px] font-medium text-subtle mb-1.5">Subject line</label>
              <input
                type="text"
                value={editSubject}
                onChange={(e) => setEditSubject(e.target.value)}
                className="w-full h-9 px-3 text-xs font-normal text-brand-charcoal bg-white border border-light-gray rounded-lg placeholder:text-faint focus:outline-none focus:ring-1 focus:ring-brand-orange/30 focus:border-brand-orange transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[12px] font-medium text-subtle">
                  Available Merge Variables (click to insert)
                </label>
                <span className="text-[11px] text-faint">Tags resolve automatically at send-time</span>
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
              <label className="block text-[12px] font-medium text-subtle mb-1.5">Email HTML / Body Content</label>
              <textarea
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                rows={10}
                className="w-full text-xs font-mono p-3 bg-white border border-light-gray rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-orange/30 focus:border-brand-orange text-brand-charcoal leading-relaxed resize-y"
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
              Save Template Changes
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
}
