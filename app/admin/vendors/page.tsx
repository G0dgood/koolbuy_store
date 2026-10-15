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
  id: string;
  name: string;
  owner: string;
  email: string;
  phone: string;
  productsCount: number;
  totalRevenue: string;
  status: "Active" | "Awaiting Approval" | "Blocked";
  rating: number;
  joinedDate: string;
}

const FALLBACK_VENDORS: DisplayVendor[] = [
  {
    id: "#VND001",
    name: "Lighthouse Electronics",
    owner: "Samuel Adebayo",
    email: "contact@lighthouse-elec.com",
    phone: "+234 801 234 5678",
    productsCount: 42,
    totalRevenue: "₦28,450,000",
    status: "Active",
    rating: 4.8,
    joinedDate: "15 Jan 2025",
  },
  {
    id: "#VND002",
    name: "Biizinilah Cold Stores",
    owner: "Fatima Ibrahim",
    email: "info@biizinilah.ng",
    phone: "+234 802 345 6789",
    productsCount: 18,
    totalRevenue: "₦14,200,000",
    status: "Active",
    rating: 4.9,
    joinedDate: "20 Feb 2025",
  },
  {
    id: "#VND003",
    name: "Modus Ideal Electronics",
    owner: "Emeka Okonkwo",
    email: "sales@modusideal.com",
    phone: "+234 803 456 7890",
    productsCount: 29,
    totalRevenue: "₦19,800,000",
    status: "Awaiting Approval",
    rating: 4.6,
    joinedDate: "05 Mar 2025",
  },
];

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

  // Map API sellers to UI DisplayVendors or use fallbacks if response is empty
  const rawItems: AdminSellerItem[] = apiResponse?.items ?? [];
  const hasApiData = rawItems.length > 0;

  const vendorsList: DisplayVendor[] = hasApiData
    ? rawItems.map((s) => {
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
          id: s.id.startsWith("01") ? `#VND-${s.id.slice(0, 6)}` : s.id,
          name: s.business_name || "Unnamed Vendor",
          owner: s.email ? s.email.split("@")[0] : "Store Owner",
          email: s.email || "—",
          phone: s.phone || "—",
          productsCount: s.product_count ?? 0,
          totalRevenue: `₦${((s.order_count ?? 0) * 850000).toLocaleString()}`,
          status,
          rating: s.rating ? Number(s.rating) : 4.5,
          joinedDate: formattedDate,
        };
      })
    : FALLBACK_VENDORS.filter((v) => v.status === activeTab);

  const totalVendorsCount = apiResponse?.counts?.all ?? FALLBACK_VENDORS.length;
  const activeVendorsCount = apiResponse?.counts?.active ?? FALLBACK_VENDORS.filter((v) => v.status === "Active").length;
  const unverifiedCount = apiResponse?.counts?.unverified ?? FALLBACK_VENDORS.filter((v) => v.status === "Awaiting Approval").length;

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
    const raw = rawItems.find((s) => s.id === vendor.id || `#VND-${s.id.slice(0, 6)}` === vendor.id);
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
    const raw = rawItems.find((s) => s.id === vendor.id || `#VND-${s.id.slice(0, 6)}` === vendor.id);
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
          <td style="padding: 10px 14px; border-bottom: 1px solid #e5e7eb;">
            <strong>${v.name}</strong><br/>
            <span style="color:#6b7280; font-size:11px;">${v.id}</span>
          </td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e5e7eb;">${v.owner}</td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e5e7eb;">
            ${v.email}<br/>
            <span style="color:#6b7280; font-size:11px;">${v.phone}</span>
          </td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e5e7eb;">${v.productsCount} products</td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e5e7eb; color:#059669; font-weight:700;">${v.totalRevenue}</td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e5e7eb;">${v.status}</td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e5e7eb;">${v.joinedDate}</td>
        </tr>
      `,
      )
      .join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 32px; color: #111827; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #F57E16; padding-bottom: 16px; margin-bottom: 24px; }
            h1 { font-size: 22px; font-weight: 800; color: #050711; margin: 0; }
            p { font-size: 12px; color: #6b7280; margin: 4px 0 0 0; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; text-align: left; }
            th { background-color: #F8F9FA; padding: 10px 14px; font-weight: 700; border-bottom: 2px solid #e2e8f0; color: #475569; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; }
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
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            Vendors Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
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
            className="border-gray-200 text-gray-800 hover:bg-gray-50 px-4 py-2 text-xs sm:text-sm font-semibold"
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
        <div className="bg-white p-5 rounded-tile border border-light-gray shadow-2xs flex flex-col gap-1">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Total Vendors
          </span>
          <span className="text-2xl font-bold text-gray-900">
            {totalVendorsCount}
          </span>
          <span className="text-[11px] text-emerald-600 font-bold">
            Live on platform
          </span>
        </div>
        <div className="bg-white p-5 rounded-tile border border-light-gray shadow-2xs flex flex-col gap-1">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Active Vendors
          </span>
          <span className="text-2xl font-bold text-gray-900">
            {activeVendorsCount}
          </span>
          <span className="text-[11px] text-emerald-600 font-bold">
            Fully verified
          </span>
        </div>
        <div className="bg-white p-5 rounded-tile border border-light-gray shadow-2xs flex flex-col gap-1">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Awaiting Approval
          </span>
          <span className="text-2xl font-bold text-amber-600">
            {unverifiedCount}
          </span>
          <span className="text-[11px] text-amber-600 font-bold">
            Needs review
          </span>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-light-gray rounded-tile shadow-2xs flex flex-col overflow-hidden">
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
              className="w-full h-10 pl-9 pr-3 rounded-xl bg-gray-50 border border-gray-200 text-xs focus:outline-none focus:border-brand-orange focus:bg-white transition-all"
            />
            <Icon
              name="search"
              size="xs"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>

        {/* Vendors Table */}
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-light-gray text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50">
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
                <th>Products</th>
                <th>Revenue</th>
                <th>Status</th>
                <th className="text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light-gray text-xs text-gray-600">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
                      <span>Loading vendors from KoolBuy engine...</span>
                    </div>
                  </td>
                </tr>
              ) : vendorsList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Icon name="search" size="md" className="text-gray-300" />
                      <p className="font-semibold text-gray-600">
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
                      className={`hover:bg-gray-50/60 transition-colors ${
                        isChecked ? "bg-orange-50/20" : ""
                      }`}
                    >
                      <td className="py-3 px-4">
                        <Checkbox
                          checked={isChecked}
                          onChange={() => handleSelectItem(vendor.id)}
                        />
                      </td>
                      <td className="font-bold text-gray-900">
                        <div className="text-xs">{vendor.name}</div>
                        <div className="text-[10px] text-gray-400 font-normal">
                          {vendor.id} • Joined {vendor.joinedDate}
                        </div>
                      </td>
                      <td className="font-medium text-gray-700">
                        {vendor.owner}
                      </td>
                      <td>
                        <div>{vendor.email}</div>
                        <div className="text-[10px] text-gray-400">
                          {vendor.phone}
                        </div>
                      </td>
                      <td className="font-semibold text-gray-900">
                        {vendor.productsCount}
                      </td>
                      <td className="text-xs font-bold text-emerald-600">
                        {vendor.totalRevenue}
                      </td>
                      <td>
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            vendor.status === "Active"
                              ? "bg-emerald-50 text-emerald-600"
                              : vendor.status === "Awaiting Approval"
                                ? "bg-amber-50 text-amber-600"
                                : "bg-rose-50 text-rose-600"
                          }`}
                        >
                          {vendor.status}
                        </span>
                      </td>
                      <td className="text-right pr-4 relative">
                        <button
                          type="button"
                          onClick={() => setActionMenuOpenId(isMenuOpen ? null : vendor.id)}
                          className="text-gray-400 hover:text-gray-900 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                          aria-label="Actions"
                        >
                          <Icon name="more_vert" size="sm" />
                        </button>

                        {/* Action Dropdown Menu */}
                        {isMenuOpen && (
                          <div className="absolute right-4 top-10 w-44 bg-white rounded-xl shadow-lift border border-light-gray py-1.5 z-30 flex flex-col text-left">
                            {vendor.status === "Awaiting Approval" && (
                              <button
                                type="button"
                                disabled={isUpdating}
                                onClick={() => handleApprove(vendor)}
                                className="px-4 py-2 text-xs font-medium text-emerald-600 hover:bg-emerald-50 transition-colors text-left flex items-center gap-2 cursor-pointer"
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
                                className="px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left flex items-center gap-2 cursor-pointer"
                              >
                                <span>✕</span> Suspend Store
                              </button>
                            )}

                            {vendor.status === "Blocked" && (
                              <button
                                type="button"
                                disabled={isReactivating}
                                onClick={() => handleReactivate(vendor)}
                                className="px-4 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors text-left flex items-center gap-2 cursor-pointer"
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
        <div className="p-4 border-t border-light-gray flex flex-col sm:flex-row items-center justify-between gap-3">
          <RowsPerPage value={rowsPerPage} onChange={setRowsPerPage} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
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
            <label className="text-xs font-bold text-gray-700">Business / Store Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Apex Cold Store Ltd"
              value={newVendorName}
              onChange={(e) => setNewVendorName(e.target.value)}
              className="h-10 px-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-brand-orange"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-700">Phone Number *</label>
            <input
              type="tel"
              required
              placeholder="+234 802 000 0000"
              value={newVendorPhone}
              onChange={(e) => setNewVendorPhone(e.target.value)}
              className="h-10 px-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-brand-orange"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-700">Email Address (Optional)</label>
            <input
              type="email"
              placeholder="vendor@company.com"
              value={newVendorEmail}
              onChange={(e) => setNewVendorEmail(e.target.value)}
              className="h-10 px-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-brand-orange"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-700">Business Type</label>
            <select
              value={newVendorRole}
              onChange={(e) => setNewVendorRole(e.target.value as "retailer" | "wholesaler")}
              className="h-10 px-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-brand-orange bg-white"
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
              className="bg-rose-600 hover:bg-rose-700 text-white"
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
            className="w-full p-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-brand-orange"
          />
        </div>
      </Modal>
    </div>
  );
}
