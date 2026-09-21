"use client";

import React, { useState } from "react";
import { Icon } from "../../components/Icon";
import { Button } from "../../components/Button";
import { Input } from "../../components/Form/Inputs";
import {
  HiOutlineBell,
  HiOutlineCheck,
  HiOutlineClipboardDocument,
  HiOutlineMagnifyingGlass,
  HiOutlineSparkles,
} from "react-icons/hi2";

interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  enabled: boolean;
}

const initialNotifications: NotificationTemplate[] = [
  {
    id: "new_order",
    name: "New Order",
    subject: "New Order Placed Successfully",
    content:
      "Dear {customer_name}, your order #{order_id} has been placed successfully. Total amount: {amount}. Track your order status in your dashboard.",
    enabled: true,
  },
  {
    id: "order_status_update",
    name: "Order Status Update",
    subject: "Order Status Update - #{order_id}",
    content:
      "Hello {customer_name}, your order #{order_id} status has been updated to: {status}. Visit {website} for tracking details.",
    enabled: true,
  },
  {
    id: "refund_status_update",
    name: "Refund Status Update",
    subject: "Refund Status Update - Order #{order_id}",
    content:
      "Dear {customer_name}, your refund request for order #{order_id} ({amount}) has been processed. Funds will reflect in your account according to your bank's schedule.",
    enabled: true,
  },
  {
    id: "new_order_received_owner",
    name: "New Order Received (Owner)",
    subject: "New Order Received - Order #{order_id}",
    content:
      "Attention {vendor_name}, you have received a new customer order #{order_id} for {amount}. Please confirm availability and prepare for dispatch.",
    enabled: true,
  },
  {
    id: "order_accepted_customer",
    name: "Order Accepted (Customer)",
    subject: "Your Order Has Been Accepted",
    content:
      "Great news {customer_name}! Vendor {vendor_name} has accepted your order #{order_id} and packaging has commenced.",
    enabled: true,
  },
  {
    id: "order_rejected_customer",
    name: "Order Rejected (Customer)",
    subject: "Order #{order_id} Could Not Be Accepted",
    content:
      "Dear {customer_name}, unfortunately vendor {vendor_name} was unable to fulfill order #{order_id}. A full refund of {amount} has been initiated.",
    enabled: true,
  },
  {
    id: "order_processing_customer",
    name: "Order Processing (Customer)",
    subject: "Your Equipment is Being Prepared",
    content:
      "Hello {customer_name}, order #{order_id} is currently being tested, inspected, and packaged for transit at the regional hub.",
    enabled: true,
  },
  {
    id: "out_of_delivery_customer",
    name: "Out of delivery (Customer)",
    subject: "Your Order is Out for Delivery!",
    content:
      "Hello {customer_name}, order #{order_id} is out for delivery with our courier driver to {delivery_address}. Please be available to receive it.",
    enabled: true,
  },
  {
    id: "order_delivered_customer",
    name: "Order Delivered (Customer)",
    subject: "Order Delivered Successfully",
    content:
      "Your order #{order_id} has been delivered to {delivery_address}. Thank you for choosing Koolbuy clean refrigeration! Please leave a review.",
    enabled: true,
  },
  {
    id: "place_order_reminder_customer",
    name: "Place Order Reminder (Customer)",
    subject: "Complete Your Order - Items Waiting in Your Cart",
    content:
      "Hi {customer_name}, you left cooling equipment in your cart! Complete your purchase now on {website} to lock in today's promotional rate.",
    enabled: true,
  },
  {
    id: "place_bid_request_customer",
    name: "Place Bid Request (Customer)",
    subject: "Commercial Quotation Request Received",
    content:
      "Dear {customer_name}, we have received your custom pricing bid request for {description}. Our commercial sales desk will respond within 24 hours.",
    enabled: true,
  },
  {
    id: "order_modified_customer",
    name: "Order Modified (Customer)",
    subject: "Modifications Applied to Order #{order_id}",
    content:
      "Hello {customer_name}, your order #{order_id} has been modified as requested. Check your updated invoice details in your user dashboard.",
    enabled: true,
  },
  {
    id: "order_delayed_customer",
    name: "Order Delayed (Customer)",
    subject: "Delivery Schedule Notice - Order #{order_id}",
    content:
      "Dear {customer_name}, your delivery for order #{order_id} is experiencing a slight logistics delay. Our driver is en route. Contact {phone_no} for assistance.",
    enabled: true,
  },
  {
    id: "pickup_delivery_reminder",
    name: "Pickup Delivery Reminder",
    subject: "Reminder: Your Equipment is Ready for Pickup",
    content:
      "Hello {customer_name}, order #{order_id} is ready for collection at {address}. Please bring your government ID and pickup verification code.",
    enabled: true,
  },
  {
    id: "reached_vendor_location",
    name: "Reached Vendor Location",
    subject: "Logistics Driver Reached Vendor Facility",
    content:
      "Courier driver has arrived at {vendor_name} location for equipment collection of order #{order_id}.",
    enabled: true,
  },
  {
    id: "out_of_takeaway_delivery_customer",
    name: "Out of takeaway-delivery (Customer)",
    subject: "Takeaway Order Dispatched to Hub",
    content:
      "Hello {customer_name}, your takeaway package for order #{order_id} is in transit to your selected local collection center.",
    enabled: true,
  },
  {
    id: "order_cancelled",
    name: "Order Cancelled",
    subject: "Order Cancellation Notice",
    content:
      "Order #{order_id} has been cancelled. Any pre-authorized charges have been released. Contact {phone_no} for questions.",
    enabled: true,
  },
  {
    id: "product_out_of_stock_vendor",
    name: "Product Out Of Stock (Vendor)",
    subject: "Inventory Notice: Product Out of Stock",
    content:
      "Attention {vendor_name}, your product listing {title} has run out of stock. Please update your inventory quantity on the vendor portal.",
    enabled: true,
  },
  {
    id: "order_cancelled_vendor",
    name: "Order Cancelled (Vendor)",
    subject: "Order Cancelled by Buyer - #{order_id}",
    content:
      "Vendor alert: Order #{order_id} has been cancelled by the customer. Please return the item to stock and do not dispatch.",
    enabled: true,
  },
  {
    id: "bnpl_approved_customer",
    name: "BNPL Approved (Customer)",
    subject: "Congratulations! Your BNPL Installment Plan is Approved",
    content:
      "Great news {customer_name}! Your Buy Now Pay Later installment application for order #{order_id} has been approved. Pay your initial deposit on {website} to release equipment delivery.",
    enabled: true,
  },
  {
    id: "bnpl_rejected_customer",
    name: "BNPL Rejected (Customer)",
    subject: "BNPL Financing Application Decision",
    content:
      "Dear {customer_name}, we are unable to approve your BNPL financing application for order #{order_id} at this time. You may complete your purchase using full direct payment.",
    enabled: true,
  },
];

const availableTags = [
  "{customer_name}",
  "{vendor_name}",
  "{order_id}",
  "{amount}",
  "{status}",
  "{title}",
  "{description}",
  "{delivery_address}",
  "{phone_no}",
  "{website}",
];

export default function NotificationsManagementPage() {
  const [notifications, setNotifications] =
    useState<NotificationTemplate[]>(initialNotifications);
  const [selectedId, setSelectedId] = useState<string>(
    initialNotifications[0].id,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedTag, setCopiedTag] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const currentNotification =
    notifications.find((n) => n.id === selectedId) || notifications[0];

  const filteredList = notifications.filter((n) =>
    n.name.toLowerCase().includes(searchQuery.toLowerCase().trim()),
  );

  const handleUpdateCurrent = (updates: Partial<NotificationTemplate>) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === currentNotification.id ? { ...n, ...updates } : n,
      ),
    );
  };

  const handleCopyTag = (tag: string) => {
    navigator.clipboard.writeText(tag);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 2000);
  };

  const handleInsertTag = (tag: string) => {
    handleUpdateCurrent({
      content: currentNotification.content + " " + tag,
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
            Notifications Configuration
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Configure system push and transactional notifications across orders,
            delivery, vendor alerts, and BNPL workflows
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
            <span>Save Notification</span>
          </Button>
        </div>
      </div>

      {/* Save Success Banner */}
      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg flex items-center justify-between text-xs font-semibold animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <HiOutlineSparkles className="w-4 h-4 text-emerald-600" />
            <span>
              Notification <strong>{currentNotification.name}</strong> saved
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
        {/* Card 1: List (Notification Name) */}
        <div className="lg:col-span-4 bg-white rounded-lg border border-gray-100 shadow-2xs overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex flex-col gap-3 bg-gray-50/50">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#1D3557] uppercase tracking-wider">
                List
              </h2>
              <span className="text-xs font-medium text-gray-400">
                {notifications.length} Notifications
              </span>
            </div>

            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Notification Name
            </span>

            {/* Search Box */}
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search notification name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-[#00BCD4]"
              />
              <HiOutlineMagnifyingGlass className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* List Items */}
          <div className="flex flex-col divide-y divide-gray-50 max-h-[640px] overflow-y-auto">
            {filteredList.map((item) => {
              const isSelected = item.id === currentNotification.id;
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
                    <HiOutlineBell
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

        {/* Card 2: Subjects (Notification Editor) */}
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
                  {currentNotification.name}
                </strong>
              </span>
            </div>

            {/* Enabled Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={currentNotification.enabled}
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
                value={currentNotification.subject}
                onChange={(e) =>
                  handleUpdateCurrent({ subject: e.target.value })
                }
                placeholder="Enter notification subject / title..."
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
                  Plain text & dynamic tags supported
                </span>
              </div>
              <textarea
                rows={10}
                value={currentNotification.content}
                onChange={(e) =>
                  handleUpdateCurrent({ content: e.target.value })
                }
                placeholder="Write notification message content..."
                className="w-full text-xs font-mono p-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#00BCD4] text-gray-800 leading-relaxed"
              />
            </div>

            {/* Enabled Checkbox & Tags Section */}
            <div className="flex flex-col gap-3 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="notif-enabled-checkbox"
                  checked={currentNotification.enabled}
                  onChange={(e) =>
                    handleUpdateCurrent({ enabled: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-[#00BCD4] focus:ring-[#00BCD4] accent-[#00BCD4] cursor-pointer"
                />
                <label
                  htmlFor="notif-enabled-checkbox"
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
