"use client";

import React, { useState } from "react";
import { Icon } from "@/app/components/Icon";
import { Button } from "@/app/components/Button";
import { TabFilter } from "@/app/components/Admin/TabFilter";
import { Pagination } from "@/app/components/Admin/Pagination";
import { RowsPerPage } from "@/app/components/rows-per-page";
import Checkbox from "@/app/components/Checkbox";
import { toast } from "sonner";
import { HiOutlineDocumentArrowDown } from "react-icons/hi2";

interface Vendor {
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

const vendorsData: Vendor[] = [
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
  {
    id: "#VND004",
    name: "Don Vic LTD",
    owner: "Victor Chinedu",
    email: "donvic@gmail.com",
    phone: "+234 804 567 8901",
    productsCount: 35,
    totalRevenue: "₦22,300,000",
    status: "Active",
    rating: 4.7,
    joinedDate: "12 Apr 2025",
  },
  {
    id: "#VND005",
    name: "Al-Barkah Chillers Hub",
    owner: "Aminu Bello",
    email: "albarkah@chillers.com",
    phone: "+234 805 678 1234",
    productsCount: 12,
    totalRevenue: "₦8,950,000",
    status: "Awaiting Approval",
    rating: 4.5,
    joinedDate: "18 May 2025",
  },
  {
    id: "#VND006",
    name: "MegaCool Appliances",
    owner: "Tunde Bakare",
    email: "support@megacool.ng",
    phone: "+234 806 789 2345",
    productsCount: 50,
    totalRevenue: "₦31,100,000",
    status: "Blocked",
    rating: 3.2,
    joinedDate: "02 Jan 2025",
  },
  {
    id: "#VND007",
    name: "Apex Commercial Solutions",
    owner: "Ngozi Eze",
    email: "info@apexcommercial.com",
    phone: "+234 807 890 3456",
    productsCount: 15,
    totalRevenue: "₦6,400,000",
    status: "Blocked",
    rating: 2.8,
    joinedDate: "11 Feb 2025",
  },
  {
    id: "#VND008",
    name: "Westline Refrigeration",
    owner: "Folake Johnson",
    email: "hello@westline.com",
    phone: "+234 808 901 4567",
    productsCount: 24,
    totalRevenue: "₦16,750,000",
    status: "Active",
    rating: 4.9,
    joinedDate: "28 Mar 2025",
  },
];

export default function VendorsPage() {
  const [activeTab, setActiveTab] = useState("Active");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const tabs = ["Active", "Awaiting Approval", "Blocked"];

  const filteredVendors = vendorsData.filter((v) => {
    const matchesTab = v.status === activeTab;
    const matchesSearch =
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredVendors.map((v) => v.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleExportPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Please allow popups to export PDF");
      return;
    }

    const title = `Vendors Report - ${activeTab} Vendors`;
    const tableRows = filteredVendors
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
          <td style="padding: 10px 14px; border-bottom: 1px solid #e5e7eb;">
            <span style="display:inline-block; padding:3px 10px; border-radius:6px; font-weight:700; font-size:11px; ${
              v.status === "Active"
                ? "background:#ecfdf5; color:#059669;"
                : v.status === "Awaiting Approval"
                  ? "background:#fffbeb; color:#d97706;"
                  : "background:#fef2f2; color:#dc2626;"
            }">${v.status}</span>
          </td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e5e7eb;">${v.joinedDate}</td>
        </tr>`,
      )
      .join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 32px; color: #111827; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #00BCD4; padding-bottom: 16px; margin-bottom: 24px; }
            h1 { font-size: 22px; font-weight: 800; color: #1D3557; margin: 0; }
            p { font-size: 12px; color: #6b7280; margin: 4px 0 0 0; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; text-align: left; }
            th { background-color: #f8fafc; padding: 10px 14px; font-weight: 700; border-bottom: 2px solid #e2e8f0; color: #475569; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; }
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
              <p>Generated on ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} • Total Records: ${filteredVendors.length}</p>
            </div>
            <div style="font-weight: 900; font-size: 18px; color: #00BCD4;">KOOLBUY</div>
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
      `Exporting ${filteredVendors.length} ${activeTab} vendor(s) to PDF...`,
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {/* <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            Vendors Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage verified suppliers, merchant accounts, and payouts.
          </p> */}
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            // shape="pill"
            onClick={handleExportPDF}
            iconLeft={
              <HiOutlineDocumentArrowDown
                size={18}
                className="text-brand-blue"
              />
            }
            className="border-gray-200 text-gray-800 shadow-2xs hover:bg-gray-50 px-4 py-2 text-xs sm:text-sm font-semibold"
          >
            Export PDF
          </Button>
          <Button
            variant="blue"
            size="md"
            // shape="pill"
            className="px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold shadow-sm shadow-brand-blue/20"
          >
            + Add New Vendor
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-2xs flex flex-col gap-1">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Total Vendors
          </span>
          <span className="text-2xl font-black text-gray-900">
            {vendorsData.length}
          </span>
          <span className="text-[11px] text-emerald-600 font-bold">
            +12% this month
          </span>
        </div>
        <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-2xs flex flex-col gap-1">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Active Vendors
          </span>
          <span className="text-2xl font-black text-gray-900">
            {vendorsData.filter((v) => v.status === "Active").length}
          </span>
          <span className="text-[11px] text-emerald-600 font-bold">
            Fully verified
          </span>
        </div>
        <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-2xs flex flex-col gap-1">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Awaiting Approval
          </span>
          <span className="text-2xl font-black text-amber-600">
            {vendorsData.filter((v) => v.status === "Awaiting Approval").length}
          </span>
          <span className="text-[11px] text-amber-600 font-bold">
            Needs review
          </span>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-gray-100 rounded-lg shadow-2xs flex flex-col overflow-hidden">
        {/* Filter and Search Bar */}
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Custom 3-Tab Toggle Filter */}
          <TabFilter
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search vendor name, owner, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-9 pr-3 rounded-xl bg-gray-50 border border-gray-200 text-xs focus:outline-none focus:border-brand-blue focus:bg-white transition-all"
            />
            <Icon
              name="search"
              size="xs"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>

        {/* Vendors Table */}
        <div className="admin-table-container">
          <table>
            <thead>
              <tr>
                <th className="w-10">
                  <Checkbox
                    checked={
                      selectedItems.length === filteredVendors.length &&
                      filteredVendors.length > 0
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
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendors.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-12 text-gray-400 text-xs"
                  >
                    No {activeTab.toLowerCase()} vendors found matching your
                    filter.
                  </td>
                </tr>
              ) : (
                filteredVendors.map((vendor) => {
                  const isChecked = selectedItems.includes(vendor.id);
                  return (
                    <tr
                      key={vendor.id}
                      className={isChecked ? "bg-blue-50/30" : ""}
                    >
                      <td>
                        <Checkbox
                          checked={isChecked}
                          onChange={() => handleSelectItem(vendor.id)}
                        />
                      </td>
                      <td className="font-bold text-gray-900">
                        <div className="text-xs">{vendor.name}</div>
                        <div className="text-[10px] text-gray-400 font-normal">
                          {vendor.id}
                        </div>
                      </td>
                      <td className="text-xs text-gray-700 font-medium">
                        {vendor.owner}
                      </td>
                      <td className="text-xs text-gray-500">
                        <div>{vendor.email}</div>
                        <div className="text-[10px] text-gray-400">
                          {vendor.phone}
                        </div>
                      </td>
                      <td className="text-xs font-semibold text-gray-800">
                        {vendor.productsCount}
                      </td>
                      <td className="text-xs font-bold text-emerald-600">
                        {vendor.totalRevenue}
                      </td>
                      <td>
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
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
                      <td className="text-right">
                        <button
                          type="button"
                          className="text-gray-400 hover:text-gray-900 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                          aria-label="Actions"
                        >
                          <Icon name="more_vert" size="sm" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer with RowsPerPage & Pagination */}
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <RowsPerPage value={rowsPerPage} onChange={setRowsPerPage} />
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredVendors.length / rowsPerPage) || 1}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
