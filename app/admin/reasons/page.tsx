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
  HiOutlineQuestionMarkCircle,
  HiOutlinePlus,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineCheck,
} from "react-icons/hi2";

export type ReasonCategory =
  | "cancellation"
  | "refund"
  | "return"
  | "vendor_decline"
  | "delivery_delay";

export type ActorRole = "customer" | "vendor" | "driver" | "admin";

export interface SystemReason {
  id: string;
  code: string;
  category: ReasonCategory;
  label: string;
  actor: ActorRole;
  usageCount: number;
  isActive: boolean;
}

const INITIAL_REASONS: SystemReason[] = [
  // Cancellation
  {
    id: "r-1",
    code: "buyer_changed_mind",
    category: "cancellation",
    label: "Customer changed mind / no longer needs product",
    actor: "customer",
    usageCount: 148,
    isActive: true,
  },
  {
    id: "r-2",
    code: "duplicate_order",
    category: "cancellation",
    label: "Accidental duplicate order placed",
    actor: "customer",
    usageCount: 62,
    isActive: true,
  },
  {
    id: "r-3",
    code: "delivery_too_slow",
    category: "cancellation",
    label: "Estimated delivery time is too long",
    actor: "customer",
    usageCount: 45,
    isActive: true,
  },
  {
    id: "r-4",
    code: "payment_fraud_check",
    category: "cancellation",
    label: "Flagged by risk and fraud prevention desk",
    actor: "admin",
    usageCount: 12,
    isActive: true,
  },

  // Refund & Return
  {
    id: "r-5",
    code: "defective_compressor",
    category: "return",
    label: "Defective compressor / cooling unit not chilling",
    actor: "customer",
    usageCount: 23,
    isActive: true,
  },
  {
    id: "r-6",
    code: "damaged_in_transit",
    category: "return",
    label: "Appliance damaged or dented during shipping",
    actor: "customer",
    usageCount: 19,
    isActive: true,
  },
  {
    id: "r-7",
    code: "wrong_model_delivered",
    category: "return",
    label: "Incorrect model or liters capacity dispatched",
    actor: "customer",
    usageCount: 11,
    isActive: true,
  },
  {
    id: "r-8",
    code: "customer_overpayment",
    category: "refund",
    label: "Reconciliation adjustment / overpayment refund",
    actor: "admin",
    usageCount: 34,
    isActive: true,
  },

  // Vendor Decline
  {
    id: "r-9",
    code: "vendor_out_of_stock",
    category: "vendor_decline",
    label: "Inventory warehouse out of stock",
    actor: "vendor",
    usageCount: 29,
    isActive: true,
  },
  {
    id: "r-10",
    code: "vendor_address_unreachable",
    category: "vendor_decline",
    label: "Customer delivery location beyond merchant coverage",
    actor: "vendor",
    usageCount: 16,
    isActive: true,
  },
  {
    id: "r-11",
    code: "pricing_discrepancy",
    category: "vendor_decline",
    label: "Wholesale manufacturer price adjustment required",
    actor: "vendor",
    usageCount: 7,
    isActive: true,
  },

  // Delivery Delay
  {
    id: "r-12",
    code: "driver_traffic_interstate",
    category: "delivery_delay",
    label: "Severe road or interstate transit delay",
    actor: "driver",
    usageCount: 41,
    isActive: true,
  },
  {
    id: "r-13",
    code: "recipient_unavailable",
    category: "delivery_delay",
    label: "Recipient unreachable or not present at drop-off address",
    actor: "driver",
    usageCount: 53,
    isActive: true,
  },
];

const CATEGORY_LABELS: Record<ReasonCategory, string> = {
  cancellation: "Order Cancellation",
  refund: "Refund Request",
  return: "Return Request",
  vendor_decline: "Vendor Decline",
  delivery_delay: "Delivery Delay",
};

const ACTOR_LABELS: Record<ActorRole, string> = {
  customer: "Buyer / Customer",
  vendor: "Merchant / Vendor",
  driver: "Delivery Courier",
  admin: "Support / Admin",
};

export default function ReasonsManagementPage() {
  const [reasons, setReasons] = useState<SystemReason[]>(INITIAL_REASONS);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedActor, setSelectedActor] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [editingReason, setEditingReason] = useState<SystemReason | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form states
  const [formCategory, setFormCategory] = useState<ReasonCategory>("cancellation");
  const [formActor, setFormActor] = useState<ActorRole>("customer");
  const [formLabel, setFormLabel] = useState("");
  const [formCode, setFormCode] = useState("");

  const filteredReasons = useMemo(() => {
    return reasons.filter((r) => {
      const matchSearch =
        search.trim() === "" ||
        r.label.toLowerCase().includes(search.toLowerCase()) ||
        r.code.toLowerCase().includes(search.toLowerCase());

      const matchCategory = selectedCategory === "all" || r.category === selectedCategory;
      const matchActor = selectedActor === "all" || r.actor === selectedActor;
      const matchStatus =
        selectedStatus === "all" ||
        (selectedStatus === "active" && r.isActive) ||
        (selectedStatus === "inactive" && !r.isActive);

      return matchSearch && matchCategory && matchActor && matchStatus;
    });
  }, [reasons, search, selectedCategory, selectedActor, selectedStatus]);

  const activeCount = reasons.filter((r) => r.isActive).length;
  const cancellationCount = reasons.filter((r) => r.category === "cancellation").length;
  const returnRefundCount = reasons.filter((r) => r.category === "return" || r.category === "refund").length;
  const vendorDeclineCount = reasons.filter((r) => r.category === "vendor_decline").length;

  const handleToggleStatus = (id: string, current: boolean) => {
    setReasons((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive: !current } : r))
    );
    toast.success(`Reason ${!current ? "activated" : "deactivated"}.`);
  };

  const handleDelete = (id: string) => {
    setReasons((prev) => prev.filter((r) => r.id !== id));
    toast.success("Reason deleted.");
  };

  const handleOpenAdd = () => {
    setFormCategory("cancellation");
    setFormActor("customer");
    setFormLabel("");
    setFormCode("");
    setIsAddOpen(true);
  };

  const handleOpenEdit = (r: SystemReason) => {
    setEditingReason(r);
    setFormCategory(r.category);
    setFormActor(r.actor);
    setFormLabel(r.label);
    setFormCode(r.code);
  };

  const handleSaveAdd = () => {
    if (!formLabel.trim()) {
      toast.error("Please enter reason display text.");
      return;
    }
    const code = formCode.trim() || formLabel.toLowerCase().replace(/[^a-z0-9]+/g, "_").slice(0, 32);
    const newReason: SystemReason = {
      id: `reason-${Date.now()}`,
      code,
      category: formCategory,
      label: formLabel.trim(),
      actor: formActor,
      usageCount: 0,
      isActive: true,
    };
    setReasons((prev) => [newReason, ...prev]);
    toast.success("New reason added successfully.");
    setIsAddOpen(false);
  };

  const handleSaveEdit = () => {
    if (!editingReason || !formLabel.trim()) return;
    setReasons((prev) =>
      prev.map((r) =>
        r.id === editingReason.id
          ? {
              ...r,
              category: formCategory,
              actor: formActor,
              label: formLabel.trim(),
              code: formCode.trim() || r.code,
            }
          : r
      )
    );
    toast.success("Reason updated successfully.");
    setEditingReason(null);
  };

  return (
    <div className="flex flex-col gap-6 pb-16">
      {/* Action Bar */}
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" size="sm" href="/admin/refunds">
          Refunds
        </Button>
        <Button variant="outline" size="sm" href="/admin/orders">
          Orders
        </Button>
        <Button
          variant="primary"
          size="sm"
          iconLeft={<HiOutlinePlus className="w-4 h-4" />}
          onClick={handleOpenAdd}
        >
          Add Reason
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard size="sm" title="Total Reasons" value={reasons.length} periodLabel="System standard options" />
        <StatCard size="sm" title="Active" value={activeCount} periodLabel="Available in user dialogs" />
        <StatCard size="sm" title="Cancellations" value={cancellationCount} periodLabel="Order abort reasons" />
        <StatCard size="sm" title="Returns & Refunds" value={returnRefundCount} periodLabel="Quality & dispute criteria" />
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-light-gray rounded-lg flex flex-col overflow-hidden">
        <div className="p-4 sm:px-6 flex flex-col gap-3 border-b border-light-gray">
          <div className="flex flex-col lg:flex-row gap-3 lg:items-center justify-between">
            <Search
              value={search}
              onChange={(val) => setSearch(val)}
              placeholder="Search reason text or identifier code..."
              maxWidth="max-w-none"
              className="w-full lg:w-96"
            />

            <div className="flex flex-wrap items-center gap-3">
              <div className="w-48">
                <Dropdown
                  options={[
                    { value: "all", label: "All categories" },
                    { value: "cancellation", label: "Order Cancellation" },
                    { value: "return", label: "Return Request" },
                    { value: "refund", label: "Refund Request" },
                    { value: "vendor_decline", label: "Vendor Decline" },
                    { value: "delivery_delay", label: "Delivery Delay" },
                  ]}
                  value={selectedCategory}
                  onChange={(val) => setSelectedCategory(String(val ?? "all"))}
                  placeholder="Category"
                  searchable={false}
                  size="sm"
                />
              </div>

              <div className="w-40">
                <Dropdown
                  options={[
                    { value: "all", label: "All actors" },
                    { value: "customer", label: "Buyer / Customer" },
                    { value: "vendor", label: "Merchant / Vendor" },
                    { value: "driver", label: "Delivery Courier" },
                    { value: "admin", label: "Support / Admin" },
                  ]}
                  value={selectedActor}
                  onChange={(val) => setSelectedActor(String(val ?? "all"))}
                  placeholder="Actor"
                  searchable={false}
                  size="sm"
                />
              </div>

              <div className="w-36">
                <Dropdown
                  options={[
                    { value: "all", label: "All statuses" },
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Disabled" },
                  ]}
                  value={selectedStatus}
                  onChange={(val) => setSelectedStatus(String(val ?? "all"))}
                  placeholder="Status"
                  searchable={false}
                  size="sm"
                />
              </div>

              {(search || selectedCategory !== "all" || selectedActor !== "all" || selectedStatus !== "all") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("all");
                    setSelectedActor("all");
                    setSelectedStatus("all");
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Reasons Table */}
        <div className="admin-table-container">
          <table>
            <thead>
              <tr>
                <th>Reason Label</th>
                <th>Category</th>
                <th>Code Key</th>
                <th>Applies To</th>
                <th>Usage Count</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReasons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-xs text-faint">
                    No reasons match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredReasons.map((r) => (
                  <tr key={r.id} className="hover:bg-off-white/60 transition-colors">
                    <td>
                      <span className="text-xs font-semibold text-brand-charcoal">{r.label}</span>
                    </td>
                    <td>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-off-white text-subtle border border-light-gray">
                        {CATEGORY_LABELS[r.category]}
                      </span>
                    </td>
                    <td>
                      <span className="text-[11px] font-mono text-faint">{r.code}</span>
                    </td>
                    <td>
                      <span className="text-xs text-subtle">{ACTOR_LABELS[r.actor]}</span>
                    </td>
                    <td>
                      <span className="text-xs font-medium text-brand-charcoal">
                        {r.usageCount.toLocaleString()} times
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(r.id, r.isActive)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold cursor-pointer transition-colors ${
                          r.isActive ? "bg-success-soft text-success" : "bg-off-white text-faint border border-light-gray"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${r.isActive ? "bg-success" : "bg-faint"}`} />
                        {r.isActive ? "Active" : "Disabled"}
                      </button>
                    </td>
                    <td className="text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          iconLeft={<HiOutlinePencilSquare className="w-3.5 h-3.5" />}
                          onClick={() => handleOpenEdit(r)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-error hover:bg-error-soft hover:text-error"
                          title="Delete reason"
                          onClick={() => handleDelete(r.id)}
                          iconLeft={<HiOutlineTrash className="w-4 h-4" />}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {(isAddOpen || editingReason) && (
        <Modal
          isOpen={isAddOpen || Boolean(editingReason)}
          onClose={() => {
            setIsAddOpen(false);
            setEditingReason(null);
          }}
          title={isAddOpen ? "Add New System Reason" : `Edit Reason: ${editingReason?.label}`}
          size="md"
        >
          <ModalBody className="flex flex-col gap-4 py-4">
            <div>
              <label className="block text-[12px] font-medium text-subtle mb-1">Reason Label (Visible to user)</label>
              <input
                type="text"
                value={formLabel}
                onChange={(e) => setFormLabel(e.target.value)}
                placeholder="e.g. Defective compressor / cooling unit not chilling"
                className="w-full text-xs font-semibold px-3 py-2 bg-white border border-light-gray rounded-lg focus:outline-none focus:border-brand-orange"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-medium text-subtle mb-1">Category</label>
                <Dropdown
                  options={[
                    { value: "cancellation", label: "Order Cancellation" },
                    { value: "return", label: "Return Request" },
                    { value: "refund", label: "Refund Request" },
                    { value: "vendor_decline", label: "Vendor Decline" },
                    { value: "delivery_delay", label: "Delivery Delay" },
                  ]}
                  value={formCategory}
                  onChange={(val) => setFormCategory(val as ReasonCategory)}
                  searchable={false}
                  size="sm"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-subtle mb-1">Applies To (Actor)</label>
                <Dropdown
                  options={[
                    { value: "customer", label: "Buyer / Customer" },
                    { value: "vendor", label: "Merchant / Vendor" },
                    { value: "driver", label: "Delivery Courier" },
                    { value: "admin", label: "Support / Admin" },
                  ]}
                  value={formActor}
                  onChange={(val) => setFormActor(val as ActorRole)}
                  searchable={false}
                  size="sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-subtle mb-1">Unique Identifier Code</label>
              <input
                type="text"
                value={formCode}
                onChange={(e) => setFormCode(e.target.value.toLowerCase().replace(/[^a-z0-9_]+/g, ""))}
                placeholder="e.g. defective_compressor (auto-generated if empty)"
                className="w-full text-xs font-mono px-3 py-2 bg-white border border-light-gray rounded-lg focus:outline-none focus:border-brand-orange text-subtle"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsAddOpen(false);
                setEditingReason(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              iconLeft={<HiOutlineCheck className="w-4 h-4" />}
              onClick={isAddOpen ? handleSaveAdd : handleSaveEdit}
            >
              {isAddOpen ? "Add Reason" : "Save Changes"}
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
}
