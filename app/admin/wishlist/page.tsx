"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Icon } from "../../components/Icon";
import { Button } from "@/app/components/Button";
import { TabFilter } from "../../components/Admin/TabFilter";
import { Pagination } from "../../components/Admin/Pagination";
import { RowsPerPage } from "@/app/components/rows-per-page";
import Checkbox from "@/app/components/Checkbox";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";

interface WishlistEntry {
  id: number;
  image: string;
  productName: string;
  sku: string;
  price: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  userAvatar: string;
  dateAdded: string;
  stockStatus: "In Stock" | "Low Stock" | "Out of Stock";
}

const initialWishlistData: WishlistEntry[] = [
  {
    id: 1,
    image: "/images/koolboks/items/5.webp",
    productName: "Kool - Scanfrost 600L Inverter Chest Freezer",
    sku: "KB-SF-600",
    price: "₦1,406,000",
    userName: "Tunde Babalola",
    userEmail: "tunde.babalola@gmail.com",
    userPhone: "+234 803 456 7890",
    userAvatar:
      "https://ui-avatars.com/api/?name=Tunde+Babalola&background=2196F3&color=fff",
    dateAdded: "12-01-2025",
    stockStatus: "In Stock",
  },
  {
    id: 2,
    image: "/images/koolboks/items/4.webp",
    productName: "Kool Bruhm 100ah Solar Pedestal Freezer",
    sku: "KB-BR-100",
    price: "₦1,662,370",
    userName: "Chioma Okonkwo",
    userEmail: "chioma.okonkwo@yahoo.com",
    userPhone: "+234 802 345 6789",
    userAvatar:
      "https://ui-avatars.com/api/?name=Chioma+Okonkwo&background=E91E63&color=fff",
    dateAdded: "10-01-2025",
    stockStatus: "Low Stock",
  },
  {
    id: 3,
    image: "/images/koolboks/items/1.webp",
    productName: "KoolScanfrost 200L Chest Freezer CF200",
    sku: "KB-SF-200",
    price: "₦780,000",
    userName: "Ibrahim Musa",
    userEmail: "ibrahim.musa@gmail.com",
    userPhone: "+234 814 567 8901",
    userAvatar:
      "https://ui-avatars.com/api/?name=Ibrahim+Musa&background=4CAF50&color=fff",
    dateAdded: "15-01-2025",
    stockStatus: "In Stock",
  },
  {
    id: 4,
    image: "/images/koolboks/items/2.webp",
    productName: "Double Door Chest Freezer 400L",
    sku: "KB-DD-400",
    price: "₦1,120,000",
    userName: "Amaka Johnson",
    userEmail: "amaka.johnson@outlook.com",
    userPhone: "+234 705 678 1234",
    userAvatar:
      "https://ui-avatars.com/api/?name=Amaka+Johnson&background=9C27B0&color=fff",
    dateAdded: "08-01-2025",
    stockStatus: "Out of Stock",
  },
  {
    id: 5,
    image: "/images/koolboks/items/3.webp",
    productName: "Commercial Solar Deep Freezer 500L",
    sku: "KB-CS-500",
    price: "₦2,350,000",
    userName: "David Adeleke",
    userEmail: "david.adeleke@gmail.com",
    userPhone: "+234 809 123 4567",
    userAvatar:
      "https://ui-avatars.com/api/?name=David+Adeleke&background=FF9800&color=fff",
    dateAdded: "18-01-2025",
    stockStatus: "In Stock",
  },
  {
    id: 6,
    image: "/images/koolboks/items/6.webp",
    productName: "230L Hisense Deep Chest Freezer",
    sku: "KB-HS-230",
    price: "₦430,000",
    userName: "Zainab Bello",
    userEmail: "zainab.bello@gmail.com",
    userPhone: "+234 818 234 5678",
    userAvatar:
      "https://ui-avatars.com/api/?name=Zainab+Bello&background=00BCD4&color=fff",
    dateAdded: "20-01-2025",
    stockStatus: "In Stock",
  },
  {
    id: 7,
    image: "/images/koolboks/items/5.webp",
    productName: "Kool - Scanfrost 600L Inverter Chest Freezer",
    sku: "KB-SF-600",
    price: "₦1,406,000",
    userName: "Emeka Obi",
    userEmail: "emeka.obi@koolboks.com",
    userPhone: "+234 803 987 6543",
    userAvatar:
      "https://ui-avatars.com/api/?name=Emeka+Obi&background=3F51B5&color=fff",
    dateAdded: "21-01-2025",
    stockStatus: "In Stock",
  },
  {
    id: 8,
    image: "/images/koolboks/items/4.webp",
    productName: "Kool Thermocool 100ah Solar Inverter Freezer",
    sku: "KB-TC-100",
    price: "₦1,662,370",
    userName: "Folake Adebayo",
    userEmail: "folake.adebayo@yahoo.com",
    userPhone: "+234 701 234 9876",
    userAvatar:
      "https://ui-avatars.com/api/?name=Folake+Adebayo&background=E91E63&color=fff",
    dateAdded: "22-01-2025",
    stockStatus: "Low Stock",
  },
];

export default function AdminWishlistPage() {
  const [wishlistData, setWishlistData] =
    useState<WishlistEntry[]>(initialWishlistData);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [itemToDelete, setItemToDelete] = useState<WishlistEntry | null>(null);

  const tabs = ["All", "In Stock", "Low Stock", "Out of Stock"];

  const filteredData = useMemo(() => {
    return wishlistData.filter((item) => {
      const matchesTab = activeTab === "All" || item.stockStatus === activeTab;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.productName.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.userName.toLowerCase().includes(q) ||
        item.userEmail.toLowerCase().includes(q) ||
        item.userPhone.toLowerCase().includes(q);
      return matchesTab && matchesSearch;
    });
  }, [wishlistData, activeTab, searchQuery]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(paginatedData.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleDeleteItem = () => {
    if (itemToDelete) {
      setWishlistData((prev) =>
        prev.filter((item) => item.id !== itemToDelete.id),
      );
      setSelectedItems((prev) => prev.filter((id) => id !== itemToDelete.id));
      setItemToDelete(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {/* <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Wishlist Products
          </h1>
          <p className="text-sm text-gray-500">
            Monitor customer demand and track wishlisted items across your
            store.
          </p> */}
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/products">
            <Button
              variant="outline"
              className="border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              View All Products
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-gray-100 rounded-lg shadow-2xs overflow-hidden flex flex-col">
        {/* Filter Bar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <TabFilter
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search product, customer, email, phone..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-10 pl-9 pr-3 rounded-xl bg-gray-50 border border-gray-200 text-xs focus:outline-none focus:border-brand-blue focus:bg-white transition-all"
            />
            <Icon
              name="search"
              size="xs"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="admin-table-container">
          <table>
            <thead>
              <tr>
                <th className="w-10">
                  <Checkbox
                    checked={
                      selectedItems.length === paginatedData.length &&
                      paginatedData.length > 0
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Image</th>
                <th>Product Name</th>
                <th>User Name</th>
                <th>User Email</th>
                <th>User Phone</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-12 text-gray-400 text-sm"
                  >
                    No wishlist items found matching your search.
                  </td>
                </tr>
              ) : (
                paginatedData.map((item) => {
                  const isChecked = selectedItems.includes(item.id);
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-gray-50/60 transition-colors ${
                        isChecked ? "bg-blue-50/30" : ""
                      }`}
                    >
                      <td>
                        <Checkbox
                          checked={isChecked}
                          onChange={() => handleSelectItem(item.id)}
                        />
                      </td>
                      <td>
                        <div className="w-12 h-12 rounded-xl border border-gray-100 bg-white p-1 overflow-hidden shrink-0 flex items-center justify-center shadow-2xs">
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-col min-w-50">
                          <span className="font-semibold text-gray-900 text-xs leading-tight">
                            {item.productName}
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[11px] font-medium text-gray-400">
                              {item.sku}
                            </span>
                            <span className="text-[11px] font-bold text-brand-blue">
                              {item.price}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2.5 min-w-37.5">
                          <img
                            src={item.userAvatar}
                            alt={item.userName}
                            className="w-7 h-7 rounded-full object-cover shrink-0 border border-gray-100"
                          />
                          <span className="text-xs font-semibold text-gray-800">
                            {item.userName}
                          </span>
                        </div>
                      </td>
                      <td className="text-xs font-medium text-gray-600 whitespace-nowrap">
                        <a
                          href={`mailto:${item.userEmail}`}
                          className="text-gray-700 hover:text-brand-blue transition-colors"
                        >
                          {item.userEmail}
                        </a>
                      </td>
                      <td className="text-xs font-medium text-gray-600 whitespace-nowrap">
                        <a
                          href={`tel:${item.userPhone}`}
                          className="text-gray-700 hover:text-brand-blue transition-colors font-mono"
                        >
                          {item.userPhone}
                        </a>
                      </td>
                      <td className="text-right">
                        <div className="flex justify-end items-center gap-2">
                          <Button
                            variant="outline"
                            shape="rounded-sm"
                            className="p-1.5! text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
                            onClick={() => setItemToDelete(item)}
                            title="Remove from wishlist"
                          >
                            <Icon
                              name="Delete"
                              folder="dashboardIcon"
                              size="sm"
                            />
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

        {/* Footer with pagination */}
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <RowsPerPage value={rowsPerPage} onChange={setRowsPerPage} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDeleteItem}
        title="Remove Wishlist Item"
        message={`Are you sure you want to remove "${itemToDelete?.productName}" wishlisted by ${itemToDelete?.userName}?`}
        confirmText="Yes, remove"
        type="danger"
      />
    </div>
  );
}
