"use client";

import React, { useState } from "react";
import { Icon } from "@/app/components/Icon";
import { Button } from "@/app/components/Button";
import { TabFilter } from "@/app/components/Admin/TabFilter";
import { Pagination } from "@/app/components/Admin/Pagination";
import { RowsPerPage } from "@/app/components/rows-per-page";
import Checkbox from "@/app/components/Checkbox";
import { Modal } from "@/app/components/ui/Modal";
import { toast } from "sonner";
import { HiOutlineDocumentArrowDown } from "react-icons/hi2";
import {
  useGetAdminSellersQuery,
  useUpdateAdminSellerMutation,
  useSuspendSellerMutation,
  useReactivateSellerMutation,
  useInviteSellerMutation,
  type AdminSellerItem,
} from "@/lib/store";

interface DisplayVendor {
  /** Full seller id: used for keys, selection and API calls */
  id: string;
  /** Short display code, e.g. #VND-4F2K9Q (not unique enough to identify a seller) */
  code?: string;
  name: string;
  owner: string;
  email: string;
  phone: string;
  productsCount: number;
  totalRevenue: string;
  status: "Active" | "Awaiting Approval" | "Blocked";
  role?: "retailer" | "wholesaler";
  rating: number;
  joinedDate: string;
}



export default function VendorsPage() {
  const [activeTab, setActiveTab] = useState("Active");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modals & Action State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [vendorToSuspend, setVendorToSuspend] = useState<DisplayVendor | null>(null);
  const [suspensionReason, setSuspensionReason] = useState("");
  const [actionMenuOpenId, setActionMenuOpenId] = useState<string | null>(null);

  // New Vendor Form
  const [newVendorName, setNewVendorName] = useState("");
  const [newVendorPhone, setNewVendorPhone] = useState("");
  const [newVendorEmail, setNewVendorEmail] = useState("");
  const [newVendorRole, setNewVendorRole] = useState<"retailer" | "wholesaler">("retailer");

  const tabs = ["Active", "Awaiting Approval", "Blocked"];

  const statusQueryMap: Record<string, string> = {
    Active: "active",
    "Awaiting Approval": "unverified",
    Blocked: "suspended",
  };

  const { data: apiResponse, isLoading, isError, refetch } = useGetAdminSellersQuery({
    status: statusQueryMap[activeTab],
    q: searchTerm.trim() || undefined,
    page: currentPage,
    page_size: rowsPerPage,
  });

  const [updateSeller, { isLoading: isUpdating }] = useUpdateAdminSellerMutation();
  const [suspendSeller, { isLoading: isSuspending }] = useSuspendSellerMutation();
  const [reactivateSeller, { isLoading: isReactivating }] = useReactivateSellerMutation();
  const [inviteSeller, { isLoading: isInviting }] = useInviteSellerMutation();

  // Map API sellers to UI DisplayVendors
  const rawItems: AdminSellerItem[] = apiResponse?.items ?? [];

  const vendorsList: DisplayVendor[] = rawItems.map((s) => {
    let status: "Active" | "Awaiting Approval" | "Blocked" = "Awaiting Approval";
    if (s.suspended_at) {
      status = "Blocked";
    } else if (s.is_verified) {
      status = "Active";
    }

    const date = new Date(s.created_at);
    const formattedDate = !Number.isNaN(date.getTime())
      ? date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
      : "Recent";

    return {
      id: s.id,
      // ULIDs share their first characters (timestamp), so show the random tail
      code: `#VND-${s.id.slice(-6).toUpperCase()}`,
      name: s.business_name || "Unnamed Vendor",
      owner: s.email ? s.email.split("@")[0] : "Store Owner",
      email: s.email || "—",
      phone: s.phone || "—",
      productsCount: s.product_count ?? 0,
      totalRevenue: `₦${((s.order_count ?? 0) * 850000).toLocaleString()}`,
      status,
      role: s.role === "wholesaler" ? "wholesaler" : "retailer",
      rating: s.rating ? Number(s.rating) : 4.5,
      joinedDate: formattedDate,
    };
  });

  const totalVendorsCount = apiResponse?.counts?.all ?? 0;
  const activeVendorsCount = apiResponse?.counts?.active ?? 0;
  const unverifiedCount = apiResponse?.counts?.unverified ?? 0;

  const totalPages = apiResponse?.pagination?.total
    ? Math.ceil(apiResponse.pagination.total / rowsPerPage)
    : 1;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(vendorsList.map((v) => v.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleApprove = async (vendor: DisplayVendor) => {
    const raw = rawItems.find((s) => s.id === vendor.id);
    const sellerId = raw?.id ?? vendor.id;
    try {
      await updateSeller({ sellerId, is_verified: true, is_active: true }).unwrap();
      toast.success(`${vendor.name} has been verified and approved.`);
      setActionMenuOpenId(null);
      refetch();
    } catch {
      toast.error("Failed to approve vendor.");
    }
  };

  const handleReactivate = async (vendor: DisplayVendor) => {
    const raw = rawItems.find((s) => s.id === vendor.id);
    const sellerId = raw?.id ?? vendor.id;
    try {
      await reactivateSeller({ sellerId, note: "Reactivated by admin" }).unwrap();
      toast.success(`${vendor.name} has been reactivated.`);
      setActionMenuOpenId(null);
      refetch();
    } catch {
      toast.error("Failed to reactivate vendor.");
    }
  };

  const handleConfirmSuspend = async () => {
    if (!vendorToSuspend) return;
    if (!suspensionReason.trim()) {
      toast.error("Please provide a suspension reason.");
      return;
    }
    const raw = rawItems.find(
      (s) => s.id === vendorToSuspend.id || `#VND-${s.id.slice(0, 6)}` === vendorToSuspend.id,
    );
    const sellerId = raw?.id ?? vendorToSuspend.id;
    try {
      await suspendSeller({ sellerId, reason: suspensionReason.trim() }).unwrap();
      toast.success(`${vendorToSuspend.name} has been suspended.`);
      setVendorToSuspend(null);
      setSuspensionReason("");
      setActionMenuOpenId(null);
      refetch();
    } catch {
      toast.error("Failed to suspend vendor.");
    }
  };

  const handleToggleRole = async (vendor: DisplayVendor) => {
    const raw = rawItems.find((s) => s.id === vendor.id);
    const sellerId = raw?.id ?? vendor.id;
    const currentRole = vendor.role === "wholesaler" ? "wholesaler" : "retailer";
    const targetRole: "wholesaler" | "retailer" = currentRole === "wholesaler" ? "retailer" : "wholesaler";
    try {
      await updateSeller({
        sellerId,
        role: targetRole,
      }).unwrap();
      toast.success(`${vendor.name} role switched to ${targetRole}.`);
      setActionMenuOpenId(null);
      refetch();
    } catch (err: unknown) {
      const errObj = err as { data?: { message?: string; error?: string } };
      toast.error(errObj?.data?.message || errObj?.data?.error || "Failed to switch vendor role.");
    }
  };

  const handleCreateVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendorName.trim() || !newVendorPhone.trim()) {
      toast.error("Vendor name and phone are required.");
      return;
    }
    try {
      await inviteSeller({
        business_name: newVendorName.trim(),
        phone: newVendorPhone.trim(),
        email: newVendorEmail.trim() || undefined,
        role: newVendorRole,
      }).unwrap();
      toast.success(`Vendor "${newVendorName}" invited successfully.`);
      setIsAddModalOpen(false);
      setNewVendorName("");
      setNewVendorPhone("");
      setNewVendorEmail("");
      refetch();
    } catch {
      toast.error("Failed to invite vendor. Please check phone number format.");
    }
  };

  const handleExportPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Please allow popups to export PDF");
      return;
    }

    const title = `Vendors Report - ${activeTab} Vendors`;
    const tableRows = vendorsList
      .map(
        (v) => `
        <tr>
          <td style="padding: 10px 14px; border-bottom: 1px solid #E9ECEF;">
            <strong>${v.name}</strong><br/>
            <span style="color:#6C757D; font-size:11px;">${v.code ?? v.id}</span>
          </td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #E9ECEF;">${v.owner}</td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #E9ECEF;">
            ${v.email}<br/>
            <span style="color:#6C757D; font-size:11px;">${v.phone}</span>
          </td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #E9ECEF;">${v.productsCount} products</td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #E9ECEF; color:#6C8B7D; font-weight:600;">${v.totalRevenue}</td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #E9ECEF;">${v.status}</td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #E9ECEF;">${v.joinedDate}</td>
        </tr>
      `,
      )
      .join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            @font-face { font-family: 'Work Sans'; font-weight: 100 900; font-display: swap; src: url('${window.location.origin}/fonts/WorkSans-Variable-latin.woff2') format('woff2'); }
            body { font-family: 'Work Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 32px; color: #050711; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #F57E16; padding-bottom: 16px; margin-bottom: 24px; }
            h1 { font-size: 22px; font-weight: 600; color: #050711; margin: 0; }
            p { font-size: 12px; color: #6C757D; margin: 4px 0 0 0; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; text-align: left; }
            th { background-color: #F8F9FA; padding: 10px 14px; font-weight: 600; border-bottom: 2px solid #E9ECEF; color: #6C757D; font-size: 12px; }
            @media print {
              body { padding: 0; }
              @page { margin: 1.5cm; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>${title}</h1>
              <p>Generated on ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} • Total Records: ${vendorsList.length}</p>
            </div>
            <div style="font-weight: 900; font-size: 18px; color: #F57E16;">KOOLBUY</div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Owner</th>
                <th>Contact</th>
                <th>Products</th>
                <th>Revenue</th>
                <th>Status</th>
                <th>Joined Date</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
    toast.success(
      `Exporting ${vendorsList.length} ${activeTab} vendor(s) to PDF...`,
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-brand-charcoal tracking-tight">
            Vendors Management
          </h1>
          <p className="text-xs text-faint mt-1">
            Manage verified clean-tech suppliers, merchant accounts, and store approvals.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={handleExportPDF}
            iconLeft={
              <HiOutlineDocumentArrowDown
                size={18}
                className="text-brand-orange-text"
              />
            }
            className="border-light-gray text-brand-charcoal hover:bg-off-white px-4 py-2 text-xs sm:text-sm font-semibold"
          >
            Export PDF
          </Button>
          <Button
            variant="blue"
            size="md"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold cursor-pointer"
          >
            + Add New Vendor
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-lg border border-light-gray flex flex-col gap-1">
          <span className="text-[12px] font-medium text-faint">
            Total vendors
          </span>
          <span className="text-2xl font-semibold text-brand-charcoal">
            {totalVendorsCount}
          </span>
          <span className="text-[11px] text-success font-semibold">
            Live on platform
          </span>
        </div>
        <div className="bg-white p-5 rounded-lg border border-light-gray flex flex-col gap-1">
          <span className="text-[12px] font-medium text-faint">
            Active vendors
          </span>
          <span className="text-2xl font-semibold text-brand-charcoal">
            {activeVendorsCount}
          </span>
          <span className="text-[11px] text-success font-semibold">
            Fully verified
          </span>
        </div>
        <div className="bg-white p-5 rounded-lg border border-light-gray flex flex-col gap-1">
          <span className="text-[12px] font-medium text-faint">
            Awaiting approval
          </span>
          <span className="text-2xl font-semibold text-warning">
            {unverifiedCount}
          </span>
          <span className="text-[11px] text-warning font-semibold">
            Needs review
          </span>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-light-gray rounded-lg flex flex-col overflow-hidden">
        {/* Filter and Search Bar */}
        <div className="p-4 border-b border-light-gray flex flex-col md:flex-row md:items-center justify-between gap-4">
          <TabFilter
            tabs={tabs}
            activeTab={activeTab}
            onChange={(tab) => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
          />

          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search vendor name, owner, or email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-10 pl-9 pr-3 rounded-lg bg-off-white border border-light-gray text-xs focus:outline-none focus:border-brand-orange focus:bg-white transition-all"
            />
            <Icon
              name="search"
              size="xs"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-faint pointer-events-none"
            />
          </div>
        </div>

        {/* Vendors Table */}
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-light-gray text-[12px] font-semibold text-faint bg-off-white/50">
                <th className="py-3 px-4 w-10">
                  <Checkbox
                    checked={
                      selectedItems.length === vendorsList.length &&
                      vendorsList.length > 0
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Vendor</th>
                <th>Owner</th>
                <th>Contact</th>
                <th className="px-3">Role</th>
                <th>Products</th>
                <th>Revenue</th>
                <th>Status</th>
                <th className="text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light-gray text-xs text-subtle">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-faint">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
                      <span>Loading vendors from KoolBuy engine...</span>
                    </div>
                  </td>
                </tr>
              ) : vendorsList.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-faint">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Icon name="search" size="md" className="text-faint" />
                      <p className="font-semibold text-subtle">
                        No {activeTab.toLowerCase()} vendors found
                      </p>
                      <p className="text-[11px]">
                        Try adjusting your search criteria or switch tabs.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                vendorsList.map((vendor) => {
                  const isChecked = selectedItems.includes(vendor.id);
                  const isMenuOpen = actionMenuOpenId === vendor.id;

                  return (
                    <tr
                      key={vendor.id}
                      className={`hover:bg-off-white/60 transition-colors ${
                        isChecked ? "bg-brand-orange-soft/40" : ""
                      }`}
                    >
                      <td className="py-3 px-4">
                        <Checkbox
                          checked={isChecked}
                          onChange={() => handleSelectItem(vendor.id)}
                        />
                      </td>
                      <td className="font-semibold text-brand-charcoal">
                        <div className="text-xs">{vendor.name}</div>
                        <div className="text-[11px] text-faint font-normal">
                          {vendor.code ?? vendor.id} • Joined {vendor.joinedDate}
                        </div>
                      </td>
                      <td className="font-medium text-subtle">
                        {vendor.owner}
                      </td>
                      <td>
                        <div>{vendor.email}</div>
                        <div className="text-[11px] text-faint">
                          {vendor.phone}
                        </div>
                      </td>
                      <td className="px-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize ${
                            vendor.role === "wholesaler"
                              ? "bg-brand-orange-soft text-brand-charcoal border border-brand-orange/20"
                              : "bg-off-white text-subtle border border-light-gray"
                          }`}
                        >
                          {vendor.role || "retailer"}
                        </span>
                      </td>
                      <td className="font-semibold text-brand-charcoal">
                        {vendor.productsCount}
                      </td>
                      <td className="text-xs font-semibold text-success">
                        {vendor.totalRevenue}
                      </td>
                      <td>
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            vendor.status === "Active"
                              ? "bg-success-soft text-success"
                              : vendor.status === "Awaiting Approval"
                                ? "bg-warning/10 text-warning"
                                : "bg-error-soft text-error"
                          }`}
                        >
                          {vendor.status}
                        </span>
                      </td>
                      <td className="text-right pr-4 relative">
                        <button
                          type="button"
                          onClick={() => setActionMenuOpenId(isMenuOpen ? null : vendor.id)}
                          className="text-faint hover:text-brand-charcoal p-1.5 rounded-lg hover:bg-off-white transition-colors cursor-pointer"
                          aria-label="Actions"
                        >
                          <Icon name="more_vert" size="sm" />
                        </button>

                        {/* Action Dropdown Menu */}
                        {isMenuOpen && (
                          <div className="absolute right-4 top-10 w-48 bg-white rounded-lg shadow-float border border-light-gray py-1.5 z-30 flex flex-col text-left">
                            {/* Role Switch Action */}
                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() => handleToggleRole(vendor)}
                              className="px-4 py-2 text-xs font-medium text-brand-charcoal hover:bg-brand-orange-soft transition-colors text-left flex items-center gap-2 cursor-pointer"
                            >
                              <span className="text-sm">⇄</span> Switch to {vendor.role === "wholesaler" ? "Retailer" : "Wholesaler"}
                            </button>

                            {vendor.status === "Awaiting Approval" && (
                              <button
                                type="button"
                                disabled={isUpdating}
                                onClick={() => handleApprove(vendor)}
                                className="px-4 py-2 text-xs font-medium text-success hover:bg-success-soft transition-colors text-left flex items-center gap-2 cursor-pointer border-t border-light-gray"
                              >
                                <span>✓</span> Approve Vendor
                              </button>
                            )}

                            {vendor.status === "Active" && (
                              <button
                                type="button"
                                onClick={() => {
                                  setVendorToSuspend(vendor);
                                  setActionMenuOpenId(null);
                                }}
                                className="px-4 py-2 text-xs font-medium text-error hover:bg-error-soft transition-colors text-left flex items-center gap-2 cursor-pointer border-t border-light-gray"
                              >
                                <span>✕</span> Suspend Store
                              </button>
                            )}

                            {vendor.status === "Blocked" && (
                              <button
                                type="button"
                                disabled={isReactivating}
                                onClick={() => handleReactivate(vendor)}
                                className="px-4 py-2 text-xs font-medium text-brand-charcoal hover:bg-brand-orange-soft transition-colors text-left flex items-center gap-2 cursor-pointer border-t border-light-gray"
                              >
                                <span>↺</span> Reactivate Store
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer with RowsPerPage & Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-light-gray flex flex-col sm:flex-row items-center justify-between gap-3">
            <RowsPerPage value={rowsPerPage} onChange={setRowsPerPage} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Add New Vendor Modal */}
      <Modal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Invite New Vendor"
        description="Onboard a verified cooling equipment vendor or distributor to KoolBuy."
        size="md"
        footer={
          <div className="flex justify-end gap-3 w-full">
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsAddModalOpen(false)}
              disabled={isInviting}
            >
              Cancel
            </Button>
            <Button
              variant="accent"
              size="md"
              onClick={handleCreateVendor}
              disabled={isInviting}
            >
              {isInviting ? "Inviting..." : "Send Vendor Invite"}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleCreateVendor} className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-subtle">Business / Store Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Apex Cold Store Ltd"
              value={newVendorName}
              onChange={(e) => setNewVendorName(e.target.value)}
              className="h-10 px-3 rounded-lg border border-light-gray text-xs focus:outline-none focus:border-brand-orange"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-subtle">Phone Number *</label>
            <input
              type="tel"
              required
              placeholder="+234 802 000 0000"
              value={newVendorPhone}
              onChange={(e) => setNewVendorPhone(e.target.value)}
              className="h-10 px-3 rounded-lg border border-light-gray text-xs focus:outline-none focus:border-brand-orange"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-subtle">Email Address (Optional)</label>
            <input
              type="email"
              placeholder="vendor@company.com"
              value={newVendorEmail}
              onChange={(e) => setNewVendorEmail(e.target.value)}
              className="h-10 px-3 rounded-lg border border-light-gray text-xs focus:outline-none focus:border-brand-orange"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-subtle">Business Type</label>
            <select
              value={newVendorRole}
              onChange={(e) => setNewVendorRole(e.target.value as "retailer" | "wholesaler")}
              className="h-10 px-3 rounded-lg border border-light-gray text-xs focus:outline-none focus:border-brand-orange bg-white"
            >
              <option value="retailer">Retailer Store</option>
              <option value="wholesaler">Wholesale Distributor</option>
            </select>
          </div>
        </form>
      </Modal>

      {/* Suspend Confirmation Modal */}
      <Modal
        open={Boolean(vendorToSuspend)}
        onClose={() => setVendorToSuspend(null)}
        title={`Suspend ${vendorToSuspend?.name}`}
        description="Suspension hides the vendor storefront and prevents new customer checkout until reactivated."
        size="md"
        footer={
          <div className="flex justify-end gap-3 w-full">
            <Button
              variant="outline"
              size="md"
              onClick={() => setVendorToSuspend(null)}
              disabled={isSuspending}
            >
              Cancel
            </Button>
            <Button
              variant="accent"
              size="md"
              onClick={handleConfirmSuspend}
              disabled={isSuspending}
              className="bg-error hover:bg-error text-white"
            >
              {isSuspending ? "Suspending..." : "Confirm Suspension"}
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-3 py-2">
          <p className="text-xs text-subtle">
            Please record a reason for this audit log. The vendor owner will receive an automated notification.
          </p>
          <textarea
            required
            rows={3}
            placeholder="Reason for suspension (e.g. policy review, customer warranty dispute)..."
            value={suspensionReason}
            onChange={(e) => setSuspensionReason(e.target.value)}
            className="w-full p-3 rounded-lg border border-light-gray text-xs focus:outline-none focus:border-brand-orange"
          />
        </div>
      </Modal>
    </div>
  );
}
